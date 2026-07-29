FROM node:20-alpine AS base
WORKDIR /app

# 1. Install dependencies for the entire monorepo
FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
RUN npm ci

# 2. Build the applications
FROM deps AS build
COPY . .
# Generate Prisma client and build API
RUN npm run postinstall -w apps/api || true
RUN npm run build -w apps/api
# Build Next.js Web App
RUN npm run build -w apps/web

# ==========================================
# Target: API (Backend)
# ==========================================
FROM base AS api
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api ./apps/api
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["node", "dist/index.js"]

# ==========================================
# Target: WEB (Frontend)
# ==========================================
FROM base AS web
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/web ./apps/web
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["npm", "run", "start"]
