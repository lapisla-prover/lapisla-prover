# install (for development)
```bash
cd apps/backend
pnpm install
pnpm prisma:generate
```

# run (for development)
```bash
cd apps/backend
source .env.dev && docker compose -f compose.yaml up --watch --build
```

# run (for production)
WIP
