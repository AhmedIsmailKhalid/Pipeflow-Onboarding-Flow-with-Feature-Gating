FROM node:20-alpine AS base
# Install OpenSSL for Prisma
RUN apk add --no-cache openssl
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package.json ./
COPY prisma ./prisma/
RUN npm install --omit=dev
RUN npx prisma generate

# Build stage
FROM base AS builder
COPY package.json ./
COPY tsconfig.json ./
RUN npm install
COPY src ./src
COPY prisma ./prisma
RUN npx prisma generate && npm run build

# Production image
FROM base AS runner
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/server.js"]