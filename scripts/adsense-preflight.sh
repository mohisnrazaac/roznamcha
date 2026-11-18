#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_BIN="$(which python3 || echo "python")"

echo "Executing Roznamcha AdSense Preflight Suite..."
"$PYTHON_BIN" "$SCRIPT_DIR/adsense_preflight.py"
