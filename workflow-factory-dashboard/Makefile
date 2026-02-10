.PHONY: help setup dev build test lint clean docker-build docker-up docker-down

help:
	@echo "Workflow Factory Dashboard - Available Commands"
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make setup              - Set up development environment"
	@echo "  make install            - Install all dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make dev                - Start development servers (requires tmux)"
	@echo "  make dev-backend        - Start backend dev server"
	@echo "  make dev-frontend       - Start frontend dev server"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  make test               - Run all tests"
	@echo "  make test-backend       - Run backend tests"
	@echo "  make test-frontend      - Run frontend tests"
	@echo "  make lint               - Run linting"
	@echo "  make format             - Format code"
	@echo ""
	@echo "Database:"
	@echo "  make db-init            - Initialize database"
	@echo "  make db-migrate         - Run database migrations"
	@echo "  make db-reset           - Reset database (⚠️ destructive)"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build       - Build Docker images"
	@echo "  make docker-up          - Start services with Docker Compose"
	@echo "  make docker-down        - Stop services"
	@echo "  make docker-logs        - View Docker logs"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean              - Clean build artifacts"
	@echo "  make clean-all          - Clean everything including dependencies"

setup:
	@echo "Setting up development environment..."
	@mkdir -p backend frontend
	@cp backend/.env.example backend/.env
	@cp frontend/.env.example frontend/.env.local
	@echo "✓ Environment files created"
	@echo "Now run: make install"

install:
	@echo "Installing dependencies..."
	@echo "Installing backend dependencies..."
	@cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	@cd frontend && npm install
	@echo "✓ All dependencies installed"

dev-backend:
	@echo "Starting backend development server..."
	@cd backend && python -m venv venv && source venv/bin/activate && uvicorn app.main:app --reload

dev-frontend:
	@echo "Starting frontend development server..."
	@cd frontend && npm run dev

dev:
	@echo "Starting all services with Docker Compose..."
	@docker-compose up

test:
	@echo "Running all tests..."
	@make test-backend
	@make test-frontend

test-backend:
	@echo "Running backend tests..."
	@cd backend && pytest --cov=app

test-frontend:
	@echo "Running frontend tests..."
	@cd frontend && npm test -- --coverage

lint:
	@echo "Running linters..."
	@echo "Linting frontend..."
	@cd frontend && npm run lint
	@echo "Linting backend..."
	@cd backend && pylint app/

format:
	@echo "Formatting code..."
	@echo "Formatting backend..."
	@cd backend && black app/ tests/
	@echo "Formatting frontend..."
	@cd frontend && npx prettier --write "app/**/*.{js,jsx,ts,tsx,json,css,md}"

db-init:
	@echo "Initializing database..."
	@cd backend && alembic upgrade head

db-migrate:
	@echo "Running database migrations..."
	@cd backend && alembic upgrade head

db-reset:
	@echo "⚠️  Resetting database (this deletes all data)..."
	@cd backend && alembic downgrade base && alembic upgrade head

docker-build:
	@echo "Building Docker images..."
	@docker-compose build

docker-up:
	@echo "Starting services..."
	@docker-compose up -d
	@echo "✓ Services started"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:8000"
	@echo "Swagger:  http://localhost:8000/docs"

docker-down:
	@echo "Stopping services..."
	@docker-compose down

docker-logs:
	@docker-compose logs -f

clean:
	@echo "Cleaning build artifacts..."
	@cd backend && find . -type d -name "__pycache__" -exec rm -rf {} +
	@cd backend && find . -type f -name "*.pyc" -delete
	@cd frontend && rm -rf .next/ build/ dist/
	@echo "✓ Cleaned"

clean-all: clean
	@echo "Removing all dependencies..."
	@cd backend && rm -rf venv/
	@cd frontend && rm -rf node_modules/
	@echo "✓ Fully cleaned"

.PHONY: help setup install dev dev-backend dev-frontend test test-backend test-frontend lint format db-init db-migrate db-reset docker-build docker-up docker-down docker-logs clean clean-all
