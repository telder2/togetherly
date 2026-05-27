-- Fix #1: Replace unique constraint with partial unique indexes that handle NULL target_member_id.
-- The previous constraint included target_member_id, but NULLs are treated as distinct,
-- so upserts with target_member_id=NULL created duplicate rows instead of updating.

alter table answers drop constraint if exists answers_session_id_member_id_question_id_target_member_id_key;

create unique index if not exists answers_pass1_unique
  on answers (session_id, member_id, question_id)
  where target_member_id is null;

create unique index if not exists answers_pass2_unique
  on answers (session_id, member_id, question_id, target_member_id)
  where target_member_id is not null;

-- Fix #2: Auto-transition session to 'revealed' when all participants have answered every question.
-- Previously only the host triggered this client-side; if a non-host finished last, no one triggered it.

create or replace function trg_check_session_done()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session_id uuid;
  v_theme text;
  v_status text;
  v_question_count int;
  v_participant_count int;
  v_finished_count int;
begin
  -- Only consider pass-1 answers (target_member_id is null)
  if NEW.target_member_id is not null then
    return NEW;
  end if;

  v_session_id := NEW.session_id;

  select status, theme into v_status, v_theme
  from sessions where id = v_session_id;

  -- Only act when session is still in 'playing'
  if v_status <> 'playing' then
    return NEW;
  end if;

  select count(*) into v_question_count from questions where theme = v_theme;

  select count(*) into v_participant_count
  from session_participants where session_id = v_session_id;

  -- Count distinct members who have answered all questions for this session
  select count(*) into v_finished_count
  from (
    select member_id
    from answers
    where session_id = v_session_id
      and target_member_id is null
    group by member_id
    having count(distinct question_id) >= v_question_count
  ) sub;

  if v_finished_count >= v_participant_count and v_participant_count > 0 then
    update sessions
    set status = 'revealed',
        revealed_at = now()
    where id = v_session_id and status = 'playing';
  end if;

  return NEW;
end;
$$;

drop trigger if exists answers_check_session_done on answers;

create trigger answers_check_session_done
after insert or update on answers
for each row execute function trg_check_session_done();
