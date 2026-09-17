FROM --platform=linux/amd64 node:24-slim

WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# Install the runtime graph used by the swarm registry and its actors.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY dist ./dist
COPY public ./public
ENV RIVETKIT_PUBLIC_DIR=/app/public

EXPOSE 3000

CMD ["node", "dist/server.js"]
