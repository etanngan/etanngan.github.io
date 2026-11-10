/* Maple Bridge — timetable rendering, filters, grid/list toggle */
(function () {
  'use strict';
  var I = window.MPi18n, S = window.MB_SCHEDULE;
  if (!I || !S) return;
  var $ = function (id) { return document.getElementById(id); };
  var mq = window.matchMedia('(min-width: 1000px)');
  var qs = new URLSearchParams(location.search);
  var state = {
    band: valid(qs.get('band'), S.bands.map(function (b) { return b.id; })),
    subject: valid(qs.get('subject'), S.subjects.map(function (s) { return s.id; })),
    day: valid(qs.get('day'), S.days),
    view: 'grid'
  };
  try { var v = localStorage.getItem('mb-view'); if (v === 'list' || v === 'grid') state.view = v; } catch (e) {}

  function valid(v, list) { return list.indexOf(v) > -1 ? v : 'all'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function fmt(key, vars) { var s = I.t(key); for (var k in vars) s = s.split('{' + k + '}').join(vars[k]); return s; }
  function dayName(d, short) { return I.t('day.' + d + (short ? '.s' : '')); }
  function tm(c) { return S.fmtRange(c.time, I.lang); }
  function shortTitle(name) {
    // keep short course codes like （MTH1W） / (MCV4U) together on one line
    return esc(name).replace(/(（[^）]{1,9}）|\([^)]{1,9}\))/g, '<span class="nowrap">$1</span>');
  }
  function subj(id) { for (var i = 0; i < S.subjects.length; i++) if (S.subjects[i].id === id) return S.subjects[i]; }

  function statusHTML(c) {
    var st = c.status, label;
    if (c.hideSeats || st === 'open') label = c.hideSeats ? I.t('sch.st.open') : fmt('sch.st.leftn', { n: c.left });
    else if (st === 'few') label = c.left === 1 ? I.t('sch.st.left1') : fmt('sch.st.leftn', { n: c.left });
    else label = I.t('sch.st.wait');
    var word = I.t('sch.st.' + st);
    return '<span class="st st--' + st + '" title="' + esc(word) + '">' + esc(label) + '</span>';
  }
  function askHref(c) { return 'inquiry.html?class=' + encodeURIComponent(c.id); }
  var arrow = '<svg class="arr" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function filtered() {
    return S.classes.filter(function (c) {
      return (state.band === 'all' || c.bands.indexOf(state.band) > -1) &&
        (state.subject === 'all' || c.subject === state.subject) &&
        (state.day === 'all' || c.day === state.day);
    });
  }

  /* ---------- chips ---------- */
  function chips() {
    function row(el, key, items, cur, allKey) {
      var h = '<button type="button" class="fchip" data-f="' + key + '" data-v="all" aria-pressed="' + (cur === 'all') + '">' + esc(I.t(allKey)) + '</button>';
      items.forEach(function (it) {
        h += '<button type="button" class="fchip' + (it.cls ? ' ' + it.cls : '') + '" data-f="' + key + '" data-v="' + it.id + '" aria-pressed="' + (cur === it.id) + '">' + (it.dot ? '<span class="dot" aria-hidden="true"></span>' : '') + esc(it.label) + '</button>';
      });
      el.innerHTML = h;
    }
    row($('f-band'), 'band', S.bands.map(function (b) { return { id: b.id, label: I.pick(b.label) }; }), state.band, 'sch.f.all');
    row($('f-subj'), 'subject', S.subjects.map(function (s) { return { id: s.id, label: I.pick(s.label), dot: true, cls: 's-' + s.id }; }), state.subject, 'sch.f.all');
    row($('f-day'), 'day', S.days.map(function (d) { return { id: d, label: dayName(d, true) }; }), state.day, 'sch.f.alldays');
  }

  /* ---------- cards ---------- */
  function meta(c) {
    return '<b class="mi">' + esc(fmt('sch.grade', { g: c.grades })) + '</b><span class="mi">' + esc(I.pick(S.teachers[c.teacher])) + '</span><span class="mi">' + esc(I.pick(S.rooms[c.room])) + '</span>';
  }
  function gridCard(c) {
    var name = I.pick(c.name);
    var aria = I.t('sch.ask') + ': ' + name + ', ' + dayName(c.day) + ' ' + tm(c);
    return '<article class="tc s-' + c.subject + (c.subject === 'club' ? ' tc--club' : '') + '" data-id="' + c.id + '">' +
      '<h3 class="tc__name">' + shortTitle(name) + '</h3>' +
      '<p class="tc__meta"><span class="mi-wrap"><span class="mi">' + esc(tm(c)) + '</span>' + meta(c) + '</span></p>' +
      (c.note ? '<p class="tc__meta">' + esc(I.pick(c.note)) + '</p>' : '') +
      '<div class="tc__foot">' + statusHTML(c) + '<a class="tc__ask" href="' + askHref(c) + '" aria-label="' + esc(aria) + '">' + esc(I.t('sch.ask.short')) + arrow + '</a></div></article>';
  }
  function listCard(c) {
    var name = I.pick(c.name);
    var aria = I.t('sch.ask') + ': ' + name + ', ' + dayName(c.day) + ' ' + tm(c);
    return '<article class="lc s-' + c.subject + '" data-id="' + c.id + '">' +
      '<div class="lc__time"><span>' + esc(tm(c)) + '</span>' + statusHTML(c) + '</div>' +
      '<div><h3 class="lc__name">' + shortTitle(name) + '</h3>' +
      '<p class="lc__meta"><span><b>' + esc(fmt('sch.grade', { g: c.grades })) + '</b></span><span>' + esc(I.pick(subj(c.subject).label)) + '</span><span>' + esc(I.pick(S.teachers[c.teacher])) + '</span><span>' + esc(I.pick(S.rooms[c.room])) + '</span></p>' +
      (c.note ? '<p class="lc__note">' + esc(I.pick(c.note)) + '</p>' : '') + '</div>' +
      '<div class="lc__act"><a class="btn btn--sm" href="' + askHref(c) + '" aria-label="' + esc(aria) + '">' + esc(I.t('sch.ask')) + arrow + '</a></div></article>';
  }

  function rowCell(range) {
    var r = S.rowLabel(range, I.lang);
    return '<div class="tt__t">' + (r.period ? '<small>' + esc(r.period) + '</small>' : '') + '<b>' + esc(r.start) + '</b><span>' + esc(r.end) + '</span></div>';
  }
  function renderGrid(list) {
    var wk = ['mon', 'tue', 'wed', 'thu', 'fri'];
    var h = '<div class="tt" role="region" aria-label="' + esc(I.t('sch.grid.aria')) + '">';
    h += '<div class="tt__sup">' + esc(I.t('sch.time')) + '</div>';
    wk.forEach(function (d) { h += '<div class="tt__h">' + esc(dayName(d)) + '</div>'; });
    h += '<div></div><div class="tt__sup">' + esc(I.t('sch.time')) + '</div><div class="tt__h tt__h--sat">' + esc(dayName('sat')) + '</div>';
    S.slots.forEach(function (sl) {
      h += rowCell(sl.wk);
      wk.forEach(function (d) {
        var cs = list.filter(function (c) { return c.day === d && c.slot === sl.id; });
        if (!cs.length && d === 'fri' && sl.id === 3 && state.subject === 'all' && state.band === 'all') h += '<div class="tt__cell is-msg">' + esc(I.t('sch.nofri')) + '</div>';
        else h += '<div class="tt__cell">' + cs.map(gridCard).join('') + '</div>';
      });
      h += '<div></div>' + (sl.sat ? rowCell(sl.sat) : '<div class="tt__t"></div>');
      var ss = list.filter(function (c) { return c.day === 'sat' && c.slot === sl.id; });
      h += sl.sat ? '<div class="tt__cell">' + ss.map(gridCard).join('') + '</div>' : '<div></div>';
    });
    return h + '</div>';
  }
  function renderList(list) {
    var h = '';
    S.days.forEach(function (d) {
      var cs = list.filter(function (c) { return c.day === d; });
      if (!cs.length) return;
      h += '<section class="daygroup" aria-label="' + esc(dayName(d)) + '"><h2 class="daygroup__h">' + esc(dayName(d)) + '<small>' + esc(cs.length === 1 ? I.t('sch.daycount1') : fmt('sch.daycount', { n: cs.length })) + '</small></h2>' + cs.map(listCard).join('') + '</section>';
    });
    return h;
  }
  function renderEmpty() {
    return '<div class="empty"><svg viewBox="0 0 76 76" aria-hidden="true"><rect x="10" y="8" width="52" height="62" rx="6" fill="#FFFDF8" stroke="#131B45" stroke-width="3" transform="rotate(-6 36 39)"/><path d="M24 28h26M24 40h18" stroke="#B9C3EA" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="50" r="13" fill="#FFC62E" stroke="#131B45" stroke-width="3"/><path d="M59 59l9 9" stroke="#131B45" stroke-width="4" stroke-linecap="round"/></svg>' +
      '<h2>' + esc(I.t('sch.empty.h')) + '</h2><p>' + esc(I.t('sch.empty.p')) + '</p>' +
      '<div class="empty__act"><button type="button" class="btn btn--yellow btn--sm" data-clear>' + esc(I.t('sch.f.clear')) + '</button><a class="btn btn--sm" href="inquiry.html">' + esc(I.t('sch.empty.b')) + '</a></div></div>';
  }

  function render() {
    chips();
    var list = filtered(), total = S.classes.length;
    var view = mq.matches ? state.view : 'list';
    $('count').innerHTML = (list.length === total ? fmt('sch.count.all', { t: total }) : fmt('sch.count', { n: '<b>' + list.length + '</b>', t: total }));
    $('clear').hidden = state.band === 'all' && state.subject === 'all' && state.day === 'all';
    document.querySelectorAll('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === state.view)); });
    $('layout').classList.toggle('is-list', view === 'list');
    $('results').innerHTML = list.length ? (view === 'grid' ? renderGrid(list) : renderList(list)) : renderEmpty();
    // keep the URL shareable
    var p = new URLSearchParams();
    if (state.band !== 'all') p.set('band', state.band);
    if (state.subject !== 'all') p.set('subject', state.subject);
    if (state.day !== 'all') p.set('day', state.day);
    var q = p.toString();
    try { history.replaceState(null, '', location.pathname + (q ? '?' + q : '')); } catch (e) {}
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  function clearAll() { state.band = state.subject = state.day = 'all'; render(); }

  document.addEventListener('click', function (e) {
    var f = e.target.closest('.fchip');
    if (f) { state[f.getAttribute('data-f')] = f.getAttribute('data-v'); render(); var again = document.querySelector('.fchip[data-f="' + f.getAttribute('data-f') + '"][data-v="' + f.getAttribute('data-v') + '"]'); if (again) again.focus(); return; }
    var v = e.target.closest('[data-view]');
    if (v) { state.view = v.getAttribute('data-view'); try { localStorage.setItem('mb-view', state.view); } catch (er) {} render(); return; }
    if (e.target.closest('#clear, [data-clear]')) { clearAll(); var first = document.querySelector('.fchip'); if (first) first.focus(); }
  });
  if (mq.addEventListener) mq.addEventListener('change', render); else mq.addListener(render);
  document.addEventListener('mp:langchange', render);
  if (document.documentElement.classList.contains('i18n-ready')) render();
})();
