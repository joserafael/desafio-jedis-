#!/bin/bash
set -e

echo "🌱 Seeding the database..."
docker-compose run --rm web mix run priv/repo/seeds.exs
echo "✅ Seeding complete."