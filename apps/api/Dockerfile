FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY tsconfig.json ./tsconfig.json
COPY src ./src

RUN bunx prisma generate

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "src/server.ts"]
