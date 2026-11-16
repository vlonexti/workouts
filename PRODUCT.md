# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: plain static HTML, CSS and JavaScript modules with no build step, served by GitHub Pages from the
repository root at `workouts.justloofy.dev` (repo `vlonexti/workouts`). Chosen because the host is GitHub Pages, the
site is one person's tool shared with a few friends, and the owner's other site (Xenon) is built the same way. It
installs to a phone's home screen through a web manifest.

## Users

The owner (Steve) and a few friends he invites. Each is a young lifter following one 4-day routine. The site is used
mostly on a phone, in the gym, between sets: one hand, sweaty, a few seconds at a time. It is also opened on a Mac or
a PC afterwards to look at progress and to read the plan.

## Product Purpose

Turn the owner's written "Bulk & Strength Plan" into something that is followed and logged instead of re-read:
open it, see today's workout with the weights already worked out, tick off sets, and watch the bench move from 175 lb
towards 200 lb by about February 2027. Success is that every session gets logged and the plan's rules (add 5 lb
after a clean bench day, retest every 6 weeks, weigh in each morning) happen without anyone having to remember them.

## Positioning

It is this one plan, not a general workout app: the routine, the percentages, the warm-up, the progression rules and
the bulk and cut advice are the owner's own, and the site applies them to each person's own numbers.

## Operating Context

- Schedule: Monday Heavy Push, Tuesday Pull, Wednesday Legs, Thursday Volume Push; Friday to Sunday rest.
- Bench weights come from the bench max: Monday 80%, Thursday 70%, close-grip 60%, rounded to the nearest 5 lb.
  Starting point (Nov 2026): body weight about 160 lb, bench max 175 lb, so 140, 125 and 105 lb.
- Plates on a 45 lb bar are part of how weights are read ("bar + 45 + 2.5 each side").
- Warm-up before bench: empty bar x 10, 95 x 5, 115 x 3, then the working sets.
- Rest: 2 to 3 minutes on bench, rows and squats; 60 to 90 seconds on everything else.
- Progression: every rep hit on a bench day adds 5 lb to that day next week; accessories go up when every set
  reaches the top of the rep range; the max is retested every 6 weeks and the percentages recalculated.
- Tracking named by the plan: every bench session (weight, sets, reps), body weight every morning read as a weekly
  average, waist once a month, photos and lifts compared every 8 weeks.
- Phases: lean bulk now to the end of April (gain 0.5 to 1 lb a week, towards 172 to 178 lb), cut May to mid-June,
  then bulk again.

## Capabilities and Constraints

- Sign-in uses the same accounts as Xenon: the same Supabase project, usernames as `<name>@users.justloofy.dev`.
  The workouts data lives in its own table with row-level security; nothing of Xenon's is changed.
- Everyone follows the same routine with their own numbers (bench max, body weight, goal). Editing the routine's
  days and exercises is not part of the product.
- The log is kept in the browser as well and syncs when signed in, so it works with a poor gym signal.
- Units are pounds; plates are the US set (45, 35, 25, 10, 5, 2.5).
- Static hosting only: no server of its own.
- Undecided: whether photos are ever stored (the plan asks for them; the site only reminds for now).

## Brand Commitments

- Address: `workouts.justloofy.dev`. Repository: `vlonexti/workouts`.
- The owner chose that it gets a look of its own rather than Xenon's.
- No name beyond "Workouts" has been chosen.

## Evidence on Hand

- The full plan as written by the owner (Bulk & Strength Plan, 5 pages): schedule, the four days' exercises with
  sets, reps and notes, progression rules, bulk and cut timeline, what to expect, bulk and cut nutrition, school-day
  meals, no-dinner days, gas-station calories, supplements, recovery, skin care, tracking.
- No logged sessions exist yet; nothing about results may be invented.

## Product Principles

1. Today's workout first: the next thing to lift, at the weight the plan says, is one glance away.
2. The plan's own words and numbers, applied to the person's own max; nothing generic added.
3. Logging takes one tap per set, and never needs a signal.
4. Progress is shown as it is: logged numbers only, no invented streaks or scores.
5. The reading parts (food, timeline, rules) stay available but out of the way of the lifting.

## Accessibility & Inclusion

Motion follows the site's own switch only (You, "Flip the big number when it changes", on by default), not the
system's reduced-motion setting: the owner's computer has system animations switched off and he wants his sites to
move anyway. This is his standing rule, first given for Xenon.

Large touch targets and high contrast for use at arm's length in a bright gym; nothing that depends on hover; text
that stays readable when the phone's text size is raised.
