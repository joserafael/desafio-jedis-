.PHONY: help build up down restart logs logs-web logs-db shell db-shell migrate test reset-db clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker containers
	docker-compose build

up: ## Start all services
	docker-compose up

up-d: ## Start all services in detached mode
	docker-compose up -d

down: ## Stop all services
	docker-compose down

restart: down up ## Restart all services

logs: ## View logs from all services
	docker-compose logs -f

logs-web: ## View logs from web service
	docker-compose logs -f web

logs-db: ## View logs from database service
	docker-compose logs -f db

shell: ## Open shell in web container
	docker-compose exec web sh

db-shell: ## Open MySQL shell
	docker-compose exec db mysql -u backend_blog_user -p backend_blog_dev

migrate: ## Run database migrations
	docker-compose exec web mix ecto.migrate

seed: ## Run database seeds
	docker-compose exec web mix run priv/repo/seeds.exs

test: ## Run tests
	docker-compose exec web mix test

reset-db: ## Reset database
	docker-compose exec web mix ecto.reset

iex: ## Open IEx shell
	docker-compose exec web iex -S mix

clean: ## Remove containers and volumes
	docker-compose down -v
	docker system prune -f

db-only: ## Start only database service
	docker-compose up db

web-only: ## Start only web service (requires external database)
	docker-compose up web

# Development targets
dev-setup: ## Initial setup for development
	@echo "Setting up development environment..."
	@cp .env.example .env 2>/dev/null || true
	@echo "Environment file created. Edit .env if needed."
	@echo "Run 'make up' to start the services."

dev-reset: clean dev-setup ## Reset development environment completely
