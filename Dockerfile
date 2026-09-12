FROM node:24-slim

WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# Production dependencies only; dist/ is built outside the image (host/CI).
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
