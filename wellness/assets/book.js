/* Stillwater: appointment REQUEST form, filled in like the clinic's appointment card.
   Collects only the service, the preferred day and time, name and phone (email optional). No health information (PHIPA).
   Nothing is sent or stored. Needs site.js (window.StillwaterHours) and the shared i18n engine. */
(function () {
  'use strict';
  var I = window.MPi18n, H = window.StillwaterHours, doc = document;
  var form = doc.getElementById('bookForm');
  if (!form || !I || !H) return;
  var t = function (k) { return I.t(k); };
  var en = function () { return I.lang === 'en'; };
  var comma = function () { return en() ? ', ' : '，'; };

  /* ---------- data ---------- */
  var PRAC = { jl: 'p.jl.n', mc: 'p.mc.n', dh: 'p.dh.n', wz: 'p.wz.n', sm: 'p.sm.n' };
  var SERVICES = [
    { id: 'physio', name: 'svc.phy.h', prac: ['jl'], lengths: [['60f', 'len.phy60f', 130], ['30', 'len.phy30', 80], ['45', 'len.phy45', 105]] },
    { id: 'massage', name: 'svc.mas.h', prac: ['mc', 'dh'], lengths: [['30', 'len.mas30', 70], ['45', 'len.mas45', 95], ['60', 'len.mas60', 120], ['60p', 'len.mas60p', 120], ['90', 'len.mas90', 165]] },
    { id: 'acupuncture', name: 'svc.acu.h', prac: ['wz'], lengths: [['75f', 'len.acu75f', 125], ['45', 'len.acu45', 85], ['60', 'len.acu60', 105], ['60c', 'len.acu60c', 125]] },
    { id: 'osteo', name: 'svc.ost.h', prac: ['sm'], tax: true, lengths: [['60f', 'len.ost60f', 125], ['30', 'len.ost30', 75], ['45', 'len.ost45', 100]] }
  ];
  function svc(id) { for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].id === id) return SERVICES[i]; return null; }
  function price(s, l) { return '$' + l[2] + (s.tax ? ' ' + t('len.plustax') : ''); }

  /* ---------- dates (Toronto calendar day) ---------- */
  var MAX_DAYS = 84;
  function parse(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  var now = H.torontoNow();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var minD = new Date(today); minD.setDate(minD.getDate() + 1);
  var maxD = new Date(today); maxD.setDate(maxD.getDate() + MAX_DAYS);
  function isOpen(d) { return !!H.hoursFor(d); }
  function selectable(d) { return d >= minD && d <= maxD && isOpen(d); }
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONF = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function fmtDate(d, short) {
    if (en()) return short ? H.SHORT.en[d.getDay()] + ', ' + MON[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()
      : H.DAYS.en[d.getDay()] + ', ' + MONF[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日（' + H.DAYS[I.lang][d.getDay()] + '）';
  }
  function fmtMonth(y, m) { return en() ? MONF[m] + ' ' + y : y + '年' + (m + 1) + '月'; }

  /* ---------- the two time slots ---------- */
  var slots = {};
  var ICON_CAL = '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true" focusable="false"><rect x="1.5" y="3" width="15" height="13.5" rx="1.5"/><path d="M1.5 7.5h15M5.5 1v4M12.5 1v4"/></svg>';
  var ARROW_L = '<svg viewBox="0 0 10 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false"><path d="M8.5 1.5L2 8l6.5 6.5"/></svg>';
  var ARROW_R = '<svg viewBox="0 0 10 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false"><path d="M1.5 1.5L8 8l-6.5 6.5"/></svg>';
  function buildSlot(n) {
    var el = form.querySelector('[data-slot="' + n + '"]');
    var s = { n: n, el: el, value: '', view: new Date(minD.getFullYear(), minD.getMonth(), 1), open: false };
    el.innerHTML =
      '<p class="slot-title" id="st' + n + '"><span data-k="bk.slot' + n + '"></span>' + (n === 2 ? ' <span class="opt" data-k="bk.opt"></span>' : '') + '</p>' +
      '<div class="field" data-field="date' + n + '">' +
        '<span class="label" id="dl' + n + '" data-k="bk.date"></span>' +
        '<button type="button" class="datebtn is-empty" id="date' + n + '" aria-haspopup="dialog" aria-expanded="false" aria-controls="cal' + n + '" aria-labelledby="st' + n + ' dl' + n + ' dt' + n + '" aria-describedby="e-date' + n + '"><span class="datebtn-text" id="dt' + n + '"></span>' + ICON_CAL + '</button>' +
        '<div class="cal" id="cal' + n + '" role="dialog" hidden></div>' +
        (n === 2 ? '<button type="button" class="linkbtn clear2" hidden data-k="bk.clear2"></button>' : '') +
        '<p class="err" id="e-date' + n + '"></p>' +
      '</div>' +
      '<fieldset class="field plain" data-field="win' + n + '" aria-describedby="e-win' + n + '">' +
        '<legend class="label"><span data-k="bk.tod"></span> <span class="opt" data-k="bk.tod.help"></span></legend>' +
        '<div class="chips">' +
          ['am', 'pm', 'eve'].map(function (w) { return '<label class="chip"><input type="checkbox" name="win' + n + '" value="' + w + '"><span><span data-k="bk.' + w + '"></span> <small data-k="bk.' + w + '.s"></small></span></label>'; }).join('') +
        '</div>' +
        '<p class="help close-note" hidden></p>' +
        '<p class="err" id="e-win' + n + '"></p>' +
      '</fieldset>';
    s.btn = el.querySelector('.datebtn');
    s.cal = el.querySelector('.cal');
    s.clear = el.querySelector('.clear2');
    s.btn.addEventListener('click', function () { toggleCal(s, !s.open); });
    if (s.clear) s.clear.addEventListener('click', function () { setDate(s, ''); s.btn.focus(); });
    el.addEventListener('change', function () { clearErr('win' + n); if (n === 2) clearErr('date2'); });
    s.cal.addEventListener('focusout', function () {
      setTimeout(function () {
        var a = doc.activeElement;
        if (s.open && a && a !== doc.body && !s.cal.contains(a) && a !== s.btn) toggleCal(s, false);
      }, 0);
    });
    slots[n] = s;
    return s;
  }
  function toggleCal(s, open) {
    [1, 2].forEach(function (n) { if (slots[n] !== s && slots[n].open) toggleCal(slots[n], false); });
    s.open = open;
    s.cal.hidden = !open;
    s.btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      var focusDate = s.value ? parse(s.value) : firstSelectable();
      s.view = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
      renderCal(s, H.keyOf(focusDate));
      var b = s.cal.querySelector('.cal-day[tabindex="0"]');
      if (b) b.focus();
    }
  }
  function firstSelectable() {
    var d = new Date(minD);
    for (var i = 0; i < 14 && !selectable(d); i++) d.setDate(d.getDate() + 1);
    return d;
  }
  function renderCal(s, focusKey) {
    var y = s.view.getFullYear(), m = s.view.getMonth();
    var first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
    var prevOk = new Date(y, m, 0) >= minD, nextOk = new Date(y, m + 1, 1) <= maxD;
    // which day gets tabindex=0: the requested one, else the chosen one in view, else the first selectable in view
    var keys = [], d, k;
    for (d = 1; d <= days; d++) keys.push(H.keyOf(new Date(y, m, d)));
    var tabKey = null;
    [focusKey, s.value].forEach(function (c) { if (!tabKey && c && keys.indexOf(c) > -1 && selectable(parse(c))) tabKey = c; });
    if (!tabKey) for (d = 0; d < keys.length; d++) if (selectable(parse(keys[d]))) { tabKey = keys[d]; break; }
    var h = '<div class="cal-head"><button type="button" class="cal-nav" data-nav="-1" aria-label="' + t('cal.prev') + '"' + (prevOk ? '' : ' disabled') + '>' + ARROW_L + '</button>' +
      '<span class="cal-title" id="calt' + s.n + '" aria-live="polite">' + fmtMonth(y, m) + '</span>' +
      '<button type="button" class="cal-nav" data-nav="1" aria-label="' + t('cal.next') + '"' + (nextOk ? '' : ' disabled') + '>' + ARROW_R + '</button></div>';
    h += '<div class="cal-grid" role="group" aria-labelledby="calt' + s.n + '">';
    H.SHORT[I.lang].forEach(function (x) { h += '<span class="cal-dow" aria-hidden="true">' + x + '</span>'; });
    for (var i = 0; i < first.getDay(); i++) h += '<span aria-hidden="true"></span>';
    for (d = 1; d <= days; d++) {
      var dt = new Date(y, m, d), ok = selectable(dt), closed = !isOpen(dt);
      k = keys[d - 1];
      h += '<button type="button" class="cal-day' + (closed ? ' is-closed' : '') + '" data-date="' + k + '"' + (ok ? '' : ' disabled') +
        ' tabindex="' + (k === tabKey ? '0' : '-1') + '" aria-pressed="' + (s.value === k) + '" aria-label="' + fmtDate(dt) + (closed ? comma() + t('cal.closed') : '') + '">' + d + '</button>';
    }
    h += '</div><p class="cal-foot">' + t('cal.foot') + '</p>';
    s.cal.setAttribute('aria-label', t('cal.label'));
    s.cal.innerHTML = h;
  }
  function closeNoteText(close) {
    return t('bk.close.note').replace('{time}', H.fmtTime(close));
  }
  function setDate(s, key) {
    s.value = key;
    s.btn.classList.toggle('is-empty', !key);
    s.btn.querySelector('.datebtn-text').textContent = key ? fmtDate(parse(key), true) : t('bk.date.ph');
    var hrs = key ? H.hoursFor(parse(key)) : null;
    var noEve = !!(hrs && hrs[1] < 18);
    var eve = s.el.querySelector('input[value="eve"]');
    eve.disabled = noEve; if (noEve) eve.checked = false;
    var note = s.el.querySelector('.close-note');
    note.hidden = !noEve;
    note.textContent = noEve ? closeNoteText(hrs[1]) : '';
    if (s.clear) s.clear.hidden = !key;
    clearErr('date' + s.n);
    if (s.n === 2) clearErr('win2');
  }
  doc.addEventListener('click', function (e) {
    var slotEl = e.target.closest('.slot');
    if (!slotEl || !form.contains(slotEl)) { [1, 2].forEach(function (n) { if (slots[n] && slots[n].open) toggleCal(slots[n], false); }); return; }
    var s = slots[slotEl.getAttribute('data-slot')];
    var nav = e.target.closest('.cal-nav'), day = e.target.closest('.cal-day');
    if (nav && !nav.disabled) {
      var dir = +nav.getAttribute('data-nav');
      s.view = new Date(s.view.getFullYear(), s.view.getMonth() + dir, 1);
      renderCal(s);
      var b = s.cal.querySelector('[data-nav="' + dir + '"]:not(:disabled)') || s.cal.querySelector('.cal-day[tabindex="0"]');
      if (b) b.focus();
    } else if (day && !day.disabled) {
      setDate(s, day.getAttribute('data-date'));
      toggleCal(s, false);
      s.btn.focus();
    } else if (s.open && !e.target.closest('.cal') && !e.target.closest('.datebtn')) {
      toggleCal(s, false);
    }
  });
  doc.addEventListener('keydown', function (e) {
    var cal = e.target.closest && e.target.closest('.cal');
    if (!cal) return;
    var s = slots[cal.closest('.slot').getAttribute('data-slot')];
    if (e.key === 'Escape') { e.preventDefault(); toggleCal(s, false); s.btn.focus(); return; }
    if (!e.target.classList.contains('cal-day')) return;
    var cur = parse(e.target.getAttribute('data-date'));
    var target = null;
    function step(n) { var d = new Date(cur); for (var i = 0; i < 40; i++) { d.setDate(d.getDate() + n); if (d < minD || d > maxD) return null; if (selectable(d)) return d; } return null; }
    switch (e.key) {
      case 'ArrowLeft': target = step(-1); break;
      case 'ArrowRight': target = step(1); break;
      case 'ArrowUp': target = step(-7) || null; break;
      case 'ArrowDown': target = step(7) || null; break;
      case 'Home': { var a = new Date(cur); a.setDate(a.getDate() - a.getDay()); target = selectable(a) ? a : (function () { var d = new Date(a); for (var i = 0; i < 7; i++) { if (selectable(d)) return d; d.setDate(d.getDate() + 1); } return null; })(); break; }
      case 'End': { var b = new Date(cur); b.setDate(b.getDate() + (6 - b.getDay())); target = (function () { var d = new Date(b); for (var i = 0; i < 7; i++) { if (selectable(d)) return d; d.setDate(d.getDate() - 1); } return null; })(); break; }
      case 'PageUp': case 'PageDown': {
        var pm = new Date(cur.getFullYear(), cur.getMonth() + (e.key === 'PageUp' ? -1 : 1), Math.min(cur.getDate(), 28));
        target = selectable(pm) ? pm : null;
        if (!target) { var d2 = new Date(pm); for (var j = 0; j < 7 && !target; j++) { d2.setDate(d2.getDate() + 1); if (selectable(d2)) target = new Date(d2); } }
        break;
      }
      default: return;
    }
    e.preventDefault();
    if (!target) return;
    var key = H.keyOf(target);
    if (target.getMonth() !== s.view.getMonth() || target.getFullYear() !== s.view.getFullYear()) {
      s.view = new Date(target.getFullYear(), target.getMonth(), 1);
    }
    renderCal(s, key);
    var btn = s.cal.querySelector('[data-date="' + key + '"]');
    if (btn) btn.focus();
  });

  /* ---------- selects ---------- */
  var fService = doc.getElementById('f-service'), fLength = doc.getElementById('f-length'), fPrac = doc.getElementById('f-prac');
  function opt(v, label, sel, dis) { var o = doc.createElement('option'); o.value = v; o.textContent = label; if (sel) o.selected = true; if (dis) o.disabled = true; return o; }
  function renderService() {
    var cur = fService.value;
    fService.innerHTML = '';
    fService.appendChild(opt('', t('bk.service.ph'), !cur, true));
    SERVICES.forEach(function (s) { fService.appendChild(opt(s.id, t(s.name), s.id === cur)); });
    fService.classList.toggle('is-placeholder', !fService.value);
  }
  function renderLength() {
    var s = svc(fService.value), cur = fLength.value;
    fLength.innerHTML = '';
    if (!s) { fLength.appendChild(opt('', t('bk.length.wait'), true)); fLength.disabled = true; fLength.classList.add('is-placeholder'); return; }
    fLength.disabled = false;
    var keep = s.lengths.some(function (l) { return l[0] === cur; });
    fLength.appendChild(opt('', t('bk.length.ph'), !keep, true));
    s.lengths.forEach(function (l) { fLength.appendChild(opt(l[0], t(l[1]) + comma() + price(s, l), keep && l[0] === cur)); });
    fLength.classList.toggle('is-placeholder', !fLength.value);
  }
  function renderPrac() {
    var s = svc(fService.value), cur = fPrac.value;
    fPrac.innerHTML = '';
    fPrac.appendChild(opt('any', t('bk.prac.any'), true));
    (s ? s.prac : Object.keys(PRAC)).forEach(function (id) { fPrac.appendChild(opt(id, t(PRAC[id]), id === cur)); });
  }
  fService.addEventListener('change', function () { renderLength(); renderPrac(); fService.classList.toggle('is-placeholder', !fService.value); clearErr('service'); clearErr('length'); });
  fLength.addEventListener('change', function () { fLength.classList.toggle('is-placeholder', !fLength.value); clearErr('length'); });

  /* ---------- errors ---------- */
  var errState = {}; // field -> dict key
  var ORDER = ['service', 'length', 'date1', 'win1', 'date2', 'win2', 'name', 'phone', 'email'];
  var CTL = { service: 'f-service', length: 'f-length', date1: 'date1', date2: 'date2', name: 'f-name', phone: 'f-phone', email: 'f-email' };
  function fieldEl(f) { return form.querySelector('[data-field="' + f + '"]'); }
  function focusTarget(f) {
    if (CTL[f]) return doc.getElementById(CTL[f]);
    var fe = fieldEl(f); if (!fe) return null;
    return fe.querySelector('input:checked:not(:disabled)') || fe.querySelector('input:not(:disabled)');
  }
  function setErr(f, key) {
    errState[f] = key;
    var p = doc.getElementById('e-' + f); if (p) p.textContent = t(key);
    var fe = fieldEl(f); if (fe) fe.classList.add('is-invalid');
    if (CTL[f]) doc.getElementById(CTL[f]).setAttribute('aria-invalid', 'true');
  }
  function clearErr(f) {
    if (!(f in errState)) return;
    delete errState[f];
    var p = doc.getElementById('e-' + f); if (p) p.textContent = '';
    var fe = fieldEl(f); if (fe) fe.classList.remove('is-invalid');
    if (CTL[f]) doc.getElementById(CTL[f]).removeAttribute('aria-invalid');
    renderSummary();
  }
  var sumBox = doc.getElementById('errSummary'), sumList = doc.getElementById('errList');
  function renderSummary() {
    var keys = ORDER.filter(function (f) { return f in errState; });
    if (!keys.length) { sumBox.hidden = true; sumList.innerHTML = ''; return; }
    sumList.innerHTML = '';
    keys.forEach(function (f) {
      var li = doc.createElement('li'), a = doc.createElement('a');
      a.href = '#' + (CTL[f] || ('e-' + f));
      a.textContent = t(errState[f]);
      a.setAttribute('data-f', f);
      li.appendChild(a); sumList.appendChild(li);
    });
  }
  sumList.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-f]'); if (!a) return;
    e.preventDefault();
    goTo(a.getAttribute('data-f'));
  });
  function goTo(f) {
    var el = focusTarget(f); if (!el) return;
    el.focus({ preventScroll: true });
    (fieldEl(f) || el).scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
  }
  function reduced() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  ['name', 'phone', 'email'].forEach(function (f) {
    doc.getElementById('f-' + f).addEventListener('input', function () { clearErr(f); });
  });

  function wins(n) { return Array.prototype.map.call(form.querySelectorAll('[name="win' + n + '"]:checked'), function (i) { return i.value; }); }

  function validate() {
    Object.keys(errState).forEach(function (f) { delete errState[f]; var p = doc.getElementById('e-' + f); if (p) p.textContent = ''; var fe = fieldEl(f); if (fe) fe.classList.remove('is-invalid'); if (CTL[f]) doc.getElementById(CTL[f]).removeAttribute('aria-invalid'); });
    var name = doc.getElementById('f-name').value.trim();
    var phone = doc.getElementById('f-phone').value.trim();
    var email = doc.getElementById('f-email').value.trim();
    if (!fService.value) setErr('service', 'er.service');
    else if (!fLength.value) setErr('length', 'er.length');
    if (!slots[1].value) setErr('date1', 'er.date1');
    if (!wins(1).length) setErr('win1', 'er.win1');
    if (slots[2].value && !wins(2).length) setErr('win2', 'er.win2');
    if (!slots[2].value && wins(2).length) setErr('date2', 'er.date2');
    if (!name) setErr('name', 'er.name');
    var digits = phone.replace(/\D/g, '');
    if (digits.length === 11 && digits[0] === '1') digits = digits.slice(1);
    if (!phone) setErr('phone', 'er.phone.empty');
    else if (digits.length !== 10 || /[^\d\s().+\-]/.test(phone)) setErr('phone', 'er.phone');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) setErr('email', 'er.email');
    renderSummary();
    return ORDER.filter(function (f) { return f in errState; });
  }

  /* ---------- the completed card ---------- */
  var lastReq = null;
  function winText(arr) { return arr.map(function (w) { return t('bk.' + w) + (en() ? ' (' + t('bk.' + w + '.s') + ')' : '（' + t('bk.' + w + '.s') + '）'); }).join(en() ? ', ' : '、'); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function row(labelKey, valueHtml) { return '<div class="card-row"><span class="lbl">' + t(labelKey) + '</span><span class="val">' + valueHtml + '</span></div>'; }
  function renderSuccess(animate) {
    if (!lastReq) return;
    var r = lastReq, s = svc(r.service), len = s.lengths.filter(function (l) { return l[0] === r.length; })[0];
    var d1 = parse(r.s1.date);
    doc.getElementById('ok-h').textContent = t('ok.h').replace('{name}', r.name);
    var second = r.s2.date ? fmtDate(parse(r.s2.date), true) + comma() + winText(r.s2.wins) : t('ok.none');
    var html =
      row('ok.for', esc(r.name)) +
      row('ok.day', '<span class="sr">' + esc(H.DAYS[I.lang][d1.getDay()]) + '</span><ol class="days" aria-hidden="true">' + H.dayStrip(d1.getDay(), true) + '</ol>') +
      row('ok.date', esc(fmtDate(d1))) +
      row('ok.time', esc(winText(r.s1.wins))) +
      row('ok.with', esc(r.prac === 'any' ? t('bk.prac.any') : t(PRAC[r.prac]))) +
      row('ok.service', esc(t(s.name) + comma() + t(len[1]) + comma() + price(s, len))) +
      row('ok.second', esc(second)) +
      row('ok.phone', '<span lang="en">' + esc(r.phone) + '</span>') +
      (r.email ? row('ok.email', '<span lang="en">' + esc(r.email) + '</span>') : '');
    doc.getElementById('ok-rows').innerHTML = html;
    doc.getElementById('ok-notyet').textContent = t('ok.notyet');
    var card = doc.getElementById('success');
    if (animate) {
      card.classList.remove('drawing'); void card.offsetWidth; card.classList.add('drawing');
    } else card.classList.remove('drawing');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    [1, 2].forEach(function (n) { if (slots[n].open) toggleCal(slots[n], false); });
    var bads = validate();
    if (bads.length) {
      sumBox.hidden = false;
      goTo(bads[0]);
      return;
    }
    lastReq = {
      name: doc.getElementById('f-name').value.trim(), phone: doc.getElementById('f-phone').value.trim(), email: doc.getElementById('f-email').value.trim(),
      service: fService.value, length: fLength.value, prac: fPrac.value,
      s1: { date: slots[1].value, wins: wins(1) }, s2: { date: slots[2].value, wins: wins(2) }
    };
    form.hidden = true;
    doc.getElementById('privacy').hidden = true;
    var ok = doc.getElementById('success');
    ok.hidden = false;
    renderSuccess(true);
    ok.focus({ preventScroll: true });
    ok.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
  });
  doc.getElementById('again').addEventListener('click', function () {
    form.reset(); lastReq = null;
    [1, 2].forEach(function (n) { setDate(slots[n], ''); });
    renderService(); renderLength(); renderPrac();
    Object.keys(errState).forEach(clearErr);
    doc.getElementById('success').hidden = true;
    doc.getElementById('privacy').hidden = false;
    form.hidden = false;
    fService.focus();
  });

  /* ---------- language ---------- */
  function applyLang() {
    form.querySelectorAll('[data-k]').forEach(function (el) { el.textContent = t(el.getAttribute('data-k')); });
    renderService(); renderLength(); renderPrac();
    [1, 2].forEach(function (n) {
      var s = slots[n];
      s.btn.querySelector('.datebtn-text').textContent = s.value ? fmtDate(parse(s.value), true) : t('bk.date.ph');
      var hrs = s.value ? H.hoursFor(parse(s.value)) : null, note = s.el.querySelector('.close-note');
      if (hrs && hrs[1] < 18) note.textContent = closeNoteText(hrs[1]);
      if (s.open) {
        var f = doc.activeElement && doc.activeElement.getAttribute && doc.activeElement.getAttribute('data-date');
        renderCal(s, f);
        var b = f && s.cal.querySelector('[data-date="' + f + '"]'); if (b) b.focus();
      }
    });
    Object.keys(errState).forEach(function (f) { var p = doc.getElementById('e-' + f); if (p) p.textContent = t(errState[f]); });
    renderSummary();
    renderSuccess(false);
  }

  /* ---------- init ---------- */
  buildSlot(1); buildSlot(2);
  renderService();
  var q = new URLSearchParams(location.search).get('service');
  if (q && svc(q)) fService.value = q;
  renderLength(); renderPrac();
  [1, 2].forEach(function (n) { setDate(slots[n], ''); });
  /* the home page's fill-in card can hand over a day and a time of day: ?date=YYYY-MM-DD&win=am|pm|eve */
  var qp = new URLSearchParams(location.search), qd = qp.get('date'), qw = qp.get('win');
  if (qd && /^\d{4}-\d{2}-\d{2}$/.test(qd) && selectable(parse(qd))) {
    setDate(slots[1], qd);
    slots[1].view = new Date(parse(qd).getFullYear(), parse(qd).getMonth(), 1);
  }
  if (qw && /^(am|pm|eve)$/.test(qw)) {
    var qbox = slots[1].el.querySelector('input[value="' + qw + '"]');
    if (qbox && !qbox.disabled) qbox.checked = true;
  }
  applyLang();
  doc.addEventListener('mp:langchange', applyLang);
})();
