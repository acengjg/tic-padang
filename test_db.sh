#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
export SSHPASS=$PASS

echo "=========================================="
echo "TESTING DATABASE CONNECTION"
echo "=========================================="

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    echo '1. Testing simple connection via PGPASSWORD...'
    export PGPASSWORD='tic_password'
    psql -h localhost -U tic_user -d tic_db -c '\conninfo'
    
    echo '2. Checking .env content (masking password)...'
    cat ~/tic-padang/.env | sed 's/password/\*\*\*\*/g'
    
    echo '3. Testing NodeJS Prisma connection...'
    cd ~/tic-padang
    npx prisma db pull
"
