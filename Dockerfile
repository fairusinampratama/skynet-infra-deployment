# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy production dependencies mapping
COPY package*.json ./
RUN npm install --omit=dev

# Copy the built Vue frontend
COPY --from=build /app/dist ./dist

# Copy the Express backend
COPY backend/ ./backend/

# Copy operational import scripts
COPY scripts/ ./scripts/

# Ensure the database file can be created and persisted in a dedicated data directory
# Coolify will mount a volume here instead of over the source code
RUN mkdir -p /app/data && chown -R node:node /app/data

USER node

EXPOSE 3000

ENV PORT=3000
ENV DB_PATH=/app/data/database.sqlite
ENV NODE_ENV=production
# Default PIN - should be overridden in production via Coolify environment variables
ENV ADMIN_PIN=1990

CMD ["npm", "start"]
