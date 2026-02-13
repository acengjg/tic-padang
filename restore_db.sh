#!/bin/bash
export PGPASSWORD=postgres
dropdb -h localhost -U postgres tic_padang
createdb -h localhost -U postgres tic_padang
psql -h localhost -U postgres -d tic_padang -f backup_sipadang_20260212_214058.sql
