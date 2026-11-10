/* Stillwater: header menu on phones, today's hours (holiday-aware) in the top bar, map language. No animation library. */
(function () {
  'use strict';
  var I = window.MPi18n;
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
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1020) setNav(false); });
  }

  function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function today() {
    var now = new Date(), key = ymd(now), day = String(now.getDay());
    var holiday = null;
    document.querySelectorAll('tr[data-date]').forEach(function (tr) {
      var on = tr.getAttribute('data-date').split(' ').indexOf(key) > -1;
      tr.classList.toggle('is-today', on);
      if (on) holiday = tr;
    });
    var row = holiday;
    document.querySelectorAll('.hours tr[data-days]').forEach(function (tr) {
      var on = tr.getAttribute('data-days').split(',').indexOf(day) > -1;
      tr.classList.toggle('is-today', on && !holiday);
      if (on && !row) row = tr;
    });
    var box = document.getElementById('tb-today');
    if (!box) return;
    // pages without an hours table use the same schedule from here
    var HOL = { '2026-12-24': 'hol.short', '2026-12-25': 'h.closed', '2026-12-26': 'h.closed', '2026-12-31': 'hol.short', '2027-01-01': 'h.closed', '2027-02-15': 'h.closed', '2027-03-26': 'h.closed' };
    var WEEK = ['h.closed', 'h.weekdays', 'h.weekdays', 'h.weekdays', 'h.weekdays', 'h.weekdays', 'h.sat'];
    document.getElementById('tb-hours').textContent = row ? row.querySelector('td').textContent : I.t(HOL[key] || WEEK[now.getDay()]);
    box.hidden = false;
  }
  function mapLang() {
    var f = document.querySelector('iframe[data-map-q]'); if (!f) return;
    var hl = { en: 'en', 'zh-Hant': 'zh-TW', 'zh-Hans': 'zh-CN' }[I.lang] || 'en';
    var src = 'https://maps.google.com/maps?q=' + encodeURIComponent(f.getAttribute('data-map-q')) + '&z=15&hl=' + hl + '&output=embed';
    if (f.getAttribute('src') !== src) f.setAttribute('src', src);
  }
  function all() { today(); mapLang(); }
  all();
  document.addEventListener('mp:langchange', all);
})();
