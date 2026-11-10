/* Jade Basket: header menu, today's hours, dishes from menu-data.js, full menu, QR code, map language. No animation library. */
(function () {
  'use strict';
  var T = function (k) { return MPi18n.t(k); };
  var JB = window.JB;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- phone-width menu ---------- */
  var burger = document.querySelector('.burger'), nav = document.getElementById('nav');
  function setNav(open) {
    if (!burger) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('data-i18n-attr', 'aria-label:' + (open ? 'nav.close' : 'nav.open'));
    burger.setAttribute('aria-label', T(open ? 'nav.close' : 'nav.open'));
    document.body.classList.toggle('nav-open', open);
  }
  if (burger && nav) {
    burger.addEventListener('click', function () { setNav(burger.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 980) setNav(false); });
  }

  /* ---------- today's hours ---------- */
  function mins(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }
  function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function today() {
    var box = document.getElementById('today');
    var now = new Date(), day = now.getDay(), key = ymd(now);
    var holiday = document.querySelector('tr[data-date="' + key + '"]');
    var row = holiday;
    document.querySelectorAll('.hours tr').forEach(function (tr) {
      var on = tr.getAttribute('data-days').split(',').indexOf(String(day)) > -1;
      tr.classList.toggle('is-today', on && !holiday);
      if (on && !row) row = tr;
    });
    if (holiday) holiday.classList.add('is-today');
    if (!box || !row) return;
    var t = now.getHours() * 60 + now.getMinutes();
    var open = t >= mins(row.getAttribute('data-open')) && t < mins(row.getAttribute('data-close'));
    document.getElementById('today-hours').textContent = row.querySelector('td').textContent;
    var st = document.getElementById('today-status');
    st.textContent = holiday ? T('hero.holiday') : T(open ? 'hero.open' : 'hero.closed');
    st.className = 'today-status ' + (open ? 'is-open' : 'is-closed');
    box.hidden = false;
  }

  /* ---------- home: favourites come from the menu data so prices always match ---------- */
  function favs() {
    if (!JB) return;
    document.querySelectorAll('.fav-list li[data-dish]').forEach(function (li) {
      var it = JB.byId(li.getAttribute('data-dish')); if (!it) return;
      var L = MPi18n.lang;
      var price = T('menu.pcs').replace('{n}', it.q) + ', ' + JB.money(JB.price(it));
      li.querySelector('.fav-text').innerHTML =
        '<h3>' + esc(JB.name(it)) + '</h3>' +
        (L === 'en' ? '<p class="fav-zh" lang="zh-Hant" data-lang-neutral>' + esc(it.n[0]) + '</p>' : '<p class="fav-zh" lang="en" data-lang-neutral>' + esc(it.n[2]) + '</p>') +
        '<p class="fav-price">' + esc(price) + '</p>';
    });
  }

  /* ---------- menu page ---------- */
  var MK = { g: '招', v: '素', p: '生', s: '辣' };
  function marksHtml(it) {
    return ['g', 'v', 'p', 's'].filter(function (k) { return JB.has(it, k); }).map(function (k) {
      return '<span class="mk mk-' + k + '" role="img" aria-label="' + esc(T('mark.' + k)) + '" title="' + esc(T('mark.' + k)) + '">' + MK[k] + '</span>';
    }).join('');
  }
  function priceHtml(it) {
    if (it.incl) return '<span class="incl">' + esc(T('menu.incl')) + '</span>';
    if (it.t) return '<span class="seal" title="' + esc(T('tier.' + it.t)) + '" aria-label="' + esc(T('tier.' + it.t)) + '">' + esc(MPi18n.pick(JB.tierChar[it.t])) + '</span><span class="amt">' + JB.money(JB.tiers[it.t]) + '</span>';
    return '<span class="amt">' + JB.money(it.p) + '</span>' + (it.unit === 'pot' ? '<span class="unit">' + esc(T('menu.pot')) + '</span>' : '');
  }
  function sizes() {
    var ul = document.getElementById('size-list'); if (!ul) return;
    ul.innerHTML = JB.tierOrder.map(function (k) {
      return '<li><span class="seal" aria-hidden="true">' + esc(MPi18n.pick(JB.tierChar[k])) + '</span><span class="size-name">' + esc(T('tier.' + k)) + '</span><span class="amt">' + JB.money(JB.tiers[k]) + '</span></li>';
    }).join('');
  }
  function renderMenu() {
    var root = document.getElementById('menu-root'), bar = document.getElementById('catbar-list');
    if (!root || !JB) return;
    var L = MPi18n.lang;
    bar.innerHTML = JB.cats.map(function (c) {
      return '<li><a href="#cat-' + c.id + '" data-cat="' + c.id + '">' + esc(MPi18n.pick(c.name)) + '</a></li>';
    }).join('');
    root.innerHTML = JB.cats.map(function (c) {
      var items = JB.items.filter(function (it) { return it.c === c.id; });
      return '<section class="cat" id="cat-' + c.id + '" aria-labelledby="h-' + c.id + '">' +
        '<div class="cat-head"><h2 id="h-' + c.id + '">' + esc(MPi18n.pick(c.name)) + '</h2><p>' + esc(MPi18n.pick(c.note)) + '</p></div>' +
        '<table class="sheet"><thead><tr><th scope="col">' + esc(T('menu.col.dish')) + '</th><th scope="col" class="c-price">' + esc(T('menu.col.price')) + '</th></tr></thead><tbody>' +
        items.map(function (it) {
          var first = L === 'en' ? it.n[2] : JB.name(it);
          var second = L === 'en' ? '<span class="d-alt" lang="zh-Hant" data-lang-neutral>' + esc(it.n[0]) + '</span>' : '<span class="d-alt" lang="en" data-lang-neutral>' + esc(it.n[2]) + '</span>';
          var qty = it.q ? '<span class="d-qty">' + esc(T('menu.pcs').replace('{n}', it.q)) + '</span>' : '';
          return '<tr><th scope="row"><span class="d-name">' + esc(first) + '</span>' + marksHtml(it) + second +
            '<span class="d-desc">' + esc(JB.desc(it)) + ' ' + qty + '</span></th>' +
            '<td class="c-price"><span class="price-wrap">' + priceHtml(it) + '</span></td></tr>';
        }).join('') + '</tbody></table></section>';
    }).join('');
    spy();
  }
  var spyObs = null;
  function spy() {
    var links = document.querySelectorAll('#catbar-list a');
    if (!links.length || !('IntersectionObserver' in window)) return;
    if (spyObs) spyObs.disconnect();
    function activate(id) {
      links.forEach(function (a) {
        var on = a.getAttribute('data-cat') === id;
        a.classList.toggle('is-active', on);
        if (on) {
          a.setAttribute('aria-current', 'true');
          var ul = a.closest('ul');
          ul.scrollLeft = a.offsetLeft - ul.clientWidth / 2 + a.offsetWidth / 2;
        } else a.removeAttribute('aria-current');
      });
    }
    spyObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) activate(e.target.id.replace('cat-', '')); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    document.querySelectorAll('.cat').forEach(function (s) { spyObs.observe(s); });
    activate(JB.cats[0].id);
  }
  function qr() {
    var box = document.getElementById('qr-code');
    if (!box || typeof window.qrcode !== 'function') return;
    var url = new URL('qr.html', location.href); url.hash = ''; url.search = '';
    var href = url.href, q = qrcode(0, 'M');
    q.addData(href); q.make();
    var n = q.getModuleCount(), pad = 2, scale = 8, cv = document.createElement('canvas');
    cv.width = cv.height = (n + pad * 2) * scale;
    var g = cv.getContext('2d');
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = '#0a3d2f';
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (q.isDark(r, c)) g.fillRect((c + pad) * scale, (r + pad) * scale, scale, scale);
    cv.setAttribute('role', 'img');
    cv.setAttribute('data-i18n-attr', 'aria-label:qrb.alt');
    cv.setAttribute('aria-label', T('qrb.alt'));
    cv.setAttribute('data-url', href);
    box.innerHTML = ''; box.appendChild(cv);
    var u = document.getElementById('qr-url'); if (u) u.textContent = href.replace(/^https?:\/\//, '');
  }

  /* ---------- map follows the page language ---------- */
  function mapLang() {
    var f = document.querySelector('iframe[data-map-q]'); if (!f) return;
    var hl = { en: 'en', 'zh-Hant': 'zh-TW', 'zh-Hans': 'zh-CN' }[MPi18n.lang] || 'en';
    var src = 'https://maps.google.com/maps?q=' + encodeURIComponent(f.getAttribute('data-map-q')) + '&z=15&hl=' + hl + '&output=embed';
    if (f.getAttribute('src') !== src) f.setAttribute('src', src);
  }

  function all() { today(); favs(); sizes(); renderMenu(); mapLang(); }
  qr();
  all();
  document.addEventListener('mp:langchange', all);
})();
