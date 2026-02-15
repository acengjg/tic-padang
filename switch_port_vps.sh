#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
export SSHPASS=$PASS

echo "Switching Port to 3002 on VPS..."

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    cd ~/tic-padang
    
    echo 'Stopping PM2...'
    pm2 stop tic-padang
    
    echo 'Killing generic node processes...'
    # Use pkill, ignore if none found
    pkill -f node || true
    
    echo 'Updating server.ts port...'
    # Hardcode port 3002
    sed -i 's/PORT = process.env.PORT || 3001/PORT = 3002/g' server.ts
    sed -i 's/PORT=3001/PORT=3002/g' .env
    
    echo 'Starting PM2...'
    pm2 start tic-padang
    pm2 save
    
    echo 'Waiting for start...'
    sleep 5
    
    echo 'Checking port 3002...'
    netstat -tulpn | grep 3002
"

echo "Port Switch Script Run."
