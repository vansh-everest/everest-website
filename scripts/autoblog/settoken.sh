#!/bin/bash
# Puts a GitHub token on the EC2 without it appearing in a chat or a terminal history.
# Copy the token on GitHub, then: pbpaste | scripts/autoblog/settoken.sh
set -euo pipefail
cd "$(dirname "$0")"
REPO=${GITHUB_REPO:-EverestFleetOrg/everestfleet-website}
TOKEN=$(tr -d '[:space:]')
if [[ ! $TOKEN =~ ^(github_pat_|ghp_)[A-Za-z0-9_]+$ ]]; then
  echo "The clipboard does not hold a GitHub token (github_pat_... or ghp_...)." >&2
  exit 1
fi
STATUS=$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $TOKEN" \
  "https://api.github.com/repos/$REPO/contents/src/content/auto-posts.json")
if [ "$STATUS" != 200 ]; then
  echo "GitHub refused the token for $REPO (HTTP $STATUS). Check the repository and Contents permission, or org approval." >&2
  exit 1
fi
echo "Token reads $REPO. Saving it on the EC2..."
SCRIPT=$(umask 077 && mktemp)
trap 'rm -f "$SCRIPT"' EXIT
cat > "$SCRIPT" <<EOF
cd ~/everest-autoblog
grep -v '^GITHUB_TOKEN=' .env > .env.new 2>/dev/null || true
echo 'GITHUB_TOKEN=$TOKEN' >> .env.new
mv .env.new .env && chmod 600 .env
echo "keys on the server: \$(cut -d= -f1 .env | tr '\n' ' ')"
EOF
bash ./ssmrun.sh "$SCRIPT" 8
