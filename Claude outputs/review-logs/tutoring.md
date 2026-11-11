# Review log: Maple Bridge Learning Centre 楓橋教育中心 / 枫桥教育中心 (tutoring/)

Agent working only in `tutoring/` (plus this log). Scripts and screenshots live in the session scratchpad under
`scratchpad/tutoring/` (pass1, pass2, pass3 audit folders, click-through scripts and their screenshots).

Taking over from an agent that was cut off. On disk when I started: `DESIGN.md` (complete), new WebP photos +
`og-image.jpg`, and partial rewrites of `assets/i18n-dict.js`, `assets/schedule-data.js`, `assets/site.css`.
All three partial files were checked: both JS files pass `node --check` and end cleanly; the CSS is complete
(504 lines, closes every block, ends with the reduced-motion block). The three pages and site.js / schedule.js /
inquiry.js were still the old versions, and CREDITS.txt had not been updated for the new photos.

## Step 0. Inventory of the version I started from (commit c577e89, via `git show HEAD:tutoring/...`)

Every item below must still work at the end in EN, 繁 and 简 (or be replaced on purpose, noted here).

### Every page
- Shared i18n engine `../shared/i18n.js` (localStorage `mp-lang`, `?lang=` override, `data-i18n`, `data-i18n-html`,
  `data-i18n-attr`, `data-set-lang` buttons with `aria-pressed`, `mp:langchange` event). Site dictionary in
  `assets/i18n-dict.js`.
- Head: translated title, meta description, og:title, og:description, og:image (girl-class.jpg), theme-color,
  inline SVG favicon (yellow square with a bridge arch). Fonts: Lexend + Noto Sans TC/SC.
- Skip link.
- Header: brand mark + name, nav (Classes and fees `#fees`, Timetable, Teachers `#teachers`, For parents `#parents`,
  Contact `#visit`), EN/繁/简 toggle, header CTA "Free assessment" -> `inquiry.html?topic=assessment`, burger
  (aria-expanded, label swaps open/close, closes on link click, Escape and resize).
- Footer: name, "since 2012" line, hours, address, tap-to-call, `.example` email, page links (Home, Timetable,
  Contact -> inquiry.html), © line, demo note linking to `../index.html`.
- site.js: burger; today's row highlighted in the hours table (visitor's LOCAL clock, not Toronto time);
  map iframe language follows page language (hl=en / zh-TW / zh-CN).

### index.html
- Hero: H1 "After-school tutoring for Grades 1 to 12 in Markham", intro (subjects, six or fewer, most teachers
  Ontario certified), facts with icons (weekday + Saturday hours, address, free parking, tap-to-call), buttons
  "Book a free assessment" (yellow) + "See the timetable" (outlined, equal weight), photo girl-class.jpg.
- Facts band: hours table (today's row), "front desk answers from 1:00 pm on weekdays"; address, second floor,
  elevator, free parking, 10-minute pickup spots, directions link; phone, email, "we answer in English, Cantonese
  and Mandarin".
- Classes and fees `#fees`: Winter term Jan 4 to Mar 27 2027, 11 weeks, one class a week, books included; table of
  6 programs (Gr 1-6 math/English 60 min $440; Gr 7-8 90 min $550; Gr 9-12 90 min $660; OSSLT 8 weeks $400;
  Saturday Mandarin $330; Homework Club $420/month 5 days, $280 3 days); $40 family registration; 10% off second
  child; link to timetable.
- How to start: 3 steps (call/inquire, free 40-minute assessment, $30 trial class) + CTA; photos reading.jpg,
  worksheet.jpg.
- Teachers `#teachers`: same teacher all term; Ms. Lau, Mr. Okafor, Ms. Zhao, Ms. Wong, Mr. Ip with role, background,
  languages.
- For parents `#parents`: photo girl-pink.jpg; drop-off and pickup (10-minute spots, not the fire lane, Gr 1-3
  signed out by an adult); Homework Club school pickup (3 schools); missed classes (tell us by noon, join another
  section, no refund); sick days (video call); payment (e-Transfer, debit, Visa, Mastercard, cheque); nut-free and
  allergies; progress updates.
- Term dates `#dates`: York Region calendar for PA days; winter break, first day, Family Day, March Break day camp
  9-4, Good Friday, last day, PA-day camp 8:30-5:30 $75 (book by the Friday before).
- Find us `#visit`: address, driving directions, bus, parking, "Open in Google Maps" (new tab), phone button,
  embedded map with a src.

### schedule.html
- Page head: "Winter 2027 timetable", dates, no classes in March Break / Family Day, "seats last updated
  Nov 9, 2026, call to confirm".
- Filters: grade band chips (Primary/Junior/Intermediate/Senior), subject chips with colour dots, day chips;
  live count (aria-live); Clear filters; Timetable/List view toggle on desktop (remembered in localStorage
  `mb-view`). URL params `band`, `subject`, `day` read and written back (replaceState).
- Week grid (desktop): Mon-Fri columns + Saturday column with its own times; "No evening classes on Fridays".
  Cards: name, time, grade, teacher, room, note, status pill (Open / Few left / Waitlist), "Ask" link
  -> `inquiry.html?class=<id>`.
- List view (phones): day groups with counts; same card data; "Ask about this class" button.
- Empty state with Clear filters + link to the form. Seat legend. "Not sure which class fits?" box with
  CTA + "See fees". noscript fallback. Re-renders on language change.

### inquiry.html
- H1 "Book a free assessment or ask about a class", reply-within-one-business-day lead.
- Form: topic select (assessment / class / other) preset from `?topic=` or `?class=`; name (required); phone and
  email (at least one; phone 10 digits, email format); reply language radio (defaults to page language); grade
  select 1-12 (required); subjects checkboxes, class select grouped by day, days checkboxes (all prefilled from
  `?class=`, "Filled in from the timetable" note); best-way-to-reach radio (cross-checked with phone/email);
  message; consent checkbox (required); "Send inquiry"; demo note.
- Errors: summary with count (role=alert), per-field messages linked by aria-describedby, aria-invalid, focus
  first wrong field, live re-validation after the first submit, messages re-translated on language switch.
- Confirmation slip: thanks + name, demo note, every answer listed, what happens next in the chosen language and
  method, "Fill in another" (resets) + "Back to the timetable"; re-rendered on language switch.
- Side: what happens next (3 steps), "Prefer to call?" box (phone, office hours, languages, address),
  "What we don't ask for".

## Build (this session)

Rebuilt index.html, schedule.html, inquiry.html, site.js, schedule.js, inquiry.js on the DESIGN.md idea (marked
exercise-book page). schedule.html and inquiry.html share the header/footer markup copied from index.html by a
small build script in the scratchpad (no build step in the site itself). Notable decisions:
- Main action "Book a free trial class / 預約免費試堂 / 预约免费试听课" in header, phone menu, hero, trial section,
  page end, phone action bar, footer, timetable help box, every open timetable row, and the form's submit button
  when the topic is the trial (other topics say "Send my question / 提交查詢 / 提交咨询"). Full classes say
  "Ask about the waitlist" and open the form with topic=wait.
- Hero tick changed from "From $40 a class" to "From $30 a class": Saturday Mandarin is $30 a class, so $40 was untrue.
- Added a phone action bar (yellow action + "Call" text link) that appears only after the hero button scrolls away
  and hides whenever another yellow button or the footer is on screen, so two yellow buttons never show together.
  Added to DESIGN.md.
- Pickup text now says how children are dismissed (Gr 1-3 signed out inside, Gr 4+ may walk to the car with a
  written OK). Added an Ontario-curriculum line under the fee sheet (course codes match the report card), March
  Break camp price, "closed on statutory holidays" under the hours.
- `<html lang>` becomes `zh-Hant-HK` on 繁 (tiny inline script after shared/i18n.js; shared file untouched).
- Today's line is computed in America/Toronto time: open now / opens today / closed now + next opening, Sunday,
  winter break, Family Day, Good Friday, March Break camp hours.
- Form keeps only: topic, parent name, phone or email, reply language, grade, subjects, class, days, message.
  The consent box and "best way to reach me" radio from the old form are gone (DESIGN.md decision). A class from
  the timetable fills in class, grade (when the class is one grade), subject and day.
- Old photos girl-class.jpg, girl-pink.jpg, reading.jpg, worksheet.jpg deleted (two of them live on as the
  re-cropped WebP hero-girl and homework). CREDITS.txt rewritten with source URL + licence for every file.
- 简 grade names changed from 五年级 to 5年级 (mainland usage, as DESIGN.md says).

## Pass 1

Audit (`pass1/`): 0 errors, 12 warnings. Hero bottoms at 390x844: EN toggle 53, name 301, what-it-is 365,
today 229, button 587; 繁/简 button 555.
Looked at every triptych and the desktop first screens/full pages. Found and fixed:
- EN phone header: brand name broke into 3 lines (mark + name + 138px toggle + burger overflowed 358px). Mark 30px,
  tighter gaps, name 2 lines.
- 繁/简 phone: 16px sideways scroll from the footer label (email in a fixed 6.2em grid). Label rows now stack on
  phones; email/links wrap; no more "exampl/e" break.
- EN hero ticks wrapped to 5 lines; reworded "6 students or fewer per class" and ticks 16px on narrow phones.
- 简 hero line ended with a lone "科学" on line 2; split into two no-wrap phrases so it breaks at the colon.
- Desktop hero name had a 72px line gap; now 1.5 rules per line. "Grades 1 to 12" kept together.
- Homework Club fee cell squeezed its name column to one word per line on phones; fee column capped at 8.6em.
- Desktop timetable: filters took 3 tall rows; labels now sit left of the chips. Row action highlighter broke
  badly when wrapping in narrow week cells; now wraps with box-decoration-break.
- Phone timetable: "to 6:30 pm" wrapped in the margin column; margin column widened to 86px.
- Inquiry desktop: error count ran across the red margin line; moved into the writing column.
- Phone action bar showed together with the trial section's yellow button; now hides when any main yellow
  button is on screen.
- Chinese font stacks had `sans-serif` before Libre Franklin; removed so Latin in Chinese pages is consistent.
- Footer tel/email and the 2-character 主頁 link were under 44px; fixed.
- Remaining WARN kept on purpose: form labels (`label[for]`) are 27-31px tall; they sit on top of 50px fields,
  which are the real tap targets.
Click-through (`pass1/click`, click.js): 135 checks, 0 FAIL, in EN/繁/简: burger open/close/anchor, every section
id, tel/mailto, map src + language, one main-action wording, action bar show/hide, today line, language
remembered across pages, grade/subject/day filters + count + URL, language switch keeps filters, empty state +
clear, old ?band=J link, full class -> waitlist link, class carried to form (class, grade, subject, day, note),
empty submit -> summary + red-pen errors in page language + focus + aria, errors re-translated on switch, bad
phone, summary clears, valid submit -> confirmation listing answers, confirmation re-translated, reset,
?topic=assessment -> trial, desktop week grid + list view remembered, Tab -> skip link.
Removed decoration: the punched holes on the page-end sheet (holes stay only on the hero sheet).

## Pass 2

Audit (`pass2/`): 0 errors, 9 warnings. Remaining warnings were the footer tel/email links at 40px (my own phone
override) and the form labels. Looked again at every triptych and the desktop full pages (EN timetable week grid,
繁 home hero, 简 form).
Found and fixed:
- Footer tel/email links set back to 44px.
- Form labels now 44px tall (text sits at the bottom, just above the field) so even the label tap target passes.
- Homework Club fee row still broke into one word per line on phones ("Homework / Club, weekdays / 3:30 to");
  moved the hours into the "each class" column and split the fee note into two short lines.
- 繁 form's first label "你想" read like half a sentence; now 查詢事項 / 咨询事项.
- DESIGN.md updated with every refinement (section "Refinements made while building") and the removed decoration.
Checked and fine: desktop week grid (36 classes, Saturday column with its own times, "No evening classes on
Fridays", full classes in red pen with the waitlist link), Chinese hero on desktop (name on one line, ticks drawn),
简 form on desktop (section numbers circled in the margin column), error/confirmation states from pass 1.

## Pass 3

Audit (`pass3/`, full): 0 errors, 0 warnings. Hero bottoms at 390x844 (limit 700): toggle 53, name 301 (EN) /
269 (繁简), what-it-is 365 / 333, today 229, main button 587 (EN) / 555 (繁, 简). 360x780: no sideways scroll on any
page in EN or 繁; EN hero button bottom 651.
Click-through (`pass3/click`): 135 checks, 0 FAIL (same script as pass 1).
Today line tested with a faked clock in a Hong Kong-timezone browser (proves Toronto time is used): weekday open,
after close, Friday night -> Saturday hours, Sunday, Family Day, winter break -> "Open Monday, January 4",
March Break camp, Saturday morning; all three languages read correctly. Fixed: a missing comma after the long
English date and a stray space after （周一） in 简.
Final audit after that change (`final/`): 0 errors, 0 warnings.

### Done checklist (skill)
- DESIGN.md exists and the site follows it: PASS (refinements recorded in DESIGN.md).
- One idea carried through: PASS. Ruled loose-leaf hero sheet with punched holes and red ticks; ruled dividers on
  every section; fee sheet with red margin + red-pen note; timetable as ruled lines with times in the margin and
  seats circled in red pen, "Full" in red pen; grade chip circled in red; form on a ruled sheet with section
  numbers circled in the margin and errors in red pen; confirmation with a red tick; exercise-book-cover footer label.
- Hero on phone shows toggle, name, what it is, hours (Toronto time) + address, main action without scrolling;
  no carousel, autoplay video or stats row: PASS (numbers above).
- One main action, same wording everywhere: PASS (click test checks every yellow button per language; waitlist
  rows and non-trial form topics are honest variants, recorded in DESIGN.md).
- All three languages complete incl. titles, meta, og, alt text, aria-labels, placeholders, form messages; HK
  wording 繁 (補習社, 功課班, 試堂, 接放學, 泊車), mainland 简 (补习班, 作业辅导班, 试听课, 接送, 停车, 24-hour
  times): PASS (audit: no missing keys, no stray English).
- Toggle instant and remembered: PASS (audit toggle test + click test across pages).
- Chinese fonts first, line-height 1.8, 0.02em, body >= 16px, no overflow: PASS (audit fonts; triptychs checked).
- Real photos, strong contrast, no AI tells: PASS (4 real photos, credits; ink on white 15.9:1, pencil 8.0:1;
  no eyebrow labels, no dot-joined meta, no cards grid, no gradients, numbered markers only on the real 1-2-3
  trial sequence and form sections; one motion moment = ticks drawn once, off under reduced motion).
- Practical details: hours + holiday closures, address, map with src, tap-to-call, parking + pickup + dismissal,
  payment, missed-class policy, term dates, PA-day and March Break camps, fees, class size, curriculum, teachers:
  PASS.
- No invented proof for a real client; no sensitive fields: PASS (demo business, labelled in footer; no reviews
  or ratings; form asks no child name, school, birth date or report card).
- Verify loop run at least twice with phone and desktop screenshots: PASS (three passes + final audit).
