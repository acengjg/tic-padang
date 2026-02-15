#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
export SSHPASS=$PASS

echo "=========================================="
echo "LOGIC VERIFICATION"
echo "=========================================="

# 1. Upload Script
sshpass -e scp -o StrictHostKeyChecking=no verify_login_vps.ts $USER@$HOST:~/tic-padang/

# 2. Run Script
sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    cd ~/tic-padang
    export DATABASE_URL='postgresql://tic_user:tic_password@localhost:5432/tic_db?schema=public'
    npx tsx verify_login_vps.ts
"
