#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
export SSHPASS=$PASS

echo "=========================================="
echo "LIVE LOGIN TEST"
echo "=========================================="

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    echo '--- Testing Login with 12345678 ---'
    curl -v -X POST -H \"Content-Type: application/json\" \
         -d '{\"email\":\"admin@tic.com\", \"password\":\"12345678\"}' \
         http://localhost:3001/api/auth/login
         
    echo -e '\n\n--- App Logs (Last 20) ---'
    pm2 logs tic-padang --lines 20 --nostream
"
