# Review log: Jade Basket Dim Sum House (dimsum/)

Agent working only in `dimsum/` (plus this log). Scripts and screenshots live in the session scratchpad under `scratchpad/dimsum/`.

## Step 0. Inventory of the version I started from (commit c577e89)

Every item below must still work at the end in EN, 繁 and 简.

### Every page
- Shared i18n engine `../shared/i18n.js` (localStorage `mp-lang`, `?lang=` override, `data-i18n`, `data-i18n-html`, `data-i18n-attr`, `data-set-lang` buttons with `aria-pressed`, `mp:langchange` event). Site dictionary in `assets/i18n-dict.js`.
- Header: brand 翠籠軒 + "Jade Basket Dim Sum House", main nav (Menu, Hours and location, Before you visit, Private room, Phone menu), EN/繁/简 toggle (38x40 on phone, fails 44px), phone number button (desktop), burger on ≤980px (aria-expanded, label swaps open/close, closes on link click, Escape and resize).
- Skip link.
- Footer: about line ("family-run since 2009"), hours summary, address, tap-to-call, `.example` email, page links, © line, demo note linking to `../index.html`.
- Sticky phone call bar (≤640px): Call / Menu (or Phone menu) / Get directions.
- Map iframe language follows page language (hl=en / zh-TW / zh-CN).

### index.html
- Hero: H1, intro line, "Today" box computed in JS (today's row from the hours table, holiday override from the holiday table, Open now / Closed now / Holiday hours). Uses the visitor's LOCAL clock, not America/Toronto (bug). Does not say whether dim sum is being served.
- Hero buttons "See the menu" + "Call to book a table" (two equal buttons; below the fold on a 390x844 phone: fails the hero check).
- Hours table (Mon–Thu, Fri, Sat, Sun, today's row highlighted), dim sum vs dinner note, link to holiday hours.
- Address block, parking note, directions link; reservations/takeout block with big tap-to-call number.
- "Most-ordered dim sum": 4 photos, names/prices pulled from `menu-data.js` (so prices always match), link to full menu.
- "Before you visit": weekend waits, tea charge, weekday morning prices, payment, large groups, wheelchair/children, allergies.
- Holiday hours table (Dec 24, Dec 25, Dec 31, Jan 1, Lunar New Year's Eve Feb 5, Lunar New Year Feb 6, Family Day Feb 15), today's holiday row highlighted.
- Private room: photo, seats 30 at three round tables, set menus from $388, $100 deposit, "Call about the private room" button.
- Getting here: address, driving and bus directions, parking, "Open in Google Maps", embedded map.

### menu.html
- Intro: priced by size, CAD before HST, weekday morning prices, takeout note + tap-to-call, photo.
- Sticky category bar with scroll-spy (active pill follows scroll, scrolls itself into view).
- Sidebar: dim sum prices by size (小點 $5.50 … 頂點 $9.80), symbol legend (招 house favourite, 素 vegetarian, 生 peanuts, 辣 spicy), QR block (QR code drawn on canvas from `shared/vendor/qrcode.js`, pointing at qr.html, URL printed, link to phone menu).
- Full menu rendered from `menu-data.js`: 7 categories, 59 items, name in page language + other-language name, description, pieces, tier seal + price, fixed prices, "included" teas, per-pot price.
- Allergy note, "prices may change".

### qr.html (phone menu)
- Compact header with brand + toggle, title + live dish count.
- Search (EN/繁/简/romanized names and descriptions, punctuation-insensitive), clear button.
- Filters: All / Favourites / Vegetarian (aria-pressed).
- Sticky category tabs with scroll-spy and click-to-scroll; tabs hide when a category has no matches; empty message.
- Each dish: + button, then a stepper (+ / count / −) with aria-labels; picked rows highlighted.
- "My list" bottom bar (count, items) opens a bottom-sheet dialog: list of picks with −/+ , tally by size (小 × n), estimated total before tax and tea, clear list, close; Escape closes; focus moves sensibly. Stored in sessionStorage `jb-picks`.
- Notes: tier price strip, tea charge, how to order, weekday morning prices, allergy note, link back to website, back to top, demo note.


## Build (second agent, took over after the first agent hit a usage limit)
Found on disk: DESIGN.md, new WebP photos, CREDITS.txt; every page/script was still the old version pointing at deleted JPGs. Rebuilt everything following DESIGN.md:
- `assets/menu-data.js`: menu (59 dishes, unchanged count) plus hours, dim sum cut-off, dinner start and the holiday table in one place. Toronto clock via `Intl.DateTimeFormat(timeZone: "America/Toronto")` (the old code used the visitor's clock: fixed). `?now=YYYY-MM-DDTHH:MM` overrides the clock for testing only. Status: before / dim sum / between (dim sum over, dinner at 5) / dinner / after / closed, holiday rows override the weekday. Weekday-morning price logic (Mon-Fri before 11, not holidays). The 特點 tier had no dishes: moved lo mai gai and crispy shrimp bean curd rolls into it; ma lai go moved to Sweets.
- `assets/i18n-dict.js`: rewritten. 繁 uses 致電訂枱, 訂枱, 餐牌, 泊車, 落單, 茶芥, 埋單, 點心紙, 枱號, 取籌; 简 uses 打电话订座, 订座, 菜单, 停车, 下单, 茶位费, 买单/结账, 点心单, 桌号, 取号.
- `assets/site.css` (one stylesheet, old qr.css deleted), `assets/fonts.js` (Chinese fonts for the current language only), `assets/site.js` (burger, phone bar, today, hours and holiday grids, tier key, favourites, map language), `assets/sheet.js` (the diner's sheet, shared by menu and phone menu), `assets/menu.js`, `assets/qr.js`.
- index.html, menu.html, qr.html rebuilt; filenames unchanged.

## Pass 1
Audit: 0 errors, 9 warnings. Hero (390x844): toggle 55px, name 269/240/240, what-it-is 328/307/307, today grid 490/486/486, main button 558/554/554 (EN/繁/简).
Click-through (click.js, phone, all 3 languages): today states checked at 8 times in all languages (dim sum / between / dinner / before / after / Christmas Day dim sum all day / Lunar New Year's Eve after 3 pm / Saturday 8:45) — all correct, chop shows only when open, today's row ticked; real clock matches Toronto. Burger, toggle, phone bar hidden until hero button scrolls away, tel/mailto, map hl=zh-TW, one main-action wording, tally 2 strokes, aria-live text, minus + focus return, filters, QR canvas, sheet dialog (guests -> tea $8.00 for 4), Escape, tally survives language switch and reload, table number kept, QR search 蝦餃 / har gow / no match message in 繁, vegetarian filter, two-tap clear, bar hides when empty. JS errors: none.
Three failures were test timing (smooth scroll still running) and a test bug (new browser context = empty storage); fixed the script, all pass.
Looked at screenshots and found:
- 繁/简 hero line broke a word onto a 1-2 character last line (晚市小/菜). Shortened: 萬錦港式點心，晚市小菜，免費泊車。 / 万锦港式早茶，晚市粤菜，免费停车。
- Hours grid: time ranges wrapped mid-range (10:00 / pm) and "✓今/日" tag split. Ranges now nowrap, tick + "Today" on its own line.
- Holiday grid on phones: dates wrapped (1月1日（星/期五）) and notes ran into the dim sum line. Rows stack on phones, date nowrap, note on its own line.
- Weekend wait table repeated "Weekends," on every row: column header now says Weekends.
- Menu page header had no side gutter on phones (padding override): fixed; photo shorter on phones.
- Phone bar on the menu page showed "Your sheet" as a second bordered button next to the call button: now a text link (secondary).
- Tap targets: footer links min-width 44, single-character tabs (茶) min-width 52, takeout phone link given a tap area, QR search label made visible (also clearer for older diners) so it is no longer a 1px target.
- Desktop: big empty gap under the hero; slip now 540px, overlaps the photo bottom by ~60px as DESIGN.md says.
- QR filter "House favourites" wrapped the filter row in EN: now "Favourites".
- Footer printed 翠籠軒 next to 翠籠軒點心茶居 in Chinese (redundant): sign hidden in zh footer.

## Pass 2
Audit: 0 errors, 3 warnings (QR search label 26-30px tall, counted as a tap target; label now has a 44px area). Hero unchanged and passing. 360px wide: no sideways scroll on any page or language (hero button bottom 609/571/600 at 360x740).
Click-through rerun after fixes: every check PASS, no JS errors, including the tally moving from the menu page to the phone menu (shared sheet, same storage).
Looked at triptychs and the 360px shots, found and fixed:
- 360px: Chinese orphans (免费停/车。, 路/口）) in the hero. Added `text-wrap: balance` to headings and the what-it-is line, `text-wrap: pretty` to paragraphs and table cells.
- The 營業中 chop split 2+1 (营业/中), which looked accidental. Now a horizontal stamp with the three characters in one line.
- Menu and phone-menu section bars highlighted the previous section while the next was on screen (IntersectionObserver band caught both). Replaced with a scroll-position check (last section whose top has passed the bar).
- The sheet band on the menu page printed 點心紙 on the 简 page; now 点心单 on 简, with "One stroke per order / 每份劃一筆 / 每份画一笔".
- Hours grid in EN wrapped "3:00 / pm": day column fixed at 40%.
- Removed decoration: the repeated 翠籠軒 sign in the menu's sheet band (the header already carries the sign). Recorded in DESIGN.md.

## Pass 3
Audit: 0 errors, 0 warnings. Hero (390x844) EN/繁/简: toggle 55/55/55, name 269/240/240, what-it-is 328/277/277, today grid 490/456/456, main button 558/524/524.
Click-through: 49/49 PASS, no JS errors (added a check that the section bar follows scrolling; the first version of that check was itself wrong, placing 中點 below the threshold).
Looked at: phone first screens in all languages, a daytime state (10:30, chop 營業中 shown, "Dim sum, until 3:00 pm"), 繁 and 简 desktop home and menu, sheet dialog.
Found and fixed:
- `text-wrap: balance` on the menu lead split Chinese words across lines (点一/下菜品, 点/心单). Balance now only on headings and the one-line hero sentence; paragraphs use `pretty`.

## Pass 4
Audit: 0 errors, 0 warnings. Took the deck screenshots (phone menu with dishes tallied, sheet open) and looked closely:
- In dish rows the description was squeezed beside the tally controls, so Chinese lines ended with 2-3 character tails (蟹籽。/ 軟腍。). Rows are now a grid: name and other-language name beside the box, description and price chips run the full row width.
- The phone menu bar printed an ASCII colon after 你的點心紙; the label is now a dictionary string with a full-width colon in 繁/简.

## Pass 5 (final, on the finished files)
Audit: 0 errors, 0 warnings. Hero at 390x844 EN/繁/简 (selectors `.lang, #hero-h, .hero-what, #today, .hero .btn-call`): 55/55/55, 269/240/240, 328/277/277, 490/456/456, 558/524/524, all under 700. 360px wide: no sideways scroll on any page.
Click-through: 49/49 PASS, no JS errors. Today logic checked at 8 Toronto times x 3 languages, including holidays.
Looked at all phone triptychs of the menu and the deck states: rows read cleanly, section bar follows the scroll.

### Done checklist
- DESIGN.md exists and the site follows it: PASS (refinements and the removed decoration recorded at the end of DESIGN.md).
- One idea carried through: PASS. The hero is a printed slip on the steamer photo; double-rule section heads; ruled hours, waits and holiday grids with a red tick for today; reversed tier boxes 小點 to 頂點 on home, menu, phone menu and sheet; tally boxes that draw 正 one stroke per tap; the sheet with 枱號/人數; footer is the sheet's small print.
- Hero on a phone shows toggle, name, what it is, hours and address, main action; no carousel, autoplay or stats row: PASS (numbers above).
- One main action, same wording everywhere: PASS. Call to book a table / 致電訂枱 / 打电话订座 in header (desktop and burger), hero, phone bar, end slip. Click test confirms one wording per language.
- All three languages complete incl. titles, meta, og, alt, aria-labels, placeholders, messages; HK 繁 and mainland 简: PASS (audit finds no missing keys and no stray English).
- Toggle instant and remembered: PASS (audit toggle test; click test).
- Chinese fonts, line height, sizes, no overflow: PASS (Noto Sans HK / SC first on 繁/简, line-height 1.75, 0.02em, body 17px, no text under 16px flagged; orphans fixed in passes 2 to 4).
- Real photos, strong contrast, no AI tells: PASS (photos credited in CREDITS.txt; one ink colour plus chop red; no pills, gradients, eyebrows, dot-joined meta, card shadows or fade-ins; one motion: the pencil stroke, off under reduced motion).
- Practical details: PASS (today in Toronto time, hours, dim sum vs dinner, holidays, address, map with src, tap-to-call, parking, payment incl. no AmEx, tea charge, weekend waits, takeout, private room, groups, access, allergies).
- No invented proof for a real client, no health fields: PASS (demo business, labelled in every footer; no reviews or ratings).
- Verify loop run at least twice with phone and desktop screenshots: PASS (5 passes).

### For a native speaker to double-check
- 繁 hero line 萬錦港式點心，晚市小菜，免費泊車。 and 晚市小菜 as the HK word for Cantonese dinner dishes.
- 繁 嬰兒高櫈 (high chair) vs the more colloquial BB櫈.
- 简 茶位费 老人 $1.50 (could also be 长者).
- 简 dish names written fresh: 蟹籽烧卖, 斋肠粉, 糯米鸡, 芝麻煎堆, 茉莉花茶 for 香片.
- Sheet band 每份劃一筆 / 每份画一笔 ("one stroke per order").
