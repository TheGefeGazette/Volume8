# CLEAN RESTART: GitHub → Vercel

## Part 1 — Create a brand-new GitHub repository

1. Sign in to GitHub.
2. Click the `+` button in the upper-right corner.
3. Select **New repository**.
4. Repository name: `gefe-gazette`.
5. Choose **Public** or **Private**.
6. Do not add a README, `.gitignore`, or license.
7. Click **Create repository**.

## Part 2 — Upload without flattening the folders

The safest approach is GitHub Desktop.

1. Install and open GitHub Desktop.
2. Choose **File → Clone repository**.
3. Select the new `gefe-gazette` repository.
4. Choose a local folder and click **Clone**.
5. Unzip `gefe-gazette-clean-start.zip`.
6. Open the unzipped folder.
7. Copy everything inside it, including:
   - `app`
   - `components`
   - `lib`
   - `types`
   - `package.json`
   - the remaining configuration files
8. Paste those items into the local folder GitHub Desktop created.

Do not paste the outer `gefe-gazette-clean-start` folder itself. Paste its contents.

9. Return to GitHub Desktop.
10. Enter summary: `Initial Gefe Gazette foundation`.
11. Click **Commit to main**.
12. Click **Push origin**.

## Part 3 — Verify GitHub before touching Vercel

Open the repository in your browser.

At the top level you must see:

- `app`
- `components`
- `lib`
- `types`
- `package.json`
- `tsconfig.json`
- `next.config.ts`

Open `app`. It must contain:

- `page.tsx`
- `layout.tsx`
- `globals.css`
- `editions`
- `offices`

If instead you see files named `page(1).tsx`, `page(2).tsx`, or similar, stop. The folders were flattened and the upload is incorrect.

## Part 4 — Create a fresh Vercel project

1. Sign in to Vercel.
2. Choose **Add New → Project**.
3. Import the new `gefe-gazette` GitHub repository.
4. Before deploying, verify:
   - Framework Preset: **Next.js**
   - Root Directory: `./` or left at the repository root
   - Build Command: leave at the default
   - Output Directory: leave at the default
5. Under Environment Variables:
   - add nothing
   - remove any automatically copied placeholders
6. Click **Deploy**.

This clean-start version intentionally does not use Supabase, OpenAI, Tenor, or Giphy, so no keys are needed.

## Part 5 — Confirm success

Wait until Vercel says **Congratulations** or the deployment status says **Ready**.

Use the **Visit** button supplied by Vercel.

The homepage should show a folded copy of The Gefe Gazette.

Test these routes:

- `/`
- `/editions/bad-decisions-worse-excuses`
- `/offices`
- `/offices/login`
- `/offices/editions/new`
- `/offices/printing-press`

## Part 6 — Only after this works

Then connect Supabase. That will be a separate change and separate deployment, so any problem will be much easier to identify.
