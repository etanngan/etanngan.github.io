/* Jade Basket phone menu (the QR code on every table): search, filters, section tabs, and the diner's own sheet (sheet.js). */
(function () {
  'use strict';
  var JB = window.JB, esc = window.JBesc, fill = window.JBfill;
  var T = function (k) { return MPi18n.t(k); };
  var $ = function (id) { return document.getElementById(id); };
  var MK = { g: '招', v: '素', p: '生', s: '辣' };
  var state = { q: '', f: 'all' };

  function norm(s) { return String(s || '').toLowerCase().replace(/[\s\-'’·&,.()（）、，。]/g, ''); }
  function chip(it) {
    if (it.incl) return '<span class="incl">' + esc(T('menu.incl')) + '</span>';
    if (it.t) return '<span class="tier-box"><span class="cn">' + esc(JB.tier(it.t)) + '</span><span class="num">' + JB.money(JB.tiers[it.t]) + '</span></span>';
    return '<span class="row-price num">' + JB.money(it.p) + (it.unit === 'pot' ? ' <span class="muted">' + esc(T('menu.pot')) + '</span>' : '') + '</span>';
  }
  function row(it) {
    var L = MPi18n.lang;
    var mk = ['g', 'v', 'p', 's'].filter(function (k) { return JB.has(it, k); }).map(function (k) {
      return '<span class="mk mk-' + k + '" role="img" aria-label="' + esc(T('mark.' + k)) + '" title="' + esc(T('mark.' + k)) + '">' + MK[k] + '</span>';
    }).join('');
    return '<li class="row' + (JBSheet.n(it.id) ? ' has-n' : '') + '" data-id="' + it.id + '"><div class="row-main">' +
      '<span class="row-name">' + esc(JB.name(it)) + '</span>' +
      '<span class="row-alt' + (L === 'en' ? ' cn" lang="zh-Hant"' : '" lang="en"') + ' data-lang-neutral>' + esc(JB.altName(it)) + '</span>' +
      '<p class="row-desc">' + esc(JB.desc(it)) + '</p>' +
      '<div class="row-meta">' + chip(it) + (it.q ? '<span>' + esc(fill(T('menu.pcs'), { n: it.q })) + '</span>' : '') + mk + '</div></div>' +
      JBSheet.tallyHtml(it) + '</li>';
  }
  function render() {
    $('tabs').innerHTML = JB.cats.map(function (c) { return '<li><a href="#c-' + c.id + '" data-cat="' + c.id + '">' + esc(MPi18n.pick(c.name)) + '</a></li>'; }).join('');
    $('cats').innerHTML = JB.cats.map(function (c) {
      return '<section class="qcat" id="c-' + c.id + '" aria-labelledby="ch-' + c.id + '"><div class="qcat-h"><h2 id="ch-' + c.id + '">' + esc(MPi18n.pick(c.name)) + '</h2>' +
        '<p class="qcat-note">' + esc(MPi18n.pick(c.note)) + '</p></div><ul class="rows">' +
        JB.items.filter(function (it) { return it.c === c.id; }).map(row).join('') + '</ul></section>';
    }).join('');
    apply();
  }
  function matches(it) {
    if (state.f !== 'all' && !JB.has(it, state.f)) return false;
    if (!state.q) return true;
    var hay = norm(it.n.join('|') + '|' + it.d.join('|') + (it.t ? '|' + JB.tierName[it.t]['zh-Hant'] + JB.tierName[it.t]['zh-Hans'] + JB.tierEn[it.t] : ''));
    return hay.indexOf(norm(state.q)) > -1;
  }
  function apply() {
    var total = 0;
    document.querySelectorAll('.qcat').forEach(function (sec) {
      var any = 0;
      sec.querySelectorAll('.row').forEach(function (li) { var on = matches(JB.byId(li.getAttribute('data-id'))); li.hidden = !on; if (on) any++; });
      sec.hidden = !any; total += any;
      var tab = document.querySelector('#tabs a[data-cat="' + sec.id.slice(2) + '"]');
      if (tab) tab.parentNode.hidden = !any;
    });
    $('empty').hidden = total > 0;
    $('count').textContent = fill(T('qr.count'), { n: total });
    spy();
  }

  var lock = 0;
  function activate(id) {
    document.querySelectorAll('#tabs a').forEach(function (a) {
      var on = a.getAttribute('data-cat') === id;
      a.classList.toggle('is-active', on);
      if (on) { a.setAttribute('aria-current', 'true'); var ul = $('tabs'); ul.scrollLeft = a.offsetLeft - ul.clientWidth / 2 + a.offsetWidth / 2; }
      else a.removeAttribute('aria-current');
    });
  }
  function spy() {
    if (Date.now() < lock) return;
    var secs = document.querySelectorAll('.qcat:not([hidden])'), cur = secs[0];
    for (var i = 0; i < secs.length; i++) if (secs[i].getBoundingClientRect().top <= 70) cur = secs[i];
    if (cur) { var s = cur; activate(s.id.slice(2)); }
  }
  var spyQ = 0;
  window.addEventListener('scroll', function () { if (spyQ) return; spyQ = requestAnimationFrame(function () { spyQ = 0; spy(); }); }, { passive: true });


  document.addEventListener('click', function (e) {
    var tab = e.target.closest('#tabs a');
    if (tab) {
      e.preventDefault();
      lock = Date.now() + 800;
      activate(tab.getAttribute('data-cat'));
      var sec = $('c-' + tab.getAttribute('data-cat'));
      if (sec) { window.scrollTo(0, sec.getBoundingClientRect().top + window.scrollY - 50); sec.setAttribute('tabindex', '-1'); sec.focus({ preventScroll: true }); }
      return;
    }
    var f = e.target.closest('[data-filter]');
    if (f) {
      state.f = f.getAttribute('data-filter');
      document.querySelectorAll('[data-filter]').forEach(function (b) { b.setAttribute('aria-pressed', b === f ? 'true' : 'false'); });
      apply();
    }
  });
  var q = $('q'), clr = $('clear');
  q.addEventListener('input', function () { state.q = q.value.trim(); clr.hidden = !q.value; apply(); });
  clr.addEventListener('click', function () { q.value = ''; state.q = ''; clr.hidden = true; apply(); q.focus(); });

  function tiers() {
    var el = $('qr-early'); if (el) el.hidden = !JB.early();
  }
  render(); tiers();
  document.addEventListener('mp:langchange', function () { render(); });
})();
