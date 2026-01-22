# ---------- base ----------
FROM node:20-alpine AS base
WORKDIR /repo

# ---------- deps ----------
FROM base AS deps
COPY package.json package-lock.json* ./
COPY apps ./apps
COPY packages ./packages
COPY turbo.json ./
RUN npm install

# ---------- build ----------
FROM deps AS build
RUN npx turbo run build --filter=web...

# ---------- runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /repo/apps/web/.next ./.next
COPY --from=build /repo/apps/web/public ./public
COPY --from=build /repo/apps/web/package.json ./package.json
COPY --from=build /repo/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
