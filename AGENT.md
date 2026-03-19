# Repository Instructions for AI Agents

`AGENTS.md` is the standard filename in the OpenAI/Codex docs. If this repo keeps using `AGENT.md`, make sure your agent runtime is configured to read it as a fallback filename.

## Goal

This repository is a `pnpm` monorepo for a Sui dApp:

- `packages/frontend`: Next.js 16 app, App Router, static export build
- `packages/backend`: Move package plus Suibase-based network and deployment helpers

When making changes, keep edits scoped to the package that owns the behavior.

## Working Rules

- Start from the repo root unless a task is clearly package-local.
- Prefer minimal diffs; do not refactor unrelated code while solving a focused task.
- Check for existing uncommitted changes before editing and avoid overwriting user work.
- Prefer `rg` for code search and `pnpm` scripts for build, lint, test, and deploy workflows.
- Do not edit generated or environment-specific files unless the task explicitly requires it:
  - `packages/frontend/next-env.d.ts`
  - `packages/frontend/dist/**`
  - `packages/frontend/.next/**`
  - `packages/frontend/.env.local`

## Common Commands

Run these from the repository root:

- `pnpm dev`: start the frontend dev server
- `pnpm build`: build backend and frontend
- `pnpm lint`: lint the frontend
- `pnpm test`: run backend Move tests
- `pnpm frontend:build`
- `pnpm frontend:lint`
- `pnpm backend:build`
- `pnpm backend:test`

Network and deployment helpers:

- `pnpm localnet:start`
- `pnpm localnet:deploy`
- `pnpm devnet:deploy`
- `pnpm testnet:deploy`
- `pnpm mainnet:deploy`

These depend on Suibase and local Sui tooling. Do not assume they are available unless verified in the environment.

## Frontend Notes

- Frontend source lives under `packages/frontend/src/app`.
- Use the existing path alias: `~~/* -> packages/frontend/src/app/*`.
- The frontend is built as a static export:
  - `packages/frontend/next.config.ts` sets `output: "export"`
  - build output goes to `packages/frontend/dist`
- Follow the existing project structure:
  - shared UI: `components/`
  - app-wide config: `config/`
  - providers: `providers/`
  - Sui dApp logic: `dapp/`
- Prefer existing patterns and dependencies already used in the app before introducing new ones.

Frontend verification after UI or TypeScript changes:

- `pnpm frontend:lint`
- `pnpm frontend:build`

## Backend Notes

- The Move package is in `packages/backend/move/greeting`.
- Build and test through the provided scripts instead of calling Move tooling manually unless necessary.
- Deployment scripts write contract package IDs into `packages/frontend/.env.local`.
- Do not hardcode deployed package IDs in frontend code; read them from the expected env vars.

Backend verification after Move or deployment-script changes:

- `pnpm backend:build`
- `pnpm backend:test`

## Task Routing

- For wallet, network, or transaction UI issues, inspect both:
  - `packages/frontend/src/app/dapp/**`
  - `packages/frontend/src/app/config/**`
- For contract behavior changes, update both:
  - `packages/backend/move/greeting/**`
  - any frontend code that depends on the contract interface
- For deployment or environment-variable issues, inspect:
  - `packages/backend/scripts/copy-package-id.js`
  - `packages/frontend/.env.local` usage sites
  - `vercel.json` when the issue is specific to production deployment

## Response Expectations

- State assumptions when environment-dependent commands cannot be verified locally.
- Report what was changed, what was verified, and what could not be verified.
- If a task is ambiguous, inspect the relevant package first and choose the smallest reasonable implementation.
