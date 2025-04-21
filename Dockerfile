# Use Playwright base image with Chromium & dependencies
FROM mcr.microsoft.com/playwright:v1.43.1-jammy

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]
