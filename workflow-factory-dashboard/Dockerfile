# Multi-stage build for Workflow Factory Dashboard
# This builds and serves both frontend and backend

FROM node:20-alpine AS builder

WORKDIR /app

# Copy frontend and backend
COPY frontend ./frontend
COPY backend ./backend
COPY package.json package-lock.json ./

# Build frontend
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps
RUN npm run build

# Setup backend
WORKDIR /app/backend
RUN npm install

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built frontend and backend from builder
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public

# Install only production dependencies
WORKDIR /app/backend
RUN npm install --only=production

EXPOSE 8000 3000

# Start backend (API server)
CMD ["npm", "start"]
