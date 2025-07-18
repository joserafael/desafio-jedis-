#!/bin/bash
set -e

echo "🗄️  Running database migrations..."
docker-compose exec web mix ecto.migrate
echo "✅ Migrations complete."