#!/bin/bash

echo "Starting redis..."
sudo service redis-server start || exit 1

echo "Starting frontend..."
(
    cd frontend
    npm run dev
) &


echo "Starting worker..."
(
    cd backend
    npm run worker
) &

echo "Starting backend..."
(
    cd backend
    npm run dev
) &

echo "MaxOJ started..."
echo "Frontend, backend, worker are running..."
echo "Press Ctrl+C to stop the script"