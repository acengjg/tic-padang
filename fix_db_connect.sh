#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
export SSHPASS=$PASS

echo "=========================================="
echo "FIXING DB CONNECTION (AGAIN)"
echo "=========================================="

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    echo '--- Current .env ---'
    cat ~/tic-padang/.env
    
    echo '--- Re-generating Prisma ---'
    cd ~/tic-padang
    # Ensure env vars are exported for this session
    export DATABASE_URL='postgresql://tic_user:tic_password@localhost:5432/tic_db?schema=public'
    
    npx prisma generate
    
    echo '--- Restarting PM2 with --update-env ---'
    # Use --update-env to force PM2 to reload .env file
    pm2 restart tic-padang --update-env
"
