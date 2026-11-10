/* T&T Bakery & Café — concept preview behaviour
   - open / closed status in Markham time, hours table with today highlighted
   - mobile nav, scroll reveals
   - menu boards (menu.html) and holiday order request (order.html) rendered from data, trilingual */
(function () {
  'use strict';
  var T = MPi18n.t, pick = MPi18n.pick;
  document.documentElement.classList.add('js');

  /* ---------- hours (0 = Sunday) — from the business's Google listing, to confirm with T&T ---------- */
  var HOURS = { 0: [8, 16], 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [8, 17] };
  var ORDER_DAYS = [1, 2, 3, 4, 5, 6, 0]; // show Monday first

  function locale() { return { en: 'en-CA', 'zh-Hant': 'zh-HK', 'zh-Hans': 'zh-CN' }[MPi18n.lang] || 'en-CA'; }

  function hourLabel(h) {
    var l = MPi18n.lang, h12 = h % 12 === 0 ? 12 : h % 12;
    if (l === 'zh-Hant') return (h < 12 ? '上午' : '下午') + h12 + '時';
    if (l === 'zh-Hans') return (h < 12 ? '上午' : '下午') + h12 + '点';
    return h12 + (h < 12 ? ' am' : ' pm');
  }
  function rangeLabel(r) {
    return MPi18n.lang === 'en' ? hourLabel(r[0]) + ' – ' + hourLabel(r[1]) : hourLabel(r[0]) + '至' + hourLabel(r[1]);
  }
  function dayName(d) {
    // 2023-01-01 was a Sunday
    return new Intl.DateTimeFormat(locale(), { weekday: 'long' }).format(new Date(Date.UTC(2023, 0, 1 + d, 12)));
  }
  function markhamNow() {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Toronto', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday);
    return { day: day, mins: (+o.hour % 24) * 60 + (+o.minute) };
  }

  function renderStatus() {
    var el = document.getElementById('status');
    if (!el) return;
    var now = markhamNow(), r = HOURS[now.day], txt;
    var open = now.mins >= r[0] * 60 && now.mins < r[1] * 60;
    if (open) {
      txt = T('st.open').replace('{t}', hourLabel(r[1]));
    } else if (now.mins < r[0] * 60) {
      txt = T('st.closed').replace('{d}', T('st.today')).replace('{t}', hourLabel(r[0]));
    } else {
      txt = T('st.closed').replace('{d}', T('st.tomorrow')).replace('{t}', hourLabel(HOURS[(now.day + 1) % 7][0]));
    }
    if (MPi18n.lang !== 'en') txt = txt.replace(/\s·\s/, ' · ');
    el.querySelector('span').textContent = txt;
    el.classList.toggle('is-open', open);
    el.classList.toggle('is-closed', !open);
  }

  function renderHours() {
    var tb = document.getElementById('hours-body');
    if (!tb) return;
    var today = markhamNow().day;
    tb.innerHTML = '';
    ORDER_DAYS.forEach(function (d) {
      var tr = document.createElement('tr');
      if (d === today) { tr.className = 'today'; }
      var a = document.createElement('td'), b = document.createElement('td');
      a.textContent = dayName(d);
      if (d === today) a.setAttribute('data-today', T('st.todaytag'));
      b.textContent = rangeLabel(HOURS[d]);
      tr.appendChild(a); tr.appendChild(b); tb.appendChild(tr);
    });
  }

  /* ---------- nav ---------- */
  var head = document.querySelector('.head'), nav = document.getElementById('nav'), burger = document.querySelector('.burger');
  function setHeadH() {
    if (!head) return;
    var r = head.getBoundingClientRect();
    document.documentElement.style.setProperty('--head-h', Math.round(r.bottom) + 'px');
  }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') !== 'true';
      setHeadH();
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', T(open ? 'nav.close' : 'nav.open'));
      nav.classList.toggle('open', open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
    });
    window.addEventListener('scroll', setHeadH, { passive: true });
  }

  /* ---------- reveal on scroll ---------- */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv').forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else {
    document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- menu boards ---------- */
  var MENU = [
    { h: { en: 'Breakfast, all day', 'zh-Hant': '全日早餐', 'zh-Hans': '全天早餐' },
      s: { en: 'Served until close', 'zh-Hant': '供應至關門', 'zh-Hans': '供应到打烊' },
      items: [
        [{ en: 'Blueberry pancakes', 'zh-Hant': '藍莓班戟', 'zh-Hans': '蓝莓松饼' }, { en: 'A tall stack with blueberries', 'zh-Hant': '厚厚一疊，配藍莓', 'zh-Hans': '厚厚一摞，配蓝莓' }],
        [{ en: 'Waffle, berries & bacon', 'zh-Hant': '雜莓煙肉窩夫', 'zh-Hans': '莓果培根华夫饼' }, { en: 'Sweet and salty, the regulars’ pick', 'zh-Hant': '甜鹹兼備，熟客至愛', 'zh-Hans': '甜咸兼备，熟客最爱' }],
        [{ en: 'French toast', 'zh-Hant': '西多士', 'zh-Hans': '法式吐司' }, null],
        [{ en: 'The big breakfast', 'zh-Hant': '豐富早餐', 'zh-Hans': '丰盛早餐' }, { en: 'Eggs your way, bacon, home fries and toast', 'zh-Hant': '雞蛋隨您喜好，配煙肉、家常薯仔及多士', 'zh-Hans': '鸡蛋做法随您选，配培根、家常土豆和吐司' }],
        [{ en: 'Quiche', 'zh-Hant': '法式鹹批', 'zh-Hans': '法式咸派' }, { en: 'Ask what’s in today’s', 'zh-Hant': '今日口味請問店員', 'zh-Hans': '今天的口味请问店员' }]
      ] },
    { h: { en: 'Sandwiches', 'zh-Hant': '三文治', 'zh-Hans': '三明治' },
      s: { en: 'Built to order on fresh bagels, sourdough or bread', 'zh-Hant': '即叫即做，可揀貝果、酸種麵包或方包', 'zh-Hans': '现点现做，可选贝果、酸面包或吐司' },
      items: [
        [{ en: 'Peameal bacon on a sesame bagel', 'zh-Hant': '芝麻貝果夾豌豆粉煙肉', 'zh-Hans': '芝麻贝果夹豌豆粉培根' }, { en: 'A Toronto classic', 'zh-Hant': '多倫多經典', 'zh-Hans': '多伦多经典' }],
        [{ en: 'BLT', 'zh-Hant': '煙肉生菜番茄三文治', 'zh-Hans': '培根生菜番茄三明治' }, null],
        [{ en: 'Western', 'zh-Hant': '西部炒蛋三文治', 'zh-Hans': '西部炒蛋三明治' }, { en: 'Egg, ham, peppers and onion', 'zh-Hant': '雞蛋、火腿、青椒、洋蔥', 'zh-Hans': '鸡蛋、火腿、青椒、洋葱' }],
        [{ en: 'Salmon on toasted sourdough', 'zh-Hant': '烘酸種麵包夾三文魚', 'zh-Hans': '烤酸面包夹三文鱼' }, null],
        [{ en: 'Turkey', 'zh-Hant': '火雞三文治', 'zh-Hans': '火鸡三明治' }, null],
        [{ en: 'Cream cheese bagel', 'zh-Hant': '忌廉芝士貝果', 'zh-Hans': '奶油奶酪贝果' }, null]
      ] },
    { h: { en: 'Lunch & specials', 'zh-Hant': '午市及是日精選', 'zh-Hans': '午餐和每日特选' },
      s: { en: 'Changes daily — see the board', 'zh-Hant': '每日不同，以黑板為準', 'zh-Hans': '每天不同，以黑板为准' },
      items: [
        [{ en: 'Halibut, mash & slaw', 'zh-Hant': '比目魚配薯蓉及椰菜沙律', 'zh-Hans': '大比目鱼配土豆泥和凉拌卷心菜' }, null],
        [{ en: 'Soup of the day', 'zh-Hant': '是日餐湯', 'zh-Hans': '每日例汤' }, null],
        [{ en: 'Beef pie', 'zh-Hant': '牛肉批', 'zh-Hans': '牛肉派' }, { en: 'Baked in-house', 'zh-Hant': '店內自家焗', 'zh-Hans': '店里自家烤' }],
        [{ en: 'Today’s special', 'zh-Hant': '是日精選', 'zh-Hans': '今日特选' }, { en: 'On the board when you walk in', 'zh-Hant': '一入門就看到黑板', 'zh-Hans': '进门就能看到黑板' }]
      ] },
    { h: { en: 'The bakery case', 'zh-Hant': '餅櫃', 'zh-Hans': '烘焙柜' },
      s: { en: 'Baked here every day — to stay or to go', 'zh-Hant': '每日自家焗製，堂食外賣皆可', 'zh-Hans': '每天店里现烤，堂食外带都行' },
      items: [
        [{ en: 'Scones', 'zh-Hant': '英式鬆餅', 'zh-Hans': '司康' }, { en: 'Blueberry and more', 'zh-Hant': '藍莓及其他口味', 'zh-Hans': '蓝莓等多种口味' }],
        [{ en: 'Butter tarts', 'zh-Hant': '牛油撻', 'zh-Hans': '黄油挞' }, null],
        [{ en: 'Pies', 'zh-Hant': '批', 'zh-Hans': '派' }, { en: 'Apple and more — by the slice or whole', 'zh-Hant': '蘋果及其他口味，可一件或原個買', 'zh-Hans': '苹果等口味，可以按块或买整个' }],
        [{ en: 'Muffins & cookies', 'zh-Hant': '瑪芬及曲奇', 'zh-Hans': '玛芬和曲奇' }, null],
        [{ en: 'Cakes', 'zh-Hant': '蛋糕', 'zh-Hans': '蛋糕' }, { en: 'Whole cakes — call ahead', 'zh-Hant': '原個蛋糕請預先致電', 'zh-Hans': '整个蛋糕请提前致电' }],
        [{ en: 'Bread & bagels', 'zh-Hant': '麵包及貝果', 'zh-Hans': '面包和贝果' }, null]
      ] }
  ];

  function renderMenu() {
    var wrap = document.getElementById('boards');
    if (!wrap) return;
    wrap.innerHTML = '';
    MENU.forEach(function (sec) {
      var b = document.createElement('section'); b.className = 'board rv in';
      var h = document.createElement('h2'); h.textContent = pick(sec.h); b.appendChild(h);
      var s = document.createElement('p'); s.className = 'sub'; s.textContent = pick(sec.s); b.appendChild(s);
      var ul = document.createElement('ul');
      sec.items.forEach(function (it) {
        var li = document.createElement('li');
        var n = document.createElement('span'); n.className = 'nm'; n.textContent = pick(it[0]);
        var p = document.createElement('span'); p.className = 'pr'; p.textContent = T('menu.price'); p.setAttribute('aria-hidden', 'true');
        li.appendChild(n); li.appendChild(p);
        if (it[1]) { var d = document.createElement('span'); d.className = 'ds'; d.textContent = pick(it[1]); li.appendChild(d); }
        ul.appendChild(li);
      });
      b.appendChild(ul); wrap.appendChild(b);
    });
  }

  /* ---------- holiday order request (preview: never sends anything) ---------- */
  var ICON = {
    pie: '<svg viewBox="0 0 56 56" aria-hidden="true"><ellipse cx="28" cy="34" rx="24" ry="12" fill="#a8652a"/><ellipse cx="28" cy="31" rx="24" ry="12" fill="#e2a95a"/><ellipse cx="28" cy="30" rx="19" ry="8.5" fill="#c9752f"/><g stroke="#f3cf8a" stroke-width="3.2" stroke-linecap="round"><path d="M14 27l14 9M20 23.5l17 10.5M29 22.5l13 8"/><path d="M42 27l-14 9M36 23.5l-17 10.5M27 22.5l-13 8"/></g></svg>',
    tart: '<svg viewBox="0 0 56 56" aria-hidden="true"><g><path d="M6 30h20l-3 10H9z" fill="#c98b3f"/><ellipse cx="16" cy="30" rx="10" ry="4" fill="#7a3e14"/><path d="M30 30h20l-3 10H33z" fill="#c98b3f"/><ellipse cx="40" cy="30" rx="10" ry="4" fill="#7a3e14"/><path d="M18 18h20l-3 10H21z" fill="#d79a4d"/><ellipse cx="28" cy="18" rx="10" ry="4" fill="#8a4a1a"/></g></svg>',
    scone: '<svg viewBox="0 0 56 56" aria-hidden="true"><path d="M8 40c0-12 8-22 20-22s20 10 20 22z" fill="#e6b56c"/><path d="M8 40h40v4H8z" fill="#c98b3f"/><g fill="#3d3a8c"><circle cx="20" cy="31" r="2.6"/><circle cx="30" cy="26" r="2.6"/><circle cx="36" cy="34" r="2.6"/><circle cx="25" cy="36" r="2.2"/></g></svg>',
    fruit: '<svg viewBox="0 0 56 56" aria-hidden="true"><ellipse cx="28" cy="34" rx="24" ry="12" fill="#a8652a"/><ellipse cx="28" cy="31" rx="24" ry="12" fill="#e2a95a"/><ellipse cx="28" cy="30" rx="19" ry="8.5" fill="#9b1f2e"/><g fill="#d63a4a"><circle cx="20" cy="29" r="3"/><circle cx="29" cy="27" r="3"/><circle cx="36" cy="31" r="3"/><circle cx="26" cy="33" r="3"/></g></svg>',
    beef: '<svg viewBox="0 0 56 56" aria-hidden="true"><ellipse cx="28" cy="36" rx="22" ry="10" fill="#a8652a"/><path d="M6 33c0-9 10-15 22-15s22 6 22 15c0 4-10 8-22 8S6 37 6 33z" fill="#e2a95a"/><path d="M22 24l3 4M28 22v5M34 24l-3 4" stroke="#a8652a" stroke-width="2.4" stroke-linecap="round"/></svg>'
  };
  var ITEMS = [
    { id: 'apple', ic: 'pie', n: { en: 'Apple pie, whole', 'zh-Hant': '蘋果批（原個）', 'zh-Hans': '苹果派（整个）' }, d: { en: 'The classic', 'zh-Hant': '經典之選', 'zh-Hans': '经典之选' } },
    { id: 'fruit', ic: 'fruit', n: { en: 'Seasonal fruit pie, whole', 'zh-Hant': '時令水果批（原個）', 'zh-Hans': '时令水果派（整个）' }, d: { en: 'Ask what’s baking', 'zh-Hant': '口味請向店員查詢', 'zh-Hans': '口味请向店员询问' } },
    { id: 'tarts', ic: 'tart', n: { en: 'Butter tarts, half dozen', 'zh-Hant': '牛油撻（半打）', 'zh-Hans': '黄油挞（半打）' }, d: { en: 'Six to share (or not)', 'zh-Hant': '六個，分享與否隨您', 'zh-Hans': '六个，分不分享随您' } },
    { id: 'scones', ic: 'scone', n: { en: 'Blueberry scones, half dozen', 'zh-Hant': '藍莓英式鬆餅（半打）', 'zh-Hans': '蓝莓司康（半打）' }, d: { en: 'For holiday breakfast', 'zh-Hant': '節日早餐之選', 'zh-Hans': '节日早餐之选' } },
    { id: 'beef', ic: 'beef', n: { en: 'Beef pie', 'zh-Hant': '牛肉批', 'zh-Hans': '牛肉派' }, d: { en: 'Savoury, baked in-house', 'zh-Hant': '鹹點，店內自家焗', 'zh-Hans': '咸口，店里自家烤' } }
  ];
  var qty = {};
  ITEMS.forEach(function (it) { qty[it.id] = 0; });

  function pickupDays() {
    var now = new Date(), y = now.getFullYear();
    if (now.getMonth() === 11 && now.getDate() > 24) y += 1;
    var out = [];
    for (var d = 18; d <= 24; d++) out.push(new Date(y, 11, d, 12));
    return out;
  }
  function fmtDay(dt) { return new Intl.DateTimeFormat(locale(), { weekday: 'long', month: 'long', day: 'numeric' }).format(dt); }

  function renderOrder() {
    var list = document.getElementById('items');
    if (!list) return;
    list.innerHTML = '';
    ITEMS.forEach(function (it) {
      var row = document.createElement('div'); row.className = 'item';
      row.innerHTML = ICON[it.ic];
      var txt = document.createElement('div');
      var b = document.createElement('b'); b.textContent = pick(it.n);
      var s = document.createElement('small'); s.textContent = pick(it.d);
      txt.appendChild(b); txt.appendChild(s); row.appendChild(txt);
      var q = document.createElement('div'); q.className = 'qty';
      var minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−'; minus.setAttribute('aria-label', T('qty.less') + ': ' + pick(it.n));
      var out = document.createElement('output'); out.textContent = qty[it.id]; out.setAttribute('aria-live', 'polite');
      var plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+'; plus.setAttribute('aria-label', T('qty.more') + ': ' + pick(it.n));
      minus.disabled = qty[it.id] === 0;
      minus.addEventListener('click', function () { if (qty[it.id] > 0) { qty[it.id]--; out.textContent = qty[it.id]; minus.disabled = qty[it.id] === 0; } });
      plus.addEventListener('click', function () { if (qty[it.id] < 20) { qty[it.id]++; out.textContent = qty[it.id]; minus.disabled = false; } });
      q.appendChild(minus); q.appendChild(out); q.appendChild(plus); row.appendChild(q);
      list.appendChild(row);
    });
    var sel = document.getElementById('f-date');
    if (sel) {
      var keep = sel.value;
      sel.innerHTML = '';
      pickupDays().forEach(function (dt) {
        var o = document.createElement('option');
        o.value = dt.getFullYear() + '-12-' + dt.getDate();
        o.textContent = fmtDay(dt);
        sel.appendChild(o);
      });
      if (keep) sel.value = keep;
    }
  }

  var form = document.getElementById('order-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = document.getElementById('f-err'), res = document.getElementById('result');
      var chosen = ITEMS.filter(function (it) { return qty[it.id] > 0; });
      var name = form.elements.name.value.trim(), phone = form.elements.phone.value.trim();
      if (!chosen.length) { err.textContent = T('f.errItems'); res.hidden = true; return; }
      if (!name || !phone) { err.textContent = T('f.errContact'); res.hidden = true; return; }
      err.textContent = '';
      var sel = form.elements.date, dayTxt = sel.options[sel.selectedIndex].textContent;
      res.innerHTML = '';
      var tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = T('r.tag');
      var h = document.createElement('h3'); h.textContent = T('r.h');
      var ul = document.createElement('ul');
      chosen.forEach(function (it) { var li = document.createElement('li'); li.textContent = qty[it.id] + ' × ' + pick(it.n); ul.appendChild(li); });
      var p1 = document.createElement('p'); p1.textContent = T('r.pick').replace('{d}', dayTxt) + ' · ' + name;
      var p2 = document.createElement('p'); p2.textContent = T('r.live');
      [tag, h, ul, p1, p2].forEach(function (n) { res.appendChild(n); });
      res.hidden = false;
      res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  /* ---------- go ---------- */
  function all() { renderStatus(); renderHours(); renderMenu(); renderOrder(); setHeadH(); }
  document.addEventListener('mp:langchange', all);
  all();
  setInterval(renderStatus, 60000);
  window.addEventListener('resize', setHeadH);
})();
