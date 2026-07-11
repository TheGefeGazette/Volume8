# The Gefe Gazette — Clean Start

This is the clean Milestone A deployment package.

## Important

This version deliberately uses **no environment variables** and makes no Supabase, OpenAI, Tenor, or Giphy calls. Its purpose is to verify that GitHub and Vercel are connected correctly.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Routes

- `/`
- `/editions/bad-decisions-worse-excuses`
- `/offices`
- `/offices/login`
- `/offices/editions/new`
- `/offices/printing-press`

## After this deploys

The next step is to connect Supabase authentication and persistent content without changing the public design.
