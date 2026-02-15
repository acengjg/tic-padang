#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
export SSHPASS=$PASS

echo "Applying Code-Level Fix on VPS..."

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    cd ~/tic-padang
    
    echo 'Backing up server.ts...'
    cp server.ts server.ts.bak
    
    echo 'Injecting Connection String...'
    # Replace the initialization with hardcoded URL
    sed -i \"s/const prisma = new PrismaClient();/const prisma = new PrismaClient({ datasources: { db: { url: 'postgresql:\/\/tic_user:tic_password@127.0.0.1:5432\/tic_db?schema=public' } } });/\" server.ts
    
    echo 'Killing old...'
    pm2 delete tic-padang || true
    
    echo 'Starting fresh...'
    pm2 start npm --name 'tic-padang' -- start
    pm2 save
"

echo "Code Fix Applied."
