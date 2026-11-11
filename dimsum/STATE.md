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
