# Sui Studio
[![Build and Lint (frontend)](https://github.com/suiware/sui-dapp-starter/actions/workflows/build_and_lint.yaml/badge.svg)](https://github.com/suiware/sui-dapp-starter/actions/workflows/build_and_lint.yaml)
[![Discord chat](https://img.shields.io/discord/1237259509366521866.svg?logo=discord&style=flat-square)](https://discord.com/invite/HuDPpXz4Hx)

[中文文档](./README.zh-CN.md)

![Spoiler](https://repository-images.githubusercontent.com/794883099/f0937c6b-c021-41db-b44a-a287b29111c3)

Built on top of Sui dApp Starter with appreciation for the original project. This repository focuses on the work added here: a Next.js-based Sui app, Move contract deployment helpers, wallet-driven app flow, database-backed user sync, and root-level Vercel deployment.

## Overview

This repo is a `pnpm` monorepo:

- `packages/frontend`: Next.js app
- `packages/backend`: Move package + Suibase helpers

What this project includes:

- Wallet connect flow with custom connection UI
- Network-aware contract access driven by `NEXT_PUBLIC_*_CONTRACT_PACKAGE_ID`
- Automatic Move package ID sync into `packages/frontend/.env.local` after deployment
- Database-backed wallet user upsert through Next.js route handlers
- SQL migration runner and migration generator in the frontend package
- Root-level Vercel deployment through [`vercel.json`](/Users/apple/project/sui-nextjs-auth-template/vercel.json)

## Prerequisites

Before you begin, install the following:

- [Suibase](https://suibase.io/how-to/install.html)
- [Node (>= 20)](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)

## Install

From the repository root:

```bash
pnpm install
```

## Develop

Start the frontend dev server from the repository root:

```bash
pnpm dev
```

## Frontend Deployment

Deploy the frontend to Vercel from the repository root:

```bash
pnpm vercel:prod
```

Notes:

- The repo root includes [`vercel.json`](/Users/apple/project/sui-nextjs-auth-template/vercel.json), so `vercel` and `vercel --prod` build the Next.js app in `packages/frontend`.
- If you deploy through the Vercel dashboard, keep the project root at the repository root so this config is picked up.

## Database and Migrations

The frontend supports server-side database access through Next.js route handlers.

Required env:

- `DATABASE_URL=...`

What is included:

- Wallet login auto-sync: when a user connects a wallet, the frontend calls [`/api/users`](/Users/apple/project/sui-nextjs-auth-template/packages/frontend/src/app/api/users/route.ts) and upserts the user into the database.
- SQL migration runner: execute `.sql` files in order and track them in `schema_migrations`.
- Migration generator: create sequential files like `00001_init.sql`, `00002_add_profiles.sql`.

Commands:

```bash
pnpm --filter frontend db:create-migration add_profiles
pnpm --filter frontend db:migrate
pnpm --filter frontend test
```

Migration files live in:

- [`packages/frontend/db/migrations`](/Users/apple/project/sui-nextjs-auth-template/packages/frontend/db/migrations)

The initial migration is already included:

- [`packages/frontend/db/migrations/00001_init.sql`](/Users/apple/project/sui-nextjs-auth-template/packages/frontend/db/migrations/00001_init.sql)

Current database behavior:

- The migration upgrades the existing `users` table to support wallet fields.
- Wallet connect creates or updates a user by `wallet_address`.
- The API stores `wallet_address`, `wallet_name`, `chain`, and `last_seen_at`.

## Move Contract Deployment

The backend here is a Move package. Deploying it also writes the deployed package ID into `packages/frontend/.env.local` so the frontend can call the contract.

### Localnet

1. Start local network and explorer:

```bash
pnpm localnet:start
```

2. Deploy the Move package to localnet:

```bash
pnpm localnet:deploy
```

After a successful deploy, `packages/frontend/.env.local` will be created or updated with:

- `NEXT_PUBLIC_LOCALNET_CONTRACT_PACKAGE_ID=...`

### Devnet / Testnet / Mainnet

1. Ensure the corresponding network setup is ready:

```bash
pnpm devnet:start
# or: pnpm testnet:start
# or: pnpm mainnet:start
```

2. Deploy:

```bash
pnpm devnet:deploy
# or: pnpm testnet:deploy
# or: pnpm mainnet:deploy
```

This creates or updates `packages/frontend/.env.local` with:

- `NEXT_PUBLIC_DEVNET_CONTRACT_PACKAGE_ID=...`
- `NEXT_PUBLIC_TESTNET_CONTRACT_PACKAGE_ID=...`
- `NEXT_PUBLIC_MAINNET_CONTRACT_PACKAGE_ID=...`

Notes:

- Mainnet has no faucet; you need a funded address.
- Useful helpers: `pnpm devnet:address` / `pnpm testnet:address` / `pnpm mainnet:address` and `pnpm devnet:links` / `pnpm testnet:links` / `pnpm mainnet:links`.
- If you run into dependency verification issues, there are `*:deploy:no-dependency-check` scripts.
- If you deploy from another machine or CI, set the same `NEXT_PUBLIC_*_CONTRACT_PACKAGE_ID` env vars there as well.

## Localnet Helpers

```bash
pnpm localnet:status
pnpm localnet:stop
pnpm localnet:faucet 0xYOURADDRESS
```

## License

Copyright (c) 2024 Konstantin Komelin and other contributors

Code is licensed under [MIT](https://github.com/suiware/sui-dapp-starter?tab=MIT-1-ov-file)

SVG graphics used for NFTs are licensed under [CC-BY 4.0](https://github.com/suiware/sui-dapp-starter?tab=CC-BY-4.0-2-ov-file)
