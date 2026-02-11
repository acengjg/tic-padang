#!/bin/bash

# Configuration
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="Ubuntuserver!2025"
export SSHPASS=$PASS

echo "=========================================="
echo "DEPLOYMENT: Syncing & Restarting"
echo "=========================================="

# 1. Copy Files (Adding this back!)
echo "[1/3] Syncing files to server (with checksums)..."
sshpass -e rsync -avzc --exclude 'node_modules' --exclude '.git' --exclude 'dist' --exclude 'uploads' --exclude '.env' --exclude '.env.local' ./ $USER@$HOST:~/tic-padang/

# 2. Fix Env, Build & Migrate
echo "[2/3] Configuring, Building & Migrating..."
sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    cd ~/tic-padang
    
    # Create valid .env for VPS
    echo 'DATABASE_URL=\"postgresql://tic_user:tic_password@localhost:5432/tic_db?schema=public\"' > .env
    echo 'PORT=3001' >> .env
    echo 'JWT_SECRET=\"tik_padang_secret_key_123\"' >> .env

    # Install any new dependencies
    npm install
    
    # Build Frontend again just in case
    npm run build
    
    # Migrate DB
    npx prisma migrate deploy
"

# 3. Restart Application
echo "[3/3] Restarting PM2..."
sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    pm2 restart tic-padang
"

echo "=========================================="
echo "Update Finished!"
echo "=========================================="
