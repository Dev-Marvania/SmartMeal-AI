# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Add a step to prune devDependencies
RUN npm prune --production

# Run Stage
FROM node:22-alpine AS runner

WORKDIR /app

# Copy package.json, compiled dist, and production node_modules from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Cloud Run injects the PORT environment variable
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "run", "start"]
