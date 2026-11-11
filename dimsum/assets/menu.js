/* Jade Basket menu page: the printed sheet, dim sum by size then the kitchen, a type filter, the section bar and the table QR code. */
(function () {
  'use strict';
  var JB = window.JB, esc = window.JBesc, fill = window.JBfill;
  var T = function (k) { return MPi18n.t(k); };
  var $ = function (id) { return document.getElementById(id); };
  var MK = { g: '招', v: '素', p: '生', s: '辣' };
  var filter = 'all';

  function marks(it) {
    return ['g', 'v', 'p', 's'].filter(function (k) { return JB.has(it, k); }).map(function (k) {
      return '<span class="mk mk-' + k + '" role="img" aria-label="' + esc(T('mark.' + k)) + '" title="' + esc(T('mark.' + k)) + '">' + MK[k] + '</span>';
    }).join('');
  }
  function row(it, showPrice) {
    var L = MPi18n.lang, meta = [];
    if (showPrice) meta.push(it.incl ? '<span class="incl">' + esc(T('menu.incl')) + '</span>' : '<span class="row-price num">' + JB.money(JB.price(it)) + (it.unit === 'pot' ? ' <span class="muted">' + esc(T('menu.pot')) + '</span>' : '') + '</span>');
    if (it.q) meta.push('<span>' + esc(fill(T('menu.pcs'), { n: it.q })) + '</span>');
    var mk = marks(it); if (mk) meta.push(mk);
    return '<li class="row' + (JBSheet.n(it.id) ? ' has-n' : '') + '" data-id="' + it.id + '" data-c="' + it.c + '"><div class="row-main">' +
      '<span class="row-name">' + esc(JB.name(it)) + '</span>' +
      '<span class="row-alt' + (L === 'en' ? ' cn" lang="zh-Hant"' : '" lang="en"') + ' data-lang-neutral>' + esc(JB.altName(it)) + '</span>' +
      '<p class="row-desc">' + esc(JB.desc(it)) + '</p>' +
      (meta.length ? '<div class="row-meta">' + meta.join('') + '</div>' : '') + '</div>' + JBSheet.tallyHtml(it) + '</li>';
  }
  function sections() {
    var out = JB.tierOrder.map(function (k) {
      return { id: 'tier-' + k, bar: JB.tier(k) + (MPi18n.lang === 'en' ? ' ' + JB.tierEn[k] : ''), tier: k, items: JB.items.filter(function (it) { return it.t === k; }) };
    });
    JB.kitchen.forEach(function (c) {
      var cat = JB.cat(c);
      out.push({ id: 'k-' + c, bar: MPi18n.pick(cat.name), cat: cat, items: JB.items.filter(function (it) { return it.c === c; }) });
    });
    return out;
  }
  function render() {
    var root = $('sheet-root'); if (!root) return;
    var secs = sections();
    $('tierbar-list').innerHTML = secs.map(function (s) {
      return '<li><a href="#' + s.id + '" data-sec="' + s.id + '">' + (s.tier ? '<span class="cn">' + esc(JB.tier(s.tier)) + '</span>' + (MPi18n.lang === 'en' ? ' ' + esc(JB.tierEn[s.tier]) : '') : esc(s.bar)) + '</a></li>';
    }).join('');
    root.innerHTML = secs.map(function (s) {
      var head = s.tier
        ? '<h2><span class="tier-box"><span class="cn">' + esc(JB.tier(s.tier)) + '</span><span class="num">' + JB.money(JB.tiers[s.tier]) + '</span></span></h2>' + (MPi18n.lang === 'en' ? '<p>' + esc(JB.tierEn[s.tier]) + '</p>' : '')
        : '<h2>' + esc(MPi18n.pick(s.cat.name)) + '</h2><p>' + esc(MPi18n.pick(s.cat.note)) + '</p>';
      return '<section class="tsec" id="' + s.id + '" aria-label="' + esc(s.bar) + '"><div class="tsec-h">' + head + '</div>' +
        '<ul class="rows two">' + s.items.map(function (it) { return row(it, !s.tier); }).join('') + '</ul></section>';
    }).join('');
    apply();
  }
  function ok(it) {
    if (filter === 'all') return true;
    if (filter === 'v') return JB.has(it, 'v');
    return it.c === filter;
  }
  function apply() {
    var any = 0;
    document.querySelectorAll('.tsec').forEach(function (sec) {
      var shown = 0;
      sec.querySelectorAll('.row').forEach(function (li) { var on = ok(JB.byId(li.getAttribute('data-id'))); li.hidden = !on; if (on) shown++; });
      sec.hidden = !shown; any += shown;
      var a = document.querySelector('#tierbar-list a[data-sec="' + sec.id + '"]');
      if (a) a.parentNode.hidden = !shown;
      /* keep the two-column ruling right when rows are hidden */
      var vis = [].filter.call(sec.querySelectorAll('.row'), function (li) { return !li.hidden; });
      vis.forEach(function (li, i) { li.style.borderRight = ''; li.classList.toggle('odd', i % 2 === 0); });
    });
    $('menu-empty').hidden = any > 0;
    spy();
  }

  var lock = 0;
  function activate(id) {
    document.querySelectorAll('#tierbar-list a').forEach(function (a) {
      var on = a.getAttribute('data-sec') === id;
      a.classList.toggle('is-active', on);
      if (on) { a.setAttribute('aria-current', 'true'); var ul = a.closest('ul'); ul.scrollLeft = a.offsetLeft - ul.clientWidth / 2 + a.offsetWidth / 2; }
      else a.removeAttribute('aria-current');
    });
  }
  function spy() {
    if (Date.now() < lock) return;
    var secs = document.querySelectorAll('.tsec:not([hidden])'), cur = secs[0];
    for (var i = 0; i < secs.length; i++) if (secs[i].getBoundingClientRect().top <= 150) cur = secs[i];
    if (cur) { var s = cur; activate(s.id); }
  }
  var spyQ = 0;
  window.addEventListener('scroll', function () { if (spyQ) return; spyQ = requestAnimationFrame(function () { spyQ = 0; spy(); }); }, { passive: true });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('#tierbar-list a');
    if (a) { lock = Date.now() + 900; activate(a.getAttribute('data-sec')); }
    var f = e.target.closest('[data-filter]');
    if (f) {
      filter = f.getAttribute('data-filter');
      document.querySelectorAll('[data-filter]').forEach(function (b) { b.setAttribute('aria-pressed', b === f ? 'true' : 'false'); });
      apply();
    }
  });

  /* ---------- the QR code printed on every table ---------- */
  function qr() {
    var box = $('qr-code');
    if (!box || typeof window.qrcode !== 'function') return;
    var url = new URL('qr.html', location.href); url.hash = ''; url.search = '';
    var href = url.href, q = qrcode(0, 'M');
    q.addData(href); q.make();
    var nn = q.getModuleCount(), pad = 2, scale = 6, cv = document.createElement('canvas');
    cv.width = cv.height = (nn + pad * 2) * scale;
    var g = cv.getContext('2d');
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = '#0B5A43';
    for (var r = 0; r < nn; r++) for (var c = 0; c < nn; c++) if (q.isDark(r, c)) g.fillRect((c + pad) * scale, (r + pad) * scale, scale, scale);
    cv.setAttribute('role', 'img');
    cv.setAttribute('data-i18n-attr', 'aria-label:qrb.alt');
    cv.setAttribute('aria-label', T('qrb.alt'));
    cv.setAttribute('data-url', href);
    box.innerHTML = ''; box.appendChild(cv);
    var u = $('qr-url'); if (u) u.textContent = href.replace(/^https?:\/\//, '');
  }

  qr();
  render();
  document.addEventListener('mp:langchange', render);
})();
