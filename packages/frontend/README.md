This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Optional storage upload support

This template includes a minimal `storage.d1v.ai` upload entry for wallet users.

Required server env:

```env
STORAGE_BASE_URL=https://storage.d1v.ai
STORAGE_API_KEY=sk_xxxxxxxxxxxxxxxxx
```

Optional:

```env
STORAGE_PUBLIC_BASE_URL=https://storage.d1v.ai/public/files
STORAGE_PROJECT_ID=project_xxx
STORAGE_PROJECT_EMAIL=project-id@d1vproject.d1v.ai
```

Behavior:

- if storage env exists, connected wallet users can upload an avatar-like image through `/api/users/avatar`
- if storage env is missing, UI stays disabled and the API returns a clear configuration error
- storage docs: `https://storage.d1v.ai/docs`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
