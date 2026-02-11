# Multi-stage build for optimized production frontend

# Stage 1: Builder
FROM node:18-alpine as builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev && \
    cp -R node_modules /prod_node_modules && \
    npm install

# Copy source
COPY . .

# Build Next.js application
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine as runtime

WORKDIR /app

# Install runtime dependencies only
RUN apk add --no-cache curl

# Copy production node_modules from builder
COPY --from=builder /prod_node_modules ./node_modules

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js 2>/dev/null || true

# Create non-root user for security
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

# Change ownership
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Set environment
ENV NODE_ENV=production \
    PORT=3000

# Expose port
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT}/ || exit 1

# Start application
CMD ["npm", "run", "start"]
