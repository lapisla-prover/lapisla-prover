FROM node:20-slim AS base
RUN corepack enable
WORKDIR /app/apps/backend
COPY . /app
RUN cd /app && pnpm install --frozen-lockfile
RUN apt update && apt install -y openssl
RUN pnpm run prisma:generate
RUN pnpm -w build -F backend
EXPOSE 3000
CMD [ "sh", "-c", "cd /app/apps/backend && pnpm run prisma:push && pnpm run start:prod" ]
