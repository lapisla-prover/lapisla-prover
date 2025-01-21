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

# re-generate OpenAPI code
```bash
cd apps/backend
rm -rf src/generated/openapi
nix develop --command pnpm openapi:generate
```

# run (for production)
WIP
