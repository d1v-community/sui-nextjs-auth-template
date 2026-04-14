# Agent Guide (AGENTS.md)

Use this file as the execution contract for work in this template.

## Planning First

- Every non-trivial task must start by pruning stale or already-compressed completed items from `PLAN.md`, then writing the current goal, background, selected validators, and todo list before editing.
- `PLAN.md` is the source of truth for scope, order, verification, evidence, and residual risk.
- Keep at most one todo `in_progress` per execution thread unless work was intentionally delegated in parallel.

## Checkoff Rule

- Do not check off a todo until its assigned validators have passed and the evidence is written into `PLAN.md`.
- If verification fails, keep the todo open, record the failure, and add the corrective next step.
- Never mark work done based on implementation alone.

## Minimum Verification Before Checkoff

- `@onchain-backend-qa`: before checking off backend or contract work, run the relevant backend build/test path and record the result plus any environment blockers.
- `@frontend-ui-qa`: before checking off UI or interaction work, relevant loading, empty, and error states must exist where relevant, and `pnpm frontend:lint` must pass.
- `@cro-copy-qa`: before checking off copy work, rewrite against the CRO-copy standard: ICP + pain + desire, feature-to-benefit framing, and Promise / Proof / Push with short, scannable CTAs.

## Default Commands

- `pnpm frontend:lint`
- `pnpm frontend:build`
- `pnpm backend:build`
- `pnpm backend:test`

Treat failing verification as a blocker and record any missing wallet, chain, or local-tooling dependency in `PLAN.md`.

## Validator Registry

- `@frontend-ui-qa`: landing pages, wallet-connect states, forms, interaction quality, loading/empty/error states
- `@cro-copy-qa`: hero copy, trust copy, proof blocks, CTA hierarchy, onboarding and docs copy
- `@wallet-flow-qa`: wallet connect, disconnected state, wrong-network state, signed-in gated state
- `@onchain-backend-qa`: backend package logic, Move or deployment helpers, build/test stability
- `@responsive-accessibility-qa`: desktop/mobile layout, keyboard reachability, contrast, hierarchy clarity
- `@security-config-qa`: secret handling, local config safety, public template hygiene
- `@docs-setup-qa`: setup docs, command accuracy, first-run clarity, blocker notes
- `@performance-seo-qa`: metadata, above-the-fold clarity, landing-page scanability

## Working Rules

- Keep diffs focused. Avoid unrelated refactors across packages.
- Start from the repo root unless the task is clearly package-local.
- Prefer existing scripts and patterns over new tooling.
- Do not hardcode secrets or commit `.env.local`, build output, package IDs, caches, or deployment metadata.
- Prefer `rg` for search and read files in small chunks.

## Handoff Format

- Each validator handoff must include `Result`, `Checked`, `Passed`, `Failed`, `Not checked`, `Risk`, and `Plan update`.
