rm -rf ./src/generated
pnpm openapi:generate
rm -rf ./src/generated/openapi/api
rm -rf ./src/generated/openapi/.openapi-generator
rm ./src/generated/openapi/.gitignore
rm ./src/generated/openapi/.openapi-generator-ignore
rm ./src/generated/openapi/configuration.ts
rm ./src/generated/openapi/api.module.ts
rm ./src/generated/openapi/README.md
rm ./src/generated/openapi/variables.ts
rm ./src/generated/openapi/index.ts
rm ./src/generated/openapi/git_push.sh
