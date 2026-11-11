# Dim sum site: state notes

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
