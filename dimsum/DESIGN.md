# DESIGN.md: Jade Basket Dim Sum House 翠籠軒

A demo site for a made-up business. The restaurant, address (Unit 108, 3150 Ellesworth Road), phone (905) 555-0138 and hello@jadebasket.example are fictional, and every page says so in the footer.

## 1. Business and goal
- **What it is (owner's words):** "A family Hong Kong-style dim sum place in Ellesworth Plaza, near Kennedy and Highway 7. Dim sum every day from the morning, Cantonese dinner at night. Free parking. Weekends are busy, so phone ahead if you're a big table."
- **Main action (one only):** phone the restaurant. Busy Cantonese restaurants book by phone, groups of 6+ phone ahead, walk-ins queue for a number. There is no online booking to send people to, so a form would be a fake promise. Exact wording, used in the header (desktop), hero, sticky phone bar and at the end of every page:
  - EN: **Call to book a table**
  - 繁: **致電訂枱**
  - 简: **打电话订座**
  "See the menu" is a plain text link next to it, never a second button. The private room uses the same phone number as a text link, not a second button.
- **What customers check before visiting:** is it open now and is dim sum still being served (dim sum stops at 3 pm weekdays / 4 pm weekends; dinner menu from 5 pm), weekend wait, address and parking, prices (dim sum priced by size), tea charge, payment methods (AmEx or not, WeChat Pay/Alipay), whether they can book (weekends only 6+), holiday hours (Christmas, Lunar New Year), private room for parties, takeout.
- **Who visits:** families and seniors from Markham, Richmond Hill and Scarborough; many read Chinese first (Hong Kong Cantonese families read 繁, newer mainland families read 简); their adult kids book for them in English. Phone first, often in the car park or already at the table (the QR menu).

## 2. The one idea
- **The object:** the 點心紙, the thin printed dim sum order sheet on every Hong Kong-style table. Printed in ONE ink (here jade green), a grid of dishes grouped by price tier (小點 / 中點 / 大點 / 特點 / 頂點) with the tier price in a reversed box, a little box beside each dish that you fill with a pencil tally (正), the table number (枱號) and number of guests (人數) written at the top, and a red chop.
- **Where it shows up:**
  - **Hero (Nov 2026 personality pass):** the first screen IS the order sheet at full scale, edge to edge on phones and the full 1200px container on desktop. No card floating on a photo. From top to bottom it prints like a real 點心紙: a ruled header row (點心紙 · 枱號 Table 12 · 人數 Guests 4 in pencil · the red chop box), a full-width reversed jade band with the business name huge, a ruled "today" grid with the main button, and the dish grid by tier (小點 $5.50 … 頂點 $9.80) with pencil tallies and red ticks. The steamer photo is one cell of the sheet (right of the today grid on desktop, at the bottom of the sheet on phones). The chop says 營業中 when open and 休息中 when closed, so it is always stamped.
  - **Section dividers:** the sheet's printed rules: a thick-thin double rule under every section heading, thin ink rules between rows. No other divider style.
  - **Hours:** a ruled grid like the sheet; today's row gets a red tick, the way a server ticks a delivered dish.
  - **Buttons:** square ink blocks with a thin inner paper line, like the reversed tier boxes printed on the sheet. Never pill-shaped.
  - **Menu page:** literally the sheet: dim sum grouped by tier with a reversed tier heading (小點 Small $5.50), each dish with a tally box. Tapping the box pencils one stroke of 正 into it. Congee, noodles, BBQ and tea follow as "kitchen" sections with their own prices, as on real sheets.
  - **QR phone menu:** the diner's own copy of the sheet. Tap a dish, it gets tallied; the bottom bar shows "Your sheet"; the sheet view has 枱號 Table and 人數 Guests fields at the top (guests drives the tea charge), the dishes grouped by tier, and the printed footer. "Show this to your server." The same sheet is shared with the menu page and kept for 6 hours on that phone.
  - **Footer:** the sheet's printed small print: tea charge per person, 15% service for 10+, prices before HST, allergies. Then address, hours, contact, demo note.
- **Jade used generously:** the sheet's reversed printing becomes full-width jade bands in three places: the hero name band, the private room section and the closing "Book a table" band. Everything else is jade ink on paper.
- **No thin boxes:** ruled grids are open rules (3px top rule, 1px row rules), not framed boxes; photos have no frames. The only framed thing is the hero sheet itself.
- **What stays quiet so the idea stands out:** one ink colour for everything, flat paper, no shadows at all, no rounded cards, no icons except the tally strokes, ticks and chop, motion only in the hero and the pencil stroke.

## 3. Colour
| Name | Hex | Role |
|------|-----|------|
| Newsprint | `#F3F5F2` | Page background: thin cool-white sheet paper, deliberately not cream |
| Slip | `#FBFCFA` | The order sheet itself where it sits on a photo or in the sheet view |
| Jade ink | `#0B5A43` | The one print ink: headings, rules, links, main button fill, tier boxes |
| Deep ink | `#15362B` | Running text (same green family, darker so long text reads well) |
| Chop red | `#C4262E` | Only for things that are "stamped": the 營業中 chop, today's tick, the 招 house-favourite mark |
| Pencil | `#3A3D3B` | Tally strokes and the count the diner writes |

Helpers: muted text `#44605A`, ink wash `#E3ECE7` (today's row), deep ink hover `#08402F`.
Contrast (computed, WCAG): Deep ink on Newsprint 12.0:1; Jade ink on Newsprint 7.5:1; Slip on Jade ink (button text) 8.0:1; muted on Newsprint 6.3:1; muted on ink wash 5.7:1; Chop red on Newsprint 5.2:1; white on Chop red 5.7:1; Pencil on Slip 10.7:1.
Not cream + serif + terracotta (cool white, jade, vermilion only for stamps); not black + neon.

## 4. Type
- **English display:** Archivo, condensed (`font-stretch: 75%`), weight 700, for headings, prices, hours and buttons: the condensed grotesque printed on real sheets. Never a big elegant display serif.
- **English body:** Archivo at normal width, 400 (same variable file, one download).
- **Traditional Chinese:** Noto Sans HK 400/700 for text; Noto Serif HK 700 (Ming/Song style, like the print on the sheet) for headings, tier names and dish names. HK glyph forms match the HK wording.
- **Simplified Chinese:** Noto Sans SC 400/700; Noto Serif SC 700 for headings and dish names.
- **Sign:** 翠籠軒 in Noto Serif HK 900, loaded as a 3-character subset, on every language (it's the sign over the door).
- **Stack order:** `html[lang^="zh-Hant"]`: Noto Sans HK → PingFang HK → Microsoft JhengHei → Archivo. `html[lang^="zh-Hans"]`: Noto Sans SC → PingFang SC → Microsoft YaHei → Archivo. EN: Archivo → Noto Sans HK → system. Numbers (prices, times) always use Archivo condensed so they line up like print.
- **Loading:** Archivo + the sign subset are normal `<link>`s. The Chinese families (≈100 KB of CSS each) are injected by a tiny head script for the current language only, so they never block the first paint and a 繁 visitor never downloads the SC files (and vice versa). EN pages load only Noto Serif HK 700 (for the Chinese dish names).
- **Sizes:** body 17px (never under 16px in any language); small print 16px; H3 1.2rem; H2 EN 2rem condensed / zh 1.6rem serif; H1 EN 2.25–3.2rem condensed / zh 2–2.8rem serif.
- **Chinese:** body line-height 1.75, letter-spacing 0.02em; headings line-height 1.3, letter-spacing 0.04em.

## 5. Layout
- **First phone screen (390×844, everything essential above 700px):**
  ```
  [翠籠軒 Jade Basket      EN|繁|简  ☰]   header, 64px
  [點心紙 | 枱號 12 | 人數 4 | [營業中]  ]   sheet header row, chop lands last
  [████ JADE BAND, full bleed █████████]
  [█ JADE BASKET                       █]  H1 = business name, ~52px EN / ~42px zh
  [█ DIM SUM HOUSE                     █]
  [█ Hong Kong-style dim sum … parking █]  what it is
  [Today   Open 9:00 am – 9:30 pm      ]   ruled "today" grid
  [Now     Dim sum until 3:00 pm       ]
  [Where   3150 Ellesworth Rd …        ]
  [[ Call to book a table            ]]   main action
  [(905) 555-0138          See the menu]
  [小點 $5.50 | □ 齋腸     | □ 豆腐花   ]   dish grid by tier, red ticks land
  [中點 $6.50 | 正✓ 鳳爪   | 正✓ 叉燒包 ]
  ```
- **Desktop hero (1440):** the same sheet inside the 1200px container with a double-line frame: header row; jade band with the name at ~96px on one line; today grid + button on the left, the steamer photo as a cell on the right; the dish grid as five tier columns, three dishes each.
- **Scale:** hero H1 is 3× body on phones and 5–6× on desktop; section headings are 2.4–3.4rem condensed (zh 1.9–2.6rem serif).
- **Section order (home):** hero slip → Hours and location (hours grid, booking rules, address/parking) → Most-ordered dim sum (4 photos, priced from the menu data) → Before you visit (weekend wait grid + photo, tea, morning prices, payment, groups, access, allergies, takeout) → Holiday hours → Private room → Getting here (map) → end slip with the main button → printed footer.
- **Menu page:** title + prices-by-size key → sticky tier bar (小點 … 頂點, congee and noodles, BBQ, tea) with scroll-spy → type filter (all / steamed / fried and baked / rice rolls / sweet / vegetarian) → the sheet. Desktop: sheet on the left, sticky "Your sheet" + symbols + QR code on the right.
- **QR page:** one 560px column: brand + toggle, title + count, search, filters, sticky category tabs, dishes by type with tier chip and tally box, notes, sheet bar.
- **Alignment:** left-aligned text everywhere; desktop container 1200px; the hero slip is 500px wide and overlaps the photo by 60px on desktop.

## 6. Components
- **Main action button (`.btn-call`):** Jade ink block, Slip text, Archivo condensed 700 / Chinese sans 700, 19px, min-height 54px, square corners, a 1px paper line inset 3px (the printed reversed box). Hover: Deep ink hover colour. Focus: 3px Pencil outline offset 3px (Slip outline on ink backgrounds). Active: moves down 1px. Never disabled.
- **Secondary link (`.text-link`):** Jade ink, underlined 1.5px, 44px tall tap area. Hover: Deep ink. Focus: same outline. No arrow.
- **Language toggle:** three 44×44 printed boxes in a 1.5px ink frame, ink rules between them. Active: ink fill with Slip text (`aria-pressed="true"`). Hover: ink wash. Focus: outline.
- **Tally box (`.tick`):** 52×52 square, 1.5px ink border, Slip fill, faint "+" when empty. Tap: one pencil stroke of 正 is drawn (max five strokes; the number beside it keeps counting). With a count, a "−" box (44×44) and the number appear to its left. Hover: ink wash. Focus: outline. Announced through an aria-live region: "Shrimp dumplings (har gow): 2 on your sheet."
- **Menu row:** name in the page language (serif for Chinese, condensed bold for English), other-language name below, one-line description, pieces, marks; thin ink rule under each row. Tier heading row: reversed ink box with 小點 + English size + price.
- **Marks:** 招 house favourite = small red chop; 素 vegetarian, 生 peanuts, 辣 spicy = ink-outlined circles. Legend on menu and QR pages.
- **Form fields (QR search, table number, guests):** 52px tall, 1.5px ink border, square, 17px text (no iOS zoom). Labels always visible (search has a visible-to-screen-readers label and a placeholder with an example in all three languages). "Nothing matches" message in all three languages; there is no submit and no error state.
- **Sticky phone bar:** Jade ink bar at the bottom on phones: "Call to book a table" (wide) / Menu / Map on the home page (only after the hero button has scrolled away, so the first screen has one call button); "Call to book a table" / "Your sheet" on the menu page. The QR page shows only the sheet bar (diners are already seated).

## 7. Images
- **Source:** Pexels (free licence), one Unsplash photo reused from the previous version, two CC BY 2.0 Flickr photos (credited). Full list with URLs in `assets/img/CREDITS.txt`. No watermarks, no real restaurant names or logos in frame.
- **Style:** real tables, not studio flat-lays: bamboo steamers, tea cups, people blurred in the background on a busy morning. Hero: har gow, siu mai and chicken feet in steamers on a wooden table.
- **Format:** WebP via sharp, `srcset` on every photo, width/height attributes, `fetchpriority="high"` on the hero, `loading="lazy"` on everything below the first screen.
- **Alt text in all 3 languages:** yes.

## 8. Motion
- **Hero entrance (once per page load, about 1.3 s):** red ticks are drawn one after another beside the dishes the table has ordered (stroke-dashoffset, 200 ms each, 140 ms apart), then the red chop lands in its box (scales down from 1.5× with a small turn, 260 ms). CSS and SVG only. All text is printed and readable from the first frame; the ticks and chop are decoration. It does not replay when the language changes.
- **The tap moment:** tapping a tally box draws one pencil stroke of 正 into it (stroke-dashoffset, 220 ms). It only happens in response to a tap and the count is readable immediately.
- **Interaction feedback:** row gets an ink wash when it has a tally; the sheet bar updates its count; the sheet dialog opens without a slide.
- **Reduced motion:** the hero ticks and chop are shown in place with no animation; the stroke appears without drawing; smooth scrolling off.
- No fade-in sections, no hover lifts, no carousels, no autoplay video.

## 9. Language notes
- **繁 (Hong Kong wording):** 餐牌, 訂枱, 泊車, 落單, 茶芥, 埋單, 點心紙, 枱號, 人數, 貴賓房, 取籌, 外賣, 拎外賣, 長者, 加一服務費 (written as 15% 服務費 since it is 15%), times as 上午9:00 / 下午3:00 / 晚上9:30. Written standard Chinese with HK vocabulary, not colloquial Cantonese.
- **简 (mainland wording, written fresh, not converted):** 菜单, 打电话订座, 停车, 下单/点菜, 茶位费, 买单/结账, 点菜单, 桌号, 人数, 包间, 取号, 外卖/打包, 早茶, times in 24-hour form (9:00–21:30).
- **Dish names:** 繁 uses Hong Kong restaurant names (蝦餃皇, 蟹籽燒賣皇, 叉燒腸粉, 豉汁蒸鳳爪, 酥皮蛋撻); 简 uses the usual mainland names (虾饺皇, 烧卖, 叉烧肠粉, 豉汁凤爪, 蛋挞); English gives what a Markham diner says plus the Cantonese romanization in brackets (har gow, siu mai, cheung fun, lo mai gai, ma lai go, zha leung, jin deui).
- **Lines the user should double check:** listed in the review log (`Claude outputs/review-logs/dimsum.md`, "For a native speaker").

## 10. Do's and don'ts
Do:
- Say whether dim sum is being served right now, in Toronto time, before anything else.
- Keep every price coming from `menu-data.js` so the home page, menu, QR menu and sheet never disagree.
- Print everything in the one jade ink; save red for the chop, today's tick and 招.
- Use the tier names (小點 … 頂點) the way the restaurant's staff say them, in every language.
- Put the phone number next to the main button, and say who can book (weekends 6+ only).
- Keep holiday hours (Christmas, Lunar New Year, Family Day) on the home page and in the today logic.

Don't:
- Add a second main button or an online booking form the restaurant doesn't have.
- Use pills, rounded cards, soft shadows, gradients or icons on every row.
- Use a real restaurant's sheet photo or name; the sheet is drawn in HTML/CSS.
- Character-convert 繁 into 简 (茶芥 is 茶位费, 訂枱 is 订座, 泊車 is 停车).
- Animate anything that isn't the pencil stroke; no fade-up sections.
- Let a Chinese heading break with one character alone on the last line, or let a button wrap.

## Removed decoration
- Nov 2026: the drop shadow under the hero slip (and the slip itself). The sheet is printed flat on the page now, so the site has no shadows at all.
- The 翠籠軒 sign that was printed again inside the menu page's sheet band. The header already carries the sign one line above, so the band now prints only 點心紙 / 点心单 and "one stroke per order".

## Refinements made while building (second agent)
- The 營業中 chop is a horizontal three-character stamp, not a square: the square split it 2+1 (营业/中), which read as a mistake.
- The 特點 tier was empty in the menu data; lo mai gai and crispy shrimp bean curd rolls moved into it, ma lai go moved to Sweets, so every printed tier has dishes.
- Dish names: rice rolls are "… cheung fun" in English (what Markham diners say), 山竹牛肉球 for the beef balls (HK sheet name).
- On the phone bar of the menu page, "Your sheet" is a text link, not a bordered box, so the call button stays the only button.
- The phone-menu search label is visible (older diners at the table), not screen-reader only.
- Only one stylesheet (site.css); qr.css was folded in and deleted. Sheet logic lives in sheet.js, shared by menu.html and qr.html, stored in localStorage `jb-sheet` for 6 hours.
- Holiday rows in the past are hidden automatically; if none are left the section says so.
