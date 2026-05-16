create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  datetime timestamptz not null,
  yclients_record_id bigint,
  status text not null default 'pending',
  source text not null default 'ai_chat',
  ai_summary text,
  error_message text,
  created_at timestamptz not null default now()
);
alter table public.bookings enable row level security;
create policy "Anyone can create a booking"
on public.bookings for insert to anon, authenticated
with check (
  length(name) between 1 and 100
  and length(phone) between 3 and 50
  and source = any (array['ai_chat','widget','form'])
  and status = any (array['pending','confirmed','failed'])
);