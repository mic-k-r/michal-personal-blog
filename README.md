# Michal's Personal Blog

A small, fast personal blog with a private admin area for writing posts in
Markdown and uploading photos. Built to look simple and a little retro, but responsive and modern under the hood.

**Stack:** Next.js (App Router) · TypeScript · SCSS · Supabase
(auth + Postgres + Storage) · deploys free on Vercel.

---

## Features

- Public blog: home page lists posts newest-first; each post has its own page.
- Private admin area at `/admin` (email + password login).
- Write posts in **Markdown** (no length limit).
- **Photo uploads**: pick images in the editor; they upload to Supabase
  Storage and are inserted into the post as Markdown image tags at your cursor.
- Create / edit / delete posts. Live Markdown preview while writing.
- Fully responsive (flexbox + fluid type), keyboard-focus styles, fast
  server-rendered pages.

---

## 1. Prerequisites

- **Node.js 18.18+** (20 LTS recommended) and npm.
- A free **Supabase** account: <https://supabase.com>
- A free **Vercel** account for deploy (optional but recommended):
  <https://vercel.com>

---

## 2. Create your Supabase project

1. In the Supabase dashboard, create a new project. Pick a strong database
   password (you won't need it for this app, but keep it safe).
2. Open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and click **Run**. This
   creates the `posts` table, security rules, and the `post-images` storage
   bucket.
3. Create your admin login: **Authentication → Users → Add user → Create new
   user**. Enter the email and password you'll log in with, and tick
   "Auto-confirm user" so you can sign in right away.
   - Recommended: under **Authentication → Sign In / Providers → Email**, turn
     **off** "Allow new users to sign up" so only you can have an account.
4. Get your API keys: **Project Settings → API**. You need the **Project URL**
   and the **anon / publishable** key.

---

## 3. Run it locally

```bash
npm install

# create your env file and paste in the two values from Supabase
cp .env.local.example .env.local
# then edit .env.local

npm run dev
```

Open <http://localhost:3000>. The public site is at `/`, and the admin login
is at `/admin` (you'll be redirected to `/admin/login`).

Your `.env.local` should contain:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

---

## 4. Writing posts

1. Go to `/admin`, sign in.
2. Click **+ New post**.
3. Give it a title and write the body in Markdown.
4. To add photos, use **Add photos** — selected images upload and a Markdown
   image tag is inserted where your cursor is. Use **Preview** to see the
   rendered result before publishing.
5. Click **Publish**. The post appears on the home page immediately.

Markdown supports headings, **bold**, _italics_, lists, links, quotes, code,
tables, and images.

---

## 5. Make it yours

- **Name & tagline:** edit [`src/lib/site.ts`](./src/lib/site.ts).
- **Look & feel:** all styling lives in
  [`src/app/globals.scss`](./src/app/globals.scss). The design tokens
  (colors, fonts, content width) are variables at the top of that file —
  change those first.

---

## 6. Deploy to Vercel

1. Push this project to a GitHub repo.
2. In Vercel, **Add New → Project** and import the repo.
3. Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the project settings.
4. Deploy. Vercel auto-detects Next.js — no extra config needed.

Your Supabase project already lives in the cloud, so the deployed site uses the
same database and photos. Family and friends can visit your Vercel URL; only
you can reach `/admin`.

> Tip: in Supabase, you can later add your Vercel domain under
> **Authentication → URL Configuration** if you add features like email links.

---

## Project structure

```
src/
  app/
    layout.tsx            # header / footer shell + global SCSS
    page.tsx              # home: list of posts
    globals.scss          # all styles (early-2000s tokens at the top)
    not-found.tsx         # 404
    posts/[slug]/page.tsx # single post (renders Markdown)
    admin/
      page.tsx            # dashboard: list / edit / delete / sign out
      actions.ts          # server actions: create/update/delete/logout
      login/              # login page + action
      new/                # new-post page + the PostEditor client component
      edit/[id]/          # edit-post page
  components/
    SiteHeader.tsx
    SiteFooter.tsx
    Markdown.tsx          # react-markdown + GFM renderer
  lib/
    supabase/             # server, browser, and middleware clients
    site.ts               # title / tagline / author
    slug.ts               # slugify + date formatting
    excerpt.ts            # plain-text previews
    types.ts
middleware.ts             # refreshes auth + guards /admin
supabase/schema.sql       # run once in Supabase
```

---

## Optional next steps

- Swap plain `<img>` for `next/image` if you want automatic image
  optimization (kept simple here on purpose).
- Add a draft/published flag, tags, or an RSS feed.
- Add a comments section (e.g., a `comments` table with public insert).
```
