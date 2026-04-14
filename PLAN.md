# Goal: Turn Sui Next.js Auth Into a More Credible Wallet-First Foundation

## Design Thinking And Demand Background

- ICP: Web3 teams that need a starter with wallet trust, clear onboarding, and credible app-shell communication.
- Core pain: wallet-first templates often expose technical pieces but under-explain the user value and setup path.
- Desired outcome: a foundation that feels trustworthy to end users and practical to builders touching frontend plus on-chain helpers.
- Product standard for this cycle: stronger conversion copy, accurate setup guidance, and verified wallet/back-end package health.

## Validators For This Cycle

- Reuse the validator registry from `AGENTS.md`.
- Selected validators: `@cro-copy-qa`, `@frontend-ui-qa`, `@wallet-flow-qa`, `@onchain-backend-qa`, `@responsive-accessibility-qa`, `@security-config-qa`, `@docs-setup-qa`, `@performance-seo-qa`.

## Todo List

- [ ] Ideate a short, creative product name and replace `D1V DEMO` globally.
  - Owner: main agent
  - Verification: choose a final name, run `rg -n "D1V DEMO" .`, and confirm only intentional planning references remain
  - Status: pending
  - Evidence: pending
  - Notes: update header, meta description, assistant title, CTA buttons, pricing/product labels, and any other user-visible brand references together.

- [ ] Rewrite the original landing-page and setup copy so the foundation sells user trust and builder clarity. `@cro-copy-qa` `@frontend-ui-qa` `@docs-setup-qa`
  - Owner: main agent
  - Verification: manual review of hero, proof, CTA, wallet onboarding, and setup-doc copy against the CRO-copy standard
  - Status: pending
  - Evidence: pending
  - Notes: focus on outcome-first wording rather than chain jargon.

- [ ] Verify the frontend and backend package health and fix blockers before checkoff. `@onchain-backend-qa` `@wallet-flow-qa` `@security-config-qa`
  - Owner: main agent
  - Verification: `pnpm frontend:lint`, `pnpm frontend:build`, `pnpm backend:build`, and `pnpm backend:test`
  - Status: pending
  - Evidence: pending
  - Notes: this template has backend packages but not the relational `db:migrate` workflow used in the Remix templates.

- [ ] Re-walk the core wallet-first journey after the copy and verification pass. `@frontend-ui-qa` `@wallet-flow-qa` `@responsive-accessibility-qa`
  - Owner: main agent
  - Verification: manual walkthrough of entry -> wallet connect -> wrong-state handling -> signed-in or gated value state
  - Status: pending
  - Evidence: pending
  - Notes: any missing setup assumptions must be pushed back into docs before this is checked off.
