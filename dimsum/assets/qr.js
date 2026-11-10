/* Jade Basket — phone table menu: tabs + scroll-spy, search, filter, picks tally (sessionStorage only; nothing is sent). */
(function () {
  'use strict';
  var JB = window.JB, T = function (k) { return MPi18n.t(k); };
  var $ = function (id) { return document.getElementById(id); };
  var KEY = 'jb-picks';
  var picks = {};
  try { picks = JSON.parse(sessionStorage.getItem(KEY) || '{}') || {}; } catch (e) { picks = {}; }
  var state = { q: '', f: 'all' };
  var CHAR = { g: '招', v: '素', p: '生', s: '辣' };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(s) { return String(s || '').toLowerCase().replace(/[\s\-'’·&]/g, ''); }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(picks)); } catch (e) {} }
  function tierChip(it) {
    if (it.incl) return '<span class="chip incl">' + esc(T('menu.incl')) + '</span>';
    if (it.t) return '<span class="chip"><i aria-hidden="true">' + esc(MPi18n.pick(JB.tierChar[it.t])) + '</i>' + JB.money(JB.tiers[it.t]) + '</span>';
    return '<span class="chip plain">' + JB.money(it.p) + (it.unit === 'pot' ? ' / ' + esc(T('menu.pot')) : '') + '</span>';
  }
  function qtyHtml(it) {
    var n = picks[it.id] || 0, nm = esc(JB.name(it));
    if (!n) return '<button type="button" class="add" data-add="' + it.id + '" aria-label="' + esc(T('picks.add').replace('{name}', JB.name(it))) + '">+</button>';
    return '<div class="stepper"><button type="button" data-add="' + it.id + '" aria-label="' + esc(T('picks.more').replace('{name}', JB.name(it))) + '">+</button>' +
      '<output aria-live="polite">' + n + '</output>' +
      '<button type="button" data-sub="' + it.id + '" aria-label="' + esc(T('picks.less').replace('{name}', JB.name(it))) + '">−</button></div>';
  }

  function render() {
    var L = MPi18n.lang;
    $('tabs').innerHTML = JB.cats.map(function (c) {
      var zh = L === 'zh-Hans' ? c.name['zh-Hans'] : c.name['zh-Hant'];
      return '<li><a href="#c-' + c.id + '" data-cat="' + c.id + '"><b' + (L === 'en' ? ' lang="zh-Hant" data-lang-neutral' : '') + '>' + esc(zh) + '</b>' + (L === 'en' ? esc(c.name.en) : '') + '</a></li>';
    }).join('');
    $('cats').innerHTML = JB.cats.map(function (c) {
      var zh = L === 'zh-Hans' ? c.name['zh-Hans'] : c.name['zh-Hant'];
      return '<section class="cat" id="c-' + c.id + '" aria-labelledby="ch-' + c.id + '">' +
        '<div class="cat-h"><h2 id="ch-' + c.id + '"' + (L === 'en' ? ' lang="zh-Hant" data-lang-neutral' : '') + '>' + esc(zh) + '</h2>' + (L === 'en' ? '<span>' + esc(c.name.en) + '</span>' : '') + '</div>' +
        '<p class="cat-note">' + esc(MPi18n.pick(c.note)) + '</p><ul class="items">' +
        JB.items.filter(function (it) { return it.c === c.id; }).map(function (it) {
          var marks = ['g', 'v', 'p', 's'].filter(function (k) { return JB.has(it, k); }).map(function (k) {
            return '<span class="mk mk-' + k + '" role="img" aria-label="' + esc(T('mark.' + k)) + '" title="' + esc(T('mark.' + k)) + '">' + CHAR[k] + '</span>';
          }).join('');
          var qty = it.q ? '<span class="tag">' + esc(T('menu.pcs').replace('{n}', it.q)) + '</span>' : '';
          return '<li class="item' + (picks[it.id] ? ' is-picked' : '') + '" data-id="' + it.id + '">' +
            '<div><span class="item-zh"' + (L === 'en' ? ' lang="zh-Hant" data-lang-neutral' : '') + '>' + esc(JB.zhName(it)) + '</span>' +
            '<span class="item-en"' + (L === 'en' ? '' : ' lang="en" data-lang-neutral') + '>' + esc(it.n[2]) + '</span>' +
            '<p class="item-d">' + esc(JB.desc(it)) + '</p>' +
            '<div class="item-meta">' + tierChip(it) + marks + qty + '</div></div>' +
            '<div class="qty">' + qtyHtml(it) + '</div></li>';
        }).join('') + '</ul></section>';
    }).join('');
    $('tiers').innerHTML = JB.tierOrder.map(function (k) { return '<span role="img" aria-label="' + esc(T('tier.' + k) + ' ' + JB.money(JB.tiers[k])) + '"><b aria-hidden="true">' + esc(MPi18n.pick(JB.tierChar[k])) + '</b><span aria-hidden="true">' + JB.money(JB.tiers[k]) + '</span></span>'; }).join('');
    apply();
    spy();
    tally();
  }

  function matches(it) {
    if (state.f !== 'all' && !JB.has(it, state.f)) return false;
    if (!state.q) return true;
    var q = norm(state.q);
    var hay = norm(it.n.join('|') + '|' + it.d.join('|'));
    return hay.indexOf(q) > -1;
  }
  function apply() {
    var total = 0;
    document.querySelectorAll('.cat').forEach(function (sec) {
      var any = 0;
      sec.querySelectorAll('.item').forEach(function (li) {
        var ok = matches(JB.byId(li.getAttribute('data-id')));
        li.hidden = !ok; if (ok) any++;
      });
      sec.hidden = !any; total += any;
      var tab = document.querySelector('#tabs a[data-cat="' + sec.id.slice(2) + '"]');
      if (tab) tab.parentNode.hidden = !any;
    });
    $('empty').hidden = total > 0;
    $('count').textContent = T('qr.count').replace('{n}', total);
  }

  var obs = null, lock = 0;
  function activate(id) {
    document.querySelectorAll('#tabs a').forEach(function (a) {
      var on = a.getAttribute('data-cat') === id;
      a.classList.toggle('is-active', on);
      if (on) {
        a.setAttribute('aria-current', 'true');
        var ul = $('tabs');
        ul.scrollLeft = a.offsetLeft - ul.clientWidth / 2 + a.offsetWidth / 2;
      } else a.removeAttribute('aria-current');
    });
  }
  function spy() {
    if (obs) obs.disconnect();
    if (!('IntersectionObserver' in window)) return;
    obs = new IntersectionObserver(function (es) {
      if (Date.now() < lock) return;
      es.forEach(function (e) { if (e.isIntersecting) activate(e.target.id.slice(2)); });
    }, { rootMargin: '-60px 0px -70% 0px' });
    document.querySelectorAll('.cat').forEach(function (s) { obs.observe(s); });
    var first = document.querySelector('.cat:not([hidden])');
    if (first) activate(first.id.slice(2));
  }

  function count() { var n = 0; for (var k in picks) n += picks[k]; return n; }
  function tally() {
    var n = count();
    $('bar').hidden = n === 0;
    $('bar-n').textContent = n;
    $('bar-sub').textContent = T('picks.items').replace('{n}', n);
    var ids = Object.keys(picks).filter(function (k) { return picks[k] > 0 && JB.byId(k); });
    var L = MPi18n.lang;
    $('picks').innerHTML = ids.map(function (id) {
      var it = JB.byId(id);
      return '<li><div><span class="pk-zh"' + (L === 'en' ? ' lang="zh-Hant" data-lang-neutral' : '') + '>' + esc(JB.zhName(it)) + '</span><span class="pk-en"' + (L === 'en' ? '' : ' lang="en" data-lang-neutral') + '>' + esc(it.n[2]) + ' · ' + (it.t ? esc(MPi18n.pick(JB.tierChar[it.t])) + ' ' : '') + (it.incl ? esc(T('menu.incl')) : JB.money(JB.price(it))) + '</span></div>' +
        '<div class="pk-ctl"><button type="button" data-sub="' + id + '" aria-label="' + esc(T('picks.less').replace('{name}', JB.name(it))) + '">−</button><output>' + picks[id] + '</output>' +
        '<button type="button" data-add="' + id + '" aria-label="' + esc(T('picks.more').replace('{name}', JB.name(it))) + '">+</button></div></li>';
    }).join('');
    $('picks-empty').hidden = ids.length > 0;
    $('picks-clear').hidden = ids.length === 0;
    if (!ids.length) { $('sum').innerHTML = ''; return; }
    var byTier = {}, tot = 0;
    ids.forEach(function (id) { var it = JB.byId(id); if (it.t) byTier[it.t] = (byTier[it.t] || 0) + picks[id]; tot += JB.price(it) * picks[id]; });
    var tl = JB.tierOrder.filter(function (k) { return byTier[k]; }).map(function (k) { return '<span>' + esc(MPi18n.pick(JB.tierChar[k])) + ' × ' + byTier[k] + '</span>'; }).join('');
    $('sum').innerHTML = (tl ? '<div class="row"><span>' + esc(T('picks.tiers')) + '</span></div><div class="tierline">' + tl + '</div>' : '') +
      '<div class="row tot"><span>' + esc(T('picks.est')) + '</span><span>' + JB.money(tot) + '</span></div>';
  }
  function refreshItem(id) {
    var li = document.querySelector('.item[data-id="' + id + '"]');
    if (!li) return;
    li.classList.toggle('is-picked', !!picks[id]);
    li.querySelector('.qty').innerHTML = qtyHtml(JB.byId(id));
  }
  function change(id, d, focusSel) {
    picks[id] = Math.max(0, Math.min(30, (picks[id] || 0) + d));
    if (!picks[id]) delete picks[id];
    save(); refreshItem(id); tally();
    if (focusSel) { var b = document.querySelector(focusSel); if (b) b.focus(); }
  }

  /* events */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-add]'), s = e.target.closest('[data-sub]');
    var inSheet = !!e.target.closest('#sheet');
    if (a) { var id = a.getAttribute('data-add'); change(id, 1, inSheet ? '#picks [data-add="' + id + '"]' : '.item[data-id="' + id + '"] [data-add]'); return; }
    if (s) {
      var id2 = s.getAttribute('data-sub');
      var left = (picks[id2] || 0) - 1;
      change(id2, -1, inSheet ? (left > 0 ? '#picks [data-sub="' + id2 + '"]' : '#sheet .x') : (left > 0 ? '.item[data-id="' + id2 + '"] [data-sub]' : '.item[data-id="' + id2 + '"] .add'));
      return;
    }
    var tab = e.target.closest('#tabs a');
    if (tab) {
      e.preventDefault();
      lock = Date.now() + 700;
      activate(tab.getAttribute('data-cat'));
      var sec = $('c-' + tab.getAttribute('data-cat'));
      if (sec) window.scrollTo(0, sec.getBoundingClientRect().top + window.scrollY - 52);
      return;
    }
    var f = e.target.closest('[data-filter]');
    if (f) {
      state.f = f.getAttribute('data-filter');
      document.querySelectorAll('[data-filter]').forEach(function (b) { b.setAttribute('aria-pressed', b === f ? 'true' : 'false'); });
      apply(); spy();
    }
  });
  var q = $('q'), clr = $('clear');
  q.addEventListener('input', function () { state.q = q.value.trim(); clr.hidden = !q.value; apply(); spy(); });
  clr.addEventListener('click', function () { q.value = ''; state.q = ''; clr.hidden = true; apply(); spy(); q.focus(); });

  var sheet = $('sheet'), opener = $('bar-open');
  function openSheet() { sheet.hidden = false; document.body.style.overflow = 'hidden'; sheet.querySelector('.x').focus(); }
  function closeSheet() { sheet.hidden = true; document.body.style.overflow = ''; if (!$('bar').hidden) opener.focus(); }
  opener.addEventListener('click', openSheet);
  sheet.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeSheet(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });
  $('picks-clear').addEventListener('click', function () {
    picks = {}; save();
    document.querySelectorAll('.item').forEach(function (li) { refreshItem(li.getAttribute('data-id')); });
    tally(); sheet.querySelector('.x').focus();
  });

  document.addEventListener('mp:langchange', render);
})();
