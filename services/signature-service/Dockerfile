FROM node:18-alpine

WORKDIR /app

# Solo copiamos package.json para instalar deps
COPY package*.json ./
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Compilamos NestJS
RUN npm run build

# El micro ya sabe qué puerto usar desde main.ts → no definimos nada aquí
CMD ["node", "dist/main.js"]
