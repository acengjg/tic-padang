#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="Ubuntuserver!2025"
export SSHPASS=$PASS

echo "=========================================="
echo "DEEP DEBUG AUTH ON VPS"
echo "=========================================="

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    echo '--- 1. Check .env content ---'
    cat ~/tic-padang/.env
    
    echo '--- 2. Direct Backend Login Test (via Curl) ---'
    curl -v -X POST -H \"Content-Type: application/json\" \
         -d '{\"email\":\"admin@tic.com\", \"password\":\"12345678\"}' \
         http://localhost:3001/api/auth/login
    
    echo -e '\n\n--- 3. Database User Record ---'
    export PGPASSWORD='tic_password'
    psql -h localhost -U tic_user -d tic_db -c \"SELECT id, email, password, role FROM \\\"User\\\" WHERE email = 'admin@tic.com';\"

    echo '--- 4. PM2 Logs (Last 20 lines) ---'
    pm2 logs tic-padang --lines 20 --nostream
"
