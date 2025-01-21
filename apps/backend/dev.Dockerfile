FROM node:18
WORKDIR /app
COPY . /app/
RUN npm install -g pnpm
RUN pnpm install
