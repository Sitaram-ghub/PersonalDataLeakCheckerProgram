#!/usr/bin/env bash
# exit on error
set -o errexit

# Build Frontend (Optimized for low RAM)
cd client
npm install --no-audit --no-fund
npm run build
cd ..

# Build Backend
pip install --upgrade pip
pip install -r server/requirements.txt
