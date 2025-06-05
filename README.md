# Personal Website

A full-stack personal website built with React, Vite, and Supabase, deployable locally with Docker Compose.

## 🚀 Local Development

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/nkbud/personal-website.git
   cd personal-website
   ```

2. **Start the application**
   ```bash
   docker-compose up
   ```

   This will start both the frontend and Supabase backend services.

3. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Supabase Studio**: http://localhost:3000 (Database dashboard)
   - **Supabase API**: http://localhost:8000

### Development Workflow

#### Using the Development Helper Script

For convenience, use the included `dev.sh` script:

```bash
# Make the script executable
chmod +x dev.sh

# Start all services
./dev.sh start

# Stop all services
./dev.sh stop

# View logs
./dev.sh logs

# Reset everything (removes all data)
./dev.sh reset

# See all available commands
./dev.sh help
```

#### Manual Docker Compose Commands

```bash
# Start all services in the background
docker compose up -d

# View logs for all services
docker compose logs -f

# View logs for specific service
docker compose logs -f frontend

# Stop all services
docker compose down

# Stop and remove volumes (reset database)
docker compose down -v

# Rebuild containers
docker compose build --no-cache
```

#### Hot Reloading

The frontend supports hot reloading out of the box. Any changes to your React code will automatically refresh the browser.

#### Database Management

- Access Supabase Studio at http://localhost:3000 to manage your database
- Default credentials are configured for local development
- Database data persists between restarts in Docker volumes

### Environment Configuration

The application uses environment variables for configuration. Default values are provided in `.env.local` for local development.

Key configuration options:
- `VITE_SUPABASE_URL`: Supabase API URL (defaults to local: http://localhost:8000)
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `POSTGRES_PASSWORD`: Database password
- `JWT_SECRET`: JWT signing secret

### Architecture

This application consists of:

#### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for styling
- **Radix UI** components
- **Framer Motion** for animations
- **React Router** for navigation

#### Backend (Supabase)
- **PostgreSQL** database
- **PostgREST** for automatic API generation
- **GoTrue** for authentication
- **Realtime** for live updates
- **Storage** for file management

### Production Deployment

For production deployment, see the [supabase/](./supabase/) directory which contains Terraform and Packer configurations for deploying to DigitalOcean.

### Troubleshooting

#### Prerequisites Check
```bash
# Validate your setup
./dev.sh validate
```

#### Port Conflicts
If you encounter port conflicts, you can modify the ports in `docker-compose.yml`:
- Frontend: Change `5173:5173` to `[new-port]:5173`
- Supabase API: Change `8000:8000` to `[new-port]:8000`
- Supabase Studio: Change `3000:3000` to `[new-port]:3000`
- Database: Change `5432:5432` to `[new-port]:5432`

#### Database Issues
```bash
# Reset the database completely
./dev.sh reset

# Access database directly
docker compose exec db psql -U postgres

# Check database status
docker compose logs db
```

#### Container Issues
```bash
# Rebuild containers from scratch
docker compose down
docker compose build --no-cache
docker compose up

# Check container status
docker compose ps

# View detailed logs
docker compose logs -f [service-name]
```

#### Environment Variables
Make sure you have a `.env` file in the root directory. Copy from `.env.example`:
```bash
cp .env.example .env
```

#### Resource Issues
If containers are failing due to memory constraints:
- Increase Docker Desktop memory allocation (recommended: 4GB+)
- Close other resource-intensive applications
- Try starting services individually:
  ```bash
  docker compose up db        # Start database first
  docker compose up kong      # Then API gateway
  docker compose up frontend  # Finally frontend
  ```

#### Service Health Checks
Check if services are healthy:
```bash
# View service status
docker compose ps

# Check specific service health
docker compose exec [service-name] healthcheck
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `docker-compose up`
5. Submit a pull request
