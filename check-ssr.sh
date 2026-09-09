#!/bin/bash

PORT=13714
# Get absolute path of script directory (project root)
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

if ! nc -z 127.0.0.1 $PORT; then
    cd "$PROJECT_DIR"
    # Ensure logs directory exists
    mkdir -p storage/logs
    # Start the node SSR server using nohup with alt-nodejs20 and single threadpool to respect cPanel LVE limits
    nohup env UV_THREADPOOL_SIZE=1 /opt/alt/alt-nodejs20/root/usr/bin/node bootstrap/ssr/ssr.js > storage/logs/ssr.log 2>&1 &
    echo "$(date): SSR restarted on port $PORT" >> storage/logs/ssr-watchdog.log
fi
