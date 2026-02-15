#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
export SSHPASS=$PASS

echo "Deploying Fixed Server to VPS..."

# 1. Upload file
sshpass -e scp -o StrictHostKeyChecking=no server_fixed.ts $USER@$HOST:~/tic-padang/server.ts

# 2. Restart Everything safely
sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    cd ~/tic-padang
    
    echo 'Stopping all managers...'
    pm2 stop all || true
    pm2 delete all || true
    
    echo 'Killing residual node processes...'
    # Try different kill methods just to be sure
    killall node || true
    pkill -f node || true
    pkill -f tsx || true
    
    echo 'Resetting PM2...'
    rm -rf ~/.pm2/logs/*
    
    echo 'Regenerating Prisma...'
    rm -rf node_modules/.prisma
    npx prisma generate
    
    echo 'Starting Fresh...'
    pm2 start npm --name 'tic-padang' -- start
    pm2 save
"

echo "Deploy Complete."
