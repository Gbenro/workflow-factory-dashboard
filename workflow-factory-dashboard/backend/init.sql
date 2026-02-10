-- Database initialization script for Docker
-- This is run automatically when PostgreSQL starts

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sample data (optional - can be replaced with Alembic migrations)
-- This file is mainly used to ensure the database is ready
-- Actual schema creation is handled by Alembic migrations

-- Tables will be created by alembic upgrade head in docker-compose.yml
