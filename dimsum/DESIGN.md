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
- **The object (Nov 2026, from the owner-approved concept):** the Hong Kong teahouse **signboard** and the paper **order sheet (點心紙)**. A jade board with gold characters (翠籠軒) hangs over the door; on the table is a thin paper sheet you tick, which the server stamps with a red chop.
- **Where it shows up:**
  - **Hero (jade):** the gold signboard (vertical 翠籠軒 in a double gold frame on desktop, horizontal on phones), a plain headline, today's status and hours, the red call button. On the right, a round bamboo steamer holding the real har gow photo, steam rising from it, and a tilted paper order sheet whose boxes get red ticks before the 營業中 / 休息中 chop thumps onto it.
  - **Red band:** the weekday morning price ($5.50) in huge gold numerals, like the price card on the trolley.
  - **First time at yum cha?** a four-step story where nothing pins (the steps scroll normally while a sticky stage shows the step being read): take a number (red ticket A23), tick your sheet (ticks draw as you scroll), leave the teapot lid open (the lid lifts), pay at the counter (a red 多謝 chop).
  - **What every table orders (concept v2):** the dim sum cart, a real sideways scroller (swipe, trackpad or shift+wheel, plus previous/next arrows for mouse users; page scrolling never moves it, and its wheels roll as it scrolls). Nine dishes ride past in round bamboo steamers on a cart with a steel rail and two wheels (real photos for har gow, siu mai, BBQ pork cheung fun and egg tarts; the others are closed lids stamped with their size). Each has a "Tick it" button; "Your sheet" beside the heading lists what is ticked and the total. Ticks go into the same sheet the menu and phone menu use (`jb-sheet`, kept on the phone for 6 hours).
  - **Before you visit:** weekend waits as bars (the peak bar in red) next to the framed weekend table photo, then the practical facts in two columns.
  - **Hours and location + footer (deep jade):** hours list with today marked by a gold edge, address, a big gold phone number, the map, and 翠籠軒 stamped huge at the bottom like the board over the door.
  - **Menu and phone menu pages:** keep the sheet layout (tier boxes, tally boxes); they share the jade header, red call button and jade footer.
- **What stays quiet:** white and light charcoal backgrounds, charcoal headings, plain sans text, no icons, no gradients except the bamboo texture of the steamer and lid.

## 3. Colour
| Name | Hex | Role |
|------|-----|------|
| Jade | `#0d4f3c` | Hero, signboard background, links and controls on light sections |
| Deep jade | `#093a2c` | Header, hours and location, footer |
| Jade line | `#2f6e5a` | Rules on deep jade |
| Jade rule | `#b9cfc4` | Rules on paper |
| Gold | `#e2b84f` | Sign characters, big numbers, links and focus on jade, today's edge |
| Red | `#c42a2a` | The main button, the chop, the price band, the peak wait bar, ticks |
| Deep red | `#a32020` | Button edge and hover |
| Canvas | `#ffffff` | Page background (crisp white) |
| Canvas alt | `#f4f4f4` | Alternate sections (the cart, holiday hours), wait-bar tracks |
| Paper | `#fffdf7` | The order sheets |
| Void | `#111111` | Body text and headings on light backgrounds |
| Ash | `#525252` | Secondary text on light backgrounds |
Contrast: Void on white 18.9:1 and on canvas alt 17.2:1; jade on white 9.5:1 and on canvas alt 8.7:1; Ash on white 7.8:1, on canvas alt 7.1:1, on paper 7.7:1; white on red 5.6:1; gold on jade 5.2:1 and on deep jade 6.9:1; #d5e3db on jade 7.0:1; gold on red 3.4:1 (only for the 76px+ price, aria-hidden, the price is also in the text); deep jade on gold 6.9:1.
Red and gold are the signboard's colours, used generously in bands and big numbers, not as thin accents.

**Neutrals, radius and shadow (Nov 2026)** follow the AnimatedWebs "Supabase" style reference (a look only: no Supabase logo, copy or imagery): crisp white canvas, Void text and headings, Ash greys, jade kept for actions and colour blocks. Tokens in `site.css :root`: `--radius` 8px (buttons, fields, chips, the ticket), `--radius-lg` 16px (photos, map, story stage), pills stay 999px; printed parts (order sheets, tally boxes, tier boxes, the sheet dialog) stay square. One shadow, `--shadow` 0 16px 32px charcoal at 16%, and `--shadow-dark` for the same lift on jade. The red button keeps its 4px deep-red edge. Its purple and orange accents are not used. Not cream + serif + terracotta; not black + neon.

## 4. Type
- **English display:** Archivo, wide (`font-stretch: 112%`), weight 900, letter-spacing -.01em, for headlines, the price and the phone number.
- **English body:** Archivo 400/700 at normal width. Archivo's zero has no slash, which suits a warm business.
- **Traditional Chinese:** Noto Sans HK 400/700 (headings 700, letter-spacing .04em). **Simplified:** Noto Sans SC.
- **Sign characters:** Noto Serif HK 900 (翠籠軒, 營業中, 休息中, 多謝) and Noto Serif SC 900 (翠笼轩, 营业中, 谢谢), each loaded as a few-character subset.
- **Stack order and loading:** unchanged: `fonts.js` loads only the current language's Chinese fonts.
- **Sizes (strict scale, nothing else):** 16 small print and labels · 18 body and buttons · 22 leads, h3, dish names on desktop · 28 band heading (phone), stamps, phone number (phone) · 40 page and section headings (phone and tablet), band heading and phone number (desktop) · 64 hero H1 and section headings from 1200px, the sign and price on phones · 144 the sign, the $5.50, A23 and 多謝 on desktop · 288 the 翠籠軒 sign-off from 1200px.
- **Weights:** 400, 700, 900 only (fonts.js loads Noto Sans HK/SC at 400 and 700).
- **Chinese:** line-height 1.75, letter-spacing .02em; headings line-height 1.15–1.2.

## 5. Layout
- **First phone screen (390×844):** jade header (翠籠軒 / Jade Basket, EN 繁 简 pill, menu button), then the jade hero: 翠籠軒 in gold, headline, what it is, status pill + what is being served now, today's hours, red "Call to book a table" + "See the menu", address. The steamer and the tilted sheet follow below.
- **Desktop hero:** three columns: vertical sign | text | steamer with the sheet overlapping its lower left; fills the first screen.
- **Section order (home):** hero → $5.50 band → First time at yum cha? (pinned) → What every table orders → Before you visit → Holiday hours → Private room → Hours and location (with map and directions) → 翠籠軒 sign-off → footer.
- **Sticky phone bar** (phones only, after the hero button scrolls away): red call button, Menu, Map.
- Container 1240px on the home page; 16–18px side gutters on phones.

## 6. Components
- **Main action (`.btn-call`, every page):** red block, white text 18px weight 700, 6px radius, a 4px deep-red bottom edge, min-height 54–58px. Hover deep red. Focus: 3px deep jade outline on light, gold on jade. Wording never changes.
- **Secondary link:** gold on jade, jade on light; underlined; 44px tall.
- **Language toggle (header):** pill with three 46×44 buttons; active is gold with deep jade text.
- **Status pill:** porcelain with deep jade text when open, red with white text when closed.
- **Order sheet:** paper, 6–8px jade top edge, ruled rows: a 26–30px tick box, Chinese name bold with English below, tier and price. Tapping a row ticks it (red tick draws in 220 ms) and updates the total bar.
- **Chop:** red serif characters in a red frame, rotated, thumps in.
- **Wait bars:** jade bars, the peak in red with its label on a red chip so it is readable at any width.
- **Hours list:** today gets a gold left edge and a lighter jade fill.

## 7. Images
- Same photos as before (Pexels, Unsplash, Flickr CC BY; see `assets/img/CREDITS.txt`), WebP with `srcset`, lazy below the first screen. The hero photo is shown in a round bamboo steamer.

## 8. Motion
Entrances and loops are CSS/SVG. Scroll motion uses GSAP 3.12.5 + ScrollTrigger from cdnjs (pinned version, SRI hashes, `defer` so a slow CDN never delays the page). Without GSAP, or with `prefers-reduced-motion`, the page is a normal page: a plain story list, a cart you swipe sideways, full wait bars and a plain sign-off. All text is readable at every frame.
- **Lid-lift intro:** on the first page view of a visit only, a bamboo steamer lid covers the screen and lifts away with puffs of steam (about 1.4 s). Tap, click, scroll or any key skips it. Never with reduced motion.
- **Hero:** red ticks land on the tilted sheet, then the chop thumps (after the intro when it plays); steam curls up from the steamer: five SVG wisps (three on phones) rise 60 units and fade over 3.6s, 0.7s apart, through a slowly drifting turbulence filter (technique from the AnimatedWebs "Steaming Ramen Noodle Bar" hero, free licence). Hovering the steamer with a mouse puffs the steam for a second. Paused when the hero is off screen.
- **Scroll-linked (GSAP):** the sign drifts (desktop only, so it never covers the headline), the steamer turns and the sheet lifts away; the $5.50 slides left; the story's scene follows the step being read beside it (desktop) or above it (phones: the stage sticks under the header and the steps scroll beneath); nothing pins, so the page always moves with the finger; the wait bars grow in; the weekend photo drifts in its frame; 翠籠軒 is stamped one character at a time.
- **Tap:** ticking a dish on the cart draws the tick and lifts its steamer.
- **Reduced motion or no GSAP:** no intro (reduced motion), the steam stands still at 50%, no scroll effects; the story is a plain numbered list; the cart still scrolls sideways, with still wheels; the sheets show their ticks and chop in place.

## 9. Language notes
- **繁 (Hong Kong wording):** 餐牌, 訂枱, 泊車, 落單, 茶芥, 埋單, 點心紙, 枱號, 人數, 貴賓房, 取籌, 外賣, 拎外賣, 長者, 加一服務費 (written as 15% 服務費 since it is 15%), times as 上午9:00 / 下午3:00 / 晚上9:30. Written standard Chinese with HK vocabulary, not colloquial Cantonese.
- **简 (mainland wording, written fresh, not converted):** 菜单, 打电话订座, 停车, 下单/点菜, 茶位费, 买单/结账, 点菜单, 桌号, 人数, 包间, 取号, 外卖/打包, 早茶, times in 24-hour form (9:00–21:30).
- **Dish names:** 繁 uses Hong Kong restaurant names (蝦餃皇, 蟹籽燒賣皇, 叉燒腸粉, 豉汁蒸鳳爪, 酥皮蛋撻); 简 uses the usual mainland names (虾饺皇, 烧卖, 叉烧肠粉, 豉汁凤爪, 蛋挞); English gives what a Markham diner says plus the Cantonese romanization in brackets (har gow, siu mai, cheung fun, lo mai gai, ma lai go, zha leung, jin deui).
- **Lines the user should double check:** listed in the review log (`Claude outputs/review-logs/dimsum.md`, "For a native speaker").

## 10. Do's and don'ts
Do:
- Say whether dim sum is being served right now, in Toronto time, before anything else.
- Keep every price coming from `menu-data.js` so the home page, menu, phone menu and the sheet never disagree.
- Keep the home page's order sheet and the menu's sheet the same sheet.
- Put the phone number next to the main button, and say who can book (weekends 6+ only).
- Keep holiday hours on the home page and in the today logic.

Don't:
- Add a second main button or an online booking form the restaurant doesn't have.
- Use a real restaurant's sheet or sign; everything is drawn in HTML/CSS/SVG.
- Character-convert 繁 into 简 (茶芥 is 茶位费, 訂枱 is 订座, 泊車 is 停车).
- Let a scroll effect move text over other text, or start any motion with reduced motion on.

## Removed decoration
- Nov 2026 (polish pass): the double rule under the phone menu's "Good to know" heading and the ruled line above "Getting here". Spacing separates them now.
- Nov 2026 (signboard pass): the pencil 正 tallies and the "Table 12 / Guests 4" fields in the hero. The tilted sheet's red ticks and chop say "order sheet" on their own.

## Refinements made while building (second agent)
- The 營業中 chop is a horizontal three-character stamp, not a square: the square split it 2+1 (营业/中), which read as a mistake.
- The 特點 tier was empty in the menu data; lo mai gai and crispy shrimp bean curd rolls moved into it, ma lai go moved to Sweets, so every printed tier has dishes.
- Dish names: rice rolls are "… cheung fun" in English (what Markham diners say), 山竹牛肉球 for the beef balls (HK sheet name).
- On the phone bar of the menu page, "Your sheet" is a text link, not a bordered box, so the call button stays the only button.
- The phone-menu search label is visible (older diners at the table), not screen-reader only.
- Only one stylesheet (site.css); qr.css was folded in and deleted. Sheet logic lives in sheet.js, shared by menu.html and qr.html, stored in localStorage `jb-sheet` for 6 hours.
- Holiday rows in the past are hidden automatically; if none are left the section says so.

## 11. Polish rules (checked by script)
`Claude outputs/audit/dimsum-polish-audit.mjs` (Node + Chrome, no dependencies) measures every page in EN/繁/简 at 390 and 1440px. Keep it passing:
- Type: only the 8 sizes in §4, only weights 400/700/900. Headings line-height 1.0–1.12 (Chinese 1.2), -.01em on large English type, `text-wrap: balance`; paragraphs `text-wrap: pretty`.
- Line length: paragraphs max 65ch (Chinese 36em), set once with `:where(p, dd, figcaption)`. Chinese paragraphs break between phrases (`word-break: keep-all` with `overflow-wrap: anywhere`), so words like 訂金 never split. Use no-break spaces inside a short phrase that must stay whole (the 繁/简 hero address).
- Spacing: 0, 8, 16, 24, 32, 48, 64, 96, 128 only. Every section pads `var(--sec)`: 64px on phones, 96px from 901px. The only exceptions are layout offsets (percent bar labels, the cart's centring offset against 100vw) and GSAP's pin spacers.
- Numbers: `tabular-nums` on the whole body, so prices, times and totals line up.
- States: every link, button and field eases colour, background, border, shadow, transform and underline in 180ms `cubic-bezier(.2, .8, .2, 1)`. Links thicken and drop their underline on hover and dim when pressed. Buttons press down 1px (the red button 2px into its edge). Disabled controls fade to 45%. Keyboard focus is a 3px ring (deep jade on light, gold on jade). Text selection is gold.

