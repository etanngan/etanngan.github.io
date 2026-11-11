/* Jade Basket: your own copy of the 點心紙. Tally boxes (one pencil stroke of 正 per tap), table and guests,
   totals with the tea charge, kept on this phone for 6 hours. Shared by menu.html and qr.html. Nothing is sent anywhere. */
(function () {
  'use strict';
  var JB = window.JB, esc = window.JBesc, fill = window.JBfill;
  var T = function (k) { return MPi18n.t(k); };
  var KEY = 'jb-sheet', KEEP = 6 * 3600 * 1000;
  var S = { items: {}, table: '', guests: 2 };
  try {
    var raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw && raw.t && Date.now() - raw.t < KEEP) S = { items: raw.items || {}, table: raw.table || '', guests: raw.guests || 2 };
  } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), items: S.items, table: S.table, guests: S.guests })); } catch (e) {} }
  function n(id) { return S.items[id] || 0; }
  function count() { var c = 0; for (var k in S.items) c += S.items[k]; return c; }
  function ids() { return Object.keys(S.items).filter(function (k) { return S.items[k] > 0 && JB.byId(k); }); }

  /* ---------- the tally control ---------- */
  var STROKES = ['M8 9H32', 'M20 9V32', 'M20 20.5H29', 'M11 20.5V32', 'M6 32H34'];
  function boxSvg(c, drawLast) {
    if (!c) return '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path class="plus" d="M20 13V27M13 20H27"/></svg>';
    var k = Math.min(c, 5), out = '';
    for (var i = 0; i < k; i++) out += '<path class="st' + (drawLast && i === k - 1 ? ' draw' : '') + '" d="' + STROKES[i] + '"/>';
    return '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">' + out + '</svg>';
  }
  function tallyInner(it, drawLast) {
    var c = n(it.id), nm = JB.name(it);
    var addLabel = fill(T('tally.add'), { name: nm }) + (c ? ', ' + fill(T('tally.count'), { n: c }) : '');
    return (c ? '<button type="button" class="t-less" data-sub="' + it.id + '" aria-label="' + esc(fill(T('tally.less'), { name: nm })) + '">−</button>' +
      '<span class="tally-n num" aria-hidden="true">' + c + '</span>' : '') +
      '<button type="button" class="t-box" data-add="' + it.id + '" aria-label="' + esc(addLabel) + '">' + boxSvg(c, drawLast) + '</button>';
  }
  function tallyHtml(it) { return '<div class="tally" data-tally-for="' + it.id + '">' + tallyInner(it) + '</div>'; }

  /* ---------- live announcements ---------- */
  var live = document.createElement('div');
  live.className = 'sr'; live.setAttribute('aria-live', 'polite'); live.setAttribute('role', 'status'); live.id = 'sheet-live';
  document.body.appendChild(live);
  function say(msg) { live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 40); }

  /* ---------- the dialog ---------- */
  var dlg = document.createElement('dialog');
  dlg.className = 'sheet-dlg'; dlg.id = 'sheet'; dlg.setAttribute('aria-labelledby', 'sheet-h');
  dlg.innerHTML =
    '<div class="dlg-card">' +
    '<div class="dlg-head"><h2 id="sheet-h" data-i18n="sheet.h">Your sheet</h2><button type="button" class="dlg-x" data-close aria-label="Close" data-i18n-attr="aria-label:sheet.close">×</button></div>' +
    '<div class="sheet-fields">' +
    '<div><label for="sh-table" data-i18n="sheet.table">Table</label><input id="sh-table" type="text" inputmode="numeric" autocomplete="off" maxlength="4"></div>' +
    '<div><span class="lbl" id="sh-g-l" data-i18n="sheet.guests">Guests</span><div class="guests" role="group" aria-labelledby="sh-g-l">' +
    '<button type="button" data-guests="-1" aria-label="One guest fewer" data-i18n-attr="aria-label:sheet.guests.less">−</button><output id="sh-guests" class="num" aria-live="polite">2</output>' +
    '<button type="button" data-guests="1" aria-label="One more guest" data-i18n-attr="aria-label:sheet.guests.more">+</button></div></div>' +
    '</div>' +
    '<div id="sheet-list" class="sheet-list"></div>' +
    '<p class="sheet-empty" id="sheet-empty" data-i18n="sheet.empty">Your sheet is empty.</p>' +
    '<div class="sheet-sum" id="sheet-sum"></div>' +
    '<p class="sheet-note" data-i18n="sheet.note">Nothing has been ordered yet.</p>' +
    '<p class="muted" data-i18n="sheet.kept">Kept on this phone for 6 hours.</p>' +
    '<div class="sheet-acts"><button type="button" class="btn-clear" id="sheet-clear" data-i18n="sheet.clear">Clear sheet</button>' +
    '<button type="button" class="btn-line" data-close data-i18n="sheet.close">Close</button></div>' +
    '</div>';
  document.body.appendChild(dlg);
  MPi18n.apply(dlg);
  var tableIn = dlg.querySelector('#sh-table');
  tableIn.addEventListener('input', function () { S.table = tableIn.value.replace(/[^\w-]/g, '').slice(0, 4); save(); });

  function rowHtml(it) {
    var L = MPi18n.lang;
    return '<li class="row"><div class="row-main"><span class="row-name">' + esc(JB.name(it)) + '</span>' +
      '<span class="row-alt' + (L === 'en' ? ' cn" lang="zh-Hant"' : '" lang="en"') + ' data-lang-neutral>' + esc(JB.altName(it)) + '</span>' +
      '<span class="row-meta"><span class="row-price num">' + (it.incl ? esc(T('menu.incl')) : JB.money(JB.price(it))) + '</span></span></div>' + tallyHtml(it) + '</li>';
  }
  function renderSheet() {
    var list = ids(), early = JB.early();
    dlg.querySelector('#sh-guests').textContent = S.guests;
    if (document.activeElement !== tableIn) tableIn.value = S.table;
    var html = '';
    JB.tierOrder.forEach(function (k) {
      var its = list.map(JB.byId).filter(function (it) { return it.t === k; });
      if (!its.length) return;
      html += '<div class="tsec-h"><h3><span class="tier-box"><span class="cn">' + esc(JB.tier(k)) + '</span><span class="num">' + JB.money(JB.unitPrice({ t: k }, early)) + '</span></span></h3></div><ul class="rows">' + its.map(rowHtml).join('') + '</ul>';
    });
    var kit = list.map(JB.byId).filter(function (it) { return !it.t; });
    if (kit.length) html += '<div class="tsec-h"><h3>' + esc(T('sheet.kitchen')) + '</h3></div><ul class="rows">' + kit.map(rowHtml).join('') + '</ul>';
    dlg.querySelector('#sheet-list').innerHTML = html;
    dlg.querySelector('#sheet-empty').hidden = list.length > 0;
    dlg.querySelector('#sheet-clear').hidden = list.length === 0 && !S.table;
    var dishes = 0, byTier = {};
    list.forEach(function (id) { var it = JB.byId(id); dishes += JB.unitPrice(it, early) * S.items[id]; if (it.t) byTier[it.t] = (byTier[it.t] || 0) + S.items[id]; });
    var tea = S.guests * JB.tea, service = S.guests >= 10 ? (dishes + tea) * 0.15 : 0, total = dishes + tea + service;
    var tiers = JB.tierOrder.filter(function (k) { return byTier[k]; }).map(function (k) { return '<span class="tier-box"><span class="cn">' + esc(JB.tier(k)) + '</span><span class="num">× ' + byTier[k] + '</span></span>'; }).join('');
    dlg.querySelector('#sheet-sum').innerHTML = (tiers ? '<div class="sum-tiers">' + tiers + '</div>' : '') +
      '<div class="sum-row"><span>' + esc(T('sheet.dishes')) + '</span><span class="num">' + JB.money(dishes) + '</span></div>' +
      '<div class="sum-row"><span>' + esc(fill(T('sheet.tea'), { n: S.guests })) + '</span><span class="num">' + JB.money(tea) + '</span></div>' +
      (service ? '<div class="sum-row"><span>' + esc(T('sheet.service')) + '</span><span class="num">' + JB.money(service) + '</span></div>' : '') +
      '<div class="sum-row tot"><span>' + esc(T('sheet.total')) + '</span><span class="num">' + JB.money(total) + '</span></div>' +
      (early && Object.keys(byTier).length ? '<p class="muted" style="margin:8px 0 0">' + esc(T('sheet.early')) + '</p>' : '');
    return total;
  }
  function dishesTotal() { var early = JB.early(), t = 0; ids().forEach(function (id) { t += JB.unitPrice(JB.byId(id), early) * S.items[id]; }); return t; }

  /* ---------- everything that shows the sheet's count ---------- */
  function bars() {
    var c = count();
    document.querySelectorAll('[data-sheet-count]').forEach(function (el) { el.textContent = c === 1 ? T('sheet.one') : fill(T('sheet.items'), { n: c }); });
    document.querySelectorAll('[data-sheet-total]').forEach(function (el) { el.textContent = JB.money(dishesTotal()); });
    document.querySelectorAll('[data-sheet-bar]').forEach(function (el) { el.hidden = c === 0; });
    document.body.classList.toggle('sheet-has', c > 0);
  }
  function refreshTally(id, drawLast) {
    var it = JB.byId(id);
    document.querySelectorAll('.tally[data-tally-for="' + id + '"]').forEach(function (el) {
      if (el.closest('#sheet')) return;
      el.innerHTML = tallyInner(it, drawLast);
      var row = el.closest('.row'); if (row) row.classList.toggle('has-n', n(id) > 0);
    });
  }
  function change(id, d, src) {
    var it = JB.byId(id); if (!it) return;
    var before = n(id), after = Math.max(0, Math.min(40, before + d));
    if (after === before) return;
    if (after) S.items[id] = after; else delete S.items[id];
    save();
    var inDlg = src && src.closest('#sheet'), wasLess = src && src.classList.contains('t-less'), box = src && src.closest('.tally');
    refreshTally(id, d > 0);
    bars();
    if (dlg.open) renderSheet();
    say(after ? fill(T('live.count'), { name: JB.name(it), n: after }) : fill(T('live.removed'), { name: JB.name(it) }));
    /* keep focus on the same control after it is redrawn */
    var scope = inDlg ? dlg : box;
    if (scope) {
      var target = (wasLess && after ? scope.querySelector('[data-sub="' + id + '"]') : null) || scope.querySelector('[data-add="' + id + '"]');
      if (!target && inDlg) target = dlg.querySelector('.dlg-x');
      if (target) target.focus();
    }
  }

  var opener = null;
  function open(btn) { opener = btn || document.activeElement; renderSheet(); dlg.showModal(); dlg.querySelector('.dlg-x').focus(); }
  function close() { dlg.close(); }
  dlg.addEventListener('close', function () { disarm(); if (opener && opener.focus && document.contains(opener)) opener.focus(); });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) { close(); return; }
    if (e.target.closest('[data-close]')) close();
    var g = e.target.closest('[data-guests]');
    if (g) { S.guests = Math.max(1, Math.min(30, S.guests + +g.getAttribute('data-guests'))); save(); renderSheet(); }
  });

  /* clearing takes two taps, so a stray tap at the table cannot wipe the sheet */
  var clr = dlg.querySelector('#sheet-clear'), armT = 0;
  function disarm() { clearTimeout(armT); clr.classList.remove('is-armed'); clr.textContent = T('sheet.clear'); clr.setAttribute('data-i18n', 'sheet.clear'); }
  clr.addEventListener('click', function () {
    if (!clr.classList.contains('is-armed')) {
      clr.classList.add('is-armed'); clr.textContent = T('sheet.clear2'); clr.setAttribute('data-i18n', 'sheet.clear2');
      say(T('sheet.clear2'));
      armT = setTimeout(disarm, 5000); return;
    }
    var gone = ids();
    S.items = {}; S.table = ''; save(); disarm();
    gone.forEach(function (id) { refreshTally(id); });
    bars(); renderSheet(); say(T('live.cleared'));
    dlg.querySelector('.dlg-x').focus();
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-add]'), s = e.target.closest('[data-sub]'), o = e.target.closest('[data-sheet-open]');
    if (a) change(a.getAttribute('data-add'), 1, a);
    else if (s) change(s.getAttribute('data-sub'), -1, s);
    else if (o) { e.preventDefault(); open(o); }
  });
  document.addEventListener('mp:langchange', function () { bars(); if (dlg.open) renderSheet(); });
  window.addEventListener('storage', function (e) {
    if (e.key !== KEY) return;
    try { var r = JSON.parse(e.newValue || 'null'); S = r ? { items: r.items || {}, table: r.table || '', guests: r.guests || 2 } : { items: {}, table: '', guests: 2 }; } catch (x) {}
    JB.items.forEach(function (it) { refreshTally(it.id); }); bars(); if (dlg.open) renderSheet();
  });

  window.JBSheet = { n: n, count: count, tallyHtml: tallyHtml, open: open, bars: bars };
  bars();
})();
