#!/bin/bash

# Configuration
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="Ubuntuserver!2025"
export SSHPASS=$PASS

echo "=========================================="
echo "RESTARTING SERVER (CLEAN)"
echo "=========================================="

# 1. Upload server.ts (Again, to be absolutely sure)
sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "cat > ~/tic-padang/server.ts" < server.ts

# 2. Restart and Log
sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    cd ~/tic-padang
    pm2 reload tic-padang
    sleep 2
    pm2 logs tic-padang --lines 20 --nostream
"
