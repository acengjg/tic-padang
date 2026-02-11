#!/bin/bash

# Configuration
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="Ubuntuserver!2025"
DB_USER="postgres"
DB_PASS="12345678"
DB_NAME="sipadang"
LOCAL_DUMP_FILE="sipadang_vps_dump.sql"
REMOTE_DUMP_FILE="~/sipadang_backup.sql"

# VPS DB Config (Found via sync_to_vps.sh exploration)
VPS_DB="tic_db"
VPS_DB_USER="tic_user"
VPS_DB_PASS="tic_password"

export SSHPASS=$PASS
 
echo "[1/3] Dumping database on VPS..."

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "export PGPASSWORD=$VPS_DB_PASS; pg_dump -h localhost -U $VPS_DB_USER --clean --if-exists --no-owner --no-acl $VPS_DB > $REMOTE_DUMP_FILE"

if [ $? -ne 0 ]; then
    echo "Error: Failed to dump database on VPS."
    exit 1
fi

# 2. Download dump file
echo "[2/3] Downloading dump file..."
sshpass -e scp -o StrictHostKeyChecking=no $USER@$HOST:$REMOTE_DUMP_FILE ./$LOCAL_DUMP_FILE

if [ $? -ne 0 ]; then
    echo "Error: Failed to download dump file."
    exit 1
fi

# 3. Import to local database
echo "[3/4] Importing to local database..."
export PGPASSWORD=$DB_PASS

# Create DB if it doesn't exist (ignoring error if it does)
createdb -h localhost -U $DB_USER $DB_NAME 2>/dev/null

# Import
psql -h localhost -U $DB_USER $DB_NAME < $LOCAL_DUMP_FILE

if [ $? -ne 0 ]; then
    echo "Error: Failed to import database locally."
    exit 1
fi

# 4. Sync Uploaded Files (Images)
echo "[4/4] Syncing 'uploads' folder (Images)..."
sshpass -e rsync -avz $USER@$HOST:~/tic-padang/uploads/ ./uploads/

if [ $? -ne 0 ]; then
    echo "Warning: Failed to sync uploads folder."
fi

# Clean up local dump
rm $LOCAL_DUMP_FILE

echo "=========================================="
echo "SUCCESS! Local database matches VPS."
echo "=========================================="
