# Desafio Jedis - Full Stack Blog Application

This project contains a full-stack blog application, fully containerized with Docker for a seamless development experience. It includes:

-   **Frontend**: A modern JavaScript application served by Nginx.
-   **Backend**: A Phoenix API to manage blog posts and users.
-   **Database**: A MySQL database.

The entire stack is orchestrated using a single `docker-compose.yml` at the project root.

## Prerequisites

-   Docker
-   Docker Compose

Ensure the Docker daemon is running before you begin.

## Quick Start with Scripts

Helper scripts are provided in the root directory for easy management of the application stack.

1.  **Make scripts executable (run once):**
    ```bash
    chmod +x *.sh
    ```

2.  **Start the application:**
    This script will automatically:
    - Check if your `.env` file has a valid `SECRET_KEY_BASE` and generate one if needed.
    - Build the Docker images for the frontend and backend.
    - Start all services in the background.
    - Run database migrations.
    - Seed the database with sample data.

    ```bash
    ./start.sh
    ```

3.  **Access your application:**
    -   **Frontend:** http://localhost:8080
    -   **Backend API:** http://localhost:4000
    -   **Database (MySQL):** Connect on `localhost:3307`
    -   **Sample User:** `user@editor.com` / `editor2025`

4.  **View logs:**
    To see the real-time logs from all running containers:
    ```bash
    ./logs.sh
    ```
    To view logs for a specific service (e.g., the backend):
    ```bash
    ./logs.sh web
    ```

5.  **Stop the application:**
    This will stop and remove all the application containers.
    ```bash
    ./stop.sh
    ```

## Manual Database Commands

If you need to run migrations or seeding manually while the application is running, you can use the helper scripts:

-   **Run migrations:**
    ```bash
    ./migrate.sh
    ```

-   **Run seeding:**
    ```bash
    ./seed.sh
    ```

## Project Structure

```
.
├── backend_blog/     # Phoenix API backend
├── frontend_blog/    # JavaScript frontend
├── .env              # Environment variables (auto-generated if needed)
├── docker-compose.yml # Main Docker Compose file for all services
├── README.md         # This file
├── start.sh          # Script to start the application
├── stop.sh           # Script to stop the application
└── logs.sh           # Script to view logs
```