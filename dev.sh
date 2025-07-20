#!/bin/bash

# Development helper script for the personal website
# This script helps with common Docker Compose operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running"
        exit 1
    fi
    
    print_success "Docker is running"
}

# Function to check if environment file exists
check_env_file() {
    if [ ! -f .env ]; then
        if [ -f .env.local ]; then
            print_warning ".env file not found, copying from .env.local"
            cp .env.local .env
        elif [ -f .env.example ]; then
            print_warning ".env file not found, copying from .env.example"
            cp .env.example .env
        else
            print_error "No environment file found. Please create .env from .env.example"
            exit 1
        fi
    fi
    print_success "Environment file found"
}

# Function to validate Docker Compose configuration
validate_config() {
    print_status "Validating Docker Compose configuration..."
    if docker compose config > /dev/null 2>&1; then
        print_success "Docker Compose configuration is valid"
    else
        print_error "Docker Compose configuration has errors"
        docker compose config
        exit 1
    fi
}

# Function to start services
start_services() {
    print_status "Starting services..."
    docker compose up -d
    
    print_status "Waiting for services to be healthy..."
    sleep 15
    
    # Check service status
    if docker compose ps | grep -q "running"; then
        print_success "Services are starting up"
        print_status "Running health check..."
        if command -v node &> /dev/null; then
            node health-check.js
        else
            print_status "Node.js not found, skipping health check"
            print_status "Frontend: http://localhost:5173"
            print_status "Supabase Studio: http://localhost:3000"
            print_status "Supabase API: http://localhost:8000"
        fi
    else
        print_warning "Some services may not be running properly"
        docker compose ps
    fi
}

# Function to stop services
stop_services() {
    print_status "Stopping services..."
    docker compose down
    print_success "Services stopped"
}

# Function to reset everything (including volumes)
reset_services() {
    print_warning "This will remove all data including the database!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting services and volumes..."
        docker compose down -v
        docker compose build --no-cache
        print_success "Reset complete"
    else
        print_status "Reset cancelled"
    fi
}

# Function to show logs
show_logs() {
    if [ -z "$1" ]; then
        docker compose logs -f
    else
        docker compose logs -f "$1"
    fi
}

# Function to show help
show_help() {
    echo "Personal Website Development Helper"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start     Start all services"
    echo "  stop      Stop all services" 
    echo "  restart   Restart all services"
    echo "  reset     Reset services and volumes (removes all data)"
    echo "  logs      Show logs for all services"
    echo "  logs [service]  Show logs for specific service"
    echo "  status    Show service status"
    echo "  health    Check service health"
    echo "  validate  Validate configuration"
    echo "  build     Build containers"
    echo "  help      Show this help message"
    echo ""
    echo "Services: frontend, db, auth, rest, realtime, storage, meta, studio, kong"
}

# Main script logic
case "$1" in
    "start")
        check_docker
        check_env_file
        validate_config
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        check_docker
        check_env_file
        validate_config
        start_services
        ;;
    "reset")
        reset_services
        ;;
    "logs")
        show_logs "$2"
        ;;
    "status")
        docker compose ps
        ;;
    "health")
        node health-check.js
        ;;
    "validate")
        check_docker
        check_env_file
        validate_config
        ;;
    "build")
        docker compose build
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac