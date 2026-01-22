FROM node:18-alpine

# ===============================
# Dependencias para Puppeteer + Chromium
# ===============================
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  udev \
  bash

# ⚠️ PATH CORRECTO EN ALPINE
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/main.js"]
