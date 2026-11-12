# DESIGN.md: Stillwater Wellness Clinic 靜水堂

Demo site for a made-up clinic. The address (Unit 4, 410 Tamsworth Drive), the 555 phone number, the .example email and every practitioner name and credential are invented, and the site says so in the footer and on the team list.

## 1. Business and goal
- What it is (owner's words): "We're a physio, massage and acupuncture clinic on Tamsworth Drive, near Woodbine and 16th. Ground floor, free parking, we bill your insurance directly, and we're open till 8 on weekdays. The front desk speaks Cantonese, Mandarin and English." Osteopathic manual therapy is the fourth, smaller service.
- Main action (one only, same wording on the header, hero, every service row, page ends and the form's submit button):
  - EN: Request an appointment
  - 繁: 申請預約
  - 简: 申请预约
  Calling is the quieter second option, always written as "Or call (905) 555-0117" in body text size, never as a second filled button.
- What patients check before visiting: is it open today and until when; where it is and where to park; whether it is step-free; what it costs and whether we bill their plan directly; who they will see and what language that person speaks; how cancelling works.
- Who visits: adults 30 to 70 with a sore back, neck, knee or shoulder, many sent by a family doctor or using a work benefits plan. Cantonese-speaking families from Hong Kong, Mandarin speakers from the mainland, and English speakers. Mostly on phones, often an older parent looking things up for themselves or a grown child booking for a parent.

## 2. The one idea
- The object: the clinic appointment card. The small white card the front desk fills in by hand with a blue ballpoint and slides across the counter. Clinic name, address and phone printed at the top in one ink colour; the weekdays printed in a row (Mon to Sat, no Sunday because we are closed) so the desk can circle one; ruled lines for date, time and "with"; and the printed note at the bottom: "Please give 24 hours' notice to change or cancel."
- Two inks carry the whole site. Spruce ink = printed by the clinic (name, headings, labels, rules). Ballpoint blue = written by a person or done by you (today's hours written on the card, the circle round today's weekday, every link and button, what you type into the booking form, the completed card).
- Where it shows up:
  - Hero: a real photo of a made-up treatment table with a linen sheet, and the appointment card laid over it. The card carries the name, what we do, the address and phone, the weekday row with today circled, today's hours written on the ruled line (America/Toronto time, holiday-aware), the main button, the quiet "Or call", and the printed 24-hour note.
  - Services: the printed price list from the front desk. Each service is a ruled list of lengths with dotted leaders to the price, and "With" naming who you see, the way a price sheet by the till reads.
  - Booking form: you are filling in the card. Same printed header, same ruled lines, your typed answers appear in ballpoint blue. The confirmation is the completed card in the current language, with your day circled.
  - Hours and location: the back of the card (opening hours, holiday hours, address, map).
  - Dividers: the card's printed double rule (a 2px line over a 1px line) at the top of each section.
  - Footer: the card's printed bottom line, the 24-hour note, set above the address and hours.
- The room it lives in: a daylit treatment room. Daylight comes through window blinds, so the light always arrives in soft bands. That gives the site its second, quieter material, used in four places only:
  - Intro: the blinds open on the page (once per visit).
  - Hero: the room's light comes up as the page opens (no stripes here: across the photo and card they read as bars, not light).
  - "Open until 8 pm on weekdays": one treatment room from 9 am to 8 pm, pinned while you scroll. The light moves, warms, fades, and the lamp comes on. Each part of the day says something true (opening time, lunch-hour massage, who works evenings, Saturday and Sunday hours).
  - Service photos open like blinds as they come into view.
- The hands-on piece is the card itself: at the end of the home page you circle a service, a day and a time on a blank appointment card, the pen writes who you would see and the fee, and the main button carries those choices into the request form.
- What stays quiet: no icons apart from the menu bars and the calendar arrows, no cards for anything except the appointment card itself, no tinted section boxes, one shadow on the whole site (the appointment card lying on the photo/linen), photos with square corners.

## 3. Colour
| Name | Hex | Role |
|------|-----|------|
| Linen | #EDECE7 | Page background, the colour of an unbleached treatment-room sheet in daylight |
| Card stock | #FFFFFF | The appointment card, form fields, the price list on phone |
| Body ink | #1D2828 | Body text (12.8:1 on Linen, 15.2:1 on white) |
| Spruce ink | #1F4A4C | The clinic's printed colour: headings, labels, rules, footer background (8.3:1 on Linen, 9.8:1 on white) |
| Ballpoint blue | #2A41A0 | Written by hand / done by you: main button, links, selected states, focus ring, typed values, the day circle (7.5:1 on Linen, 8.9:1 on white, white on it 8.9:1) |
| Muted ink | #4A5755 | Secondary lines and notes (6.4:1 on Linen, 7.5:1 on white) |
| Ruled line | #B8C4C1 | Decorative ruled lines on the card only. Field borders use #5E6E6B (5.4:1) so they pass 3:1 for controls |
| Error red | #B3261E | Error text and error borders (6.5:1 on white, 5.5:1 on Linen) |

Why not the previous lake blue: blue-on-white with blue buttons everywhere is the default "healthcare SaaS" look, and it gave every element the same voice. Splitting print from pen makes the colour mean something. Not cream + serif + terracotta (Linen is a cool grey-beige, the type is sans, the accent is a ballpoint blue), not black + neon.

## 4. Type
- English display and body: Atkinson Hyperlegible Next (Google Fonts, variable, 400 and 700 used). Designed by the Braille Institute for low-vision readers: 1/l/I, 0/O and 6/8/9 are unmistakable, which matters on a card full of times, dates, prices and a phone number, read by people in their 60s.
- Traditional Chinese: Noto Sans HK 400/700 (Hong Kong glyph forms, matching the HK wording).
- Simplified Chinese: Noto Sans SC 400/700.
- Stack order:
  - EN: Atkinson Hyperlegible Next, Noto Sans HK, system sans.
  - 繁 (html[lang^="zh-Hant"]): Noto Sans HK, Atkinson Hyperlegible Next, PingFang HK, Microsoft JhengHei, sans-serif.
  - 简 (html[lang^="zh-Hans"]): Noto Sans SC, Atkinson Hyperlegible Next, PingFang SC, Microsoft YaHei, sans-serif.
  - The site JS refines `<html lang>` from zh-Hant to zh-Hant-HK so screen readers use a Cantonese voice.
- Sizes: body 17px (phone 17px), smallest text anywhere 16px, H3 20px, H2 26px phone / 32px desktop, hero H1 30px phone / 42px desktop.
- Chinese: line-height 1.75 for body, 1.4 for headings, letter-spacing 0.02em. Headings use `text-wrap: balance` and short wording so no heading ends with a single orphan character.

## 5. Layout
- First phone screen (390 x 844, everything above 700px):
  ```
  [Stillwater / 靜水堂]   [EN|繁|简] [Menu]      header, one row, 60px
  [ treatment room photo, short strip  ]        ~150px
     ┌ appointment card ───────────────┐
     │ Stillwater Wellness Clinic  H1  │
     │ 靜水堂                          │
     │ Physiotherapy, massage therapy  │  what it is
     │ and acupuncture in Markham      │
     │ Unit 4, 410 Tamsworth Dr …      │  address
     │ ═══════════════════════════════ │
     │ Today  Mon Tue (Wed) Thu Fri Sat│  today circled in pen
     │ Open   9:00 am – 8:00 pm   (pen)│  ruled line
     │ [ Request an appointment ]      │  main action
     │ Or call (905) 555-0117          │  quiet
     │ Please give 24 hours' notice…   │  printed note
     └─────────────────────────────────┘
  ```
- Desktop: the photo fills the right 58% of the hero; the card sits on the left, overlapping the photo edge as if laid on the table.
- Home section order: hero card; services and fees (price list); a day in the room (pinned, 9 am to 8 pm); who you'll see (practitioners, credentials, languages, evenings); direct billing + your first visit on a full-width spruce band (the one bold colour block); hours and location (card back: hours, holiday hours, address, parking, step-free access, map); good to know (cancelling, payment, languages, under 16, gift cards, emergencies); page end: the fill-in card with the main action.
- Services page: page head with jump links; one block per service (photo, plain description, price list, who you see, main button that preselects the service); questions; direct billing; page end.
- Booking page: page head; the "we don't ask about your health online" note directly above the form; the form as the appointment card; aside (desktop) or after the form (phone) with call, hours, emergency note.
- Alignment: left-aligned text everywhere; container 1160px on desktop with 32px gutters, 16px gutters on phone.

## 6. Components
- Main action button: ballpoint blue fill, white 17px bold text, 52px tall, 6px radius, no icon, no arrow. Hover: darker blue #1E3080. Focus: 3px ballpoint-blue outline with 3px offset. Active: moves down 1px. Disabled: not used (the form validates on submit instead).
- Secondary link ("Or call", "See all lengths and prices"): ballpoint-blue underlined text, 44px tall tap area. Hover: underline thickens. Focus: same outline as the button.
- Language toggle: three 44 x 44 buttons in one spruce-outlined group at the top right on every page. Current language filled ballpoint blue with white text, aria-pressed. Hover: pale blue fill. Focus: outline. Switches instantly (shared engine) and is remembered in localStorage "mp-lang".
- Service row (price list): service name in spruce H3, one or two plain sentences, then a list of lengths with dotted leaders to the price in tabular figures, then "With: name, credential". Rows are separated by ruled lines, not boxed.
- Form fields: white field, 1.5px #5E6E6B border, 52px tall, label above in spruce bold; typed text in ballpoint blue. Focus: border and 3px outline in ballpoint blue. Error: red border, red message under the field linked with aria-describedby, aria-invalid on the control, and a summary at the top (role="alert") listing what to fix; focus moves to the first field with a problem.
- Calendar: a popover grid, 44 x 44 day buttons, Sundays and holidays struck through and disabled, month arrows, arrow keys / Home / End / Page Up / Page Down, Escape closes and returns focus. Month and weekday names follow the language.
- Appointment card: white, 4px radius, the one soft shadow on the site, printed header with a double rule, ruled lines with spruce labels and ballpoint values.

## 7. Images
- Source: Unsplash and Pexels (free licences), listed with URLs in assets/img/CREDITS.txt. Every photo was looked at: no watermarks, no clinic logos, nothing that reads as a luxury spa or a hospital.
- Style: bright, plain rooms in daylight; white linen, pale wood floors; hands at work rather than posed smiling faces. No candles, stones, bamboo, orchids or water.
- Files: WebP via sharp, 2 to 3 widths each with srcset, width/height on every img, lazy below the first screen, fetchpriority="high" on the hero photo. The phone hero uses a wide crop of the same room through `<picture>`.
- Alt text written in all 3 languages: yes.

## 8. Motion
- Character: slow, calm, warm. Long sine and power2 eases, scroll scrubbing with a 1 to 1.5 s lag, cross-fades instead of slides. Nothing bounces, overshoots, stamps or snaps.
- Intro (CSS only, so it never waits for a CDN): 12 linen blind slats over the page turn open top to bottom, then fade. About 1.5 s, once per visit (sessionStorage), skipped by any tap, scroll or key, never with reduced motion.
- Hero, once, after the intro when it plays (CSS only): the room photo starts dim and its light comes up (1.8 s); the appointment card is set down on the counter, from 22px higher and a little more tilted with a lifted shadow, settling with an ease-out and no overshoot (1.2 s); then the pen circles today's weekday (0.9 s) and underlines today's hours (0.7 s). Nothing loops. All text is readable from the first frame. The set-down uses the CSS translate/rotate properties; GSAP's scroll lift sits on the card's wrapper so the two never fight.
- Scroll (GSAP 3.12.5 + ScrollTrigger from cdnjs with SRI, deferred so hours never wait): the hero card lifts slowly and the room photo drifts a little slower than the page as you leave; every section's printed double rule is ruled across from the left as it arrives (1.3 s), then the ruled lines of the practitioner list, getting here and good to know are drawn one after another; the spruce billing band opens out from a rounded card to the full width (scrubbed); service photos open like blinds; the room is pinned while the clock runs 9:00 am to 8:00 pm (light moves and warms, the room dims, the lamp comes on, the caption cross-fades between the four parts of the day); the card back slides square on the counter; the fill-in card slides across the counter onto a small pile of blank appointment cards, which fans out to the left on the same stretch of scroll (3° and 6° on desktop, half that on phones; without GSAP or with reduced motion the pile simply sits fanned).
- Fallback: without GSAP, or with reduced motion, it is a normal page: the room is a still photo with the four parts of the day as a plain list, every photo is visible, nothing is pinned.
- Interaction: circling an option on the fill-in card draws the pen ring (0.6 s); button press moves 1px; menu and calendar open instantly; errors appear at once. On the booking confirmation the ring draws round your day.
- Reduced motion: no intro, no drift, rings and underline drawn already, nothing pinned, scrolling instant.

## 9. Language notes
- HK wording for 繁: 物理治療, 按摩治療 (註冊按摩治療師 in each RMT's credential), 針灸, 拔罐, 整骨手法治療, 申請預約, 覆診, 直接向保險公司收費 (nav label 保險直接收費), 泊車, 洗手間, 醫生紙, 廣東話, 普通話, 電郵, 短訊, 公眾假期, 應診時間, 輪椅. Times written 上午9:00 – 晚上8:00.
- Mainland wording for 简: 物理治疗, 按摩治疗, 针灸, 拔罐, 整骨手法治疗, 申请预约, 复诊, 直接结算 (保险直付), 停车, 卫生间, 医生证明, 粤语, 普通话, 邮箱, 短信, 法定节假日, 营业时间, 轮椅. Times written 9:00–20:00 (24-hour).
- Lines the user should double check with a native reader: 繁 "直接向保險公司收費" (some HK readers say 直接過數 / 直接報銷), 简 "直接结算" vs "直付", the practitioner Chinese names, 整骨手法治療 as the name for osteopathic manual therapy, and the acupuncture description.

## 10. Do's and don'ts
Do:
- Show today's hours on the card, computed in Toronto time and aware of holiday hours.
- Keep the booking form to service (with length and an optional practitioner), two preferred days and times, name, phone, and an optional email. Nothing else.
- Say near the form, in plain words, that health details are asked in person, not online.
- Name every practitioner with the credential spelled out once (Registered Massage Therapist) and the languages they speak.
- Print the 24-hour cancellation note wherever the card appears.
- Use ballpoint blue only for things a person writes or does.

Don't:
- Add a symptoms, injury, body area, health history or "reason for visit" box, or ask for insurance policy numbers.
- Use lotus, stones, water ripples, bamboo, candles, orchids or the old wave logo.
- Box sections into cards, add a stats row, a carousel or autoplay video.
- Put an arrow or icon on buttons, or style one word in a headline differently.
- Write wellness-speak ("journey", "holistic", "sanctuary", "rejuvenate").
- Use a second filled button next to the main action.

## 11. Judgment calls made without the owner
- Removed the "Have you been to Stillwater before?" question from the booking form: the session length list already covers first visits, and whether someone is already a patient is itself health information under PHIPA.
- Phone is now required and email optional (before: one of the two). The front desk confirms by phone or text in practice, and the brief limits the form to name, phone, time and service.
- (Revised when finishing the build) Removed "language for our call", "how should we confirm" and the consent checkbox. The brief's hard rule allows only name, phone, day/time and service (email optional). A line under the phone field says the front desk speaks all three languages and the patient can say which when we call; the front desk confirms by call or text to the phone given.
- Kept osteopathic manual therapy as a fourth service (it existed before), but the hero line names the three main ones.
- The header has no booking button on phones (it would crowd the toggle); the button is in the hero, in the menu panel with the same wording, after every service and at the end of every page.
- Removed decoration: the dark top bar with its green check icon. Its two facts (direct billing, phone) moved to the card and the insurance section, where they are read in context.
- Kept Atkinson Hyperlegible Next's slashed zero (the Google Fonts build has no unslashed alternate; tested zero/ss01-05/salt/cv01-10). It is the point of the font: 0/O and 1/l/I can't be confused in times, prices and the phone number.
- Between 1000 and 1239px wide the header nav shows only "Services and fees" and "Hours and location" so the toggle and the main button never get pushed off screen; the header phone number shows from 1520px. Everything else is still one tap away on the page.
- Removed one more decoration while finishing: the "Day" prefix printed in the weekday strip on the completed card (星期 / 周 was printed twice next to the row label). The hero card keeps it because there the row label is "Today".
- Restored the footer's "since 2015" line from the original site: years open is the one piece of trust a made-up clinic can honestly carry.
- (Craft pass) No handwriting font for the pen. The card is read by people in their 60s, so written values stay in Atkinson Hyperlegible; the pen shows through ballpoint blue and drawn marks (rings, underline).
- (Craft pass) The big clock in the day-in-the-room scene is display type, so it uses Noto Sans HK/SC 400 with a plain zero (Atkinson's slashed zero looked technical at 88px). 52px on phones, 88px on desktop: every value from 9:00 am to 8:00 pm, including 下午12:00, fits its column at 1000px.
- (Craft pass) The day-in-the-room scene reuses the hero's room photo on purpose: it is the same room through the day. Its notes about who works evenings come straight from the practitioner list, nothing new is claimed.
- (Craft pass) The fill-in card only warns about what the practitioner list states (Jonathan Lau's evenings, Wen Zhao weekdays only, Sofia Marchetti's three days, massage evenings Mon, Wed, Fri). It never asks about health; it sends service, date and time of day to the request form, which still asks for name and phone there.
- (Craft pass) Removed decoration: the hero photo's slow zoom idea and a sign-off line under the footer.
- (Hero revision, owner feedback) Removed the drifting blind-light stripes from the hero: across the photo and the card they looked like a barrier. Replaced by the lights-up and set-down entrance above. The same stripes behind the fill-in card at the end of the page were removed too, and replaced by the fanned pile of blank cards.
