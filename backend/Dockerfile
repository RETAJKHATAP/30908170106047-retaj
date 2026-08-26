# ---- Backend Dockerfile ----
FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the source code
COPY . .

# Directory used for uploaded product images
RUN mkdir -p uploads

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "src/server.js"]
