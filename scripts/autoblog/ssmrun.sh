#!/bin/bash
# Run a local script on an EC2 box through a plain SSM shell session, for IAM users that have
# ssm:StartSession but not ssm:SendCommand. Prints only the script's output.
# Usage: [TARGET=i-...] [REGION=...] bash ssmrun.sh <script> [wait_seconds] [ubuntu|root]
#   wait_seconds: how long to keep the session open after sending (default 20)
#   ubuntu (default) runs it as ubuntu with a login shell; root runs it with sudo bash
set -u
SCRIPT=${1:?usage: ssmrun.sh <script> [wait_seconds] [ubuntu|root]}; WAIT=${2:-20}; AS=${3:-ubuntu}
TARGET=${TARGET:-i-01f33b2e7b669d803}   # everest-intercity
REGION=${REGION:-ap-south-1}
TAG=r$RANDOM$RANDOM
B64=$(base64 < "$SCRIPT" | tr -d '\n')
{
  sleep 3   # let the remote prompt come up before typing
  printf 'rm -f /tmp/%s.b64\n' "$TAG"
  # The pty is canonical (~4096-byte lines): type the payload in 3000-char chunks.
  # fold leaves the last chunk without a newline, hence `|| [ -n "$chunk" ]`.
  echo -n "$B64" | fold -w 3000 | while read -r chunk || [ -n "$chunk" ]; do printf "printf '%%s' '%s' >> /tmp/%s.b64\n" "$chunk" "$TAG"; done
  if [ "$AS" = root ]; then
    printf 'base64 -d /tmp/%s.b64 > /tmp/%s.sh; sudo bash /tmp/%s.sh 2>&1; echo __END_%s__; rm -f /tmp/%s.*\n' "$TAG" "$TAG" "$TAG" "$TAG" "$TAG"
  else
    # session user is ssm-user, which cannot cd into /home/ubuntu
    printf 'base64 -d /tmp/%s.b64 > /tmp/%s.sh; chmod 644 /tmp/%s.sh; sudo -u ubuntu -i bash /tmp/%s.sh 2>&1; echo __END_%s__; rm -f /tmp/%s.*\n' "$TAG" "$TAG" "$TAG" "$TAG" "$TAG" "$TAG"
  fi
  sleep "$WAIT"
  printf 'exit\n'
# Output cleanup: drop CRs, strip OSC sequences (the session sends OSC 3008; macOS sed has no
# \x1b escape, so this uses perl), print only the lines between the decode command and the sentinel.
} | perl -e "alarm $((WAIT+60)); exec @ARGV" aws ssm start-session --region "$REGION" --target "$TARGET" 2>&1 \
  | tr -d '\r' | perl -pe 's/\e\][0-9]+;[^\e\a]*(?:\e\\|\a)//g' \
  | awk -v tag="__END_${TAG}__" 'index($0,"base64 -d /tmp/") {on=1; next} on && index($0,tag) {exit} on {print}'
