-- The initial migration forgot to add group_members and groups to the realtime
-- publication. Without this, the group home and lobby never receive INSERT
-- events when a new person joins the group — they only update on refresh.

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'group_members'
  ) then
    alter publication supabase_realtime add table group_members;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'groups'
  ) then
    alter publication supabase_realtime add table groups;
  end if;
end $$;
