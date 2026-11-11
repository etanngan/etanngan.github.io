# DESIGN.md: Maple Bridge Learning Centre / 楓橋教育中心 / 枫桥教育中心

Demo site for a made-up after-school tutoring centre in Markham, Ontario. The business, address
(Suite 205, 88 Fernbrook Gate), phone (905) 555-0162 and office@maplebridge.example are invented,
and the footer says so on every page.

## 1. Business and goal

- **What it is (owner's words):** "We're a small after-school tutoring centre near Kennedy and Bur Oak.
  Math, English and science for Grades 1 to 12, plus French, OSSLT prep, Saturday Mandarin and a
  Homework Club. Six kids a class at most, same teacher all term, and we follow the Ontario curriculum."
- **Main action:** book a free trial class. One wording, used in the header, hero, every page end,
  the timetable rows and the form's submit topic.
  - EN: **Book a free trial class**
  - 繁: **預約免費試堂**
  - 简: **预约免费试听课**
  - Why not the old "Book a free assessment": a Markham parent responds to 試堂 / 试听课. It is the word on
    every Chinese-language tutoring flyer in Markham and Richmond Hill, it means "my child sits in a real class
    with the real teacher", and it costs the parent nothing. "Assessment" (評估/测评) sounds like a test the
    child might fail. The 40-minute assessment is not lost: it became a 15-minute level check inside the
    trial class, and the old $30 paid trial is gone (the trial is now free).
  - Full classes (0 seats) are the one exception: their row says "Ask about the waitlist", because offering
    a trial in a full class would be untrue.
- **What parents check before calling:** which grades and subjects; how many kids per class; when the
  classes are; how much; who teaches and in which languages; Ontario curriculum match; where to stop the car
  at pickup; how to try it; what happens on PA days and March Break; what if my child misses a class.
- **Who visits:** parents aged 35 to 55, many Cantonese-speaking (Hong Kong) or Mandarin-speaking
  (mainland) families in Markham, mostly on a phone, often while waiting at school pickup. Some grandparents.
  The student is not the reader.

## 2. The one idea

- **Object:** a page of marked homework. The Canadian exercise book / loose-leaf page every Ontario kid has
  (pale blue rules, red margin line, three punched holes) with the teacher's red-pen marking on it: ticks,
  a circled number, a short note in the margin.
- **Where it shows up:**
  - **Hero:** the key facts are written on a ruled loose-leaf sheet laid over a photo of a girl writing in
    class. Red ticks beside "6 students or fewer" (the 6 is circled in red), "Follows the Ontario
    curriculum" and the price. Today's hours sit on the top line where a student writes the date.
  - **Dividers:** every section opens on a short strip of ruled paper (three blue rules crossed by the
    red margin line).
  - **Buttons:** one treatment, a yellow highlighter swipe (the HB-pencil yellow the centre already used),
    with slightly slanted chisel ends. Only the main action is yellow. Inside timetable rows the same
    highlighter becomes a stroke under the link text, so 30+ rows do not turn into 30 yellow buttons.
  - **Timetable:** every class is a line on a ruled page; the time sits in the margin column (where
    question numbers go); seats left is a number circled in red pen; a full class says "Full" in red pen.
    The grade filter is a row of numbers 1 to 12 and the chosen grade gets the red circle.
  - **Inquiry form:** the form is a ruled sheet; errors are written in red pen (LXGW WenKai) in the margin
    beside the field on desktop and under it on phones; the error summary is a circled count at the top,
    like a score. The confirmation gets a red tick.
  - **Fees:** a ruled fee list with the price at the right end of the line and one red-pen margin note.
  - **Footer:** the exercise-book cover: cover blue with the white "Name / Phone / Address" label filled in.
- **What stays quiet:** body text is a plain sans-serif in ink colour; no illustrations, no doodles, no
  stickers, no gold stars, no rounded cards, no icons except the tick and the circle. Photos are ordinary
  daylight classroom photos. Red is only ever the teacher's pen.

## 3. Colour

| Name | Hex | Role |
|------|-----|------|
| Paper | `#ffffff` | Page and sheet background |
| Desk | `#eef1f4` | Behind the hero sheet and the timetable sheet, so the punched holes and the paper edge read |
| Ink | `#1c2430` | All body text and headings (15.9:1 on paper) |
| Pencil | `#46505e` | Secondary text, hints (8.0:1 on paper; never lighter) |
| Rule blue | `#a9c5e4` | Ruled lines (decoration only, never text) |
| Margin red | `#e26d70` | The vertical margin line (decoration only) |
| Red pen | `#c0251a` | Ticks, circles, margin notes, error messages (6.0:1 on paper) |
| Pencil yellow | `#ffc629` | The main action only (ink text on it: 12.5:1) |
| Cover blue | `#1f4d8f` | Links, footer cover (white on it: 8.6:1) |

Check: white paper + blue rules + red pen + one yellow is the real colour of a marked exercise book, not
cream + serif + terracotta and not black + neon. Yellow stays because it is the existing brand colour and the
colour of the school pencil; it is now reserved for "do this" so it always means the main action.

## 4. Type

- **English (headings and body):** Libre Franklin 400 / 600 / 700. A sturdy North American gothic, the
  look of school forms and report cards: organised, not cute.
- **Traditional Chinese:** Noto Sans HK 400 / 700 (Hong Kong glyph forms for HK readers).
- **Simplified Chinese:** Noto Sans SC 400 / 700.
- **Red-pen marks only:** LXGW WenKai TC 400 (霞鶩文楷). A neat kai / handwriting face with full Latin,
  Traditional and Simplified coverage (checked in Chrome). Used only for red-pen text: circled numbers,
  margin notes, error messages, "Full". Never for body text.
- **Stack order:** EN page: Libre Franklin, Noto Sans HK, system. 繁 page: Noto Sans HK, Libre Franklin
  fallback. 简 page: Noto Sans SC, Libre Franklin fallback. Switched with `html[lang^="zh-Hant"]` /
  `html[lang^="zh-Hans"]`. The language buttons use the system CJK stack so English pages do not download
  Chinese font slices.
- **Sizes:** body 17px (never under 16px); small 16px; H3 19px; H2 26px phone / 34px desktop; H1 (business
  name on the hero) 32px phone / 50px desktop; inner-page H1 30px / 42px.
- **Chinese:** line-height 1.8 (ruled sheets: one 32px rule per line = 1.88), letter-spacing 0.02em,
  headings 700. No faux italics.

## 5. Layout

- **First phone screen (390 x 844), everything above 700px:**
  ```
  [mark  Maple Bridge       EN 繁 简   ≡ ]   sticky header, 60px
  [ photo strip: girl writing, 150px     ]
  [ o |  Open now until 8:30 pm          ]   ruled sheet overlapping the photo
  [   |  Maple Bridge Learning Centre    ]   H1 = business name
  [ o |  After-school math, English and  ]
  [   |  science tutoring, Grades 1-12   ]   what it is
  [   |✓ (6) students or fewer per class ]
  [ o |✓ Follows the Ontario curriculum  ]
  [   |✓ From $30 a class, books included]
  [   |  88 Fernbrook Gate, near Kennedy ]   address line
  [   |  and Bur Oak. Free parking.      ]
  [   |  [ Book a free trial class ]     ]   the one main action
  [   |  See the timetable               ]   small secondary link
  ```
- **Home, top to bottom:** hero; classes and fees; how the free trial class works (a real 1-2-3
  sequence); teachers; for parents (pickup, parking, missed classes, sick days, payment, snacks, progress);
  term dates and PA-day / March Break camps; find us (map, directions, phone); cover footer.
- **Timetable:** short heading; filters (grade numbers, subject, day); live count; the ruled timetable
  (week grid on desktop, day-by-day ruled list on phones); seats legend; "not sure which class" ending with
  the main action.
- **Inquiry:** heading; the form sheet; side column with phone and what we don't ask.
- **Alignment:** left aligned everywhere. Container 1180px; sheets keep a 56px margin column (red line).

## 6. Components

- **Main action button (yellow highlighter):** pencil-yellow block drawn by a pseudo-element with slanted
  chisel ends, ink 600-weight text, at least 52px tall. Hover: deeper yellow `#f2b300`. Focus: 3px ink
  outline 3px outside (the outline is on the unclipped element, so it is never cut off). Active: moves down
  1px. Disabled: not used (the form never disables its submit).
- **Row action (timetable):** same wording, ink text with a yellow highlighter stroke under it; hover
  makes the stroke full height; focus ring as above. Whole row target is at least 44px tall.
- **Secondary link:** cover-blue underlined text, no arrow. Hover: thicker underline. Focus ring.
- **Language toggle:** three 44 x 44 buttons EN / 繁 / 简 in one ink-outlined group; the current one is
  filled ink with white text (`aria-pressed="true"`). Hover: desk grey. Focus ring. Always in the header.
- **Class row:** time in the margin column; class name (600), grade, teacher, room on the line; seats as a
  red circled number + "seats left"; "Full" in red pen for waitlist; row action at the end.
- **Filter chips:** grade numbers are 44 x 44 squares, the chosen one circled in red pen and set in ink
  bold; subject and day chips are 44px tall outlined labels, chosen = ink fill. The result count is
  announced (`aria-live`).
- **Form fields:** label above the field; the field is a white box with a 2px ink bottom line (the line you
  write on) and a light blue outline; focus: cover-blue outline. Errors: red-pen text (WenKai) in the
  margin on desktop / under the field on phones, linked with `aria-describedby`, field `aria-invalid`,
  summary with `role="alert"` written as a circled count, focus moves to the first wrong field.

## 7. Images

- **Source:** Unsplash and Pexels (free licence, commercial use). Every file, URL and licence is in
  `assets/img/CREDITS.txt`.
- **Style:** ordinary daylight, real children at real tables, eye level or slightly above, paper and
  pencils in frame. Asian-Canadian children where possible, because that is who is in the room in Markham.
  No staged thumbs-up, no laptops-and-headsets, no graduation caps.
- **Files:** `hero-girl` (girl writing in class), `group` (teacher pointing at a line in a student's
  exercise book), `tutor` (teacher and Grade 5-6 boy working a problem), `worksheet` (multiplication
  sheet and pencil), `homework` (teen doing homework). WebP, width/height set, `srcset`, lazy below the
  first screen, `fetchpriority="high"` on the hero.
- **Alt text in all 3 languages:** yes.

## 8. Motion

- **The one moment:** the three red ticks in the hero are drawn once, one after another (about 1 second
  in total), after the text is already on screen.
- **Interaction feedback:** the burger menu opens instantly; filter changes re-render instantly and the
  count is announced; the form confirmation appears with a red tick (no animation).
- **Reduced motion:** ticks appear already drawn; smooth scrolling is off.

## 9. Language notes

- **繁 (Hong Kong wording):** 補習社, 試堂, 功課, 功課班, 接放學, 泊車, 學費, 一至十二年級, 星期一,
  上午 / 下午 / 晚上 with 12-hour times, 致電, 電郵, 留位, 候補, 補堂, 家長, 成績表, 安省課程,
  安省註冊教師, PA Day, 三月假 (March Break), 夏令營 / 日營, 果仁 (nuts).
- **简 (mainland wording, written separately, not converted):** 补习班, 试听课, 作业, 作业辅导班, 接送,
  停车, 学费, 1–12年级, 周一, 24-hour times (15:30), 打电话, 邮箱, 名额, 候补, 补课, 家长, 成绩单,
  安省课程大纲, 安省注册教师, PA Day, 春假 (March Break), 日营, 坚果.
- **Lines a native speaker should double check:** the 繁 hero ticks (每班最多 6 人 / 配合安省課程 /
  每堂 $40 起，已包教材); 試堂 flow wording (先做 15 分鐘程度測試); the 简 timetable row wording
  (预约免费试听课 on every row); grade band names; the red-pen error messages in both scripts.

## 10. Do's and don'ts

Do:
- Put the number of students per class, the price per class and the Ontario curriculum line on the first
  screen. Those are the three questions every Markham parent asks first.
- Write grades as Ontario grades (Grade 5 / 五年級 / 5年级) and course codes (MHF4U) as they appear on the
  report card.
- Keep the pickup instructions specific: which spots, how many minutes, who signs out Grade 1 to 3.
- Show seats left honestly, and say when they were last updated.
- Say which languages each teacher speaks.
- Use red only for the teacher's pen, yellow only for the main action.

Don't:
- Don't use a handwriting font for anything a parent has to read at length; red-pen text is short notes only.
- Don't add stars, stickers, apples, rulers, rockets, graduation caps or cartoon kids. It must look like an
  organised centre, not a kids' party.
- Don't put 30 yellow buttons in the timetable; rows use the lighter highlighter stroke.
- Don't ask for the child's name, school, report card or date of birth in the form.
- Don't colour-code the timetable by subject; seven colours fight with the red pen.
- Don't promise grade improvements or invent results, reviews or awards.

## Decisions log (judgement calls made without the owner)

- Main action changed from "free assessment" to "free trial class" (see section 1). `inquiry.html?topic=assessment`
  still works and opens the form on the trial-class topic.
- Hero practical line: both today's hours (computed in Toronto time, with Saturday hours, Sunday and holiday
  closures) on the sheet's date line, and the cross-streets + free parking under the ticks. Parents check the
  intersection first ("is it near us?"), the hours second ("can I call now?"); both fit above 700px.
- Grade filter changed from four bands to the numbers 1 to 12, because parents think "she's in Grade 5", not
  "Junior". Old `schedule.html?band=P|J|I|H` links still work and circle every grade in that band.
- Form trimmed to what's needed: the "best way to reach me" radio and the consent checkbox were removed
  (a phone number means we call or text, an email means we email; replying to an inquiry the parent sent does
  not need a marketing consent box). A plain sentence under the button says the details are only used to reply.
- Subject colour coding in the timetable removed (see don'ts).
- Removed decorations before finishing: the hero's red-pen "great work!"-style margin note (cut by the first
  agent), and the punched holes on the page-end sheet (cut while finishing: holes now appear only on the hero
  sheet, the one place the loose-leaf page is shown whole; on the end sheet they repeated the hero for nothing).

## Refinements made while building (second agent)

- Hero price tick says "From $30 a class", not $40: Saturday Mandarin is $30 a class.
- Phone action bar: on phones a white bar with the yellow main action and a plain "Call" link appears once the
  hero button has scrolled away. It hides whenever another yellow button or the footer is on screen, so the
  yellow highlighter still appears once per screen.
- Header on phones under 420px: mark 30px and tighter gaps, so the English name stays on two lines beside the
  44px toggle and the burger.
- Footer label rows stack (label above value) on phones so the email never breaks mid-word.
- Desktop hero name uses 1.5 rules per line (two lines = three rules) instead of 2 rules per line, which left a
  gap; Chinese names fit one line and keep 2 rules.
- Timetable row link wraps inside narrow week-grid cells with the highlighter cloned per line.
- `<html lang>` is set to `zh-Hant-HK` on 繁 by a tiny inline script after the shared engine.
- The form's submit button says "Book a free trial class" when that is the topic, "Send my question" for the
  other topics, so the button always says exactly what happens.
- Homework Club fee row: name alone in the first column, the 3:30 to 6:30 pm hours in "each class", so the row
  stays readable on a phone.
