FROM node:20-slim AS base
RUN corepack enable
WORKDIR /app/apps/backend
COPY . /app
RUN pnpm install --frozen-lockfile
RUN apt update && apt install -y openssl
RUN pnpm run prisma:generate
EXPOSE 3000
CMD [ "sh", "-c", "pnpm run prisma:push && pnpm run start:prod" ]
