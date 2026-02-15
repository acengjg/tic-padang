#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
export SSHPASS=$PASS

echo "Running FINAL FIX on VPS..."

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    cd ~/tic-padang
    
    echo 'Killing old process...'
    pm2 delete tic-padang || true
    
    echo 'Fixing .env (127.0.0.1)...'
    # Ensure correct connect string
    echo 'DATABASE_URL=postgresql://tic_user:tic_password@127.0.0.1:5432/tic_db?schema=public' > .env
    echo 'PORT=3001' >> .env
    echo 'JWT_SECRET=tik_padang_secret_key_123' >> .env
    
    echo 'Regenerating Prisma...'
    rm -rf node_modules/.prisma
    npx prisma generate
    
    echo 'Starting fresh...'
    # Use standard npm start
    pm2 start npm --name 'tic-padang' -- start
    pm2 save
"

echo "Final Fix Complete."
