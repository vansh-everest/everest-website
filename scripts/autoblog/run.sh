#!/bin/bash
# Cron entry point. Later runs on the same day exit at once if the morning one posted.
cd "$(dirname "$0")" || exit 1
mkdir -p logs
exec /usr/bin/flock -n /tmp/everest-autoblog.lock /usr/bin/node autoblog.mjs >> "logs/$(date -u +%Y-%m).log" 2>&1
