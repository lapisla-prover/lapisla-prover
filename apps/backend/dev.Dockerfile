FROM node:20-slim AS base
RUN npm install -g corepack@^0.31.0
RUN corepack enable
WORKDIR /app/apps/backend
COPY . /app
RUN cd /app && pnpm install --frozen-lockfile
RUN apt update && apt install -y openssl
RUN pnpm run prisma:generate
RUN pnpm -w build -F backend
EXPOSE 3000
CMD [ "sh", "-c", "cd /app/apps/backend && pnpm run prisma:push && export DEV=true && pnpm run start:prod" ]
