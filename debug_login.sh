#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
export SSHPASS=$PASS

echo "=========================================="
echo "FETCHING RECENT LOGS"
echo "=========================================="

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    echo '--- DB Record ---'
    export PGPASSWORD='tic_password'
    psql -h localhost -U tic_user -d tic_db -c \"SELECT id, email, role, password FROM \\\"User\\\" WHERE email = 'admin@tic.com';\"
    
    echo '--- Recent PM2 Logs (Last 50 lines) ---'
    pm2 logs tic-padang --lines 50 --nostream
"
