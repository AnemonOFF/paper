FROM node:18-alpine AS base
FROM base AS deps
RUN echo https://mirror.yandex.ru/mirrors/alpine/v3.16/main > /etc/apk/repositories; \
    echo https://mirror.yandex.ru/mirrors/alpine/v3.16/community >> /etc/apk/repositories \
    echo https://mirror.yandex.ru/mirrors/alpine/v3.16/releases >> /etc/apk/repositories \
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./
COPY . .

RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]