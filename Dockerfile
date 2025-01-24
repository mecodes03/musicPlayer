# Target Node.js LTS version
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependencies installation stage
FROM base AS deps
WORKDIR /app

# Copy package manifests
COPY package.json pnpm-lock.yaml* ./

# Install dependencies with pnpm
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Networking configuration
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start command
CMD ["node", "server.js"]
