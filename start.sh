#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting deployment script..."
cd server
export FLASK_APP=app.py
export PYTHONUNBUFFERED=TRUE

echo "Current Directory: $(pwd)"
echo "Files in current directory: $(ls)"

# Run gunicorn
exec gunicorn app:app --bind 0.0.0.0:$PORT --log-level debug
