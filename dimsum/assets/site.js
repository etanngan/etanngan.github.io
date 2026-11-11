/* Jade Basket: header menu, phone bar, today (Toronto time), hours and holiday lists, tier key, map language,
   and on the home page: the order sheets (hero, story, tappable), the lid-lift intro and the scroll-linked motion. */
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
  var calm = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

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

  /* the tappable sheet writes into the same sheet as the menu and phone menu (jb-sheet, kept 6 hours) */
  var PICKS = ['s01', 's02', 's03', 's05', 's08', 'f06', 's13', 'd01'];
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
  function picks() {
    var box = $('picks'); if (!box) return;
    var S = loadSheet();
    box.innerHTML = PICKS.map(function (id) {
      var it = JB.byId(id); if (!it) return '';
      return '<button type="button" class="pick" data-id="' + id + '" aria-pressed="' + ((S.items[id] || 0) > 0) + '">' + BOX +
        '<span class="dish">' + dishHtml(it) + '</span><span class="tier">' + esc(JB.tier(it.t)) + '</span>' +
        '<span class="price-s">' + JB.money(JB.price(it)) + '</span></button>';
    }).join('');
    pickTotal(S);
  }
  function pickTotal(S) {
    var el = $('pick-total'); if (!el) return;
    var n = 0, sum = 0, early = JB.early();
    Object.keys(S.items).forEach(function (id) { var it = JB.byId(id), c = S.items[id] || 0; if (it && c > 0) { n += c; sum += JB.unitPrice(it, early) * c; } });
    el.textContent = n === 0 ? T('total.none') : fill(T(n === 1 ? 'total.one' : 'total.many'), { n: n, s: JB.money(sum) });
    var note = $('pick-early'); if (note) note.hidden = !early; /* the total uses the weekday morning price, like the menu's sheet */
  }
  var pickBox = $('picks');
  if (pickBox) {
    pickBox.addEventListener('click', function (e) {
      var b = e.target.closest('.pick'); if (!b) return;
      var S = loadSheet(), id = b.getAttribute('data-id'), on = (S.items[id] || 0) > 0;
      if (on) delete S.items[id]; else S.items[id] = 1;
      saveSheet(S);
      b.setAttribute('aria-pressed', String(!on));
      pickTotal(S);
    });
    window.addEventListener('storage', function (e) { if (e.key === KEY) picks(); });
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
    picks();
    var ep = $('early-price'); if (ep) ep.textContent = JB.money(JB.earlyBird);
  }
  all();
  document.addEventListener('mp:langchange', all);
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

  /* ---------- steam pauses when the hero is off screen ---------- */
  var hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { hero.classList.toggle('is-away', !es[0].isIntersecting); }).observe(hero);
  }

  /* ---------- scroll-linked motion: each [data-scroll] gets --p from 0 to 1; transforms only ---------- */
  var els = [].slice.call(document.querySelectorAll('[data-scroll]'));
  var story = document.querySelector('[data-scroll="story"]');
  var steps = story ? [].slice.call(story.querySelectorAll('.steps li')) : [];
  var ticking = false;
  function clamp(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function update() {
    ticking = false;
    if (calm.matches) return;
    var vh = window.innerHeight;
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;
      var mode = el.getAttribute('data-scroll'), p;
      if (mode === 'hero') p = clamp(-r.top / r.height);
      else if (mode === 'story') {
        p = clamp(-r.top / Math.max(1, r.height - vh));
        var step = Math.min(3, Math.floor(p * 4));
        el.setAttribute('data-active', String(step));
        el.style.setProperty('--sp', (p * 4 - step).toFixed(3));
        steps.forEach(function (li, i) { li.classList.toggle('on', i === step); });
      } else p = clamp((vh - r.top) / (vh + r.height));
      el.style.setProperty('--p', p.toFixed(3));
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  function resetMotion() {
    if (!calm.matches) { update(); return; }
    els.forEach(function (el) { el.style.removeProperty('--p'); el.style.removeProperty('--sp'); });
    steps.forEach(function (li) { li.classList.add('on'); });
  }
  if (calm.addEventListener) calm.addEventListener('change', resetMotion);
  resetMotion();

  /* ---------- footer sign-off: 翠籠軒 is stamped once when it comes into view ---------- */
  var so = $('signoff');
  if (so) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es, obs) { es.forEach(function (e) { if (e.isIntersecting) { so.classList.add('on'); obs.disconnect(); } }); }, { threshold: 0.4 }).observe(so);
    } else so.classList.add('on');
  }
})();
