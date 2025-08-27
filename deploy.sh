#!/bin/bash

# Quick Deploy Script for Demo
# This script will deploy both frontend and backend to Cloudflare

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is required. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is required. Please install npm and try again."
        exit 1
    fi
    
    if ! command -v wrangler &> /dev/null; then
        log_warning "Wrangler CLI not found. Installing..."
        npm install -g wrangler
    fi
    
    log_success "Prerequisites check passed"
}

# Deploy backend (Cloudflare Workers)
deploy_backend() {
    log_info "Deploying backend to Cloudflare Workers..."
    
    cd workers
    
    # Install dependencies
    log_info "Installing backend dependencies..."
    npm install
    
    # Deploy to Cloudflare Workers
    log_info "Deploying to Cloudflare Workers..."
    npx wrangler deploy
    
    cd ..
    log_success "Backend deployed successfully!"
}

# Deploy frontend (Cloudflare Pages)
deploy_frontend() {
    log_info "Deploying frontend to Cloudflare Pages..."
    
    cd frontend
    
    # Install dependencies
    log_info "Installing frontend dependencies..."
    npm install
    
    # Build the frontend
    log_info "Building frontend..."
    npm run build
    
    # Deploy to Cloudflare Pages
    log_info "Deploying to Cloudflare Pages..."
    npx wrangler pages deploy dist --project-name=restaurant-dashboard
    
    cd ..
    log_success "Frontend deployed successfully!"
}

# Main function
main() {
    log_info "🚀 Starting deployment process..."
    
    check_prerequisites
    
    # Check if user is authenticated with Cloudflare
    if ! wrangler whoami &> /dev/null; then
        log_warning "Not authenticated with Cloudflare. Please run 'wrangler auth login' first."
        log_info "Opening browser for authentication..."
        wrangler auth login
    fi
    
    # Deploy backend first
    deploy_backend
    
    # Deploy frontend
    deploy_frontend
    
    log_success "🎉 Deployment completed successfully!"
    log_info ""
    log_info "Your applications are now live:"
    log_info "Backend API: https://restaurant-dashboard-api.your-subdomain.workers.dev"
    log_info "Frontend: https://restaurant-dashboard.pages.dev"
    log_info ""
    log_info "Note: You may need to update the API URL in your frontend configuration"
    log_info "if the worker URL is different from what's expected."
}

# Run the deployment
main "$@"