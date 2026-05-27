import type { Question } from './types';

export const QUESTIONS: Question[] = [
  // ─── PARTY / ATHLETE (12) ───────────────────────────────────────────────
  {
    id: 'party.athlete.q1', mode: 'party', theme: 'athlete', category: null, order_index: 1,
    prompt: 'Friday night before a big Saturday workout',
    option_a: 'Early to bed, no exceptions',
    option_b: 'I\'ll sleep when the season\'s over',
  },
  {
    id: 'party.athlete.q2', mode: 'party', theme: 'athlete', category: null, order_index: 2,
    prompt: 'Your training partner just cancelled on you',
    option_a: 'Still going — no excuses',
    option_b: 'Good excuse for a rest day honestly',
  },
  {
    id: 'party.athlete.q3', mode: 'party', theme: 'athlete', category: null, order_index: 3,
    prompt: 'How you push through a hard set',
    option_a: 'Locked in, silent, grinding',
    option_b: 'Loud, hype, talking to myself',
  },
  {
    id: 'party.athlete.q4', mode: 'party', theme: 'athlete', category: null, order_index: 4,
    prompt: 'Your role on a team',
    option_a: 'Quiet leader — lead by example',
    option_b: 'Vocal captain — rallying everyone',
  },
  {
    id: 'party.athlete.q5', mode: 'party', theme: 'athlete', category: null, order_index: 5,
    prompt: 'Pre-competition nerves',
    option_a: 'Fuel — I perform better under pressure',
    option_b: 'Dread — I have to manage them down',
  },
  {
    id: 'party.athlete.q6', mode: 'party', theme: 'athlete', category: null, order_index: 6,
    prompt: 'Day after a hard competition loss',
    option_a: 'Back in the gym immediately',
    option_b: 'Take a day, reset, then reload',
  },
  {
    id: 'party.athlete.q7', mode: 'party', theme: 'athlete', category: null, order_index: 7,
    prompt: 'Rival just posted a big PR',
    option_a: 'Motivates me — I need to beat that',
    option_b: 'Good for them — my goal is my goal',
  },
  {
    id: 'party.athlete.q8', mode: 'party', theme: 'athlete', category: null, order_index: 8,
    prompt: 'Your training philosophy',
    option_a: 'Log everything, optimize constantly',
    option_b: 'Feel it out — my body tells me what it needs',
  },
  {
    id: 'party.athlete.q9', mode: 'party', theme: 'athlete', category: null, order_index: 9,
    prompt: 'Coach gives you hard public criticism in front of the team',
    option_a: 'I respect it — that\'s coaching',
    option_b: 'Come to me privately next time',
  },
  {
    id: 'party.athlete.q10', mode: 'party', theme: 'athlete', category: null, order_index: 10,
    prompt: 'Off-season',
    option_a: 'Maintain base fitness, stay ready',
    option_b: 'Full reset — body and mind need it',
  },
  {
    id: 'party.athlete.q11', mode: 'party', theme: 'athlete', category: null, order_index: 11,
    prompt: 'Big personal win — you',
    option_a: 'Post it, let people know, celebrate loud',
    option_b: 'Quiet satisfaction — I know what I did',
  },
  {
    id: 'party.athlete.q12', mode: 'party', theme: 'athlete', category: null, order_index: 12,
    prompt: 'Pre-game ritual',
    option_a: 'Rigid routine — same thing every time',
    option_b: 'Loose — whatever feels right that day',
  },

  // ─── PARTY / PARENT (12) ────────────────────────────────────────────────
  {
    id: 'party.parent.q1', mode: 'party', theme: 'parent', category: null, order_index: 1,
    prompt: 'It\'s 8pm and your kid wants to stay up one more hour',
    option_a: 'Bedtime is bedtime',
    option_b: 'Okay, one hour — it\'s not that serious',
  },
  {
    id: 'party.parent.q2', mode: 'party', theme: 'parent', category: null, order_index: 2,
    prompt: 'Screen time on a school night',
    option_a: 'Hard limit, tracked',
    option_b: 'I watch for problems, not the clock',
  },
  {
    id: 'party.parent.q3', mode: 'party', theme: 'parent', category: null, order_index: 3,
    prompt: 'Kid brings home a B on a test they could\'ve aced',
    option_a: 'We talk about what happened',
    option_b: 'B is fine — effort matters more than grades',
  },
  {
    id: 'party.parent.q4', mode: 'party', theme: 'parent', category: null, order_index: 4,
    prompt: 'Chores for kids',
    option_a: 'Required — part of being in the family',
    option_b: 'When they\'re old enough — let kids be kids',
  },
  {
    id: 'party.parent.q5', mode: 'party', theme: 'parent', category: null, order_index: 5,
    prompt: 'Teacher asks to meet about your child',
    option_a: 'First instinct: what did they do?',
    option_b: 'First instinct: is my kid okay?',
  },
  {
    id: 'party.parent.q6', mode: 'party', theme: 'parent', category: null, order_index: 6,
    prompt: 'Living room is wrecked from an epic Lego session',
    option_a: 'Clean it up — place for everything',
    option_b: 'Leave it — that\'s creativity happening',
  },
  {
    id: 'party.parent.q7', mode: 'party', theme: 'parent', category: null, order_index: 7,
    prompt: 'Affection with your kids',
    option_a: 'Always hugs and "I love you" — every day',
    option_b: 'I show it through what I do, not what I say',
  },
  {
    id: 'party.parent.q8', mode: 'party', theme: 'parent', category: null, order_index: 8,
    prompt: '8-year-old\'s birthday party',
    option_a: 'Venue, 25 kids, bounce house situation',
    option_b: '6 close friends, cake at home',
  },
  {
    id: 'party.parent.q9', mode: 'party', theme: 'parent', category: null, order_index: 9,
    prompt: 'Allowance',
    option_a: 'Earned by doing chores',
    option_b: 'Just given — money isn\'t a reward for family duties',
  },
  {
    id: 'party.parent.q10', mode: 'party', theme: 'parent', category: null, order_index: 10,
    prompt: 'You don\'t love your teenager\'s friend group',
    option_a: 'I say something',
    option_b: 'I stay quiet and stay close',
  },
  {
    id: 'party.parent.q11', mode: 'party', theme: 'parent', category: null, order_index: 11,
    prompt: 'Saturday morning with the kids',
    option_a: 'Out the door — activity, hike, game',
    option_b: 'Pajamas and cartoons until someone\'s hungry',
  },
  {
    id: 'party.parent.q12', mode: 'party', theme: 'parent', category: null, order_index: 12,
    prompt: 'Family dinner table',
    option_a: 'Phones away, no exceptions',
    option_b: 'Phones down but not a rule — I pick the vibe',
  },

  // ─── PARTY / SPOUSE (12) ────────────────────────────────────────────────
  {
    id: 'party.spouse.q1', mode: 'party', theme: 'spouse', category: null, order_index: 1,
    prompt: 'Friday night default',
    option_a: 'Out with friends, together or solo',
    option_b: 'Home — the couch is calling',
  },
  {
    id: 'party.spouse.q2', mode: 'party', theme: 'spouse', category: null, order_index: 2,
    prompt: 'After a disagreement',
    option_a: 'Resolve it tonight — I can\'t sleep on it',
    option_b: 'Sleep on it — morning is better',
  },
  {
    id: 'party.spouse.q3', mode: 'party', theme: 'spouse', category: null, order_index: 3,
    prompt: 'Your finances',
    option_a: 'Mostly one pot — we plan together',
    option_b: 'Separate accounts — independence matters',
  },
  {
    id: 'party.spouse.q4', mode: 'party', theme: 'spouse', category: null, order_index: 4,
    prompt: 'Vacation planning',
    option_a: 'I do the research and book it',
    option_b: 'We sit down together and plan it',
  },
  {
    id: 'party.spouse.q5', mode: 'party', theme: 'spouse', category: null, order_index: 5,
    prompt: 'Anniversary or birthday gift',
    option_a: 'Big gesture — make it memorable',
    option_b: 'Small but meaningful — I know what they love',
  },
  {
    id: 'party.spouse.q6', mode: 'party', theme: 'spouse', category: null, order_index: 6,
    prompt: 'Partner\'s family visits for a week',
    option_a: 'Genuinely excited — I love the chaos',
    option_b: 'Love them, but I\'m mentally preparing',
  },
  {
    id: 'party.spouse.q7', mode: 'party', theme: 'spouse', category: null, order_index: 7,
    prompt: 'After a really hard day',
    option_a: 'I need to talk it through',
    option_b: 'I need quiet — process first, talk later',
  },
  {
    id: 'party.spouse.q8', mode: 'party', theme: 'spouse', category: null, order_index: 8,
    prompt: 'Decorating your home',
    option_a: 'I have strong opinions and the vision',
    option_b: 'Every big thing is a joint call',
  },
  {
    id: 'party.spouse.q9', mode: 'party', theme: 'spouse', category: null, order_index: 9,
    prompt: 'Parenting disagreement in front of the kids',
    option_a: 'Back each other up, discuss later',
    option_b: 'Address it honestly in the moment',
  },
  {
    id: 'party.spouse.q10', mode: 'party', theme: 'spouse', category: null, order_index: 10,
    prompt: 'Long weekend with no plans',
    option_a: 'Road trip — let\'s make a memory',
    option_b: 'Home — we recharge, we sleep, we breathe',
  },
  {
    id: 'party.spouse.q11', mode: 'party', theme: 'spouse', category: null, order_index: 11,
    prompt: 'Your primary love language',
    option_a: 'Physical touch and quality time',
    option_b: 'Words of affirmation and acts of service',
  },
  {
    id: 'party.spouse.q12', mode: 'party', theme: 'spouse', category: null, order_index: 12,
    prompt: 'Date night energy',
    option_a: 'Trying something new — restaurants, activities',
    option_b: 'Our place, great food, no planning',
  },

  // ─── PARTY / FRIEND (12) ────────────────────────────────────────────────
  {
    id: 'party.friend.q1', mode: 'party', theme: 'friend', category: null, order_index: 1,
    prompt: 'Reaching out to friends',
    option_a: 'I usually initiate — I like being the connector',
    option_b: 'I wait for them to reach out first',
  },
  {
    id: 'party.friend.q2', mode: 'party', theme: 'friend', category: null, order_index: 2,
    prompt: 'A close friend is making a genuinely bad decision',
    option_a: 'I say something — that\'s what friends are for',
    option_b: 'Their life — I support not judge',
  },
  {
    id: 'party.friend.q3', mode: 'party', theme: 'friend', category: null, order_index: 3,
    prompt: 'The group chat',
    option_a: 'Active — I\'m usually the one posting',
    option_b: 'I mostly lurk and react',
  },
  {
    id: 'party.friend.q4', mode: 'party', theme: 'friend', category: null, order_index: 4,
    prompt: 'Saturday night hangout',
    option_a: 'Big group, bar or event, the more the merrier',
    option_b: 'Four people, someone\'s place, long conversation',
  },
  {
    id: 'party.friend.q5', mode: 'party', theme: 'friend', category: null, order_index: 5,
    prompt: 'That friend who\'s always late',
    option_a: 'It genuinely bothers me',
    option_b: 'I\'ve factored it in — I plan for it',
  },
  {
    id: 'party.friend.q6', mode: 'party', theme: 'friend', category: null, order_index: 6,
    prompt: 'Your ideal friendship vibe',
    option_a: 'Deep 2am conversations about life',
    option_b: 'Ridiculous inside jokes and zero seriousness',
  },
  {
    id: 'party.friend.q7', mode: 'party', theme: 'friend', category: null, order_index: 7,
    prompt: 'New person enters the friend circle',
    option_a: 'I warm up fast — welcome aboard',
    option_b: 'I take my time before I\'m really myself',
  },
  {
    id: 'party.friend.q8', mode: 'party', theme: 'friend', category: null, order_index: 8,
    prompt: 'Friend needs help moving on Saturday',
    option_a: 'I\'m there — good friend tax',
    option_b: 'I\'ll venmo you for movers — love you',
  },
  {
    id: 'party.friend.q9', mode: 'party', theme: 'friend', category: null, order_index: 9,
    prompt: 'A secret someone confided in you',
    option_a: 'Locked in the vault — I take it to the grave',
    option_b: 'I might mention it carefully to one person I trust',
  },
  {
    id: 'party.friend.q10', mode: 'party', theme: 'friend', category: null, order_index: 10,
    prompt: 'Tension with a close friend',
    option_a: 'I bring it up directly',
    option_b: 'I let it dissolve on its own',
  },
  {
    id: 'party.friend.q11', mode: 'party', theme: 'friend', category: null, order_index: 11,
    prompt: 'How often do you need to see close friends to feel connected?',
    option_a: 'Often — distance makes it fade for me',
    option_b: 'Rarely — we pick right up no matter how long it\'s been',
  },
  {
    id: 'party.friend.q12', mode: 'party', theme: 'friend', category: null, order_index: 12,
    prompt: 'Friend going through a hard breakup calls at 11pm',
    option_a: 'I listen — let them process out loud',
    option_b: 'I give them a plan — what do we do next?',
  },

  // ─── PARTY / LEADER (12) ────────────────────────────────────────────────
  {
    id: 'party.leader.q1', mode: 'party', theme: 'leader', category: null, order_index: 1,
    prompt: 'Decision needs to be made and the team is split',
    option_a: 'I make the call — that\'s my job',
    option_b: 'We keep talking until there\'s real alignment',
  },
  {
    id: 'party.leader.q2', mode: 'party', theme: 'leader', category: null, order_index: 2,
    prompt: 'Someone on your team did exceptional work',
    option_a: 'Call it out publicly — they deserve it',
    option_b: 'Tell them directly, privately',
  },
  {
    id: 'party.leader.q3', mode: 'party', theme: 'leader', category: null, order_index: 3,
    prompt: 'The team pushes back hard on your direction',
    option_a: 'I hold the line — I see something they don\'t',
    option_b: 'I genuinely reconsider — they might be right',
  },
  {
    id: 'party.leader.q4', mode: 'party', theme: 'leader', category: null, order_index: 4,
    prompt: 'New idea on the table',
    option_a: 'Ship fast, learn from real feedback',
    option_b: 'Plan it properly — do it once, do it right',
  },
  {
    id: 'party.leader.q5', mode: 'party', theme: 'leader', category: null, order_index: 5,
    prompt: 'You made a mistake that affected the team',
    option_a: 'Own it publicly — the team needs to see that',
    option_b: 'Fix it quietly and move forward',
  },
  {
    id: 'party.leader.q6', mode: 'party', theme: 'leader', category: null, order_index: 6,
    prompt: 'New hire\'s first week',
    option_a: 'Structured onboarding, clear ramp plan',
    option_b: 'Throw them in — sink or swim builds confidence',
  },
  {
    id: 'party.leader.q7', mode: 'party', theme: 'leader', category: null, order_index: 7,
    prompt: 'Top performer who\'s also difficult to work with',
    option_a: 'Invest — talent like that is worth it',
    option_b: 'Culture matters more than individual output',
  },
  {
    id: 'party.leader.q8', mode: 'party', theme: 'leader', category: null, order_index: 8,
    prompt: 'Where you actually live as a leader',
    option_a: 'Vision and strategy — the why and where',
    option_b: 'Execution and details — making it actually happen',
  },
  {
    id: 'party.leader.q9', mode: 'party', theme: 'leader', category: null, order_index: 9,
    prompt: 'Your 1:1s with direct reports',
    option_a: 'I drive the agenda — here\'s what we\'re covering',
    option_b: 'They drive it — it\'s their time',
  },
  {
    id: 'party.leader.q10', mode: 'party', theme: 'leader', category: null, order_index: 10,
    prompt: 'After a major setback',
    option_a: 'Rally the team loudly — energy is everything',
    option_b: 'Head down, fix it — results are the rally',
  },
  {
    id: 'party.leader.q11', mode: 'party', theme: 'leader', category: null, order_index: 11,
    prompt: 'Hiring choice: strong culture fit or stronger skills',
    option_a: 'Culture fit — skills can be taught',
    option_b: 'Skills — culture adapts around strong people',
  },
  {
    id: 'party.leader.q12', mode: 'party', theme: 'leader', category: null, order_index: 12,
    prompt: 'Your management style',
    option_a: 'Hands-on — I want to know what\'s happening',
    option_b: 'Hands-off — I hire well and trust them',
  },

  // ─── FAMILY / CORE — CONFLICT (5) ───────────────────────────────────────
  {
    id: 'family.core.conflict.q1', mode: 'family', theme: 'family_core', category: 'Conflict', order_index: 1,
    prompt: 'You and a family member disagree — your first move',
    option_a: 'Say what I think right away — clear the air',
    option_b: 'Take time to process before I open my mouth',
  },
  {
    id: 'family.core.conflict.q2', mode: 'family', theme: 'family_core', category: 'Conflict', order_index: 2,
    prompt: 'When someone hurts your feelings',
    option_a: 'I tell them immediately',
    option_b: 'I go quiet and need time',
  },
  {
    id: 'family.core.conflict.q3', mode: 'family', theme: 'family_core', category: 'Conflict', order_index: 3,
    prompt: 'Old argument that never fully resolved',
    option_a: 'It still needs to be dealt with — we shouldn\'t let it go',
    option_b: 'Some things are better left alone',
  },
  {
    id: 'family.core.conflict.q4', mode: 'family', theme: 'family_core', category: 'Conflict', order_index: 4,
    prompt: 'Realizing mid-fight that you were wrong',
    option_a: 'I say it right away — apologizing comes naturally',
    option_b: 'I know I was wrong but saying it is genuinely hard',
  },
  {
    id: 'family.core.conflict.q5', mode: 'family', theme: 'family_core', category: 'Conflict', order_index: 5,
    prompt: 'After a difficult conversation with family',
    option_a: 'I want to reconnect right away — hug it out',
    option_b: 'I need space to reset before I\'m okay again',
  },

  // ─── FAMILY / CORE — LOVE (5) ───────────────────────────────────────────
  {
    id: 'family.core.love.q1', mode: 'family', theme: 'family_core', category: 'Love', order_index: 6,
    prompt: 'How you show love most naturally',
    option_a: 'Physical — hugs, touch, presence',
    option_b: 'Actions — I do things for the people I love',
  },
  {
    id: 'family.core.love.q2', mode: 'family', theme: 'family_core', category: 'Love', order_index: 7,
    prompt: 'How you feel most loved',
    option_a: 'When someone says it — words mean a lot to me',
    option_b: 'When someone does something — show me, don\'t tell me',
  },
  {
    id: 'family.core.love.q3', mode: 'family', theme: 'family_core', category: 'Love', order_index: 8,
    prompt: 'Big personal milestone — birthday, promotion',
    option_a: 'I want it acknowledged loudly',
    option_b: 'Something small and personal beats a big show',
  },
  {
    id: 'family.core.love.q4', mode: 'family', theme: 'family_core', category: 'Love', order_index: 9,
    prompt: 'When you love someone',
    option_a: 'I check in constantly — I want to be close',
    option_b: 'I give them space — love means trust',
  },
  {
    id: 'family.core.love.q5', mode: 'family', theme: 'family_core', category: 'Love', order_index: 10,
    prompt: 'Your emotional style in family',
    option_a: 'Openly expressive — you know how I feel',
    option_b: 'Quietly devoted — I show it through being there',
  },

  // ─── FAMILY / CORE — MONEY (5) ──────────────────────────────────────────
  {
    id: 'family.core.money.q1', mode: 'family', theme: 'family_core', category: 'Money', order_index: 11,
    prompt: 'Unexpected $5,000 lands in your account',
    option_a: 'Save or invest it',
    option_b: 'Something I\'ve been putting off — I spend it',
  },
  {
    id: 'family.core.money.q2', mode: 'family', theme: 'family_core', category: 'Money', order_index: 12,
    prompt: 'Your financial situation with family',
    option_a: 'Open book — I share the details freely',
    option_b: 'Private — money is personal',
  },
  {
    id: 'family.core.money.q3', mode: 'family', theme: 'family_core', category: 'Money', order_index: 13,
    prompt: 'Family member needs financial help',
    option_a: 'I give freely — no hesitation',
    option_b: 'I\'m careful — money changes relationships',
  },
  {
    id: 'family.core.money.q4', mode: 'family', theme: 'family_core', category: 'Money', order_index: 14,
    prompt: 'Big purchase — where you spend',
    option_a: 'Experiences — trips, dinners, memories',
    option_b: 'Things — home, gear, quality that lasts',
  },
  {
    id: 'family.core.money.q5', mode: 'family', theme: 'family_core', category: 'Money', order_index: 15,
    prompt: 'When money is tight',
    option_a: 'I talk about it openly — shared problem',
    option_b: 'I handle it internally — don\'t want to worry people',
  },

  // ─── FAMILY / CORE — LOYALTY (5) ────────────────────────────────────────
  {
    id: 'family.core.loyalty.q1', mode: 'family', theme: 'family_core', category: 'Loyalty', order_index: 16,
    prompt: 'Sibling is going through something hard',
    option_a: 'I jump in to help fix it',
    option_b: 'I sit with them and listen first',
  },
  {
    id: 'family.core.loyalty.q2', mode: 'family', theme: 'family_core', category: 'Loyalty', order_index: 17,
    prompt: 'When friends and family want opposite things from you',
    option_a: 'Family comes first — full stop',
    option_b: 'I try to find a balance — both matter',
  },
  {
    id: 'family.core.loyalty.q3', mode: 'family', theme: 'family_core', category: 'Loyalty', order_index: 18,
    prompt: 'Family member does something publicly wrong',
    option_a: 'Defend them publicly, address it privately',
    option_b: 'I won\'t cover for them — even family',
  },
  {
    id: 'family.core.loyalty.q4', mode: 'family', theme: 'family_core', category: 'Loyalty', order_index: 19,
    prompt: 'Your need for family closeness',
    option_a: 'Frequent contact — I need to feel connected',
    option_b: 'I\'m fine with distance — we\'re solid no matter what',
  },
  {
    id: 'family.core.loyalty.q5', mode: 'family', theme: 'family_core', category: 'Loyalty', order_index: 20,
    prompt: 'Family expectation you outgrew',
    option_a: 'I openly left it behind — I said so',
    option_b: 'Quietly did my own thing — less friction that way',
  },

  // ─── FAMILY / CORE — VALUES (5) ─────────────────────────────────────────
  {
    id: 'family.core.values.q1', mode: 'family', theme: 'family_core', category: 'Values', order_index: 21,
    prompt: 'Something from your upbringing you actively kept',
    option_a: 'A value or ritual I pass on deliberately',
    option_b: 'I absorbed it unconsciously — it\'s just who I am',
  },
  {
    id: 'family.core.values.q2', mode: 'family', theme: 'family_core', category: 'Values', order_index: 22,
    prompt: 'Something from your upbringing you consciously left behind',
    option_a: 'I examined it and chose differently',
    option_b: 'I drifted away — no big moment, just changed',
  },
  {
    id: 'family.core.values.q3', mode: 'family', theme: 'family_core', category: 'Values', order_index: 23,
    prompt: 'What matters most to you',
    option_a: 'Security and stability — a solid foundation',
    option_b: 'Freedom and growth — I\'d rather risk than stagnate',
  },
  {
    id: 'family.core.values.q4', mode: 'family', theme: 'family_core', category: 'Values', order_index: 24,
    prompt: 'Spirituality or faith in your life',
    option_a: 'Something I inherited or found — it\'s part of me',
    option_b: 'Something I\'ve mostly let go of or moved past',
  },
  {
    id: 'family.core.values.q5', mode: 'family', theme: 'family_core', category: 'Values', order_index: 25,
    prompt: 'What you want to be remembered for in your family',
    option_a: 'Being the one who held it all together',
    option_b: 'Being the one who pushed everyone to be more',
  },

  // ═══ ADULT (18+) ═════════════════════════════════════════════════════════
  // Disguised this-or-that questions. For every adult question, option_b is the
  // "guilty"/verdict-leaning answer (higher value = more guilty on that theme's axis).
  // The theme is random & hidden from players until the reveal.

  // ─── ADULT / FIRST TO DIE IN A HORROR MOVIE (8) ─────────────────────────
  { id: 'adult.first_to_die.q1', mode: 'adult', theme: 'first_to_die', category: null, order_index: 1,
    prompt: 'A strange noise downstairs at 3am', option_a: 'Stay in bed — absolutely not my problem', option_b: 'Go investigate, it’s probably nothing' },
  { id: 'adult.first_to_die.q2', mode: 'adult', theme: 'first_to_die', category: null, order_index: 2,
    prompt: 'The group says "let’s split up to cover more ground"', option_a: 'No way — we stick together', option_b: 'Great idea, I’ll take the creepy basement' },
  { id: 'adult.first_to_die.q3', mode: 'adult', theme: 'first_to_die', category: null, order_index: 3,
    prompt: 'A sign reads "DO NOT ENTER"', option_a: 'Noted. Walking the other way.', option_b: 'Now I HAVE to know what’s in there' },
  { id: 'adult.first_to_die.q4', mode: 'adult', theme: 'first_to_die', category: null, order_index: 4,
    prompt: 'Someone dares you to say "Bloody Mary" in the mirror', option_a: 'Hard pass', option_b: 'Say it five times for good measure' },
  { id: 'adult.first_to_die.q5', mode: 'adult', theme: 'first_to_die', category: null, order_index: 5,
    prompt: 'An unlocked abandoned cabin in the woods', option_a: 'That’s a no from me', option_b: 'Free cabin! Let’s stay the night' },
  { id: 'adult.first_to_die.q6', mode: 'adult', theme: 'first_to_die', category: null, order_index: 6,
    prompt: 'The escape plan is working perfectly', option_a: 'Stay alert — this is too easy', option_b: 'We made it!! Time to celebrate loudly' },
  { id: 'adult.first_to_die.q7', mode: 'adult', theme: 'first_to_die', category: null, order_index: 7,
    prompt: 'Something moves in the dark up ahead', option_a: 'Back away slowly and quietly', option_b: '"Hello? Is someone there?" — walking toward it' },
  { id: 'adult.first_to_die.q8', mode: 'adult', theme: 'first_to_die', category: null, order_index: 8,
    prompt: 'Your phone hits 2% in a sketchy situation', option_a: 'Conserve it, stay calm, find the exit', option_b: 'Flashlight on, music blasting, who cares' },

  // ─── ADULT / MOST LIKELY TO GET CHEATED ON (8) ──────────────────────────
  { id: 'adult.cheated_on.q1', mode: 'adult', theme: 'cheated_on', category: null, order_index: 1,
    prompt: 'Your partner says "we need to talk"', option_a: 'I instantly know something’s up', option_b: '"Sure babe — after the game?"' },
  { id: 'adult.cheated_on.q2', mode: 'adult', theme: 'cheated_on', category: null, order_index: 2,
    prompt: 'A text lights up their phone at midnight', option_a: 'I notice everything', option_b: 'I’d never even glance — I trust blindly' },
  { id: 'adult.cheated_on.q3', mode: 'adult', theme: 'cheated_on', category: null, order_index: 3,
    prompt: 'Your partner gets a fancy new haircut', option_a: 'I’d notice and compliment it right away', option_b: '…they did? When?' },
  { id: 'adult.cheated_on.q4', mode: 'adult', theme: 'cheated_on', category: null, order_index: 4,
    prompt: 'Remembering the anniversary', option_a: 'Locked into my calendar', option_b: 'Is it… this month? Roughly?' },
  { id: 'adult.cheated_on.q5', mode: 'adult', theme: 'cheated_on', category: null, order_index: 5,
    prompt: 'Their "just a friend" who’s always around', option_a: 'I read people pretty well', option_b: 'Everyone’s a friend! The more the merrier' },
  { id: 'adult.cheated_on.q6', mode: 'adult', theme: 'cheated_on', category: null, order_index: 6,
    prompt: 'Romance effort a year in', option_a: 'Keep the spark alive on purpose', option_b: 'We’re comfortable now — sweatpants forever' },
  { id: 'adult.cheated_on.q7', mode: 'adult', theme: 'cheated_on', category: null, order_index: 7,
    prompt: 'Their ex slides back into the picture', option_a: 'I’d clock that instantly', option_b: 'Aw, nice that they’re catching up!' },
  { id: 'adult.cheated_on.q8', mode: 'adult', theme: 'cheated_on', category: null, order_index: 8,
    prompt: 'Date night planning', option_a: 'I plan something thoughtful', option_b: 'We’ve been together HOW long? I’ll wing it' },

  // ─── ADULT / SECRETLY A SERIAL KILLER (8) ───────────────────────────────
  { id: 'adult.serial_killer.q1', mode: 'adult', theme: 'serial_killer', category: null, order_index: 1,
    prompt: 'The state of your freezer', option_a: 'A chaotic, frostbitten mess', option_b: 'Immaculate. Everything labeled, dated, sorted.' },
  { id: 'adult.serial_killer.q2', mode: 'adult', theme: 'serial_killer', category: null, order_index: 2,
    prompt: 'Someone cuts you off in traffic', option_a: 'I rage out loud for ten minutes', option_b: 'I smile. I memorize the plate. I move on.' },
  { id: 'adult.serial_killer.q3', mode: 'adult', theme: 'serial_killer', category: null, order_index: 3,
    prompt: 'Your ideal weekend', option_a: 'People, noise, plans', option_b: 'Alone. Quiet. No one knows where I am.' },
  { id: 'adult.serial_killer.q4', mode: 'adult', theme: 'serial_killer', category: null, order_index: 4,
    prompt: 'True crime documentaries', option_a: 'Too scary, can’t watch', option_b: 'I take notes. For fun.' },
  { id: 'adult.serial_killer.q5', mode: 'adult', theme: 'serial_killer', category: null, order_index: 5,
    prompt: 'How you handle the sight of blood', option_a: 'I faint at a paper cut', option_b: 'Doesn’t bother me even slightly' },
  { id: 'adult.serial_killer.q6', mode: 'adult', theme: 'serial_killer', category: null, order_index: 6,
    prompt: 'How the neighbors would describe you', option_a: 'Loud, always around, knows everyone', option_b: '"Quiet. Kept to himself. Seemed normal."' },
  { id: 'adult.serial_killer.q7', mode: 'adult', theme: 'serial_killer', category: null, order_index: 7,
    prompt: 'Someone genuinely wrongs you', option_a: 'I confront them on the spot', option_b: 'I wait. I’m very, very patient.' },
  { id: 'adult.serial_killer.q8', mode: 'adult', theme: 'serial_killer', category: null, order_index: 8,
    prompt: 'Got an alibi for last Tuesday?', option_a: 'Obviously — I was out with people', option_b: '…why? What happened Tuesday?' },

  // ─── ADULT / FIRST TO END UP IN PRISON (8) ──────────────────────────────
  { id: 'adult.prison.q1', mode: 'adult', theme: 'prison', category: null, order_index: 1,
    prompt: 'A "DO NOT PARK HERE" sign', option_a: 'Rules are rules', option_b: 'I’ll only be a minute, it’s fine' },
  { id: 'adult.prison.q2', mode: 'adult', theme: 'prison', category: null, order_index: 2,
    prompt: 'You find a wallet stuffed with cash, no ID', option_a: 'Hand it straight to the police', option_b: 'Finders keepers — the universe provides' },
  { id: 'adult.prison.q3', mode: 'adult', theme: 'prison', category: null, order_index: 3,
    prompt: 'A buddy has a "business opportunity"', option_a: 'Sounds like a scam — pass', option_b: 'I’m in. What’s the worst that happens?' },
  { id: 'adult.prison.q4', mode: 'adult', theme: 'prison', category: null, order_index: 4,
    prompt: 'Your relationship with taxes', option_a: 'Filed early, by the book', option_b: 'Taxes are more of a… suggestion' },
  { id: 'adult.prison.q5', mode: 'adult', theme: 'prison', category: null, order_index: 5,
    prompt: 'A cop pulls up right behind you', option_a: 'Totally calm — I’ve done nothing', option_b: 'Instant sweating — why do I feel guilty?' },
  { id: 'adult.prison.q6', mode: 'adult', theme: 'prison', category: null, order_index: 6,
    prompt: 'The VIP section / velvet rope', option_a: 'I wait my turn like everyone else', option_b: 'I act like I belong and walk right in' },
  { id: 'adult.prison.q7', mode: 'adult', theme: 'prison', category: null, order_index: 7,
    prompt: 'Someone double-dares you to do something dumb', option_a: 'I’m a grown adult', option_b: 'It’s a DOUBLE dare — I have no choice' },
  { id: 'adult.prison.q8', mode: 'adult', theme: 'prison', category: null, order_index: 8,
    prompt: 'The fine print', option_a: 'I read every single word', option_b: 'What fine print?' },

  // ─── ADULT / FUTURE SUPERVILLAIN (8) ────────────────────────────────────
  { id: 'adult.villain_origin.q1', mode: 'adult', theme: 'villain_origin', category: null, order_index: 1,
    prompt: 'The world has wronged you', option_a: 'That’s life — I move on', option_b: 'I’m keeping a list. A detailed list.' },
  { id: 'adult.villain_origin.q2', mode: 'adult', theme: 'villain_origin', category: null, order_index: 2,
    prompt: 'Unlimited money lands in your lap', option_a: 'Help people, live quietly', option_b: 'Underground lair, obviously' },
  { id: 'adult.villain_origin.q3', mode: 'adult', theme: 'villain_origin', category: null, order_index: 3,
    prompt: 'Winning an argument', option_a: 'I let things go', option_b: 'I will win. At any cost. Even years later.' },
  { id: 'adult.villain_origin.q4', mode: 'adult', theme: 'villain_origin', category: null, order_index: 4,
    prompt: 'A cat hops into your lap', option_a: 'Aw, cute!', option_b: 'I’d stroke it slowly while plotting' },
  { id: 'adult.villain_origin.q5', mode: 'adult', theme: 'villain_origin', category: null, order_index: 5,
    prompt: 'Someone takes credit for your work', option_a: 'I let karma handle it', option_b: 'And so my villain origin story begins' },
  { id: 'adult.villain_origin.q6', mode: 'adult', theme: 'villain_origin', category: null, order_index: 6,
    prompt: 'How you feel about being in charge', option_a: 'Not my thing — I like teamwork', option_b: 'I should clearly be in charge of everything' },
  { id: 'adult.villain_origin.q7', mode: 'adult', theme: 'villain_origin', category: null, order_index: 7,
    prompt: 'Your laugh when things go your way', option_a: 'A normal, happy laugh', option_b: 'Slow, building, slightly unhinged' },
  { id: 'adult.villain_origin.q8', mode: 'adult', theme: 'villain_origin', category: null, order_index: 8,
    prompt: 'Backup plans', option_a: 'I keep it simple', option_b: 'I have contingencies for my contingencies' },

  // ─── ADULT / MOST LIKELY TO GET GHOSTED (8) ─────────────────────────────
  { id: 'adult.ghosted.q1', mode: 'adult', theme: 'ghosted', category: null, order_index: 1,
    prompt: 'A first date went well — your next move', option_a: 'Text in a day or two, play it cool', option_b: '"Good morning beautiful" at 6am + four follow-ups' },
  { id: 'adult.ghosted.q2', mode: 'adult', theme: 'ghosted', category: null, order_index: 2,
    prompt: 'How fast you say "I love you"', option_a: 'When it’s actually real', option_b: 'Date two. Maybe date one.' },
  { id: 'adult.ghosted.q3', mode: 'adult', theme: 'ghosted', category: null, order_index: 3,
    prompt: 'They haven’t replied in an hour', option_a: 'They’re busy — whatever', option_b: 'Double, triple text. "You up?"' },
  { id: 'adult.ghosted.q4', mode: 'adult', theme: 'ghosted', category: null, order_index: 4,
    prompt: 'Your dating profile', option_a: 'Chill, normal photos', option_b: 'Includes my five-year plan and our future kids’ names' },
  { id: 'adult.ghosted.q5', mode: 'adult', theme: 'ghosted', category: null, order_index: 5,
    prompt: 'Meeting their friends', option_a: 'When it makes sense', option_b: 'Already added them all on every platform' },
  { id: 'adult.ghosted.q6', mode: 'adult', theme: 'ghosted', category: null, order_index: 6,
    prompt: 'A conversation on a date', option_a: 'It’s a two-way thing', option_b: 'I have not let them speak in 40 minutes' },
  { id: 'adult.ghosted.q7', mode: 'adult', theme: 'ghosted', category: null, order_index: 7,
    prompt: 'Reading the room', option_a: 'I’m pretty good at it', option_b: 'The room? There’s a room?' },
  { id: 'adult.ghosted.q8', mode: 'adult', theme: 'ghosted', category: null, order_index: 8,
    prompt: 'Planning the future together', option_a: 'One step at a time', option_b: 'I’ve named our dog. We don’t have a dog. Yet.' },
];

export function getQuestionsByTheme(theme: string): Question[] {
  return QUESTIONS.filter((q) => q.theme === theme).sort((a, b) => a.order_index - b.order_index);
}

export function getQuestionsByCategory(theme: string): Record<string, Question[]> {
  const questions = getQuestionsByTheme(theme);
  const byCategory: Record<string, Question[]> = {};
  for (const q of questions) {
    const cat = q.category ?? 'general';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(q);
  }
  return byCategory;
}
