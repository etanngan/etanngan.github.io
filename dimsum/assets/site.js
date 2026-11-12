/* Jade Basket: header menu, phone bar, today (Toronto time), hours and holiday lists, tier key, map language,
   and on the home page: the order sheets (hero, story), the dim sum cart, the lid-lift intro and the GSAP ScrollTrigger motion. */
(function () {
  'use strict';
  var JB = window.JB;
  var T = function (k) { return MPi18n.t(k); };
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fill(s, o) { return s.replace(/\{(\w+)\}/g, function (m, k) { return o[k] !== undefined ? o[k] : m; }); }
  window.JBesc = esc; window.JBfill = fill;
  var TICK = '<svg class="tick" viewBox="0 0 22 18" aria-hidden="true" focusable="false"><path d="M2.5 9.5l5.5 5.5L19.5 2.5"/></svg>';
  var BOX = '<span class="box" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 13l5 5L21 5"/></svg></span>';
  var root = document.documentElement;

  /* ---------- burger ---------- */
  var burger = document.querySelector('.burger'), nav = $('nav');
  function setNav(open) {
    if (!burger) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('data-i18n-attr', 'aria-label:' + (open ? 'nav.close' : 'nav.open'));
    burger.setAttribute('aria-label', T(open ? 'nav.close' : 'nav.open'));
    document.body.classList.toggle('nav-open', open);
  }
  if (burger && nav) {
    burger.addEventListener('click', function () { setNav(burger.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.body.classList.contains('nav-open')) { setNav(false); burger.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180) setNav(false); });
  }

  /* ---------- phone bar: on the home page it waits until the hero button has scrolled away ---------- */
  var bar = document.querySelector('.callbar');
  if (bar) {
    document.body.classList.add('has-callbar');
    var heroBtn = document.querySelector('.hero .btn-call');
    if (heroBtn && 'IntersectionObserver' in window) {
      bar.classList.add('is-off');
      new IntersectionObserver(function (es) {
        var off = es[0].isIntersecting || es[0].boundingClientRect.top > 0;
        bar.classList.toggle('is-off', off);
        bar.setAttribute('aria-hidden', off ? 'true' : 'false');
        bar.querySelectorAll('a,button').forEach(function (a) { if (off) a.setAttribute('tabindex', '-1'); else a.removeAttribute('tabindex'); });
      }).observe(heroBtn);
    }
  }

  /* ---------- tier key (menu and phone menu) ---------- */
  function tierKeys() {
    document.querySelectorAll('[data-tier-key]').forEach(function (ul) {
      ul.innerHTML = JB.tierOrder.map(function (k) {
        var label = JB.tier(k) + (MPi18n.lang === 'en' ? ' ' + JB.tierEn[k] : '');
        return '<li aria-label="' + esc(label + ' ' + JB.money(JB.tiers[k])) + '"><span class="cn" aria-hidden="true">' + esc(JB.tier(k)) + '</span><span class="num" aria-hidden="true">' + JB.money(JB.tiers[k]) + '</span></li>';
      }).join('');
      ul.setAttribute('role', 'list');
      [].forEach.call(ul.children, function (li) { li.setAttribute('role', 'listitem'); });
    });
  }

  /* ---------- today in the hero, in Toronto time ---------- */
  function today() {
    var stEl = $('h-status'); if (!stEl) return;
    var st = JB.status(), L = MPi18n.lang, d = st.today, now;
    if (st.s === 'dimsum') now = fill(T('now.dimsum'), { t: JB.time(d.ds) });
    else if (st.s === 'between') now = fill(T('now.between'), { d: JB.time(JB.hm(JB.dinner)) });
    else if (st.s === 'dinner') now = fill(T('now.dinner'), { t: JB.time(d.c) });
    else if (st.s === 'before') now = fill(T('now.before'), { o: JB.time(d.o) });
    else if (st.s === 'closed') now = fill(T('now.closed'), { o: JB.time(st.tomorrow.o) });
    else now = fill(T('now.after'), { o: JB.time(st.tomorrow.o) });
    stEl.textContent = T(st.open ? 'st.open' : 'st.closed');
    stEl.classList.toggle('is-closed', !st.open);
    $('h-now').textContent = now;
    $('h-hours').innerHTML = esc(fill(T('today.hours'), { h: d.closed ? T('st.closed') : JB.range(d.o, d.c) })) +
      (d.hol ? '<span class="t-hol">' + esc(fill(T('today.hol'), { name: T(d.hol.name) })) + '</span>' : '');
    var chop = $('chop');
    if (chop) chop.textContent = st.open ? (L === 'zh-Hans' ? '营业中' : '營業中') : '休息中';
  }

  /* ---------- hours list (find section) ---------- */
  function hoursList() {
    var ul = $('hours-list'); if (!ul) return;
    var clk = JB.clock(), hol = JB.holiday(clk.ymd);
    ul.innerHTML = JB.weekRows.map(function (r) {
      var w = JB.week[r.days[0]], on = !hol && r.days.indexOf(clk.dow) > -1;
      return '<li' + (on ? ' class="is-today"' : '') + '><b>' + esc(T(r.label)) + (on ? '<span class="tag">' + esc(T('hours.today')) + '</span>' : '') + '</b>' +
        '<span><span class="nw">' + esc(JB.range(JB.hm(w.o), JB.hm(w.c))) + '</span><small>' + esc(fill(T('hours.ds'), { t: JB.time(JB.hm(w.ds)) })) + '</small></span></li>';
    }).join('');
  }

  /* ---------- holiday table: upcoming days only ---------- */
  function holidays() {
    var tb = $('hol-body'); if (!tb) return;
    var clk = JB.clock();
    var rows = JB.holidays.filter(function (h) { return h.date >= clk.ymd; });
    $('hol-none').hidden = rows.length > 0;
    $('hol-table').hidden = rows.length === 0;
    tb.innerHTML = rows.map(function (h) {
      var on = h.date === clk.ymd;
      return '<tr' + (on ? ' class="is-today"' : '') + '><th scope="row">' + esc(T(h.name)) + '<span class="sub nw">' + esc(JB.date(h.date)) + '</span>' + (on ? '<span class="sub today-tag">' + TICK + esc(T('hours.today')) + '</span>' : '') + '</th>' +
        '<td><span class="nw">' + esc(JB.range(JB.hm(h.o), JB.hm(h.c))) + '</span><span class="sub">' + esc(fill(T('hours.ds'), { t: JB.time(JB.hm(h.ds)) })) + '</span>' + (h.note ? '<span class="sub">' + esc(T(h.note)) + '</span>' : '') + '</td></tr>';
    }).join('');
  }

  /* ---------- the order sheets: names and prices from the menu data ---------- */
  function dishHtml(it) {
    var zl = MPi18n.lang === 'zh-Hans' ? 'zh-Hans' : 'zh-Hant';
    return '<b lang="' + zl + '">' + esc(JB.name(it, zl)) + '</b><small lang="en">' + esc(it.n[2]) + '</small>';
  }
  /* rows are built once and only their words change on a language switch, so the ticks never replay */
  function sheetRows(id, ids) {
    var box = $(id); if (!box) return;
    if (!box.children.length) {
      box.innerHTML = ids.map(function (d, i) { return '<div class="srow" style="--i:' + i + '" data-id="' + d + '">' + BOX + '<span class="dish"></span><span class="tier"></span></div>'; }).join('');
    }
    [].forEach.call(box.children, function (row) {
      var it = JB.byId(row.getAttribute('data-id')); if (!it) return;
      row.querySelector('.dish').innerHTML = dishHtml(it);
      row.querySelector('.tier').textContent = JB.tier(it.t) + ' ' + JB.money(JB.tiers[it.t]);
    });
  }

  /* the cart: tick dishes into the same sheet as the menu and phone menu (jb-sheet, kept 6 hours) */
  var CART = ['s01', 's03', 's02', 's08', 'r03', 's05', 'f06', 'd01', 's13'];
  var PHOTO = { s01: ['hargow', 480, 445, 'alt.hargow'], s02: ['siumai', 480, 360, 'alt.siumai'], r03: ['rollcf', 480, 360, 'alt.rollcf'], d01: ['eggtart', 480, 360, 'alt.eggtart'] };
  var KEY = 'jb-sheet', KEEP = 6 * 3600 * 1000;
  function loadSheet() {
    var S = { items: {}, table: '', guests: 2 };
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw && raw.t && Date.now() - raw.t < KEEP) S = { items: raw.items || {}, table: raw.table || '', guests: raw.guests || 2 };
    } catch (e) {}
    return S;
  }
  function saveSheet(S) { try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), items: S.items, table: S.table, guests: S.guests })); } catch (e) {} }
  function cart() {
    var box = $('cart-cards'); if (!box) return;
    var S = loadSheet();
    box.innerHTML = CART.map(function (id) {
      var it = JB.byId(id); if (!it) return '';
      var on = (S.items[id] || 0) > 0, ph = PHOTO[id];
      var bowl = ph
        ? '<img src="assets/img/' + ph[0] + '-480.webp" srcset="assets/img/' + ph[0] + '-480.webp 480w, assets/img/' + ph[0] + '-800.webp 800w" sizes="(min-width: 861px) 270px, 170px" width="' + ph[1] + '" height="' + ph[2] + '" loading="lazy" alt="' + esc(T(ph[3])) + '">'
        : '<span class="closed" aria-hidden="true"><span>' + esc(JB.tier(it.t)) + '</span></span>';
      return '<div class="dcard" role="listitem" data-id="' + id + '" data-on="' + on + '"><div class="bowl">' + bowl + '</div>' +
        '<div class="nm">' + dishHtml(it) + '</div>' +
        '<div class="pr">' + esc(JB.tier(it.t)) + ' ' + JB.money(JB.price(it)) + '</div>' +
        '<button type="button" class="cart-tick" aria-pressed="' + on + '">' + BOX + '<span class="tl">' + esc(T(on ? 'tick.on' : 'tick.off')) + '</span><span class="sr"> ' + esc(JB.name(it)) + '</span></button></div>';
    }).join('');
    sheetSummary(S);
  }
  /* Your sheet: every dish on the sheet (from here, the menu or the phone menu), with the total */
  function sheetSummary(S) {
    var el = $('pick-total'); if (!el) return;
    var n = 0, sum = 0, names = [], early = JB.early(), zh = MPi18n.lang !== 'en';
    Object.keys(S.items).forEach(function (id) {
      var it = JB.byId(id), c = S.items[id] || 0;
      if (it && c > 0) { n += c; sum += JB.unitPrice(it, early) * c; names.push(JB.name(it) + (c > 1 ? ' ×' + c : '')); }
    });
    el.textContent = n === 0 ? T('total.none') : fill(T(n === 1 ? 'total.one' : 'total.many'), { n: n, s: JB.money(sum) });
    var list = $('pick-list'); if (list) list.textContent = n === 0 ? T('list.none') : names.join(zh ? '、' : ', ');
    var note = $('pick-early'); if (note) note.hidden = !early; /* the total uses the weekday morning price, like the menu's sheet */
  }
  var cardBox = $('cart-cards');
  if (cardBox) {
    cardBox.addEventListener('click', function (e) {
      var b = e.target.closest('.cart-tick'); if (!b) return;
      var card = b.closest('.dcard'), id = card.getAttribute('data-id'), S = loadSheet(), on = (S.items[id] || 0) > 0;
      if (on) delete S.items[id]; else S.items[id] = 1;
      saveSheet(S);
      card.setAttribute('data-on', String(!on));
      b.setAttribute('aria-pressed', String(!on));
      b.querySelector('.tl').textContent = T(!on ? 'tick.on' : 'tick.off');
      sheetSummary(S);
    });
    window.addEventListener('storage', function (e) { if (e.key === KEY) cart(); });
  }

  /* ---------- the map follows the page language ---------- */
  function mapLang() {
    var f = document.querySelector('iframe[data-map-q]'); if (!f) return;
    var hl = { en: 'en', 'zh-Hant': 'zh-TW', 'zh-Hans': 'zh-CN' }[MPi18n.lang] || 'en';
    var src = 'https://maps.google.com/maps?q=' + encodeURIComponent(f.getAttribute('data-map-q')) + '&z=15&hl=' + hl + '&output=embed';
    if (f.getAttribute('src') !== src) f.setAttribute('src', src);
  }

  function all() {
    tierKeys(); today(); hoursList(); holidays(); mapLang();
    sheetRows('hero-rows', ['s01', 's02', 'd01']);
    sheetRows('story-rows', ['s01', 's03', 's08', 'd01']);
    cart();
    var ep = $('early-price'); if (ep) ep.textContent = JB.money(JB.earlyBird);
  }
  all();
  document.addEventListener('mp:langchange', function () {
    all();
    if (window.ScrollTrigger && root.classList.contains('gsap')) ScrollTrigger.refresh(); /* text lengths changed */
  });
  setInterval(function () { today(); hoursList(); }, 60000);

  if (!document.body.classList.contains('page-home')) return;

  /* ---------- lid-lift intro: ends by itself, or on a tap, scroll or key ---------- */
  if (root.classList.contains('intro')) {
    var layer = document.querySelector('.intro-layer');
    var endIntro = function () {
      root.classList.add('intro-done');
      ['wheel', 'touchmove', 'keydown'].forEach(function (t) { window.removeEventListener(t, endIntro); });
    };
    setTimeout(endIntro, 1500);
    if (layer) layer.addEventListener('click', endIntro);
    ['wheel', 'touchmove', 'keydown'].forEach(function (t) { window.addEventListener(t, endIntro, { passive: true }); });
  }

  /* ---------- steam: pauses off screen, stands still with reduced motion, puffs for a second on hover ---------- */
  var hero = document.querySelector('.hero'), steam = document.querySelector('.steam');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var away = false;
  var setSteam = function () { if (steam && steam.pauseAnimations) { if (away || calm.matches) steam.pauseAnimations(); else steam.unpauseAnimations(); } };
  setSteam();
  if (calm.addEventListener) calm.addEventListener('change', setSteam);
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { away = !es[0].isIntersecting; hero.classList.toggle('is-away', away); setSteam(); }).observe(hero);
  }
  var plate = document.querySelector('.plate'), puffing = null;
  if (plate && steam) plate.addEventListener('pointerenter', function (e) {
    if (e.pointerType !== 'mouse' || calm.matches || puffing) return;
    steam.classList.add('is-puff');
    puffing = setTimeout(function () { steam.classList.remove('is-puff'); puffing = null; }, 1000);
  });

  /* ---------- scroll motion with GSAP ScrollTrigger (3.12.5, loaded with defer) ----------
     Without GSAP, or with reduced motion, the page stays a normal page: a plain story list,
     a cart you swipe sideways, full wait bars and a plain sign-off. */
  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var story = $('how');
    var steps = story ? [].slice.call(story.querySelectorAll('.steps li')) : [];
    gsap.matchMedia().add({ mobile: '(max-width: 900px)', motion: '(prefers-reduced-motion: no-preference)' }, function (ctx) {
      if (!ctx.conditions.motion) return;
      var mobile = ctx.conditions.mobile;
      root.classList.add('gsap'); /* before the pins are measured: switches the story and cart to their pinned layout */

      /* hero: the signboard drifts (desktop only, on phones it sits above the headline), the steamer turns, the sheet lifts away */
      var hero = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } });
      if (!mobile) hero.to('.hero .sign', { y: 140, ease: 'none' }, 0);
      hero.to('.steamer img', { rotation: 70, ease: 'none' }, 0)
        .fromTo('.hero-sheet', { y: 0, rotation: mobile ? -3 : -4 }, { y: mobile ? -40 : -90, rotation: mobile ? -6 : -12, ease: 'none' }, 0);

      /* $5.50 slides as the band passes (leftwards only, so it never runs into its heading) */
      gsap.fromTo('.band .price', { xPercent: 0 }, { xPercent: mobile ? -6 : -14, ease: 'none', scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });

      /* first visit story: nothing pins. The steps scroll normally past a sticky stage, and the scene follows the step being read */
      if (story) ScrollTrigger.create({ trigger: story.querySelector('.steps'), start: 'top 60%', end: 'bottom 50%', invalidateOnRefresh: true,
        onUpdate: function (self) {
          var p = self.progress, step = Math.min(3, Math.floor(p * 4));
          story.setAttribute('data-active', String(step));
          story.style.setProperty('--sp', (p * 4 - step).toFixed(3));
          steps.forEach(function (li, i) { li.classList.toggle('on', i === step); });
        } });

      /* weekend waits grow in; the weekend photo drifts in its frame; 翠籠軒 is stamped one character at a time */
      gsap.from('.bar i', { scaleX: 0, duration: 0.9, ease: 'power2.out', stagger: 0.12, scrollTrigger: { trigger: '.waits', start: 'top 80%' } });
      gsap.fromTo('.visit-photo img', { yPercent: 0 }, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.visit-photo', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
      gsap.from('.signoff span', { opacity: 0, scale: 1.6, rotation: -6, duration: 0.42, ease: 'back.out(2.5)', stagger: 0.16, scrollTrigger: { trigger: '.signoff', start: 'top 88%' } });

      return function () { root.classList.remove('gsap'); };
    });
    /* fonts change text heights; measure again once they are in */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }
  /* the cart is a real sideways scroller (swipe, trackpad, shift+wheel, the arrows); page scrolling never moves it. The wheels roll with it. */
  var view = $('cart-view');
  if (view) {
    var wheels = [].slice.call(view.querySelectorAll('.wheel')), arrows = [].slice.call(document.querySelectorAll('.cart-arrow'));
    var rolled = function () {
      var x = view.scrollLeft, max = view.scrollWidth - view.clientWidth;
      if (!calm.matches) wheels.forEach(function (w) { w.style.transform = 'rotate(' + (x / (Math.PI * 46) * 360).toFixed(1) + 'deg)'; });
      arrows.forEach(function (b) { b.disabled = Number(b.getAttribute('data-dir')) < 0 ? x <= 2 : x >= max - 2; });
    };
    view.addEventListener('scroll', rolled, { passive: true });
    window.addEventListener('resize', rolled);
    rolled();
    arrows.forEach(function (b) {
      b.addEventListener('click', function () { view.scrollBy({ left: Number(b.getAttribute('data-dir')) * view.clientWidth * 0.8, behavior: calm.matches ? 'auto' : 'smooth' }); });
    });
  }
  /* GSAP is deferred: it runs after this file, just before DOMContentLoaded */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMotion); else initMotion();
})();
