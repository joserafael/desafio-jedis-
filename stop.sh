#!/bin/bash

# Stop on any error
set -e

echo "🛑 Stopping all application services..."
docker-compose down
echo "✅ All services have been stopped."