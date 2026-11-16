---
name: Workouts
description: A sign system that always says the next thing to lift.
world: "wayfinding-cartography-signage-terminal-yellow-wayfinding"
colors:
  sign-yellow: "#ffcc00"
  sign-black: "#0b0b0b"
  frame: "#1a1a1a"
  ground: "#efefec"
  panel: "#ffffff"
  rule: "#cfcec7"
  ink-2: "#45443f"
  on-yellow-2: "#3a2f00"
  on-black-2: "#c9c7bd"
  good: "#14633a"
  bad: "#b3261e"
typography:
  display:
    fontFamily: "Fira Sans, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(7rem, 44vw, 11.5rem)"
    fontWeight: 800
    lineHeight: 0.8
    letterSpacing: "-0.035em"
  figure:
    fontFamily: "Fira Sans, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(4rem, 20vw, 7rem)"
    fontWeight: 800
    lineHeight: 0.82
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Fira Sans, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  sign-title:
    fontFamily: "Fira Sans, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Fira Sans, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.45
  body:
    fontFamily: "Fira Sans, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.45
  body-strong:
    fontFamily: "Fira Sans, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.45
  label:
    fontFamily: "Fira Sans, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.45
  small:
    fontFamily: "Fira Sans, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  tab:
    fontFamily: "Fira Sans, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "12.5px"
    fontWeight: 700
    lineHeight: 1.45
rounded:
  bullet: "2px"
  chip: "3px"
  tile: "4px"
  panel: "6px"
spacing:
  tight: "8px"
  row: "10px"
  gap: "14px"
  gutter: "22px"
  gutter-wide: "48px"
  target: "52px"
  target-big: "68px"
  bar: "68px"
  rail: "232px"
components:
  sign:
    backgroundColor: "{colors.sign-yellow}"
    textColor: "{colors.sign-black}"
    padding: "18px 22px 16px"
  sign-rest:
    backgroundColor: "{colors.sign-black}"
    textColor: "{colors.sign-yellow}"
  band:
    backgroundColor: "{colors.sign-yellow}"
    textColor: "{colors.sign-black}"
    rounded: "{rounded.panel}"
    padding: "16px 18px 18px"
  button:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.sign-black}"
    rounded: "{rounded.panel}"
    padding: "0 18px"
    height: "48px"
  button-hover:
    backgroundColor: "{colors.sign-yellow}"
  button-primary:
    backgroundColor: "{colors.sign-black}"
    textColor: "{colors.panel}"
    rounded: "{rounded.panel}"
    padding: "0 18px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.frame}"
    textColor: "{colors.sign-yellow}"
  button-primary-big:
    backgroundColor: "{colors.sign-black}"
    textColor: "{colors.panel}"
    rounded: "{rounded.panel}"
    height: "68px"
    width: "100%"
  button-small:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.sign-black}"
    rounded: "{rounded.panel}"
    padding: "0 12px"
    height: "40px"
  button-danger:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.bad}"
    rounded: "{rounded.panel}"
  button-danger-hover:
    backgroundColor: "{colors.bad}"
    textColor: "{colors.panel}"
  step:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.sign-black}"
    rounded: "{rounded.panel}"
    size: "52px"
  step-hover:
    backgroundColor: "{colors.sign-yellow}"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.sign-black}"
    rounded: "{rounded.panel}"
    padding: "0 14px"
    height: "52px"
  picto:
    backgroundColor: "{colors.sign-black}"
    textColor: "{colors.panel}"
    rounded: "{rounded.tile}"
    size: "52px"
  picto-small:
    backgroundColor: "{colors.sign-black}"
    textColor: "{colors.panel}"
    rounded: "{rounded.tile}"
    size: "36px"
  row-num:
    backgroundColor: "{colors.sign-black}"
    textColor: "{colors.panel}"
    rounded: "{rounded.tile}"
    size: "36px"
  row-num-now:
    backgroundColor: "{colors.sign-yellow}"
    textColor: "{colors.sign-black}"
  row-num-done:
    backgroundColor: "{colors.good}"
    textColor: "{colors.panel}"
  day:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.sign-black}"
    rounded: "{rounded.panel}"
    padding: "12px 14px 12px 12px"
  day-now:
    backgroundColor: "{colors.sign-yellow}"
  notice:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.sign-black}"
    rounded: "{rounded.panel}"
    padding: "12px 14px"
  tag:
    textColor: "{colors.sign-black}"
    rounded: "{rounded.tile}"
    padding: "2px 8px"
  tag-good:
    backgroundColor: "{colors.good}"
    textColor: "{colors.panel}"
  jump-link:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.sign-black}"
    rounded: "{rounded.panel}"
    padding: "8px 12px"
  nav:
    backgroundColor: "{colors.sign-black}"
    textColor: "{colors.panel}"
    padding: "8px"
  tab:
    textColor: "{colors.panel}"
    typography: "{typography.tab}"
    rounded: "{rounded.tile}"
    padding: "6px 2px 5px"
  tab-hover:
    textColor: "{colors.sign-yellow}"
  tab-on:
    backgroundColor: "{colors.sign-yellow}"
    textColor: "{colors.sign-black}"
---

# Design System: Workouts

## Overview

**Creative North Star: "Next Lift Signage"**

Workouts is an airport sign system pointed at a barbell. One saturated yellow sign always says the next thing to lift: the lift, the set, the weight at monumental scale, the plates, the rest. The screen is a decision point, read at arm's length in a brightly lit gym with one thumb free, so everything is cut the way a terminal sign is cut: yellow panels that own whole regions, black lettering, white pictograms on black squares, and a quiet grey-white ground for anything that is a list.

There is one theme, chosen from that scene (`color-scheme: light`); there is no dark mode. The one dark surface is the sign itself while resting, when the panel inverts to black and the clock is lit in yellow. The mode is Operate; the Plan page is Read, with the same materials set at reading measure.

Depth is flat. Structure comes from 2px black frames, ruled lines and full-bleed colour, never from shadow. Almost nothing moves: the sign's figure turns over as a split-flap when it changes to another figure of the same kind, and a day panel's chevron turns a quarter when it opens.

**Key Characteristics:**
- One sign, one instruction: the yellow panel is the first thing on Today and the largest thing on the screen.
- Three sign colours carry everything: yellow, black, white, on a grey-white ground. Green and red appear only as state.
- Numerals at monumental scale in Fira Sans 800, sentence case throughout.
- Filled pictograms on black squares; a handful of line marks for controls.
- 2px black frames and rules; no shadows, no gradients.
- Buttons 48px tall, steppers and fields 52px; the main action is 68px tall and full width. Only an action inside a row drops to 40px.

## Colors

A signage palette: one saturated yellow, one near-black and white do the work; a warm grey-white ground stays out of the way.

### Primary
- **Sign Yellow** (`sign-yellow`): the sign on Today, the header band of every other page, the Progress band, today's panel in the week, the current navigation tile, the current row's number. It also answers the pointer: white buttons, steppers and jump links fill yellow on hover. Yellow always covers a whole region or a whole tile; it is never an outline or a text colour on a light surface.
- **Sign Black** (`sign-black`): all lettering, every 2px frame and ruled line, the pictogram squares, the primary button, the navigation bar, table headers, the filled part of the progress road, and the sign itself while resting.

### Neutral
- **Ground** (`ground`): the page behind every list and form.
- **Panel White** (`panel`): framed surfaces on the ground (buttons, inputs, day panels, tables, notices) and the pictogram and text colour on black.
- **Rule** (`rule`): 1px dividers between rows and table lines. Never a frame.
- **Secondary Ink** (`ink-2`): secondary text on the ground and on white: asides, hints, finished rows.
- **Yellow's Dark** (`on-yellow-2`): secondary text on yellow.
- **Black's Light** (`on-black-2`): secondary text on the resting sign.
- **Frame Lift** (`frame`): the primary button's hover ground only.

### State
- **Clean Green** (`good`): a finished row's number, the "Every rep" tag, a logged day's status.
- **Miss Red** (`bad`): error text, a failed sync, and the erase button's frame and label.

### Named Rules
**The Whole Region Rule.** Yellow owns a region edge to edge or a tile corner to corner. It is not a stripe, an underline, a border colour or a highlight behind a word.

**The Own Dark Rule.** Secondary text takes the dark of the surface it sits on: `on-yellow-2` on yellow, `on-black-2` on black, `ink-2` on ground and white. Grey text never sits on yellow.

**The State Only Rule.** Green means a set or session was logged clean; red means something is wrong or will erase. Neither is used for emphasis or decoration.

**The Inversion Rule.** Resting is shown by the sign turning black with yellow lettering, yellow rules and a yellow pictogram square. No other surface inverts.

## Typography

**Display Font:** Fira Sans (with Segoe UI, system-ui, -apple-system, sans-serif)
**Body Font:** Fira Sans, the same family

One humanist sans in the sign-lettering tradition, self-hosted in four weights (400, 500, 700, 800). Hierarchy comes from weight and size alone. Everything is sentence case. Numerals are tabular everywhere except the big figures, which are proportional so "140" sits tight; the rest clock is tabular so it does not jitter as it counts.

### Hierarchy
- **Display** (800, clamp(7rem, 44vw, 11.5rem), line-height 0.8, -0.035em): the sign's figure. Steps down for four characters (clamp(5.4rem, 33vw, 9rem)) and five (clamp(4.2rem, 26vw, 7.4rem)); from 960px it grows to clamp(9rem, min(17vw, 36vh), 17rem). Its unit sits beside it at 1.5rem 800.
- **Figure** (800, clamp(4rem, 20vw, 7rem), line-height 0.82): the current max on the Progress band, with the goal beside it at clamp(2rem, 10vw, 3.2rem).
- **Headline** (800, 2rem, line-height 1.1, -0.015em): the page title on a yellow header band.
- **Sign title** (800, 1.75rem, 2.3rem from 960px, line-height 1.1, balanced): the lift's name on the sign.
- **Title** (800, 1.25rem): section headings on a page; 1.05rem for a block heading under the sign; 1.15rem for a day's name.
- **Body** (400, 17px root, 18px from 960px, line-height 1.45): running text. Reading text is capped at 62ch for asides and ledes, 68ch on the Plan page. Weight 500 for a statement that matters (row names, notices, the sign's second line).
- **Label** (700, 15px): the sign's top line, field labels, small buttons. The sign's foot is the same size at 500.
- **Small** (400 or 700, 14px): hints, day status, table headers; tags at 13px 700.
- **Tab** (700, 12.5px, 1rem in the rail): navigation labels under their pictograms.

### Named Rules
**The Sentence Case Rule.** No uppercase labels and no letter-spaced small caps anywhere. Emphasis is weight 700 or 800.

**The Monument Rule.** Each sign or band has one monumental figure. Negative tracking (-0.035em) and a line-height near 0.8 belong to that figure only.

## Layout

The phone is the primary layout. Today is the sign (at least 46dvh, full bleed, 22px gutters) with the work area under it on the ground: a 14px grid of the main button, the steppers and the day's numbered rows. Every other page opens with a full-bleed yellow header band, then a single column with 22px gutters and a 14px gap; section headings sit 26px below what precedes them. The navigation is a fixed black bar along the bottom, 68px plus the safe-area inset, five equal tabs.

From 960px the bar becomes a 232px black rail on the left with the name and its pictogram at the top; Today splits into two columns, the sign sticky at full viewport height on the left (minmax(380px, 46%)) and the work column beside it (max 640px); pages get 48px gutters and their content is capped at 820px while the header band still runs the full width.

At 620px and below, a day's table drops its header row and stacks: the lift and its sets on one line, the weight and note beneath. Wide tables scroll inside their own frame; the page itself never scrolls sideways. Safe-area insets pad the sign's top, the header band and the bar.

Destructive or undoing actions stand apart at the foot of a view: 44px of space and a 1px rule above them.

## Elevation & Depth

Flat. There are no drop shadows, glows, blurs or gradients. A surface is separated from the ground by a 2px black frame or by being a different solid colour. The single `box-shadow` in the build is an inset 2px black ring that frames the current row's yellow number tile; it is a frame, not a shadow.

### Named Rules
**The Flat Sign Rule.** Nothing floats. If a surface needs to stand out, give it a 2px black frame, fill it yellow, or fill it black.

## Shapes

Square-shouldered with eased corners: 6px on panels, buttons, inputs and frames; 4px on pictogram squares, number tiles, tags and tabs; 3px on the arrow box and the progress road; 2px on the Plan page's square bullets. No pills, no circles as containers.

Frames are 2px solid black on all four sides. Ruled lines are full-width and horizontal: 2px black under the sign's top line, above its foot, above the day's rows and under an open day's summary; 1px `rule` between rows. A rest day's panel is the one dashed frame, on no fill, meaning nothing is scheduled.

Arrows sit in a 24px black box at the trailing edge of the line they belong to, pointing past it.

### Pictograms
Filled figures cut on a 24px grid and shown at about 70% of their black square: 36px in a 52px square, 25px in 36px, 45px in the sign's 64px square (58px in 84px from 960px). Shapes that overlap fill solid; the four with a window cut in them (timer, today, week, plan) use even-odd fill. The only line marks are controls (plus, minus, undo, sync, chevron), drawn with a 2.6 stroke, square caps and mitred joins. In the navigation the pictograms stand bare at 24px, without a square.

### Named Rules
**The Sign's Own Rules Rule.** A ruled line belongs to a sign or a list, runs its full width, and is drawn in that surface's ink. A coloured border on one side of a box, used as an accent, is not part of this system.

**The Filled Figure Rule.** Pictograms are solid silhouettes on a square. Outline icons are reserved for the five control marks.

## Components

### The Sign
The signature component. A full-bleed yellow panel: a top line (two facts, left and right, 15px 700, ruled 2px beneath), the title with its second line and a pictogram square at the right, the monumental figure with its unit pinned to the bottom, and a ruled foot (15px 500) whose right half points at what comes next with an arrow box.
- **Resting:** the panel inverts (see The Inversion Rule); the figure is the countdown.
- **Motion:** when the figure changes to another of the same kind and length, it turns over as a split-flap: the old top half falls forward on the midline (0.19s), then the new bottom half lands (0.21s, cubic-bezier(.16, 1, .3, 1)). Going to rest and back is the inversion, not a flap. The flap follows the site's own switch on the You page (`data-motion` on the root), not the system's reduced-motion setting.

### Header Band and Progress Band
- **Header band:** full-bleed yellow at the top of a page, holding the headline and at most a lede.
- **Progress band:** a framed yellow panel (2px black, 6px) that borrows the sign's top line and ruled foot around the bench max, its arrow to the goal, and the road: a 16px framed track, filled black to the current share, with 13px ticks beneath.

### Buttons
- **Shape:** 6px corners, 2px black frame, 48px minimum height, 700 at 1rem.
- **Primary:** black with white lettering. The main action of a view is the big variant: 68px tall, full width, 800 at 1.25rem. Hover turns the lettering yellow on `frame`.
- **Default:** white with black lettering; fills yellow on hover.
- **Small:** 40px tall, 15px, for an action inside a row.
- **Quiet:** no frame, underlined (2px, 3px offset); the frame appears on hover. Used for undo, sign out and the first step of erasing.
- **Danger:** red frame and lettering on white; fills red with white lettering on hover. Only as the confirming step.
- **Focus:** a 3px black outline offset 3px; yellow on the navigation and on the resting sign.
- **Disabled:** 45% opacity.
- Hover changes colour only, over 0.12s.

### Steppers
A label, then minus, a centred value field (1.5rem 800), then plus. The step buttons are 52px white squares with a 2px frame and a line mark; they fill yellow on hover and drop to 35% when disabled.

### Inputs / Fields
- **Style:** 52px tall, white, 2px black frame, 6px corners, 1.1rem 500. Label above at 15px 700, hint beneath at 14px in `ink-2`.
- **Focus:** the 3px black outline, offset 2px.
- **Error:** a line of red 500 text under the field; the field itself does not change.
- **Checkbox rows:** a 24px black-accented box, a bold label and a small hint, divided by 1px rules.

### Numbered Rows
The rest of the day under a 2px black rule: a 36px black number tile, the name (500), the detail right-aligned (700), a 1px rule beneath. The current row's tile is yellow with an inset black frame and its name is 800; a finished row's tile is green and its name drops to `ink-2`.

### Day Panels
One framed white panel per day: a 52px pictogram square, the day and its name, a status, and a chevron. Today's panel is yellow. Opening it rules off the summary with 2px black and turns the chevron a quarter (0.18s). A rest day has a dashed frame and no fill.

### Tables
White, framed 2px, 6px corners; a black header row with white 14px 700 labels; 1px rules between rows; first column 700. Inside a day panel the frame and header fill are dropped.

### Tags and Notices
- **Tag:** 13px 700 in a 2px black frame with 4px corners; the clean-session tag is filled green with white lettering.
- **Notice:** a framed white box with a flag pictogram and one 500-weight sentence, for something the plan says to do now.

### Navigation
A black bar of five tabs (Today, Week, Progress, Plan, You): a bare 24px pictogram over a 12.5px 700 label in white. The current tab is a yellow tile with black content; hover turns a tab's content yellow. From 960px it is the left rail, with pictogram and label side by side at 1rem. The Plan page adds a row of framed white jump links that scrolls sideways on a phone and wraps on a wide screen.

## Do's and Don'ts

### Do:
- **Do** open Today with the sign and put one monumental figure on it; everything else on the sign is one line.
- **Do** let yellow own a whole region or tile, and letter it in black.
- **Do** frame surfaces with 2px black and separate rows with 1px `rule`.
- **Do** put pictograms on a black square at about 70% of its size, filled, on the 24px grid.
- **Do** keep buttons 48px tall and steppers and fields 52px, with the main action 68px and full width; 40px is for an action inside a row only.
- **Do** write in sentence case and carry emphasis with weight 700 or 800.
- **Do** give secondary text the dark of its own surface (`on-yellow-2`, `on-black-2`, `ink-2`).
- **Do** tie any motion to the site's own switch on the You page.
- **Do** set destructive and undo actions apart at the foot of the view.

### Don't:
- **Don't** use a coloured border on one side of a box as decoration. The ruled lines at a sign's top and foot are the sign's own rules, in its ink, and are not this.
- **Don't** move anything under the pointer on hover. Hover changes colour and nothing else.
- **Don't** add motion beyond the split-flap of the sign's figure and the quarter turn of a day panel's chevron.
- **Don't** key motion to `prefers-reduced-motion`; the owner's switch decides.
- **Don't** add a second theme or a dark mode. The resting sign is the only dark surface.
- **Don't** use shadows, gradients, blurs or glows.
- **Don't** use green or red for anything but logged-clean and error or erase.
- **Don't** set grey text on yellow, or yellow text on white or the ground.
- **Don't** use outline icons for anything but plus, minus, undo, sync and chevron.
