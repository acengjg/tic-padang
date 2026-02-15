#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
export SSHPASS=$PASS
USER_EMAIL=$1

if [ -z "$USER_EMAIL" ]; then
    echo "Usage: ./make_admin.sh <email>"
    exit 1
fi

echo "=========================================="
echo "UPGRADING $USER_EMAIL TO ADMIN"
echo "=========================================="

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    export PGPASSWORD='tic_password'
    psql -h localhost -U tic_user -d tic_db -c \"UPDATE \\\"User\\\" SET role = 'ADMIN' WHERE email = '$USER_EMAIL';\"
    psql -h localhost -U tic_user -d tic_db -c \"SELECT name, email, role FROM \\\"User\\\" WHERE email = '$USER_EMAIL';\"
"
