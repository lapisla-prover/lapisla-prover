FROM node:20-slim AS base
RUN corepack enable
COPY ../../ /app
WORKDIR /app/apps/backend
RUN pnpm install --frozen-lockfile
RUN pnpm run prisma:generate
EXPOSE 3000
CMD [ "sh", "-c", "pnpm run prisma:push && pnpm run start:prod" ]
