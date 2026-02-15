#!/bin/bash

# Configuration
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
export SSHPASS=$PASS

echo "=========================================="
echo "DEEP DEBUGGING VPS: $HOST"
echo "=========================================="

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    echo '--- 1. Checking FILE CONTENT on server for the fix ---'
    grep -C 5 'app.use('\'/api' ~/tic-padang/server.ts
    
    echo '--- 2. Checking PM2 Status ---'
    pm2 list
    
    echo '--- 3. Checking for specific SyntaxError in logs ---'
    pm2 logs tic-padang --lines 100 --nostream | grep -A 5 "Error"
    
    echo '--- 4. Full recent logs ---'
    pm2 logs tic-padang --lines 50 --nostream
    
    echo '--- 5. Manually running the server to see immediate startup errors ---'
    # Stop PM2 momentarily
    pm2 stop tic-padang
    
    # Try running directly with TSX to see output in terminal
    cd ~/tic-padang
    # Set minimal env vars for test
    export DATABASE_URL='postgresql://tic_user:tic_password@localhost:5432/tic_db?schema=public'
    export JWT_SECRET='tik_padang_secret_key_123'
    export PORT=3002
    
    echo '>>> ATTEMPTING DIRECT RUN (timeout 10s)...'
    timeout 10s npx tsx server.ts
    
    # Restart PM2
    echo '>>> RESTARTING PM2...'
    pm2 restart tic-padang
"
