FROM oven/bun:1 as builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

RUN bun run build

FROM oven/bun:1

WORKDIR /app

EXPOSE 3000

CMD ["bun", "run", "serve"] 