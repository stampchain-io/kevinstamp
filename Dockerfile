# Multi-stage Dockerfile for kevinstamp Node.js application
# Stage 1: Build environment
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the React frontend and server bundle
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS runtime

# Install dumb-init for signal handling in containers
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S kevinstamp -u 1001

# Set working directory
WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=kevinstamp:nodejs /app/dist ./dist
COPY --from=builder --chown=kevinstamp:nodejs /app/client/dist ./client/dist

# Copy necessary runtime files
COPY --chown=kevinstamp:nodejs server ./server
COPY --chown=kevinstamp:nodejs shared ./shared
COPY --chown=kevinstamp:nodejs attached_assets ./attached_assets

# Create logs directory
RUN mkdir -p /app/logs && chown kevinstamp:nodejs /app/logs

# Switch to non-root user
USER kevinstamp

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { \
    process.exit(res.statusCode === 200 ? 0 : 1) \
  }).on('error', () => process.exit(1))"

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]