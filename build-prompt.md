# Build Prompt: "Mirror" — a group similarity party game

Hand this entire file to Claude Code as the project brief. Adjust the name and any stack call before kicking off.

---

## 1. Product

A real-time, room-based web game for groups of 5–20 people. Everyone in the room answers the same set of questions on a chosen theme. When the round ends, every player sees who in their group they're most similar to, and who they're least similar to.

### Two-tier model: Groups and Sessions

- A **Group** is a persistent collection of people (your family, your team, your friend group). Group has a name, a permanent code/slug, and member identities that persist across plays.
- A **Session** is one round of play inside a Group. A session has a mode, a theme, and a set of answers. When it ends, results are saved to the group's history.

This means: the Elder family creates a group once. Mom, Dad, sis, bro all join the group once with their names and avatars. At Thanksgiving they run a Family session. At Christmas they run a Party / Parent session — same group, same identities, fresh questions, history accumulates ("your most consistent twin across 4 games has been your sister").

Two distinct game modes within a session:

### Party Mode
Light, fast, archetype-driven. Host picks a **theme** — Athlete, Parent, Spouse, Friend, Leader, Coworker, Dad, Husband, Founder, etc. 12 forced-choice A/B questions ("strongly A / lean A / lean B / strongly B"). Result is a single similarity ranking: *"Your twin is Mike (87%). Your opposite is Sarah (23%)."*

### Family Mode
Deeper, multi-axis. ~25 questions grouped into 5 categories:
1. **Conflict** — how you handle disagreement
2. **Love** — how you give and receive affection
3. **Money** — saver/spender, open/private, generous/cautious
4. **Loyalty** — independence vs. closeness, who you put first
5. **Values** — what you kept from your upbringing vs. what you rejected

Family mode runs **two passes**:
- **Pass 1**: Answer as yourself.
- **Pass 2** (Phase 2 — flag-gated): Pick one other group member and answer as you think *they* would. This unlocks the "who knows Mom best" sub-game.

Family results screen shows:
- A radar chart across the 5 categories.
- Per-category top match: *"On Money you're most like Dad. On Conflict you're most like your sister Aya."*
- A sibling/pair heatmap.

---

## 2. Tech stack

I'm hosting on Vercel. Use the stack that's frictionless on Vercel and has working realtime out of the box:

- **Framework**: Next.js 15 (App Router), TypeScript, Tailwind v4
- **UI components**: shadcn/ui
- **Animation**: `motion` (Framer Motion's successor) for transitions and reveals
- **Database + Realtime**: Supabase (Postgres + Realtime channels + anon auth). Use the JS client.
- **State**: React Server Components where possible; Supabase Realtime subscriptions for live session state; Zustand for ephemeral client state.
- **Charts**: Recharts (radar chart for Family mode).
- **Deploy**: Vercel + Supabase free tier.

> Note: I'm primarily a Python developer, but Vercel's stateless functions make Next.js + Supabase the path of least resistance for realtime multiplayer. If we ever need a Python backend, we'd split off — not for v1.

---

## 3. Data model (Supabase / Postgres)

```sql
-- groups: persistent collection of people
create table groups (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,            -- slug like 'plum-stardust-42', shareable
  name text not null,                    -- "The Elders", "Saturday League"
  created_by uuid,                       -- group_members.id, set after first member created
  created_at timestamptz default now()
);

-- group_members: persistent identities scoped to a group
create table group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade,
  name text not null,
  avatar_seed text not null,             -- deterministic emoji + color
  role text not null default 'member' check (role in ('owner','member')),
  device_id text,                        -- optional, lets a returning device re-claim identity
  joined_at timestamptz default now(),
  unique (group_id, name)
);

-- sessions: one round of play inside a group
create table sessions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references groups(id) on delete cascade,
  code text not null,                    -- short 4-char e.g. 'PLUM' for QR/late-joiners, scoped per group
  mode text not null check (mode in ('party','family')),
  theme text not null,                   -- 'athlete' | 'parent' | ... | 'family_core'
  status text not null default 'lobby' check (status in ('lobby','playing','revealed','ended')),
  host_member_id uuid references group_members(id),
  current_question_index int default 0,
  created_at timestamptz default now(),
  revealed_at timestamptz
);

-- session_participants: who actually showed up to this session
create table session_participants (
  session_id uuid references sessions(id) on delete cascade,
  member_id uuid references group_members(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (session_id, member_id)
);

-- questions: seeded from JSON
create table questions (
  id text primary key,                   -- e.g. 'party.parent.q1'
  mode text not null,
  theme text not null,
  category text,                         -- only used in family mode
  prompt text not null,
  option_a text not null,
  option_b text not null,
  order_index int not null
);

-- answers: scoped to session + member
create table answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  member_id uuid references group_members(id) on delete cascade,
  question_id text references questions(id),
  value int not null check (value between 1 and 4),  -- 1=strongly A, 4=strongly B
  target_member_id uuid references group_members(id),  -- null in pass 1, set in pass 2
  created_at timestamptz default now(),
  unique (session_id, member_id, question_id, target_member_id)
);
```

Enable Realtime on `sessions`, `session_participants`, and `answers`.

**Code generation**:
- Group code: 3-word slug, e.g. `plum-stardust-42`. Persistent. Shareable.
- Session code: 4-letter uppercase, e.g. `PLUM`. Unique within a group (collisions across groups are fine).

**Identity persistence**:
Store `group_id` + `member_id` in localStorage on join. Returning device auto-resumes its identity. Add an optional "switch member" link in case Mom hands her phone to Dad.

Row-level security: open for v1. Groups never expire (they're persistent by design — the whole point). Sessions auto-archive 24h after `revealed_at`.

---

## 4. Similarity algorithm

Encode each participant's answers into a vector. The 1–4 scale maps to `[-1.5, -0.5, 0.5, 1.5]` so a "lean" answer counts but a "strongly" answer counts triple.

**Pairwise similarity** = cosine similarity, rescaled from `[-1, 1]` to `[0, 100]`:

```ts
function similarity(a: number[], b: number[]): number {
  const dot = a.reduce((s, x, i) => s + x * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, x) => s + x * x, 0));
  const magB = Math.sqrt(b.reduce((s, x) => s + x * x, 0));
  const cos = dot / (magA * magB || 1);
  return Math.round(((cos + 1) / 2) * 100);
}
```

For **Family mode**, compute similarity *per category* (subset the vector to that category's questions), then average for overall. The radar chart uses the per-category scores directly.

For **Family Phase 2** ("answer as X"), the "who knows X best" score is `100 - meanAbsoluteDiff` between member Y's pass-2 vector for target X and member X's own pass-1 vector.

**Group history**: After each session, persist the pairwise matrix in a `session_results` JSON column on `sessions`. Use it to compute group-level stats like "most consistent twin across N games."

---

## 5. UX flow

### 5.1 Landing (`/`)
Three tiles: **Create a group** | **Join a group** | **Rejoin** (only shown if localStorage has a group_id).

### 5.2 Create group flow
1. Name your group ("The Elders").
2. Auto-generate group code (`plum-stardust-42`); show it + a copy button + QR.
3. Create your own member identity: name + emoji avatar. You become the owner.
4. Land on group home.

### 5.3 Join group flow
1. Enter group code (or scan QR / open invite link `mirror.app/g/plum-stardust-42`).
2. Either: pick an existing member identity (if you're returning and your device wasn't recognized) **or** create a new member identity with name + avatar.
3. Land on group home.

### 5.4 Group home (`/g/[code]`)
The persistent hub. Shows:
- Group name + code (with share button).
- Members list (avatars + names).
- **Start a session** button — opens mode/theme picker. Becomes host.
- **Live session** banner if one is active — "Aya started a Family session — join."
- History section: past sessions with date, mode, theme, and one-line outcome ("12 played, your twin was Mom").

### 5.5 Session host flow
From group home → tap Start a session → pick mode → pick theme → confirm. Session created in `lobby` status. Other group members see the live banner and can join. Host has a "Start" button (disabled until ≥3 participants).

### 5.6 Session play flow
- Each question shown one at a time. Big card, prompt at top, two options as large tappable areas, 4-point slider between them (Strongly A / Lean A / Lean B / Strongly B).
- Participants advance at their own pace. Show a small "8/12 answered" ticker.
- After all participants answer all questions, session status → `revealed`.

### 5.7 Reveal — Party mode
1. "Your group has spoken." (1.5s)
2. "Your twin is…" (suspense beat, name flips in with similarity %)
3. "Your opposite is…" (same treatment)
4. Full ranking list below, tap any member to see overlap details (3 questions you matched on, 3 you split on).

### 5.8 Reveal — Family mode
1. Personal radar chart, animated draw-on.
2. Per-category cards: "On **Money**, you're most like **Dad** (91%)" with a subtle line of explanation.
3. Pair heatmap of the whole group.
4. (Phase 2) "Who knows you best" leaderboard.

### 5.9 After reveal
Back to group home. Result archived to history. Host can start another session immediately (same group, new theme).

---

## 6. Realtime sync

- Subscribe to `sessions` filtered by `group_id` for the live-session banner on group home.
- Subscribe to `session_participants` for the lobby filling.
- Subscribe to the current `sessions` row for status + current_question_index changes.
- Subscribe to `answers` filtered by session for the "8/12 answered" ticker.
- All writes go through Supabase RPC functions (server-side) so the client can't fake answers as another member.

---

## 7. Question banks

Seed JSON, loaded into `questions` table on first deploy. Format:

```json
{
  "id": "party.parent.q1",
  "mode": "party",
  "theme": "parent",
  "category": null,
  "prompt": "Saturday morning with the kids",
  "option_a": "Cartoons on the couch in pajamas",
  "option_b": "Out the door for a hike or game",
  "order_index": 1
}
```

**Seed themes for v1:**

- **Party / Athlete**: training mindset (grind vs. feel), team role (vocal vs. lead by example), pressure (thrives vs. dreads), recovery, rivalry, ritual.
- **Party / Parent**: discipline, screen time, bedtime, mess tolerance, school involvement, money lessons, affection style.
- **Party / Spouse**: who plans, who handles money, conflict speed, date-night energy, social vs. solo, gift style.
- **Party / Friend**: planner vs. flake, deep talks vs. silly fun, ride-or-die vs. tough-love, group hang vs. one-on-one.
- **Party / Leader**: top-down vs. consensus, vision vs. execution, public praise vs. private feedback, risk appetite.
- **Family / Core** (25 questions, 5 per category): Conflict, Love, Money, Loyalty, Values.

Write 12 questions for each Party theme and 25 for Family Core. Keep prompts short, concrete, and behavioral — not abstract Likert statements.

Bad: *"I am an organized person."*
Good: *"It's 9pm Sunday — your week ahead is: A) mapped out hour by hour / B) we'll figure it out as it comes."*

---

## 8. Design direction

- **Aesthetic**: playful but tasteful. Not a kids' app, not corporate SaaS. Think modern party game (Jackbox, Gartic Phone) but cleaner.
- **Type**: confident editorial display font for prompts (Fraunces, Instrument Serif, or Tobias) paired with a clean grotesque for UI (Geist, Söhne, General Sans). No Inter.
- **Color**: dark default theme. One bold accent per theme (Athlete = electric green, Parent = warm coral, Family = deep amber). Avatars are colored emojis on tinted circles.
- **Motion**: every screen transition choreographed. Question cards swipe sideways. Reveals are staged with stagger. Use `motion`'s layout animations for the lobby member list.
- **Mobile-first**: assume 80% of play happens on phones. Buttons ≥ 56px tall. Single column everywhere.

---

## 9. Build plan

### Phase 1 — Ship to Vercel
1. Scaffold Next.js + Tailwind + shadcn + Supabase client.
2. Set up Supabase project, run schema migration, seed question bank.
3. Landing + create-group + join-group flows. Group code generation. localStorage identity persistence.
4. Group home with members list (realtime).
5. Start-session flow from group home with mode/theme picker.
6. Lobby with realtime participant list + live-session banner on group home.
7. Question flow with per-participant pacing.
8. Similarity calculation (client-side after `status='revealed'`). Persist `session_results` JSON.
9. Party mode reveal screen.
10. Family mode reveal screen with radar chart.
11. Session history on group home.
12. Deploy to Vercel, smoke test with a real group of 5+.

### Phase 2 — depth
1. Family "answer as X" second pass + "who knows X best" leaderboard.
2. Cross-session group stats ("most consistent twin", "biggest changer").
3. Share card export (PNG of your twin pair to post).
4. Question shuffling so re-runs aren't identical.
5. Custom theme builder per group.
6. Member removal / role management for group owners.

---

## 10. What to deliver in your first response

1. Confirm the stack call.
2. Initialize the repo, set up Supabase locally with the schema and seed.
3. Build through Phase 1 step 6 (group home + start-session lobby working end-to-end with realtime). Then pause and show me a deploy preview before continuing.

Ask me for the Supabase project URL and anon key when you're ready to connect. Do not invent them.
