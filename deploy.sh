#!/bin/bash
set -e

# === Load environment variables from .env ===
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

NTNU_USER=${VITE_DEPLOY_USER}
NTNU_HOST=${VITE_DEPLOY_HOST}
REMOTE_PATH=${VITE_DEPLOY_REMOTE_PATH}
BUILD_DIR=${VITE_DEPLOY_BUILD_DIR:-dist}
PASSWORD=${VITE_DEPLOY_PASSWORD}

echo "🚀 Building project..."
npm run build

echo "📤 Uploading to NTNU server (you may be asked for your password)..."

sftp "$NTNU_USER@$NTNU_HOST" <<EOF
cd $REMOTE_PATH
rm -rf assets index.html
mkdir -p assets
put -r $BUILD_DIR/* .
bye
EOF

echo "✅ Deployment complete!"
echo "🌐 Visit: https://folk.ntnu.no/$NTNU_USER/"
