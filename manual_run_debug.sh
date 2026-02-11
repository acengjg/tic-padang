#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="Ubuntuserver!2025"
export SSHPASS=$PASS

echo "=========================================="
echo "MANUAL RUN DEBUG"
echo "=========================================="

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    echo 'Stopping PM2...'
    pm2 stop tic-padang
    
    echo 'Running Server Manually with Explicit ENV...'
    cd ~/tic-padang
    export DATABASE_URL='postgresql://tic_user:tic_password@localhost:5432/tic_db?schema=public'
    export JWT_SECRET='tik_padang_secret_key_123'
    export PORT=3001
    
    # Run in background for 15 seconds then kill, while curling in parallel
    (
        npx tsx server.ts > server.log 2>&1 &
        SERVER_PID=\$!
        
        echo 'Waiting for server to start...'
        sleep 5
        
        echo '--- Server Logs ---'
        head -n 20 server.log
        
        echo '--- Testing Login ---'
        curl -i -X POST -H \"Content-Type: application/json\" \
             -d '{\"email\":\"admin@tic.com\", \"password\":\"12345678\"}' \
             http://localhost:3001/api/auth/login
             
        echo -e '\n\nKilling server...'
        kill \$SERVER_PID
    )
    
    echo 'Restoring PM2...'
    pm2 start tic-padang
"
