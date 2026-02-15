#!/bin/bash

# Configuration
LOCAL_DB="sipadang"
LOCAL_USER="postgres"
LOCAL_PASS="12345678"

VPS_HOST="103.141.74.87"
VPS_USER="ubuntuserver"
VPS_PASS="@Marpoyan77"
VPS_DB="tic_db"
VPS_DB_USER="tic_user"
VPS_DB_PASS="tic_password"

export SSHPASS=$VPS_PASS

echo "=========================================="
echo "SYNCING LOCAL DATA TO VPS"
echo "=========================================="

# 1. Dump Local Database
echo "[1/4] Dumping local database '$LOCAL_DB'..."
export PGPASSWORD=$LOCAL_PASS
pg_dump -h localhost -U $LOCAL_USER -d $LOCAL_DB --clean --if-exists --no-owner --no-acl > local_dump.sql

if [ $? -ne 0 ]; then
    echo "Error: Failed to dump local database."
    exit 1
fi

# 2. Upload Dump to VPS
echo "[2/4] Uploading database dump to VPS..."
sshpass -e scp -o StrictHostKeyChecking=no local_dump.sql $VPS_USER@$VPS_HOST:~/local_dump.sql

# 3. Restore on VPS
echo "[3/4] Restoring database on VPS '$VPS_DB'..."
sshpass -e ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST "
    export PGPASSWORD='$VPS_DB_PASS'
    psql -h localhost -U $VPS_DB_USER -d $VPS_DB -f ~/local_dump.sql > /dev/null 2>&1
    
    # Clean up dump file
    rm ~/local_dump.sql
"

# 4. Sync Uploaded Files (Images)
echo "[4/4] Syncing 'uploads' folder (Images)..."
if [ -d "uploads" ]; then
    sshpass -e rsync -avz uploads/ $VPS_USER@$VPS_HOST:~/tic-padang/uploads/
else
    echo "No 'uploads' folder found locally, skipping."
fi

# 5. Clean local dump
rm local_dump.sql

echo "=========================================="
echo "SYNC COMPLETED SUCCESSFULLY!"
echo "Database and files are now identical to local."
echo "=========================================="
