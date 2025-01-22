# install (for development)
```bash
cd apps/backend
pnpm install
source .env.dev && pnpm prisma:generate
```

# run (for development)
```bash
cd apps/backend
source .env.dev && docker compose -f compose.yaml up --watch --build
```

# start prisma studio (for development)
DBに対してGUIから操作できるツール
`compose up`したあとにホストで下記のコマンドを実行
```bash
cd apps/backend
source .env.dev && pnpm prisma:studio
```

# re-generate OpenAPI code
```bash
cd apps/backend
rm -rf src/generated/openapi
nix develop --command pnpm openapi:generate
```

# run (for production)
WIP
