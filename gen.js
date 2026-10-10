/* Maths Trail - shared generator helpers + "Later in Year 8" practice (topics taught after the autumn test). */
"use strict";

const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
function fracStr(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1; n /= g; d /= g;
  return d === 1 ? String(n) : `${n}/${d}`;
}
// a proper fraction a/b in lowest terms with denominator in [lo, hi]
function cop(lo, hi) { for (;;) { const b = rnd(lo, hi), a = rnd(1, b - 1); if (gcd(a, b) === 1) return [a, b]; } }
const fracMark = s => s.includes("/") ? `{${s}}` : s;          // display markup for fmt()
const coef = (c, v) => (c === 1 ? v : c === -1 ? "-" + v : c + v);  // machine form
const show = s => s.replace(/-/g, "−").replace(/\+/g, " + ").replace(/(\w)−/g, "$1 − ");
let genSeq = 0;
const G = (sec, q, parts, sol, ans, fig) => ({ id: `${sec}·P${++genSeq}`, sec: sec, gen: true, q: q, parts: parts, sol: sol, ans: ans, fig: fig || null });

const GENS_OLD = {
  A: [
    () => { const [a, b] = cop(3, 9), [c, d] = cop(2, 9); const s = fracStr(a * c, b * d);
      return G("A", `Work out {${a}/${b}} × {${c}/${d}}. Simplify fully.`, [N(s, { frac: true })], `Multiply tops and bottoms: {${a * c}/${b * d}}${s !== `${a * c}/${b * d}` ? `, then simplify to ${fracMark(s)}` : ""}.`, fracMark(s)); },
    () => { const [a, b] = cop(2, 9), [c, d] = cop(2, 9); const s = fracStr(a * d, b * c);
      return G("A", `Work out {${a}/${b}} ÷ {${c}/${d}}.`, [N(s, { frac: true })], `Keep, change, flip: {${a}/${b}} × {${d}/${c}} = {${a * d}/${b * c}}${s !== `${a * d}/${b * c}` ? ` = ${fracMark(s)}` : ""}.`, fracMark(s)); },
    () => { const [a, b] = cop(2, 9); let [c, d] = cop(2, 9); while (d === b) [c, d] = cop(2, 9); const add = Math.random() < 0.5 || a * d <= c * b;
      const n = add ? a * d + c * b : a * d - c * b, s = fracStr(n, b * d);
      return G("A", `Work out {${a}/${b}} ${add ? "+" : "−"} {${c}/${d}}.`, [N(s, { frac: true })], `Common denominator ${b * d}: {${a * d}/${b * d}} ${add ? "+" : "−"} {${c * b}/${b * d}} = {${n}/${b * d}}${s !== `${n}/${b * d}` ? ` = ${fracMark(s)}` : ""}.`, fracMark(s)); },
    () => { const p = pick([5, 10, 15, 20, 25, 30, 40, 50, 75]), n = 20 * rnd(1, 20), r = p * n / 100;
      return G("A", `Find ${p}% of £${n}.`, [N(String(r), { pre: "£" })], `10% of £${n} is £${n / 10}. ${p}% = ${p / 10} × 10% = £${r}.`, `£${r}`); },
    () => { const pairs = [[1, 2], [2, 3], [1, 3], [3, 4], [2, 5], [3, 5], [1, 4], [4, 5], [2, 7], [3, 7]]; let [a, b] = pick(pairs); if (Math.random() < 0.5) [a, b] = [b, a]; const k = rnd(2, 12), t = (a + b) * k;
      return G("A", `Share £${t} in the ratio ${a} : ${b}. Find the larger share.`, [N(String(Math.max(a, b) * k), { pre: "£" })], `${a} + ${b} = ${a + b} parts. £${t} ÷ ${a + b} = £${k} per part. Larger share: ${Math.max(a, b)} × £${k}.`, `£${Math.max(a, b) * k}`); },
    () => { const g = rnd(2, 9); let m = rnd(2, 7), n = rnd(2, 7); while (n === m || gcd(m, n) !== 1) { m = rnd(2, 7); n = rnd(2, 7); } const x = g * m, y = g * n, hcf = Math.random() < 0.5;
      return G("A", `Find the ${hcf ? "highest common factor (HCF)" : "lowest common multiple (LCM)"} of ${x} and ${y}.`, [N(String(hcf ? g : g * m * n))], hcf ? `List factors: the biggest number that divides both ${x} and ${y} is ${g}.` : `List multiples of ${x} until one is also a multiple of ${y}: ${g * m * n}.`, String(hcf ? g : g * m * n)); },
    () => { const a = rnd(2, 6), b = rnd(2, 4), c = rnd(1, 6); const r = a * a + Math.pow(b, 3) - c * c;
      return G("A", `Work out ${a}² + ${b}³ − √${c * c}.`, [N(String(r))], `${a}² = ${a * a}, ${b}³ = ${b ** 3}, √${c * c} = ${c}. So ${a * a} + ${b ** 3} − ${c} = ${r}.`, String(r)); }
  ],
  B: [
    () => { const k = rnd(2, 9), a = rnd(1, 6), b = rnd(1, 9), neg = Math.random() < 0.5; const exp = `${coef(k * a, "x")}${neg ? "-" : "+"}${k * b}`;
      return G("B", `Expand ${k}(${coef(a, "x")} ${neg ? "−" : "+"} ${b}).`, [E(exp, { simp: true })], `Multiply each term by ${k}: ${k} × ${coef(a, "x")} = ${coef(k * a, "x")} and ${k} × ${neg ? "−" : ""}${b} = ${neg ? "−" : ""}${k * b}.`, show(exp)); },
    () => { const k = rnd(2, 9); let a = rnd(1, 7), b = rnd(1, 9); while (gcd(a, b) !== 1) { a = rnd(1, 7); b = rnd(1, 9); } const neg = Math.random() < 0.4;
      const inner = `${coef(a, "x")}${neg ? "-" : "+"}${b}`;
      return G("B", `Factorise completely ${coef(k * a, "x")} ${neg ? "−" : "+"} ${k * b}.`, [E(`${k}(${inner})`, { factor: String(k) })], `The HCF of ${k * a} and ${k * b} is ${k}. Divide each term by ${k}.`, `${k}(${show(inner)})`); },
    () => { const x = rnd(1, 12), a = rnd(2, 9), b = rnd(1, 20), neg = Math.random() < 0.4; const c = neg ? a * x - b : a * x + b;
      return G("B", `Solve ${a}x ${neg ? "−" : "+"} ${b} = ${c}.`, [N(String(x), { pre: "x =" })], `${neg ? "Add" : "Subtract"} ${b}: ${a}x = ${a * x}. Divide by ${a}.`, `x = ${x}`); },
    () => { const x = rnd(1, 10), a = rnd(3, 9), c = rnd(1, a - 1), b = rnd(1, 15), d = (a - c) * x + b, k = a - c;
      return G("B", `Solve ${a}x + ${b} = ${c === 1 ? "" : c}x + ${d}.`, [N(String(x), { pre: "x =" })], `Subtract ${c === 1 ? "" : c}x from both sides: ${k === 1 ? "" : k}x + ${b} = ${d}. Subtract ${b}: ${k === 1 ? "" : k}x = ${d - b}. Divide by ${k}.`, `x = ${x}`); },
    () => { const x = rnd(2, 6), a = rnd(1, 5), b = rnd(1, 9), neg = Math.random() < 0.6; const r = a * x * x + (neg ? -b * x : b * x);
      return G("B", `x = ${x}. Work out ${a === 1 ? "" : a}x² ${neg ? "−" : "+"} ${b}x.`, [N(String(r))], `x² = ${x * x}, so ${a === 1 ? "" : a + " × "}${x * x} = ${a * x * x}. ${b} × ${x} = ${b * x}. ${a * x * x} ${neg ? "−" : "+"} ${b * x} = ${r}.`, String(r)); },
    () => { const p = rnd(2, 9), q = rnd(2, 9), r = rnd(1, 9); let s = rnd(1, 9); if (s === q) s = q === 1 ? 2 : q - 1; const X = p + r, Y = q - s;
      const exp = `${coef(X, "x")}${Y < 0 ? "-" : "+"}${coef(Math.abs(Y), "y")}`;
      return G("B", `Simplify ${p}x + ${q}y + ${r === 1 ? "" : r}x − ${s === 1 ? "" : s}y.`, [E(exp, { simp: true })], `x terms: ${p}x + ${r}x = ${X}x. y terms: ${q}y − ${s}y = ${Y}y.`, show(exp)); },
    () => { const k = rnd(2, 6), a = rnd(1, 5), b = rnd(1, 6), m = rnd(2, 5), c = rnd(1, 6);
      const X = k * a + m, Cn = k * b - m * c; const exp = `${coef(X, "x")}${Cn < 0 ? "-" : "+"}${Math.abs(Cn)}`;
      return G("B", `Expand and simplify ${k}(${coef(a, "x")} + ${b}) + ${m}(x − ${c}).`, [E(Cn === 0 ? coef(X, "x") : exp, { simp: true })], `${coef(k * a, "x")} + ${k * b} + ${m}x − ${m * c}. Collect like terms.`, show(Cn === 0 ? coef(X, "x") : exp)); }
  ],
  C: [
    () => { const a = rnd(25, 95), b = rnd(20, 150 - a);
      return G("C", `A triangle has angles of ${a}° and ${b}°. Find the third angle.`, [N(String(180 - a - b), { post: "°" })], `Angles in a triangle add up to 180°: 180 − ${a} − ${b}.`, `${180 - a - b}°`); },
    () => { const apex = 2 * rnd(10, 70);
      return G("C", `An isosceles triangle has a top angle of ${apex}°. Find each of the two equal base angles.`, [N(String((180 - apex) / 2), { post: "°" })], `(180 − ${apex}) ÷ 2.`, `${(180 - apex) / 2}°`); },
    () => { const n = pick([5, 6, 8, 9, 10, 12]), names = { 5: "pentagon", 6: "hexagon", 8: "octagon", 9: "nonagon", 10: "decagon", 12: "dodecagon" }, ext = Math.random() < 0.4;
      return ext ? G("C", `Find each exterior angle of a regular ${names[n]} (${n} sides).`, [N(String(360 / n), { post: "°" })], `Exterior angles add up to 360°: 360 ÷ ${n}.`, `${360 / n}°`)
        : G("C", `Find each interior angle of a regular ${names[n]} (${n} sides).`, [N(String((n - 2) * 180 / n), { post: "°" })], `Sum = (${n} − 2) × 180 = ${(n - 2) * 180}°. Divide by ${n}.`, `${(n - 2) * 180 / n}°`); },
    () => { const a = rnd(20, 160), atPoint = Math.random() < 0.5, b = atPoint ? rnd(40, 340 - a) : 0;
      return atPoint ? G("C", `Three angles meet at a point: ${a}°, ${b}° and x. Find x.`, [N(String(360 - a - b), { pre: "x =", post: "°" })], `Angles around a point add up to 360°: 360 − ${a} − ${b}.`, `${360 - a - b}°`)
        : G("C", `Two angles lie on a straight line. One is ${a}°. Find the other.`, [N(String(180 - a), { post: "°" })], `Angles on a straight line add up to 180°: 180 − ${a}.`, `${180 - a}°`); },
    () => { const r = rnd(2, 12), kind = pick(["area", "circ", "pi"]);
      if (kind === "pi") return G("C", `A circle has radius ${r} cm. Find its area in terms of π.`, [E(`${r * r}π`, { pi: true, post: "cm²" })], `A = πr² = π × ${r}² = ${r * r}π.`, `${r * r}π cm²`);
      const v = kind === "area" ? Math.round(3.14 * r * r * 100) / 100 : Math.round(2 * 3.14 * r * 100) / 100;
      return G("C", `A circle has radius ${r} cm. Find its ${kind === "area" ? "area" : "circumference"}. Use π = 3.14.`, [N(String(v), { post: kind === "area" ? "cm²" : "cm", tol: 0.006 })], kind === "area" ? `A = πr² = 3.14 × ${r * r}.` : `C = 2πr = 2 × 3.14 × ${r}.`, `${v} ${kind === "area" ? "cm²" : "cm"}`); },
    () => { const b = 2 * rnd(2, 10), h = rnd(3, 15);
      return G("C", `A triangle has base ${b} cm and perpendicular height ${h} cm. Find its area.`, [N(String(b * h / 2), { post: "cm²" })], `Area = ½ × base × height = ½ × ${b} × ${h}.`, `${b * h / 2} cm²`); },
    () => { let a = rnd(3, 12), b = rnd(a + 1, 16), h = rnd(2, 10); if ((a + b) * h % 2) h++;
      return G("C", `A trapezium has parallel sides ${a} cm and ${b} cm and height ${h} cm. Find its area.`, [N(String((a + b) * h / 2), { post: "cm²" })], `Area = ½ × (${a} + ${b}) × ${h} = ½ × ${a + b} × ${h}.`, `${(a + b) * h / 2} cm²`); }
  ],
  D: [
    () => { const cols = ["red", "blue", "green", "yellow"], n = [rnd(1, 9), rnd(1, 9), rnd(1, 9)], t = n[0] + n[1] + n[2], i = rnd(0, 2), not = Math.random() < 0.5; const s = fracStr(not ? t - n[i] : n[i], t);
      return G("D", `A bag has ${n[0]} red, ${n[1]} blue and ${n[2]} green counters. One is picked at random. Find P(${not ? "not " : ""}${cols[i]}).`, [N(s, { frac: true })], `Total = ${t}. ${not ? `Not ${cols[i]} = ${t} − ${n[i]} = ${t - n[i]}` : `${cols[i][0].toUpperCase() + cols[i].slice(1)} = ${n[i]}`}, so {${not ? t - n[i] : n[i]}/${t}}${s !== `${not ? t - n[i] : n[i]}/${t}` ? ` = ${fracMark(s)}` : ""}.`, fracMark(s)); },
    () => { const both = rnd(2, 8), oa = rnd(3, 12), ob = rnd(3, 12), ne = rnd(1, 8), T = both + oa + ob + ne;
      return G("D", `In a group of ${T} students, ${oa + both} play football, ${ob + both} play tennis and ${ne} play neither. How many play both?`, [N(String(both))], `${T} − ${ne} = ${T - ne} play at least one. ${oa + both} + ${ob + both} = ${oa + ob + 2 * both}, which counts 'both' twice. ${oa + ob + 2 * both} − ${T - ne} = ${both}.`, String(both)); },
    () => { const p = rnd(1, 19) * 5;
      return G("D", `The probability that a bus is late is ${(p / 100).toFixed(2)}. Find the probability that it is not late.`, [N(String(Math.round(100 - p) / 100))], `They add up to 1: 1 − ${(p / 100).toFixed(2)}.`, String(Math.round(100 - p) / 100)); },
    () => { const p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75]), n = 20 * rnd(1, 10);
      return G("D", `The probability of a spinner landing on blue is ${p}. It is spun ${n} times. How many times would you expect blue?`, [N(String(Math.round(p * n)))], `Expected = probability × trials = ${p} × ${n}.`, String(Math.round(p * n))); },
    () => { const ev = pick([["an even number", [2, 4, 6]], ["a prime number", [2, 3, 5]], ["a number greater than 4", [5, 6]], ["a multiple of 3", [3, 6]], ["a number less than 3", [1, 2]], ["a factor of 6", [1, 2, 3, 6]]]); const s = fracStr(ev[1].length, 6);
      return G("D", `A fair six-sided dice is rolled. Find the probability of rolling ${ev[0]}.`, [N(s, { frac: true })], `Outcomes that work: ${ev[1].join(", ")}. That is {${ev[1].length}/6}${s !== `${ev[1].length}/6` ? ` = ${fracMark(s)}` : ""}.`, fracMark(s)); },
    () => { const a = rnd(5, 15), b = rnd(5, 15), both = rnd(1, Math.min(a, b) - 1), T = a + b - both + rnd(0, 8);
      return G("D", `${T} people were asked. ${a} have a dog, ${b} have a cat and ${both} have both. How many have neither?`, [N(String(T - (a + b - both)))], `At least one pet = ${a} + ${b} − ${both} = ${a + b - both}. Neither = ${T} − ${a + b - both}.`, String(T - (a + b - both))); }
  ]
};
function makePractice(sec, n, table) {
  const gens = (table || GENS)[sec], out = [];
  for (let i = 0; i < n; i++) out.push(gens[i % gens.length]());
  return out.sort(() => Math.random() - 0.5);
}
