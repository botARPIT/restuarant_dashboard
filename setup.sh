#!/bin/bash

# Quick Setup Script for Restaurant Dashboard Demo
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🍽️  Restaurant Dashboard Demo Setup${NC}"
echo "=================================="
echo ""

# Check Node.js
echo -e "${BLUE}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Please install Node.js 18+ first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Install root dependencies
echo -e "${BLUE}Installing root dependencies...${NC}"
npm install

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
cd workers && npm install && cd ..

# Install frontend dependencies  
echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd frontend && npm install && cd ..

# Install Wrangler globally if not present
echo -e "${BLUE}Checking Wrangler CLI...${NC}"
if ! command -v wrangler &> /dev/null; then
    echo -e "${BLUE}Installing Wrangler CLI globally...${NC}"
    npm install -g wrangler
fi
echo -e "${GREEN}✓ Wrangler CLI ready${NC}"

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Run 'wrangler auth login' to authenticate with Cloudflare"
echo "2. Run 'npm run dev' for local development"
echo "3. Run './deploy.sh' to deploy to Cloudflare"
echo ""
echo "Local URLs:"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8787"