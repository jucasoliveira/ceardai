This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/ceardai

# Better Auth secret — generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=your-secret-here

# Better Auth base URL (server-side)
BETTER_AUTH_URL=http://localhost:3000

# Better Auth base URL (client-side)
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Resend API key for invite emails
RESEND_API_KEY=re_xxxxxxxxx
```

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection URI. Must point to a running MongoDB instance. |
| `BETTER_AUTH_SECRET` | Secret key used by Better Auth for signing sessions. Generate a secure value with `openssl rand -base64 32`. |
| `BETTER_AUTH_URL` | The base URL of the application, used server-side by Better Auth. |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Same base URL, exposed to the client for the auth client SDK. |
| `RESEND_API_KEY` | API key from [Resend](https://resend.com) for sending founder invite emails. |

## Getting Started

Make sure MongoDB is running, then start the development server:

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
