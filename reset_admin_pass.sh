#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
export SSHPASS=$PASS
USER_EMAIL="admin@tic.com"
# Hash for '12345678'
NEW_PASS_HASH='$2b$10$NNBzxxe4R5fA7NYLuvP5n.4sgG8TA0oxhoQJs503ORXgFmINz1plC'

echo "=========================================="
echo "RESETTING PASSWORD FOR $USER_EMAIL"
echo "=========================================="

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    export PGPASSWORD='tic_password'
    psql -h localhost -U tic_user -d tic_db -c \"UPDATE \\\"User\\\" SET password = '$NEW_PASS_HASH' WHERE email = '$USER_EMAIL';\"
"
