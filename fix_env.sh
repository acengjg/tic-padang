#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
export SSHPASS=$PASS

echo "=========================================="
echo "FIXING .ENV ON VPS"
echo "=========================================="

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    echo 'Overwriting .env with PRODUCTION config...'
    echo 'DATABASE_URL=\"postgresql://tic_user:tic_password@localhost:5432/tic_db?schema=public\"' > ~/tic-padang/.env
    echo 'PORT=3001' >> ~/tic-padang/.env
    echo 'JWT_SECRET=\"tik_padang_secret_key_123\"' >> ~/tic-padang/.env
    
    echo 'Verifying .env:'
    cat ~/tic-padang/.env
    
    echo 'Restarting PM2...'
    cd ~/tic-padang
    npx prisma migrate deploy
    pm2 restart tic-padang
"
