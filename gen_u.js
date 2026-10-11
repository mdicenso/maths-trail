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


/* ---------- Unit 6: expressions and formulae ---------- */
// poly([[coef, "x^2"], [coef, "x"], [coef, ""]]) -> machine string "x^2-3x+4" (zero terms dropped)
function poly(ts) { let s = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); s += (c < 0 ? "-" : s ? "+" : "") + body; } return s || "0"; }
const disp = s => show(s).replace(/\^2/g, "²");     // machine form -> what the learner reads
const lin = (a, b, v) => poly([[a, v || "x"], [b, ""]]);
const sgnPick = () => (Math.random() < 0.5 ? 1 : -1);
function coprime(lo, hi) { let a, b; do { a = rnd(lo, hi); b = rnd(lo, hi); } while (gcd(a, b) !== 1); return [a, b]; }
// NB: the answer checker lower-cases everything, so a formula must never use both "a" and "A" (etc.)
GENS.F = [
  // 0 simplify like terms (Warm-up)
  () => { const [u, v] = pick([["a", "b"], ["x", "y"], ["m", "n"], ["c", "d"]]); let a, b, c, d, s2, X, Y;
    do { a = rnd(2, 9); b = rnd(2, 9); c = rnd(2, 8); d = rnd(2, 8); s2 = sgnPick(); X = a - c; Y = b + s2 * d; } while (!X || !Y);
    const exp = poly([[X, u], [Y, v]]);
    return G("F", `Simplify ${a}${u} + ${b}${v} − ${c}${u} ${s2 > 0 ? "+" : "−"} ${d}${v}.`, [E(exp, { simp: true })], `${u} terms: ${a}${u} − ${c}${u} = ${coef(X, u)}. ${v} terms: ${b}${v} ${s2 > 0 ? "+" : "−"} ${d}${v} = ${coef(Y, v)}.`, disp(exp)); },
  // 1 substitute into a linear expression, x may be negative (Warm-up)
  () => { const a = rnd(2, 9), b = rnd(1, 12), s = sgnPick(), x = rnd(-6, 6) || 2, r = a * x + s * b, xs = x < 0 ? "−" + -x : String(x);
    return G("F", `Work out ${a}x ${s > 0 ? "+" : "−"} ${b} when x = ${xs}.`, [N(String(r))], `${a} × ${neg(x)} = ${a * x}. Then ${a * x} ${s > 0 ? "+" : "−"} ${b} = ${r}.`, String(r).replace("-", "−")); },
  // 2 expand a single bracket (Warm-up)
  () => { const k = rnd(2, 9), a = rnd(1, 6), b = rnd(1, 9) * sgnPick(), exp = lin(k * a, k * b);
    return G("F", `Expand ${k}(${disp(lin(a, b))}).`, [E(exp, { simp: true })], `Multiply every term in the bracket by ${k}: ${k} × ${disp(coef(a, "x"))} = ${disp(coef(k * a, "x"))} and ${k} × ${neg(b)} = ${k * b}.`, disp(exp)); },
  // 3 expand and simplify two single brackets, with double signs (Core)
  () => { let p, q, a, b, c, d, s, X, K;
    do { p = rnd(2, 6); q = rnd(2, 6); a = rnd(1, 4); c = rnd(1, 4); b = rnd(1, 7) * sgnPick(); d = rnd(1, 7) * sgnPick(); s = Math.random() < 0.6 ? -1 : 1; X = p * a + s * q * c; K = p * b + s * q * d; } while (!X || !K);
    const exp = lin(X, K);
    return G("F", `Expand and simplify ${p}(${disp(lin(a, b))}) ${s > 0 ? "+" : "−"} ${q}(${disp(lin(c, d))}).`, [E(exp, { simp: true })],
      `First bracket: ${disp(lin(p * a, p * b))}. Second bracket: ${s > 0 ? "" : "the minus sign changes the sign of every term, giving "}${disp(lin(s * q * c, s * q * d))}. Collect like terms: ${disp(exp)}.`, disp(exp)); },
  // 4 substitute into an expression with a power and a negative number (Core)
  () => { const x = rnd(-5, -2), a = rnd(2, 6), b = rnd(2, 7), t = rnd(0, 3); let q, r, sol;
    if (t === 0) { q = `x² + ${a}x`; r = x * x + a * x; sol = `x² = ${neg(x)}² = ${x * x} (a negative squared is positive). ${a}x = ${a * x}. Add: ${x * x} + ${neg(a * x)} = ${r}.`; }
    else if (t === 1) { q = `${a}x² − ${b}x`; r = a * x * x - b * x; sol = `Square first: x² = ${x * x}, so ${a}x² = ${a * x * x}. Then −${b}x = −${b} × ${neg(x)} = +${-b * x}. Total: ${r}.`; }
    else if (t === 2) { q = `${a * a} − x²`; r = a * a - x * x; sol = `x² = ${x * x} (not ${-x * x}), so ${a * a} − ${x * x} = ${r}.`; }
    else { q = `(${a}x)²`; r = a * a * x * x; sol = `${a}x = ${a * x}. Squaring: ${neg(a * x)}² = ${r}.`; }
    return G("F", `x = −${-x}. Work out ${q}.`, [N(String(r))], sol, String(r).replace("-", "−")); },
  // 5 factorise a linear expression fully (Core)
  () => { const k = rnd(2, 9), [a, b0] = coprime(1, 7), b = b0 * (Math.random() < 0.4 ? -1 : 1);
    return G("F", `Factorise fully ${disp(lin(k * a, k * b))}.`, [E(`${k}(${lin(a, b)})`, { factor: String(k) })], `The HCF of ${k * a} and ${Math.abs(k * b)} is ${k}. Divide each term by ${k}: ${disp(lin(a, b))}.`, `${k}(${disp(lin(a, b))})`); },
  // 6 use a formula: substitute, or find an input from the output (Core)
  () => { const m = rnd(0, 2);
    if (m === 0) { const u = rnd(2, 12), a = rnd(2, 9), t = rnd(2, 8), v = u + a * t;
      return G("F", `Use v = u + at to find v when u = ${u}, a = ${a} and t = ${t}.`, [N(String(v), { pre: "v =" })], `at = ${a} × ${t} = ${a * t}. v = ${u} + ${a * t} = ${v}.`, String(v)); }
    if (m === 1) { const u = rnd(1, 8), a = 2 * rnd(1, 5), t = rnd(2, 5), s = u * t + a / 2 * t * t;
      return G("F", `Use s = ut + ½at² to find s when u = ${u}, a = ${a} and t = ${t}.`, [N(String(s), { pre: "s =" })], `t² = ${t * t}. ½ × ${a} × ${t * t} = ${a / 2 * t * t}. ut = ${u * t}. s = ${u * t} + ${a / 2 * t * t} = ${s}.`, String(s)); }
    const mm = rnd(2, 9), c = rnd(3, 20), n = rnd(2, 12), C = mm * n + c;
    return G("F", `A taxi charges C = ${mm}n + ${c} pounds for a journey of n miles. Find n when C = ${C}.`, [N(String(n), { pre: "n =" })], `${C} = ${mm}n + ${c}. Subtract ${c}: ${C - c} = ${mm}n. Divide by ${mm}: n = ${n}.`, `n = ${n}`); },
  // 7 change the subject of a simple formula (Core)
  () => { const t = rnd(0, 2);
    if (t === 0) { const m = rnd(2, 9), c = rnd(1, 15);
      return G("F", `Make x the subject of y = ${m}x + ${c}.`, [E(`(y-${c})/${m}`, { pre: "x =" })], `Subtract ${c} from both sides: y − ${c} = ${m}x. Divide both sides by ${m}.`, `x = (y − ${c})/${m}`); }
    if (t === 1) return G("F", "Make l the subject of P = 2l + 2w.", [E("(P-2w)/2", { pre: "l =" })], "Subtract 2w from both sides: P − 2w = 2l. Divide both sides by 2.", "l = (P − 2w)/2");
    return Math.random() < 0.5 ? G("F", "Make a the subject of v = u + at.", [E("(v-u)/t", { pre: "a =" })], "Subtract u from both sides: v − u = at. Divide both sides by t.", "a = (v − u)/t")
      : G("F", "Make t the subject of v = u + at.", [E("(v-u)/a", { pre: "t =" })], "Subtract u from both sides: v − u = at. Divide both sides by a.", "t = (v − u)/a"); },
  // 8 write an expression from a context (Core)
  () => { const t = rnd(0, 2);
    if (t === 0) { const a = rnd(1, 4), b = rnd(1, 6), c = rnd(2, 8), exp = lin(2 * a, 2 * b + 2 * c);
      return G("F", `A rectangle has length (${disp(lin(a, b))}) cm and width ${c} cm. Write a simplified expression for its perimeter, in cm.`, [E(exp, { simp: true })], `Perimeter = 2 × (length + width) = 2(${disp(lin(a, b + c))}) = ${disp(exp)}.`, disp(exp)); }
    if (t === 1) { const n = pick([3, 5, 6, 8]), k = rnd(1, 9), names = { 3: "equilateral triangle", 5: "regular pentagon", 6: "regular hexagon", 8: "regular octagon" }, exp = lin(n, n * k);
      return G("F", `Each side of a ${names[n]} is (x + ${k}) cm. Write a simplified expression for its perimeter, in cm.`, [E(exp, { simp: true })], `${n} sides: ${n}(x + ${k}) = ${disp(exp)}.`, disp(exp)); }
    const k = rnd(2, 9), b = rnd(1, 9), exp = lin(k, k * b);
    return G("F", `A rectangle has length (x + ${b}) cm and width ${k} cm. Write an expression for its area and expand it, in cm².`, [E(exp, { simp: true })], `Area = length × width = ${k}(x + ${b}) = ${disp(exp)}.`, disp(exp)); },
  // 9 expand double brackets (Challenge)
  () => { const p = Math.random() < 0.3 ? rnd(2, 3) : 1, a = rnd(1, 8) * sgnPick(), b = rnd(1, 8) * sgnPick(), X = p * b + a, C = a * b;
    const lhs = `(${disp(lin(p, a))})(${disp(lin(1, b))})`, exp = poly([[p, "x^2"], [X, "x"], [C, ""]]);
    return G("F", `Expand and simplify ${lhs}.`, [E(exp, { simp: true })], `Multiply each term in the first bracket by each term in the second: ${p === 1 ? "" : p}x² ${b < 0 ? "−" : "+"} ${Math.abs(b) * p === 1 ? "" : Math.abs(b) * p}x ${a < 0 ? "−" : "+"} ${Math.abs(a)}x ${C < 0 ? "−" : "+"} ${Math.abs(C)}. Collect the x terms: ${disp(exp)}.`, disp(exp)); },
  // 10 factorise a higher-degree expression (Challenge)
  () => { const k = rnd(1, 6), [a, b0] = coprime(1, 6), b = b0 * (Math.random() < 0.4 ? -1 : 1), t = rnd(0, 1);
    if (t === 0) { const cf = k === 1 ? "x" : k + "x";
      return G("F", `Factorise fully ${disp(poly([[k * a, "x^2"], [k * b, "x"]]))}.`, [E(`${cf}(${lin(a, b)})`, { factor: cf })], `The common factor is ${cf}. Divide each term by ${cf}: ${disp(lin(a, b))}.`, `${cf}(${disp(lin(a, b))})`); }
    const cf = k === 1 ? "xy" : k + "xy", bb = Math.abs(b);
    return G("F", `Factorise fully ${k * a === 1 ? "" : k * a}x²y ${b < 0 ? "−" : "+"} ${k * bb === 1 ? "" : k * bb}xy².`, [E(`${cf}(${coef(a, "x")}${b < 0 ? "-" : "+"}${coef(bb, "y")})`, { factor: cf })], `The common factor is ${cf}. Divide each term by ${cf}.`, `${cf}(${coef(a, "x")} ${b < 0 ? "−" : "+"} ${coef(bb, "y")})`); },
  // 11 change the subject, harder (Challenge)
  () => { const t = rnd(0, 4);
    if (t === 0) return G("F", "Make a the subject of v² = u² + 2as.", [E("(v^2-u^2)/(2s)", { pre: "a =" })], "Subtract u² from both sides: v² − u² = 2as. Divide both sides by 2s.", "a = (v² − u²)/(2s)");
    if (t === 1) return G("F", "Make h the subject of T = ½(a + b)h.", [E("2t/(a+b)", { pre: "h =" })], "Multiply both sides by 2: 2T = (a + b)h. Divide both sides by (a + b).", "h = 2T/(a + b)");
    if (t === 2) return G("F", "Make m the subject of E = ½mv².", [E("2e/v^2", { pre: "m =" })], "Multiply both sides by 2: 2E = mv². Divide both sides by v².", "m = 2E/v²");
    if (t === 3) { const k = rnd(2, 9); return G("F", `Make x the subject of y = ${k}(x − c).`, [E(`y/${k}+c`, { pre: "x =" })], `Divide both sides by ${k}: y/${k} = x − c. Add c to both sides.`, `x = y/${k} + c`); }
    return G("F", "Make l the subject of P = 2(l + w).", [E("p/2-w", { pre: "l =" })], "Divide both sides by 2: P/2 = l + w. Subtract w from both sides.", "l = P/2 − w"); },
  // 12 substitute two letters, with negatives and powers (Challenge)
  () => { const x = rnd(-4, -1), y = rnd(2, 5), t = rnd(0, 2), xs = `−${-x}`; let q, r, sol;
    if (t === 0) { q = "x²y − xy"; r = x * x * y - x * y; sol = `x²y = ${x * x} × ${y} = ${x * x * y}. xy = ${neg(x)} × ${y} = ${x * y}. So ${x * x * y} − ${neg(x * y)} = ${r}.`; }
    else if (t === 1) { q = "2x² − 3xy + y²"; r = 2 * x * x - 3 * x * y + y * y; sol = `2x² = ${2 * x * x}. 3xy = 3 × ${neg(x)} × ${y} = ${3 * x * y}, so −3xy = +${-3 * x * y}. y² = ${y * y}. Total ${r}.`; }
    else { q = "(x − y)²"; r = (x - y) * (x - y); sol = `x − y = ${neg(x)} − ${y} = ${x - y}. Squared: ${neg(x - y)}² = ${r}.`; }
    return G("F", `x = ${xs} and y = ${y}. Work out ${q}.`, [N(String(r))], sol, String(r)); }
];
// show a real minus sign (−) in the worked solutions and answers, never the keyboard hyphen
GENS.F = GENS.F.map(g => () => { const q = g(); q.sol = q.sol.replace(/-(?=d)/g, "−"); q.ans = String(q.ans).replace(/-(?=d)/g, "−"); return q; });

// Which Warm-up(0)/Core(1)/Challenge(2) tier each GENS[sec] generator best matches (by index,
// same order as the array above). Used by makeLevelPool() in gen.js to build the random pool
// for Warm-up/Core/Challenge lessons, alongside the curated fixed questions for that level.
const GENS_TIER = {
  A: [0, 1, 1, 2, 0, 1, 2],
  B: [0, 0, 2, 1, 2, 1, 0],
  C: [0, 1, 2, 0, 1, 1, 2],
  D: [0, 1, 0, 1, 2, 1, 2],
  E: [0, 0, 2, 1, 1, 1, 2, 1, 2],
  F: [0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2]
};
