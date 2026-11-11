/* Loads the Chinese fonts for the current language only (EN pages need just the serif for Chinese dish names). */
(function () {
  var base = 'https://fonts.googleapis.com/css2?display=swap&family=';
  var sets = {
    en: ['Noto+Serif+HK:wght@700'],
    'zh-Hant': ['Noto+Sans+HK:wght@400;600;700', 'Noto+Serif+HK:wght@700'],
    'zh-Hans': ['Noto+Sans+SC:wght@400;600;700', 'Noto+Serif+SC:wght@700', 'Noto+Serif+HK:wght@700']
  };
  var done = {};
  function load(lang) {
    (sets[lang] || sets.en).forEach(function (f) {
      if (done[f]) return; done[f] = 1;
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = base + f;
      document.head.appendChild(l);
    });
  }
  load(window.MPi18n ? MPi18n.lang : 'en');
  document.addEventListener('mp:langchange', function (e) { load(e.detail.lang); });
})();
