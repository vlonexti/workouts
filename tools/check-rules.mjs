// The plan's rules, checked without a browser: progression, retest, weekly averages, merging two devices.   node tools/check-rules.mjs
const mem = new Map();
globalThis.localStorage = { getItem: k => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: k => mem.delete(k) };
const store = await import('../js/store.js');
const { DAYS } = await import('../js/plan.js');
const out = [];
const check = (name, ok, extra = '') => out.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${extra ? '  ' + extra : ''}`);

store.setMax(175, '2026-11-16');
check('bench weights from a 175 max', store.loadOf('bench-heavy') === 140 && store.loadOf('bench-volume') === 125 && store.loadOf('close-grip') === 105, [store.loadOf('bench-heavy'), store.loadOf('bench-volume'), store.loadOf('close-grip')].join('/'));
check('an accessory has no weight until one is chosen', store.loadOf('incline-db') === null);

// Monday, every rep hit on bench; incline at the top of the range; shoulder press short of it
const key = '2026-11-16';
store.openSession(key, 'mon');
for (let i = 0; i < 5; i++) store.logSet(key, 'bench-heavy', 5, 140);
for (let i = 0; i < 3; i++) store.logSet(key, 'incline-db', 10, 50);
for (const r of [10, 9, 8]) store.logSet(key, 'seated-db-press', r, 40);
for (let i = 0; i < 3; i++) store.logSet(key, 'flys', 12, 25);
for (let i = 0; i < 3; i++) store.logSet(key, 'pushdowns', 12, 45);
for (const r of [14, 11]) store.logSet(key, 'finisher-dips', r, null);
const notes = store.finishSession(key);
check('a clean bench day adds 5 lb', store.loadOf('bench-heavy') === 145, notes[0]);
check('an accessory at the top of its range is marked to go up', store.goUp('incline-db') && !store.goUp('seated-db-press'));
check('the accessory weight is remembered', store.loadOf('incline-db') === 50 && store.loadOf('seated-db-press') === 40);
check('finishing twice changes nothing', store.finishSession(key).length === 0 && store.loadOf('bench-heavy') === 145);

// Thursday: bench misses reps, close-grip is clean
const thu = '2026-11-19';
store.openSession(thu, 'thu');
for (const r of [8, 8, 7, 6]) store.logSet(thu, 'bench-volume', r, 125);
for (let i = 0; i < 3; i++) store.logSet(thu, 'close-grip', 8, 105);
const notes2 = store.finishSession(thu);
check('a short bench day stays put', store.loadOf('bench-volume') === 125, notes2[0]);
check('a clean close-grip day adds 5 lb', store.loadOf('close-grip') === 110);

// a retest resets all three to their share of the new max
store.setMax(185, '2026-12-28');
check('retest at 185: 150 / 130 / 110', store.loadOf('bench-heavy') === 150 && store.loadOf('bench-volume') === 130 && store.loadOf('close-grip') === 110, [store.loadOf('bench-heavy'), store.loadOf('bench-volume'), store.loadOf('close-grip')].join('/'));
check('the first max stays the starting point', store.state.profile.startMax === 175 && store.state.profile.benchMax === 185);

// weekly averages, Monday to Sunday
store.setWeight('2026-11-16', 160); store.setWeight('2026-11-18', 161); store.setWeight('2026-11-22', 162); store.setWeight('2026-11-23', 162.5);
const weeks = store.weeklyWeights();
check('body weight is averaged by week', weeks.length === 2 && Math.abs(weeks[0].avg - 161) < 1e-9 && weeks[0].count === 3 && weeks[1].avg === 162.5, JSON.stringify(weeks));

// two devices: the newer record wins, record by record, and nothing is lost
const phone = JSON.parse(JSON.stringify(store.state));
const laptop = JSON.parse(JSON.stringify(store.state));
phone.sessions['2026-11-17'] = { day: 'tue', lifts: { 'barbell-row': { w: 95, warm: 0, sets: [8, 8, 8, 8] } }, done: true, t: Date.now() + 10 };
laptop.weights['2026-11-24'] = { v: 163, t: Date.now() + 20 };
laptop.loads['incline-db'] = { w: 55, up: false, t: Date.now() + 30 };
const merged = store.merge(phone, laptop);
check('merge keeps the phone\'s session and the laptop\'s weigh-in', !!merged.sessions['2026-11-17'] && merged.weights['2026-11-24'].v === 163 && merged.loads['incline-db'].w === 55 && !!merged.sessions[key]);
check('merge is the same in either order', JSON.stringify(Object.keys(store.merge(laptop, phone).sessions).sort()) === JSON.stringify(Object.keys(merged.sessions).sort()));

const log = store.benchLog();
check('the bench log lists every bench lift', log.length === 3 && log[0].date === thu, log.map(r => `${r.date} ${r.name} ${r.w} ${r.sets.join('.')} ${r.clean}`).join(' | '));
check('every day has its lifts', Object.values(DAYS).map(d => d.lifts.length).join() === '6,7,6,6');
console.log(out.join('\n'));
process.exit(out.some(l => l.startsWith('FAIL')) ? 1 : 0);
