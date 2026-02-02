# Notes App

Minimal notes app with Next.js + Supabase. Deploy to Vercel.

## Setup

1. **Supabase**: Create a project at [supabase.com](https://supabase.com). In SQL Editor, run `supabase/schema.sql` to create the `notes` table.

2. **Env vars**: Copy `.env.local.example` to `.env.local` and add your Supabase URL and anon key (from Project Settings → API).

3. **Run locally**:
   ```bash
   npm install
   npm run dev
   ```

4. **Deploy to Vercel**:
   - Push to GitHub
   - Import repo in [vercel.com](https://vercel.com)
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Project Settings → Environment Variables

## Dependencies

- next
- react / react-dom
- @supabase/supabase-js
