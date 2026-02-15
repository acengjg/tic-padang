#!/bin/bash
HOST="103.141.74.87"
USER="ubuntuserver"
PASS="@Marpoyan77"
export SSHPASS=$PASS

echo "Running Diagnostic on VPS..."

sshpass -e ssh -o StrictHostKeyChecking=no $USER@$HOST "
    cd ~/tic-padang
    
    echo 'Cleaning cache...'
    rm -rf node_modules/.cache
    
    echo 'Backing up server.ts...'
    cp -n server.ts server.ts.bak2
    
    echo 'Injecting Test Route...'
    # Inject a test route before other routes
    sed -i '/const app = express();/a app.post(\"/api/test\", (req, res) => res.json({ status: \"ok\" }));' server.ts
    
    echo 'Restarting...'
    pm2 restart tic-padang
"

echo "Diagnostic Prep Complete."
