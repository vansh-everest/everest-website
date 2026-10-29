#!/bin/bash
# Cron entry point. Later runs on the same day exit at once if the morning one posted. A failed run
# tells the Content Engine WhatsApp group why (alert.mjs); a run skipped because another one holds
# the lock (exit 75) does not.
cd "$(dirname "$0")" || exit 1
mkdir -p logs
LOG="logs/$(date -u +%Y-%m).log"
START=$({ wc -l < "$LOG"; } 2>/dev/null || echo 0)
/usr/bin/flock -n -E 75 /tmp/everest-autoblog.lock /usr/bin/node autoblog.mjs >> "$LOG" 2>&1
STATUS=$?
if [ "$STATUS" -ne 0 ] && [ "$STATUS" -ne 75 ]; then
  /usr/bin/node alert.mjs "$LOG" "$START" >> "$LOG" 2>&1
fi
exit "$STATUS"
