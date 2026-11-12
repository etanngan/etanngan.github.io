#!/usr/bin/env node
// Polish audit for the dim sum demo (dimsum/): type sizes and weights, line lengths, spacing,
// interactive states, tabular numbers, links, console errors, sideways overflow, reduced motion.
// Talks to headless Google Chrome over the DevTools protocol with Node's built-in WebSocket.
//   node dimsum-polish-audit.mjs                        audit all pages x EN/繁/简 x 390/1440
//   node dimsum-polish-audit.mjs --shots DIR            screenshots of index.html (EN, 繁; 390, 1440)
//   --base URL (default http://127.0.0.1:8411/dimsum/)  --pages a.html,b.html  --detail
//   --probe 'JS expression' [--view 0|1] [--lang zh-Hant]   evaluate one expression on the first page
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const BASE = opt('--base', 'http://127.0.0.1:8411/dimsum/');
const SHOTS = opt('--shots', null);
const DETAIL = args.includes('--detail');
const PAGES = opt('--pages', 'index.html,menu.html,qr.html').split(',');
const LANGS = ['en', 'zh-Hant', 'zh-Hans'];
const VIEWS = [[390, 844], [1440, 900]];
const CFG = {
  maxSizes: 8, maxWeights: 3, maxCh: 65, maxEm: 36,
  typeScale: [16, 18, 22, 28, 40, 64, 144, 288],
  space: [0, 8, 16, 24, 32, 48, 64, 96, 128],
};

/* ---------- selector helpers (also run in the page) ---------- */
function splitTop(sel) {
  const out = []; let depth = 0, cur = '';
  for (const ch of sel) {
    if (ch === '(' || ch === '[') depth++; else if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function stateRules(sel) {
  const STATE = { hover: /:hover(?![-\w])/g, active: /:active(?![-\w])/g, focus: /:focus(-visible)?(?![-\w])/g, disabled: /:disabled(?![-\w])|\[disabled\]|\[aria-disabled(="true")?\]/g };
  const res = [];
  for (const part of splitTop(sel)) {
    let depth = 0, at = 0;
    for (let i = 0; i < part.length; i++) {
      const ch = part[i];
      if (ch === '(' || ch === '[') depth++; else if (ch === ')' || ch === ']') depth--;
      else if (depth === 0 && /[\s>+~]/.test(ch)) at = i + 1;
    }
    const head = part.slice(0, at), subj = part.slice(at);
    for (const [kind, re] of Object.entries(STATE)) {
      re.lastIndex = 0; if (!re.test(subj)) continue; re.lastIndex = 0;
      res.push({ kind, base: head + (subj.replace(re, '') || '*') });
    }
  }
  return res;
}
assert.deepEqual(stateRules('.nav a:not(.btn-call):hover'), [{ kind: 'hover', base: '.nav a:not(.btn-call)' }]);
assert.deepEqual(stateRules('.hero :focus-visible, .band a:focus'), [{ kind: 'focus', base: '.hero *' }, { kind: 'focus', base: '.band a' }]);
assert.deepEqual(stateRules('.dcard:hover .bowl'), []);
assert.deepEqual(stateRules('button:disabled, a[aria-disabled="true"]'), [{ kind: 'disabled', base: 'button' }, { kind: 'disabled', base: 'a' }]);
assert.deepEqual(splitTop('a:is(.x, .y), b'), ['a:is(.x, .y)', 'b']);

/* ---------- in-page measurement ---------- */
function measure(cfg) {
  const R = {};
  const css = (el) => getComputedStyle(el);
  const shown = (el) => el.getClientRects().length > 0 && css(el).visibility !== 'hidden' && !el.closest('.sr');
  const name = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) return s + '#' + el.id;
    if (el.classList.length) s += '.' + [...el.classList].slice(0, 2).join('.');
    const p = el.parentElement;
    if (p && p !== document.body) s = (p.id ? '#' + p.id : p.classList.length ? '.' + p.classList[0] : p.tagName.toLowerCase()) + '>' + s;
    return s;
  };
  const bump = (map, key, ex) => { const e = map[key] || (map[key] = { n: 0, ex: [] }); e.n++; if (e.ex.length < 4 && !e.ex.includes(ex)) e.ex.push(ex); };
  const CJK = /[㐀-鿿豈-﫿]/;

  // text nodes
  const texts = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (t) => (t.data.trim() && t.parentElement && !t.parentElement.closest('script,style,noscript,template') ? 1 : 2),
  });
  for (let t; (t = tw.nextNode());) if (shown(t.parentElement)) texts.push(t);
  const fields = [...document.querySelectorAll('input:not([type=hidden]), select, textarea')].filter(shown);

  // sizes, weights, families
  const sizes = {}, weights = {}, fams = {};
  for (const el of [...texts.map((t) => t.parentElement), ...fields]) {
    const cs = css(el), n = name(el);
    bump(sizes, Math.round(parseFloat(cs.fontSize) * 10) / 10, n);
    bump(weights, cs.fontWeight, n);
    bump(fams, cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), n);
  }
  R.sizes = sizes; R.weights = weights; R.families = Object.keys(fams);

  // line lengths of running text (not headings): widest line per block, in ch (Latin) or em (CJK)
  const blockOf = (el) => { while (el && /^(inline|contents)$/.test(css(el).display)) el = el.parentElement; return el; };
  const lines = new Map();
  for (const t of texts) {
    const b = blockOf(t.parentElement);
    if (!b || b.closest('h1,h2,h3,h4,h5,h6,button,.display')) continue;
    const rg = document.createRange(); rg.selectNodeContents(t);
    const L = lines.get(b) || new Map(); lines.set(b, L);
    for (const r of rg.getClientRects()) {
      if (r.width < 1) continue;
      const k = Math.round((r.top + r.bottom) / 2 / 8);
      const l = L.get(k) || { a: Infinity, z: -Infinity }; l.a = Math.min(l.a, r.left); l.z = Math.max(l.z, r.right); L.set(k, l);
    }
  }
  const zh = document.documentElement.lang.startsWith('zh');
  const long = []; let maxCh = 0, maxEm = 0;
  for (const [b, L] of lines) {
    let w = 0; for (const l of L.values()) w = Math.max(w, l.z - l.a);
    if (!w) continue;
    const cs = css(b), fs = parseFloat(cs.fontSize);
    if (zh && CJK.test(b.textContent)) {
      const em = w / fs; maxEm = Math.max(maxEm, em);
      if (em > cfg.maxEm + 0.5) long.push(name(b) + ' ' + em.toFixed(1) + 'em');
    } else {
      const z = document.createElement('span'); z.textContent = '0'; z.style.cssText = 'position:absolute;visibility:hidden;letter-spacing:0;white-space:pre';
      b.appendChild(z); const ch = z.getBoundingClientRect().width || fs / 2; z.remove();
      const n = w / ch; maxCh = Math.max(maxCh, n);
      if (n > cfg.maxCh + 0.5) long.push(name(b) + ' ' + n.toFixed(1) + 'ch');
    }
  }
  R.maxCh = Math.round(maxCh * 10) / 10; R.maxEm = Math.round(maxEm * 10) / 10; R.long = long;

  // spacing: margin, padding, gap, from the typed computed values (auto/normal/% skipped)
  const PROPS = ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'row-gap', 'column-gap'];
  const space = {}, offScale = {}; let relative = 0;
  const centring = []; // [selector, property] for spacing written against 100vw (container alignment)
  const scan = (list) => { for (const r of list) { if (r instanceof CSSStyleRule) { for (const p of PROPS.concat(['padding', 'margin', 'padding-inline', 'margin-inline'])) if (/100vw\s*-/.test(r.style.getPropertyValue(p))) centring.push([r.selectorText, p]); } else if (r.cssRules) scan(r.cssRules); } };
  for (const sh of document.styleSheets) { try { scan(sh.cssRules); } catch (e) {} }
  const centred = (el, p) => centring.some(([sel, q]) => (p === q || p.startsWith(q + '-')) && el.matches(sel));
  for (const el of document.body.querySelectorAll('*')) {
    if ((el.closest('svg') && el.tagName.toLowerCase() !== 'svg') || !shown(el) || el.classList.contains('pin-spacer')) continue; // GSAP's pin spacer pads by scroll distance
    const m = el.computedStyleMap(), cs = css(el);
    for (const p of PROPS) {
      const v = m.get(p); let px;
      if (!v || v instanceof CSSKeywordValue) continue;
      if (centred(el, p)) { relative++; continue; }
      if (v instanceof CSSUnitValue) { if (v.unit === 'percent') { relative++; continue; } px = v.value; }
      else { if (/%/.test(v.toString())) { relative++; continue; } px = parseFloat(cs.getPropertyValue(p)); }
      const a = Math.round(Math.abs(px) * 100) / 100;
      bump(space, a, name(el));
      if (!cfg.space.includes(a)) bump(offScale, a, name(el) + ' ' + p);
    }
  }
  R.space = space; R.offScale = offScale; R.relative = relative;

  // interactive states: rules in the stylesheets, a real focus ring, transitions
  const rules = [];
  const walk = (list) => { for (const r of list) {
    if (r instanceof CSSStyleRule) { if (/:(hover|active|focus|disabled)|disabled\]/.test(r.selectorText)) rules.push(...stateRules(r.selectorText)); }
    else if (r instanceof CSSMediaRule) { if (matchMedia(r.conditionText).matches || /hover|pointer/.test(r.conditionText)) walk(r.cssRules); }
    else if (r instanceof CSSSupportsRule) { if (CSS.supports(r.conditionText)) walk(r.cssRules); }
    else if (r.cssRules) walk(r.cssRules);
  } };
  for (const sh of document.styleSheets) { try { walk(sh.cssRules); } catch (e) { /* cross-origin font css */ } }
  const has = (el, kind) => rules.some((r) => { if (r.kind !== kind) return false; try { return el.matches(r.base); } catch (e) { return false; } });
  const snap = (el) => { const c = css(el); return [c.outlineStyle, c.outlineWidth, c.outlineColor, c.boxShadow, c.backgroundColor, c.color].join('|'); };
  const inter = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [tabindex]:not([tabindex="-1"])')].filter(shown);
  const miss = {}; const tally = { total: inter.length, hover: 0, active: 0, focus: 0, smooth: 0, disabled: 0, canDisable: 0, underlineAnim: 0, underlined: 0 };
  const sx = scrollX, sy = scrollY;
  if (document.activeElement) document.activeElement.blur(); // Chrome keeps keyboard modality after a blur
  for (const el of inter) {
    const cs = css(el), n = name(el);
    const durs = cs.transitionDuration.split(',').map((d) => parseFloat(d) * (d.includes('ms') ? 0.001 : 1));
    const smooth = cs.transitionProperty !== 'none' && durs.some((d) => d >= 0.15 && d <= 0.25);
    const b4 = snap(el); el.focus({ preventScroll: true }); const ring = document.activeElement === el && el.matches(':focus-visible') && snap(el) !== b4; el.blur();
    const st = { hover: has(el, 'hover'), active: has(el, 'active'), focus: ring, smooth };
    const formy = /^(button|input|select|textarea)$/i.test(el.tagName);
    if (formy) { tally.canDisable++; st.disabled = has(el, 'disabled'); }
    if (el.tagName === 'A' && cs.textDecorationLine.includes('underline')) { tally.underlined++; st.underline = /text-underline-offset|text-decoration|all/.test(cs.transitionProperty) && smooth; if (st.underline) tally.underlineAnim++; }
    for (const [k, v] of Object.entries(st)) { if (!v) bump(miss, k, n); else if (k !== 'underline') tally[k]++; }
  }
  document.activeElement && document.activeElement.blur(); scrollTo(sx, sy);
  R.inter = tally; R.miss = miss;

  // tabular numbers on prices and times
  const NUM = /\$\s?\d|\b\d{1,2}:\d{2}\b|\b\d{1,2}\s?(am|pm)\b/i; let numN = 0; const numBad = {};
  for (const t of texts) if (NUM.test(t.data)) { numN++; if (!css(t.parentElement).fontVariantNumeric.includes('tabular-nums')) bump(numBad, name(t.parentElement), t.data.trim().slice(0, 24)); }
  R.nums = { n: numN, bad: numBad };

  // headings: line height, display tracking, balanced wrap; paragraphs: pretty wrap
  const head = { n: 0, bad: [] };
  for (const h of [...document.querySelectorAll('h1,h2,h3,.display')].filter(shown)) {
    head.n++; const c = css(h), fs = parseFloat(c.fontSize), lh = parseFloat(c.lineHeight) / fs, cjk = CJK.test(h.textContent) && zh;
    const issues = [];
    if (cjk ? lh > 1.3 : (lh < 0.99 || lh > 1.16)) issues.push('lh ' + lh.toFixed(2));
    if (!cjk && fs >= 40 && !(parseFloat(c.letterSpacing) < 0)) issues.push('tracking ' + c.letterSpacing);
    if (!/balance/.test(c.textWrap || c.textWrapStyle)) issues.push('no balance');
    if (issues.length) head.bad.push(name(h) + ' ' + issues.join(', '));
  }
  R.head = head;
  R.prettyMissing = [...document.querySelectorAll('p')].filter(shown).filter((p) => !/pretty|balance/.test(css(p).textWrap || css(p).textWrapStyle)).map(name).slice(0, 6);

  // overflow, images, first screen, motion still running, links
  R.overflow = document.documentElement.scrollWidth - innerWidth;
  R.wide = [...document.body.querySelectorAll('*')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.right > innerWidth + 1 && !e.closest('svg,.cart-view,.hero,.cart,.band,.find,.tierbar,.tabs,.intro-layer'); }).slice(0, 5).map(name);
  R.imgNoSize = [...document.images].filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).map((i) => i.src.split('/').pop());
  const btn = document.querySelector('.hero .btn-call'); R.heroBtnBottom = btn ? Math.round(btn.getBoundingClientRect().bottom + scrollY) : null;
  R.running = document.getAnimations().filter((a) => a.playState === 'running').map((a) => a.animationName || a.transitionProperty || 'anim');
  R.gsap = document.documentElement.classList.contains('gsap');
  R.links = [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.href, raw: a.getAttribute('href') }));
  R.ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
  return R;
}

// the page needs the selector helpers too
const MEASURE = `(cfg) => { ${splitTop}\n${stateRules}\nreturn (${measure})(cfg); }`;
const TAB = async () => { for (const type of ['keyDown', 'keyUp']) await c.send('Input.dispatchKeyEvent', { type, key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); };

/* ---------- Chrome plumbing ---------- */
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9400 + Math.floor(Math.random() * 400);
const prof = mkdtempSync(join(tmpdir(), 'jb-audit-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const quit = () => { try { chrome.kill(); } catch (e) {} try { rmSync(prof, { recursive: true, force: true }); } catch (e) {} };
process.on('exit', quit);

async function connect() {
  for (let i = 0; i < 50; i++) { try { await fetch(`http://127.0.0.1:${port}/json/version`); break; } catch (e) { await wait(100); } }
  const t = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  let id = 0; const pend = new Map(), subs = [];
  ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && pend.has(msg.id)) { const p = pend.get(msg.id); pend.delete(msg.id); msg.error ? p.rej(new Error(msg.error.message)) : p.res(msg.result); } else subs.forEach((f) => f(msg)); };
  await new Promise((r) => { ws.onopen = r; });
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  return { send, on: (f) => subs.push(f) };
}

let c, initId = null, errs = [];
async function open(url, { w, h, lang, reduce }) {
  await c.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }] });
  if (initId) await c.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: initId });
  ({ identifier: initId } = await c.send('Page.addScriptToEvaluateOnNewDocument', { source: `try{localStorage.setItem('mp-lang',${JSON.stringify(lang)});localStorage.removeItem('jb-sheet');sessionStorage.setItem('jb-intro','1')}catch(e){}` }));
  errs = [];
  const loaded = new Promise((r) => { const f = (m) => { if (m.method === 'Page.loadEventFired') r(); }; c.on(f); });
  await c.send('Page.navigate', { url });
  await Promise.race([loaded, wait(15000)]);
  await evalIn('document.fonts.ready.then(() => new Promise(r => setTimeout(r, 1800)))');
}
async function evalIn(expr) {
  const r = await c.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}
// open the phone nav, tick a dish and open the sheet dialog so their text and controls are measured too
const PREP = `(() => { if (innerWidth < 1181) document.body.classList.add('nav-open');
  const t = document.querySelector('.cart-tick, .t-box'); if (t) t.click();
  const o = document.querySelector('[data-sheet-open]'); if (o && o.getClientRects().length) o.click();
  const d = document.querySelector('dialog[open]'); if (d) { d.close(); d.show(); } })()`; // non-modal, so the page behind stays focusable

async function main() {
  c = await connect();
  await c.send('Page.enable'); await c.send('Runtime.enable'); await c.send('Log.enable'); await c.send('Network.enable');
  c.on((m) => {
    if (m.method === 'Runtime.exceptionThrown') errs.push('exception: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).split('\n')[0]);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errs.push('console: ' + m.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 160));
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') errs.push('log: ' + m.params.entry.text.slice(0, 160) + ' ' + (m.params.entry.url || ''));
    if (m.method === 'Network.responseReceived' && m.params.response.status >= 400) errs.push('http ' + m.params.response.status + ' ' + m.params.response.url);
  });
  if (SHOTS) return shots();
  if (opt('--probe')) { const [w, h] = VIEWS[Number(opt('--view', 0))]; await open(BASE + PAGES[0], { w, h, lang: opt('--lang', 'en'), reduce: args.includes('--reduce') }); await TAB(); console.log(JSON.stringify(await evalIn(opt('--probe')), null, 1)); return; }

  const rows = [], all = { sizes: {}, weights: {}, offScale: {}, miss: {}, long: new Set(), numBad: {}, head: new Set(), errs: new Set(), wide: new Set() };
  const merge = (dst, src) => { for (const [k, v] of Object.entries(src)) { const e = dst[k] || (dst[k] = { n: 0, ex: [] }); e.n += v.n; for (const x of v.ex) if (e.ex.length < 6 && !e.ex.includes(x)) e.ex.push(x); } };
  const links = new Map();
  for (const page of PAGES) for (const lang of LANGS) for (const [w, h] of VIEWS) {
    await open(BASE + page, { w, h, lang });
    await TAB(); // keyboard modality, so script focus shows :focus-visible like a keyboard user sees it
    const R = await evalIn(`(${PREP}, new Promise(r => setTimeout(r, 400))).then(() => (${MEASURE})(${JSON.stringify(CFG)}))`);
    const inter = R.inter;
    rows.push({ page, lang, w, sizes: Object.keys(R.sizes).length, weights: Object.keys(R.weights).length, maxCh: R.maxCh, maxEm: R.maxEm, longN: R.long.length,
      spaceVals: Object.keys(R.space).length, offScale: Object.values(R.offScale).reduce((a, v) => a + v.n, 0), relative: R.relative,
      inter: inter.total, noHover: inter.total - inter.hover, noActive: inter.total - inter.active, noFocus: inter.total - inter.focus, notSmooth: inter.total - inter.smooth,
      noDisabled: inter.canDisable - inter.disabled, ulAnim: `${inter.underlineAnim}/${inter.underlined}`, nums: `${R.nums.n - Object.values(R.nums.bad).reduce((a, v) => a + v.n, 0)}/${R.nums.n}`,
      headBad: R.head.bad.length, overflow: R.overflow, errors: errs.length, btn: R.heroBtnBottom, fams: R.families.join('+') });
    merge(all.sizes, R.sizes); merge(all.weights, R.weights); merge(all.offScale, R.offScale); merge(all.miss, R.miss); merge(all.numBad, R.nums.bad);
    R.long.forEach((x) => all.long.add(`${lang}@${w} ${x}`)); R.head.bad.forEach((x) => all.head.add(`${lang}@${w} ${x}`)); errs.forEach((x) => all.errs.add(`${page} ${lang}@${w} ${x}`)); R.wide.forEach((x) => all.wide.add(`${page} ${lang}@${w} ${x}`));
    R.links.forEach((l) => links.set(l.href, { ...l, page, ids: R.ids }));
  }

  // reduced motion: nothing should still be running, GSAP should not start
  const calm = [];
  for (const page of PAGES) for (const [w, h] of VIEWS) {
    await open(BASE + page, { w, h, lang: 'en', reduce: true });
    const R = await evalIn(`(${MEASURE})(${JSON.stringify(CFG)})`);
    calm.push(`${page}@${w}: running=${R.running.length}${R.running.length ? ' (' + [...new Set(R.running)].join(',') + ')' : ''} gsap=${R.gsap} overflow=${R.overflow} errors=${errs.length}`);
  }

  // links: internal pages and #targets resolve, tel/mailto well formed, external answer
  const linkBad = [], htmlCache = {};
  for (const l of links.values()) {
    const u = new URL(l.href);
    if (u.protocol === 'tel:') { if (!/^tel:\+1\d{10}$/.test(l.raw)) linkBad.push('bad tel ' + l.raw); continue; }
    if (u.protocol === 'mailto:') { if (!/^mailto:[^@\s]+@[^@\s]+$/.test(l.raw)) linkBad.push('bad mailto ' + l.raw); continue; }
    const doc = u.origin + u.pathname;
    if (u.origin === new URL(BASE).origin) {
      if (!(doc in htmlCache)) { const r = await fetch(doc); htmlCache[doc] = r.ok ? await r.text() : null; if (!r.ok) linkBad.push(r.status + ' ' + doc); }
      if (u.hash && htmlCache[doc] && !new RegExp(`id=["']${u.hash.slice(1)}["']`).test(htmlCache[doc]) && !(doc === new URL(BASE + l.page).href && l.ids.includes(u.hash.slice(1)))) linkBad.push('missing ' + u.hash + ' on ' + u.pathname + ' (from ' + l.page + ')');
    } else {
      try { const r = await fetch(l.href, { redirect: 'follow', signal: AbortSignal.timeout(8000) }); if (r.status >= 400) linkBad.push(r.status + ' ' + l.href); } catch (e) { linkBad.push('unreachable ' + l.href); }
    }
  }

  /* ---------- report ---------- */
  const keys = Object.keys(rows[0]);
  console.log(keys.join('\t'));
  for (const r of rows) console.log(keys.map((k) => r[k]).join('\t'));
  const num = (o) => Object.keys(o).map(Number).sort((a, b) => a - b);
  const offType = num(all.sizes).filter((s) => !CFG.typeScale.includes(s));
  const worst = (k) => Math.max(...rows.map((r) => r[k]));
  console.log('\nSUMMARY');
  console.log(`font sizes: max ${worst('sizes')} per page view (limit ${CFG.maxSizes}); ${num(all.sizes).length} across the site: ${num(all.sizes).join(' ')}`);
  console.log(`  off the scale [${CFG.typeScale.join(' ')}]: ${offType.length ? offType.join(' ') : 'none'}`);
  console.log(`font weights: max ${worst('weights')} per page view (limit ${CFG.maxWeights}); site: ${Object.keys(all.weights).sort().join(' ')}`);
  console.log(`line length: widest Latin line ${worst('maxCh')}ch (limit ${CFG.maxCh}), widest Chinese line ${worst('maxEm')}em (limit ${CFG.maxEm}); ${all.long.size} over the limit`);
  console.log(`spacing: ${Object.keys(all.offScale).length} off-scale values in ${Object.values(all.offScale).reduce((a, v) => a + v.n, 0)} uses; distinct per view max ${worst('spaceVals')}`);
  console.log(`interactive (worst view): no hover ${worst('noHover')}, no pressed ${worst('noActive')}, no focus ring ${worst('noFocus')}, no 150-250ms transition ${worst('notSmooth')}, no disabled style ${worst('noDisabled')}`);
  console.log(`tabular numbers: ${Object.values(all.numBad).reduce((a, v) => a + v.n, 0)} price/time texts without tabular-nums`);
  console.log(`headings with issues: ${all.head.size}; overflow worst ${worst('overflow')}px; console/network errors ${all.errs.size}; links bad ${linkBad.length} of ${links.size}`);
  console.log('reduced motion:\n  ' + calm.join('\n  '));
  const show = (title, o, n = 14) => { const e = Object.entries(o).sort((a, b) => b[1].n - a[1].n); if (e.length) console.log(`\n${title}\n` + e.slice(0, n).map(([k, v]) => `  ${k} x${v.n}: ${v.ex.join(' | ')}`).join('\n')); };
  if (DETAIL || offType.length) show('font sizes off the scale', Object.fromEntries(Object.entries(all.sizes).filter(([k]) => !CFG.typeScale.includes(Number(k)))), 30);
  if (DETAIL || Object.keys(all.weights).length > CFG.maxWeights) show('weights', all.weights);
  show('spacing off the scale', all.offScale, DETAIL ? 60 : 20);
  show('missing interactive states', all.miss);
  show('prices/times without tabular-nums', all.numBad);
  const list = (title, s, n = 12) => { if (s.size || s.length) console.log(`\n${title}\n  ` + [...s].slice(0, n).join('\n  ')); };
  list('lines over the limit', all.long); list('headings', all.head); list('errors', all.errs); list('wider than the screen', all.wide); list('links', linkBad);
}

async function shots() {
  mkdirSync(SHOTS, { recursive: true });
  const out = [];
  for (const lang of opt('--langs', 'en,zh-Hant').split(',')) for (const [w, h] of VIEWS) {
    await open(BASE + PAGES[0], { w, h, lang });
    const total = await evalIn('document.documentElement.scrollHeight');
    const scale = w > 800 ? 0.6 : 1;
    for (let y = 0, i = 0; y < total && i < 14; y += h, i++) {
      await evalIn(`scrollTo(0, ${y}); new Promise(r => setTimeout(r, 900))`);
      const { data } = await c.send('Page.captureScreenshot', { format: 'jpeg', quality: 72, clip: { x: 0, y: await evalIn('scrollY'), width: w, height: h, scale } });
      const f = join(SHOTS, `${PAGES[0].replace('.html', '')}-${lang}-${w}-${String(i).padStart(2, '0')}.jpg`);
      writeFileSync(f, Buffer.from(data, 'base64')); out.push(f);
    }
  }
  console.log(out.join('\n'));
  if (errs.length) console.log('errors:\n' + errs.join('\n'));
}

main().then(() => { quit(); process.exit(0); }, (e) => { console.error(e); quit(); process.exit(1); });
