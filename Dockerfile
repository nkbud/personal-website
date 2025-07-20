# Frontend Dockerfile for local development
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port for Vite dev server
EXPOSE 5173

# Start development server with host binding for Docker
CMD ["npx", "vite", "--host", "0.0.0.0"]