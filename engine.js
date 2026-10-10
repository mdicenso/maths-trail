/* Maths Trail - answer checking. Generated from the Year 8 Maths Trainer v2 question bank. */
"use strict";
  /* ---------- formatting ---------- */
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const fmt = s => esc(s).replace(/(\d+)?\{(-?\d+)\/(\d+)\}/g, (m, w, n, d) =>
    (w ? `<span class="whole">${w}</span>` : "") + `<span class="frac" aria-label="${n} over ${d}"><span class="num">${n}</span><span class="den">${d}</span></span>`);

  /* ---------- number checking ---------- */
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
  function parseNum(raw, pctDiv) {
    let s = String(raw).trim().toLowerCase().replace(/[−–]/g, "-").replace(/½/g, " 1/2").replace(/¼/g, " 1/4").replace(/¾/g, " 3/4").replace(/⅓/g, " 1/3");
    const pct = s.includes("%");
    s = s.replace(/^[a-z]\s*=\s*/, "");
    s = s.replace(/[^0-9.,\/\- ]/g, " ").replace(/\s+/g, " ").trim();
    if (/^-?\d{1,3}( \d{3})+(\.\d+)?$/.test(s)) s = s.replace(/ /g, "");          // 40 000
    else if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, "");     // 40,000
    else if (/^-?\d+,\d+$/.test(s)) s = s.replace(",", ".");                        // 0,58 (decimal comma)
    s = s.replace(/\s*\/\s*/g, "/").replace(/^-\s+/, "-");
    let m, r;
    if ((m = s.match(/^(-?)(\d+) (\d+)\/(\d+)$/))) {
      const w = +m[2], n = +m[3], d = +m[4]; if (!d) return null;
      r = { v: (m[1] ? -1 : 1) * (w + n / d), kind: "mixed", n: n, d: d };
    } else if ((m = s.match(/^(-?\d+)\/(\d+)$/))) {
      const n = +m[1], d = +m[2]; if (!d) return null;
      r = { v: n / d, kind: "frac", n: n, d: d };
    } else if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) {
      r = { v: +s, kind: s.includes(".") ? "dec" : "int" };
    } else return null;
    if (pct && pctDiv) r.v /= 100;
    return r;
  }
  const close = (a, b, tol) => Math.abs(a - b) <= Math.max(tol || 0, 1e-9 * Math.max(1, Math.abs(b)));
  const WRONG = { st: "bad", msg: "Not yet. Check your working and try again." };
  const OK = { st: "ok", msg: "Correct" };

  function checkNum(input, p) {
    const g = parseNum(input, false), e = parseNum(p.a, false);
    if (!g) return { st: "bad", msg: "Type a number, for example 12, 0.5, 3/4 or 1 3/4." };
    const raw = String(input).trim();
    if (!close(g.v, e.v, p.tol)) {
      // UK convention: "1,500" is one thousand five hundred. If she meant 1.5, teach the point instead of a bare "wrong".
      if (/^-?\d{1,3},\d{3}$/.test(raw) && close(+raw.replace(",", "."), e.v, p.tol)) return { st: "bad", msg: `In the UK a comma separates thousands, so ${raw} means ${raw.replace(",", "")}. Use a point for decimals: ${+raw.replace(",", ".")}.` };
      return WRONG;
    }
    const eFrac = e.kind === "frac" || e.kind === "mixed";
    const ukNote = /^-?\d+,\d{1,2}$|^-?\d+,\d{4,}$/.test(raw.replace(/[^0-9,\-]/g, "")) ? `In the UK we write decimals with a point: ${raw.replace(",", ".")}.` : null;
    if (p.frac && eFrac && (g.kind === "dec" || g.kind === "int")) return { st: "partial", msg: "Right value. Now write it as a fraction." };
    if (p.mixed && g.kind === "frac" && Math.abs(g.n) > g.d) return { st: "partial", msg: "Right value. Now write it as a mixed number." };
    if (g.kind === "frac" && gcd(g.n, g.d) > 1) return { st: "partial", msg: "Right value. Now simplify the fraction fully." };
    if (g.kind === "mixed" && gcd(g.n, g.d) > 1) return { st: "partial", msg: "Right value. Simplify the fraction part." };
    return ukNote ? { st: "ok", msg: "Correct", note: ukNote } : OK;
  }
  function checkSet(input, p) {
    const got = [...new Set((input.match(/-?\d+/g) || []).map(Number))].sort((a, b) => a - b);
    const exp = [...p.a].sort((a, b) => a - b);
    if (!got.length) return { st: "bad", msg: "List the numbers, separated by commas." };
    const missing = exp.filter(x => !got.includes(x)).length, extra = got.filter(x => !exp.includes(x)).length;
    if (!missing && !extra) return OK;
    if (missing && !extra) return { st: "partial", msg: "Everything you wrote is right, but some numbers are missing." };
    return { st: "bad", msg: "Not yet: at least one number does not belong here." };
  }
  function checkStrSet(input, p) {
    const got = [...new Set((input.toUpperCase().match(/[HT]{2}/g) || []))].sort();
    const exp = [...p.a].sort();
    if (got.join() === exp.join()) return OK;
    if (got.every(x => exp.includes(x)) && got.length) return { st: "partial", msg: "Good so far. There are more outcomes." };
    return WRONG;
  }
  function checkRatio(input, p) {
    const m = input.replace(/\s/g, "").match(/^(\d+):(\d+)$/);
    if (!m) return { st: "bad", msg: "Write it like 4 : 5." };
    const x = +m[1], y = +m[2], [a, b] = p.a;
    if (x * b !== y * a) return WRONG;
    if (x !== a) return { st: "partial", msg: "Equivalent ratio, but not in its lowest terms yet." };
    return OK;
  }
  function checkSeq(input, p) {
    const items = input.split(/[;,<]+/).map(s => s.trim()).filter(Boolean);
    if (items.length !== p.a.length) return { st: "bad", msg: `Write all ${p.a.length} values, separated by commas.` };
    const vals = items.map(s => parseNum(s, true));
    if (vals.some(v => !v)) return { st: "bad", msg: "I couldn't read one of the values." };
    return vals.every((v, i) => close(v.v, p.a[i], 1e-6)) ? OK : WRONG;
  }
  function checkText(input, p) {
    const s = input.toLowerCase().replace(/\s/g, "");
    return p.a.includes(s) ? OK : WRONG;
  }
  const isPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  function checkPF(input, p) {
    const s = input.replace(/\s/g, "").replace(/²/g, "^2").replace(/³/g, "^3").replace(/[×x*·.]/gi, "*");
    const fs = s.split("*").filter(Boolean);
    if (!fs.length) return { st: "bad", msg: "Write it like 2^3 × 5." };
    let prod = 1; const seen = {};
    for (const f of fs) {
      const m = f.match(/^(\d+)(\^(\d+))?$/);
      if (!m) return { st: "bad", msg: "Write it like 2^3 × 5 (use × or * between factors)." };
      const b = +m[1], e = m[3] ? +m[3] : 1;
      if (!isPrime(b)) return { st: "partial", msg: `${b} is not a prime number. Keep breaking it down.` };
      prod *= Math.pow(b, e); seen[b] = (seen[b] || 0) + 1;
    }
    if (prod !== p.a) return WRONG;
    if (Object.values(seen).some(c => c > 1)) return { st: "partial", msg: "Right primes. Now use index form (e.g. 2 × 2 = 2²)." };
    return OK;
  }

  /* ---------- algebra checking: parse and compare by evaluating ---------- */
  function normExpr(s) {
    return String(s).toLowerCase().replace(/\s/g, "").replace(/[−–]/g, "-").replace(/[×·]/g, "*").replace(/÷/g, "/")
      .replace(/²/g, "^2").replace(/³/g, "^3").replace(/pi|π/g, "π");
  }
  function tokenize(s) {
    const out = []; let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/[0-9.]/.test(c)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; out.push({ k: "n", v: parseFloat(s.slice(i, j)) }); i = j; continue; }
      if (/[a-zπ]/.test(c)) { out.push({ k: "v", v: c }); i++; continue; }
      if ("+-*/^()".includes(c)) { out.push({ k: c }); i++; continue; }
      throw new Error("bad char");
    }
    const res = [];
    for (let t of out) {
      const prev = res[res.length - 1];
      if (prev && (prev.k === "n" || prev.k === "v" || prev.k === ")") && (t.k === "v" || t.k === "(" || (t.k === "n" && prev.k !== "n"))) res.push({ k: "*" });
      res.push(t);
    }
    return res;
  }
  function parseExpr(str) {
    const t = tokenize(normExpr(str)); let i = 0;
    const peek = () => t[i], take = () => t[i++];
    function expr() { let f = term(); while (peek() && (peek().k === "+" || peek().k === "-")) { const op = take().k, g = term(), h = f; f = op === "+" ? e => h(e) + g(e) : e => h(e) - g(e); } return f; }
    function term() { let f = unary(); while (peek() && (peek().k === "*" || peek().k === "/")) { const op = take().k, g = unary(), h = f; f = op === "*" ? e => h(e) * g(e) : e => h(e) / g(e); } return f; }
    function unary() { if (peek() && peek().k === "-") { take(); const g = unary(); return e => -g(e); } if (peek() && peek().k === "+") { take(); return unary(); } return power(); }
    function power() { const b = primary(); if (peek() && peek().k === "^") { take(); const x = unary(); return e => Math.pow(b(e), x(e)); } return b; }
    function primary() {
      const tk = take(); if (!tk) throw new Error("end");
      if (tk.k === "n") return () => tk.v;
      if (tk.k === "v") return e => e[tk.v];
      if (tk.k === "(") { const f = expr(); if (!peek() || take().k !== ")") throw new Error("paren"); return f; }
      throw new Error("unexpected");
    }
    const f = expr(); if (i !== t.length) throw new Error("trailing");
    const vars = [...new Set(t.filter(x => x.k === "v").map(x => x.v))];
    return { f: f, vars: vars };
  }
  function equiv(a, b) {
    const A = parseExpr(a), B = parseExpr(b);
    const vars = [...new Set([...A.vars, ...B.vars])];
    for (let k = 0; k < 6; k++) {
      const env = {}; vars.forEach((v, j) => { env[v] = 1.1 + ((k * 7 + j * 3) % 11) * 0.37 + k * 0.13; });
      const x = A.f(env), y = B.f(env);
      if (!isFinite(x) || Math.abs(x - y) > 1e-7 * Math.max(1, Math.abs(y))) return false;
    }
    return true;
  }
  function topTerms(s) {
    let depth = 0, n = 1;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === "(") depth++; else if (c === ")") depth--;
      else if ((c === "+" || c === "-") && depth === 0 && i > 0 && !"*/^(".includes(s[i - 1])) n++;
    }
    return n;
  }
  function checkExpr(input, p) {
    let raw = input;
    if (p.pi) raw = raw.replace(/cm\^?2|cm²|cm/gi, "");
    let ok;
    try { ok = equiv(raw, p.a); } catch (e) { return { st: "bad", msg: "I couldn't read that. Use letters, numbers, brackets, + and −, and x^2 or x² for squares." }; }
    if (!ok) return WRONG;
    const s = normExpr(raw);
    if (p.pi && !s.includes("π")) return { st: "partial", msg: "Right value, but leave the answer in terms of π." };
    if (p.factor) {
      const idx = s.indexOf("(");
      if (idx <= 0) return { st: "partial", msg: "That is equal, but it isn't factorised. Take out the HCF and use a bracket." };
      const pre = s.slice(0, idx).replace(/\*$/, "");
      let full = false; try { full = equiv(pre, p.factor); } catch (e) { full = false; }
      if (!full) return { st: "partial", msg: "Factorised, but not completely. A bigger common factor can come out." };
      return OK;
    }
    if (p.simp) {
      if (s.includes("(")) return { st: "partial", msg: "Right, but expand the brackets fully." };
      if (/[*\/]/.test(s)) return { st: "partial", msg: "Right, but simplify it: no × or ÷ signs left." };
      if (topTerms(s) > topTerms(normExpr(p.a))) return { st: "partial", msg: "Right, but collect the like terms together." };
    }
    return OK;
  }
  const CHECK = { num: checkNum, set: checkSet, strset: checkStrSet, ratio: checkRatio, seq: checkSeq, text: checkText, pf: checkPF, expr: checkExpr };

