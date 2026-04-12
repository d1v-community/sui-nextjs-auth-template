# Agent Guide (AGENTS.md)

These instructions apply to the entire `sui-nextjs-auth-template` repository.

`AGENTS.md` is the canonical filename for this repo. `AGENT.md` remains only as a compatibility note for tooling that still looks for the singular name.

## Goal

This repository is a `pnpm` monorepo for a Sui dApp:

- `packages/frontend`: Next.js app
- `packages/backend`: Move package and deployment helpers

When making changes, keep edits scoped to the package that owns the behavior.

## Workflow

- For any non-trivial task, create or update a written plan before editing code.
- Treat the plan as the source of truth for order, verification, and remaining risk.
- Every meaningful todo should include owner, verification method, status, and evidence.
- Do not mark work complete until the required verification has passed.

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

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm test`
- `pnpm frontend:build`
- `pnpm frontend:lint`
- `pnpm backend:build`
- `pnpm backend:test`

These depend on local Sui/Suibase tooling. Do not assume they are available unless verified in the environment.

## Verification

- After frontend or TypeScript changes, run:
  - `pnpm frontend:lint`
  - `pnpm frontend:build`
- After backend Move or deployment-script changes, run:
  - `pnpm backend:build`
  - `pnpm backend:test`
- If an environment dependency blocks verification, record the blocker explicitly in the plan and handoff.

## Security

- Do not print or hardcode secrets.
- Do not commit `.env`, `.env.local`, local package IDs, deployment caches, or generated build output.

## Operational

- Do not run `git commit` or create branches unless explicitly asked.
- Report what changed, what was verified, what could not be verified, and the remaining risk.

---

中文提示（简要）：

- 先写计划，再改代码。
- 每个 todo 要有验证方式和证据。
- 不要提交 `.env`、构建产物或本地部署缓存。
