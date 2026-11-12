# Dim sum site: state notes

## 2026-11-12 no more stuck scrolling
- User: the scroll motion was smooth but "First time at yum cha?" made you feel stuck, and "What every table orders" should really scroll left and right instead of being driven by page scroll.
- Story: the 300% pin is gone. The steps scroll normally; a sticky stage (beside on desktop, under the header on phones) shows the scene for the step being read (ScrollTrigger on `.steps`, top 60% to bottom 50%). All step text stays visible; inactive steps sit at opacity .8 so grey text keeps 4.5:1.
- Cart: the pin and the scroll-driven sideways timeline are gone. `.cart-view` is a native scroller (snap to the container edge, thin jade scrollbar, overscroll contained); mouse users get previous/next arrows (translated aria-labels, disabled at the ends); the wheels rotate with scrollLeft (still under reduced motion). Works without GSAP too.
- Desktop page is about 4,000px shorter (7,617px at 1440).
- Audit script: phones now emulate touch (hover none), and disabled controls are skipped in the focus test.
- Checked: audit passes (8 sizes, 3 weights, 0 off-scale spacing, 0 errors, no overflow, reduced motion clean); no pin spacers; scenes 0-3 play at 390 and 1440; arrows scroll the cart and roll the wheels; page scroll never moves the cart; screenshots at both widths.
- Not committed.

## 2026-11-11 Supabase style tokens (AnimatedWebs)
- The user asked for "jade green with crisp whites, charcoal grays or deep blacks". The AnimatedWebs library has 43 tech-brand styles and no jade match, so the closest 3 were offered (Supabase, Shopify, Vercel) and the user picked Supabase.
- Applied as tokens in `site.css :root`, not one-off values: white canvas (`--paper` #fff), light charcoal alternate sections (`--paper-2` #f4f4f4: the cart, holiday hours, wait-bar tracks), Void text and headings (`--text` #111), Ash secondary text (`--muted` #525252), `--radius` 8px and `--radius-lg` 16px, one shadow (`--shadow`, `--shadow-dark` on jade). The story section moved from warm paper to white.
- Kept on purpose: jade for bands, links and controls; red for the main button and chop; gold for the sign and big numbers; Archivo and the 8-step type scale; printed parts square. Not used: Supabase's purple and orange, its fonts, logo, copy or imagery.
- Checked: polish audit passes (8 sizes, 3 weights, 0 off-scale spacing, 0 errors, no overflow); contrast lowest pair Ash on #f4f4f4 7.1:1; screenshots EN desktop and phone, 繁 menu on phone.
- Not committed.

## 2026-11-11 hero steam (AnimatedWebs)
- Took only the steam technique from the AnimatedWebs template "Steaming Ramen Noodle Bar" (free; commercial use allowed, don't resell the prompt). The rest of that template (ramen bowl, bowl builder, Rubik fonts, cream palette) was not used.
- Hero steam: 5 SVG wisps (3 under 768px) curled by feTurbulence + feDisplacementMap (baseFrequency 0.012 0.04, scale 18, one octave; two looked like rippled rope). The template animates the noise seed, which jumps; here the base frequency drifts smoothly over 10s instead. Mouse hover on the steamer puffs it for 1s. The filter's SMIL animation pauses off screen and with reduced motion; reduced motion shows the wisps still at 50%.
- Checked: polish audit still passes (8 sizes, 3 weights, 0 off-scale spacing, 0 errors, no overflow, reduced motion leaves nothing running); 3 wisps at 390, 5 at 1440; puff on and off after 1s. Not checked on a real phone for frame rate.
- Not committed.

## 2026-11-11 polish pass (this session: dim sum only)
- Goal: premium detail without changing content, features, i18n or motion. Audit script: `Claude outputs/audit/dimsum-polish-audit.mjs`; reports `dimsum-before.txt`, `dimsum-pass1.txt` to `dimsum-pass3.txt`, `dimsum-after.txt` beside it.
- Before → after (all 3 pages x 3 languages x 390/1440): font sizes 24 per page view / 41 site-wide → 8 / 8 (16 18 22 28 40 64 144 288); weights 6 → 3; widest line 78.8ch / 45.9em → 65ch / 32.6em; off-scale spacing 52 values in 12,915 uses → 0; controls with no pressed state up to 101 per view → 0, no transition 102 → 0, no disabled style 78 → 0, no hover 3 → 0; prices and times without tabular numbers 384 → 0; heading issues 8 → 0. Overflow, console errors, broken links and reduced-motion leftovers were 0 before and after.
- Fluid clamp() sizes and spacing replaced by fixed steps at 901px and 1200px. Section headings that were 25px (Before you visit, Holiday hours, Private room) now match the others (40 / 64).
- Fixed from screenshots: burger lines overflowing its box, private room heading touching its text, peak wait-bar chip taller than the bar, the takeout phone link breaking its line. 繁/简: phrase-level line breaks for paragraphs; the hero address breaks before its bracket.
- Hero unchanged: it already has its own layout (vertical sign | text | steamer with the order sheet), not a card over a photo.
- Not committed.

## 2026-11-11 personality pass (this session: dim sum only)
- Goal: the order sheet (點心紙) as the full-scale hero, red ticks and a stamp landing, one bold colour, no thin boxes. Content, photos and features unchanged.
- DESIGN.md updated first (hero, jade bands, no boxes, layout diagrams, motion, removed decoration).
- Hero rebuilt as a printed sheet: header row (點心紙 / Table 12 / Guests 4 in pencil / red chop), full-width jade name band, today grid + main button, dish grid by tier with pencil tallies and 5 red ticks. The steamer photo is a cell of the sheet.
- Motion: ticks draw 140 ms apart, then the chop stamps; ends at 1.31 s; runs once (no replay on language switch); none under reduced motion.
- Chop is always stamped: 營業中 / 营业中 when open, 休息中 when closed (font subset updated).
- Page: bigger section headings, open-ruled grids instead of boxed tables, unframed photos, private room and "Book a table" as full-width jade bands.
- Phone menu (qr.html): the sheet bar wrapped in English at phone width; it's now two rows (count over total, "Show your sheet" on the right).
- Checks (CDP script, Chrome headless): 3 pages x 3 languages x 360/390/1440 px. No overflow, button wraps, one-character Chinese lines or console errors; all links resolve; QR search, empty state, tally, sheet dialog and guests work; toggle sets lang/title/alt and is remembered; reduced motion shows the final state with no animations.
- First screen (390x844): button bottom at 565 px EN, 509 px 繁. Desktop (1440x900): whole sheet ends at 888 px.
- Screenshots: phone EN + 繁 and desktop EN full page at 0.4 to 0.5 scale, then re-shot the two changed first screens. Not committed.

## 2026-11-11 signboard concept pass (from concept.html)
- Home page rebuilt to the owner-approved concept: vertical 翠籠軒 signboard, steamer photo with steam, tilted order sheet with ticks and chop, red $5.50 band, pinned "First time at yum cha?" story, tappable order sheet, wait bars, deep jade hours/map/footer with the 翠籠軒 sign-off, lid-lift intro (once per visit, skippable, ~1.4 s).
- Kept: shared i18n, menu-data prices and Toronto-time status, holiday hours, private room, map embed and directions, phone bar, all links (#hours, #info, #room still work from menu.html).
- The tappable sheet writes to the same `jb-sheet` as the menu and phone menu (checked: ticks on home show up on menu.html).
- Shared styles changed for all three pages: jade header with gold sign and pill toggle, red main button, deep jade footer and phone bar. Old home styles removed.
- Concept translations moved into i18n-dict.js (HK wording for 繁, mainland for 简). The sign stays 翠籠軒 in every language (it's the sign over the door).
- Checks: 3 pages x 3 languages x 360/390/1440 px clean (overflow, wraps, Chinese line breaks, links, console). Intro once and skippable; story steps follow scroll; steam pauses off screen; nothing replays on language switch; reduced motion: no intro, no animations, story becomes a list.
- Fixed from checks/screenshots: menu phone bar button wrap at 360 px, "Hong / Kong" and "in" line breaks in the EN headline, 節日營業時間 splitting on desktop, morning price shown on the tappable sheet rows (rows now show regular prices; the total uses the morning price with a note, like the menu's sheet).
- concept.html moved to the Trash. Not committed.

## 2026-11-11 concept v2 pass (from ~/Downloads/concept-v2.html, file kept)
- Scroll motion now runs on GSAP 3.12.5 + ScrollTrigger (cdnjs, SRI, defer) instead of the hand-written scroll handler. Same fallback as the concept: no GSAP or reduced motion leaves a normal page (plain story list, swipeable cart, full bars, plain sign-off).
- Deliberate differences from the concept: GSAP is deferred so hours/status never wait for the CDN; the sign only drifts on desktop (on phones it would cover the headline); the $5.50 only slides left (never into its heading); gsap.matchMedia reverts cleanly if reduced motion is switched on; pinned scenes clear the phone call bar.
- "What every table orders" is now the pinned dim sum cart (9 dishes, 4 photos, 5 stamped lids) with Your sheet; ticks still go into `jb-sheet` (checked on menu.html). The old photo grid's weekend photo moved to Before you visit.
- New strings (cart lede, Tick it / Ticked, empty sheet line) are in i18n-dict.js in all three languages.
- Checks: 3 pages x 3 languages x 360/390/1440 px clean; GSAP loads and runs 7 triggers; story and cart pins verified at 390 and 1440 (last dish fully on screen, no sideways scroll); reduced motion and a blocked CDN both give the plain page with no script errors.
- Fixed from checks/screenshots: 繁 status line leaving 開始 alone at 360 px (balanced), phone call bar covering the pinned cart's rail and wheels.
- Not committed.
