/* Stillwater — booking REQUEST form. Collects no health information. Nothing is sent or stored. */
(function () {
  'use strict';
  var I = window.MPi18n, doc = document;
  var form = doc.getElementById('bookForm');
  if (!form || !I) return;
  function T(en, a, b) { return { en: en, 'zh-Hant': a, 'zh-Hans': b }; }
  var t = function (k) { return I.t(k); };

  /* ---------- data ---------- */
  var PRAC = {
    mc: T('Mei-Ling Cheung, RMT', '張美玲（註冊按摩治療師）', '张美玲（注册按摩治疗师）'),
    dh: T('Daniel Ho, RMT', '何俊文（註冊按摩治療師）', '何俊文（注册按摩治疗师）'),
    wz: T('Wen Zhao, R.Ac', '趙雯（註冊針灸師）', '赵雯（注册针灸师）'),
    jl: T('Jonathan Lau, Registered Physiotherapist', '劉卓賢（註冊物理治療師）', '刘卓贤（注册物理治疗师）'),
    sm: T('Sofia Marchetti, Osteopathic Manual Practitioner', 'Sofia Marchetti（整骨手法治療師）', 'Sofia Marchetti（整骨手法治疗师）')
  };
  var SERVICES = [
    { id: 'massage', name: T('Registered massage therapy', '註冊按摩治療', '注册按摩治疗'), prac: ['mc', 'dh'], lengths: [
      { id: '30', l: T('30 minutes', '30 分鐘', '30 分钟'), fee: 70 },
      { id: '45', l: T('45 minutes', '45 分鐘', '45 分钟'), fee: 95 },
      { id: '60', l: T('60 minutes', '60 分鐘', '60 分钟'), fee: 120 },
      { id: '60p', l: T('60 minutes, prenatal', '60 分鐘（產前按摩）', '60 分钟（孕期按摩）'), fee: 120 },
      { id: '90', l: T('90 minutes', '90 分鐘', '90 分钟'), fee: 165 } ] },
    { id: 'acupuncture', name: T('Acupuncture', '針灸', '针灸'), prac: ['wz'], lengths: [
      { id: '75f', l: T('First visit, 75 minutes', '首次到診，75 分鐘', '初次，75 分钟'), fee: 125 },
      { id: '45', l: T('45 minutes', '45 分鐘', '45 分钟'), fee: 85 },
      { id: '60', l: T('60 minutes', '60 分鐘', '60 分钟'), fee: 105 },
      { id: '60c', l: T('60 minutes with cupping', '60 分鐘，加配拔罐', '60 分钟，加拔罐'), fee: 125 } ] },
    { id: 'physio', name: T('Physiotherapy', '物理治療', '物理治疗'), prac: ['jl'], lengths: [
      { id: '60f', l: T('First assessment, 60 minutes', '首次評估，60 分鐘', '初次评估，60 分钟'), fee: 130 },
      { id: '30', l: T('Follow-up, 30 minutes', '覆診，30 分鐘', '复诊，30 分钟'), fee: 80 },
      { id: '45', l: T('Follow-up, 45 minutes', '覆診，45 分鐘', '复诊，45 分钟'), fee: 105 } ] },
    { id: 'osteo', name: T('Osteopathic manual therapy', '整骨手法治療', '整骨手法'), prac: ['sm'], lengths: [
      { id: '60f', l: T('First visit, 60 minutes', '首次到診，60 分鐘', '初次，60 分钟'), fee: 125 },
      { id: '30', l: T('30 minutes', '30 分鐘', '30 分钟'), fee: 75 },
      { id: '45', l: T('45 minutes', '45 分鐘', '45 分钟'), fee: 100 } ] }
  ];
  function svc(id) { for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].id === id) return SERVICES[i]; return null; }

  // Closed: Sundays + Ontario statutory holidays in the booking window
  var HOLIDAYS = ['2026-12-25', '2026-12-26', '2027-01-01', '2027-02-15', '2027-03-26', '2027-05-24', '2027-07-01', '2027-08-02', '2027-09-06', '2027-10-11', '2027-12-25', '2027-12-27'];
  var MAX_DAYS = 84;

  /* ---------- dates ---------- */
  function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var minD = new Date(today); minD.setDate(minD.getDate() + 1);
  var maxD = new Date(today); maxD.setDate(maxD.getDate() + MAX_DAYS);
  function isOpen(d) { return d.getDay() !== 0 && HOLIDAYS.indexOf(ymd(d)) < 0; }
  function selectable(d) { return d >= minD && d <= maxD && isOpen(d); }
  var DOW = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], 'zh-Hant': ['日', '一', '二', '三', '四', '五', '六'], 'zh-Hans': ['日', '一', '二', '三', '四', '五', '六'] };
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONF = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function fmtDate(d) {
    var L = I.lang;
    if (L === 'en') return DOW.en[d.getDay()] + ', ' + MON[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    var w = L === 'zh-Hant' ? '星期' + DOW[L][d.getDay()] : '周' + DOW[L][d.getDay()];
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日（' + w + '）';
  }
  function fmtMonth(y, m) { return I.lang === 'en' ? MONF[m] + ' ' + y : y + '年' + (m + 1) + '月'; }

  /* ---------- slots (date picker + time-of-day chips) ---------- */
  var slots = {};
  var ICON_CAL = '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><rect x="1.5" y="3" width="15" height="13.5" rx="2.5"/><path d="M1.5 7.5h15M5.5 1v4M12.5 1v4"/></svg>';
  function buildSlot(n) {
    var el = form.querySelector('[data-slot="' + n + '"]');
    var s = { n: n, el: el, value: '', view: new Date(minD.getFullYear(), minD.getMonth(), 1), open: false };
    el.innerHTML =
      '<p class="slot-title"><span data-k="' + (n === 1 ? 'bk.slot1' : 'bk.slot2') + '"></span>' + (n === 2 ? ' <span class="opt" data-k="bk.opt"></span>' : '') + '</p>' +
      '<div class="field" data-field="date' + n + '">' +
        '<span class="label" id="dl' + n + '" data-k="bk.date"></span>' +
        '<button type="button" class="datebtn is-empty" id="date' + n + '" aria-haspopup="true" aria-expanded="false" aria-controls="cal' + n + '" aria-describedby="e-date' + n + '"><span class="datebtn-text"></span>' + ICON_CAL + '</button>' +
        '<div class="cal" id="cal' + n + '" hidden></div>' +
        '<p class="err" id="e-date' + n + '" aria-live="polite"></p>' +
      '</div>' +
      '<div class="field" data-field="win' + n + '">' +
        '<span class="label" id="wl' + n + '"><span data-k="bk.tod"></span> <span class="opt" data-k="bk.tod.help"></span></span>' +
        '<div class="chips" role="group" aria-labelledby="wl' + n + '" aria-describedby="e-win' + n + '">' +
          ['am', 'pm', 'eve'].map(function (w) { return '<label class="chip"><input type="checkbox" name="win' + n + '" value="' + w + '"><span><b data-k="bk.' + w + '" style="font-weight:500"></b> <small data-k="bk.' + w + '.s"></small></span></label>'; }).join('') +
        '</div>' +
        '<p class="help sat-note" hidden data-k="bk.eve.sat"></p>' +
        '<p class="err" id="e-win' + n + '" aria-live="polite"></p>' +
      '</div>';
    s.btn = el.querySelector('.datebtn');
    s.cal = el.querySelector('.cal');
    s.btn.addEventListener('click', function () { toggleCal(s, !s.open); });
    el.addEventListener('change', function () { clearErr('win' + n); if (n === 2) clearErr('date2'); });
    slots[n] = s;
    return s;
  }
  function toggleCal(s, open) {
    s.open = open;
    s.cal.hidden = !open;
    s.btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      if (s.value) { var v = parse(s.value); s.view = new Date(v.getFullYear(), v.getMonth(), 1); }
      renderCal(s);
      var f = s.cal.querySelector('.cal-day[aria-pressed="true"]') || s.cal.querySelector('.cal-day:not(:disabled)');
      if (f) f.focus();
    }
  }
  function renderCal(s) {
    var y = s.view.getFullYear(), m = s.view.getMonth();
    var first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
    var prevOk = new Date(y, m, 0) >= minD, nextOk = new Date(y, m + 1, 1) <= maxD;
    var h = '<div class="cal-head"><button type="button" class="cal-nav" data-nav="-1" aria-label="' + t('cal.prev') + '"' + (prevOk ? '' : ' disabled') + '><svg viewBox="0 0 9 14" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M8 1L2 7l6 6"/></svg></button>' +
      '<span class="cal-title" aria-live="polite">' + fmtMonth(y, m) + '</span>' +
      '<button type="button" class="cal-nav" data-nav="1" aria-label="' + t('cal.next') + '"' + (nextOk ? '' : ' disabled') + '><svg viewBox="0 0 9 14" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1 1l6 6-6 6"/></svg></button></div>';
    h += '<div class="cal-grid" role="grid">';
    DOW[I.lang].forEach(function (d) { h += '<span class="cal-dow" aria-hidden="true">' + d + '</span>'; });
    for (var i = 0; i < first.getDay(); i++) h += '<span></span>';
    for (var d = 1; d <= days; d++) {
      var dt = new Date(y, m, d), ok = selectable(dt), key = ymd(dt);
      var closed = !isOpen(dt);
      h += '<button type="button" class="cal-day' + (closed ? ' is-closed' : '') + '" data-date="' + key + '"' + (ok ? '' : ' disabled') +
        ' aria-pressed="' + (s.value === key) + '" aria-label="' + fmtDate(dt) + (closed ? (I.lang === 'en' ? ', ' : '，') + t('cal.closed') : '') + '">' + d + '</button>';
    }
    h += '</div><p class="cal-foot">' + t('cal.foot') + '</p>';
    s.cal.innerHTML = h;
  }
  function setDate(s, key) {
    s.value = key;
    var txt = s.btn.querySelector('.datebtn-text');
    s.btn.classList.toggle('is-empty', !key);
    txt.textContent = key ? fmtDate(parse(key)) : t('bk.date.ph');
    // Saturday: no evening window
    var sat = key && parse(key).getDay() === 6;
    var eve = s.el.querySelector('input[value="eve"]');
    eve.disabled = !!sat; if (sat) eve.checked = false;
    s.el.querySelector('.sat-note').hidden = !sat;
    clearErr('date' + s.n);
    if (s.n === 2) clearErr('win2');
  }
  doc.addEventListener('click', function (e) {
    var day = e.target.closest('.cal-day');
    var nav = e.target.closest('.cal-nav');
    var slotEl = e.target.closest('.slot');
    if (!slotEl) { [1, 2].forEach(function (n) { if (slots[n] && slots[n].open) toggleCal(slots[n], false); }); return; }
    var s = slots[slotEl.getAttribute('data-slot')];
    if (nav && !nav.disabled) { s.view = new Date(s.view.getFullYear(), s.view.getMonth() + (+nav.getAttribute('data-nav')), 1); renderCal(s); var b = s.cal.querySelector('[data-nav="' + nav.getAttribute('data-nav') + '"]'); if (b && !b.disabled) b.focus(); else s.cal.querySelector('.cal-nav:not(:disabled)') && s.cal.querySelector('.cal-nav:not(:disabled)').focus(); }
    else if (day && !day.disabled) { setDate(s, day.getAttribute('data-date')); toggleCal(s, false); s.btn.focus(); }
  });
  doc.addEventListener('keydown', function (e) {
    var cal = e.target.closest && e.target.closest('.cal');
    if (!cal) return;
    var s = slots[cal.closest('.slot').getAttribute('data-slot')];
    if (e.key === 'Escape') { toggleCal(s, false); s.btn.focus(); return; }
    if (!e.target.classList.contains('cal-day')) return;
    var step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!step) return;
    e.preventDefault();
    var d = parse(e.target.getAttribute('data-date'));
    for (var i = 0; i < 14; i++) { d.setDate(d.getDate() + step); if (selectable(d) || d < minD || d > maxD) break; }
    if (d < minD || d > maxD) return;
    if (d.getMonth() !== s.view.getMonth()) { s.view = new Date(d.getFullYear(), d.getMonth(), 1); renderCal(s); }
    var b = s.cal.querySelector('[data-date="' + ymd(d) + '"]'); if (b && !b.disabled) b.focus();
  });

  /* ---------- selects ---------- */
  var fService = doc.getElementById('f-service'), fLength = doc.getElementById('f-length'), fPrac = doc.getElementById('f-prac');
  function opt(v, label, sel, dis) { var o = doc.createElement('option'); o.value = v; o.textContent = label; if (sel) o.selected = true; if (dis) { o.disabled = true; } return o; }
  function renderService() {
    var cur = fService.value;
    fService.innerHTML = '';
    fService.appendChild(opt('', t('bk.service.ph'), !cur, true));
    SERVICES.forEach(function (s) { fService.appendChild(opt(s.id, I.pick(s.name), s.id === cur)); });
  }
  function renderLength() {
    var s = svc(fService.value), cur = fLength.value;
    fLength.innerHTML = '';
    if (!s) { fLength.appendChild(opt('', t('bk.length.wait'), true)); fLength.disabled = true; return; }
    fLength.disabled = false;
    var keep = s.lengths.some(function (l) { return l.id === cur; });
    fLength.appendChild(opt('', t('bk.length.ph'), !keep, true));
    s.lengths.forEach(function (l) { fLength.appendChild(opt(l.id, I.pick(l.l) + (I.lang === 'en' ? ', $' : '，$') + l.fee, keep && l.id === cur)); });
  }
  function renderPrac() {
    var s = svc(fService.value), cur = fPrac.value;
    fPrac.innerHTML = '';
    fPrac.appendChild(opt('any', t('bk.prac.any'), true));
    var ids = s ? s.prac : Object.keys(PRAC);
    ids.forEach(function (id) { fPrac.appendChild(opt(id, I.pick(PRAC[id]), id === cur)); });
  }
  fService.addEventListener('change', function () { renderLength(); renderPrac(); clearErr('service'); clearErr('length'); });
  fLength.addEventListener('change', function () { clearErr('length'); });

  /* ---------- errors ---------- */
  var errState = {}; // field -> dict key
  function fieldEl(f) { return form.querySelector('[data-field="' + f + '"]'); }
  function setErr(f, key) {
    errState[f] = key;
    var p = doc.getElementById('e-' + f); if (p) p.textContent = t(key);
    var fe = fieldEl(f); if (fe) fe.classList.add('is-invalid');
    var ctl = ctlFor(f); if (ctl) ctl.setAttribute('aria-invalid', 'true');
  }
  function clearErr(f) {
    delete errState[f];
    var p = doc.getElementById('e-' + f); if (p) p.textContent = '';
    var fe = fieldEl(f); if (fe) fe.classList.remove('is-invalid');
    var ctl = ctlFor(f); if (ctl) ctl.removeAttribute('aria-invalid');
    if (!Object.keys(errState).length) doc.getElementById('errSummary').hidden = true;
  }
  function ctlFor(f) {
    return ({ name: 'f-name', phone: 'f-phone', email: 'f-email', service: 'f-service', length: 'f-length', consent: 'f-consent', date1: 'date1', date2: 'date2' })[f] ? doc.getElementById(({ name: 'f-name', phone: 'f-phone', email: 'f-email', service: 'f-service', length: 'f-length', consent: 'f-consent', date1: 'date1', date2: 'date2' })[f]) : null;
  }
  function focusTarget(f) {
    if (f === 'contact') return doc.getElementById('f-phone');
    var c = ctlFor(f); if (c) return c;
    var fe = fieldEl(f); return fe && fe.querySelector('input:not(:disabled)');
  }
  ['name', 'phone', 'email'].forEach(function (f) {
    doc.getElementById('f-' + f).addEventListener('input', function () { clearErr(f); if (f !== 'name') clearErr('contact'); });
  });
  form.addEventListener('change', function (e) {
    var n = e.target.name;
    if (n === 'lang' || n === 'visitor' || n === 'consent') clearErr(n);
    if (n === 'confirm') clearErr('confirm');
  });

  function val(name) { var el = form.querySelector('[name="' + name + '"]:checked'); return el ? el.value : ''; }
  function wins(n) { return Array.prototype.map.call(form.querySelectorAll('[name="win' + n + '"]:checked'), function (i) { return i.value; }); }

  function validate() {
    Object.keys(errState).forEach(clearErr);
    var order = [];
    function bad(f, k) { setErr(f, k); order.push(f); }
    var name = doc.getElementById('f-name').value.trim();
    var phone = doc.getElementById('f-phone').value.trim();
    var email = doc.getElementById('f-email').value.trim();
    if (!name) bad('name', 'er.name');
    var digits = phone.replace(/\D/g, '');
    if (digits.length === 11 && digits[0] === '1') digits = digits.slice(1);
    var phoneOk = phone && digits.length === 10 && !/[^\d\s().+\-]/.test(phone);
    var emailOk = email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (!phone && !email) bad('contact', 'er.contact');
    if (phone && !phoneOk) bad('phone', 'er.phone');
    if (email && !emailOk) bad('email', 'er.email');
    if (!val('lang')) bad('lang', 'er.lang');
    if (!fService.value) bad('service', 'er.service');
    else if (!fLength.value) bad('length', 'er.length');
    if (!val('visitor')) bad('visitor', 'er.visitor');
    if (!slots[1].value) bad('date1', 'er.date1');
    if (!wins(1).length) bad('win1', 'er.win1');
    if (slots[2].value && !wins(2).length) bad('win2', 'er.win2');
    if (!slots[2].value && wins(2).length) bad('date2', 'er.date2');
    var c = val('confirm');
    if (!c) bad('confirm', 'er.confirm');
    else if ((c === 'call' || c === 'text') && !phone) bad('confirm', 'er.needphone');
    else if (c === 'email' && !email) bad('confirm', 'er.needemail');
    if (!doc.getElementById('f-consent').checked) bad('consent', 'er.consent');
    return order;
  }

  /* ---------- success ---------- */
  var lastReq = null;
  var LANGN = { en: 'lg.en', yue: 'lg.yue', cmn: 'lg.cmn' };
  var CONF = { call: 'bk.c.call', text: 'bk.c.text', email: 'bk.c.email' };
  function winText(arr) { return arr.map(function (w) { return t('bk.' + w); }).join(I.lang === 'en' ? ', ' : '、'); }
  function slotText(s) { return s.date ? fmtDate(parse(s.date)) + (I.lang === 'en' ? ', ' : '，') + winText(s.wins) : t('ok.none'); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function renderSuccess() {
    if (!lastReq) return;
    var r = lastReq, s = svc(r.service), len = s.lengths.filter(function (l) { return l.id === r.length; })[0];
    doc.getElementById('ok-h').textContent = t('ok.h').replace('{name}', r.name);
    doc.getElementById('ok-p').textContent = t('ok.p.' + r.confirm);
    var contact = r.confirm === 'email' ? r.email : r.phone;
    var rows = [
      ['ok.service', I.pick(s.name)],
      ['ok.length', I.pick(len.l) + (I.lang === 'en' ? ', $' : '，$') + len.fee],
      ['ok.prac', r.prac === 'any' ? t('bk.prac.any') : I.pick(PRAC[r.prac])],
      ['ok.visitor', t(r.visitor === 'new' ? 'bk.new' : 'bk.returning')],
      ['ok.first', slotText(r.s1)],
      ['ok.second', slotText(r.s2)],
      ['ok.confirm', t(CONF[r.confirm]) + (I.lang === 'en' ? ', ' : '，') + contact],
      ['ok.lang', t(LANGN[r.lang])]
    ];
    doc.getElementById('ok-sum').innerHTML = rows.map(function (x) { return '<div><dt>' + t(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd></div>'; }).join('');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bads = validate();
    var sum = doc.getElementById('errSummary');
    if (bads.length) {
      sum.hidden = false;
      var f = focusTarget(bads[0]);
      if (f) { f.focus({ preventScroll: true }); var fe = fieldEl(bads[0]) || f; fe.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      return;
    }
    sum.hidden = true;
    lastReq = {
      name: doc.getElementById('f-name').value.trim(), phone: doc.getElementById('f-phone').value.trim(), email: doc.getElementById('f-email').value.trim(),
      lang: val('lang'), service: fService.value, length: fLength.value, prac: fPrac.value, visitor: val('visitor'),
      s1: { date: slots[1].value, wins: wins(1) }, s2: { date: slots[2].value, wins: wins(2) }, confirm: val('confirm')
    };
    renderSuccess();
    form.hidden = true;
    var ok = doc.getElementById('success');
    ok.hidden = false;
    ok.scrollIntoView({ block: 'start', behavior: 'smooth' });
    ok.focus({ preventScroll: true });
  });
  doc.getElementById('again').addEventListener('click', function () {
    form.reset(); lastReq = null;
    [1, 2].forEach(function (n) { setDate(slots[n], ''); });
    renderService(); renderLength(); renderPrac();
    Object.keys(errState).forEach(clearErr);
    doc.getElementById('success').hidden = true; form.hidden = false;
    doc.getElementById('f-name').focus();
  });

  /* ---------- i18n ---------- */
  function applyLang() {
    form.querySelectorAll('[data-k]').forEach(function (el) { el.textContent = t(el.getAttribute('data-k')); });
    renderService(); renderLength(); renderPrac();
    [1, 2].forEach(function (n) { var s = slots[n]; s.btn.querySelector('.datebtn-text').textContent = s.value ? fmtDate(parse(s.value)) : t('bk.date.ph'); if (s.open) renderCal(s); });
    Object.keys(errState).forEach(function (f) { var p = doc.getElementById('e-' + f); if (p) p.textContent = t(errState[f]); });
    renderSuccess();
  }

  /* ---------- init ---------- */
  buildSlot(1); buildSlot(2);
  renderService();
  var q = new URLSearchParams(location.search).get('service');
  if (q && svc(q)) fService.value = q;
  renderLength(); renderPrac();
  [1, 2].forEach(function (n) { setDate(slots[n], ''); });
  applyLang();
  doc.addEventListener('mp:langchange', applyLang);
})();
