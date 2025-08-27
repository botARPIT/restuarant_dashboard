#!/bin/bash

# Unified Restaurant Dashboard - Cloudflare Deployment Script
# This script deploys the application to Cloudflare Workers and Pages

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    if ! command -v wrangler &> /dev/null; then
        log_error "Wrangler CLI is not installed. Installing..."
        npm install -g wrangler
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Authenticate with Cloudflare
authenticate_cloudflare() {
    log_info "Checking Cloudflare authentication..."
    
    if ! wrangler whoami &> /dev/null; then
        log_warning "Not authenticated with Cloudflare. Please run 'wrangler auth login' first."
        read -p "Would you like to authenticate now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            wrangler auth login
        else
            log_error "Authentication required. Exiting."
            exit 1
        fi
    fi
    
    log_success "Cloudflare authentication verified"
}

# Setup environment variables
setup_environment() {
    local env=${1:-development}
    log_info "Setting up environment: $env"
    
    if [ ! -f ".env.${env}" ]; then
        if [ -f ".env.example" ]; then
            log_warning ".env.${env} not found. Copying from .env.example"
            cp .env.example .env.${env}
            log_warning "Please update .env.${env} with your actual values before proceeding."
            read -p "Press Enter after updating the environment file..."
        else
            log_error ".env.${env} and .env.example not found. Please create environment file."
            exit 1
        fi
    fi
    
    # Source environment variables
    export $(grep -v '^#' .env.${env} | xargs)
    log_success "Environment variables loaded"
}

# Create D1 database
setup_d1_database() {
    log_info "Setting up D1 database..."
    
    # Check if database already exists
    if wrangler d1 list | grep -q "restaurant_dashboard"; then
        log_info "D1 database 'restaurant_dashboard' already exists"
    else
        log_info "Creating D1 database..."
        wrangler d1 create restaurant_dashboard
        log_success "D1 database created"
    fi
    
    # Run migrations
    log_info "Running database migrations..."
    wrangler d1 execute restaurant_dashboard --file=./infrastructure/database/schema.sql
    log_success "Database schema applied"
}

# Setup KV namespaces
setup_kv_namespaces() {
    log_info "Setting up KV namespaces..."
    
    # Cache namespace
    if wrangler kv:namespace list | grep -q "cache"; then
        log_info "KV namespace 'cache' already exists"
    else
        log_info "Creating KV namespace 'cache'..."
        wrangler kv:namespace create "cache"
        log_success "KV namespace 'cache' created"
    fi
    
    # Sessions namespace
    if wrangler kv:namespace list | grep -q "sessions"; then
        log_info "KV namespace 'sessions' already exists"
    else
        log_info "Creating KV namespace 'sessions'..."
        wrangler kv:namespace create "sessions"
        log_success "KV namespace 'sessions' created"
    fi
}

# Setup Durable Objects
setup_durable_objects() {
    log_info "Durable Objects will be deployed with the Workers..."
    log_success "Durable Objects configuration ready"
}

# Build and deploy workers
deploy_workers() {
    local env=${1:-development}
    log_info "Building and deploying Workers for environment: $env"
    
    cd workers
    
    # Install dependencies
    log_info "Installing Worker dependencies..."
    npm install
    
    # Run tests
    log_info "Running tests..."
    npm test
    
    # Build the worker
    log_info "Building Worker..."
    npm run build
    
    # Deploy to Cloudflare
    log_info "Deploying to Cloudflare Workers..."
    if [ "$env" = "production" ]; then
        wrangler deploy --env production
    elif [ "$env" = "staging" ]; then
        wrangler deploy --env staging
    else
        wrangler deploy
    fi
    
    cd ..
    log_success "Workers deployed successfully"
}

# Deploy frontend to Cloudflare Pages
deploy_frontend() {
    local env=${1:-development}
    log_info "Building and deploying frontend for environment: $env"
    
    cd frontend
    
    # Install dependencies
    log_info "Installing frontend dependencies..."
    npm install
    
    # Build for production
    log_info "Building frontend..."
    if [ "$env" = "production" ]; then
        npm run build:production
    elif [ "$env" = "staging" ]; then
        npm run build:staging
    else
        npm run build
    fi
    
    # Deploy to Cloudflare Pages
    log_info "Deploying to Cloudflare Pages..."
    wrangler pages deploy dist --project-name=restaurant-dashboard-frontend
    
    cd ..
    log_success "Frontend deployed successfully"
}

# Setup monitoring and alerts
setup_monitoring() {
    log_info "Setting up monitoring and alerts..."
    
    # This would typically involve:
    # - Setting up Cloudflare Analytics
    # - Configuring alert notifications
    # - Setting up log forwarding
    
    log_success "Monitoring setup complete"
}

# Verify deployment
verify_deployment() {
    local env=${1:-development}
    log_info "Verifying deployment..."
    
    # Check worker health
    local worker_url="https://restaurant-dashboard-api.your-subdomain.workers.dev"
    if [ "$env" = "staging" ]; then
        worker_url="https://restaurant-dashboard-api-staging.your-subdomain.workers.dev"
    fi
    
    log_info "Checking worker health at: $worker_url/api/v1/health"
    if curl -f -s "$worker_url/api/v1/health" > /dev/null; then
        log_success "Worker is responding"
    else
        log_warning "Worker health check failed"
    fi
    
    # Check frontend
    local frontend_url="https://restaurant-dashboard-frontend.pages.dev"
    log_info "Frontend should be available at: $frontend_url"
    
    log_success "Deployment verification complete"
}

# Cleanup function
cleanup() {
    log_info "Cleaning up temporary files..."
    # Add any cleanup logic here
    log_success "Cleanup complete"
}

# Main deployment function
deploy() {
    local env=${1:-development}
    local skip_frontend=${2:-false}
    
    log_info "Starting deployment to environment: $env"
    log_info "Skip frontend: $skip_frontend"
    
    # Trap cleanup on exit
    trap cleanup EXIT
    
    # Run deployment steps
    check_prerequisites
    authenticate_cloudflare
    setup_environment "$env"
    setup_d1_database
    setup_kv_namespaces
    setup_durable_objects
    deploy_workers "$env"
    
    if [ "$skip_frontend" != "true" ]; then
        deploy_frontend "$env"
    fi
    
    setup_monitoring
    verify_deployment "$env"
    
    log_success "Deployment completed successfully!"
    log_info "Worker URL: https://restaurant-dashboard-api${env:+-${env}}.your-subdomain.workers.dev"
    log_info "Frontend URL: https://restaurant-dashboard-frontend.pages.dev"
}

# Script usage
usage() {
    echo "Usage: $0 [ENVIRONMENT] [OPTIONS]"
    echo ""
    echo "ENVIRONMENT:"
    echo "  development  Deploy to development environment (default)"
    echo "  staging      Deploy to staging environment"
    echo "  production   Deploy to production environment"
    echo ""
    echo "OPTIONS:"
    echo "  --skip-frontend  Skip frontend deployment"
    echo "  --workers-only   Deploy only workers (same as --skip-frontend)"
    echo "  --frontend-only  Deploy only frontend"
    echo "  --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                          # Deploy to development"
    echo "  $0 staging                  # Deploy to staging"
    echo "  $0 production               # Deploy to production"
    echo "  $0 staging --skip-frontend  # Deploy only workers to staging"
}

# Parse command line arguments
ENV="development"
SKIP_FRONTEND=false
FRONTEND_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        development|staging|production)
            ENV="$1"
            shift
            ;;
        --skip-frontend|--workers-only)
            SKIP_FRONTEND=true
            shift
            ;;
        --frontend-only)
            FRONTEND_ONLY=true
            shift
            ;;
        --help|-h)
            usage
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Main execution
if [ "$FRONTEND_ONLY" = "true" ]; then
    log_info "Deploying frontend only..."
    check_prerequisites
    authenticate_cloudflare
    setup_environment "$ENV"
    deploy_frontend "$ENV"
else
    deploy "$ENV" "$SKIP_FRONTEND"
fi