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

#### Starting Services
```bash
# Start all services in the background
docker-compose up -d

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f frontend
```

#### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v
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

#### Port Conflicts
If you encounter port conflicts, you can modify the ports in `docker-compose.yml`:
- Frontend: Change `5173:5173` to `[new-port]:5173`
- Supabase API: Change `8000:8000` to `[new-port]:8000`
- Supabase Studio: Change `3000:3000` to `[new-port]:3000`

#### Database Issues
```bash
# Reset the database
docker-compose down -v
docker-compose up

# Access database directly
docker-compose exec db psql -U postgres
```

#### Container Issues
```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `docker-compose up`
5. Submit a pull request
