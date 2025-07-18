# Docker Setup for Backend Blog

This project includes Docker configuration for easy development setup with MySQL on a custom port.

## Quick Start

1. **Build and start the services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Phoenix app: http://localhost:4000
   - MySQL database: localhost:3307

## Services

### MySQL Database
- **External Port**: 3307 (mapped from internal port 3306)
- **Database**: `backend_blog_dev`
- **User**: `backend_blog_user`
- **Password**: `backend_blog_password`
- **Root Password**: `root_password`

### Phoenix Application
- **Port**: 4000
- **Environment**: development
- **Auto-migration**: Yes (runs on container start)

## Common Commands

### Start services
```bash
docker-compose up
```

### Start in detached mode
```bash
docker-compose up -d
```

### Rebuild containers
```bash
docker-compose up --build
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs web
docker-compose logs db
```

### Run mix commands
```bash
# Run migrations
docker-compose exec web mix ecto.migrate

# Run seeds
docker-compose exec web mix run priv/repo/seeds.exs

# Run tests
docker-compose exec web mix test

# Open IEx shell
docker-compose exec web iex -S mix
```

### Database Commands

#### Connect to MySQL database
```bash
# Using Docker
docker-compose exec db mysql -u backend_blog_user -p backend_blog_dev

# From host (requires MySQL client)
mysql -h localhost -P 3307 -u backend_blog_user -p backend_blog_dev
```

#### Reset database
```bash
docker-compose exec web mix ecto.reset
```

## Local Development (without Docker)

To connect your local Phoenix app to the Dockerized MySQL:

1. **Start only the database:**
   ```bash
   docker-compose up db
   ```

2. **Update your local config/dev.exs:**
   ```elixir
   config :backend_blog, BackendBlog.Repo,
     username: "backend_blog_user",
     password: "backend_blog_password",
     hostname: "localhost",
     port: 3307,
     database: "backend_blog_dev",
     stacktrace: true,
     show_sensitive_data_on_connection_error: true,
     pool_size: 10
   ```

3. **Run Phoenix locally:**
   ```bash
   mix phx.server
   ```

## Troubleshooting

### Port conflicts
If port 3307 is already in use, change it in `docker-compose.yml`:
```yaml
ports:
  - "3308:3306"  # Change 3307 to 3308 or any available port
```

### Database connection issues
1. Check if MySQL is healthy:
   ```bash
   docker-compose ps
   ```

2. View MySQL logs:
   ```bash
   docker-compose logs db
   ```

3. Test database connection:
   ```bash
   docker-compose exec db mysqladmin ping
   ```

### Permission issues
If you encounter permission issues, rebuild the containers:
```bash
docker-compose down
docker-compose up --build
```

## Environment Variables

The following environment variables are used in the Docker setup:

- `DATABASE_URL`: Database connection string
- `SECRET_KEY_BASE`: Phoenix secret key
- `PHX_HOST`: Phoenix host (default: localhost)
- `PHX_PORT`: Phoenix port (default: 4000)
- `MIX_ENV`: Mix environment (default: dev)

## Data Persistence

MySQL data is persisted in a Docker volume named `mysql_data`. To completely reset the database:

```bash
docker-compose down
docker volume rm backend_blog_mysql_data
docker-compose up --build
```
