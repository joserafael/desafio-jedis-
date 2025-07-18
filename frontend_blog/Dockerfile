# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
# Assuming the build script is named 'build' in package.json
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:1.23-alpine

# Copy the built assets from the 'builder' stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration to also act as a reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf