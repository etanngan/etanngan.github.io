/* Jade Basket: header menu, phone bar, today (Toronto time), hours and holiday grids, tier key, favourites, map language. */
(function () {
  'use strict';
  var JB = window.JB;
  var T = function (k) { return MPi18n.t(k); };
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fill(s, o) { return s.replace(/\{(\w+)\}/g, function (m, k) { return o[k] !== undefined ? o[k] : m; }); }
  window.JBesc = esc; window.JBfill = fill;
  var TICK = '<svg class="tick" viewBox="0 0 22 18" aria-hidden="true" focusable="false"><path d="M2.5 9.5l5.5 5.5L19.5 2.5"/></svg>';

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
    window.addEventListener('resize', function () { if (window.innerWidth > 1080) setNav(false); });
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

  /* ---------- tier key (小點 $5.50 …) ---------- */
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

  /* ---------- today, in Toronto time ---------- */
  function today() {
    var box = $('today'); if (!box) return;
    var st = JB.status(), L = MPi18n.lang, d = st.today;
    var hours = d.closed ? T('st.closed') : JB.range(d.o, d.c);
    var now;
    if (st.s === 'dimsum') now = fill(T('now.dimsum'), { t: JB.time(d.ds) });
    else if (st.s === 'between') now = fill(T('now.between'), { d: JB.time(JB.hm(JB.dinner)) });
    else if (st.s === 'dinner') now = fill(T('now.dinner'), { t: JB.time(d.c) });
    else if (st.s === 'before') now = fill(T('now.before'), { o: JB.time(d.o) });
    else if (st.s === 'closed') now = fill(T('now.closed'), { o: JB.time(st.tomorrow.o) });
    else now = fill(T('now.after'), { o: JB.time(st.tomorrow.o) });
    var hol = d.hol ? '<span class="t-hol">' + esc(fill(T('today.hol'), { name: T(d.hol.name) })) + '</span>' : '';
    $('t-hours').innerHTML = '<b>' + esc(T(st.open ? 'st.open' : 'st.closed')) + '</b> <span class="nw">' + esc(hours) + '</span>' + hol;
    $('t-now').textContent = now;
    var chop = $('chop');
    if (chop) {
      chop.hidden = !st.open;
      chop.innerHTML = '<span>' + (L === 'zh-Hans' ? '营业中' : '營業中') + '</span>';
    }
  }

  /* ---------- hours grid ---------- */
  function hoursGrid() {
    var tb = $('hours-body'); if (!tb) return;
    var clk = JB.clock(), hol = JB.holiday(clk.ymd);
    tb.innerHTML = JB.weekRows.map(function (r) {
      var w = JB.week[r.days[0]], on = !hol && r.days.indexOf(clk.dow) > -1;
      return '<tr' + (on ? ' class="is-today"' : '') + '><th scope="row">' + esc(T(r.label)) + (on ? '<span class="sub today-tag">' + TICK + esc(T('hours.today')) + '</span>' : '') + '</th>' +
        '<td><span class="nw">' + esc(JB.range(JB.hm(w.o), JB.hm(w.c))) + '</span><span class="sub">' + esc(fill(T('hours.ds'), { t: JB.time(JB.hm(w.ds)) })) + '</span></td></tr>';
    }).join('');
  }

  /* ---------- holiday grid: upcoming days only ---------- */
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

  /* ---------- favourites: names and prices from the menu data ---------- */
  function favs() {
    document.querySelectorAll('.fav-list li[data-dish]').forEach(function (li) {
      var it = JB.byId(li.getAttribute('data-dish')); if (!it) return;
      var L = MPi18n.lang;
      li.querySelector('.fav-text').innerHTML =
        '<h3>' + esc(JB.name(it)) + '</h3>' +
        '<span class="alt' + (L === 'en' ? ' cn" lang="zh-Hant"' : '" lang="en"') + ' data-lang-neutral>' + esc(JB.altName(it)) + '</span>' +
        '<span class="tier-box"><span class="cn">' + esc(JB.tier(it.t)) + '</span><span class="num">' + JB.money(JB.price(it)) + '</span></span>' +
        (it.q ? ' <span class="muted">' + esc(fill(T('menu.pcs'), { n: it.q })) + '</span>' : '');
    });
  }

  /* ---------- the map follows the page language ---------- */
  function mapLang() {
    var f = document.querySelector('iframe[data-map-q]'); if (!f) return;
    var hl = { en: 'en', 'zh-Hant': 'zh-TW', 'zh-Hans': 'zh-CN' }[MPi18n.lang] || 'en';
    var src = 'https://maps.google.com/maps?q=' + encodeURIComponent(f.getAttribute('data-map-q')) + '&z=15&hl=' + hl + '&output=embed';
    if (f.getAttribute('src') !== src) f.setAttribute('src', src);
  }

  function all() { tierKeys(); today(); hoursGrid(); holidays(); favs(); mapLang(); }
  all();
  document.addEventListener('mp:langchange', all);
  setInterval(function () { today(); hoursGrid(); }, 60000);
})();
