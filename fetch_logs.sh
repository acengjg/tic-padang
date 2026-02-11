#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="Ubuntuserver!2025"
export SSHPASS=$PASS

echo "=========================================="
echo "FETCHING LOGS FROM VPS"
echo "=========================================="

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    echo '--- NIGINX ERROR LOGS ---'
    echo '$PASS' | sudo -S tail -n 20 /var/log/nginx/error.log
    
    echo '--- APP LOGS (PM2) ---'
    pm2 logs tic-padang --lines 50 --nostream
"
