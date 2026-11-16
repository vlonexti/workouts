// The Bulk & Strength Plan, as written. Everything the site shows about what to lift, when, and why comes from here.
// Weights for the bench lifts are a share of the lifter's own bench max (pct); every other lift's weight is theirs
// to choose and is remembered from session to session.

export const REST = { long: 150, short: 75 };       // seconds: 2-3 minutes on bench, rows and squats; 60-90 on the rest
export const BAR = 45;

/** sets x reps: reps is [low, high]; null means "to failure" or a timed hold. */
const lift = (id, name, sets, reps, extra = {}) => ({ id, name, sets, reps, rest: 'short', ...extra });

export const DAYS = {
  mon: {
    id: 'mon', weekday: 1, name: 'Heavy Push', picto: 'bench',
    lifts: [
      lift('bench-heavy', 'Bench press', 5, [5, 5], { rest: 'long', pct: 0.8, bar: true, warmup: true, note: '80% of your max.' }),
      lift('incline-db', 'Incline DB press', 3, [8, 10], { note: 'Pick a weight you can do 8 with good form.' }),
      lift('seated-db-press', 'Seated DB shoulder press', 3, [8, 10]),
      lift('flys', 'Cable or DB flys', 3, [12, 12], { note: 'Slow and controlled.' }),
      lift('pushdowns', 'Tricep pushdowns', 3, [10, 12]),
      lift('finisher-dips', 'Finisher: dips or push-ups', 2, null, { failure: true, bodyweight: true, note: 'To failure.' }),
    ],
  },
  tue: {
    id: 'tue', weekday: 2, name: 'Pull', picto: 'pull',
    lifts: [
      lift('barbell-row', 'Barbell row', 4, [6, 8], { rest: 'long', bar: true }),
      lift('pullups', 'Pull-ups or lat pulldown', 4, [8, 10]),
      lift('one-arm-row', 'One-arm DB row', 3, [10, 10], { note: 'Each arm.' }),
      lift('face-pulls', 'Face pulls', 3, [15, 15], { note: 'Good for shoulder health on a bench-heavy plan.' }),
      lift('barbell-curl', 'Barbell curl', 3, [8, 10]),
      lift('hammer-curl', 'Hammer curl', 3, [12, 12], { note: 'Last set: drop set to failure.' }),
      lift('leg-raises', 'Hanging leg raises', 3, [12, 12], { bodyweight: true }),
    ],
  },
  wed: {
    id: 'wed', weekday: 3, name: 'Legs', picto: 'legs',
    intro: 'Kept short. Leg training raises whole-body strength and helps your bench through a better leg drive.',
    lifts: [
      lift('squat', 'Squat', 4, [6, 6], { rest: 'long', bar: true, note: 'Leave about 2 reps in the tank.' }),
      lift('rdl', 'Romanian deadlift', 3, [8, 8], { bar: true }),
      lift('leg-press', 'Leg press or lunges', 3, [10, 10]),
      lift('leg-curl', 'Leg curl', 3, [12, 12]),
      lift('calf-raises', 'Calf raises', 3, [15, 15]),
      lift('abs', 'Ab wheel or plank', 3, null, { bodyweight: true, note: '3 sets.' }),
    ],
  },
  thu: {
    id: 'thu', weekday: 4, name: 'Volume Push', picto: 'bench',
    lifts: [
      lift('bench-volume', 'Bench press', 4, [8, 8], { rest: 'long', pct: 0.7, bar: true, warmup: true, note: '70% of your max.' }),
      lift('close-grip', 'Close-grip bench', 3, [8, 8], { rest: 'long', pct: 0.6, bar: true, note: '60% of your max.' }),
      lift('db-press', 'DB shoulder press', 3, [10, 10]),
      lift('lateral-raises', 'Lateral raises', 3, [15, 15]),
      lift('overhead-ext', 'Overhead tricep extension', 3, [12, 12]),
      lift('finisher-pushups', 'Finisher: push-ups', 2, null, { failure: true, bodyweight: true, note: 'To failure.' }),
    ],
  },
};
export const ORDER = ['mon', 'tue', 'wed', 'thu'];
export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
/** The plan's day for a weekday number (0 = Sunday), or null on a rest day. */
export const dayForWeekday = n => ORDER.map(id => DAYS[id]).find(d => d.weekday === n) || null;
export const liftById = id => { for (const d of ORDER) { const l = DAYS[d].lifts.find(x => x.id === id); if (l) return l; } return null; };

/** Warm-up before bench: empty bar x 10, 95 x 5, 115 x 3, then the working sets. Steps at or above the working weight are left out. */
export const warmupFor = working => [[BAR, 10], [95, 5], [115, 3]].filter(([w]) => w < working);

// (the tiny amount is for 122.5, which a computer holds as 122.49999 and would round down)
export const round5 = x => Math.round(x / 5 + 1e-9) * 5;
/** The working weight the plan gives a bench lift for a bench max. */
export const fromMax = (max, pct) => round5(max * pct);

/** Plates for one side of a 45 lb bar. The plan loads 125 as 25 + 10 + 5, so 35s are only used when the gym has them. */
export function plates(weight, with35 = false) {
  let side = (weight - BAR) / 2;
  if (!(side > 0)) return [];
  const out = [];
  for (const p of with35 ? [45, 35, 25, 10, 5, 2.5] : [45, 25, 10, 5, 2.5]) while (side >= p - 1e-9) { out.push(p); side -= p; }
  return out;
}
export const platesText = (weight, with35) => {
  const list = plates(weight, with35);
  return weight < BAR ? '' : list.length ? `Bar + ${list.join(' + ')} each side` : 'Empty bar';
};

/* ---------- phases ---------- */

/** Where the bulk and cut timeline stands on a date. */
export function phaseOn(date) {
  const y = date.getMonth() >= 10 ? date.getFullYear() + 1 : date.getFullYear();       // the plan's year runs from November
  const d = date.getTime();
  const at = (m, day) => new Date(y, m, day).getTime();
  if (d < at(4, 1)) return { id: 'bulk', name: 'Lean bulk', until: 'the end of April', goal: 'Gain 0.5 to 1 lb per week.', calories: 'About 3,000 to 3,200 calories', protein: '140 to 160 g protein' };
  if (d < at(5, 16)) return { id: 'cut', name: 'Cut', until: 'mid-June', goal: 'Lose 0.5 to 1 lb per week. Keep lifting heavy.', calories: 'About 2,300 to 2,500 calories', protein: '150 to 160 g protein' };
  return { id: 'bulk', name: 'Bulk again', until: 'you decide to cut', goal: 'Same rules as before: gain 0.5 to 1 lb per week.', calories: 'About 3,000 to 3,200 calories', protein: '140 to 160 g protein' };
}

/* ---------- the reading parts ---------- */
// Each section is { id, title, blocks }. A block is ['p', text], ['list', [items]], or ['table', [head], [[row], ...]].

export const SECTIONS = [
  { id: 'rules', title: 'Progression rules', blocks: [
    ['list', [
      'Bench: when you hit every rep on a bench day, add 5 lb to that day next week (a 2.5 lb plate on each side).',
      'Accessories: when every set hits the top of the rep range, go up in weight next time.',
      'Rest: 2 to 3 minutes on bench, rows and squats. 60 to 90 seconds on everything else.',
      'Warm up before bench: empty bar x 10, 95 x 5, 115 x 3, then your working sets.',
      'Retest your max every 6 weeks, then recalculate: Monday is 80% of the new max, Thursday is 70%, close-grip is 60%. Round to the nearest 5 lb.',
      'Why not 145 x 8: 145 is over 80% of a 175 max, which is why reps crash after two sets. Lighter weights you can finish, added to every week, are what raise the max.',
    ]],
  ] },
  { id: 'timeline', title: 'Bulk and cut timeline', blocks: [
    ['table', ['When', 'Phase', 'Goal'], [
      ['Now to end of April', 'Lean bulk', 'Gain 0.5 to 1 lb per week. Aim for about 172 to 178 lb.'],
      ['May to mid-June', 'Cut (6 to 8 weeks)', 'Lose 0.5 to 1 lb per week. Keep lifting heavy.'],
      ['Mid-June on', 'Bulk again', 'Same rules as before.'],
    ]],
    ['p', 'Start cutting early if your waist grows 1 to 2 inches or you look softer than you like. Stop cutting when your abs show again or you have lost about 8 to 10 lb.'],
  ] },
  { id: 'expect', title: 'What to expect', blocks: [
    ['list', [
      'Scale weight: about 2 to 4 lb per month on a good bulk.',
      'Muscle: about 1 to 2 lb per month in your first year of serious lifting, or roughly 6 to 12 lb over 6 months.',
      'Strength rises fastest. Eating far more than the plan does not build muscle faster; the extra becomes fat.',
    ]],
  ] },
  { id: 'bulk', title: 'Bulk nutrition', blocks: [
    ['list', [
      'Calories: about 3,000 to 3,200 per day.',
      'Protein: 140 to 160 g per day, spread across meals.',
      'Check-in: weigh yourself every morning after the bathroom and look at the weekly average. If you are not gaining after 2 weeks, add about 250 calories (a glass of whole milk or a PB&J).',
    ]],
  ] },
  { id: 'school', title: 'Bulk school day', blocks: [
    ['table', ['Time', 'What to eat', 'About'], [
      ['Before school', 'Shake: whole milk, 1 scoop whey, 2 tbsp peanut butter, 1 banana, 1/2 cup oats', '800 cal'],
      ['Lunch', 'School lunch plus a PB&J', '900 cal'],
      ['End of school, before the gym', 'Granola bar and chocolate milk', '400 cal'],
      ['After the gym', 'Big dinner: chicken or ground beef, rice or pasta, a vegetable', '900 cal'],
      ['Before bed', 'Greek yogurt or 3 hard-boiled eggs', '200 to 250 cal'],
    ]],
    ['p', 'Weekends: add a meal of 1 cup rice and 5 eggs (about 550 calories, 37 g protein). Add butter or cheese for another 100 to 200.'],
  ] },
  { id: 'no-dinner', title: 'No-dinner days', blocks: [
    ['list', [
      'A second shake after the gym (same 800-calorie recipe).',
      'Frozen burritos (2 to 3 is a meal).',
      'Microwave rice cups with canned chicken or tuna.',
      'Bagels with cream cheese or peanut butter.',
      'A PB&J and a big glass of whole milk.',
    ]],
  ] },
  { id: 'gas-station', title: 'Quick calories at Kwik Trip or any gas station', blocks: [
    ['table', ['Item', 'Rough calories', 'Notes'], [
      ['Whole chocolate milk, 1 quart', 'About 800', '30+ g protein. Best deal in the store.'],
      ['Breakfast sandwich or burrito (hot case)', '400 to 600 each', ''],
      ['Pizza slice', '300 to 400 each', ''],
      ['Trail mix, peanuts or cashews', 'Often 500+ per bag', 'Check the bag size'],
      ['Protein shake (Core Power, Muscle Milk)', 'Lower calorie', '25 to 40 g protein. Good backup protein.'],
      ['Beef jerky or meat sticks', 'Lower calorie', 'Pair with something higher calorie'],
      ['Banana', 'About 100', 'Cheap, good with chocolate milk'],
    ]],
    ['p', 'Go-to combo (about $8 to 10): a quart of chocolate milk, a hot breakfast sandwich and a bag of trail mix, roughly 1,500+ calories. Keep donuts and soda to a minimum, since they fill you up without much protein.'],
    ['p', 'Meal prep tips: cook a big batch of rice once a week, and boil a dozen eggs on Sunday (they keep all week in the fridge).'],
  ] },
  { id: 'cut', title: 'Cut nutrition', blocks: [
    ['list', [
      'Calories: about 2,300 to 2,500 per day.',
      'Protein: keep it high, 150 to 160 g per day.',
      'Rate: lose 0.5 to 1 lb per week, and keep the same lifting plan so you hold onto strength and muscle.',
    ]],
    ['p', 'Cut swaps'],
    ['list', [
      'Shake: water or skim milk instead of whole, and drop the peanut butter and oats.',
      'Snacks: jerky, fruit or Greek yogurt instead of granola bars and chocolate milk.',
      'Meat: leaner cuts like chicken breast, 93% lean beef and tuna.',
      'Plate: half vegetables, with smaller servings of rice or pasta.',
      'Drinks: no soda or juice.',
    ]],
  ] },
  { id: 'supplements', title: 'Supplements', blocks: [
    ['list', [
      'Creatine monohydrate: 5 g every day, any time. The best-studied strength supplement there is.',
      'Whey protein: to hit your protein target.',
      'Caffeine before lifting, if you want it.',
      'Vitamin D in winter if you get little sun.',
      'Skip peptides and MK-677. They are unregulated, carry real risks (MK-677 raises blood sugar), and do little for strength in a healthy 18-year-old. Food, sleep and progressive overload do the work.',
    ]],
  ] },
  { id: 'recovery', title: 'Recovery', blocks: [
    ['list', ['Sleep 8+ hours a night.', 'Drink plenty of water, more on training days.']],
  ] },
  { id: 'skin', title: 'Skin care', blocks: [
    ['list', [
      'Adapalene (Differin gel): at night. Clears pimples and smooths texture, takes 6 to 12 weeks.',
      'Benzoyl peroxide wash, 2.5 to 5%: in the morning.',
      'Gentle cleanser and moisturizer such as CeraVe or Cetaphil.',
      'Sunscreen during the day, since adapalene makes skin more sun-sensitive.',
      'If breakouts get worse after starting the bulk, try whey isolate or plant protein and cut back on milk. See a dermatologist if acne is bad or scarring.',
    ]],
  ] },
  { id: 'tracking', title: 'Tracking', blocks: [
    ['list', [
      'Take a front and side photo and write down your lifts now. Compare every 8 weeks.',
      'Log every bench session: weight, sets and reps.',
      'Measure your waist once a month to know when to cut.',
    ]],
  ] },
];
