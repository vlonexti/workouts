// Accounts and sync. Workouts uses the same accounts as Xenon (xenon.justloofy.dev): the same Supabase project,
// where a username is the address <name>@users.justloofy.dev. Signing in here never changes anything of Xenon's.
// A lifter's data is one row in the table public.workouts (see supabase/workouts.sql), readable and writable only
// by its owner. This file talks to Supabase with plain fetch; the key below is the project's publishable key, which
// is meant to be public.
import { state, absorb, onChange } from './store.js';

const URL_ = 'https://bgezqqzxoffufpbhkbzl.supabase.co';
const KEY = 'sb_publishable_1HuWlrbiZZDot6OWYDuKtw_SSJLdCoM';
const EMAIL_DOMAIN = 'users.justloofy.dev';
const SESSION = 'workouts.session';

const watchers = new Set();
/** phase: 'off' (not signed in), 'idle', 'syncing', 'offline', 'setup' (the table is not there yet), 'error'. */
export const sync = { phase: 'off', at: 0, error: '' };
const say = patch => { Object.assign(sync, patch); for (const fn of watchers) fn(); };
export function onSync(fn) { watchers.add(fn); return () => watchers.delete(fn); }

let session = null;
try { session = JSON.parse(localStorage.getItem(SESSION)); } catch { /* not signed in */ }
const keep = () => { try { if (session) localStorage.setItem(SESSION, JSON.stringify(session)); else localStorage.removeItem(SESSION); } catch { /* this visit only */ } };

export const user = () => (session ? { id: session.user.id, name: session.user.name } : null);

async function call(path, { method = 'GET', body, token, headers = {} } = {}) {
  let res;
  try {
    res = await fetch(URL_ + path, { method, headers: { apikey: KEY, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers }, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch { const err = new Error('No connection. Your log is kept on this device and will sync later.'); err.offline = true; throw err; }
  let data = null;
  try { data = await res.json(); } catch { /* an empty answer */ }
  if (!res.ok) { const err = new Error((data && (data.msg || data.message || data.error_description)) || `The account service answered ${res.status}.`); err.status = res.status; err.code = data && (data.code || data.error_code); throw err; }
  return data;
}

function adopt(data) {
  const meta = data.user.user_metadata || {};
  session = { access: data.access_token, refresh: data.refresh_token, until: Date.now() + (data.expires_in || 3600) * 1000,
    user: { id: data.user.id, name: meta.username || String(data.user.email || '').split('@')[0] } };
  keep();
}

/** Signs in with a Xenon username and password. */
export async function signIn(username, password) {
  const name = String(username || '').trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9_.-]{2,23}$/.test(name)) throw new Error('A username is 3 to 24 letters, digits, dots, dashes or underscores.');
  if (!password) throw new Error('Type your password.');
  try { adopt(await call('/auth/v1/token?grant_type=password', { method: 'POST', body: { email: `${name}@${EMAIL_DOMAIN}`, password: String(password) } })); }
  catch (err) { if (err.status === 400) throw new Error('That username and password do not match an account. Accounts are made on xenon.justloofy.dev.'); throw err; }
  say({ phase: 'idle', error: '' });
  await syncNow();
}

export function signOut() {
  session = null;
  keep();
  say({ phase: 'off', at: 0, error: '' });
}

async function token() {
  if (!session) return null;
  if (Date.now() < session.until - 60000) return session.access;
  try { adopt(await call('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: session.refresh } })); return session.access; }
  catch (err) {
    if (err.offline) throw err;
    signOut();                    // the sign-in has run out: the log stays on this device
    throw new Error('You were signed out. Sign in again to sync.');
  }
}

let running = null, again = false, applying = false;
/** Fetches the account's copy, merges it with this device's, and saves the result back when this device had news. */
export function syncNow() {
  if (!session) return Promise.resolve();
  if (running) { again = true; return running; }
  running = (async () => {
    say({ phase: 'syncing' });
    try {
      const t = await token();
      const rows = await call(`/rest/v1/workouts?select=data&user_id=eq.${session.user.id}`, { token: t });
      const remote = rows && rows[0] ? rows[0].data : null;
      applying = true;
      let news;
      try { news = absorb(remote); } finally { applying = false; }
      if (news) await call('/rest/v1/workouts?on_conflict=user_id', { method: 'POST', token: t, headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: { user_id: session.user.id, data: state, updated_at: new Date().toISOString() } });
      say({ phase: 'idle', at: Date.now(), error: '' });
    } catch (err) {
      if (err.offline) say({ phase: 'offline', error: err.message });
      else if (err.status === 404 || err.code === 'PGRST205' || err.code === '42P01') say({ phase: 'setup', error: 'Sync is not switched on yet: the workouts table has not been made in the account service.' });
      else say({ phase: session ? 'error' : 'off', error: err.message });
    } finally {
      running = null;
      if (again) { again = false; syncNow(); }
    }
  })();
  return running;
}

/* ---------- when to sync ---------- */

let timer = null;
export function startSync() {
  if (session) say({ phase: 'idle' });
  // a change on this device is sent a moment later, so a burst of taps is one request
  onChange(() => {
    if (!session || applying) return;
    if (running) { again = true; return; }       // a tap during a sync is sent by the next one
    clearTimeout(timer);
    timer = setTimeout(syncNow, 2500);
  });
  window.addEventListener('online', () => syncNow());
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && session && Date.now() - sync.at > 60000) syncNow(); });
  if (session) syncNow();
}
