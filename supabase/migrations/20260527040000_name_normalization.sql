-- Defensive: case-insensitive uniqueness on group_members.name within a group.
-- Previously a user could register as "Toof" and another as "toof" since
-- the old unique constraint was case-sensitive — could explain why the user
-- thought they saw "two Toofs" in their first playtest.

alter table group_members drop constraint if exists group_members_group_id_name_key;

create unique index if not exists group_members_group_name_ci_unique
  on group_members (group_id, lower(trim(name)));
