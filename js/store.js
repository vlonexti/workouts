// What a lifter has entered and logged. It is kept in this browser, and synced to their account when they are signed
// in (cloud.js). Every record carries the time it was last changed (t), so two devices can be merged: the newer
// record wins, record by record.
import { DAYS, liftById, fromMax } from './plan.js';

const KEY = 'workouts.state.v1';
const listeners = new Set();

const blank = () => ({
  v: 1,
  profile: { t: 0, benchMax: null, startMax: null, goalMax: null, bodyStart: null, started: null, maxDate: null, plates35: false, motion: true, buzz: true },
  loads: {},        // liftId -> { w, up, t }     the working weight in use, and "go up next time"
  sessions: {},     // 'YYYY-MM-DD' -> { day, lifts: { liftId: { w, warm, sets: [reps] } }, done, t }
  weights: {},      // 'YYYY-MM-DD' -> { v, t }   body weight, lb
  waist: {},        // 'YYYY-MM' -> { v, t }      inches
  maxes: {},        // 'YYYY-MM-DD' -> { v, t }   tested bench maxes
});

function read() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.v === 1) return { ...blank(), ...saved, profile: { ...blank().profile, ...(saved.profile || {}) } };
  } catch { /* a fresh start */ }
  return blank();
}

export let state = read();

export const now = () => Date.now();
export const dateKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const parseKey = key => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d || 1); };

export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function save(quiet = false) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage is full or off: this visit only */ }
  if (!quiet) for (const fn of listeners) fn();
}

/* ---------- merging two copies ---------- */

const newer = (a, b) => (!a ? b : !b ? a : (b.t || 0) > (a.t || 0) ? b : a);
function mergeMap(a = {}, b = {}) {
  const out = {};
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) out[key] = newer(a[key], b[key]);
  return out;
}
/** The union of two copies of a lifter's data. */
export function merge(a, b) {
  if (!b || b.v !== 1) return a;
  return { v: 1, profile: { ...blank().profile, ...newer(a.profile, b.profile) }, loads: mergeMap(a.loads, b.loads), sessions: mergeMap(a.sessions, b.sessions),
    weights: mergeMap(a.weights, b.weights), waist: mergeMap(a.waist, b.waist), maxes: mergeMap(a.maxes, b.maxes) };
}
/** Takes in a copy from the account. Returns true when this browser's copy held something the account's did not. */
export function absorb(remote) {
  state = merge(state, remote);
  save();
  return !remote || JSON.stringify(merge(blank(), remote)) !== JSON.stringify(state);
}
export function replaceAll(next) { state = merge(blank(), next); save(); }
export function wipe() { state = blank(); save(); }

/* ---------- the lifter's numbers ---------- */

export function setProfile(patch) { state.profile = { ...state.profile, ...patch, t: now() }; save(); }
export const ready = () => Number.isFinite(state.profile.benchMax) && state.profile.benchMax > 0;

/** The weight in use for a lift: the remembered one, or for a bench lift its share of the max. Null when not chosen yet. */
export function loadOf(liftId) {
  const kept = state.loads[liftId];
  if (kept && Number.isFinite(kept.w)) return kept.w;
  const lift = liftById(liftId);
  return lift && lift.pct && ready() ? fromMax(state.profile.benchMax, lift.pct) : null;
}
export function setLoad(liftId, w, extra = {}) {
  state.loads[liftId] = { ...(state.loads[liftId] || {}), w, ...extra, t: now() };
  save();
}
export const goUp = liftId => !!(state.loads[liftId] && state.loads[liftId].up);

/** A tested max: the three bench weights go back to their share of it. */
export function setMax(max, date = dateKey()) {
  state.maxes[date] = { v: max, t: now() };
  for (const id of ['bench-heavy', 'bench-volume', 'close-grip']) state.loads[id] = { w: fromMax(max, liftById(id).pct), up: false, t: now() };
  state.profile = { ...state.profile, benchMax: max, maxDate: date, startMax: state.profile.startMax || max, started: state.profile.started || date, t: now() };
  save();
}

/* ---------- sessions ---------- */

export const sessionOn = key => (state.sessions[key] && !state.sessions[key].gone ? state.sessions[key] : null);
/** Starts (or returns) the session for a date. */
export function openSession(key, dayId) {
  const have = sessionOn(key);
  if (have && have.day === dayId) return have;
  state.sessions[key] = { day: dayId, lifts: {}, done: false, t: now() };
  save();
  return state.sessions[key];
}
const entry = (session, liftId) => (session.lifts[liftId] ||= { w: loadOf(liftId), warm: 0, sets: [] });
function touch(key) { state.sessions[key].t = now(); save(); }

export function logWarmup(key, liftId, count) { entry(state.sessions[key], liftId).warm = count; touch(key); }
export function logSet(key, liftId, reps, weight) {
  const e = entry(state.sessions[key], liftId);
  e.w = weight;
  e.sets.push(reps);
  touch(key);
}
export function undoSet(key, liftId) {
  const e = state.sessions[key] && state.sessions[key].lifts[liftId];
  if (!e) return;
  if (e.sets.length) e.sets.pop(); else if (e.warm) e.warm--;
  state.sessions[key].done = false;
  touch(key);
}
export function removeSession(key) { state.sessions[key] = { day: null, lifts: {}, done: false, gone: true, t: now() }; save(); }

/**
 * Closes a session and applies the plan's progression rules. Returns what changed, as sentences for the sign.
 *  - a bench lift with every rep hit goes up 5 lb for next week;
 *  - an accessory with every set at the top of its range is marked "go up next time".
 */
export function finishSession(key) {
  const session = state.sessions[key];
  if (!session || session.done) return [];
  const notes = [];
  for (const lift of DAYS[session.day].lifts) {
    const e = session.lifts[lift.id];
    if (!e || !lift.reps || e.sets.length < lift.sets) continue;
    const top = lift.reps[1];
    const clean = e.sets.slice(0, lift.sets).every(r => r >= top);
    if (lift.pct) {
      if (clean && Number.isFinite(e.w)) { setLoad(lift.id, e.w + 5, { up: false }); notes.push(`${lift.name}: every rep hit. Next week ${e.w + 5} lb.`); }
      else notes.push(`${lift.name}: stay at ${e.w} lb next week until every rep is there.`);
    } else if (!lift.bodyweight && Number.isFinite(e.w)) {
      state.loads[lift.id] = { ...(state.loads[lift.id] || {}), w: e.w, up: clean, t: now() };
      if (clean) notes.push(`${lift.name}: every set hit ${top}. Go up in weight next time.`);
    }
  }
  session.done = true;
  touch(key);
  return notes;
}

/* ---------- body ---------- */

export function setWeight(key, v) { state.weights[key] = { v, t: now() }; save(); }
export function setWaist(month, v) { state.waist[month] = { v, t: now() }; save(); }

const monday = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
export const weekKey = (d = new Date()) => dateKey(monday(d));
/** Body weight by week (Monday to Sunday): [{ week, avg, count }], oldest first. */
export function weeklyWeights() {
  const weeks = new Map();
  for (const [key, rec] of Object.entries(state.weights)) {
    if (!rec || !Number.isFinite(rec.v)) continue;
    const w = weekKey(parseKey(key));
    const list = weeks.get(w) || [];
    list.push(rec.v);
    weeks.set(w, list);
  }
  return [...weeks.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([week, list]) => ({ week, count: list.length, avg: list.reduce((n, v) => n + v, 0) / list.length }));
}

/** Every logged bench lift, newest first: [{ date, liftId, name, w, sets, target, clean }]. */
export function benchLog() {
  const out = [];
  for (const [date, s] of Object.entries(state.sessions)) {
    if (!s || !s.day || !DAYS[s.day]) continue;
    for (const lift of DAYS[s.day].lifts) {
      const e = s.lifts[lift.id];
      if (!lift.pct || !e || !e.sets.length) continue;
      out.push({ date, liftId: lift.id, name: lift.id === 'close-grip' ? 'Close-grip' : `${DAYS[s.day].name} bench`, w: e.w, sets: e.sets, target: lift.reps[1], clean: e.sets.length >= lift.sets && e.sets.every(r => r >= lift.reps[1]) });
    }
  }
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

export const exportText = () => JSON.stringify(state, null, 1);
