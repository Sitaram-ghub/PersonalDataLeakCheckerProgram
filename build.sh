#!/usr/bin/env bash
# exit on error
set -o errexit

# Build Frontend
npm install --prefix client
npm run build --prefix client

# Build Backend
pip install -r server/requirements.txt
