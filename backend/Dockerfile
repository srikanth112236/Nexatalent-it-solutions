# ------------------------------------------------------------------
# NexaTalent Backend — Production Dockerfile
# ------------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm ci --include=dev
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/src/validate/schemas.ts ./src/validate/schemas.ts || true
RUN npm ci --only=production
RUN mkdir -p /app/data
EXPOSE 5000
CMD ["node", "dist/server.js"]
