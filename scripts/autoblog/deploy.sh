#!/bin/bash
# Copies the job to the EC2 over SSM (the IAM user has start-session only) and installs the
# crontab line. Keys in the server's .env are left alone. Usage: scripts/autoblog/deploy.sh
set -euo pipefail
cd "$(dirname "$0")"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
PAYLOAD=$(COPYFILE_DISABLE=1 tar --no-xattrs -czf - autoblog.mjs run.sh README.md .env.example | base64 | tr -d '\n')
cat > "$TMP/install.sh" <<INSTALL
set -e
mkdir -p ~/everest-autoblog/logs
cd ~/everest-autoblog
echo '$PAYLOAD' | base64 -d | tar -xzf -
chmod +x run.sh autoblog.mjs
touch .env && chmod 600 .env
LINE='20 4,5,7 * * * /home/ubuntu/everest-autoblog/run.sh'
( crontab -l 2>/dev/null | grep -v -e 'everest-autoblog/run.sh' -e '^# Everest daily blog post' || true
  echo "# Everest daily blog post, 09:50 IST (retries 10:50, 12:50)"; echo "\$LINE" ) | crontab -
echo "installed:"; ls -la ~/everest-autoblog; crontab -l | grep -B1 everest-autoblog/run.sh
echo "keys set: \$(grep -c -E '^(OPENAI_API_KEY|GITHUB_TOKEN)=.+' .env || true) of 2"
INSTALL
bash ./ssmrun.sh "$TMP/install.sh" 15
