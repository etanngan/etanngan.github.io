/* Stillwater: phone menu, today's hours on the appointment card (America/Toronto time, holiday-aware),
   the hours table's "today" mark, map language, and lang attributes for the other-language name. No libraries. */
(function () {
  'use strict';
  var I = window.MPi18n, doc = document;

  /* ---------- schedule (shared with book.js through window.StillwaterHours) ---------- */
  var WEEK = [null, [9, 20], [9, 20], [9, 20], [9, 20], [9, 20], [9, 16]]; // index = day of week, 0 = Sunday (closed)
  var SPECIAL = {
    '2026-12-24': [9, 14], '2026-12-25': null, '2026-12-26': null, '2026-12-31': [9, 14], '2027-01-01': null,
    '2027-02-15': null, '2027-03-26': null, '2027-05-24': null, '2027-07-01': null, '2027-08-02': null,
    '2027-09-06': null, '2027-10-11': null, '2027-12-24': [9, 14], '2027-12-25': null, '2027-12-27': null, '2027-12-28': null
  };
  function ymd(y, m, d) { return y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0'); }
  function keyOf(dt) { return ymd(dt.getFullYear(), dt.getMonth() + 1, dt.getDate()); }
  function hoursFor(dt) {
    var k = keyOf(dt);
    if (Object.prototype.hasOwnProperty.call(SPECIAL, k)) return SPECIAL[k];
    return WEEK[dt.getDay()];
  }
  // "now" as a wall-clock date in Toronto, whatever the visitor's own time zone
  function torontoNow() {
    var p = {};
    try {
      new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      return new Date(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute);
    } catch (e) { return new Date(); }
  }
  function fmtTime(h) {
    var L = I.lang;
    if (L === 'en') return (h % 12 || 12) + ':00 ' + (h < 12 ? 'am' : 'pm');
    if (L === 'zh-Hant') return (h < 12 ? '上午' : h < 18 ? '下午' : '晚上') + (h % 12 || 12) + ':00';
    return h + ':00';
  }
  function fmtRange(r) { return I.lang === 'zh-Hans' ? fmtTime(r[0]) + '–' + fmtTime(r[1]) : fmtTime(r[0]) + ' – ' + fmtTime(r[1]); }
  var DAYS = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    'zh-Hant': ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    'zh-Hans': ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  };
  var SHORT = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], 'zh-Hant': ['日', '一', '二', '三', '四', '五', '六'], 'zh-Hans': ['日', '一', '二', '三', '四', '五', '六'] };
  var RING = '<svg class="ring" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path pathLength="1" d="M14 36C9 18 46 5 78 11c19 4 22 27 2 37-22 11-66 9-72-9C4 25 24 10 47 9"/></svg>';
  // the printed Mon–Sat row with one day circled (shared with book.js)
  function dayStrip(dow, noPre) {
    var L = I.lang, h = '';
    var pre = noPre ? '' : I.t('card.days.pre');
    if (pre) h += '<li class="pre">' + pre + '</li>';
    for (var i = 1; i <= 6; i++) h += '<li' + (i === dow ? ' class="on"' : '') + '>' + SHORT[L][i] + (i === dow ? RING : '') + '</li>';
    return h;
  }
  window.StillwaterHours = { hoursFor: hoursFor, torontoNow: torontoNow, fmtTime: fmtTime, fmtRange: fmtRange, keyOf: keyOf, DAYS: DAYS, SHORT: SHORT, dayStrip: dayStrip };

  /* ---------- the card: today ---------- */
  function renderToday() {
    var now = torontoNow(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var dow = today.getDay(), r = hoursFor(today), mins = now.getHours() * 60 + now.getMinutes();
    var strip = doc.getElementById('days');
    if (strip) strip.innerHTML = dayStrip(dow);
    var sr = doc.getElementById('today-sr');
    if (sr) sr.textContent = I.t('today.sr').replace('{day}', DAYS[I.lang][dow]);
    var out = doc.getElementById('today-hours');
    if (!out) return;
    var main = r ? fmtRange(r) : I.t('today.closed');
    var next = '';
    if (!r || mins >= r[1] * 60) {
      // find the next day we open
      for (var i = 1; i <= 10; i++) {
        var d = new Date(today); d.setDate(d.getDate() + i);
        var h = hoursFor(d);
        if (h) {
          var dayName = i === 1 ? I.t('today.tomorrow') : DAYS[I.lang][d.getDay()];
          next = I.t('today.next').replace('{day}', dayName).replace('{time}', fmtTime(h[0]));
          break;
        }
      }
    }
    out.innerHTML = '';
    out.appendChild(doc.createTextNode(main));
    if (next) { var s = doc.createElement('small'); s.textContent = next; out.appendChild(s); }
  }

  /* ---------- hours table: mark today ---------- */
  function markHours() {
    var now = torontoNow(), key = keyOf(now), day = String(now.getDay()), holiday = false;
    doc.querySelectorAll('.hours tr[data-date]').forEach(function (tr) {
      var on = tr.getAttribute('data-date').split(' ').indexOf(key) > -1;
      tr.classList.toggle('is-today', on);
      if (on) holiday = true;
    });
    doc.querySelectorAll('.hours tr[data-days]').forEach(function (tr) {
      var on = !holiday && tr.getAttribute('data-days').split(',').indexOf(day) > -1;
      tr.classList.toggle('is-today', on);
    });
    doc.querySelectorAll('.hours tr th').forEach(function (th) { th.setAttribute('data-today', I.t('card.today')); });
  }

  /* ---------- the other-language name keeps the right lang attribute ---------- */
  function otherLang() {
    doc.querySelectorAll('[data-other-lang]').forEach(function (el) {
      el.setAttribute('lang', I.lang === 'en' ? 'zh-Hant-HK' : 'en');
    });
    doc.querySelectorAll('.brand-zh').forEach(function (el) { el.setAttribute('lang', I.lang === 'zh-Hans' ? 'zh-Hans' : 'zh-Hant-HK'); });
  }

  /* ---------- map in the visitor's language ---------- */
  function mapLang() {
    var f = doc.querySelector('iframe[data-map-q]'); if (!f) return;
    var hl = { en: 'en', 'zh-Hant': 'zh-TW', 'zh-Hans': 'zh-CN' }[I.lang] || 'en';
    var src = 'https://maps.google.com/maps?q=' + encodeURIComponent(f.getAttribute('data-map-q')) + '&z=15&hl=' + hl + '&output=embed';
    if (f.getAttribute('src') !== src) f.setAttribute('src', src);
  }

  /* ---------- phone menu ---------- */
  var btn = doc.querySelector('.menu-btn'), nav = doc.getElementById('nav');
  function setNav(open) {
    if (!btn) return;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    doc.body.classList.toggle('nav-open', open);
  }
  if (btn && nav) {
    btn.addEventListener('click', function () { setNav(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setNav(false); btn.focus(); }
    });
    doc.addEventListener('click', function (e) {
      if (btn.getAttribute('aria-expanded') === 'true' && !e.target.closest('.site-head')) setNav(false);
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1000) setNav(false); });
  }

  function all() { renderToday(); markHours(); otherLang(); mapLang(); }
  all();
  doc.addEventListener('mp:langchange', all);
})();
