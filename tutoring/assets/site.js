/* Maple Bridge: phone menu, today's hours in Toronto time, today's row in the hours table, map language,
   and the phone action bar. No libraries. */
(function () {
  'use strict';
  var I = window.MPi18n;
  if (!I) return;
  var html = document.documentElement;

  /* ---------- phone menu ---------- */
  var burger = document.querySelector('.burger'), nav = document.getElementById('nav');
  function setNav(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('data-i18n-attr', 'aria-label:' + (open ? 'nav.close' : 'nav.open'));
    burger.setAttribute('aria-label', I.t(open ? 'nav.close' : 'nav.open'));
    document.body.classList.toggle('nav-open', open);
  }
  if (burger && nav) {
    burger.addEventListener('click', function () { setNav(burger.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setNav(false); burger.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (burger.getAttribute('aria-expanded') === 'true' && !e.target.closest('.site-head')) setNav(false);
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1100) setNav(false); });
  }

  /* ---------- opening hours, always in Toronto time ---------- */
  var HOURS = { 0: null, 1: [930, 1230], 2: [930, 1230], 3: [930, 1230], 4: [930, 1230], 5: [930, 1230], 6: [540, 930] };
  var CLOSED = [['2026-12-24', '2027-01-03', 'why.winter'], ['2027-02-15', '2027-02-15', 'why.family'], ['2027-03-26', '2027-03-26', 'why.good']];
  var CAMP = ['2027-03-15', '2027-03-19', [540, 960]];

  function toronto() {
    var o = {};
    try {
      new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    } catch (e) {
      var n = new Date(); o = { year: n.getFullYear(), month: n.getMonth() + 1, day: n.getDate(), hour: n.getHours(), minute: n.getMinutes() };
    }
    return { date: Date.UTC(+o.year, +o.month - 1, +o.day), mins: (+o.hour % 24) * 60 + (+o.minute) };
  }
  function iso(t) { return new Date(t).toISOString().slice(0, 10); }
  function dayInfo(t) {
    var s = iso(t), dow = new Date(t).getUTCDay(), i;
    for (i = 0; i < CLOSED.length; i++) if (s >= CLOSED[i][0] && s <= CLOSED[i][1]) return { closed: true, why: CLOSED[i][2], dow: dow };
    if (s >= CAMP[0] && s <= CAMP[1]) return { span: CAMP[2], camp: true, dow: dow };
    return HOURS[dow] ? { span: HOURS[dow], dow: dow } : { closed: true, dow: dow };
  }
  function clock(m, lang) {
    var h = Math.floor(m / 60), mm = ('0' + (m % 60)).slice(-2);
    if (lang === 'zh-Hans') return h + ':' + mm;
    var h12 = h > 12 ? h - 12 : h;
    if (lang === 'zh-Hant') return (h < 12 ? '上午' : (h < 18 ? '下午' : '晚上')) + h12 + ':' + mm;
    return h12 + ':' + mm + ' ' + (h < 12 ? 'am' : 'pm');
  }
  function range(span, lang) {
    if (lang === 'zh-Hans') return clock(span[0], lang) + '–' + clock(span[1], lang);
    if (lang === 'en' && (span[0] < 720) === (span[1] < 720)) return clock(span[0], lang).replace(/ [ap]m$/, '') + ' – ' + clock(span[1], lang);
    return clock(span[0], lang) + ' – ' + clock(span[1], lang);
  }
  var DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  function when(t, diff, lang) {
    if (diff === 1) return I.t('today.tomorrow');
    var dow = new Date(t).getUTCDay();
    if (diff < 7) return I.t('day.' + DAYS[dow]);
    var d = new Date(t), mo = d.getUTCMonth(), da = d.getUTCDate();
    if (lang === 'en') return I.t('day.' + DAYS[dow]) + ', ' + ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][mo] + ' ' + da + ',';
    return (mo + 1) + '月' + da + '日（' + I.t('day.' + DAYS[dow]) + '）';
  }
  function fill(key, vars) { var s = I.t(key); for (var k in vars) s = s.split('{' + k + '}').join(vars[k]); return s; }
  function nextOpen(t0) {
    for (var i = 1; i < 30; i++) { var t = t0 + i * 864e5, d = dayInfo(t); if (!d.closed) return { t: t, diff: i, d: d }; }
    return null;
  }
  function todayLine() {
    var el = document.getElementById('today');
    if (!el) return;
    var lang = I.lang, now = toronto(), d = dayInfo(now.date), out, nx;
    if (d.closed || now.mins >= d.span[1]) {
      nx = nextOpen(now.date);
      var vars = nx ? { when: when(nx.t, nx.diff, lang), t: range(nx.d.span, lang), why: d.why ? I.t(d.why) : '' } : {};
      out = fill(d.closed ? (d.why ? 'today.holiday' : 'today.closed') : 'today.after', vars);
    } else if (d.camp) out = fill('today.camp', { t: range(d.span, lang) });
    else if (now.mins >= d.span[0]) out = fill('today.now', { end: clock(d.span[1], lang) });
    else out = fill('today.before', { t: range(d.span, lang) });
    el.removeAttribute('data-i18n');
    el.innerHTML = out.replace('） ', '）');
  }
  function todayRow() {
    var dow = String(new Date(toronto().date).getUTCDay());
    document.querySelectorAll('.hours tr[data-days]').forEach(function (tr) {
      tr.classList.toggle('is-today', tr.getAttribute('data-days').split(',').indexOf(dow) > -1);
    });
  }

  /* ---------- map follows the page language ---------- */
  function mapLang() {
    var f = document.querySelector('iframe[data-map-q]'); if (!f) return;
    var hl = { en: 'en', 'zh-Hant': 'zh-TW', 'zh-Hans': 'zh-CN' }[I.lang] || 'en';
    var src = 'https://maps.google.com/maps?q=' + encodeURIComponent(f.getAttribute('data-map-q')) + '&z=15&hl=' + hl + '&output=embed';
    if (f.getAttribute('src') !== src) f.setAttribute('src', src);
  }

  /* ---------- phone action bar: shows once the hero button has scrolled away ---------- */
  var dock = document.getElementById('dock');
  if (dock && 'IntersectionObserver' in window) {
    var seen = [], heroCta = document.getElementById('hero-cta');
    var watch = Array.prototype.slice.call(document.querySelectorAll('main .btn-main')).concat([document.querySelector('.site-foot')]).filter(Boolean);
    var update = function () {
      var past = heroCta && heroCta.getBoundingClientRect().bottom < 0;
      var show = past && !watch.some(function (w, i) { return seen[i]; });
      dock.hidden = !show;
      document.body.classList.toggle('has-dock', show);
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen[watch.indexOf(en.target)] = en.isIntersecting; });
      update();
    });
    watch.forEach(function (w) { io.observe(w); });
    window.addEventListener('scroll', update, { passive: true });
  }

  function onLang() { todayLine(); mapLang(); }
  todayRow();
  document.addEventListener('mp:langchange', onLang);
  if (html.classList.contains('i18n-ready')) onLang();
})();
