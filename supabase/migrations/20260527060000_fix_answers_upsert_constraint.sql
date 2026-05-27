-- Regression fix: the previous migration replaced the answers unique constraint
-- with two partial unique indexes (split on `target_member_id IS NULL` vs NOT NULL)
-- to dedupe pass-1 answers. That broke the Supabase JS client's upsert because
-- ON CONFLICT (session_id, member_id, question_id, target_member_id) requires
-- a single non-partial unique constraint on those exact columns.
--
-- Postgres 15+ supports `UNIQUE NULLS NOT DISTINCT` which treats NULL=NULL for
-- uniqueness — gives us both:
--   1. Correct dedupe on (session, member, question) even when target is NULL
--   2. A constraint the client's ON CONFLICT can target

drop index if exists answers_pass1_unique;
drop index if exists answers_pass2_unique;

alter table answers
  add constraint answers_session_member_question_target_unique
  unique nulls not distinct (session_id, member_id, question_id, target_member_id);
