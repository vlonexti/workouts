// Workouts: the screens. Today is a sign that always says the next thing to lift; Week, Progress, Plan and You are
// the places it points to. The plan itself is in plan.js, what has been logged in store.js, accounts in cloud.js.
import { DAYS, ORDER, WEEKDAYS, REST, BAR, SECTIONS, dayForWeekday, warmupFor, platesText, phaseOn, fromMax } from './plan.js';
import * as store from './store.js';
import * as cloud from './cloud.js';
import { h, clear, icon, picto, shortDate, clock, num } from './ui.js';

const view = document.getElementById('view');
const navEl = document.getElementById('nav');
const ROUTES = [['', 'Today', 'today'], ['week', 'Week', 'week'], ['progress', 'Progress', 'progress'], ['plan', 'Plan', 'plan'], ['you', 'You', 'you']];
const route = () => location.hash.replace(/^#\/?/, '').split('/')[0];

// What only this visit knows: a day picked to train on a rest day, the rest in progress, the words after a session.
const ui = { override: null, rest: null, reps: null, repsFor: '', lastBig: '', lastTone: '', erase: false, message: '' };

/* ---------- small pieces ---------- */

/** Adds children to an element. Unlike the browser's own append, it skips nothing-values and opens up lists. */
const put = (el, ...kids) => { el.append(...kids.flat(Infinity).filter(k => k !== null && k !== undefined && k !== false)); return el; };

const repsText = lift => (!lift.reps ? (lift.failure ? 'to failure' : 'one set') : lift.reps[0] === lift.reps[1] ? `${lift.reps[0]} reps` : `${lift.reps[0]} to ${lift.reps[1]} reps`);
const setsText = lift => (!lift.reps ? `${lift.sets} sets` : `${lift.sets} x ${lift.reps[0] === lift.reps[1] ? lift.reps[0] : `${lift.reps[0]}-${lift.reps[1]}`}`);
const restText = lift => (lift.rest === 'long' ? 'Rest 2 to 3 min' : 'Rest 60 to 90 s');
const with35 = () => !!store.state.profile.plates35;
/** A lift's note. A bench lift says which share of the max it is, and how much has been earned on top since. */
function noteFor(lift, load) {
  if (!lift.pct || !store.ready()) return lift.note || '';
  const base = fromMax(store.state.profile.benchMax, lift.pct), share = `${Math.round(lift.pct * 100)}% of your max`;
  return !Number.isFinite(load) || load === base ? `${share}.` : load > base ? `${share} is ${base} lb, plus ${num(load - base)} lb earned since.` : `${share} is ${base} lb.`;
}

/** The band a page opens on. */
const head = (title, lede) => h('header.head', h('h1', title), lede ? h('p.lede', lede) : null);

function stepper(label, value, onStep, { unit = '', min = 0, step = 1 } = {}) {
  const k = label.toLowerCase().replace(/\W+/g, '-');
  const input = h('input.stepper-value', { inputmode: 'decimal', autocomplete: 'off', 'aria-label': unit ? `${label}, ${unit}` : label, 'data-k': `${k}-value`, value: Number.isFinite(value) ? num(value) : '', placeholder: unit || '0' });
  // typing a number is quicker than tapping up from nothing
  input.addEventListener('change', () => { const v = numberOf(input); if (v !== null && v >= min && v < 2000) onStep(v); else input.value = Number.isFinite(value) ? num(value) : ''; });
  return h('div.stepper', h('span.stepper-label', label, unit ? h('small', ` ${unit}`) : null),
    h('button.step', { type: 'button', 'aria-label': `${label}: less`, 'data-k': `${k}-less`, disabled: !Number.isFinite(value) || value - step < min, onclick: () => onStep(Math.max(min, value - step)) }, icon('minus', 22)),
    input,
    h('button.step', { type: 'button', 'aria-label': `${label}: more`, 'data-k': `${k}-more`, onclick: () => onStep(Number.isFinite(value) ? value + step : step) }, icon('plus', 22)));
}

function field(label, attrs, hint) {
  const input = h('input', { inputmode: 'decimal', autocomplete: 'off', ...attrs });
  return { input, el: h('label.field', h('span.field-label', label), input, hint ? h('span.field-hint', hint) : null) };
}
const numberOf = input => { const v = parseFloat(String(input.value).replace(',', '.')); return Number.isFinite(v) ? v : null; };

/* ---------- the sign ---------- */

/** The yellow panel. `big` is the monumental figure; when it changes, it flaps over like a departure board. */
const sizeOf = text => (String(text).length > 4 ? '.l5' : String(text).length === 4 ? '.l4' : '');
function sign({ top, right, title, line, big, unit, pictogram, foot, next, tone = '' }) {
  const was = ui.lastBig, now = String(big);
  // The figure turns over like a departure board: the old top half falls away, the new bottom half lands.
  // Only between figures set at the same size, and only when the lifter has left that switched on.
  const flap = store.state.profile.motion !== false && was !== '' && was !== now && sizeOf(was) === sizeOf(now) && ui.lastTone === tone;
  ui.lastBig = now;
  ui.lastTone = tone;
  const figure = h(`span.sign-figure${sizeOf(now)}${flap ? '.flap' : ''}`, tone === 'rest' ? { role: 'timer' } : {}, h('span.fig-new', now),
    flap ? [h('i.fig-top', { 'aria-hidden': 'true' }, was), h('i.fig-old', { 'aria-hidden': 'true' }, was), h('i.fig-land', { 'aria-hidden': 'true' }, now)] : null);
  return h(`section.sign${tone ? '.' + tone : ''}`, { 'aria-live': tone === 'rest' ? 'off' : 'polite' },
    top || right ? h('div.sign-top', h('span', top), right ? h('span', right) : null) : null,
    h('div.sign-head', h('div', h('h1.sign-title', title), line ? h('p.sign-line', line) : null), pictogram ? picto(pictogram, '.sign-picto') : null),
    h('div.sign-big', figure, unit ? h('span.sign-unit', unit) : null),
    h('div.sign-foot', h('span', foot || ''), next ? h('span.sign-next', next, h('span.arrow-box', icon('arrow', 16))) : null));
}

/* ---------- Today ---------- */

const todayKey = () => store.dateKey();
function todaysDay() {
  const session = store.sessionOn(todayKey());
  if (session && DAYS[session.day]) return DAYS[session.day];
  if (ui.override && DAYS[ui.override]) return DAYS[ui.override];
  return dayForWeekday(new Date().getDay());
}
/** The days of this week's plan that have a logged session, by day id -> date key. */
function loggedThisWeek() {
  const start = store.parseKey(store.weekKey());
  const out = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const s = store.sessionOn(store.dateKey(d));
    if (s && s.day && Object.values(s.lifts).some(e => e.sets.length)) out[s.day] = store.dateKey(d);
  }
  return out;
}
function nextTraining() {
  for (let i = 1; i <= 7; i++) { const d = new Date(); d.setDate(d.getDate() + i); const day = dayForWeekday(d.getDay()); if (day) return { day, date: d }; }
  return null;
}

/** What the plan's rules make of a finished session, read back from what was logged. */
function outcomeOf(day, session) {
  const out = [];
  for (const lift of day.lifts) {
    const e = session && session.lifts[lift.id];
    if (!e || !lift.reps || e.sets.length < lift.sets || !Number.isFinite(e.w)) continue;
    const clean = e.sets.slice(0, lift.sets).every(r => r >= lift.reps[1]);
    if (lift.pct) out.push(clean ? { kind: 'up', lift, next: e.w + 5, text: `${lift.name}: every rep hit. Next week ${num(e.w + 5)} lb.` } : { kind: 'stay', lift, text: `${lift.name}: stay at ${num(e.w)} lb next week until every rep is there.` });
    else if (clean && !lift.bodyweight) out.push({ kind: 'heavier', lift, text: `${lift.name}: every set hit ${lift.reps[1]}. Go up in weight next time.` });
  }
  return out;
}

/** What the lifter does next in a session: a warm-up step, a working set, or nothing. */
function nextStep(day, session) {
  for (let i = 0; i < day.lifts.length; i++) {
    const lift = day.lifts[i];
    const e = session && session.lifts[lift.id];
    const done = e ? e.sets.length : 0;
    const load = e && Number.isFinite(e.w) ? e.w : store.loadOf(lift.id);
    if (lift.warmup && done === 0 && Number.isFinite(load)) {
      const warm = warmupFor(load), at = e ? e.warm || 0 : 0;
      if (at < warm.length) return { kind: 'warmup', lift, i, at, warm, load };
    }
    if (done < lift.sets) return { kind: 'set', lift, i, at: done, load };
  }
  return { kind: 'finished' };
}

function defaultReps(lift, at) {
  if (!lift.reps) return lift.failure ? 10 : 1;
  // what was done on this set last time, when there was a last time
  const past = Object.entries(store.state.sessions).filter(([key, s]) => key < todayKey() && s && s.lifts && s.lifts[lift.id] && s.lifts[lift.id].sets.length > at).sort((a, b) => b[0].localeCompare(a[0]))[0];
  const last = past ? past[1].lifts[lift.id].sets[at] : null;
  return Math.max(lift.reps[0], Math.min(lift.reps[1], last || lift.reps[0]));
}

function startRest(lift) {
  const total = REST[lift.rest];
  ui.rest = { until: Date.now() + total * 1000, total };
}
let ticker = null;
function tick() {
  clearInterval(ticker);
  if (!ui.rest) return;
  ticker = setInterval(() => {
    if (!ui.rest) return clearInterval(ticker);
    const left = Math.ceil((ui.rest.until - Date.now()) / 1000);
    const figure = document.querySelector('.sign.rest .fig-new');
    if (left <= 0) {
      ui.rest = null;
      clearInterval(ticker);
      if (store.state.profile.buzz !== false && navigator.vibrate) navigator.vibrate([180, 90, 180]);
      if (route() === '') render();
    } else if (figure) { figure.textContent = clock(left); ui.lastBig = clock(left); }
  }, 500);
}

function setupView() {
  const max = field('Bench max', { placeholder: '175', id: 'setup-max' }, 'The most you can bench once, in lb.');
  const goal = field('Bench goal', { placeholder: '200', id: 'setup-goal' }, 'Where you want the max to be.');
  const body = field('Body weight', { placeholder: '160', id: 'setup-body' }, 'This morning, in lb.');
  const problem = h('p.problem', { role: 'alert' });
  const figure = () => numberOf(max.input) || '?';
  const panel = h('div');
  const draw = () => { ui.lastBig = ''; put(clear(panel), sign({ top: '', title: 'Your bench max', line: 'Every bench weight in the plan is a share of it.', big: figure(), unit: 'lb', pictogram: 'bench', foot: 'Monday 80% · Thursday 70% · close-grip 60%' })); };
  max.input.addEventListener('input', draw);
  draw();
  const start = e => {
    e.preventDefault();
    const m = numberOf(max.input), g = numberOf(goal.input), b = numberOf(body.input);
    if (!m || m < 45 || m > 700) { problem.textContent = 'Type your bench max in lb, between 45 and 700.'; max.input.focus(); return; }
    if (g && g <= m) { problem.textContent = 'The goal has to be above your max.'; goal.input.focus(); return; }
    store.setMax(Math.round(m));
    store.setProfile({ goalMax: Math.round(g || Math.ceil((m + 25) / 5) * 5), bodyStart: b || null });
    if (b) store.setWeight(todayKey(), b);
    render();
  };
  return h('div.today', panel, h('form.work', { onsubmit: start, novalidate: true },
    h('div.fields', max.el, goal.el, body.el), problem,
    h('button.btn.primary.big', { type: 'submit' }, 'Start the plan'),
    cloud.user() ? null : h('p.aside', 'Already logging on another device? ', h('a', { href: '#/you' }, 'Sign in'), ' and your numbers come with you.')));
}

function liftRows(day, session, current) {
  return h('ol.rows', day.lifts.map((lift, i) => {
    const e = session && session.lifts[lift.id];
    const done = e ? e.sets.length : 0;
    const state = done >= lift.sets ? 'done' : i === current ? 'now' : 'todo';
    const load = e && Number.isFinite(e.w) ? e.w : store.loadOf(lift.id);
    const detail = done ? `${e.sets.join(' · ')}${lift.bodyweight || !Number.isFinite(e.w) ? '' : ` at ${num(e.w)} lb`}` : `${setsText(lift)}${!lift.bodyweight && Number.isFinite(load) ? ` · ${num(load)} lb` : ''}`;
    return h(`li.row.${state}`, h('span.row-num', state === 'done' ? icon('check', 18) : String(i + 1)), h('span.row-name', lift.name), h('span.row-detail', detail));
  }));
}

function weighIn() {
  const key = todayKey();
  const have = store.state.weights[key];
  const f = field('This morning\'s weight', { placeholder: 'lb', value: have && Number.isFinite(have.v) ? num(have.v) : '', id: 'weigh-in' });
  const save = e => { e.preventDefault(); const v = numberOf(f.input); if (v && v > 60 && v < 500) { store.setWeight(key, v); f.input.blur(); render(); } };
  return h('form.weigh', { onsubmit: save }, f.el, h('button.btn', { type: 'submit' }, have ? 'Change' : 'Save'));
}

function restDayView() {
  const today = new Date();
  const next = nextTraining();
  const phase = phaseOn(today);
  const logged = loggedThisWeek();
  const missed = ORDER.filter(id => !logged[id] && DAYS[id].weekday < ((today.getDay() + 6) % 7) + 1);
  return h('div.today',
    sign({ top: WEEKDAYS[today.getDay()], right: phase.name, title: 'Eat and sleep', line: `${phase.calories}, ${phase.protein} today.`, big: 'Rest', pictogram: 'bed',
      foot: 'Sleep 8+ hours. Drink plenty of water.', next: next ? `${WEEKDAYS[next.date.getDay()]}: ${next.day.name}` : '' }),
    h('div.work',
      weighIn(),
      missed.length ? h('div.block', h('h2', 'Not logged this week'), h('ul.rows', missed.map(id => h('li.row.todo',
        h('span.row-num', picto(DAYS[id].picto, '.small')), h('span.row-name', `${WEEKDAYS[DAYS[id].weekday]}: ${DAYS[id].name}`),
        h('button.btn.small', { type: 'button', onclick: () => { ui.override = id; render(); } }, 'Do it today'))))) : null,
      h('p.aside', 'The whole week is on ', h('a', { href: '#/week' }, 'Week'), '. What to eat is in ', h('a', { href: '#/plan' }, 'Plan'), '.')));
}

function todayView() {
  if (!store.ready()) return setupView();
  const day = todaysDay();
  if (!day) return restDayView();
  const key = todayKey();
  const session = store.sessionOn(key);
  const step = nextStep(day, session);
  const today = new Date();
  const top = `${WEEKDAYS[today.getDay()]} · ${day.name}`;
  const begin = () => store.sessionOn(key) || store.openSession(key, day.id);

  if (step.kind === 'finished') {
    if (session && !session.done) store.finishSession(key);
    const outcome = outcomeOf(day, session);
    const next = nextTraining();
    const after = next ? `${WEEKDAYS[next.date.getDay()]}: ${next.day.name}` : '';
    const earned = outcome.find(o => o.kind === 'up');
    return h('div.today',
      earned
        ? sign({ top, right: 'Logged', title: 'Every rep hit', line: `${earned.lift.name} goes up 5 lb next ${WEEKDAYS[day.weekday]}.`, big: num(earned.next), unit: 'lb', pictogram: 'check', tone: 'good',
          foot: platesText(earned.next, with35()), next: after })
        : sign({ top, right: 'Logged', title: `${day.lifts.length} lifts written down`, line: outcome.length ? outcome[0].text : 'Eat, and sleep 8+ hours.', big: 'Done', pictogram: 'check', tone: 'good',
          foot: 'Eat. Sleep 8+ hours.', next: after }),
      h('div.work',
        // what the sign already says is not said again underneath
        outcome.some(o => o !== earned) ? h('div.block', h('h2', 'Next time'), h('ul.notes', outcome.filter(o => o !== earned).map(o => h('li', o.text)))) : null,
        h('div.block', h('h2', 'What you did'), liftRows(day, session, -1)),
        weighIn(),
        h('div.lonely', h('button.btn.quiet', { type: 'button', onclick: () => { const last = [...day.lifts].reverse().find(l => session.lifts[l.id] && session.lifts[l.id].sets.length); if (last) { store.undoSet(key, last.id); render(); } } }, icon('undo', 18), 'Undo the last set'))));
  }

  const lift = step.lift;
  const count = `Lift ${step.i + 1} of ${day.lifts.length}`;

  // resting between sets: the sign counts down and says what comes after
  if (ui.rest && ui.rest.until > Date.now() && session) {
    const left = Math.ceil((ui.rest.until - Date.now()) / 1000);
    const after = step.kind === 'warmup' ? `Warm-up ${step.at + 1}` : `${lift.name}, set ${step.at + 1} of ${lift.sets}`;
    tick();
    return h('div.today',
      sign({ top, right: count, title: 'Rest', line: `Then ${after}${!lift.bodyweight && Number.isFinite(step.load) ? ` at ${num(step.load)} lb` : ''}.`, big: clock(left), pictogram: 'timer', tone: 'rest',
        foot: restText(lift).replace('Rest ', ''), next: after }),
      h('div.work', h('button.btn.primary.big', { type: 'button', onclick: () => { ui.rest = null; render(); } }, 'Start the next set now'), h('div.block', h('h2', day.name), liftRows(day, session, step.i))));
  }
  ui.rest = null;

  if (step.kind === 'warmup') {
    const [w, reps] = step.warm[step.at];
    return h('div.today',
      sign({ top, right: count, title: `${lift.name}: warm-up`, line: `Warm-up ${step.at + 1} of ${step.warm.length} · ${reps} reps`, big: num(w), unit: 'lb', pictogram: day.picto,
        foot: platesText(w, with35()), next: `Then ${num(step.load)} lb` }),
      h('div.work',
        h('button.btn.primary.big', { type: 'button', onclick: () => { begin(); store.logWarmup(key, lift.id, step.at + 1); render(); } }, 'Warm-up set done'),
        h('button.btn', { type: 'button', onclick: () => { begin(); store.logWarmup(key, lift.id, step.warm.length); render(); } }, 'Skip the warm-up'),
        h('div.block', h('h2', day.name), liftRows(day, session, step.i))));
  }

  // a working set
  const id = `${key}:${lift.id}:${step.at}`;
  if (ui.repsFor !== id) { ui.repsFor = id; ui.reps = defaultReps(lift, step.at); }
  const weight = lift.bodyweight ? null : step.load;
  const big = lift.bodyweight ? (lift.reps ? String(lift.reps[1]) : lift.failure ? 'Max' : String(step.at + 1)) : Number.isFinite(weight) ? num(weight) : 'Pick';
  const unit = lift.bodyweight ? (lift.reps || lift.failure ? 'reps' : `of ${lift.sets}`) : Number.isFinite(weight) ? 'lb' : 'a weight';
  const foot = lift.bar && Number.isFinite(weight) ? platesText(weight, with35()) : lift.note || '';
  const done = () => {
    begin();
    store.logSet(key, lift.id, lift.reps || lift.failure ? ui.reps : 1, weight);
    const after = nextStep(day, store.sessionOn(key));
    if (after.kind !== 'finished') startRest(lift);
    ui.repsFor = '';
    render();
  };
  const changeWeight = w => { store.setLoad(lift.id, w, { up: false }); const s = store.sessionOn(key); if (s && s.lifts[lift.id]) { s.lifts[lift.id].w = w; } render(); };
  return h('div.today',
    sign({ top, right: count, title: lift.name, line: `Set ${step.at + 1} of ${lift.sets} · ${repsText(lift)}`, big, unit, pictogram: day.picto, foot, next: restText(lift) }),
    h('div.work',
      store.goUp(lift.id) ? h('p.notice', icon('flag', 18), `Last time every set hit ${lift.reps[1]}. Go up in weight.`) : null,
      h('button.btn.primary.big', { type: 'button', 'data-k': 'set-done', onclick: done }, 'Set done'),
      h('div.adjust',
        lift.bodyweight ? null : stepper('Weight', weight, changeWeight, { unit: 'lb', min: lift.bar ? BAR : 0, step: 5 }),
        lift.reps || lift.failure ? stepper('Reps done', ui.reps, v => { ui.reps = Math.round(v); render(); }, { min: 0 }) : null),
      lift.pct ? h('p.aside.tight', noteFor(lift, weight)) : lift.note && lift.bar ? h('p.aside.tight', lift.note) : null,
      step.at === 0 && step.i === 0 && day.intro ? h('p.aside.tight', day.intro) : null,
      h('div.block', h('h2', day.name), liftRows(day, session, step.i)),
      session && Object.values(session.lifts).some(e => e.sets.length || e.warm) ? h('div.lonely', h('button.btn.quiet', { type: 'button', onclick: () => {
        const cur = session.lifts[lift.id] && (session.lifts[lift.id].sets.length || session.lifts[lift.id].warm) ? lift : [...day.lifts.slice(0, step.i)].reverse().find(l => session.lifts[l.id] && session.lifts[l.id].sets.length);
        if (cur) { store.undoSet(key, cur.id); ui.rest = null; ui.repsFor = ''; render(); }
      } }, icon('undo', 18), 'Undo the last set')) : null));
}

/* ---------- Week ---------- */

function weekView() {
  const today = new Date();
  const todayNum = today.getDay();
  const logged = loggedThisWeek();
  const active = todaysDay();
  const page = h('div.page');
  put(page, head('This week', 'Four days of lifting, three of rest. A missed day can be done on any other day.'));
  for (const id of ORDER) {
    const day = DAYS[id];
    const isToday = day.weekday === todayNum;
    const status = logged[id] ? `Logged ${shortDate(store.parseKey(logged[id]))}` : active && active.id === id ? 'Today' : day.weekday < ((todayNum + 6) % 7) + 1 ? 'Not logged' : 'To come';
    const table = h('table.plan-table', h('thead', h('tr', h('th', 'Exercise'), h('th', 'Sets x reps'), h('th', 'Weight / notes'))),
      h('tbody', day.lifts.map(lift => {
        const load = store.loadOf(lift.id);
        const weight = lift.bodyweight ? '' : Number.isFinite(load) ? `${num(load)} lb.${lift.bar ? ` ${platesText(load, with35())}.` : ''}` : '';
        return h('tr', h('td', lift.name), h('td.figure', setsText(lift)), h('td', [weight, noteFor(lift, load)].filter(Boolean).join(' ')));
      })));
    put(page, h(`details.day${logged[id] ? '.done' : ''}${active && active.id === id ? '.now' : ''}`, { open: isToday || (active && active.id === id) },
      h('summary', picto(day.picto), h('span.day-name', h('b', WEEKDAYS[day.weekday]), h('span', day.name)), h('span.day-status', status), h('span.day-chevron', icon('chevron', 22))),
      day.intro ? h('p.aside', day.intro) : null,
      h('div.table-wrap', table),
      !logged[id] && !(active && active.id === id) && store.ready() ? h('button.btn', { type: 'button', onclick: () => { ui.override = id; location.hash = '#/'; } }, 'Do this workout today') : null,
      active && active.id === id ? h('a.btn.primary', { href: '#/' }, 'Go to today\'s workout', icon('arrow', 18)) : null));
  }
  put(page, h('div.day.rest', h('div.summary', picto('bed'), h('span.day-name', h('b', 'Friday to Sunday'), h('span', 'Rest, eat, sleep')))));
  return page;
}

/* ---------- Progress ---------- */

function benchRoad() {
  const p = store.state.profile;
  const start = p.startMax || p.benchMax, goal = p.goalMax || p.benchMax + 25, max = p.benchMax;
  const span = Math.max(5, goal - start);
  const share = Math.max(0, Math.min(1, (max - start) / span));
  const ticks = [];
  for (let w = start; w <= goal + 0.01; w += 5) ticks.push(w);
  const due = p.maxDate ? (() => { const d = store.parseKey(p.maxDate); d.setDate(d.getDate() + 42); return d; })() : null;
  const overdue = due && due.getTime() <= Date.now();
  const f = field('New max', { placeholder: String(max + 5), id: 'new-max' });
  const problem = h('p.problem', { role: 'alert' });
  const save = e => {
    e.preventDefault();
    const v = numberOf(f.input);
    if (!v || v < 45 || v > 700) { problem.textContent = 'Type the max you just lifted, in lb.'; return; }
    store.setMax(Math.round(v));
    render();
  };
  return h('section.band',
    h('div.sign-top', h('span', 'Bench max'), h('span', max >= goal ? 'Goal reached' : `${num(goal - max)} lb to go`)),
    h('div.road-figures', h('span.road-now', num(max)), h('span.road-arrow', icon('arrow', 40)), h('span.road-goal', num(goal)), h('span.sign-unit', 'lb')),
    h('div.road', { role: 'img', 'aria-label': `Bench max ${num(max)} lb, from ${num(start)} towards ${num(goal)}` }, h('i', { style: { width: `${share * 100}%` } }), ticks.map((w, i) => h('span.tick', { style: { left: `${(i / (ticks.length - 1 || 1)) * 100}%` } }, num(w)))),
    h('div.sign-foot', h('span', due ? (overdue ? 'A retest is due: every 6 weeks.' : `Retest on ${shortDate(due)} (every 6 weeks).`) : 'Retest every 6 weeks.'), h('span', `Started at ${num(start)}`)),
    h('form.retest', { onsubmit: save }, f.el, h('button.btn.dark', { type: 'submit' }, 'Save the new max'), problem));
}

function progressView() {
  if (!store.ready()) return h('div.page', h('h1', 'Progress'), h('p.lede', 'Nothing to show until the plan has your bench max.'), h('a.btn.primary', { href: '#/' }, 'Set your numbers'));
  const p = store.state.profile;
  const page = h('div.page.progress');
  put(page, head('Progress'), benchRoad());

  put(page, h('h2', 'Working weights'), h('div.table-wrap', h('table.plan-table', h('thead', h('tr', h('th', 'Lift'), h('th', 'Weight'), h('th', 'On the bar'))),
    h('tbody', [['bench-heavy', 'Monday bench, 5 x 5'], ['bench-volume', 'Thursday bench, 4 x 8'], ['close-grip', 'Close-grip, 3 x 8']].map(([id, name]) => {
      const w = store.loadOf(id);
      return h('tr', h('td', name), h('td.figure', `${num(w)} lb`), h('td', platesText(w, with35())));
    })))),
    h('p.aside', `From a ${num(p.benchMax)} lb max: 80%, 70% and 60%, rounded to 5 lb, plus 5 lb for every week all the reps were hit.`));

  const log = store.benchLog();
  put(page, h('h2', 'Bench log'), log.length
    ? h('div.table-wrap', h('table.plan-table', h('thead', h('tr', h('th', 'Date'), h('th', 'Lift'), h('th', 'Weight'), h('th', 'Reps'), h('th', ''))),
      h('tbody', log.slice(0, 24).map(r => h('tr', h('td', shortDate(store.parseKey(r.date))), h('td', r.name), h('td.figure', `${num(r.w)} lb`), h('td.figure', r.sets.join(' · ')), h('td', r.clean ? h('span.tag.good', 'Every rep') : h('span.tag', 'Short')))))))
    : h('p.empty', 'No bench sessions yet. They appear here as you log them, with weight, sets and reps.'));

  // body weight, read as a weekly average
  const weeks = store.weeklyWeights();
  const phase = phaseOn(new Date());
  const last = weeks[weeks.length - 1], before = weeks[weeks.length - 2];
  const change = last && before ? last.avg - before.avg : null;
  let verdict = '';
  if (change !== null && phase.id === 'bulk') verdict = change < 0.25 ? (weeks.length >= 3 && weeks[weeks.length - 2].avg - weeks[weeks.length - 3].avg < 0.25 ? 'Not gaining for 2 weeks: add about 250 calories (a glass of whole milk or a PB&J).' : 'Flat this week. Give it one more week before adding food.') : change > 1.25 ? 'Faster than 1 lb a week: the extra becomes fat. Ease off a little.' : 'On pace: 0.5 to 1 lb a week.';
  if (change !== null && phase.id === 'cut') verdict = change > -0.25 ? 'Not losing yet. Trim a little more.' : change < -1.25 ? 'Faster than 1 lb a week: eat a bit more so you keep your strength.' : 'On pace: 0.5 to 1 lb a week.';
  put(page, h('h2', 'Body weight'), h('p.aside', `${phase.name}, until ${phase.until}. ${phase.goal} Weigh in every morning and read the weekly average.`), weighIn(),
    weeks.length ? h('div.table-wrap', h('table.plan-table', h('thead', h('tr', h('th', 'Week of'), h('th', 'Average'), h('th', 'Change'), h('th', 'Weigh-ins'))),
      h('tbody', weeks.slice(-10).reverse().map((w, i, list) => {
        const prev = list[i + 1];
        const d = prev ? w.avg - prev.avg : null;
        return h('tr', h('td', shortDate(store.parseKey(w.week))), h('td.figure', `${w.avg.toFixed(1)} lb`), h('td.figure', d === null ? '' : `${d > 0 ? '+' : ''}${d.toFixed(1)}`), h('td.figure', String(w.count)));
      })))) : h('p.empty', 'No weigh-ins yet.'),
    verdict ? h('p.notice', icon('flag', 18), verdict) : null);

  // waist, once a month
  const month = store.dateKey().slice(0, 7);
  const have = store.state.waist[month];
  const wf = field(`Waist this month`, { placeholder: 'inches', value: have && Number.isFinite(have.v) ? num(have.v) : '', id: 'waist' });
  const months = Object.entries(store.state.waist).filter(([, r]) => r && Number.isFinite(r.v)).sort((a, b) => b[0].localeCompare(a[0]));
  put(page, h('h2', 'Waist'), h('p.aside', 'Measure once a month. Start cutting early if it grows 1 to 2 inches.'),
    h('form.weigh', { onsubmit: e => { e.preventDefault(); const v = numberOf(wf.input); if (v && v > 15 && v < 80) { store.setWaist(month, v); render(); } } }, wf.el, h('button.btn', { type: 'submit' }, have ? 'Change' : 'Save')),
    months.length ? h('div.table-wrap', h('table.plan-table', h('thead', h('tr', h('th', 'Month'), h('th', 'Waist'))), h('tbody', months.slice(0, 12).map(([m, r]) => h('tr', h('td', shortDate(store.parseKey(m + '-01')).split(' ')[0] + ' ' + m.slice(0, 4)), h('td.figure', `${num(r.v)} in`)))))) : null);

  if (p.started) {
    const start = store.parseKey(p.started);
    const next = new Date(start);
    while (next.getTime() <= Date.now()) next.setDate(next.getDate() + 56);
    put(page, h('h2', 'Photos'), h('p.aside', `Take a front and a side photo and compare every 8 weeks. Next check: ${shortDate(next)}.`));
  }
  return page;
}

/* ---------- Plan ---------- */

function planView() {
  const page = h('div.page.plan');
  const phase = phaseOn(new Date());
  put(page, head('The plan', [`${phase.name} now: ${phase.calories.toLowerCase()} and ${phase.protein} a day. The lifting days are on `, h('a', { href: '#/week' }, 'Week'), '.']));
  put(page, h('nav.jump', { 'aria-label': 'Sections of the plan' }, SECTIONS.map(s => h('a', { href: `#/plan/${s.id}`, onclick: e => { e.preventDefault(); document.getElementById(`s-${s.id}`).scrollIntoView({ behavior: store.state.profile.motion === false ? 'auto' : 'smooth', block: 'start' }); } }, s.title.replace('Quick calories at Kwik Trip or any gas station', 'Gas station calories')))));
  for (const s of SECTIONS) {
    const sec = h('section.read', { id: `s-${s.id}` }, h('h2', s.title));
    for (const [kind, a, b] of s.blocks) {
      if (kind === 'p') put(sec, h(a === 'Cut swaps' ? 'h3' : 'p', a));
      else if (kind === 'list') put(sec, h('ul', a.map(item => { const at = item.indexOf(': '); return at > 0 && at < 34 ? h('li', h('b', item.slice(0, at + 1)), item.slice(at + 1)) : h('li', item); })));
      else if (kind === 'table') put(sec, h('div.table-wrap', h('table.plan-table', h('thead', h('tr', a.map(c => h('th', c)))), h('tbody', b.map(row => h('tr', row.map((c, i) => h(i === row.length - 1 && /cal$/.test(c) ? 'td.figure' : 'td', c))))))));
    }
    put(page, sec);
  }
  return page;
}

/* ---------- You ---------- */

function youView() {
  const p = store.state.profile;
  const me = cloud.user();
  const page = h('div.page.you');
  put(page, head('You', me ? `Signed in as ${me.name}.` : 'Your account, your numbers and your log.'));

  // the account
  if (me) {
    const line = { idle: cloud.sync.at ? `Synced ${new Date(cloud.sync.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.` : 'Signed in.', syncing: 'Syncing…', offline: cloud.sync.error, setup: cloud.sync.error, error: cloud.sync.error, off: '' }[cloud.sync.phase];
    put(page, h('section.block', h('h2', 'Account'), h('p', 'Signed in as ', h('b', me.name), '. Your log is the same on every device you sign in on.'),
      h(`p.sync-line.${cloud.sync.phase}`, icon('sync', 18), line),
      h('div.actions', h('button.btn', { type: 'button', onclick: () => cloud.syncNow() }, 'Sync now'), h('button.btn.quiet', { type: 'button', onclick: () => { cloud.signOut(); render(); } }, 'Sign out'))));
  } else {
    const name = field('Username', { inputmode: 'text', autocomplete: 'username', autocapitalize: 'none', spellcheck: 'false', id: 'user' });
    const pass = field('Password', { type: 'password', inputmode: 'text', autocomplete: 'current-password', id: 'pass' });
    const problem = h('p.problem', { role: 'alert' }, ui.message);
    const button = h('button.btn.primary', { type: 'submit' }, 'Sign in');
    const submit = async e => {
      e.preventDefault();
      button.disabled = true; button.textContent = 'Signing in…'; problem.textContent = '';
      try { await cloud.signIn(name.input.value, pass.input.value); ui.message = ''; render(); }
      catch (err) { problem.textContent = err.message; button.disabled = false; button.textContent = 'Sign in'; }
    };
    put(page, h('section.block', h('h2', 'Account'), h('p', 'Sign in to keep one log on your phone and your computer. It is the same account as on Xenon; make one at ', h('a', { href: 'https://xenon.justloofy.dev', rel: 'noopener' }, 'xenon.justloofy.dev'), '. Without signing in, the log stays on this device.'),
      h('form.signin', { onsubmit: submit }, name.el, pass.el, button, problem)));
  }

  // numbers
  if (store.ready()) {
    const goal = field('Bench goal', { value: num(p.goalMax), id: 'goal' });
    put(page, h('section.block', h('h2', 'Your numbers'),
      h('p', `Bench max ${num(p.benchMax)} lb`, p.maxDate ? `, tested ${shortDate(store.parseKey(p.maxDate))}` : '', '. A new max is entered on ', h('a', { href: '#/progress' }, 'Progress'), '.'),
      h('form.weigh', { onsubmit: e => { e.preventDefault(); const v = numberOf(goal.input); if (v && v > p.benchMax) { store.setProfile({ goalMax: Math.round(v) }); render(); } } }, goal.el, h('button.btn', { type: 'submit' }, 'Change'))));
  }

  const toggle = (label, hint, key) => {
    const input = h('input', { type: 'checkbox', checked: key === 'plates35' ? !!p[key] : p[key] !== false, onchange: () => { store.setProfile({ [key]: input.checked }); } });
    return h('label.toggle', input, h('span', h('b', label), h('small', hint)));
  };
  put(page, h('section.block', h('h2', 'On this plan'),
    toggle('My gym has 35 lb plates', 'Off, the bar is loaded with 45s, 25s, 10s, 5s and 2.5s, the way the plan writes it.', 'plates35'),
    toggle('Buzz when the rest is over', 'The phone vibrates when it is time for the next set.', 'buzz'),
    toggle('Flip the big number when it changes', 'Like a departure board. Off, it changes without moving.', 'motion')));

  // the data
  const file = h('input', { type: 'file', accept: 'application/json,.json', hidden: true, onchange: async () => {
    try { const data = JSON.parse(await file.files[0].text()); if (!data || data.v !== 1) throw new Error(); store.absorb(data); ui.message = ''; render(); }
    catch { alertLine.textContent = 'That file is not a Workouts backup.'; }
  } });
  const alertLine = h('p.problem', { role: 'alert' });
  put(page, h('section.block', h('h2', 'Your log'), h('p', 'A backup is one file with everything you logged.'),
    h('div.actions',
      h('button.btn', { type: 'button', onclick: () => { const a = h('a', { href: URL.createObjectURL(new Blob([store.exportText()], { type: 'application/json' })), download: `workouts-${store.dateKey()}.json` }); document.body.append(a); a.click(); a.remove(); } }, 'Save a backup'),
      h('button.btn', { type: 'button', onclick: () => file.click() }, 'Load a backup'), file),
    alertLine,
    h('div.lonely', ui.erase
      ? h('div.actions', h('span', me ? 'Erase the log on this device? The copy in your account stays until you log again.' : 'Erase everything you logged on this device?'), h('button.btn.danger', { type: 'button', onclick: () => { store.wipe(); ui.erase = false; ui.override = null; location.hash = '#/'; render(); } }, 'Yes, erase it'), h('button.btn', { type: 'button', onclick: () => { ui.erase = false; render(); } }, 'Keep it'))
      : h('button.btn.quiet', { type: 'button', onclick: () => { ui.erase = true; render(); } }, 'Erase this device\'s log'))));
  return page;
}

/* ---------- the frame ---------- */

function drawNav() {
  const here = route();
  put(clear(navEl), h('a.brand', { href: '#/', 'aria-label': 'Workouts, today' }, picto('bench', '.small'), h('span', 'Workouts')),
    ...ROUTES.map(([path, label, ic]) => h(`a.tab${here === path ? '.on' : ''}`, { href: `#/${path}`, 'aria-current': here === path ? 'page' : null }, icon(ic, 24), h('span', label))));
}

const VIEWS = { '': todayView, week: weekView, progress: progressView, plan: planView, you: youView };
let lastRoute = null;
function render() {
  const r = VIEWS[route()] ? route() : '';
  if (r !== '') clearInterval(ticker);
  if (r !== lastRoute) ui.lastBig = '';
  const keepScroll = r === lastRoute ? window.scrollY : 0;
  const held = r === lastRoute && document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.k : '';
  put(clear(view), VIEWS[r]());
  drawNav();
  document.title = r ? `${ROUTES.find(x => x[0] === r)[1]} · Workouts` : 'Workouts';
  document.documentElement.dataset.motion = store.state.profile.motion === false ? 'off' : 'on';
  window.scrollTo(0, keepScroll);
  if (held) { const again = view.querySelector(`[data-k="${held}"]`); if (again && !again.disabled) again.focus({ preventScroll: true }); }
  if (r === 'plan' && r !== lastRoute) { const part = location.hash.split('/')[2]; const el = part && document.getElementById(`s-${part}`); if (el) el.scrollIntoView(); }
  lastRoute = r;
}

window.addEventListener('hashchange', render);
// News from another device arrives while this one is open: show it, unless someone is typing.
store.onChange(() => { if (cloudApplied) { cloudApplied = false; const el = document.activeElement; if (!(el && /^(INPUT|TEXTAREA)$/.test(el.tagName))) render(); } });
let cloudApplied = false;
cloud.onSync(() => { if (cloud.sync.phase === 'syncing') cloudApplied = true; else { cloudApplied = false; if (route() === 'you' && !(document.activeElement && document.activeElement.tagName === 'INPUT')) render(); } });

render();
cloud.startSync();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
