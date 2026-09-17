#!/usr/bin/env bash
# Roznamcha Publisher Agent Runner
# Can be called directly, via crontab, or via launchd / systemd

set -euo pipefail

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$BASE_DIR"

PYTHON_BIN="${PUBLISHER_AGENT_PYTHON_PATH:-python3}"
LOG_FILE="$BASE_DIR/storage/logs/publisher_agent.log"

mkdir -p "$BASE_DIR/storage/logs"

echo -e "\n[$(date '+%Y-%m-%d %H:%M:%S')] Executing Publisher Agent..." >> "$LOG_FILE"
"$PYTHON_BIN" "$BASE_DIR/publisher_agent.py" "$@" >> "$LOG_FILE" 2>&1
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Execution complete." >> "$LOG_FILE"
