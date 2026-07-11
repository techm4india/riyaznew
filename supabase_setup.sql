-- Supabase SQL Script to create contact_submissions table
-- Copy and paste this script directly into the Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Create the table
create table if not exists public.contact_submissions (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    first_name text not null,
    last_name text,
    email text not null,
    organisation text,
    role text,
    message text not null
);

-- 2. Enable Row Level Security (RLS) to protect submissions data
alter table public.contact_submissions enable row level security;

-- 3. Create RLS Policy: Allow anyone (anonymous public users) to insert new submissions
create policy "Allow anonymous inserts" 
on public.contact_submissions 
for insert 
to anon 
with check (true);

-- 4. Create RLS Policy: Only authenticated admin dashboard users can read submissions
create policy "Allow authenticated reads" 
on public.contact_submissions 
for select 
to authenticated 
using (true);

-- 5. Create RLS Policy: Only authenticated admin dashboard users can update submissions
create policy "Allow authenticated updates" 
on public.contact_submissions 
for update 
to authenticated 
using (true);

-- 6. Create RLS Policy: Only authenticated admin dashboard users can delete submissions
create policy "Allow authenticated deletes" 
on public.contact_submissions 
for delete 
to authenticated 
using (true);
