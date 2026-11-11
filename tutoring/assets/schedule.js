/* Maple Bridge: the timetable as lines on a ruled page. Filters (grade number, subject, day), week grid on
   desktop, day-by-day list on phones, seats left circled in red pen. Class links carry the class to the form. */
(function () {
  'use strict';
  var I = window.MPi18n, S = window.MB_SCHEDULE;
  if (!I || !S) return;
  var $ = function (id) { return document.getElementById(id); };
  var mq = window.matchMedia('(min-width: 1000px)');
  var qs = new URLSearchParams(location.search);
  var SUBJ = S.subjects.map(function (s) { return s.id; });
  var state = { lo: 0, hi: 0, subject: 'all', day: 'all', view: 'grid' };

  var g = parseInt(qs.get('grade'), 10);
  if (g >= 1 && g <= 12) { state.lo = state.hi = g; }
  else if (qs.get('band')) {
    S.bands.forEach(function (b) { if (b.id === String(qs.get('band')).toUpperCase()) { state.lo = b.lo; state.hi = b.hi; } });
  }
  if (SUBJ.indexOf(qs.get('subject')) > -1) state.subject = qs.get('subject');
  if (S.days.indexOf(qs.get('day')) > -1) state.day = qs.get('day');
  try { var v = localStorage.getItem('mb-view'); if (v === 'list' || v === 'grid') state.view = v; } catch (e) {}

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function fmt(key, vars) { var s = I.t(key); for (var k in vars) s = s.split('{' + k + '}').join(vars[k]); return s; }
  function dayName(d, short) { return I.t('day.' + d + (short ? '.s' : '')); }
  function sep() { return I.lang === 'en' ? ', ' : '，'; }
  function codes(name) { return esc(name).replace(/(（[^）]{1,14}）|\([^)]{1,14}\))/g, '<span class="nowrap">$1</span>'); }
  function gradeText(c) { return fmt(c.lo === c.hi ? 'sch.grade' : 'sch.grades', { g: c.grades }); }
  function meta(c) { return [gradeText(c), I.pick(S.teachers[c.teacher]), I.pick(S.rooms[c.room])].join(sep()); }
  function anyGrade() { return !state.lo; }

  function filtered() {
    return S.classes.filter(function (c) {
      return (anyGrade() || (c.lo <= state.hi && c.hi >= state.lo)) &&
        (state.subject === 'all' || c.subject === state.subject) &&
        (state.day === 'all' || c.day === state.day);
    });
  }

  function seats(c) {
    if (c.hideSeats) return '<span class="seats">' + esc(I.t('sch.club')) + '</span>';
    if (c.left === 0) return '<span class="seats full">' + esc(I.t('sch.full')) + '</span>';
    return '<span class="seats" aria-label="' + esc(fmt('sch.seats.aria', { n: c.left })) + '">' + (c.left === 1 ? I.t('sch.seats1') : fmt('sch.seats', { n: c.left })) + '</span>';
  }
  function action(c) {
    var full = c.left === 0;
    var href = 'inquiry.html?topic=' + (full ? 'wait' : 'trial') + '&class=' + encodeURIComponent(c.id);
    var text = I.t(full ? 'sch.wait' : 'cta');
    var aria = text + ': ' + I.pick(c.name) + sep() + dayName(c.day) + ' ' + S.fmtRange(c.time, I.lang);
    return '<a class="hl" href="' + href + '" aria-label="' + esc(aria) + '"><span>' + esc(text) + '</span></a>';
  }
  function note(c, cls) { return c.note ? '<p class="' + cls + '">' + esc(I.pick(c.note)) + '</p>' : ''; }

  /* ---------- filter chips ---------- */
  function chips() {
    var h = '<button type="button" class="fchip all" data-f="grade" data-v="all" aria-pressed="' + anyGrade() + '">' + esc(I.t('sch.f.allgrades')) + '</button>';
    for (var n = 1; n <= 12; n++) {
      var on = !anyGrade() && n >= state.lo && n <= state.hi;
      h += '<button type="button" class="fchip" data-f="grade" data-v="' + n + '" aria-pressed="' + on + '" aria-label="' + esc(I.t('grade.' + n)) + '">' + n + '</button>';
    }
    $('f-grade').innerHTML = h;
    h = '<button type="button" class="fchip" data-f="subject" data-v="all" aria-pressed="' + (state.subject === 'all') + '">' + esc(I.t('sch.f.all')) + '</button>';
    S.subjects.forEach(function (s) { h += '<button type="button" class="fchip" data-f="subject" data-v="' + s.id + '" aria-pressed="' + (state.subject === s.id) + '">' + esc(I.pick(s.label)) + '</button>'; });
    $('f-subj').innerHTML = h;
    h = '<button type="button" class="fchip" data-f="day" data-v="all" aria-pressed="' + (state.day === 'all') + '">' + esc(I.t('sch.f.all')) + '</button>';
    S.days.forEach(function (d) { h += '<button type="button" class="fchip" data-f="day" data-v="' + d + '" aria-pressed="' + (state.day === d) + '">' + esc(dayName(d, true)) + '</button>'; });
    $('f-day').innerHTML = h;
  }

  /* ---------- phone / list view: one ruled sheet ---------- */
  function listRow(c) {
    var t = S.fmtRange(c.time, I.lang).split('–');
    return '<article class="cls" data-id="' + c.id + '">' +
      '<p class="cls-time"><b>' + esc(t[0].trim()) + '</b><small>' + esc((I.lang === 'en' ? 'to ' : '至 ') + t[1].trim()) + '</small></p>' +
      '<h3 class="cls-name">' + codes(I.pick(c.name)) + '</h3>' +
      '<p class="cls-meta">' + esc(meta(c)) + '</p>' + note(c, 'cls-note') +
      '<div class="cls-foot">' + seats(c) + action(c) + '</div></article>';
  }
  function renderList(list) {
    var h = '<div class="sheet tt-sheet">';
    S.days.forEach(function (d) {
      var cs = list.filter(function (c) { return c.day === d; });
      if (!cs.length) return;
      h += '<section class="day" aria-labelledby="dh-' + d + '"><h2 class="day-h" id="dh-' + d + '">' + esc(dayName(d)) +
        ' <small>' + esc(cs.length === 1 ? I.t('sch.daycount1') : fmt('sch.daycount', { n: cs.length })) + '</small></h2>' + cs.map(listRow).join('') + '</section>';
    });
    return h + '</div>';
  }

  /* ---------- desktop / week view ---------- */
  function slotOf(id) { for (var i = 0; i < S.slots.length; i++) if (S.slots[i].id === id) return S.slots[i]; }
  function cell(c) {
    var sl = slotOf(c.slot), own = c.day === 'sat' ? sl.sat : sl.wk;
    var time = c.time !== own ? '<p class="tc__meta">' + esc(S.fmtRange(c.time, I.lang)) + '</p>' : '';
    return '<article class="tc" data-id="' + c.id + '"><h3 class="tc__name">' + codes(I.pick(c.name)) + '</h3>' + time +
      '<p class="tc__meta">' + esc(meta(c)) + '</p>' + note(c, 'tc__meta') +
      '<div class="tc__foot">' + seats(c) + action(c) + '</div></article>';
  }
  function rowCell(range) {
    if (!range) return '<div class="tt__t"></div>';
    var r = S.rowLabel(range, I.lang);
    return '<div class="tt__t">' + (r.period ? '<small>' + esc(r.period) + '</small>' : '') + '<b>' + esc(r.start) + '</b><span>' + esc((I.lang === 'en' ? 'to ' : '至 ') + r.end) + '</span></div>';
  }
  function renderGrid(list) {
    var wk = ['mon', 'tue', 'wed', 'thu', 'fri'];
    var h = '<div class="tt" role="region" aria-label="' + esc(I.t('sch.grid.aria')) + '">';
    h += '<div class="tt__sup">' + esc(I.t('sch.time')) + '</div>';
    wk.forEach(function (d) { h += '<div class="tt__h">' + esc(dayName(d)) + '</div>'; });
    h += '<div class="tt__gap"></div><div class="tt__sup">' + esc(I.t('sch.time')) + '</div><div class="tt__h">' + esc(dayName('sat')) + '</div>';
    S.slots.forEach(function (sl) {
      h += rowCell(sl.wk);
      wk.forEach(function (d) {
        var cs = list.filter(function (c) { return c.day === d && c.slot === sl.id; });
        if (!cs.length && d === 'fri' && sl.id === 3) h += '<div class="tt__cell is-msg">' + esc(I.t('sch.nofri')) + '</div>';
        else h += '<div class="tt__cell">' + cs.map(cell).join('') + '</div>';
      });
      h += '<div class="tt__gap"></div>' + rowCell(sl.sat);
      var ss = list.filter(function (c) { return c.day === 'sat' && c.slot === sl.id; });
      h += '<div class="tt__cell">' + ss.map(cell).join('') + '</div>';
    });
    return h + '</div>';
  }
  function renderEmpty() {
    return '<div class="sheet empty"><h2>' + esc(I.t('sch.empty.h')) + '</h2><p>' + esc(I.t('sch.empty.p')) + '</p>' +
      '<div class="acts"><button type="button" class="btn-plain" data-clear>' + esc(I.t('sch.f.clear')) + '</button>' +
      '<a class="link-sec" href="inquiry.html?topic=class">' + esc(I.t('sch.empty.b')) + '</a></div></div>';
  }

  function render() {
    chips();
    var list = filtered(), total = S.classes.length;
    var view = mq.matches ? state.view : 'list';
    $('count').textContent = list.length === total ? fmt('sch.count.all', { t: total }) : (list.length === 1 ? fmt('sch.count1', { t: total }) : fmt('sch.count', { n: list.length, t: total }));
    $('clear').hidden = anyGrade() && state.subject === 'all' && state.day === 'all';
    document.querySelectorAll('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === state.view)); });
    $('results').innerHTML = list.length ? (view === 'grid' ? renderGrid(list) : renderList(list)) : renderEmpty();
    var p = new URLSearchParams();
    if (!anyGrade()) { if (state.lo === state.hi) p.set('grade', state.lo); else S.bands.forEach(function (b) { if (b.lo === state.lo && b.hi === state.hi) p.set('band', b.id); }); }
    if (state.subject !== 'all') p.set('subject', state.subject);
    if (state.day !== 'all') p.set('day', state.day);
    var q = p.toString();
    try { history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash); } catch (e) {}
  }
  function clearAll() { state.lo = state.hi = 0; state.subject = state.day = 'all'; render(); }

  document.addEventListener('click', function (e) {
    var f = e.target.closest('.fchip');
    if (f) {
      var k = f.getAttribute('data-f'), v = f.getAttribute('data-v');
      if (k === 'grade') { state.lo = state.hi = v === 'all' ? 0 : +v; } else state[k] = v;
      render();
      var again = document.querySelector('.fchip[data-f="' + k + '"][data-v="' + v + '"]'); if (again) again.focus();
      return;
    }
    var vb = e.target.closest('[data-view]');
    if (vb) { state.view = vb.getAttribute('data-view'); try { localStorage.setItem('mb-view', state.view); } catch (er) {} render(); return; }
    if (e.target.closest('#clear, [data-clear]')) { clearAll(); var first = document.querySelector('.fchip'); if (first) first.focus(); }
  });
  if (mq.addEventListener) mq.addEventListener('change', render); else mq.addListener(render);
  document.addEventListener('mp:langchange', render);
  if (document.documentElement.classList.contains('i18n-ready')) render();
})();
