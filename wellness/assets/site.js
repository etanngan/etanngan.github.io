/* Stillwater — shared behaviour */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia && matchMedia('(pointer: coarse)').matches;
  var small = window.innerWidth < 760;
  if (!reduce) root.classList.add('js-anim');

  /* ---- title / meta follow language (i18n handles title textContent; meta via attr) ---- */

  /* ---- sticky header ---- */
  var head = doc.querySelector('.site-head');
  function onScroll() { if (head) head.classList.toggle('is-stuck', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  var btn = doc.querySelector('.menu-btn'), nav = doc.getElementById('nav');
  function setMenu(open) {
    if (!btn || !nav) return;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.classList.toggle('is-open', open);
    doc.body.style.overflow = open ? 'hidden' : '';
  }
  if (btn && nav) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); btn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });
  }

  /* ---- FAQ accordion ---- */
  doc.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var open = q.getAttribute('aria-expanded') === 'true';
      var panel = doc.getElementById(q.getAttribute('aria-controls'));
      q.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (panel) panel.hidden = open;
    });
  });

  /* ---- anchor sub-nav: scroll-spy + keep current chip in view ---- */
  var sub = doc.querySelector('.subnav');
  if (sub) {
    var links = Array.prototype.slice.call(sub.querySelectorAll('a[href^="#"]'));
    var targets = links.map(function (a) { return doc.getElementById(a.getAttribute('href').slice(1)); });
    var current = null;
    var spy = function () {
      var y = window.scrollY + window.innerHeight * 0.3, idx = 0;
      targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top + window.scrollY <= y) idx = i; });
      if (idx === current) return;
      current = idx;
      links.forEach(function (a, i) { a.classList.toggle('is-current', i === idx); if (i === idx) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      var ul = sub.querySelector('ul'), a = links[idx];
      if (ul && a && ul.scrollWidth > ul.clientWidth) {
        var left = a.offsetLeft - (ul.clientWidth - a.offsetWidth) / 2;
        ul.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'auto' : 'smooth' });
      }
    };
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }

  /* ---- motion ---- */
  var G = window.gsap, ST = window.ScrollTrigger;
  if (reduce || !G) return;
  if (ST) G.registerPlugin(ST);

  // headline lines: calm clip reveal (whole lines — safe for CJK; re-run on language change)
  function revealLines(delay) {
    var lines = doc.querySelectorAll('[data-line]');
    if (!lines.length) return;
    G.fromTo(lines, { clipPath: 'inset(0 0 100% 0)', y: 18, opacity: 0 }, {
      clipPath: 'inset(0 0 -20% 0)', y: 0, opacity: 1, duration: 1.6, ease: 'power2.out', stagger: 0.22, delay: delay || 0,
      onComplete: function () { lines.forEach(function (l) { l.style.clipPath = ''; }); }
    });
  }
  revealLines(0.15);
  doc.addEventListener('mp:langchange', function (e) { if (!e.detail.initial) revealLines(0); });

  // soft reveals on scroll
  var items = doc.querySelectorAll('[data-reveal]');
  if (ST) {
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) {
        G.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out', delay: 0.35 });
        return;
      }
      G.fromTo(el, { opacity: 0, y: 22 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });
  }

  // depth parallax — slow, low amplitude; reduced on touch / small screens
  if (ST) {
    var amp = coarse || small ? 0.35 : 1;
    doc.querySelectorAll('.scene').forEach(function (scene) {
      scene.querySelectorAll('[data-depth]').forEach(function (layer) {
        var d = parseFloat(layer.getAttribute('data-depth')) || 0;
        if (d === 4) return; // text layer stays put
        var dist = (d - 2) * -26 * amp; // far layers drift down, near ones up
        if (d >= 5) dist = -70 * amp;
        G.to(layer, { y: dist, ease: 'none', scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom top', scrub: 1.2 } });
      });
    });
  }
})();
