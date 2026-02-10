#!/bin/bash

##############################################################################
# Railway Deployment Script
# 
# This script handles the deployment of the Workflow Factory Dashboard
# to Railway with proper setup, validation, and health checks.
#
# Usage: ./scripts/deploy-to-railway.sh [options]
# Options:
#   -p, --project-id ID      Railway project ID
#   -e, --environment ENV    Deployment environment (staging|production)
#   -n, --no-migrations      Skip database migrations
#   -v, --validate-only      Run validation without deploying
#   -h, --help               Show this help message
#
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=""
ENVIRONMENT="production"
SKIP_MIGRATIONS=false
VALIDATE_ONLY=false
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to print section headers
print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to display help
show_help() {
    head -n 20 "$0" | tail -n +2
}

# Function to check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    local missing_tools=()
    
    # Check for required tools
    if ! command -v railway &> /dev/null; then
        missing_tools+=("railway-cli")
    fi
    
    if ! command -v git &> /dev/null; then
        missing_tools+=("git")
    fi
    
    if ! command -v curl &> /dev/null; then
        missing_tools+=("curl")
    fi
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        echo ""
        echo "Installation instructions:"
        echo "  Railway CLI: npm install -g @railway/cli"
        echo "  Git: https://git-scm.com/download"
        echo "  curl: apt-get install curl (Linux) or brew install curl (macOS)"
        return 1
    fi
    
    print_success "All prerequisites met"
    
    # Check Railway login
    if ! railway whoami &> /dev/null; then
        print_error "Not logged into Railway"
        echo "Run: railway login"
        return 1
    fi
    
    print_success "Railway CLI authenticated"
}

# Function to validate configuration
validate_configuration() {
    print_header "Validating Configuration"
    
    if [ -z "$PROJECT_ID" ]; then
        print_error "Project ID is required"
        return 1
    fi
    
    if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
        print_error "Invalid environment. Must be 'staging' or 'production'"
        return 1
    fi
    
    print_success "Configuration is valid"
}

# Function to validate project files
validate_project_files() {
    print_header "Validating Project Files"
    
    local files_ok=true
    
    # Check required Docker files
    for file in "backend/Dockerfile" "frontend/Dockerfile" "docker-compose.yml"; do
        if [ ! -f "$PROJECT_ROOT/$file" ]; then
            print_warning "Missing: $file"
            files_ok=false
        else
            print_success "Found: $file"
        fi
    done
    
    # Check Node.js dependencies
    if [ ! -f "$PROJECT_ROOT/frontend/package.json" ]; then
        print_error "Missing: frontend/package.json"
        return 1
    fi
    
    # Check Python dependencies
    if [ ! -f "$PROJECT_ROOT/backend/requirements.txt" ]; then
        print_error "Missing: backend/requirements.txt"
        return 1
    fi
    
    print_success "Project files validated"
}

# Function to check git status
check_git_status() {
    print_header "Checking Git Status"
    
    if ! git -C "$PROJECT_ROOT" rev-parse --git-dir > /dev/null 2>&1; then
        print_warning "Not a git repository"
        return 0
    fi
    
    if [ -n "$(git -C "$PROJECT_ROOT" status --porcelain)" ]; then
        print_warning "Uncommitted changes detected"
        git -C "$PROJECT_ROOT" status --short
        echo ""
        read -p "Continue deployment? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment cancelled"
            return 1
        fi
    else
        print_success "Working directory clean"
    fi
    
    # Show current branch and commit
    BRANCH=$(git -C "$PROJECT_ROOT" rev-parse --abbrev-ref HEAD)
    COMMIT=$(git -C "$PROJECT_ROOT" rev-parse --short HEAD)
    print_info "Branch: $BRANCH"
    print_info "Commit: $COMMIT"
}

# Function to build and push services
build_and_push() {
    print_header "Building Services"
    
    print_info "Building backend service..."
    if docker build -f "$PROJECT_ROOT/backend/Dockerfile" \
        -t "workflow-factory-backend:latest" \
        "$PROJECT_ROOT/backend"; then
        print_success "Backend build successful"
    else
        print_error "Backend build failed"
        return 1
    fi
    
    print_info "Building frontend service..."
    if docker build -f "$PROJECT_ROOT/frontend/Dockerfile" \
        -t "workflow-factory-frontend:latest" \
        "$PROJECT_ROOT/frontend"; then
        print_success "Frontend build successful"
    else
        print_error "Frontend build failed"
        return 1
    fi
}

# Function to deploy to Railway
deploy() {
    print_header "Deploying to Railway"
    
    print_info "Deploying project: $PROJECT_ID"
    print_info "Environment: $ENVIRONMENT"
    
    # Push to Railway
    if railway up --projectId "$PROJECT_ID" --detach; then
        print_success "Deployment pushed to Railway"
    else
        print_error "Failed to push deployment to Railway"
        return 1
    fi
    
    print_info "Waiting for deployment to start..."
    sleep 10
}

# Function to run database migrations
run_migrations() {
    if [ "$SKIP_MIGRATIONS" = true ]; then
        print_warning "Skipping database migrations"
        return 0
    fi
    
    print_header "Running Database Migrations"
    
    print_info "Running Alembic migrations..."
    if railway run --service backend alembic upgrade head; then
        print_success "Database migrations completed"
    else
        print_warning "Database migrations may have failed. Check Railway logs."
    fi
}

# Function to wait for deployment
wait_for_deployment() {
    print_header "Waiting for Deployment"
    
    local max_attempts=60
    local attempt=1
    
    print_info "Checking deployment status (max $max_attempts attempts)..."
    
    while [ $attempt -le $max_attempts ]; do
        print_info "Attempt $attempt/$max_attempts..."
        sleep 5
        
        # Get deployment status from Railway
        if railway status --projectId "$PROJECT_ID" 2>/dev/null | grep -q "running"; then
            print_success "Services are running"
            return 0
        fi
        
        ((attempt++))
    done
    
    print_warning "Deployment did not start within timeout period"
    return 1
}

# Function to verify health
verify_health() {
    print_header "Verifying Service Health"
    
    # Get service URLs
    local backend_url=$(railway link --projectId "$PROJECT_ID" | grep backend | awk '{print $NF}' || echo "")
    local frontend_url=$(railway link --projectId "$PROJECT_ID" | grep frontend | awk '{print $NF}' || echo "")
    
    if [ -n "$backend_url" ]; then
        print_info "Checking backend health: $backend_url/api/health"
        if curl -f --max-time 5 "$backend_url/api/health" > /dev/null 2>&1; then
            print_success "Backend is healthy"
        else
            print_warning "Backend health check failed"
        fi
    fi
    
    if [ -n "$frontend_url" ]; then
        print_info "Checking frontend health: $frontend_url"
        if curl -f --max-time 5 "$frontend_url" > /dev/null 2>&1; then
            print_success "Frontend is healthy"
        else
            print_warning "Frontend health check failed"
        fi
    fi
}

# Function to display deployment summary
deployment_summary() {
    print_header "Deployment Summary"
    
    print_success "Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "  1. Verify services: railway status --projectId $PROJECT_ID"
    echo "  2. View logs: railway logs --projectId $PROJECT_ID"
    echo "  3. Access dashboard: https://railway.app/project/$PROJECT_ID"
    echo ""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--project-id)
            PROJECT_ID="$2"
            shift 2
            ;;
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -n|--no-migrations)
            SKIP_MIGRATIONS=true
            shift
            ;;
        -v|--validate-only)
            VALIDATE_ONLY=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main execution
main() {
    print_header "Railway Deployment Script"
    echo "Version: 1.0"
    echo "Environment: $ENVIRONMENT"
    echo ""
    
    # Run checks
    check_prerequisites || exit 1
    validate_project_files || exit 1
    check_git_status || exit 1
    validate_configuration || exit 1
    
    if [ "$VALIDATE_ONLY" = true ]; then
        print_success "Validation passed. Exiting without deployment."
        exit 0
    fi
    
    # Deploy
    build_and_push || exit 1
    deploy || exit 1
    run_migrations || exit 1
    
    # Verify
    wait_for_deployment || exit 1
    verify_health || exit 1
    
    deployment_summary
}

# Run main function
main "$@"
