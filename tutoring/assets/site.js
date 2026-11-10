/* Maple Bridge: header menu on phones, today's row in the hours table, map language. No animation library. */
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

  var day = String(new Date().getDay());
  document.querySelectorAll('.hours tr[data-days]').forEach(function (tr) {
    tr.classList.toggle('is-today', tr.getAttribute('data-days').split(',').indexOf(day) > -1);
  });

  function mapLang() {
    var f = document.querySelector('iframe[data-map-q]'); if (!f) return;
    var hl = { en: 'en', 'zh-Hant': 'zh-TW', 'zh-Hans': 'zh-CN' }[I.lang] || 'en';
    var src = 'https://maps.google.com/maps?q=' + encodeURIComponent(f.getAttribute('data-map-q')) + '&z=15&hl=' + hl + '&output=embed';
    if (f.getAttribute('src') !== src) f.setAttribute('src', src);
  }
  mapLang();
  document.addEventListener('mp:langchange', mapLang);
})();
