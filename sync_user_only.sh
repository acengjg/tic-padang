#!/bin/bash

# Configuration
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
DB_USER="postgres"
DB_PASS="12345678"
DB_NAME="sipadang"
LOCAL_DUMP_FILE="user_table_data_vps.sql"
REMOTE_DUMP_FILE="~/user_table_data.sql"

# VPS DB Config
VPS_DB="tic_db"
VPS_DB_USER="tic_user"
VPS_DB_PASS="tic_password"

export SSHPASS=$PASS
 
echo "[1/3] Dumping 'User' table DATA ONLY on VPS..."

# Use --data-only to skip schema creation
# Use --column-inserts to make the script more robust
sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "export PGPASSWORD=$VPS_DB_PASS; pg_dump -h localhost -U $VPS_DB_USER -t '\"User\"' --data-only --column-inserts $VPS_DB > $REMOTE_DUMP_FILE"

if [ $? -ne 0 ]; then
    echo "Error: Failed to dump User table data on VPS."
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
echo "[3/3] Importing data to local database..."
export PGPASSWORD=$DB_PASS

# We use session_replication_role to bypass foreign key constraints during import
# This allows us to DELETE from User and INSERT new data without being blocked by FKs.
# WARNING: This can leave the database in an inconsistent state if FKs are not respected.
(
  echo "SET session_replication_role = 'replica';"
  echo "DELETE FROM \"User\";"
  cat $LOCAL_DUMP_FILE
  echo "SET session_replication_role = 'origin';"
) | psql -h localhost -U $DB_USER $DB_NAME

if [ $? -ne 0 ]; then
    echo "Error: Failed to import User table data locally."
    exit 1
fi

# Clean up local dump
rm $LOCAL_DUMP_FILE

echo "=========================================="
echo "SUCCESS! User table data synced from VPS."
echo "=========================================="
