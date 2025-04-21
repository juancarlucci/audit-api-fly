# Use official Node LTS base image with a full Linux runtime
FROM node:18-slim

# Set the working directory
WORKDIR /usr/src/app

# Install Puppeteer-compatible packages (needed for headless Chrome)
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  --no-install-recommends && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy everything else
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD [ "node", "server.js" ]
