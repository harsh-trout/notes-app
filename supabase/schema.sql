-- Run this in Supabase SQL Editor to create the notes table
create table notes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (optional - allows public read/write for simplicity)
-- For production, add auth and RLS policies
alter table notes enable row level security;

create policy "Allow all for notes" on notes for all using (true) with check (true);
