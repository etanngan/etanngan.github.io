/* Maple Bridge — inquiry form: options from schedule data, validation, demo confirmation */
(function () {
  'use strict';
  var I = window.MPi18n, S = window.MB_SCHEDULE;
  if (!I || !S) return;
  var $ = function (id) { return document.getElementById(id); };
  var form = $('inq-form'), slip = $('slip');
  var qs = new URLSearchParams(location.search);
  var wanted = qs.get('class');
  var errCount = 0, sent = null, built = false;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function fmt(key, vars) { var s = I.t(key); for (var k in vars) s = s.split('{' + k + '}').join(vars[k]); return s; }
  function byId(id) { for (var i = 0; i < S.classes.length; i++) if (S.classes[i].id === id) return S.classes[i]; }
  function classLabel(c) { return I.t('day.' + c.day + '.s') + ' ' + S.fmtRange(c.time, I.lang) + ' · ' + I.pick(c.name) + ' · ' + fmt('sch.grade', { g: c.grades }); }
  function checked(name) { return Array.prototype.map.call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (i) { return i.value; }); }

  /* ---------- build / relabel controls ---------- */
  function build() {
    var grade = $('f-grade'), cls = $('f-class');
    var gv = grade.value, cv = built ? cls.value : (byId(wanted) ? wanted : '');
    var subjOn = built ? checked('subjects') : [], daysOn = built ? checked('days') : [];
    if (!built && byId(wanted)) { var w = byId(wanted); subjOn = [w.subject]; daysOn = [w.day]; }

    var h = '<option value="">' + esc(I.t('inq.grade.ph')) + '</option>';
    for (var g = 1; g <= 12; g++) h += '<option value="' + g + '">' + esc(fmt('inq.grade.opt', { g: g })) + '</option>';
    grade.innerHTML = h; grade.value = gv;

    h = '<option value="">' + esc(I.t('inq.class.none')) + '</option>';
    S.days.forEach(function (d) {
      h += '<optgroup label="' + esc(I.t('day.' + d)) + '">';
      S.classes.filter(function (c) { return c.day === d; }).forEach(function (c) { h += '<option value="' + c.id + '">' + esc(classLabel(c)) + '</option>'; });
      h += '</optgroup>';
    });
    cls.innerHTML = h; cls.value = cv;

    $('f-subjects').innerHTML = S.subjects.map(function (s) {
      return '<label class="opt"><input type="checkbox" name="subjects" value="' + s.id + '"' + (subjOn.indexOf(s.id) > -1 ? ' checked' : '') + '><span>' + esc(I.pick(s.long || s.label)) + '</span></label>';
    }).join('');
    $('f-days').innerHTML = S.days.map(function (d) {
      return '<label class="opt"><input type="checkbox" name="days" value="' + d + '"' + (daysOn.indexOf(d) > -1 ? ' checked' : '') + '><span>' + esc(I.t('day.' + d)) + '</span></label>';
    }).join('');

    if (!built) {
      $('picked').hidden = !cv;
      // preferred reply language defaults to the page language
      var def = I.lang === 'zh-Hans' ? 'cmn' : (I.lang === 'zh-Hant' ? 'yue' : 'en');
      var r = form.querySelector('input[name="lang"][value="' + def + '"]'); if (r) r.checked = true;
    }
    built = true;
    if (errCount) summary();
    if (sent) showSlip();
  }

  /* ---------- validation ---------- */
  function setErr(field, errId, key) {
    var el = $(errId);
    if (key) { el.setAttribute('data-i18n', key); el.textContent = I.t(key); el.hidden = false; }
    else { el.removeAttribute('data-i18n'); el.textContent = ''; el.hidden = true; }
    if (field) field.setAttribute('aria-invalid', key ? 'true' : 'false');
    return key ? 1 : 0;
  }
  function digits(v) { return v.replace(/\D/g, ''); }
  function phoneOk(v) { var d = digits(v); return (d.length === 10 || (d.length === 11 && d[0] === '1')) && !/[^\d\s()+.\-]/.test(v); }
  function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  function validate() {
    var n = 0;
    var name = $('f-name'), phone = $('f-phone'), email = $('f-email'), grade = $('f-grade'), consent = $('f-consent');
    var pv = phone.value.trim(), ev = email.value.trim(), method = checked('method')[0];
    n += setErr(name, 'e-name', name.value.trim() ? null : 'inq.e.name');
    var none = !pv && !ev;
    n += setErr(null, 'e-contact', none ? 'inq.e.contact' : null);
    n += setErr(phone, 'e-phone', pv && !phoneOk(pv) ? 'inq.e.phone' : null);
    n += setErr(email, 'e-email', ev && !emailOk(ev) ? 'inq.e.email' : null);
    if (none) { phone.setAttribute('aria-invalid', 'true'); email.setAttribute('aria-invalid', 'true'); }
    var mErr = null;
    if (!none && (method === 'call' || method === 'text') && !pv) mErr = 'inq.e.needphone';
    if (!none && method === 'email' && !ev) mErr = 'inq.e.needemail';
    n += setErr(null, 'e-method', mErr);
    n += setErr(grade, 'e-grade', grade.value ? null : 'inq.e.grade');
    n += setErr(consent, 'e-consent', consent.checked ? null : 'inq.e.consent');
    $('consent-box').classList.toggle('is-bad', !consent.checked);
    errCount = n;
    return n;
  }
  function summary() {
    var box = $('errsum');
    if (!errCount) { box.hidden = true; box.textContent = ''; return; }
    box.textContent = errCount === 1 ? I.t('inq.e.summary1') : fmt('inq.e.summaryn', { n: errCount });
    box.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = validate();
    summary();
    if (n) {
      var first = form.querySelector('[aria-invalid="true"]') || $('errsum');
      first.focus();
      return;
    }
    sent = {
      name: $('f-name').value.trim(), phone: $('f-phone').value.trim(), email: $('f-email').value.trim(),
      lang: checked('lang')[0] || 'en', grade: $('f-grade').value, subjects: checked('subjects'), cls: $('f-class').value,
      days: checked('days'), method: checked('method')[0] || '', message: $('f-msg').value.trim()
    };
    form.hidden = true;
    showSlip();
    slip.focus();
    window.scrollTo({ top: slip.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
  });
  // clear a field's error as soon as it's fixed (after a first submit)
  form.addEventListener('input', function () { if (errCount) { validate(); summary(); } });
  form.addEventListener('change', function () { if (errCount) { validate(); summary(); } });

  /* ---------- confirmation slip ---------- */
  function showSlip() {
    var d = sent, none = I.t('inq.ok.none');
    var langName = I.t('inq.lang.' + d.lang);
    var method = d.method || (d.phone ? 'call' : 'email');
    var subj = d.subjects.map(function (id) { for (var i = 0; i < S.subjects.length; i++) if (S.subjects[i].id === id) return I.pick(S.subjects[i].long || S.subjects[i].label); }).join(I.lang === 'en' ? ', ' : '、');
    var c = byId(d.cls);
    var rows = [
      ['inq.name', d.name],
      ['inq.ok.l.contact', [d.phone, d.email].filter(Boolean).join(' · ')],
      ['inq.lang', langName],
      ['inq.grade', fmt('inq.grade.opt', { g: d.grade })],
      ['inq.subjects', subj || none],
      ['inq.class', c ? classLabel(c) : none],
      ['inq.days', d.days.length ? d.days.map(function (x) { return I.t('day.' + x); }).join(I.lang === 'en' ? ', ' : '、') : none],
      ['inq.method', d.method ? I.t('inq.method.' + d.method) : none],
      ['inq.msg', d.message || none]
    ];
    slip.innerHTML =
      '<svg class="slip__stamp" viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="38" fill="none" stroke="#E5432D" stroke-width="3" stroke-dasharray="5 4"/><circle cx="42" cy="42" r="30" fill="#FFF1ED" stroke="#E5432D" stroke-width="2.5"/><path d="M28 43l10 10 19-22" fill="none" stroke="#E5432D" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<p class="kicker">' + esc(I.t('inq.ok.kicker')) + '</p>' +
      '<h2>' + esc(fmt('inq.ok.h', { name: d.name })) + '</h2>' +
      '<p class="slip__demo">' + I.t('inq.ok.demo') + '</p>' +
      '<dl>' + rows.map(function (r) { return '<div><dt>' + esc(I.t(r[0])) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>' +
      '<p class="slip__real">' + esc(fmt('inq.ok.real', { lang: langName, method: I.t('inq.ok.m.' + method) })) + '</p>' +
      '<div class="hero__cta"><button type="button" class="btn btn--yellow" id="again">' + esc(I.t('inq.ok.again')) + '</button><a class="btn" href="schedule.html">' + esc(I.t('inq.ok.back')) + '</a></div>';
    slip.hidden = false;
    $('again').addEventListener('click', function () {
      sent = null; errCount = 0; form.reset(); built = false; wanted = null;
      form.querySelectorAll('[aria-invalid]').forEach(function (x) { x.removeAttribute('aria-invalid'); });
      ['e-name', 'e-contact', 'e-phone', 'e-email', 'e-method', 'e-grade', 'e-consent'].forEach(function (id) { setErr(null, id, null); });
      $('consent-box').classList.remove('is-bad'); summary();
      build(); slip.hidden = true; form.hidden = false; $('f-name').focus();
    });
  }

  document.addEventListener('mp:langchange', build);
  if (document.documentElement.classList.contains('i18n-ready')) build();
})();
