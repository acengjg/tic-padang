#!/bin/bash

# Configuration
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="Ubuntuserver!2025"
export SSHPASS=$PASS

echo "=========================================="
echo "DEPLOYMENT: Building Locally & Syncing"
echo "=========================================="

# 1. Build locally
echo "[1/4] Building Frontend locally..."
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Local build failed."
    exit 1
fi

# 2. Sync files (INCLUDING dist)
echo "[2/4] Syncing files to server (with dist folder)..."
sshpass -e rsync -avzc --exclude 'node_modules' --exclude '.git' --exclude 'uploads' --exclude '.env' --exclude '.env.local' ./ $USER@$HOST:~/tic-padang/

# 3. Server-side setup
echo "[3/4] Configuring, Installing & Migrating on VPS..."
sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    cd ~/tic-padang
    
    # Create valid .env for VPS if not exists
    if [ ! -f .env ]; then
        echo 'DATABASE_URL=postgresql://tic_user:tic_password@localhost:5432/tic_db?schema=public' > .env
        echo 'PORT=3001' >> .env
        echo 'JWT_SECRET=tik_padang_secret_key_123' >> .env
    fi

    # Install all dependencies (needed for tsx)
    npm install
    
    # Generate Prisma Client
    npx prisma generate
    
    # Migrate DB
    npx prisma migrate deploy
"

# 4. Restart Application
echo "[4/4] Restarting PM2..."
sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    pm2 restart tic-padang || pm2 start server.ts --name tic-padang --interpreter tsx
"

echo "=========================================="
echo "Deployment Finished Successfully!"
echo "=========================================="
