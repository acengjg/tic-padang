#!/bin/bash

# Configuration
VPS_HOST="103.141.74.87"
VPS_USER="ubuntuserver"
VPS_PASS="@Marpoyan77"

export SSHPASS=$VPS_PASS

echo "=========================================="
echo "STARTING FULL DEPLOYMENT TO VPS"
echo "=========================================="

# 1. Sync Database and Assets
./sync_to_vps.sh

if [ $? -ne 0 ]; then
    echo "Error: Database/Asset sync failed."
    exit 1
fi

# 2. Update Code and Build on VPS
echo "[5/5] Updating code and rebuilding on VPS..."
sshpass -e ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST "
    cd ~/tic-padang
    
    if [ ! -d ".git" ]; then
        echo "Git not initialized on VPS. Initializing..."
        git init
        git remote add origin https://github.com/acengjg/tic-padang.git
    fi
    
    echo 'Fetching and resetting code to match GitHub (FORCE)...'
    git fetch origin
    git reset --hard origin/main
    
    echo 'Installing dependencies...'
    npm install
    
    echo 'Regenerating Prisma client...'
    npx prisma generate
    
    echo 'Cleaning and building frontend...'
    rm -rf dist
    npm run build
    
    echo 'Restarting application...'
    pm2 restart tic-padang || pm2 start npm --name 'tic-padang' -- start
    pm2 save
"

echo "=========================================="
echo "DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "Your VPS is now running the latest version."
echo "=========================================="
