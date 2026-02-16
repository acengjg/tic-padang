#!/bin/bash
export PGPASSWORD=12345678
psql -h localhost -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'sipadang' AND pid <> pg_backend_pid();"
dropdb -h localhost -U postgres sipadang
createdb -h localhost -U postgres sipadang
psql -h localhost -U postgres -d sipadang -f tic_padang_full_backup_20260213_155500.sql
