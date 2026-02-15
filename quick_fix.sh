#!/bin/bash

# Configuration
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
export SSHPASS=$PASS

echo "=========================================="
echo "FORCE OVERWRITING server.ts on VPS"
echo "=========================================="

# 1. Upload server.ts using cat (safer than rsync for single file issues)
echo "[1/2] Uploading fixed server.ts..."
sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "cat > ~/tic-padang/server.ts" < server.ts

# 2. Restart PM2
echo "[2/2] Restarting PM2..."
sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    echo 'Checking file content:'
    grep 'app.use('\'/api\'' ~/tic-padang/server.ts
    
    cd ~/tic-padang
    pm2 stop tic-padang
    pm2 start npm --name 'tic-padang' -- start
    pm2 save
    
    sleep 3
    pm2 logs tic-padang --lines 20 --nostream
"
