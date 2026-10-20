#!/bin/bash
# Run a local script on the everest-intercity EC2 through a plain SSM shell session (the IAM user
# has no ssm:SendCommand). Usage: ssmrun.sh <script> [wait_seconds] [as_user=ubuntu|root]
set -u
SCRIPT=$1; WAIT=${2:-20}; AS=${3:-ubuntu}
TARGET=i-01f33b2e7b669d803; REGION=ap-south-1
TAG=r$RANDOM$RANDOM
B64=$(base64 < "$SCRIPT" | tr -d '\n')
{
  sleep 3
  printf 'rm -f /tmp/%s.b64\n' "$TAG"
  echo -n "$B64" | fold -w 3000 | while read -r chunk || [ -n "$chunk" ]; do printf "printf '%%s' '%s' >> /tmp/%s.b64\n" "$chunk" "$TAG"; done
  if [ "$AS" = root ]; then
    printf 'base64 -d /tmp/%s.b64 > /tmp/%s.sh; sudo bash /tmp/%s.sh 2>&1; echo __END_%s__; rm -f /tmp/%s.*\n' "$TAG" "$TAG" "$TAG" "$TAG" "$TAG"
  else
    printf 'base64 -d /tmp/%s.b64 > /tmp/%s.sh; chmod 644 /tmp/%s.sh; sudo -u ubuntu -i bash /tmp/%s.sh 2>&1; echo __END_%s__; rm -f /tmp/%s.*\n' "$TAG" "$TAG" "$TAG" "$TAG" "$TAG" "$TAG"
  fi
  sleep "$WAIT"
  printf 'exit\n'
} | perl -e "alarm $((WAIT+60)); exec @ARGV" aws ssm start-session --region $REGION --target $TARGET 2>&1 \
  | tr -d '\r' | sed -E 's/\x1b\][0-9]+;[^\x1b\\]*(\x1b\\|\\)//g' \
  | awk -v tag="__END_${TAG}__" 'index($0,"base64 -d /tmp/") {on=1; next} on && index($0,tag) {exit} on {print}'
