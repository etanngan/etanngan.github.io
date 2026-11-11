# Review log: Stillwater Wellness Clinic 靜水堂 (wellness/)

Agent working only in `wellness/` (plus this log). Scripts, audit output and screenshots live in the shared scratchpad under `scratchpad/wellness/` (passN folders, scripts2/). A previous agent wrote DESIGN.md, the new photos and most of the rebuild before it was cut off; this log starts where I took over.

## Step 0. Inventory of the version at HEAD (commit c577e89), from `git show HEAD:wellness/<file>`

Every item below must still exist and work at the end, in EN, 繁 and 简 (or be replaced by something better, noted here).

### Every page
- Shared i18n engine `../shared/i18n.js` (localStorage `mp-lang`, `?lang=` override, `data-i18n`, `data-i18n-html`, `data-i18n-attr`, `data-set-lang` buttons with `aria-pressed`, `mp:langchange`). Site dictionary `assets/i18n-dict.js`.
- Dark top bar: "Direct billing to most insurance plans", today's hours (visitor's LOCAL clock, holiday-aware via a hard-coded list), phone link.
- Header: brand "Stillwater 靜水堂", nav (Services and fees, Our team, Insurance, Visit us), EN/繁/简 toggle, "Request an appointment" button (shortened to "Book" on phones), burger (aria-expanded, label swaps open/close, closes on link click, Escape and resize).
- Skip link.
- Footer: about line ("... in Markham since 2015"), emergencies line, hours summary, address, tap-to-call, `.example` email, page links, © line, demo note linking to `../index.html`.
- Map iframe language follows the page language (hl=en / zh-TW / zh-CN).

### index.html
- Hero: photo of the waiting area, H1 "Physiotherapy, massage therapy and acupuncture in Markham", line about registered practitioners / direct billing / weekday evenings, address + "near Woodbine Ave and 16th Ave, ground floor", "Request an appointment" + phone button.
- Services and fees: 4 services (massage, physio, acupuncture, osteopathic manual therapy) with photo, one-line description, "from" price, link to services.html#id; "See all session lengths and prices".
- Insurance and direct billing: direct billing, receipt with registration number, car accident / WSIB, doctor's note; "Your first visit" 4 steps; a Request button.
- Our practitioners: male/female preference note; 5 practitioners with credential, focus, languages.
- Good to know: parking, accessibility, cancelling (24 h, half fee), payment and HST, languages, under 16, gift cards.
- Visit us: address, by car, by bus, hours table with today's row marked, holiday hours table (Dec 24, Dec 25-26, Dec 31, Jan 1, Family Day, Good Friday), "Open in Google Maps", map embed.

### services.html
- H1, HST note, jump links to the 4 services.
- One block per service: plain description, table of session lengths and prices, "Who you will see", "Request this service" -> `book.html?service=<id>`.
- FAQ (referral, wait time, bringing someone, children); direct billing paragraph; page-end CTA + phone.

### book.html (appointment request)
- Intro (confirm within one business day, not booked until confirmed), "everything needed unless optional", error summary.
- About you: name, phone, email (phone OR email required), language for the call (English / Cantonese / Mandarin).
- Your visit: service select (preselected from `?service=`), session length (depends on service, shows price), practitioner (filtered by service, "no preference").
- "Have you been to Stillwater before?" (first time / been before).
- When: two slots, each with a date button opening a calendar dialog (Sundays + statutory holidays struck through and disabled, 12-week window, month arrows, arrow keys, Escape) and morning / afternoon / evening chips.
- How should we confirm: call / text / email. Consent checkbox. Submit "Send request". Demo note.
- Success panel: heading with the name, summary, "we did not ask about your health", demo note, "Make another request", "Back to home".
- Aside: "We don't ask about your health online", emergency note, "Prefer to call?" + phone + languages, hours + address.
- Language switch mid-form keeps every value and re-renders selects, calendar (month/weekday names), errors and summary.

### State I found on disk (the previous agent's rebuild, not yet verified)
- DESIGN.md written (the appointment card idea, two inks), photos converted to WebP (room, room-wide, massage, acupuncture, physio, osteo), all 7 site files rewritten.
- Checks I ran before pass 1: all three HTML files have balanced tags; all three JS files parse (`node --check`); 258 i18n keys used, all present in EN/繁/简 except `bk.clear2` (the "clear second choice" button in book.js had no dictionary entry, so it would have shown the raw key).
- Old JPGs (acupuncture, back, interior, massage, physio-leg, physio-weights, shoulder) are no longer referenced. CREDITS.txt still lists the old JPGs and not the new WebPs.
- Photo sources traced by comparing pixels: room = Unsplash photo-1745327883290-1e9c6447b938; massage = Unsplash photo-1519823551278-64ac92734fb1; acupuncture = Pexels 4353249; physio = Unsplash photo-1645005513713-9e2b92a687d3 (same photo as the old physio-weights.jpg, larger); osteo = Unsplash photo-1645005512968-0c1fe99f0093 (same as old shoulder.jpg).

## Passes

### Pass 1
Audit (`pass1/report.md`): 0 errors, 13 warnings. Hero check passed in all three languages (button bottom 571px EN, 532px 繁/简).
Warnings: field labels under 44px tall (they are labels above 52px fields, not tap targets: left as is); service-name links on home 26-29px tall; footer "Home"/"主頁" and jump link "針灸" under 44px wide; Chinese line-height 1.40 on the hero's what-it-is line.
Looked at every triptych, the desktop first screens and the services desktop overview. Click-through script `scripts2/click.js` (EN/繁/简): burger, Escape, anchors, map src + language, tel/mailto, services -> book preselect, empty submit (errors in the page language, focus to first error, aria-invalid), practitioner filter, calendar (44x44 cells, Sundays/holidays disabled, arrows, PageDown, Enter, Escape returns focus), language switch mid-form keeps every value and re-renders the date and calendar month, valid submit -> completed card, card re-renders on language switch, "Make another request" resets, language remembered, no JS errors, 360px no sideways scroll. All passed except two header overflows.

Found and fixed:
- HARD RULE: the form still asked "language for our call", "how should we confirm" (call/text/email) and had a consent checkbox. Removed all three; the form now collects service (+ length, optional practitioner), two preferred days/times, name, phone, optional email. Replaced with a line "The front desk speaks English, Cantonese and Mandarin. Tell us which you prefer when we call" and "We use your name and phone number only to arrange this appointment". book.js validation, summary and completed card updated; 17 dead dictionary keys removed.
- `bk.clear2` missing from the dictionary (raw key would have shown on "Clear second choice"). Added.
- Desktop 1024-1239px EN: header wider than the window (sideways scroll). Brand Chinese name wrapped one character per line at 1440. Brand is now nowrap; between 1000 and 1239px the nav drops "Practitioners" and "Direct billing" (both still in the page and the footer path); the header phone number only shows from 1400px.
- Calendar on a 390px phone: the 7x44px grid poked out of the right edge of its popover. Popover now extends 14px into the card padding each side, 1px gaps.
- Nested fieldsets (time of day) showed browser-default grey borders: added `.field.plain` reset.
- Form card name was plain black text: now spruce bold like the hero card.
- Completed card: weekday row showed "星期 星期 一 …" (label + printed prefix) and wrapped, which stretched the ring into a tall oval; strip on the completed card no longer prints the prefix. Heading "多謝你，Test Patient。我/們已收到…" broke inside 我們: heading is now just "多謝你，{name}！" and "已收到你的預約申請" moved into the line below.
- Hours tables: times wrapped ("9:00 am – / 8:00 pm", "上午9:00 – 下/午2:00"). Time column is nowrap now. Added space under the hours card on phone (address heading touched it).
- Ring round the EN weekday touched "Tue"/"Thu": more gap and a slightly larger ring.
- 繁 printed note ended on an orphan "通知。": shortened to "更改或取消預約，請提前 24 小時通知。" and `text-wrap: balance` on all card notes.
- "另/加 HST" split across lines: wrapped in a nowrap span (data-i18n-html).
- "With:" lines on the services page used half-width ":" and "()" in Chinese and repeated "Speaks…": rewritten as one line per service with full-width ：（） in 繁/简.
- Wording: 繁 direct billing is now 直接向保險公司收費 (nav: 保險直接收費), per the brief; massage is 按摩治療 / 按摩治疗 (RMT stays in each therapist's credential).
- Tap targets: home service-name links, jump links and footer links now at least 44x44.
- Footer "since 2015" line from the original restored (years open is trust).
- Deleted the 7 unused JPGs; rewrote CREDITS.txt with each WebP's source URL and licence.
- Checked Atkinson Hyperlegible Next for an unslashed zero (zero, ss01-05, salt, cv01-10): none in the Google Fonts build. Kept the slashed zero on purpose: the font was chosen so 0/O and 1/l/I are unmistakable on times, prices and the phone number (noted in DESIGN.md).

### Pass 2
Audit (`pass2/report.md`): 3 errors, 5 warnings. Errors: at 1440px EN the header phone number (shown from 1400px) pushed the main button 11px past the edge on all three pages. Hero check passed (EN button 571px, 繁 565px, 简 537px).
Warnings: form labels (not tap targets, reason above); 針灸/针灸 service link 41px wide.
Looked at: index/book/services triptychs again (changed screens), desktop 繁 first screen, phone EN hero close-up, the form, calendar and completed card in EN and 简.
Click-through (`pass2/click/click.txt`): 99 checks, all PASS, including 1024/1180/1280 desktop headers and 360px on every page in every language.

Found and fixed:
- Header phone number now only from 1520px (no overflow at 1440).
- 針灸 link min-width 44px.
- 繁 hero weekday strip: "星期" wrapped onto two lines once the gaps grew; EN "Sat" touched the card edge and the ring still touched the "W" of Wed. The strip is now space-between with nowrap items, the row label column is 4em, the ring sits 7px outside the word.
- Completed card weekday strip was squeezed into the value column (Fri touched the ring, ring past the card edge in EN): that row now puts the strip on its own line under "Day".
- 繁 language note used spoken Cantonese "話我們知": now written HK Chinese "告訴我們".
- EN printed note no longer balanced into two half lines (balance kept for Chinese only).
- DESIGN.md updated: form fields, HK billing wording, 按摩治療, slashed zero, header breakpoints, the removed decoration, the restored "since 2015".

### Pass 3
Audit (`pass3/report.md`): 0 errors, 3 warnings (form labels above 52px fields reported as tap targets under 44px tall; they are not the tap target, the field is, so left as is). Hero check at 390x844: toggle 53px, name 285/264/264px, what-it-is 342/302/302px, address 396/358/358px, today's hours 495/461/461px, main button 571/537/537px (EN/繁/简), all under 700.
Looked at: every index triptych (hero, weekday strip after the fix), services and book triptychs, book desktop first screen, the completed card in EN and 繁, the phone menu.
Click-through (`pass3/click/click.txt`): 99/99 PASS (same script as pass 2: menu, anchors, map, tel/mailto, preselect, errors, calendar keyboard, language switch keeps values, confirmation, reset, remembered language, 1024-1280 desktop headers, 360px everywhere, no JS errors).
Nothing new to fix beyond what pass 2 changed.

Done checklist (SKILL.md):
- PASS DESIGN.md exists and the site follows it (two inks, card in hero / form / completed card / hours back, double rule dividers, price list with leaders, 24-hour note on every card and in the footer). DESIGN.md updated with the judgment calls made while finishing.
- PASS One idea carried through: appointment card (hero card with today circled, form as the card, completed card with your day circled, hours as the back of the card, front-desk price list).
- PASS Hero on phone shows toggle, name, what it is, address + today's hours, main action without scrolling; no carousel, autoplay video or stats row.
- PASS One main action, same wording everywhere: Request an appointment / 申請預約 / 申请预约 (header, menu panel, hero, every service, page ends, footer, form submit). Calling is a text link.
- PASS All three languages complete incl. titles, meta, og, alt, aria-labels, placeholders, errors, confirmation; 252 keys, none missing; HK wording (物理治療, 按摩治療, 針灸, 預約, 泊車, 直接向保險公司收費) and mainland wording (物理治疗, 按摩治疗, 针灸, 预约, 停车, 保险直接结算).
- PASS Toggle instant (no reload) and remembered (audit + click-through), 44px tall, at the top.
- PASS Chinese fonts first (Noto Sans HK / SC), body 17-18px, Chinese line-height 1.75, 0.02em; no overflow at 360/390/1024-1440.
- PASS Real photos (WebP, srcset, width/height, lazy below the fold, fetchpriority on hero), strong contrast (palette checked in DESIGN.md), no AI tells (no eyebrow labels, no dot-joined meta, no styled headline word, no arrows on buttons, no cards except the appointment card, one motion moment off under reduced motion).
- PASS Practical details: hours + holiday hours (Toronto time, holiday-aware), address, map with src, tap-to-call, parking, step-free access, payment, direct billing, languages, cancellation policy, first-visit guide, practitioners and credentials.
- PASS No invented proof (practitioners marked as made up for the demo; no reviews or ratings). No health fields in the form; the "we don't ask about your health online" note sits directly above it.
- PASS Verify loop run three times with phone and desktop screenshots.
