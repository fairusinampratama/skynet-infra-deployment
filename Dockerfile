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
COPY server/ ./server/

# Ensure the database file can be created and persisted in the server directory
# Coolify will mount a volume here
RUN mkdir -p /app/server && chown -R node:node /app/server

USER node

EXPOSE 3000

ENV PORT=3000
ENV DB_PATH=/app/server/database.sqlite
ENV NODE_ENV=production

CMD ["npm", "start"]
