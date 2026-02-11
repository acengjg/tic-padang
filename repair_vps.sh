#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="Ubuntuserver!2025"
export SSHPASS=$PASS

echo "Running Repair on VPS (Force IPv4)..."

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    cd ~/tic-padang
    
    echo 'Stopping App...'
    pm2 stop tic-padang
    
    echo 'Fixing .env (Using 127.0.0.1)...'
    # Use 127.0.0.1 to avoid IPv6 resolution issues
    echo 'DATABASE_URL=postgresql://tic_user:tic_password@127.0.0.1:5432/tic_db?schema=public' > .env
    echo 'PORT=3001' >> .env
    echo 'JWT_SECRET=tik_padang_secret_key_123' >> .env
    
    echo 'Cleaning and Regenerating...'
    rm -rf node_modules/.prisma
    npx prisma generate
    
    echo 'Restarting App...'
    pm2 restart tic-padang --update-env
"

echo "Repair Complete."
