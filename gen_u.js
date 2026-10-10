/* Maths Trail - random practice for the autumn test: SOW Units 1-4, no calculator. */
"use strict";

const clean = x => +(+x).toFixed(9);
const dec = x => String(clean(x));
const sup = s => String(s).replace(/\d/g, d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
const neg = x => (x < 0 ? `(−${-x})` : String(x));
function roundSF(x, n) { if (x === 0) return 0; const p = Math.floor(Math.log10(Math.abs(x))), f = Math.pow(10, p - n + 1); return clean(Math.round(x / f + 1e-9) * f); }
const lcm2 = (a, b) => a / gcd(a, b) * b;
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
function triple() { const t = pick(TRIPLES), k = t[2] <= 13 ? rnd(1, 4) : 1; return t.map(x => x * k); }
function timeAnswers(totalMin) {
  const h = Math.floor(totalMin / 60) % 24, m = String(totalMin % 60).padStart(2, "0"), h12 = h % 12 === 0 ? 12 : h % 12, ap = h < 12 ? "am" : "pm";
  return [`${h}:${m}`, `${h}.${m}`, `${String(h).padStart(2, "0")}:${m}`, `${h12}:${m}${ap}`, `${h12}.${m}${ap}`, `${h12}:${m}`, `${h12}.${m}`];
}

const GENS = {
  A: [
    () => { const x = rnd(11, 999) / pick([10, 100]), ops = [["× 10", 10], ["× 100", 100], ["× 1000", 1000], ["÷ 10", 0.1], ["÷ 100", 0.01], ["× 0.1", 0.1], ["× 0.01", 0.01], ["÷ 0.1", 10], ["÷ 0.01", 100]], [o, k] = pick(ops), r = clean(x * k);
      return G("A", `Work out ${dec(x)} ${o}.`, [N(dec(r))], `${o.includes("0.") ? `${o.startsWith("÷") ? "Dividing" : "Multiplying"} by ${o.slice(2)} is the same as ${k > 1 ? "multiplying" : "dividing"} by ${k > 1 ? k : clean(1 / k)}. ` : ""}Move the digits ${k > 1 ? "left" : "right"} ${Math.round(Math.abs(Math.log10(k)))} place${Math.abs(Math.log10(k)) > 1.5 ? "s" : ""}.`, dec(r)); },
    () => { const a = rnd(2, 9) / pick([10, 100]), b = rnd(2, 9) / pick([1, 10, 100]), r = clean(a * b);
      return G("A", `Work out ${dec(a)} × ${dec(b)}.`, [N(dec(r))], `Multiply the digits: ${Math.round(a * 100) / (a < 0.1 ? 1 : 10) % 100 === 0 ? "" : ""}${String(dec(a)).replace(/^0\.0*/, "")} × ${String(dec(b)).replace(/^0\.0*/, "")}, then count the decimal places in the question and give the answer the same number.`, dec(r)); },
    () => { const a = rnd(-12, 12), b = rnd(-12, 12) || 3, c = rnd(-9, 9) || -4, form = rnd(0, 2);
      if (form === 0) return G("A", `Work out ${a < 0 ? "−" + -a : a} − ${neg(b)} + ${neg(c)}.`, [N(String(a - b + c))], `Subtracting a negative is the same as adding. Work left to right.`, String(a - b + c));
      if (form === 1) return G("A", `Work out ${neg(a)} × ${neg(b)}.`, [N(String(a * b))], `Same signs give a positive answer, different signs a negative one.`, String(a * b));
      const d = rnd(2, 9) * (Math.random() < 0.5 ? -1 : 1), q = rnd(2, 9) * (Math.random() < 0.5 ? -1 : 1);
      return G("A", `Work out ${neg(d * q)} ÷ ${neg(d)}.`, [N(String(q))], `Same signs give a positive answer, different signs a negative one. ${Math.abs(d * q)} ÷ ${Math.abs(d)} = ${Math.abs(q)}.`, String(q)); },
    () => { const a = rnd(2, 12), b = rnd(2, 9), c = rnd(2, 9), t = rnd(0, 3);
      const forms = [[`${a} + ${b} × ${c}`, a + b * c, `Multiply first: ${b} × ${c} = ${b * c}, then add ${a}.`],
        [`(${a} + ${b}) × ${c}`, (a + b) * c, `Brackets first: ${a + b}, then × ${c}.`],
        [`${a * c} ÷ ${c} − ${b}²`, a - b * b, `Index first: ${b}² = ${b * b}. Then ${a * c} ÷ ${c} = ${a}. Finally ${a} − ${b * b}.`],
        [`${b}² − ${c} × (${a} − ${b})`, b * b - c * (a - b), `Brackets: ${a - b}. Index: ${b * b}. Multiply: ${c} × ${neg(a - b)} = ${c * (a - b)}. Then ${b * b} − ${neg(c * (a - b))}.`]][t];
      return G("A", `Work out ${forms[0]}.`, [N(String(forms[1]))], forms[2], String(forms[1])); },
    () => { const dp = rnd(1, 2), x = rnd(1001, 99999) / 1000, r = Math.round(x * 10 ** dp + 1e-9) / 10 ** dp;
      return G("A", `Round ${dec(x)} to ${dp} decimal place${dp > 1 ? "s" : ""}.`, [N(r.toFixed(dp))], `Look at decimal place ${dp + 1}: if it is 5 or more, round up.`, r.toFixed(dp)); },
    () => { const big = Math.random() < 0.5, n = rnd(1, 2), x = big ? rnd(1000, 99999) : (rnd(10, 99) * 10 + rnd(1, 9)) / 10 ** rnd(4, 5), r = roundSF(x, n);
      return G("A", `Round ${dec(x)} to ${n} significant figure${n > 1 ? "s" : ""}.`, [N(dec(r))], big ? `Count from the first non-zero digit and fill the rest of the places with zeros.` : `Leading zeros do not count as significant figures.`, dec(r)); },
    () => { const A = pick([20, 30, 40, 50, 60, 70, 80, 90]), B = pick([2, 3, 4, 5, 6]), C = pick([0.2, 0.5]);
      const a = clean(A * (1 + rnd(-4, 4) / 100)).toFixed(1), b = (B + rnd(-9, 9) / 100).toFixed(2), c = (C + rnd(-2, 2) / 100).toFixed(2), r = clean(A * B / C);
      return G("A", `Estimate ${a} × ${b} ÷ ${c} by rounding each number to 1 significant figure.`, [N(dec(r))], `${A} × ${B} ÷ ${C} = ${A * B} ÷ ${C} = ${dec(r)}.`, dec(r)); }
  ],
  B: [
    () => { const b = rnd(2, 5), e = b === 2 ? rnd(3, 8) : b === 3 ? rnd(2, 5) : rnd(2, 4), r = b ** e;
      return G("B", `Work out ${b}${sup(e)}.`, [N(String(r))], `${Array(e).fill(b).join(" × ")} = ${r}.`, String(r)); },
    () => { const cube = Math.random() < 0.4, n = cube ? rnd(2, 6) : rnd(2, 15);
      return cube ? G("B", `Work out the cube root of ${n ** 3}.`, [N(String(n))], `${n} × ${n} × ${n} = ${n ** 3}.`, String(n))
        : G("B", `Work out √${n * n}.`, [N(String(n))], `${n} × ${n} = ${n * n}.`, String(n)); },
    () => { let v, f; do { f = { 2: rnd(0, 4), 3: rnd(0, 3), 5: rnd(0, 2), 7: rnd(0, 1), 11: Math.random() < 0.15 ? 1 : 0 }; v = Object.entries(f).reduce((a, [p, e]) => a * p ** e, 1); } while (v < 24 || v > 600 || Object.values(f).reduce((a, b) => a + b, 0) < 3);
      const ans = Object.entries(f).filter(([, e]) => e).map(([p, e]) => e > 1 ? `${p}${sup(e)}` : p).join(" × ");
      return G("B", `Write ${v} as a product of its prime factors. Use index form.`, [{ t: "pf", a: v, ph: "e.g. 2^3 × 5" }], `Keep dividing by primes (2, 3, 5, 7, …) until you reach 1. A factor tree gives the same answer whichever way you start.`, ans); },
    () => { const g = rnd(2, 12); let m = rnd(2, 9), n = rnd(2, 9); while (n === m || gcd(m, n) !== 1) { m = rnd(2, 9); n = rnd(2, 9); } const x = g * m, y = g * n, hcf = Math.random() < 0.5;
      return G("B", `Find the ${hcf ? "HCF" : "LCM"} of ${x} and ${y}.`, [N(String(hcf ? g : g * m * n))], `Write both as products of primes. ${hcf ? "HCF = the primes they share." : "LCM = every prime, at its highest power."}`, String(hcf ? g : g * m * n)); },
    () => { const p = pick([6, 8, 9, 10, 12, 14, 15, 18, 20]); let q = pick([6, 8, 9, 10, 12, 14, 15, 18, 20]); while (q === p || lcm2(p, q) > 150) q = pick([6, 8, 9, 10, 12, 14, 15, 18, 20]);
      const h = rnd(8, 15), L = lcm2(p, q), acc = timeAnswers(h * 60 + L);
      return G("B", `One bus comes every ${p} minutes and another every ${q} minutes. Both are at the stop at ${h}:00. When are they next at the stop together?`, [TX(acc, { ph: "e.g. 10:45" })], `LCM of ${p} and ${q} = ${L} minutes. ${h}:00 + ${L} minutes.`, acc[0]); },
    () => { const a = rnd(2, 9), m = rnd(2, 7), n = rnd(2, 6), mult = Math.random() < 0.6, k = mult ? m + n : m + n - n; const big = mult ? m : m + n;
      return mult ? G("B", `Write ${a}${sup(m)} × ${a}${sup(n)} as a single power of ${a}.`, [TX([`${a}^${m + n}`, `${a}${sup(m + n)}`], { ph: "e.g. 5^2" })], `Multiplying powers of the same number: add the indices, ${m} + ${n} = ${m + n}.`, `${a}${sup(m + n)}`)
        : G("B", `Write ${a}${sup(big)} ÷ ${a}${sup(n)} as a single power of ${a}.`, [TX([`${a}^${big - n}`, `${a}${sup(big - n)}`], { ph: "e.g. 5^2" })], `Dividing powers of the same number: subtract the indices, ${big} − ${n} = ${big - n}.`, `${a}${sup(big - n)}`); },
    () => { const d = pick([3, 9, 4, 5]); const nums = []; while (nums.length < 5) { const v = rnd(100, 9999); if (!nums.includes(v)) nums.push(v); } if (!nums.some(v => v % d === 0)) nums[rnd(0, 4)] = d * rnd(30, 900);
      const ok = nums.filter(v => v % d === 0); const rule = { 3: "its digit sum is divisible by 3", 9: "its digit sum is divisible by 9", 4: "its last two digits make a multiple of 4", 5: "it ends in 0 or 5" }[d];
      return G("B", `Which of these are divisible by ${d}? ${nums.join(", ")}`, [SET(ok, { wide: true })], `A number is divisible by ${d} when ${rule}.`, ok.join(", ")); }
  ],
  C: [
    () => { const conv = pick([["m", "cm", 100], ["cm", "m", 0.01], ["km", "m", 1000], ["m", "km", 0.001], ["kg", "g", 1000], ["g", "kg", 0.001], ["litres", "ml", 1000], ["ml", "litres", 0.001], ["m²", "cm²", 10000], ["cm³", "litres", 0.001], ["cm", "mm", 10]]);
      const v = conv[2] > 1 ? rnd(11, 99) / pick([1, 10]) : rnd(2, 99) * pick([10, 100]), r = clean(v * conv[2]);
      return G("C", `Convert ${dec(v)} ${conv[0]} to ${conv[1]}.`, [N(dec(r), { post: conv[1] })], conv[0] === "m²" ? `1 m² = 100 cm × 100 cm = 10 000 cm².` : conv[0] === "cm³" ? `1 litre = 1000 cm³.` : `Use 1 ${conv[2] > 1 ? conv[0] : conv[1]} = ${conv[2] > 1 ? conv[2] : clean(1 / conv[2])} ${conv[2] > 1 ? conv[1] : conv[0]}.`, `${dec(r)} ${conv[1]}`); },
    () => { const k = rnd(0, 4); let q, a, sol;
      if (k === 0) { const l = rnd(3, 15), w = rnd(2, 12); q = `a rectangle ${l} cm by ${w} cm`; a = l * w; sol = `${l} × ${w}`; }
      else if (k === 1) { const b = 2 * rnd(2, 10), h = rnd(3, 14); q = `a triangle with base ${b} cm and perpendicular height ${h} cm`; a = b * h / 2; sol = `½ × ${b} × ${h}`; }
      else if (k === 2) { const b = rnd(4, 15), h = rnd(2, 10); q = `a parallelogram with base ${b} cm and perpendicular height ${h} cm`; a = b * h; sol = `base × height = ${b} × ${h}`; }
      else if (k === 3) { let x = rnd(3, 10), y = rnd(x + 1, 16), h = rnd(2, 10); if ((x + y) * h % 2) h++; q = `a trapezium with parallel sides ${x} cm and ${y} cm and height ${h} cm`; a = (x + y) * h / 2; sol = `½ × (${x} + ${y}) × ${h}`; }
      else { const d1 = 2 * rnd(2, 8), d2 = rnd(3, 14), shape = pick(["kite", "rhombus"]); q = `a ${shape} with diagonals ${d1} cm and ${d2} cm`; a = d1 * d2 / 2; sol = `½ × ${d1} × ${d2}`; }
      return G("C", `Find the area of ${q}.`, [N(String(a), { post: "cm²" })], `Area = ${sol} = ${a}.`, `${a} cm²`); },
    () => { const k = rnd(0, 2);
      if (k === 0) { const l = rnd(4, 15), w = rnd(2, 12); return G("C", `A rectangle has an area of ${l * w} cm² and a length of ${l} cm. Find its width.`, [N(String(w), { post: "cm" })], `Width = area ÷ length = ${l * w} ÷ ${l}.`, `${w} cm`); }
      if (k === 1) { const b = 2 * rnd(2, 10), h = rnd(3, 14); return G("C", `A triangle has an area of ${b * h / 2} cm² and a base of ${b} cm. Find its perpendicular height.`, [N(String(h), { post: "cm" })], `Area = ½ × b × h, so ${b * h / 2} = ${b / 2} × h and h = ${h}.`, `${h} cm`); }
      const b = rnd(4, 15), h = rnd(2, 10); return G("C", `A parallelogram has an area of ${b * h} cm² and a perpendicular height of ${h} cm. Find its base.`, [N(String(b), { post: "cm" })], `Base = area ÷ height = ${b * h} ÷ ${h}.`, `${b} cm`); },
    () => { const l = rnd(2, 12), w = rnd(2, 10), h = rnd(2, 9);
      return G("C", `Find the volume of a cuboid ${l} cm by ${w} cm by ${h} cm.`, [N(String(l * w * h), { post: "cm³" })], `Volume = ${l} × ${w} × ${h}.`, `${l * w * h} cm³`); },
    () => { const l = rnd(2, 10), w = rnd(2, 8), h = rnd(2, 8), sa = 2 * (l * w + l * h + w * h);
      return G("C", `Find the total surface area of a cuboid ${l} cm by ${w} cm by ${h} cm.`, [N(String(sa), { post: "cm²" })], `Three pairs of faces: ${l * w}, ${l * h}, ${w * h}. Total = 2 × (${l * w} + ${l * h} + ${w * h}).`, `${sa} cm²`); },
    () => { const l = 10 * rnd(2, 8), w = 10 * rnd(2, 6), h = 10 * rnd(1, 5), v = l * w * h;
      return G("C", `A tank measures ${l} cm by ${w} cm by ${h} cm. How many litres does it hold when full?`, [N(String(v / 1000), { post: "litres" })], `Volume = ${v} cm³. 1 litre = 1000 cm³, so ${v} ÷ 1000.`, `${v / 1000} litres`); },
    () => { const s = rnd(2, 9), k = rnd(0, 1);
      return k ? G("C", `A cube has a volume of ${s ** 3} cm³. Find the length of one edge.`, [N(String(s), { post: "cm" })], `Find the cube root: ${s} × ${s} × ${s} = ${s ** 3}.`, `${s} cm`)
        : G("C", `A cube has edges of ${s} cm. Find its total surface area.`, [N(String(6 * s * s), { post: "cm²" })], `One face = ${s * s} cm². Six faces: 6 × ${s * s}.`, `${6 * s * s} cm²`); }
  ],
  D: [
    () => { const [a, b, c] = triple();
      return G("D", `A right-angled triangle has shorter sides of ${a} cm and ${b} cm. Find the hypotenuse.`, [N(String(c), { post: "cm" })], `${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}, and √${c * c} = ${c}.`, `${c} cm`); },
    () => { const [a, b, c] = triple(), sw = Math.random() < 0.5, known = sw ? a : b, miss = sw ? b : a;
      return G("D", `A right-angled triangle has a hypotenuse of ${c} cm and one shorter side of ${known} cm. Find the other side.`, [N(String(miss), { post: "cm" })], `Shorter side: subtract. ${c}² − ${known}² = ${c * c} − ${known * known} = ${miss * miss}, and √${miss * miss} = ${miss}.`, `${miss} cm`); },
    () => { let [a, b, c] = triple(); const yes = Math.random() < 0.5; if (!yes) { c = c + pick([-1, 1, 2]); if (c <= b) c = b + 1 === c + 0 ? c + 2 : b + 1; if (c * c === a * a + b * b) c++; }
      return G("D", `Is a triangle with sides ${a} cm, ${b} cm and ${c} cm right-angled? Answer yes or no.`, [TX(yes ? ["yes", "y"] : ["no", "n"])], `${a}² + ${b}² = ${a * a + b * b} and ${c}² = ${c * c}. ${yes ? "They are equal, so yes." : "They are not equal, so no."}`, yes ? "Yes" : "No"); },
    () => { const [a, b, c] = triple(), k = rnd(0, 1);
      return k ? G("D", `A ${c} m ladder leans against a wall. Its foot is ${a} m from the wall. How high up the wall does it reach?`, [N(String(b), { post: "m" })], `The ladder is the hypotenuse: ${c}² − ${a}² = ${b * b}, so ${b} m.`, `${b} m`)
        : G("D", `Ali walks ${a} km north and then ${b} km east. How far is he from the start in a straight line?`, [N(String(c), { post: "km" })], `√(${a}² + ${b}²) = √${c * c} = ${c}.`, `${c} km`); },
    () => { const b = 2 * rnd(1, 6), h = rnd(2, 9), l = rnd(3, 15), A = b * h / 2;
      return G("D", `A triangular prism has a triangular cross-section with base ${b} cm and height ${h} cm. The prism is ${l} cm long. Find its volume.`, [N(String(A * l), { post: "cm³" })], `Cross-section = ½ × ${b} × ${h} = ${A} cm². Volume = ${A} × ${l}.`, `${A * l} cm³`); },
    () => { const [a, b, c] = triple();
      return G("D", `A rectangle is ${b} cm long and ${a} cm wide. Find the length of its diagonal.`, [N(String(c), { post: "cm" })], `The diagonal is a hypotenuse: √(${b * b} + ${a * a}) = √${c * c} = ${c}.`, `${c} cm`); },
    () => { const [a, b, c0] = triple(); let c = c0 + pick([-2, -1, 0, 1, 2]); if (c <= b) c = c0 + 1; const s = a * a + b * b, kind = s === c * c ? "right" : s > c * c ? "acute" : "obtuse";
      return G("D", `A triangle has sides ${a} cm, ${b} cm and ${c} cm. Is its largest angle acute, right or obtuse?`, [TX([kind])], `${a}² + ${b}² = ${s} and ${c}² = ${c * c}. ${kind === "right" ? "Equal: right angle." : kind === "acute" ? "The sum is bigger, so the angle is acute." : "The sum is smaller, so the angle is obtuse."}`, kind[0].toUpperCase() + kind.slice(1)); }
  ]
};

/* ---------- Unit 5: HCF/LCM, fractions, mixed numbers, percentages ---------- */
function mixedOf(n, d) { const g = gcd(n, d) || 1; n /= g; d /= g; const w = Math.floor(n / d), r = n % d; return { plain: r ? (w ? `${w} ${r}/${d}` : `${r}/${d}`) : String(w), mark: r ? (w ? `${w}{${r}/${d}}` : `{${r}/${d}}`) : String(w) }; }
GENS.E = [
  () => { const g = pick([6, 12, 14, 15, 18, 21, 24]); let m = rnd(3, 11), n = rnd(3, 11); while (n === m || gcd(m, n) !== 1) { m = rnd(3, 11); n = rnd(3, 11); } const x = g * m, y = g * n, hcf = Math.random() < 0.5;
    return G("E", `Find the ${hcf ? "HCF" : "LCM"} of ${x} and ${y}.`, [N(String(hcf ? g : g * m * n))], `Write both as products of primes and use a Venn diagram: ${hcf ? "multiply the primes in the middle" : "multiply every prime in the diagram"}.`, String(hcf ? g : g * m * n)); },
  () => { const d = rnd(3, 9), n = rnd(1, d - 1), k = rnd(2, 12), N0 = d * k; const s = fracStr(n, d);
    return G("E", `Find {${s}} of £${N0}.`, [N(String(n * k), { pre: "£" })], `{1/${s.split("/")[1]}} of ${N0} = ${N0 / +s.split("/")[1]}. Multiply by ${s.split("/")[0]}.`, `£${N0 * n / d}`); },
  () => { const [a, b] = cop(2, 9); let [c, d] = cop(2, 9); while (d === b) [c, d] = cop(2, 9); const w1 = rnd(1, 4), w2 = rnd(1, 3), add = Math.random() < 0.5;
    const A = w1 * b + a, B = w2 * d + c; let num = add ? A * d + B * b : A * d - B * b; const den = b * d;
    if (num <= 0) return GENS.E[2]();
    const m = mixedOf(num, den);
    return G("E", `Work out ${w1}{${a}/${b}} ${add ? "+" : "−"} ${w2}{${c}/${d}}. Give your answer as a mixed number.`, [N(m.plain, { mixed: true })], `Improper fractions: {${A}/${b}} ${add ? "+" : "−"} {${B}/${d}} = {${A * d}/${den}} ${add ? "+" : "−"} {${B * b}/${den}} = {${num}/${den}} = ${m.mark}.`, m.mark); },
  () => { const d = rnd(2, 9), w = rnd(1, 6), r = rnd(1, d - 1); if (gcd(r, d) !== 1) return GENS.E[3](); const n = w * d + r, toMixed = Math.random() < 0.5;
    return toMixed ? G("E", `Write {${n}/${d}} as a mixed number.`, [N(`${w} ${r}/${d}`, { mixed: true })], `${n} ÷ ${d} = ${w} remainder ${r}.`, `${w}{${r}/${d}}`)
      : G("E", `Write ${w}{${r}/${d}} as an improper fraction.`, [{ t: "text", a: [`${n}/${d}`], ph: "e.g. 7/3" }], `${w} × ${d} + ${r} = ${n}, so {${n}/${d}}.`, `{${n}/${d}}`); },
  () => { const kind = rnd(0, 2);
    if (kind === 0) { const d = pick([2, 4, 5, 10, 20, 25, 50]), n = rnd(1, d - 1); if (gcd(n, d) !== 1) return GENS.E[4](); const p = n * 100 / d;
      return G("E", `Write {${n}/${d}} as a percentage.`, [N(dec(p), { post: "%" })], `Make the denominator 100: {${n * 100 / d}/100}.`, `${dec(p)}%`); }
    if (kind === 1) { const p = pick([5, 12, 15, 35, 40, 45, 60, 64, 75, 85]), s = fracStr(p, 100);
      return G("E", `Write ${p}% as a fraction in its simplest form.`, [N(s, { frac: true })], `${p}% = {${p}/100}, then simplify.`, fracMark(s)); }
    const x = rnd(1, 199) / 1000 * 5; const v = clean(x);
    return G("E", `Write ${dec(v)} as a percentage.`, [N(dec(clean(v * 100)), { post: "%" })], `Multiply by 100.`, `${dec(clean(v * 100))}%`); },
  () => { const up = Math.random() < 0.5, p = pick([5, 10, 12, 15, 20, 25, 30, 40]), n0 = 20 * rnd(2, 25), r = clean(n0 * (100 + (up ? p : -p)) / 100);
    return G("E", `${up ? "Increase" : "Decrease"} £${n0} by ${p}%. Use a multiplier.`, [N(dec(r), { pre: "£", tol: 0.001 })], `Multiplier = ${dec(clean((100 + (up ? p : -p)) / 100))}. £${n0} × ${dec(clean((100 + (up ? p : -p)) / 100))} = £${dec(r)}.`, `£${dec(r)}`); },
  () => { const up = Math.random() < 0.6, p = pick([10, 20, 25, 50]), orig = (up ? pick([20, 40, 60, 80, 100, 120, 200]) : pick([40, 80, 120, 160, 200, 240])), fin = clean(orig * (100 + (up ? p : -p)) / 100), m = dec(clean((100 + (up ? p : -p)) / 100));
    return G("E", `After a ${p}% ${up ? "increase" : "decrease"}, a price is £${dec(fin)}. What was the original price?`, [N(String(orig), { pre: "£" })], `The new price is the original × ${m}. Go back by dividing: £${dec(fin)} ÷ ${m} = £${orig}.`, `£${orig}`); },
  () => { const k = rnd(1, 12), n0 = 40 * k, vat = 7 * k;
    return G("E", `Work out 17.5% VAT on £${n0} without a calculator.`, [N(String(vat), { pre: "£" })], `10% = £${4 * k}, 5% = £${2 * k} (half of 10%), 2.5% = £${k} (half of 5%). Add them: £${4 * k} + £${2 * k} + £${k} = £${vat}.`, `£${vat}`); },
  () => { const [a, b] = cop(2, 9), [c, d] = cop(2, 9), div = Math.random() < 0.5, num = div ? a * d : a * c, den = div ? b * c : b * d, s = fracStr(num, den);
    return G("E", `Work out {${a}/${b}} ${div ? "÷" : "×"} {${c}/${d}}.`, [N(s, { frac: true })], div ? `Keep, change, flip: {${a}/${b}} × {${d}/${c}} = {${num}/${den}}.` : `Multiply tops and bottoms: {${num}/${den}}.`, fracMark(s)); }
];
