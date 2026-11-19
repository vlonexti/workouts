# Workouts

A 4-day bulk and strength plan you follow set by set, at <https://workouts.justloofy.dev>.

Open it and one yellow sign says the next thing to lift: the exercise, the set, the weight (already worked out from
your bench max), the plates to put on the bar, and how long to rest. Tap "Set done", rest while it counts down, and it
points at the next set. The plan's rules run by themselves: 5 lb more on a bench day after a week where every rep was
hit, "go up next time" on an accessory that reached the top of its rep range, a retest every 6 weeks.

It is built from one written plan (the Bulk & Strength Plan). Everyone who signs in follows the same routine with
their own numbers.

## What is in it

| Page | What it does |
|---|---|
| **Today** | The sign: warm-up steps before bench, each working set, the rest timer, and what the plan says for next time when the day is done. On a rest day: the weigh-in, and any day of the week that was missed, to do today. |
| **Week** | The four days (Heavy Push, Pull, Legs, Volume Push) with every lift, its sets and reps, the weight and the plates. Any day can be done on another day. |
| **Progress** | The bench max on its way to the goal, the retest date, the three bench weights, every logged bench lift, body weight read as a weekly average (with the plan's advice when it stalls), waist once a month. |
| **Plan** | The reading parts, as written: progression rules, the bulk and cut timeline, nutrition, the school day, no-dinner days, gas-station calories, cut swaps, supplements, recovery, skin care, tracking. |
| **You** | Sign in, your numbers, a few switches, and a backup of your log. |

## How it is built

Plain files, no build step: `index.html`, `css/app.css`, and five JavaScript modules.

- `js/plan.js`: the plan itself. The days and lifts, the rest times, the warm-up, how plates go on the bar, the bulk
  and cut dates, and every reading section. To change the routine, change this file.
- `js/store.js`: what a lifter has entered and logged, kept in the browser (`localStorage`), and the progression
  rules that run when a session is finished. Every record carries the time it was last changed, so two devices merge
  record by record.
- `js/cloud.js`: accounts and sync, with plain `fetch`.
- `js/app.js`: the five pages. `js/ui.js`: small helpers and the pictograms.
- `sw.js`: keeps the site's own files on the phone so it opens with no signal.

To try it on your own computer:

```
python -m http.server 4181
```

and open <http://127.0.0.1:4181>. `node tools/check-rules.mjs` checks the plan's rules (progression, retest, weekly
averages, merging two devices) without a browser.

## Accounts and sync

Workouts has its own Supabase project (`nzzpolqcdjdpwxjmlvfq`), separate from Xenon's. Accounts are made on the You
page: a username becomes the address `<name>@users.justloofy.dev`, which is never written to, so "Confirm email" must
stay off in the project (Authentication, Sign In / Providers, Email).

A lifter's data is one row in the table `public.workouts`, readable and writable only by its owner. To switch sync
on, paste `supabase/workouts.sql` into the Supabase project's SQL Editor once and press Run. Until then the site
works on each device by itself and says on the You page that sync is not switched on yet.

The key in `js/cloud.js` is the project's publishable key, which is meant to be public. Nothing secret is in this
repository.

## Publishing

The site is served by GitHub Pages straight from the `main` branch (Settings, Pages, "Deploy from a branch", `main`,
`/ (root)`). The `CNAME` file sets the address `workouts.justloofy.dev`; the domain needs a CNAME record
`workouts` pointing at `whimsyman.github.io`. A push to `main` is a new version of the site.

## The look

A sign system: saturated yellow panels, black type (Fira Sans), white pictograms on black squares, and the next
weight at the size of a gate number. `PRODUCT.md` is what the product is; `DESIGN.md` is how it looks and why.
