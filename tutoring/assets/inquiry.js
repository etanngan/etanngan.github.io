/* Maple Bridge: trial-class / inquiry form. Options come from the timetable data; a class picked on the
   timetable (?class=id&topic=trial|wait) is carried in. Errors are written in red pen beside the field. */
(function () {
  'use strict';
  var I = window.MPi18n, S = window.MB_SCHEDULE;
  if (!I || !S) return;
  var $ = function (id) { return document.getElementById(id); };
  var form = $('inq-form'), slip = $('slip');
  var qs = new URLSearchParams(location.search);
  var errCount = 0, sent = null, built = false;
  var TICK = '<svg class="tick" viewBox="0 0 24 22" aria-hidden="true" focusable="false"><path d="M3 12.5l5.5 6.5L21.5 2.5"/></svg>';

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function fmt(key, vars) { var s = I.t(key); for (var k in vars) s = s.split('{' + k + '}').join(vars[k]); return s; }
  function byId(id) { for (var i = 0; i < S.classes.length; i++) if (S.classes[i].id === id) return S.classes[i]; }
  function sep() { return I.lang === 'en' ? ', ' : '，'; }
  function list() { return I.lang === 'en' ? ', ' : '、'; }
  function classLabel(c) { return I.t('day.' + c.day + '.s') + ' ' + S.fmtRange(c.time, I.lang) + sep() + I.pick(c.name) + sep() + fmt(c.lo === c.hi ? 'sch.grade' : 'sch.grades', { g: c.grades }); }
  function checked(name) { return Array.prototype.map.call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (i) { return i.value; }); }

  /* ---------- what came in from the link ---------- */
  var wanted = byId(qs.get('class')) || null;
  var topic = qs.get('topic');
  if (topic === 'assessment') topic = 'trial';
  if (['trial', 'class', 'wait', 'other'].indexOf(topic) < 0) topic = wanted ? (wanted.left === 0 ? 'wait' : 'trial') : 'trial';
  $('f-topic').value = topic;

  function submitLabel() {
    var b = $('submit'), key = $('f-topic').value === 'trial' ? 'cta' : 'inq.submit.ask';
    b.setAttribute('data-i18n', key); b.textContent = I.t(key);
  }
  $('f-topic').addEventListener('change', submitLabel);

  /* ---------- build / relabel the controls (again on every language switch) ---------- */
  function build() {
    var grade = $('f-grade'), cls = $('f-class');
    var gv = built ? grade.value : (wanted && wanted.lo === wanted.hi ? String(wanted.lo) : '');
    var cv = built ? cls.value : (wanted ? wanted.id : '');
    var subjOn = built ? checked('subjects') : (wanted ? [wanted.subject] : []);
    var daysOn = built ? checked('days') : (wanted ? [wanted.day] : []);

    var h = '<option value="">' + esc(I.t('inq.grade.ph')) + '</option>';
    for (var g = 1; g <= 12; g++) h += '<option value="' + g + '">' + esc(I.t('grade.' + g)) + '</option>';
    grade.innerHTML = h; grade.value = gv;

    h = '<option value="">' + esc(I.t('inq.class.none')) + '</option>';
    S.days.forEach(function (d) {
      h += '<optgroup label="' + esc(I.t('day.' + d)) + '">';
      S.classes.filter(function (c) { return c.day === d; }).forEach(function (c) {
        h += '<option value="' + c.id + '">' + esc(classLabel(c)) + (c.left === 0 ? esc(sep() + I.t('sch.full')) : '') + '</option>';
      });
      h += '</optgroup>';
    });
    cls.innerHTML = h; cls.value = cv;

    $('f-subjects').innerHTML = S.subjects.map(function (s) {
      return '<label class="opt"><input type="checkbox" name="subjects" value="' + s.id + '"' + (subjOn.indexOf(s.id) > -1 ? ' checked' : '') + '><span>' + esc(I.pick(s.label)) + '</span></label>';
    }).join('');
    $('f-days').innerHTML = S.days.map(function (d) {
      return '<label class="opt"><input type="checkbox" name="days" value="' + d + '"' + (daysOn.indexOf(d) > -1 ? ' checked' : '') + '><span>' + esc(I.t('day.' + d)) + '</span></label>';
    }).join('');

    if (!built) {
      $('picked').hidden = !cv;
      var def = I.lang === 'zh-Hans' ? 'cmn' : (I.lang === 'zh-Hant' ? 'yue' : 'en');
      var r = form.querySelector('input[name="lang"][value="' + def + '"]'); if (r) r.checked = true;
    }
    built = true;
    submitLabel();
    if (errCount) summary();
    if (sent) showSlip();
  }
  $('f-class').addEventListener('change', function () { $('picked').hidden = true; });

  /* ---------- checking ---------- */
  function setErr(field, errId, key) {
    var el = $(errId);
    if (key) { el.setAttribute('data-i18n', key); el.textContent = I.t(key); el.hidden = false; }
    else { el.removeAttribute('data-i18n'); el.textContent = ''; el.hidden = true; }
    if (field) field.setAttribute('aria-invalid', key ? 'true' : 'false');
    return key ? 1 : 0;
  }
  function phoneOk(v) { var d = v.replace(/\D/g, ''); return (d.length === 10 || (d.length === 11 && d[0] === '1')) && !/[^\d\s()+.\-]/.test(v); }
  function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function validate() {
    var n = 0, name = $('f-name'), phone = $('f-phone'), email = $('f-email'), grade = $('f-grade');
    var pv = phone.value.trim(), ev = email.value.trim(), none = !pv && !ev;
    n += setErr(name, 'e-name', name.value.trim() ? null : 'inq.e.name');
    n += setErr(null, 'e-contact', none ? 'inq.e.contact' : null);
    n += setErr(phone, 'e-phone', pv && !phoneOk(pv) ? 'inq.e.phone' : null);
    n += setErr(email, 'e-email', ev && !emailOk(ev) ? 'inq.e.email' : null);
    if (none) { phone.setAttribute('aria-invalid', 'true'); email.setAttribute('aria-invalid', 'true'); }
    n += setErr(grade, 'e-grade', grade.value ? null : 'inq.e.grade');
    errCount = n;
    return n;
  }
  function summary() {
    var box = $('errsum');
    if (!errCount) { box.hidden = true; box.innerHTML = ''; return; }
    box.innerHTML = errCount === 1 ? I.t('inq.e.summary1') : fmt('inq.e.summaryn', { n: errCount });
    box.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = validate();
    summary();
    if (n) { (form.querySelector('[aria-invalid="true"]') || $('errsum')).focus(); return; }
    sent = {
      topic: $('f-topic').value, name: $('f-name').value.trim(), phone: $('f-phone').value.trim(), email: $('f-email').value.trim(),
      lang: checked('lang')[0] || 'en', grade: $('f-grade').value, subjects: checked('subjects'), cls: $('f-class').value,
      days: checked('days'), message: $('f-msg').value.trim()
    };
    form.hidden = true;
    showSlip();
    slip.focus();
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: slip.getBoundingClientRect().top + window.pageYOffset - 90, behavior: reduce ? 'auto' : 'smooth' });
  });
  form.addEventListener('input', function () { if (errCount) { validate(); summary(); } });
  form.addEventListener('change', function () { if (errCount) { validate(); summary(); } });

  /* ---------- confirmation: the page comes back marked ---------- */
  function showSlip() {
    var d = sent, none = I.t('inq.ok.none'), langName = I.t('inq.lang.' + d.lang), c = byId(d.cls);
    var subj = d.subjects.map(function (id) { for (var i = 0; i < S.subjects.length; i++) if (S.subjects[i].id === id) return I.pick(S.subjects[i].label); }).join(list());
    var rows = [
      ['inq.ok.l.topic', I.t('inq.topic.' + d.topic)],
      ['inq.name', d.name],
      ['inq.ok.l.contact', [d.phone, d.email].filter(Boolean).join(sep())],
      ['inq.lang', langName],
      ['inq.grade', I.t('grade.' + d.grade)],
      ['inq.subjects', subj || none],
      ['inq.class', c ? classLabel(c) : none],
      ['inq.days', d.days.length ? d.days.map(function (x) { return I.t('day.' + x); }).join(list()) : none],
      ['inq.msg', d.message || none]
    ];
    slip.innerHTML =
      '<h2>' + TICK + '<span>' + esc(fmt('inq.ok.h', { name: d.name })) + '</span></h2>' +
      '<p>' + esc(fmt(d.phone ? 'inq.ok.real.phone' : 'inq.ok.real.email', { lang: langName })) + '</p>' +
      '<p class="small">' + esc(I.t('inq.ok.demo')) + '</p>' +
      '<dl>' + rows.map(function (r) { return '<div><dt>' + esc(I.t(r[0])) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>' +
      '<div class="acts"><button type="button" class="btn-plain" id="again">' + esc(I.t('inq.ok.again')) + '</button>' +
      '<a class="link-sec" href="schedule.html">' + esc(I.t('inq.ok.back')) + '</a></div>';
    slip.hidden = false;
    $('again').addEventListener('click', function () {
      sent = null; errCount = 0; form.reset(); built = false; wanted = null;
      form.querySelectorAll('[aria-invalid]').forEach(function (x) { x.removeAttribute('aria-invalid'); });
      ['e-name', 'e-contact', 'e-phone', 'e-email', 'e-grade'].forEach(function (id) { setErr(null, id, null); });
      summary(); $('f-topic').value = 'trial';
      build(); slip.hidden = true; form.hidden = false; $('f-name').focus();
    });
  }

  document.addEventListener('mp:langchange', build);
  if (document.documentElement.classList.contains('i18n-ready')) build();
})();
