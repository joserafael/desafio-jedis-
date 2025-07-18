#!/bin/bash

# Stop on any error
set -e

# --- Configuration ---
ENV_FILE=".env"
SECRET_KEY_PLACEHOLDER="YOUR_SECRET_KEY_BASE_HERE"

# --- Functions ---
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
    echo "✅ Docker is running."
}

check_secret_key() {
    if [ ! -f "$ENV_FILE" ]; then
        echo "🔑 .env file not found. Creating one for you."
        echo "SECRET_KEY_BASE=$SECRET_KEY_PLACEHOLDER" > "$ENV_FILE"
    fi

    # Read the secret key from the .env file
    CURRENT_SECRET_KEY=$(grep 'SECRET_KEY_BASE' "$ENV_FILE" | cut -d '=' -f2)

    if [ "$CURRENT_SECRET_KEY" == "$SECRET_KEY_PLACEHOLDER" ]; then
        echo "⚠️  A new SECRET_KEY_BASE needs to be generated."
        echo "Building the backend image to generate the key..."
        docker-compose build web

        echo "Generating new secret key..."
        NEW_SECRET_KEY=$(docker-compose run --rm web mix phx.gen.secret | tr -d '\r\n')

        # Use sed for cross-platform compatibility (macOS and Linux)
        sed -i.bak "s|SECRET_KEY_BASE=.*|SECRET_KEY_BASE=$NEW_SECRET_KEY|" "$ENV_FILE"
        rm "${ENV_FILE}.bak"

        echo "✅ New SECRET_KEY_BASE has been generated and saved to .env file."
    else
        echo "✅ SECRET_KEY_BASE is already set."
    fi
}

# --- Main Script ---
echo "🚀 Starting the Blog application..."
check_docker
check_secret_key

echo "🏗️  Building and starting all services (frontend, backend, db)..."
docker-compose up --build -d

echo ""
echo "⏳ Waiting for the database to be ready..."

# This loop will wait for the db container to become healthy.
# It will time out after 60 seconds (12 * 5s).
for i in {1..12}; do
    # The `|| true` is to prevent the script from exiting if the container is not yet running
    # or if docker inspect fails momentarily.
    health_status=$(docker-compose ps -q db | xargs docker inspect -f '{{.State.Health.Status}}' 2>/dev/null || echo "starting")
    if [ "$health_status" = "healthy" ]; then
        echo "✅ Database is healthy."
        break
    fi
    echo "   ... still waiting for database ($i/12)"
    sleep 5
done

if [ "$health_status" != "healthy" ]; then
    echo "❌ Database did not become healthy in time. Please check the logs with './logs.sh db'."
    exit 1
fi

echo "🗄️  Running database migrations..."
./migrate.sh

echo "🌱 Seeding the database with initial data..."
./seed.sh

echo ""
echo "🎉 Application is fully initialized and running!"
echo "----------------------------------------"
echo "➡️  Frontend:      http://localhost:8080"
echo "➡️  Backend API:   http://localhost:4000"
echo "➡️  Database (MySQL): localhost:3307"
echo "➡️  Seed User:     user@editor.com / editor2025"
echo "----------------------------------------"
echo ""
echo "ℹ️  To view logs, run: ./logs.sh"
echo "ℹ️  To stop the application, run: ./stop.sh"
echo ""