#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="Ubuntuserver!2025"
export SSHPASS=$PASS

echo "Injecting Logger into server.ts..."

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    cd ~/tic-padang
    
    # Back up if not exists
    cp -n server.ts server.ts.orig
    
    # Insert logger after app initialization
    sed -i '/const app = express();/a app.use((req, res, next) => { console.log(\"INCOMING:\", req.method, req.url); next(); });' server.ts
    
    echo 'Restarting App...'
    pm2 restart tic-padang
"

echo "Logger Injected."
