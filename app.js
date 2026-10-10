/* IronMath - app: lesson path, one-question lesson flow, XP, streaks, badges, progress report, settings. */
"use strict";
(function () {
  const VERSION = "2.2.0";
  const $ = s => document.querySelector(s);
  const view = $("#view"), tabbar = $("#tabbar");

  /* ---------- icons ---------- */
  const ICON = {
    flame: "M12 2c1 4 5.5 5.6 5.5 10.6a5.5 5.5 0 0 1-11 0c0-2.3 1.1-3.9 2.3-5 .2 2.1 1 3.2 2.2 3.6C10.4 8.3 11 5.2 12 2z",
    bolt: "M13.2 2 4 14h7l-1.2 8L19 10h-7z",
    star: "M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z",
    check: "M9.5 16.2 5.3 12l-1.6 1.6 5.8 5.8L20.3 8.6 18.7 7z",
    x: "M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z",
    dumb: "M2.5 9.5h2v-2h3v9h-3v-2h-2zm19 0h-2v-2h-3v9h3v-2h2zM8.5 11h7v2h-7z",
    trophy: "M7 3h10v2h3v3a4 4 0 0 1-4 4h-.4A5 5 0 0 1 13 14.8V17h3v4H8v-4h3v-2.2A5 5 0 0 1 8.4 12H8a4 4 0 0 1-4-4V5h3zm0 4H6v1a2 2 0 0 0 1 1.7zm10 0v2.7A2 2 0 0 0 18 8V7z",
    refresh: "M17.7 6.3A8 8 0 1 0 20 12h-2.2a5.8 5.8 0 1 1-1.7-4.1L13 11h7V4z",
    target: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 3.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zm0 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z",
    book: "M5 3h11a3 3 0 0 1 3 3v15H7a2 2 0 0 1-2-2zm2 14v2h10v-2z",
    sound: "M4 9h4l5-4v14l-5-4H4zm12.5-1.5a6 6 0 0 1 0 9l-1.4-1.4a4 4 0 0 0 0-6.2z",
    lock: "M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v10H5V11a1 1 0 0 1 1-1zm2 0h6V7a3 3 0 0 0-6 0z",
    gear: "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8.3 4.9-1.9 1.1.1 2.2-2.2 1.3-1.9-1.1-1.9 1.1h-2.6l-1.9-1.1-1.9 1.1-2.2-1.3.1-2.2-1.9-1.1v-2.8l1.9-1.1-.1-2.2 2.2-1.3 1.9 1.1L10.7 4h2.6l1.9 1.1 1.9-1.1 2.2 1.3-.1 2.2 1.9 1.1Z"
  };
  const ic = (n, cls) => `<svg viewBox="0 0 24 24" aria-hidden="true"${cls ? ` class="${cls}"` : ""}><path d="${ICON[n]}"/></svg>`;

  /* ---------- state (kept on this phone) ---------- */
  const KEY = "maths-trail-v1";
  const blank = () => ({ v: 2, skin: "classic", xp: 0, days: {}, q: {}, lessons: {}, badges: {}, sound: true, log: [], prac: { A: { n: 0, ok: 0 }, B: { n: 0, ok: 0 }, C: { n: 0, ok: 0 }, D: { n: 0, ok: 0 } }, fixed: 0, pracDone: 0, best: 0, lessonsDone: 0, iosHintOff: false });
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { S = null; }
  S = Object.assign(blank(), S || {});
  if (S.v !== 2) { S.q = {}; S.lessons = {}; S.v = 2; } // v2 replaced the question bank: keep XP, streak and badges, clear per-question records
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };

  const dkey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = () => dkey(new Date());
  function streak() {
    let n = 0; const d = new Date();
    if (!(S.days[dkey(d)] > 0)) d.setDate(d.getDate() - 1);
    while (S.days[dkey(d)] > 0) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  const GOAL = 30;
  const level = () => Math.floor(S.xp / 100) + 1;
  const COLORS = { A: "var(--A)", B: "var(--B)", C: "var(--C)", D: "var(--D)", E: "var(--E)", LA: "var(--muted)", LB: "var(--muted)", LC: "var(--muted)", LD: "var(--muted)" };
  const LATER = [{ id: "LA", key: "A", name: "Ratio & mixed skills" }, { id: "LB", key: "B", name: "Algebra" }, { id: "LC", key: "C", name: "Angles & circles" }, { id: "LD", key: "D", name: "Probability" }];
  const HEX = ["#ff8a1f", "#8b5cf6", "#10b3a3", "#f43f73", "#ffb020", "#2bb673"];

  const LESSONS = [];
  SECTIONS.forEach(s => {
    LEVELS.forEach((L, i) => LESSONS.push({ id: `${s.id}-${i}`, sec: s.id, title: L, qids: Q.filter(q => q.sec === s.id && q.lvl === i).map(q => q.id) }));
    LESSONS.push({ id: `${s.id}-P`, sec: s.id, title: "Practice", practice: true });
  });
  LATER.forEach(l => LESSONS.push({ id: `${l.id}-P`, sec: l.id, title: l.name, practice: true, later: true }));
  const QB = Object.fromEntries(Q.map(q => [q.id, q]));
  const qst = id => S.q[id] || { status: "todo", tries: 0, seen: false };
  const mastered = sec => Q.filter(q => q.sec === sec && qst(q.id).status === "correct").length;
  const secSize = sec => Q.filter(q => q.sec === sec).length;
  const mistakes = () => Q.filter(q => qst(q.id).status === "wrong").map(q => q.id);
  const secName = id => (SECTIONS.find(s => s.id === id) || LATER.find(s => s.id === id) || {}).name || "";

  /* ---------- sound + haptics ---------- */
  let AC = null;
  function tones(seq, type) {
    if (!S.sound) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = AC.currentTime + 0.01;
      seq.forEach(([f, at, dur]) => {
        const o = AC.createOscillator(), g = AC.createGain();
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + at); g.gain.exponentialRampToValueAtTime(0.18, t0 + at + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + (dur || 0.16));
        o.connect(g).connect(AC.destination); o.start(t0 + at); o.stop(t0 + at + (dur || 0.16) + 0.02);
      });
    } catch (e) { }
  }
  const sfx = {
    good: () => { tones([[784, 0], [1046, 0.09, 0.22]], "sine"); try { navigator.vibrate && navigator.vibrate(15); } catch (e) { } },
    bad: () => { tones([[233, 0, 0.14], [185, 0.13, 0.22]], "triangle"); try { navigator.vibrate && navigator.vibrate([30, 40, 30]); } catch (e) { } },
    win: () => tones([[523, 0], [659, 0.11], [784, 0.22], [1046, 0.33, 0.35]], "sine")
  };

  /* ---------- toast + confetti ---------- */
  const toastQ = []; let toasting = false;
  function toast(html) { toastQ.push(html); if (!toasting) nextToast(); }
  function nextToast() {
    const el = $("#toast"); const h = toastQ.shift();
    if (!h) { toasting = false; return; }
    toasting = true; el.innerHTML = h; el.classList.add("show");
    setTimeout(() => { el.classList.remove("show"); setTimeout(nextToast, 380); }, 2200);
  }
  const reduced = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function confetti() {
    if (reduced()) return;
    const cv = $("#confetti"), cx = cv.getContext("2d"), dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cx.scale(dpr, dpr);
    const P = Array.from({ length: 150 }, () => ({ x: innerWidth / 2 + (Math.random() - 0.5) * 120, y: innerHeight * 0.35, vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 13 - 4, r: Math.random() * 6 + 4, c: HEX[Math.floor(Math.random() * HEX.length)], a: Math.random() * 6, va: (Math.random() - 0.5) * 0.4 }));
    const t0 = performance.now();
    (function frame(t) {
      cx.clearRect(0, 0, innerWidth, innerHeight);
      P.forEach(p => { p.vy += 0.32; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c; cx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); cx.restore(); });
      if (t - t0 < 2800) requestAnimationFrame(frame); else cx.clearRect(0, 0, innerWidth, innerHeight);
    })(t0);
  }

  /* ---------- badges ---------- */
  const BADGES = [
    { id: "first", name: "First steps", desc: "Finish a lesson", icon: "check", c: "var(--good)", test: () => S.lessonsDone >= 1 },
    { id: "perfect", name: "Perfect", desc: "3 stars in a lesson", icon: "star", c: "var(--sun)", test: () => Object.values(S.lessons).some(l => l.stars === 3) },
    { id: "streak3", name: "On fire", desc: "3-day streak", icon: "flame", c: "var(--flame)", test: () => S.best >= 3 },
    { id: "streak7", name: "Week warrior", desc: "7-day streak", icon: "flame", c: "var(--bad)", test: () => S.best >= 7 },
    { id: "xp100", name: "100 XP", desc: "Earn 100 XP", icon: "bolt", c: "var(--sun)", test: () => S.xp >= 100 },
    { id: "xp500", name: "500 XP", desc: "Earn 500 XP", icon: "bolt", c: "var(--brand)", test: () => S.xp >= 500 },
    { id: "fixer", name: "Fixer", desc: "Fix 10 mistakes", icon: "refresh", c: "var(--good)", test: () => S.fixed >= 10 },
    { id: "gym", name: "Practice pro", desc: "10 practice rounds", icon: "dumb", c: "var(--brand)", test: () => S.pracDone >= 10 },
    { id: "secA", name: "Number master", desc: "All of Number", icon: "trophy", c: "var(--A)", test: () => mastered("A") === secSize("A") },
    { id: "secB", name: "Powers master", desc: "All of Powers & Primes", icon: "trophy", c: "var(--B)", test: () => mastered("B") === secSize("B") },
    { id: "secC", name: "Area master", desc: "All of Area & Volume", icon: "trophy", c: "var(--C)", test: () => mastered("C") === secSize("C") },
    { id: "secD", name: "Pythagoras master", desc: "All of Pythagoras", icon: "trophy", c: "var(--D)", test: () => mastered("D") === secSize("D") },
    { id: "secE", name: "Fractions master", desc: "All of Fractions & %", icon: "trophy", c: "var(--E)", test: () => mastered("E") === secSize("E") }
  ];
  function checkBadges() {
    const fresh = [];
    BADGES.forEach(b => { if (!S.badges[b.id] && b.test()) { S.badges[b.id] = Date.now(); fresh.push(b); } });
    return fresh;
  }

  /* ---------- install (PWA) ---------- */
  let deferredPrompt = null;
  const standalone = () => (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredPrompt = e; if (route === "learn" || route === "settings") render(); });
  window.addEventListener("appinstalled", () => { deferredPrompt = null; toast(`${ic("check")} Installed`); });
  async function installNow() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try { await deferredPrompt.userChoice; } catch (e) { }
    deferredPrompt = null; render();
  }

  /* ---------- routing ---------- */
  let route = "learn", L = null, quitAsk = false;
  function go(r) { route = r; L = null; render(); window.scrollTo(0, 0); }
  const SKINS = [
    { id: "classic", name: "Classic", bg: "#f6f5fb", fg: "#6d4aff", meta: "#6D4AFF" },
    { id: "forge", name: "Forge", bg: "#121216", fg: "#e5372a", meta: "#121216" },
    { id: "lab", name: "Lab", bg: "#0a1120", fg: "#22d3ee", meta: "#0a1120" },
    { id: "steel", name: "Steel", bg: "#f2f3f5", fg: "#c71f1f", meta: "#c71f1f" }
  ];
  function applySkin() {
    const sk = SKINS.find(s => s.id === S.skin) || SKINS[0];
    if (sk.id === "classic") document.documentElement.removeAttribute("data-skin"); else document.documentElement.dataset.skin = sk.id;
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", sk.meta);
  }
  function render() {
    applySkin();
    tabbar.hidden = !!L;
    view.classList.toggle("lesson", !!L);
    tabbar.querySelectorAll(".tab").forEach(t => t.setAttribute("aria-current", t.dataset.go === route && !L ? "page" : "false"));
    if (L) return;
    if (route === "progress") renderProgress();
    else if (route === "settings") renderSettings();
    else renderHome();
  }

  /* ---------- home: the trail ---------- */
  function currentLessonId() {
    const firstOpen = LESSONS.find(l => !l.practice && !(S.lessons[l.id] && S.lessons[l.id].done));
    if (firstOpen) return firstOpen.id;
    const weakest = SECTIONS.map(s => s.id).sort((a, b) => mastered(a) - mastered(b))[0];
    return `${weakest}-P`;
  }
  function topbar() {
    const st = streak(), todayXp = S.days[today()] || 0;
    return `<div class="topbar"><div class="brand">Iron<b>Math</b></div><div class="stats">
      <span class="stat flame ${todayXp > 0 ? "" : "off"}" title="Day streak">${ic("flame")}${st}</span>
      <span class="stat xp" title="Total XP">${ic("bolt")}${S.xp}</span></div></div>`;
  }
  function renderHome() {
    const todayXp = S.days[today()] || 0, pct = Math.min(100, Math.round(todayXp / GOAL * 100));
    const cur = currentLessonId(), mist = mistakes();
    let h = topbar();
    h += `<div class="card goal"><div class="ring" style="--p:${pct}" data-label="${pct}%"></div><div><h3>${todayXp >= GOAL ? "Daily goal done!" : "Daily goal"}</h3><p class="muted">${todayXp} / ${GOAL} XP today${todayXp >= GOAL ? ". Keep the streak going tomorrow." : ""}</p></div></div>`;
    if (deferredPrompt && !standalone()) h += `<div class="card banner"><p>Install IronMath<small>Open it from your home screen, even offline.</small></p><button class="btn small" data-act="install">Install</button></div>`;
    else if (isIOS() && !standalone() && !S.iosHintOff) h += `<div class="card banner"><p>Add it to your home screen<small>Tap Share, then "Add to Home Screen".</small></p><button class="btn ghost small" data-act="ioshint">OK</button></div>`;
    if (mist.length) h += `<div class="card banner fix"><p>Fix your mistakes<small>${mist.length} question${mist.length > 1 ? "s" : ""} to try again</small></p><button class="btn bad small" data-act="review">Fix</button></div>`;
    SECTIONS.forEach((s, si) => {
      const m = mastered(s.id);
      h += `<section class="unit" id="unit-${s.id}"><div class="unit-head" style="--c:${COLORS[s.id]}"><div><h2>${s.name}</h2><p>${s.blurb.split(".")[0]}.</p></div><span class="count">${m}/${secSize(s.id)}</span></div><div class="path">`;
      LESSONS.filter(l => l.sec === s.id).forEach((l, i) => {
        const rec = S.lessons[l.id], done = rec && rec.done, isCur = l.id === cur;
        const dx = Math.round(Math.sin((i + si * 2) * 1.25) * 64);
        const inner = l.practice ? ic("dumb") : done ? ic("check") : `<span style="font-size:1.6rem;font-weight:900">${i + 1}</span>`;
        const cls = l.practice ? "" : done ? "done" : isCur ? "" : "todo";
        const stars = l.practice ? `<div class="node-label">∞ new questions</div>` : `<div class="stars">${[1, 2, 3].map(k => `<svg viewBox="0 0 24 24" class="${rec && rec.stars >= k ? "on" : ""}"><path d="${ICON.star}"/></svg>`).join("")}</div>`;
        h += `<div class="node-wrap ${isCur ? "has-bubble" : ""}" style="--dx:${dx}px">${isCur ? `<span class="bubble">START</span>` : ""}<button class="node ${cls} ${isCur ? "current" : ""}"${cls === "todo" ? "" : ` style="--c:${COLORS[s.id]}"`} data-lesson="${l.id}" aria-label="${s.name}: ${l.title}">${inner}</button><div class="node-label">${l.title}</div>${stars}</div>`;
      });
      h += `</div></section>`;
    });
    h += `<section class="unit" id="unit-later"><div class="unit-head" style="--c:var(--muted)"><div><h2>Later in Year 8</h2><p>Not in the autumn test. Extra practice for after half term.</p></div></div><div class="path">`;
    LATER.forEach((l, i) => {
      const dx = Math.round(Math.sin(i * 1.25 + 1) * 64);
      h += `<div class="node-wrap" style="--dx:${dx}px"><button class="node" style="--c:var(--muted)" data-lesson="${l.id}-P" aria-label="Later in Year 8: ${l.name}">${ic("dumb")}</button><div class="node-label">${l.name}</div></div>`;
    });
    h += `</div></section>`;
    view.innerHTML = h;
  }

  /* ---------- lesson engine ---------- */
  function startLesson(def) {
    L = Object.assign({ queue: def.items.map(q => ({ q: q, again: 0 })), total: def.items.length, done: 0, first: 0, xp: 0, combo: 0, bestCombo: 0, start: Date.now(), cur: null, answered: 0 }, def);
    quitAsk = false; render(); next();
  }
  function startById(id) {
    const l = LESSONS.find(x => x.id === id); if (!l) return;
    let items;
    if (l.later) { const L2 = LATER.find(x => x.id === l.sec); items = makePractice(L2.key, 10, GENS_OLD).map(q => Object.assign(q, { sec: l.sec })); }
    else items = l.practice ? makePractice(l.sec, 10) : l.qids.map(k => QB[k]);
    startLesson({ id: l.id, sec: l.sec, title: l.title, kind: l.practice ? "practice" : "bank", items: items });
  }
  function startReview(ids) {
    const items = (ids || mistakes()).map(k => QB[k]).filter(Boolean);
    if (!items.length) return;
    startLesson({ id: "review", sec: null, title: "Fix your mistakes", kind: "review", items: items.slice(0, 12) });
  }
  function next() {
    if (!L.queue.length) return finish();
    L.cur = L.queue.shift(); L.attempts = 0; L.seen = false; L.state = "ask";
    renderQuestion();
  }

  const PRAISE = ["Nice!", "Great job!", "Correct!", "Brilliant!", "Spot on!", "Excellent!", "You got it!"];
  function keysFor(q) {
    const k = new Set();
    q.parts.forEach(p => {
      if (["num", "seq"].includes(p.t)) ["/", "−", "."].forEach(x => k.add(x));
      if (p.t === "ratio") k.add(":");
      if (p.t === "pf") ["×", "^", "²"].forEach(x => k.add(x));
      if (p.t === "set" || p.t === "seq" || p.t === "strset") k.add(",");
      if (p.t === "strset") ["H", "T"].forEach(x => k.add(x));
      if (p.t === "expr") {
        (String(p.a).match(/[a-z]/g) || []).forEach(x => k.add(x));
        ["(", ")", "+", "−", "²"].forEach(x => k.add(x));
        if (p.pi) k.add("π");
      }
    });
    return [...k];
  }
  function partInputs(q) {
    return q.parts.map((p, i) => {
      if (p.t === "self") return "";
      if (p.t === "venn") {
        const cells = p.regions.map(r => `<input class="ans ${r.t === "num" ? "small" : ""}" id="p-${i}-${r.k}" style="left:${r.x}%;top:${r.y}%" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="${r.t === "num" ? "numeric" : "text"}" aria-label="${r.k === "out" ? "Outside both" : r.k === "both" ? "In both" : (r.k === "only1" ? p.labels[0] : p.labels[1]) + " only"}">`).join("");
        return `<div class="venn"><svg viewBox="0 0 400 220" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="8" y="8" width="384" height="204" rx="6"/><circle cx="150" cy="114" r="88"/><circle cx="250" cy="114" r="88"/><text x="20" y="32" fill="currentColor" stroke="none" font-size="16">ξ</text><text x="88" y="30" fill="currentColor" stroke="none" font-size="15" font-weight="800" text-anchor="middle">${esc(p.labels[0])}</text><text x="312" y="30" fill="currentColor" stroke="none" font-size="15" font-weight="800" text-anchor="middle">${esc(p.labels[1])}</text></svg>${cells}</div>`;
      }
      const ph = p.ph || (p.t === "expr" ? "e.g. 3x + 2" : p.t === "set" ? "e.g. 1, 2, 3" : "Your answer");
      return `<div class="prow">${p.l ? `<label for="p-${i}">${esc(p.l)}</label>` : ""}${p.pre ? `<span class="affix">${esc(p.pre)}</span>` : ""}<input class="ans" id="p-${i}" placeholder="${esc(ph)}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done">${p.post ? `<span class="affix">${esc(p.post)}</span>` : ""}</div>`;
    }).join("");
  }
  let lastInput = null;
  function renderQuestion() {
    const q = L.cur.q, self = q.parts.length === 1 && q.parts[0].t === "self";
    const pct = Math.round(L.done / L.total * 100);
    const fig = q.gen ? q.fig : FIG[q.id];
    const keys = self ? [] : keysFor(q);
    view.innerHTML = `
      <div class="lesson-top"><button class="icon-btn" data-act="quit" aria-label="Quit lesson">${ic("x")}</button><div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div><span class="combo" id="combo">${L.combo >= 2 ? `${L.combo}× ` : ""}</span></div>
      <div class="q-tag ${L.cur.again ? "again" : ""}" style="--c:${COLORS[q.sec]}">${L.cur.again ? `${ic("refresh")} Try this one again` : `${secName(q.sec)}${q.gen ? " · practice" : ` · ${q.id}`}`}</div>
      <div class="prompt">${fmt(q.q)}</div>
      ${fig ? `<div class="fig">${fig}</div>` : ""}
      <div class="parts">${partInputs(q)}</div>
      ${keys.length ? `<div class="keys" aria-label="Symbols">${keys.map(k => `<button class="key" data-key="${esc(k)}" tabindex="-1">${esc(k)}</button>`).join("")}</div>` : ""}
      ${self ? `<p class="muted">Work this out on paper, then check the answer.</p>` : ""}
      <div class="lesson-spacer"></div>
      <div class="lesson-foot" id="foot"><div class="inner">${self ? `<button class="btn block" data-act="selfshow">Show the answer</button>` : `<button class="btn block good" data-act="check" id="checkBtn" disabled>Check</button>`}</div></div>
      <div class="feedback" id="fb"><div class="inner" id="fbin"></div></div>`;
    const first = view.querySelector("input.ans");
    lastInput = first;
    if (first && !("ontouchstart" in window)) first.focus();
    if (quitAsk) showQuit();
  }
  const valOf = id => { const el = document.getElementById(id); return el ? el.value : ""; };
  function markInput(id, st) { const el = document.getElementById(id); if (el) { el.classList.remove("ok", "bad", "partial"); el.classList.add(st); } }
  function anyFilled() { return [...view.querySelectorAll("input.ans")].some(i => i.value.trim()); }

  function doCheck() {
    if (!L || L.state !== "ask") return;
    const q = L.cur.q; let all = true, anyBad = false; const ans = [], msgs = [], notes = [];
    q.parts.forEach((p, i) => {
      if (p.t === "venn") {
        p.regions.forEach(r => {
          const id = `p-${i}-${r.k}`, v = valOf(id);
          const res = !v.trim() ? { st: "bad" } : (r.t === "set" ? checkSet(v, { a: r.a }) : checkNum(v, { a: String(r.a) }));
          markInput(id, res.st); if (res.st !== "ok") { all = false; if (res.st === "bad") anyBad = true; }
          ans.push(`${r.k === "out" ? "outside" : r.k === "both" ? "middle" : r.k === "only1" ? p.labels[0] : p.labels[1]}: ${v || "–"}`);
        });
        return;
      }
      const id = `p-${i}`, v = valOf(id);
      const res = !v.trim() ? { st: "bad", msg: "Write an answer for every box." } : CHECK[p.t](v, p);
      markInput(id, res.st);
      if (res.note) notes.push(res.note);
      if (res.st !== "ok") { all = false; if (res.st === "bad") anyBad = true; else msgs.push(res.msg); }
      ans.push((p.l ? p.l + " " : "") + (v || "–"));
    });
    L.attempts++;
    if (all) return onCorrect(ans, notes);
    if (!anyBad && L.attempts < 3) return onPartial([...new Set(msgs)], ans);
    onWrong(ans, q.parts.map((p, i) => p.t === "venn" ? null : CHECK[p.t] && valOf(`p-${i}`).trim() ? CHECK[p.t](valOf(`p-${i}`), p) : null).filter(r => r && r.msg && /In the UK/.test(r.msg)).map(r => r.msg));
  }
  function logIt(q, res, ans) {
    S.log.unshift({ qid: q.gen ? `${q.sec}·practice` : q.id, sec: q.sec, at: Date.now(), res: res, ans: ans.map(a => String(a).slice(0, 80)), text: q.gen ? q.q.slice(0, 120) : undefined });
    if (S.log.length > 300) S.log.length = 300;
  }
  function setBank(q, ok) {
    if (q.gen) return;
    const s = Object.assign({ status: "todo", tries: 0, seen: false }, S.q[q.id]);
    const wasWrong = s.status === "wrong";
    s.tries++; s.at = Date.now();
    if (ok) { s.status = "correct"; if (wasWrong) S.fixed++; }
    else if (s.status !== "correct" || L.kind === "review") s.status = "wrong";
    S.q[q.id] = s;
  }
  function feedback(kind, html) {
    const fb = $("#fb"), fin = $("#fbin");
    fb.className = `feedback ${kind}`; fin.innerHTML = html;
    $("#foot").style.visibility = "hidden";
    requestAnimationFrame(() => fb.classList.add("show"));
    const btn = fin.querySelector(".btn"); if (btn) setTimeout(() => btn.focus({ preventScroll: true }), 250);
  }
  const workingHTML = q => `<button class="linkish" data-act="working">See the working</button><div class="working" id="working" hidden>${fmt(q.sol)}</div>`;

  function onCorrect(ans, notes) {
    const q = L.cur.q, firstTry = L.attempts === 1 && !L.cur.again && !L.seen;
    const gain = firstTry ? 10 : 5;
    L.xp += gain; L.combo++; L.bestCombo = Math.max(L.bestCombo, L.combo); L.done++; if (firstTry) L.first++;
    L.state = "fb"; setBank(q, true); logIt(q, "ok", ans); save();
    if (q.gen) { const pr = S.prac[q.sec] || (S.prac[q.sec] = { n: 0, ok: 0 }); pr.n++; if (firstTry) pr.ok++; }
    sfx.good();
    const bar = view.querySelector(".bar i"); if (bar) bar.style.width = `${Math.round(L.done / L.total * 100)}%`;
    const cb = $("#combo"); if (cb && L.combo >= 2) { cb.textContent = `${L.combo}× `; cb.classList.remove("pop"); void cb.offsetWidth; cb.classList.add("pop"); }
    if ([3, 5, 8, 12].includes(L.combo)) toast(`${ic("flame")} ${L.combo} in a row!`);
    feedback("ok", `<div class="fb-head"><span class="badge">${ic("check")}</span>${PRAISE[Math.floor(Math.random() * PRAISE.length)]} <span style="margin-left:auto;font-size:1rem">+${gain} XP</span></div>${notes && notes.length ? `<div class="fb-body">${esc(notes[0])}</div>` : ""}${workingHTML(q)}<button class="btn block good" data-act="continue">Continue</button>`);
  }
  function onPartial(msgs, ans) {
    logIt(L.cur.q, "partial", ans); save();
    feedback("partial", `<div class="fb-head"><span class="badge">${ic("refresh")}</span>Almost!</div><div class="fb-body">${msgs.map(esc).join("<br>")}</div><button class="btn block" style="--c:var(--warn);--cd:#b36f00" data-act="retry">Try again</button>`);
  }
  function onWrong(ans, ukMsgs) {
    const q = L.cur.q;
    L.combo = 0; L.state = "fb"; setBank(q, false); logIt(q, "wrong", ans);
    if (L.cur.again < 2) L.queue.push({ q: q, again: L.cur.again + 1 }); else L.done++;
    save(); sfx.bad();
    const parts = view.querySelector(".parts"); if (parts) { parts.classList.remove("shake"); void parts.offsetWidth; parts.classList.add("shake"); }
    feedback("bad", `<div class="fb-head"><span class="badge">${ic("x")}</span>Not quite</div><div class="fb-body"><span class="lab">Correct answer:</span> ${fmt(q.ans)}</div>${ukMsgs && ukMsgs.length ? `<div class="fb-body">${esc(ukMsgs[0])}</div>` : ""}${workingHTML(q)}${L.cur.again < 2 ? `<div class="fb-body muted" style="font-weight:700;font-size:.9rem">It will come back at the end of this lesson.</div>` : ""}<button class="btn block bad" data-act="continue">Got it</button>`);
  }
  function selfShow() {
    const q = L.cur.q; L.state = "fb";
    feedback("partial", `<div class="fb-head"><span class="badge">${ic("book")}</span>Check your working</div><div class="working">${fmt(q.sol)}</div><div class="fb-body"><span class="lab">Answer:</span> ${fmt(q.ans)}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><button class="btn bad" data-act="selfno">Not quite</button><button class="btn good" data-act="selfok">I got it</button></div>`);
  }
  function selfMark(ok) {
    const q = L.cur.q;
    if (ok) { L.xp += 10; L.combo++; L.first++; sfx.good(); } else { L.combo = 0; sfx.bad(); }
    L.done++; setBank(q, ok); logIt(q, ok ? "ok" : "wrong", ["self-check"]); save(); next();
  }

  function commitXp(x) {
    if (x <= 0) return;
    S.xp += x; S.days[today()] = (S.days[today()] || 0) + x;
  }
  function finish() {
    const acc = L.total ? L.first / L.total : 1;
    const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
    const perfect = L.first === L.total;
    const bonus = 5 + (perfect ? 5 : 0);
    const before = streak(), hadToday = (S.days[today()] || 0) > 0;
    commitXp(L.xp + bonus);
    const after = streak(); S.best = Math.max(S.best, after);
    if (L.kind === "bank") { const r = S.lessons[L.id] || {}; S.lessons[L.id] = { done: true, stars: Math.max(r.stars || 0, stars), at: Date.now() }; }
    if (L.kind === "practice") S.pracDone++;
    S.lessonsDone++;
    const fresh = checkBadges(); save();
    const secs = Math.round((Date.now() - L.start) / 1000), time = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
    const total = L.xp + bonus;
    view.innerHTML = `<div class="result">
      <div class="big-stars">${[1, 2, 3].map(k => `<svg viewBox="0 0 24 24" class="${k <= stars ? "on" : ""}"><path d="${ICON.star}"/></svg>`).join("")}</div>
      <h1>${perfect ? "Perfect lesson!" : L.kind === "review" ? "Mistakes fixed!" : "Lesson complete!"}</h1>
      <p class="muted" style="margin:0">${L.title}${L.sec ? ` · ${secName(L.sec)}` : ""}</p>
      <div class="tiles">
        <div class="tile" style="--c:var(--sun)"><div class="t">Total XP</div><div class="v" id="xpCount">0</div></div>
        <div class="tile" style="--c:var(--good)"><div class="t">Accuracy</div><div class="v">${Math.round(acc * 100)}%</div></div>
        <div class="tile" style="--c:var(--brand)"><div class="t">Time</div><div class="v">${time}</div></div>
      </div>
      ${L.bestCombo >= 3 ? `<p style="margin:0;font-weight:800">Best run: ${L.bestCombo} in a row</p>` : ""}
      <button class="btn block" data-act="home">Continue</button>
    </div>`;
    L = null; view.classList.remove("lesson"); tabbar.hidden = true;
    view.querySelectorAll(".big-stars svg").forEach((s, i) => setTimeout(() => s.classList.add("in"), 250 + i * 260));
    const el = $("#xpCount"); const t0 = performance.now();
    (function count(t) { const k = Math.min(1, (t - t0) / 900); el.textContent = Math.round(total * k); if (k < 1) requestAnimationFrame(count); })(t0);
    sfx.win(); confetti();
    if (!hadToday && after > before) setTimeout(() => toast(`${ic("flame")} ${after}-day streak!`), 600);
    fresh.forEach(b => setTimeout(() => toast(`${ic(b.icon)} Badge: ${b.name}`), 900));
  }
  function showQuit() {
    quitAsk = true;
    feedback("partial", `<div class="fb-head"><span class="badge">${ic("x")}</span>Leave this lesson?</div><div class="fb-body">You keep the XP you have earned so far.</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><button class="btn ghost" data-act="stay">Keep going</button><button class="btn bad" data-act="leave">Leave</button></div>`);
  }

  /* ---------- progress report ---------- */
  function renderProgress() {
    const lv = level(), inLv = S.xp % 100, st = streak();
    const recent = S.log.slice(0, 100), okN = recent.filter(l => l.res === "ok").length;
    const acc = recent.length ? Math.round(okN / recent.length * 100) : 0;
    const totalM = SECTIONS.reduce((a, s) => a + mastered(s.id), 0);
    const days = []; const d = new Date(); d.setDate(d.getDate() - 13);
    for (let i = 0; i < 14; i++) { days.push(dkey(d)); d.setDate(d.getDate() + 1); }
    const max = Math.max(GOAL, ...days.map(k => S.days[k] || 0));
    const mist = mistakes();
    let h = topbar();
    h += `<div class="card hero"><div class="ring" style="--p:${inLv}" data-label="Lv ${lv}"></div><div><h1>Level ${lv}</h1><p class="muted" style="margin:4px 0 0;font-weight:700">${S.xp} XP in total · ${100 - inLv} XP to level ${lv + 1}</p></div></div>`;
    h += `<div class="grid2">
      <div class="card mini" style="--c:var(--flame)">${ic("flame")}<div><b style="color:var(--flame)">${st}</b><span>day streak</span></div></div>
      <div class="card mini" style="--c:var(--sun)">${ic("trophy")}<div><b style="color:var(--sun)">${S.best}</b><span>best streak</span></div></div>
      <div class="card mini" style="--c:var(--good)">${ic("target")}<div><b style="color:var(--good)">${recent.length ? acc + "%" : "–"}</b><span>accuracy (last 100)</span></div></div>
      <div class="card mini" style="--c:var(--brand)">${ic("check")}<div><b style="color:var(--brand)">${totalM}/${Q.length}</b><span>questions mastered</span></div></div></div>`;
    h += `<div class="sec-title">Last 14 days</div><div class="card"><div class="week">${days.map(k => { const v = S.days[k] || 0, isT = k === today(); const dd = new Date(k + "T12:00:00"); return `<div class="col" title="${k}: ${v} XP"><div class="b ${v ? "" : "zero"} ${isT ? "today" : ""}" style="height:${Math.max(4, Math.round(v / max * 80))}px"></div><span class="d">${"SMTWTFS"[dd.getDay()]}</span></div>`; }).join("")}</div><p class="muted" style="margin:8px 0 0;font-size:.85rem;font-weight:700">XP per day · daily goal ${GOAL} XP</p></div>`;
    h += `<div class="sec-title">Sections</div><div class="secs">${SECTIONS.map(s => { const m = mastered(s.id), n = secSize(s.id), pc = Math.round(m / n * 100); const pr = S.prac[s.id] || { n: 0, ok: 0 }; return `<button class="card" data-unit="${s.id}" style="text-align:left;cursor:pointer"><div class="ring" style="--p:${pc};--c:${COLORS[s.id]}" data-label="${pc}%"></div><div><b>${s.name}</b><small>${m}/${n} done${pr.n ? ` · practice ${Math.round(pr.ok / pr.n * 100)}%` : ""}</small></div></button>`; }).join("")}</div>`;
    h += `<div class="sec-title">Still to fix ${mist.length ? `(${mist.length})` : ""}</div><div class="card">${mist.length ? `<div class="chips">${mist.map(id => `<button class="chip" style="--c:${COLORS[id[0]]}" data-fix="${id}">${id}</button>`).join("")}</div><div style="margin-top:12px"><button class="btn bad block" data-act="review">Fix them now</button></div>` : `<p class="muted" style="margin:0;font-weight:700">Nothing to fix. Every question you missed has been put right.</p>`}</div>`;
    h += `<div class="sec-title">Badges</div><div class="badges">${BADGES.map(b => `<div class="bdg ${S.badges[b.id] ? "on" : ""}" style="--c:${b.c}" title="${esc(b.desc)}"><div class="medal">${ic(S.badges[b.id] ? b.icon : "lock")}</div>${esc(b.name)}</div>`).join("")}</div>`;
    const rows = S.log.slice(0, 10);
    h += `<div class="sec-title">Recent answers</div><div class="card">${rows.length ? `<div class="log">${rows.map(l => `<div class="log-row"><span class="dot ${l.res === "ok" ? "" : l.res === "wrong" ? "bad" : "partial"}"></span><span><b>${esc(l.qid)}</b> <code>${esc((l.ans || []).join(" · "))}</code></span><span class="muted" style="font-size:.8rem">${new Date(l.at).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span></div>`).join("")}</div>` : `<p class="muted" style="margin:0;font-weight:700">Your answers will appear here after your first lesson.</p>`}</div>`;
    view.innerHTML = h;
  }

  /* ---------- settings ---------- */
  let resetArmed = false;
  function renderSettings() {
    let inst;
    if (standalone()) inst = `<p class="muted" style="margin:0;font-weight:700">Installed on this phone.</p>`;
    else if (deferredPrompt) inst = `<button class="btn block" data-act="install">Install IronMath</button>`;
    else if (isIOS()) inst = `<ol class="steps"><li>Open this page in Safari.</li><li>Tap the Share button.</li><li>Tap "Add to Home Screen".</li></ol>`;
    else inst = `<ol class="steps"><li>Open this page in Chrome.</li><li>Tap the ⋮ menu.</li><li>Tap "Install app" or "Add to Home screen".</li></ol>`;
    view.innerHTML = topbar() + `
      <div class="sec-title">Settings</div>
      <div class="card">
        <div class="set-row" style="display:block"><b>Look</b><div class="muted" style="font-size:.85rem;font-weight:700">Pick the colours and style you like</div>
          <div class="skins">${SKINS.map(s => `<button class="skin" data-skin="${s.id}" aria-pressed="${S.skin === s.id}"><i style="background:linear-gradient(135deg, ${s.bg} 50%, ${s.fg} 50%)"></i>${s.name}</button>`).join("")}</div></div>
        <div class="set-row"><div><b>Sounds</b><div class="muted" style="font-size:.85rem;font-weight:700">Beeps for right and wrong answers</div></div><button class="switch" role="switch" aria-checked="${S.sound}" data-act="sound" aria-label="Sounds"></button></div>
        <div class="set-row" style="display:block"><b>Install on your phone</b>${inst}</div>
      </div>
      <div class="sec-title">Backup</div>
      <div class="card" style="display:grid;gap:10px">
        <p class="muted" style="margin:0;font-weight:700">Your progress is saved on this phone only. Copy this code to move it to another phone, or to keep it safe.</p>
        <button class="btn ghost block" data-act="copy">Copy backup code</button>
        <textarea id="bk" placeholder="Paste a backup code here to restore it"></textarea>
        <button class="btn block" data-act="restore">Restore from code</button>
      </div>
      <div class="sec-title">Start again</div>
      <div class="card"><button class="btn bad block" data-act="reset">${resetArmed ? "Tap again to delete all progress" : "Reset all progress"}</button></div>
      <p class="muted" style="text-align:center;font-size:.8rem;font-weight:700;margin-top:18px">IronMath ${VERSION} · Year 8 · 100 questions + endless practice</p>`;
  }
  const encode = o => btoa(unescape(encodeURIComponent(JSON.stringify(o))));
  const decode = s => JSON.parse(decodeURIComponent(escape(atob(s.trim()))));

  /* ---------- events ---------- */
  document.addEventListener("click", async e => {
    const t = e.target.closest("button"); if (!t) return;
    if (t.dataset.go) return go(t.dataset.go);
    if (t.dataset.skin) { S.skin = t.dataset.skin; save(); return render(); }
    if (t.dataset.lesson) return startById(t.dataset.lesson);
    if (t.dataset.fix) return startReview([t.dataset.fix]);
    if (t.dataset.unit) { go("learn"); const u = document.getElementById("unit-" + t.dataset.unit); if (u) u.scrollIntoView({ behavior: reduced() ? "auto" : "smooth" }); return; }
    if (t.dataset.key && lastInput) {
      const k = t.dataset.key, el = lastInput, s = el.selectionStart ?? el.value.length, en = el.selectionEnd ?? el.value.length;
      el.value = el.value.slice(0, s) + k + el.value.slice(en); el.setSelectionRange(s + k.length, s + k.length);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }
    const a = t.dataset.act; if (!a) return;
    if (a === "check") return doCheck();
    if (a === "continue") return next();
    if (a === "retry") { $("#fb").classList.remove("show"); $("#foot").style.visibility = ""; L.state = "ask"; const inp = view.querySelector("input.ans.partial") || view.querySelector("input.ans"); if (inp) inp.focus(); return; }
    if (a === "working") { const w = $("#working"); if (w) { w.hidden = !w.hidden; if (L && L.state === "ask") L.seen = true; } return; }
    if (a === "selfshow") return selfShow();
    if (a === "selfok") return selfMark(true);
    if (a === "selfno") return selfMark(false);
    if (a === "quit") return showQuit();
    if (a === "stay") { quitAsk = false; $("#fb").classList.remove("show"); $("#foot").style.visibility = ""; return; }
    if (a === "leave") { quitAsk = false; if (L) { commitXp(L.xp); const st = streak(); S.best = Math.max(S.best, st); checkBadges(); save(); } return go("learn"); }
    if (a === "home") return go("learn");
    if (a === "review") return startReview();
    if (a === "install") return installNow();
    if (a === "ioshint") { S.iosHintOff = true; save(); return render(); }
    if (a === "sound") { S.sound = !S.sound; save(); if (S.sound) sfx.good(); return render(); }
    if (a === "copy") {
      const code = encode(S); const bk = $("#bk"); bk.value = code;
      try { await navigator.clipboard.writeText(code); toast(`${ic("check")} Backup code copied`); } catch (err) { bk.select(); toast("Code shown below: copy it"); }
      return;
    }
    if (a === "restore") {
      try { const o = decode($("#bk").value); if (!o || typeof o !== "object" || !("xp" in o)) throw 0; S = Object.assign(blank(), o); save(); toast(`${ic("check")} Progress restored`); go("learn"); }
      catch (err) { toast("That code doesn't look right. Copy it again and paste the whole thing."); }
      return;
    }
    if (a === "reset") {
      if (!resetArmed) { resetArmed = true; render(); setTimeout(() => { resetArmed = false; if (route === "settings" && !L) render(); }, 4000); return; }
      resetArmed = false; S = blank(); save(); toast("Progress reset"); return go("learn");
    }
  });
  document.addEventListener("input", e => {
    if (!L || !e.target.matches("input.ans")) return;
    const b = $("#checkBtn"); if (b) b.disabled = !anyFilled();
    if (L.state === "ask") e.target.classList.remove("ok", "bad", "partial");
  });
  document.addEventListener("focusin", e => { if (e.target.matches && e.target.matches("input.ans")) lastInput = e.target; });
  document.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    if (!L) { const c = view.querySelector(".result .btn[data-act=home]"); if (c) { e.preventDefault(); c.click(); } return; }
    const fb = $("#fb");
    if (fb && fb.classList.contains("show")) { const b = fb.querySelector(".btn[data-act=continue], .btn[data-act=retry]"); if (b) { e.preventDefault(); b.click(); } return; }
    if (e.target.matches("input.ans") && anyFilled()) { e.preventDefault(); doCheck(); }
  });

  /* ---------- offline + updates ---------- */
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => { });
    let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloaded || L) return; reloaded = true; location.reload();
    });
  }

  if (S.best < streak()) S.best = streak();
  render();
  window.__mt = { S: () => S, startById: startById, LESSONS: LESSONS, setSkin: id => { S.skin = id; save(); render(); } };
})();
