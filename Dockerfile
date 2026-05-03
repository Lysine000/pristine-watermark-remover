# Use Node.js LTS
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the application
CMD ["node", "src/server.js"]
