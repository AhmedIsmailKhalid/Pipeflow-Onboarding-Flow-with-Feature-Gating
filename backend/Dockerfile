FROM node:20-alpine AS base
WORKDIR /app

# Copy root package files for workspace resolution
FROM base AS deps
COPY package*.json ./
COPY backend/package.json ./backend/
COPY backend/prisma ./backend/prisma/
RUN npm install --omit=dev --workspace=backend
RUN cd backend && npx prisma generate

# Build stage
FROM base AS builder
COPY package*.json ./
COPY backend/package.json ./backend/
RUN npm install --workspace=backend
COPY backend/tsconfig.json ./backend/
COPY backend/src ./backend/src
COPY backend/prisma ./backend/prisma
RUN cd backend && npx prisma generate && npm run build

# Production image
FROM base AS runner
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/dist ./backend/dist

WORKDIR /app/backend
EXPOSE 3001

CMD ["node", "dist/server.js"]