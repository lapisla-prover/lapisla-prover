FROM node:20-slim AS base
RUN corepack enable
WORKDIR /app/apps/backend
COPY . /app
RUN cd /app && pnpm install --frozen-lockfile
RUN apt update && apt install -y openssl
EXPOSE 3002
CMD [ "sh", "-c", "pnpm run prisma:push && pnpm run start:prod" ]
