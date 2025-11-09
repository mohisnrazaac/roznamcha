#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR=${1:-deploy/rozapp}
SOURCE_DIR=${2:-.}
FILTER_FILE=".deployignore"

echo "[prepare-deploy] Target bundle directory: ${TARGET_DIR}"

rm -rf "${TARGET_DIR}"
mkdir -p "${TARGET_DIR}"

RSYNC_ARGS=(-av --delete)

if [[ -f "${FILTER_FILE}" ]]; then
  echo "[prepare-deploy] Using filters from ${FILTER_FILE}"
  RSYNC_ARGS+=("--exclude-from=${FILTER_FILE}")
else
  echo "[prepare-deploy] ${FILTER_FILE} not found, copying entire tree"
fi

rsync "${RSYNC_ARGS[@]}" "${SOURCE_DIR}/" "${TARGET_DIR}/"

echo "[prepare-deploy] Bundle ready at ${TARGET_DIR}"
