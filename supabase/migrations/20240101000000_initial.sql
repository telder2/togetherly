-- Togetherly schema

create table groups (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  created_by uuid,
  created_at timestamptz default now()
);

create table group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade,
  name text not null,
  avatar_seed text not null,
  role text not null default 'member' check (role in ('owner','member')),
  device_id text,
  joined_at timestamptz default now(),
  unique (group_id, name)
);

alter table groups
  add constraint groups_created_by_fkey
  foreign key (created_by) references group_members(id);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade,
  code text not null,
  mode text not null check (mode in ('party','family')),
  theme text not null,
  status text not null default 'lobby' check (status in ('lobby','playing','revealed','ended')),
  host_member_id uuid references group_members(id),
  current_question_index int default 0,
  session_results jsonb,
  created_at timestamptz default now(),
  revealed_at timestamptz
);

create table session_participants (
  session_id uuid references sessions(id) on delete cascade,
  member_id uuid references group_members(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (session_id, member_id)
);

create table questions (
  id text primary key,
  mode text not null,
  theme text not null,
  category text,
  prompt text not null,
  option_a text not null,
  option_b text not null,
  order_index int not null
);

create table answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  member_id uuid references group_members(id) on delete cascade,
  question_id text references questions(id),
  value int not null check (value between 1 and 4),
  target_member_id uuid references group_members(id),
  created_at timestamptz default now(),
  unique (session_id, member_id, question_id, target_member_id)
);

-- Indexes
create index on group_members (group_id);
create index on sessions (group_id);
create index on sessions (status);
create index on session_participants (session_id);
create index on session_participants (member_id);
create index on answers (session_id);
create index on answers (member_id);
create index on answers (session_id, member_id);

-- Enable Realtime
alter publication supabase_realtime add table sessions;
alter publication supabase_realtime add table session_participants;
alter publication supabase_realtime add table answers;

-- RLS (permissive for v1)
alter table groups enable row level security;
alter table group_members enable row level security;
alter table sessions enable row level security;
alter table session_participants enable row level security;
alter table questions enable row level security;
alter table answers enable row level security;

create policy "public read groups" on groups for select using (true);
create policy "public insert groups" on groups for insert with check (true);
create policy "public update groups" on groups for update using (true);

create policy "public read members" on group_members for select using (true);
create policy "public insert members" on group_members for insert with check (true);
create policy "public update members" on group_members for update using (true);

create policy "public read sessions" on sessions for select using (true);
create policy "public insert sessions" on sessions for insert with check (true);
create policy "public update sessions" on sessions for update using (true);

create policy "public read participants" on session_participants for select using (true);
create policy "public insert participants" on session_participants for insert with check (true);
create policy "public delete participants" on session_participants for delete using (true);

create policy "public read questions" on questions for select using (true);

create policy "public read answers" on answers for select using (true);
create policy "public insert answers" on answers for insert with check (true);
create policy "public update answers" on answers for update using (true);
