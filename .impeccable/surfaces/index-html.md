---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface: the Workouts app (index.html)

Scope: the whole single-page app (Today, Week, Progress, Plan, Me). Visitor mode: Operate, with Read for the Plan pages.

Audience and job: the owner and invited friends, on a phone in the gym between sets, logging the 4-day plan; afterwards
on a computer, checking progress and reading the plan. Task: see the next set at the right weight, tap it done, rest,
repeat. Content: the owner's Bulk & Strength Plan, each person's own numbers and log. Constraints: one thumb, bright
room, poor signal, static hosting, same accounts as Xenon.

Chosen direction: Next Lift Signage (catalog world: terminal yellow wayfinding), picked by the owner from five sketches.
Memorable moment: the yellow sign re-signing itself to the next set the instant one is tapped done.

Unresolved: photos are only reminded, never stored. Cloud sync is untested against real accounts until the owner runs
the SQL script.

## Direction contract

THESIS: One sign always says the next thing to lift. The screen is a decision point, not a dashboard: lift, set,
weight, plates, rest. It refuses the dark card-stack tracker with a progress ring.

OWN-WORLD: Saturated sign yellow (#FFCC00) bands that own whole regions, sign black (#0B0B0B) type and a black
navigation bar, white pictograms on black inset squares, a quiet grey-white ground for lists. Fira Sans, a humanist
sans in the sign-lettering tradition, sentence case, numerals at monumental scale. Square-shouldered panels with a 2px
black frame; arrows locked to the edge they point past. State colour only where it means something: green for a clean
set, red for missed reps.

STORY: The lifter opens the app and reads one line, taps "Set done", rests while the sign counts down, and is pointed
at the next set. After the last set the sign says what the plan says happens next week.

FIRST VIEWPORT: Phone: a yellow band fills the top 45%: day and lift count on one line, the lift's name, "Set 3 of 5 ·
5 reps", the weight at about 170px with its unit, a black pictogram square, and a ruled footer line with the plates
and the rest time and an arrow. Below, on the grey-white ground: one full-width black "Set done" button, then the
rest of the day as numbered rows. A black bottom bar with four destinations, the current one a yellow tile. Desktop:
a black rail on the left, the sign as a fixed panel beside the day's rows.

FORM: challenger adopted over the assigned direction (seed:260d7aa5db5c3d1e); signature interaction: the sign's
figure turns over as a split-flap (old top half falls on the midline, new bottom half lands) whenever it changes to
another figure of the same kind: the next warm-up weight, a changed weight, next week's weight. Going
to rest and back is the panel's inversion to black with a yellow clock, not a flap. Motion grammar: the flap on the
figure and the quarter turn of a day panel's chevron; nothing else moves, and nothing moves under the pointer.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md,
and every shipping raster carrying its provenance
