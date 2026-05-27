-- Adult (18+) "Mystery Round" mode: a disguised this-or-that quiz that ends in a
-- verdict. The theme is random and hidden from everyone until the reveal.

-- 1. Allow the new session mode.
alter table sessions drop constraint if exists sessions_mode_check;
alter table sessions add constraint sessions_mode_check check (mode in ('party','family','adult'));

-- 2. Seed adult questions. The reveal trigger (trg_check_session_done) counts rows in
-- this table by theme to decide when everyone is finished, so these must exist here —
-- not just in lib/questions.ts. For every adult question, option_b is the
-- "guilty"/verdict-leaning answer.
insert into questions (id, mode, theme, category, prompt, option_a, option_b, order_index) values
-- First to Die in a Horror Movie
('adult.first_to_die.q1', 'adult', 'first_to_die', null, 'A strange noise downstairs at 3am', 'Stay in bed — absolutely not my problem', 'Go investigate, it’s probably nothing', 1),
('adult.first_to_die.q2', 'adult', 'first_to_die', null, 'The group says "let’s split up to cover more ground"', 'No way — we stick together', 'Great idea, I’ll take the creepy basement', 2),
('adult.first_to_die.q3', 'adult', 'first_to_die', null, 'A sign reads "DO NOT ENTER"', 'Noted. Walking the other way.', 'Now I HAVE to know what’s in there', 3),
('adult.first_to_die.q4', 'adult', 'first_to_die', null, 'Someone dares you to say "Bloody Mary" in the mirror', 'Hard pass', 'Say it five times for good measure', 4),
('adult.first_to_die.q5', 'adult', 'first_to_die', null, 'An unlocked abandoned cabin in the woods', 'That’s a no from me', 'Free cabin! Let’s stay the night', 5),
('adult.first_to_die.q6', 'adult', 'first_to_die', null, 'The escape plan is working perfectly', 'Stay alert — this is too easy', 'We made it!! Time to celebrate loudly', 6),
('adult.first_to_die.q7', 'adult', 'first_to_die', null, 'Something moves in the dark up ahead', 'Back away slowly and quietly', '"Hello? Is someone there?" — walking toward it', 7),
('adult.first_to_die.q8', 'adult', 'first_to_die', null, 'Your phone hits 2% in a sketchy situation', 'Conserve it, stay calm, find the exit', 'Flashlight on, music blasting, who cares', 8),
-- Most Likely to Get Cheated On
('adult.cheated_on.q1', 'adult', 'cheated_on', null, 'Your partner says "we need to talk"', 'I instantly know something’s up', '"Sure babe — after the game?"', 1),
('adult.cheated_on.q2', 'adult', 'cheated_on', null, 'A text lights up their phone at midnight', 'I notice everything', 'I’d never even glance — I trust blindly', 2),
('adult.cheated_on.q3', 'adult', 'cheated_on', null, 'Your partner gets a fancy new haircut', 'I’d notice and compliment it right away', '…they did? When?', 3),
('adult.cheated_on.q4', 'adult', 'cheated_on', null, 'Remembering the anniversary', 'Locked into my calendar', 'Is it… this month? Roughly?', 4),
('adult.cheated_on.q5', 'adult', 'cheated_on', null, 'Their "just a friend" who’s always around', 'I read people pretty well', 'Everyone’s a friend! The more the merrier', 5),
('adult.cheated_on.q6', 'adult', 'cheated_on', null, 'Romance effort a year in', 'Keep the spark alive on purpose', 'We’re comfortable now — sweatpants forever', 6),
('adult.cheated_on.q7', 'adult', 'cheated_on', null, 'Their ex slides back into the picture', 'I’d clock that instantly', 'Aw, nice that they’re catching up!', 7),
('adult.cheated_on.q8', 'adult', 'cheated_on', null, 'Date night planning', 'I plan something thoughtful', 'We’ve been together HOW long? I’ll wing it', 8),
-- Secretly a Serial Killer
('adult.serial_killer.q1', 'adult', 'serial_killer', null, 'The state of your freezer', 'A chaotic, frostbitten mess', 'Immaculate. Everything labeled, dated, sorted.', 1),
('adult.serial_killer.q2', 'adult', 'serial_killer', null, 'Someone cuts you off in traffic', 'I rage out loud for ten minutes', 'I smile. I memorize the plate. I move on.', 2),
('adult.serial_killer.q3', 'adult', 'serial_killer', null, 'Your ideal weekend', 'People, noise, plans', 'Alone. Quiet. No one knows where I am.', 3),
('adult.serial_killer.q4', 'adult', 'serial_killer', null, 'True crime documentaries', 'Too scary, can’t watch', 'I take notes. For fun.', 4),
('adult.serial_killer.q5', 'adult', 'serial_killer', null, 'How you handle the sight of blood', 'I faint at a paper cut', 'Doesn’t bother me even slightly', 5),
('adult.serial_killer.q6', 'adult', 'serial_killer', null, 'How the neighbors would describe you', 'Loud, always around, knows everyone', '"Quiet. Kept to himself. Seemed normal."', 6),
('adult.serial_killer.q7', 'adult', 'serial_killer', null, 'Someone genuinely wrongs you', 'I confront them on the spot', 'I wait. I’m very, very patient.', 7),
('adult.serial_killer.q8', 'adult', 'serial_killer', null, 'Got an alibi for last Tuesday?', 'Obviously — I was out with people', '…why? What happened Tuesday?', 8),
-- First to End Up in Prison
('adult.prison.q1', 'adult', 'prison', null, 'A "DO NOT PARK HERE" sign', 'Rules are rules', 'I’ll only be a minute, it’s fine', 1),
('adult.prison.q2', 'adult', 'prison', null, 'You find a wallet stuffed with cash, no ID', 'Hand it straight to the police', 'Finders keepers — the universe provides', 2),
('adult.prison.q3', 'adult', 'prison', null, 'A buddy has a "business opportunity"', 'Sounds like a scam — pass', 'I’m in. What’s the worst that happens?', 3),
('adult.prison.q4', 'adult', 'prison', null, 'Your relationship with taxes', 'Filed early, by the book', 'Taxes are more of a… suggestion', 4),
('adult.prison.q5', 'adult', 'prison', null, 'A cop pulls up right behind you', 'Totally calm — I’ve done nothing', 'Instant sweating — why do I feel guilty?', 5),
('adult.prison.q6', 'adult', 'prison', null, 'The VIP section / velvet rope', 'I wait my turn like everyone else', 'I act like I belong and walk right in', 6),
('adult.prison.q7', 'adult', 'prison', null, 'Someone double-dares you to do something dumb', 'I’m a grown adult', 'It’s a DOUBLE dare — I have no choice', 7),
('adult.prison.q8', 'adult', 'prison', null, 'The fine print', 'I read every single word', 'What fine print?', 8),
-- Future Supervillain
('adult.villain_origin.q1', 'adult', 'villain_origin', null, 'The world has wronged you', 'That’s life — I move on', 'I’m keeping a list. A detailed list.', 1),
('adult.villain_origin.q2', 'adult', 'villain_origin', null, 'Unlimited money lands in your lap', 'Help people, live quietly', 'Underground lair, obviously', 2),
('adult.villain_origin.q3', 'adult', 'villain_origin', null, 'Winning an argument', 'I let things go', 'I will win. At any cost. Even years later.', 3),
('adult.villain_origin.q4', 'adult', 'villain_origin', null, 'A cat hops into your lap', 'Aw, cute!', 'I’d stroke it slowly while plotting', 4),
('adult.villain_origin.q5', 'adult', 'villain_origin', null, 'Someone takes credit for your work', 'I let karma handle it', 'And so my villain origin story begins', 5),
('adult.villain_origin.q6', 'adult', 'villain_origin', null, 'How you feel about being in charge', 'Not my thing — I like teamwork', 'I should clearly be in charge of everything', 6),
('adult.villain_origin.q7', 'adult', 'villain_origin', null, 'Your laugh when things go your way', 'A normal, happy laugh', 'Slow, building, slightly unhinged', 7),
('adult.villain_origin.q8', 'adult', 'villain_origin', null, 'Backup plans', 'I keep it simple', 'I have contingencies for my contingencies', 8),
-- Most Likely to Get Ghosted
('adult.ghosted.q1', 'adult', 'ghosted', null, 'A first date went well — your next move', 'Text in a day or two, play it cool', '"Good morning beautiful" at 6am + four follow-ups', 1),
('adult.ghosted.q2', 'adult', 'ghosted', null, 'How fast you say "I love you"', 'When it’s actually real', 'Date two. Maybe date one.', 2),
('adult.ghosted.q3', 'adult', 'ghosted', null, 'They haven’t replied in an hour', 'They’re busy — whatever', 'Double, triple text. "You up?"', 3),
('adult.ghosted.q4', 'adult', 'ghosted', null, 'Your dating profile', 'Chill, normal photos', 'Includes my five-year plan and our future kids’ names', 4),
('adult.ghosted.q5', 'adult', 'ghosted', null, 'Meeting their friends', 'When it makes sense', 'Already added them all on every platform', 5),
('adult.ghosted.q6', 'adult', 'ghosted', null, 'A conversation on a date', 'It’s a two-way thing', 'I have not let them speak in 40 minutes', 6),
('adult.ghosted.q7', 'adult', 'ghosted', null, 'Reading the room', 'I’m pretty good at it', 'The room? There’s a room?', 7),
('adult.ghosted.q8', 'adult', 'ghosted', null, 'Planning the future together', 'One step at a time', 'I’ve named our dog. We don’t have a dog. Yet.', 8)
on conflict (id) do nothing;
