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
  - **First time at yum cha?** a pinned four-step story: take a number (red ticket A23), tick your sheet (ticks draw as you scroll), leave the teapot lid open (the lid lifts), pay at the counter (a red 多謝 chop).
  - **What every table orders (concept v2):** the dim sum cart. Nine dishes ride past in round bamboo steamers on a cart with a steel rail and two wheels (real photos for har gow, siu mai, BBQ pork cheung fun and egg tarts; the others are closed lids stamped with their size). Each has a "Tick it" button; "Your sheet" beside the heading lists what is ticked and the total. Ticks go into the same sheet the menu and phone menu use (`jb-sheet`, kept on the phone for 6 hours).
  - **Before you visit:** weekend waits as bars (the peak bar in red) next to the framed weekend table photo, then the practical facts in two columns.
  - **Hours and location + footer (deep jade):** hours list with today marked by a gold edge, address, a big gold phone number, the map, and 翠籠軒 stamped huge at the bottom like the board over the door.
  - **Menu and phone menu pages:** keep the sheet layout (tier boxes, tally boxes); they share the jade header, red call button and jade footer.
- **What stays quiet:** paper and porcelain backgrounds, plain sans text, no icons, no gradients except the bamboo texture of the steamer and lid.

## 3. Colour
| Name | Hex | Role |
|------|-----|------|
| Jade | `#0d4f3c` | Hero, signboard background, headings on light sections |
| Deep jade | `#093a2c` | Header, hours and location, footer |
| Jade line | `#2f6e5a` | Rules on deep jade |
| Jade rule | `#b9cfc4` | Rules on paper |
| Gold | `#e2b84f` | Sign characters, big numbers, links and focus on jade, today's edge |
| Red | `#c42a2a` | The main button, the chop, the price band, the peak wait bar, ticks |
| Deep red | `#a32020` | Button edge and hover |
| Porcelain | `#eef2ec` | Page background |
| Paper | `#fffdf7` | The order sheets |
| Ink | `#10261e` | Body text on light backgrounds |
| Muted | `#46584f` | Secondary text on light backgrounds |
Contrast: ink on porcelain 14:1; jade on porcelain 8.4:1; white on red 5.6:1; gold on jade 5.2:1 and on deep jade 6.9:1; #d5e3db on jade 7.0:1; gold on red 3.4:1 (only for the 76px+ price, aria-hidden, the price is also in the text); deep jade on gold 6.9:1.
Red and gold are the signboard's colours, used generously in bands and big numbers, not as thin accents. Not cream + serif + terracotta; not black + neon.

## 4. Type
- **English display:** Archivo, wide (`font-stretch: 112%`), weight 850, tight letter-spacing, for headlines, the price and the phone number.
- **English body:** Archivo 400/600/700 at normal width.
- **Traditional Chinese:** Noto Sans HK 400/700 (headings 700, letter-spacing .04em). **Simplified:** Noto Sans SC.
- **Sign characters:** Noto Serif HK 900 (翠籠軒, 營業中, 休息中, 多謝) and Noto Serif SC 900 (翠笼轩, 营业中, 谢谢), each loaded as a few-character subset.
- **Stack order and loading:** unchanged: `fonts.js` loads only the current language's Chinese fonts.
- **Sizes:** body 17–19px; hero H1 40–60px phone / up to 88px desktop; section headings 40–72px; the sign 60–96px phone / up to 148px desktop; the price 76–150px.
- **Chinese:** line-height 1.75, letter-spacing .02em; headings line-height 1.15–1.2.

## 5. Layout
- **First phone screen (390×844):** jade header (翠籠軒 / Jade Basket, EN 繁 简 pill, menu button), then the jade hero: 翠籠軒 in gold, headline, what it is, status pill + what is being served now, today's hours, red "Call to book a table" + "See the menu", address. The steamer and the tilted sheet follow below.
- **Desktop hero:** three columns: vertical sign | text | steamer with the sheet overlapping its lower left; fills the first screen.
- **Section order (home):** hero → $5.50 band → First time at yum cha? (pinned) → What every table orders → Before you visit → Holiday hours → Private room → Hours and location (with map and directions) → 翠籠軒 sign-off → footer.
- **Sticky phone bar** (phones only, after the hero button scrolls away): red call button, Menu, Map.
- Container 1240px on the home page; 16–18px side gutters on phones.

## 6. Components
- **Main action (`.btn-call`, every page):** red block, white text 19px weight 800, 6px radius, a 4px deep-red bottom edge, min-height 54–58px. Hover deep red. Focus: 3px deep jade outline on light, gold on jade. Wording never changes.
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
- **Hero:** red ticks land on the tilted sheet, then the chop thumps (after the intro when it plays); steam rises slowly from the steamer (paused when the hero is off screen).
- **Scroll-linked (GSAP):** the sign drifts (desktop only, so it never covers the headline), the steamer turns and the sheet lifts away; the $5.50 slides left; the four-step story pins and plays its scenes; the cart pins and rolls sideways with its wheels turning (keyboard focus brings an off-screen dish into view); the wait bars grow in; the weekend photo drifts in its frame; 翠籠軒 is stamped one character at a time. On phones the pinned scenes leave room for the bottom call bar.
- **Tap:** ticking a dish on the cart draws the tick and lifts its steamer.
- **Reduced motion or no GSAP:** no intro (reduced motion), no steam, no scroll effects; the story is a plain numbered list; the cart scrolls sideways by swipe; the sheets show their ticks and chop in place.

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
- Nov 2026 (signboard pass): the pencil 正 tallies and the "Table 12 / Guests 4" fields in the hero. The tilted sheet's red ticks and chop say "order sheet" on their own.

## Refinements made while building (second agent)
- The 營業中 chop is a horizontal three-character stamp, not a square: the square split it 2+1 (营业/中), which read as a mistake.
- The 特點 tier was empty in the menu data; lo mai gai and crispy shrimp bean curd rolls moved into it, ma lai go moved to Sweets, so every printed tier has dishes.
- Dish names: rice rolls are "… cheung fun" in English (what Markham diners say), 山竹牛肉球 for the beef balls (HK sheet name).
- On the phone bar of the menu page, "Your sheet" is a text link, not a bordered box, so the call button stays the only button.
- The phone-menu search label is visible (older diners at the table), not screen-reader only.
- Only one stylesheet (site.css); qr.css was folded in and deleted. Sheet logic lives in sheet.js, shared by menu.html and qr.html, stored in localStorage `jb-sheet` for 6 hours.
- Holiday rows in the past are hidden automatically; if none are left the section says so.
