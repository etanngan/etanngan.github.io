/*!
 * Markham Portfolio — shared trilingual engine (EN / 繁體 / 简体)
 *
 * Load synchronously in <head> so <html lang> is set before first paint:
 *   <script src="../shared/i18n.js"></script>
 *
 * Then register the page/site dictionary (any time, before or after DOM ready):
 *   MPi18n.init({
 *     "nav.menu": { en: "Menu", "zh-Hant": "點心紙", "zh-Hans": "菜单" },
 *     ...
 *   });
 *
 * Markup hooks
 *   data-i18n="key"                  -> textContent
 *   data-i18n-html="key"             -> innerHTML (trusted, author-written strings only)
 *   data-i18n-attr="placeholder:key; aria-label:key2"
 *   data-set-lang="en|zh-Hant|zh-Hans" on any button -> switches language, gets aria-pressed
 *
 * JS hooks
 *   MPi18n.lang            current language code
 *   MPi18n.t(key, fallback) translate
 *   MPi18n.pick({en, "zh-Hant", "zh-Hans"}) choose from an inline trio (handy for data-driven lists)
 *   MPi18n.set(lang)       switch + persist
 *   document "mp:langchange" event (detail.lang) -> re-render JS-built content
 *
 * The choice is stored in localStorage under "mp-lang" and is shared by every
 * site in the portfolio. ?lang=zh-Hant in the URL overrides (and is remembered).
 */
(function () {
  'use strict';
  var KEY = 'mp-lang';
  var LANGS = ['en', 'zh-Hant', 'zh-Hans'];
  var dict = {};
  var ready = false;

  function norm(v) {
    if (!v) return null;
    v = String(v).toLowerCase();
    if (v === 'en' || v.indexOf('en-') === 0) return 'en';
    if (v === 'zh-hant' || v === 'tc' || v === 'zh-tw' || v === 'zh-hk' || v === 'zh-mo') return 'zh-Hant';
    if (v === 'zh-hans' || v === 'sc' || v === 'zh-cn' || v === 'zh-sg' || v === 'zh') return 'zh-Hans';
    if (v.indexOf('zh-hant') === 0) return 'zh-Hant';
    if (v.indexOf('zh-hans') === 0) return 'zh-Hans';
    return null;
  }

  function stored() {
    try { return norm(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function persist(l) {
    try { localStorage.setItem(KEY, l); } catch (e) { /* private mode: still works for this page */ }
  }
  function fromUrl() {
    try { return norm(new URLSearchParams(location.search).get('lang')); } catch (e) { return null; }
  }
  function fromBrowser() {
    var list = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      var n = norm(list[i]);
      if (n) return n;
    }
    return 'en';
  }

  var urlLang = fromUrl();
  var lang = urlLang || stored() || fromBrowser() || 'en';
  if (urlLang) persist(urlLang);
  document.documentElement.lang = lang;
  document.documentElement.setAttribute('data-lang', lang);

  function t(key, fallback) {
    var e = dict[key];
    if (!e) return fallback !== undefined ? fallback : key;
    var v = e[lang];
    if (v === undefined || v === null) v = e.en;
    return v === undefined ? (fallback !== undefined ? fallback : key) : v;
  }

  function pick(trio) {
    if (trio === null || trio === undefined) return '';
    if (typeof trio === 'string') return trio;
    var v = trio[lang];
    return v === undefined || v === null ? (trio.en || '') : v;
  }

  function apply(root) {
    root = root || document;
    var i, els, el, k;
    els = root.querySelectorAll('[data-i18n]');
    for (i = 0; i < els.length; i++) {
      el = els[i]; k = el.getAttribute('data-i18n');
      if (dict[k]) el.textContent = t(k);
    }
    els = root.querySelectorAll('[data-i18n-html]');
    for (i = 0; i < els.length; i++) {
      el = els[i]; k = el.getAttribute('data-i18n-html');
      if (dict[k]) el.innerHTML = t(k);
    }
    els = root.querySelectorAll('[data-i18n-attr]');
    for (i = 0; i < els.length; i++) {
      el = els[i];
      var pairs = el.getAttribute('data-i18n-attr').split(';');
      for (var j = 0; j < pairs.length; j++) {
        var p = pairs[j].split(':');
        if (p.length < 2) continue;
        var attr = p[0].trim(), key = p.slice(1).join(':').trim();
        if (attr && dict[key]) el.setAttribute(attr, t(key));
      }
    }
    els = root.querySelectorAll('[data-set-lang]');
    for (i = 0; i < els.length; i++) {
      el = els[i];
      var on = norm(el.getAttribute('data-set-lang')) === lang;
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
      el.classList.toggle('is-active', on);
    }
  }

  function set(next, opts) {
    next = norm(next) || 'en';
    var changed = next !== lang;
    lang = next;
    api.lang = lang;
    persist(lang);
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    if (ready) apply(document);
    if (changed || (opts && opts.force)) {
      document.dispatchEvent(new CustomEvent('mp:langchange', { detail: { lang: lang } }));
    }
  }

  function onReady() {
    ready = true;
    apply(document);
    document.addEventListener('click', function (ev) {
      var btn = ev.target.closest && ev.target.closest('[data-set-lang]');
      if (!btn) return;
      ev.preventDefault();
      set(btn.getAttribute('data-set-lang'));
    });
    document.documentElement.classList.add('i18n-ready');
    document.dispatchEvent(new CustomEvent('mp:langchange', { detail: { lang: lang, initial: true } }));
  }

  function init(d) {
    if (d) for (var k in d) if (Object.prototype.hasOwnProperty.call(d, k)) dict[k] = d[k];
    if (ready) apply(document);
  }

  var api = { lang: lang, langs: LANGS.slice(), t: t, pick: pick, set: set, init: init, apply: apply, dict: dict };
  window.MPi18n = api;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();

  // Keep tabs in sync if the visitor switches language in another tab.
  window.addEventListener('storage', function (e) {
    if (e.key === KEY && norm(e.newValue) && norm(e.newValue) !== lang) set(e.newValue);
  });
})();
