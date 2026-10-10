/* Maths Trail - question bank v2, aligned to the school's Year 8 Scheme of Work, Autumn Units 1-4 (set 1: no calculator). */
"use strict";

/* ---------- figures ---------- */
const S = (vb, body) => `<svg viewBox="${vb}" role="img" fill="none" stroke="currentColor" stroke-width="2" font-family="Nunito, system-ui, sans-serif" font-size="15">${body}</svg>`;
const T = (x, y, t, a) => `<text x="${x}" y="${y}" fill="currentColor" stroke="none"${a ? ` text-anchor="${a}"` : ""}>${t}</text>`;
const RA = (x, y, dx, dy) => `<path d="M${x + dx} ${y}V${y + dy}H${x}" stroke-width="1.5"/>`; // right-angle mark at (x,y)
const cuboid = (l, w, h) => S("200 30 330 200", `<rect x="230" y="90" width="170" height="100"/><path d="M230 90l50-40h170l-50 40M400 190l50-40V50"/><path d="M230 190l50-40h170M280 150V50" stroke-dasharray="5 5" stroke-width="1.2"/>${T(315, 212, l, "middle")}${T(408, 145, h)}${T(438, 186, w)}`);
const rtri = (base, side, hyp) => S("200 40 340 175", `<polygon points="260,190 500,190 260,60"/>${RA(260, 190, 16, -16)}${T(380, 212, base, "middle")}${T(248, 130, side, "end")}${T(392, 116, hyp)}`);
const FIG = {
  C4: S("210 40 330 195", `<polygon points="240,200 520,200 320,55"/><line x1="320" y1="55" x2="320" y2="200" stroke-dasharray="5 4"/>${RA(320, 200, 12, -12)}${T(380, 224, "9 cm", "middle")}${T(328, 134, "6 cm")}`),
  C5: S("200 50 350 175", `<polygon points="230,190 470,190 530,65 290,65"/><line x1="290" y1="65" x2="290" y2="190" stroke-dasharray="5 4"/>${RA(290, 190, 12, -12)}${T(350, 214, "11 cm", "middle")}${T(298, 132, "4 cm")}`),
  C7: cuboid("5 cm", "4 cm", "3 cm"),
  C9: S("200 45 350 180", `<polygon points="230,190 530,190 470,70 290,70"/><line x1="290" y1="70" x2="290" y2="190" stroke-dasharray="5 4"/>${RA(290, 190, 12, -12)}${T(380, 214, "13 cm", "middle")}${T(380, 62, "7 cm", "middle")}${T(298, 136, "6 cm")}`),
  C10: S("280 30 200 200", `<polygon points="380,40 440,110 380,220 320,110"/><line x1="380" y1="40" x2="380" y2="220" stroke-dasharray="5 4"/><line x1="320" y1="110" x2="440" y2="110" stroke-dasharray="5 4"/>${T(388, 172, "10 cm")}${T(410, 102, "6 cm", "middle")}`),
  C16: cuboid("5 cm", "4 cm", "3 cm"),
  C17: S("200 15 340 210", `<polygon points="260,190 500,190 500,100 404,100 404,40 260,40"/>${T(380, 214, "10 cm", "middle")}${T(248, 120, "8 cm", "end")}${T(452, 93, "4 cm", "middle")}${T(412, 62, "3 cm")}`),
  D2: rtri("4 cm", "3 cm", "x"),
  D3: rtri("8 cm", "6 cm", "x"),
  D5: rtri("x", "6 cm", "10 cm"),
  D14: rtri("8 cm", "6 cm", ""),
  D15: S("210 50 300 170", `<polygon points="230,190 330,190 280,110"/><path d="M280 110l150-40 50 80-150 40"/><path d="M430 70l-50 80" stroke-dasharray="5 5" stroke-width="1.2"/><path d="M230 190l150-40h100" stroke-dasharray="5 5" stroke-width="1.2"/><line x1="280" y1="110" x2="280" y2="190" stroke-dasharray="4 4" stroke-width="1.2"/>${T(280, 212, "6 cm", "middle")}${T(286, 160, "4 cm")}${T(420, 190, "10 cm")}`),
  D18: S("270 25 220 205", `<polygon points="380,40 300,200 460,200"/><line x1="380" y1="40" x2="380" y2="200" stroke-dasharray="5 4"/>${RA(380, 200, 12, -12)}${T(328, 118, "13 cm", "end")}${T(432, 118, "13 cm")}${T(380, 222, "10 cm", "middle")}${T(388, 150, "h")}`),
  D20: S("190 50 320 170", `<polygon points="240,190 340,190 240,115"/>${RA(240, 190, 12, -12)}<path d="M240 115L390 70L490 145L340 190M390 70" /><path d="M240 190L390 145L490 145M390 145L390 70" stroke-dasharray="5 5" stroke-width="1.2"/>${T(290, 212, "4 cm", "middle")}${T(232, 158, "3 cm", "end")}${T(426, 186, "10 cm")}`)
};

/* ---------- question bank ---------- */
const N = (a, o) => Object.assign({ t: "num", a: a }, o || {});
const E = (a, o) => Object.assign({ t: "expr", a: a }, o || {});
const SET = (a, o) => Object.assign({ t: "set", a: a }, o || {});
const TX = (a, o) => Object.assign({ t: "text", a: a }, o || {});

const SECTIONS = [
  { id: "A", name: "Number", blurb: "Unit 1 · Decimals, negative numbers, BIDMAS, rounding and estimating. No calculator." },
  { id: "B", name: "Powers & Primes", blurb: "Unit 2 · Powers, roots, primes, prime factors, HCF and LCM. No calculator." },
  { id: "C", name: "Area & Volume", blurb: "Unit 3 · Metric units, area, solids, surface area and volume. No calculator." },
  { id: "D", name: "Pythagoras", blurb: "Unit 4 · Pythagoras' theorem and triangular prisms. No calculator." }
];
const LEVELS = ["Warm-up", "Core", "Challenge"];

const Q = [
  // ---- A Number (Unit 1)
  ["A1", 0, "Work out 4.7 × 100.", [N("470")], "Multiplying by 100 moves every digit two places to the left.", "470"],
  ["A2", 0, "Work out 36 ÷ 1000.", [N("0.036")], "Dividing by 1000 moves every digit three places to the right: 36 → 0.036.", "0.036"],
  ["A3", 0, "Work out −8 + 3 − (−6).", [N("1")], "−8 + 3 = −5. Subtracting a negative is adding: −5 + 6 = 1.", "1"],
  ["A4", 0, "Work out (−4) × (−7).", [N("28")], "Negative × negative = positive. 4 × 7 = 28.", "28"],
  ["A5", 0, "Work out 3 + 4 × 5.", [N("23")], "BIDMAS: multiply first. 4 × 5 = 20, then 3 + 20.", "23"],
  ["A6", 0, "Round 6.4782 to 2 decimal places.", [N("6.48")], "Look at the third decimal place (8). It is 5 or more, so round the 7 up.", "6.48"],
  ["A7", 0, "Round 38 472 to 1 significant figure.", [N("40000")], "The first significant figure is the 3 (ten thousands). The next digit is 8, so round up to 40 000.", "40 000"],
  ["A8", 0, "Write in order, smallest first: 0.6, 0.06, 0.66, 0.606.", [{ t: "seq", a: [0.06, 0.6, 0.606, 0.66], ph: "separate with commas" }], "Write them with the same number of decimal places: 0.600, 0.060, 0.660, 0.606.", "0.06, 0.6, 0.606, 0.66"],
  ["A9", 1, "Work out 3.6 ÷ 0.01.", [N("360")], "Dividing by 0.01 is the same as multiplying by 100.", "360"],
  ["A10", 1, "Work out 0.3 × 0.02.", [N("0.006")], "3 × 2 = 6. There are 1 + 2 = 3 decimal places in the question, so the answer is 0.006.", "0.006"],
  ["A11", 1, "Work out 4.56 ÷ 0.3.", [N("15.2")], "Multiply both numbers by 10 so you divide by a whole number: 45.6 ÷ 3 = 15.2.", "15.2"],
  ["A12", 1, "Work out 7.2 − 3.85.", [N("3.35")], "Line up the decimal points: 7.20 − 3.85 = 3.35.", "3.35"],
  ["A13", 1, "Work out (18 − 3²) × 2 − 4.", [N("14")], "Brackets first, and inside them the index: 3² = 9, 18 − 9 = 9. Then 9 × 2 = 18, and 18 − 4 = 14.", "14"],
  ["A14", 1, "Work out −12 ÷ (−3) + (−2)².", [N("8")], "(−2)² = 4. −12 ÷ (−3) = 4. Then 4 + 4 = 8.", "8"],
  ["A15", 1, "Round 0.004735 to 2 significant figures.", [N("0.0047")], "Leading zeros do not count. The first two significant figures are 4 and 7; the next digit is 3, so round down.", "0.0047"],
  ["A16", 1, "Round 7.995 to 2 decimal places.", [N("8")], "The third decimal is 5, so the 9 in the hundredths rounds up. That carries all the way: 7.995 → 8.00.", "8.00"],
  ["A17", 1, "Estimate 49.8 × 3.07 ÷ 0.51 by rounding each number to 1 significant figure.", [N("300")], "50 × 3 ÷ 0.5 = 150 ÷ 0.5 = 300.", "300"],
  ["A18", 2, "Work out 23.4 × 1.6.", [N("37.44")], "234 × 16 = 3744. There are 2 decimal places in the question, so 37.44.", "37.44"],
  ["A19", 2, "Work out 9.12 ÷ 0.24.", [N("38")], "Multiply both by 100: 912 ÷ 24 = 38.", "38"],
  ["A20", 2, "Put one pair of brackets into 5 + 3 × 4 − 2 so that the answer is 30. Write the whole calculation.", [TX(["(5+3)×4-2", "(5+3)*4-2", "(5+3)x4-2", "(5+3)×4−2", "(5+3)*4−2", "(5+3)x4−2"], { wide: true, ph: "e.g. 5+(3×4)-2" })], "(5 + 3) × 4 − 2 = 8 × 4 − 2 = 32 − 2 = 30.", "(5 + 3) × 4 − 2"],
  ["A21", 2, "At 6 am the temperature was −7 °C. By noon it had risen by 12 °C. By midnight it had fallen by 9 °C. What was the temperature at midnight?", [N("-4", { post: "°C" })], "−7 + 12 = 5. Then 5 − 9 = −4.", "−4 °C"],
  ["A22", 2, "A packet of pens costs £1.35. (a) How many packets can you buy with £20? (b) How much change do you get?", [N("14", { l: "(a)" }), N("1.10", { l: "(b)", pre: "£", tol: 0.001 })], "15 packets would cost £20.25: too much. 14 packets cost 14 × 1.35 = £18.90. Change: £20 − £18.90 = £1.10.", "(a) 14  (b) £1.10"],
  ["A23", 2, "47 × 36 = 1692. Use this to work out (a) 4.7 × 3.6, (b) 1692 ÷ 0.36.", [N("16.92", { l: "(a)" }), N("4700", { l: "(b)" })], "(a) Two decimal places in total: 16.92. (b) 1692 ÷ 36 = 47, and dividing by 0.36 (100 times smaller) gives an answer 100 times bigger: 4700.", "(a) 16.92  (b) 4700"],
  ["A24", 2, "Estimate (8.93 × 41.2) ÷ 0.198. Round each number to 1 significant figure first.", [N("1800")], "9 × 40 = 360. 360 ÷ 0.2 = 1800.", "1800"],
  ["A25", 2, "Ben says 0.3 × 0.4 = 1.2. Explain his mistake and write the correct answer.", [{ t: "self" }], "3 × 4 = 12, but the question has two decimal places in total, so the answer needs two decimal places: 0.12. A good check: multiplying two numbers smaller than 1 always gives an answer smaller than both.", "0.12"],

  // ---- B Powers & Primes (Unit 2)
  ["B1", 0, "Work out 2⁵.", [N("32")], "2 × 2 × 2 × 2 × 2 = 32.", "32"],
  ["B2", 0, "Work out the cube root of 125.", [N("5")], "5 × 5 × 5 = 125.", "5"],
  ["B3", 0, "Work out √144 + √25.", [N("17")], "√144 = 12 and √25 = 5.", "17"],
  ["B4", 0, "Write 3 × 3 × 3 × 3 as a power of 3.", [TX(["3^4", "3⁴"], { ph: "e.g. 5^2" })], "Four 3s multiplied together: 3⁴.", "3⁴"],
  ["B5", 0, "From this list, write down the prime numbers: 2, 9, 15, 21, 23, 27, 29.", [SET([2, 23, 29], { wide: true })], "9 = 3 × 3, 15 = 3 × 5, 21 = 3 × 7 and 27 = 3 × 9 are not prime. 2 is the only even prime.", "2, 23, 29"],
  ["B6", 0, "List all the factors of 36.", [SET([1, 2, 3, 4, 6, 9, 12, 18, 36], { wide: true })], "Find factor pairs: 1 × 36, 2 × 18, 3 × 12, 4 × 9, 6 × 6.", "1, 2, 3, 4, 6, 9, 12, 18, 36"],
  ["B7", 0, "Work out 10⁴.", [N("10000")], "10 × 10 × 10 × 10 = 10 000.", "10 000"],
  ["B8", 0, "From this list, write down the cube numbers: 1, 8, 12, 27, 36, 64, 100.", [SET([1, 8, 27, 64], { wide: true })], "1 = 1³, 8 = 2³, 27 = 3³, 64 = 4³.", "1, 8, 27, 64"],
  ["B9", 1, "Write 72 as a product of its prime factors. Use index form.", [{ t: "pf", a: 72, ph: "e.g. 2^3 × 5" }], "72 = 2 × 36 = 2 × 2 × 18 = 2 × 2 × 2 × 9 = 2 × 2 × 2 × 3 × 3. Index form: 2³ × 3².", "2³ × 3²"],
  ["B10", 1, "Write 240 as a product of its prime factors. Use index form.", [{ t: "pf", a: 240, ph: "e.g. 2^3 × 5" }], "240 = 2 × 120 = 2 × 2 × 60 = 2 × 2 × 2 × 30 = 2 × 2 × 2 × 2 × 15 = 2⁴ × 3 × 5.", "2⁴ × 3 × 5"],
  ["B11", 1, "Find the highest common factor (HCF) of 84 and 120.", [N("12")], "84 = 2² × 3 × 7 and 120 = 2³ × 3 × 5. Common primes: 2² × 3 = 12.", "12"],
  ["B12", 1, "Find the lowest common multiple (LCM) of 70 and 56.", [N("280")], "70 = 2 × 5 × 7 and 56 = 2³ × 7. LCM = 2³ × 5 × 7 = 280.", "280"],
  ["B13", 1, "Which of these numbers are divisible by 3? 241, 522, 1005, 3334, 717", [SET([522, 1005, 717], { wide: true })], "A number is divisible by 3 when its digit sum is. 241 → 7 (no), 522 → 9 (yes), 1005 → 6 (yes), 3334 → 13 (no), 717 → 15 (yes).", "522, 1005, 717"],
  ["B14", 1, "Work out 3² × 2³.", [N("72")], "9 × 8 = 72.", "72"],
  ["B15", 1, "Work out √(36 + 64).", [N("10")], "Inside the root first: 36 + 64 = 100, and √100 = 10. (Note: √36 + √64 = 14, which is different.)", "10"],
  ["B16", 1, "Work out 5 × 10³ + 4 × 10².", [N("5400")], "5 × 1000 = 5000 and 4 × 100 = 400.", "5400"],
  ["B17", 1, "Bus A comes every 10 minutes. Bus B comes every 14 minutes. Both are at the stop at 11 am. When are they next at the stop together?", [TX(["12:10", "12.10", "12:10pm", "12.10pm", "1210", "12:10p.m."], { ph: "e.g. 11:45" })], "LCM of 10 and 14: 10 = 2 × 5, 14 = 2 × 7, so LCM = 2 × 5 × 7 = 70 minutes. 11 am + 1 hour 10 minutes.", "12:10 pm"],
  ["B18", 2, "648 = 2³ × 3⁴ and 540 = 2² × 3³ × 5. Find (a) the HCF, (b) the LCM of 648 and 540.", [N("108", { l: "(a)" }), N("3240", { l: "(b)" })], "HCF: lowest power of each common prime: 2² × 3³ = 4 × 27 = 108. LCM: highest power of every prime: 2³ × 3⁴ × 5 = 8 × 81 × 5 = 3240.", "(a) 108  (b) 3240"],
  ["B19", 2, "Find the LCM of 12, 15 and 18.", [N("180")], "12 = 2² × 3, 15 = 3 × 5, 18 = 2 × 3². LCM = 2² × 3² × 5 = 180.", "180"],
  ["B20", 2, "Find the HCF of 72, 90 and 126.", [N("18")], "72 = 2³ × 3², 90 = 2 × 3² × 5, 126 = 2 × 3² × 7. Common: 2 × 3² = 18.", "18"],
  ["B21", 2, "Three lights flash every 5, 6 and 7 seconds. They all flash together. How many seconds until they next all flash together?", [N("210", { post: "s" })], "5, 6 and 7 share no common factors, so LCM = 5 × 6 × 7 = 210.", "210 seconds"],
  ["B22", 2, "Kenny thinks of two numbers greater than 10. Their HCF is 7 and their LCM is 84. What are the two numbers?", [SET([21, 28])], "Both are multiples of 7: 7a and 7b with a and b sharing no factor, and 7 × a × b = 84, so a × b = 12. Options: 1 × 12 (gives 7, too small) or 3 × 4. So 21 and 28.", "21 and 28"],
  ["B23", 2, "Which whole numbers less than 50 have exactly 3 factors?", [SET([4, 9, 25, 49], { wide: true })], "Only squares of primes have exactly 3 factors (for example 25: 1, 5, 25). Squares of primes below 50: 4, 9, 25, 49.", "4, 9, 25, 49"],
  ["B24", 2, "Write 2⁴ × 2³ as a single power of 2.", [TX(["2^7", "2⁷"], { ph: "e.g. 5^2" })], "When you multiply powers of the same number, add the indices: 4 + 3 = 7.", "2⁷"],
  ["B25", 2, "Cheese slices come in packs of 8. Buns come in packs of 6. What is the smallest number of packs of each you can buy to have the same number of slices and buns?", [N("3", { l: "cheese" }), N("4", { l: "buns" })], "LCM of 8 and 6 is 24. 24 ÷ 8 = 3 packs of cheese and 24 ÷ 6 = 4 packs of buns.", "3 packs of cheese, 4 packs of buns"],

  // ---- C Area & Volume (Unit 3)
  ["C1", 0, "Convert 3.5 m to centimetres.", [N("350", { post: "cm" })], "1 m = 100 cm, so 3.5 × 100.", "350 cm"],
  ["C2", 0, "Convert 4200 g to kilograms.", [N("4.2", { post: "kg" })], "1 kg = 1000 g, so 4200 ÷ 1000.", "4.2 kg"],
  ["C3", 0, "Find the area of a rectangle 12 cm long and 7 cm wide.", [N("84", { post: "cm²" })], "Area = length × width = 12 × 7.", "84 cm²"],
  ["C4", 0, "Find the area of this triangle.", [N("27", { post: "cm²" })], "Area = ½ × base × height = ½ × 9 × 6.", "27 cm²"],
  ["C5", 0, "Find the area of this parallelogram.", [N("44", { post: "cm²" })], "Area = base × perpendicular height = 11 × 4.", "44 cm²"],
  ["C6", 0, "How many faces, edges and vertices does a cuboid have?", [N("6", { l: "faces" }), N("12", { l: "edges" }), N("8", { l: "vertices" })], "Faces are the flat surfaces (6), edges are where two faces meet (12), vertices are the corners (8).", "6 faces, 12 edges, 8 vertices"],
  ["C7", 0, "Find the volume of this cuboid.", [N("60", { post: "cm³" })], "Volume = length × width × height = 5 × 4 × 3.", "60 cm³"],
  ["C8", 0, "Convert 2.5 litres to millilitres.", [N("2500", { post: "ml" })], "1 litre = 1000 ml.", "2500 ml"],
  ["C9", 1, "Find the area of this trapezium.", [N("60", { post: "cm²" })], "Area = ½ × (a + b) × h = ½ × (7 + 13) × 6 = ½ × 20 × 6.", "60 cm²"],
  ["C10", 1, "This kite has diagonals of 10 cm and 6 cm. Find its area.", [N("30", { post: "cm²" })], "Area of a kite (or rhombus) = ½ × diagonal × diagonal = ½ × 10 × 6.", "30 cm²"],
  ["C11", 1, "A rhombus has diagonals of 8 cm and 12 cm. Find its area.", [N("48", { post: "cm²" })], "½ × 8 × 12 = 48.", "48 cm²"],
  ["C12", 1, "Convert 3 m² to cm².", [N("30000", { post: "cm²" })], "1 m² = 100 cm × 100 cm = 10 000 cm². So 3 × 10 000.", "30 000 cm²"],
  ["C13", 1, "Convert 45 000 cm³ to litres.", [N("45", { post: "litres" })], "1 litre = 1000 cm³, so 45 000 ÷ 1000.", "45 litres"],
  ["C14", 1, "A rectangle has an area of 54 cm² and a length of 9 cm. Find its width.", [N("6", { post: "cm" })], "Width = area ÷ length = 54 ÷ 9.", "6 cm"],
  ["C15", 1, "A triangle has an area of 35 cm² and a base of 10 cm. Find its perpendicular height.", [N("7", { post: "cm" })], "Area = ½ × b × h, so 35 = 5 × h and h = 7.", "7 cm"],
  ["C16", 1, "Find the total surface area of this cuboid.", [N("94", { post: "cm²" })], "Three pairs of faces: 5 × 4 = 20, 5 × 3 = 15, 4 × 3 = 12. Total = 2 × (20 + 15 + 12) = 94.", "94 cm²"],
  ["C17", 1, "Find the area of this shape (a 10 cm by 8 cm rectangle with a 4 cm by 3 cm corner cut out).", [N("68", { post: "cm²" })], "Whole rectangle 10 × 8 = 80. Cut-out 4 × 3 = 12. 80 − 12 = 68.", "68 cm²"],
  ["C18", 2, "Convert 2.4 m³ to cm³.", [N("2400000", { post: "cm³" })], "1 m³ = 100 × 100 × 100 = 1 000 000 cm³. So 2.4 × 1 000 000.", "2 400 000 cm³"],
  ["C19", 2, "A cube has a volume of 64 cm³. Find its total surface area.", [N("96", { post: "cm²" })], "Side = cube root of 64 = 4 cm. One face = 16 cm². Six faces: 96 cm².", "96 cm²"],
  ["C20", 2, "A fish tank measures 50 cm by 40 cm by 30 cm. How many litres of water does it hold when full?", [N("60", { post: "litres" })], "Volume = 50 × 40 × 30 = 60 000 cm³. 1 litre = 1000 cm³, so 60 litres.", "60 litres"],
  ["C21", 2, "A parallelogram has an area of 72 cm² and a perpendicular height of 8 cm. Find the length of its base.", [N("9", { post: "cm" })], "Base = area ÷ height = 72 ÷ 8.", "9 cm"],
  ["C22", 2, "A solid is made from a cuboid 6 cm by 4 cm by 2 cm with a cube of side 2 cm glued on top. Find its total volume.", [N("56", { post: "cm³" })], "Cuboid: 6 × 4 × 2 = 48. Cube: 2 × 2 × 2 = 8. Total 56.", "56 cm³"],
  ["C23", 2, "A car travels 150 km in 2.5 hours. Find its average speed.", [N("60", { post: "km/h" })], "Speed = distance ÷ time = 150 ÷ 2.5 = 60.", "60 km/h"],
  ["C24", 2, "Convert 20 m/s to km/h.", [N("72", { post: "km/h" })], "In one hour (3600 s): 20 × 3600 = 72 000 m = 72 km.", "72 km/h"],
  ["C25", 2, "A cuboid has a volume of 120 cm³, a length of 6 cm and a width of 5 cm. Find (a) its height, (b) its total surface area.", [N("4", { l: "(a)", post: "cm" }), N("148", { l: "(b)", post: "cm²" })], "(a) 120 ÷ (6 × 5) = 4. (b) Faces: 6 × 5 = 30, 6 × 4 = 24, 5 × 4 = 20. 2 × (30 + 24 + 20) = 148.", "(a) 4 cm  (b) 148 cm²"],

  // ---- D Pythagoras (Unit 4)
  ["D1", 0, "Work out 6² + 8².", [N("100")], "36 + 64 = 100.", "100"],
  ["D2", 0, "Find the length of the hypotenuse x.", [N("5", { pre: "x =", post: "cm" })], "x² = 3² + 4² = 9 + 16 = 25, so x = √25 = 5.", "5 cm"],
  ["D3", 0, "Find the length of the hypotenuse x.", [N("10", { pre: "x =", post: "cm" })], "x² = 6² + 8² = 36 + 64 = 100, so x = 10.", "10 cm"],
  ["D4", 0, "A right-angled triangle has shorter sides of 5 cm and 12 cm. Find the hypotenuse.", [N("13", { post: "cm" })], "25 + 144 = 169, and √169 = 13.", "13 cm"],
  ["D5", 0, "Find the length x.", [N("8", { pre: "x =", post: "cm" })], "x is a shorter side, so subtract: x² = 10² − 6² = 100 − 36 = 64, so x = 8.", "8 cm"],
  ["D6", 0, "Is a triangle with sides 7 cm, 24 cm and 25 cm right-angled? Answer yes or no.", [TX(["yes", "y"])], "7² + 24² = 49 + 576 = 625 = 25². Pythagoras works, so it is right-angled.", "Yes"],
  ["D7", 0, "Which of these is a Pythagorean triple? (4, 5, 6) (8, 15, 17) (5, 6, 7). Write its three numbers.", [SET([8, 15, 17])], "64 + 225 = 289 = 17². The others fail: 16 + 25 ≠ 36 and 25 + 36 ≠ 49.", "8, 15, 17"],
  ["D8", 0, "A right-angled triangle has a hypotenuse of 13 cm and one shorter side of 5 cm. Find the other side.", [N("12", { post: "cm" })], "169 − 25 = 144, and √144 = 12.", "12 cm"],
  ["D9", 1, "A right-angled triangle has shorter sides of 9 cm and 12 cm. Find the hypotenuse.", [N("15", { post: "cm" })], "81 + 144 = 225, √225 = 15. (It is the 3, 4, 5 triple × 3.)", "15 cm"],
  ["D10", 1, "A right-angled triangle has a hypotenuse of 25 cm and one shorter side of 7 cm. Find the other side.", [N("24", { post: "cm" })], "625 − 49 = 576, √576 = 24.", "24 cm"],
  ["D11", 1, "A 5 m ladder leans against a wall. Its foot is 3 m from the wall. How high up the wall does it reach?", [N("4", { post: "m" })], "The ladder is the hypotenuse: 5² − 3² = 25 − 9 = 16, √16 = 4.", "4 m"],
  ["D12", 1, "A rectangle is 8 cm long and 6 cm wide. Find the length of its diagonal.", [N("10", { post: "cm" })], "The diagonal is the hypotenuse of a right-angled triangle with sides 8 and 6: √100 = 10.", "10 cm"],
  ["D13", 1, "Is a triangle with sides 6 cm, 7 cm and 9 cm right-angled? Answer yes or no.", [TX(["no", "n"])], "6² + 7² = 36 + 49 = 85, but 9² = 81. Not equal, so it is not right-angled.", "No"],
  ["D14", 1, "Find the area of this right-angled triangle.", [N("24", { post: "cm²" })], "The two shorter sides are perpendicular, so use them as base and height: ½ × 8 × 6.", "24 cm²"],
  ["D15", 1, "Find the volume of this triangular prism.", [N("120", { post: "cm³" })], "Area of cross-section = ½ × 6 × 4 = 12 cm². Volume = 12 × 10 = 120.", "120 cm³"],
  ["D16", 1, "A triangular prism has a cross-section area of 15 cm² and a length of 8 cm. Find its volume.", [N("120", { post: "cm³" })], "Volume = area of cross-section × length = 15 × 8.", "120 cm³"],
  ["D17", 1, "A right-angled triangle has shorter sides of 20 cm and 21 cm. Find the hypotenuse.", [N("29", { post: "cm" })], "400 + 441 = 841, and 29 × 29 = 841.", "29 cm"],
  ["D18", 2, "This isosceles triangle has sides 13 cm, 13 cm and 10 cm. Find (a) its height h, (b) its area.", [N("12", { l: "(a)", post: "cm" }), N("60", { l: "(b)", post: "cm²" })], "The height splits the base into 5 and 5. h² = 13² − 5² = 169 − 25 = 144, so h = 12. Area = ½ × 10 × 12 = 60.", "(a) 12 cm  (b) 60 cm²"],
  ["D19", 2, "Sam walks 9 km north and then 12 km east. How far is Sam from the start in a straight line?", [N("15", { post: "km" })], "North and east are at right angles: √(81 + 144) = √225 = 15.", "15 km"],
  ["D20", 2, "This prism has a right-angled triangle as its cross-section. Find (a) its volume, (b) its total surface area.", [N("60", { l: "(a)", post: "cm³" }), N("132", { l: "(b)", post: "cm²" })], "The hypotenuse is 5 cm (3, 4, 5). (a) Cross-section ½ × 4 × 3 = 6, volume 6 × 10 = 60. (b) Two triangles 2 × 6 = 12, three rectangles (3 + 4 + 5) × 10 = 120. Total 132.", "(a) 60 cm³  (b) 132 cm²"],
  ["D21", 2, "A rhombus has diagonals of 12 cm and 16 cm. The diagonals cross at right angles and cut each other in half. Find the length of one side.", [N("10", { post: "cm" })], "Half-diagonals are 6 and 8. Side² = 36 + 64 = 100, so the side is 10 cm.", "10 cm"],
  ["D22", 2, "A square has a diagonal of 10 cm. Find its area.", [N("50", { post: "cm²" })], "If the side is s, then s² + s² = 10², so 2s² = 100 and s² = 50. The area is s² = 50.", "50 cm²"],
  ["D23", 2, "A triangle has sides 5 cm, 6 cm and 9 cm. Is its largest angle acute, right or obtuse?", [TX(["obtuse"])], "5² + 6² = 61 is less than 9² = 81. When the two shorter sides squared add up to less than the longest side squared, the largest angle is obtuse.", "Obtuse"],
  ["D24", 2, "A ramp is 17 m long and rises 8 m. How far does it go horizontally?", [N("15", { post: "m" })], "The ramp is the hypotenuse: 289 − 64 = 225, so 15 m.", "15 m"],
  ["D25", 2, "Show that a triangle with sides 9 cm, 40 cm and 41 cm is right-angled.", [{ t: "self" }], "9² + 40² = 81 + 1600 = 1681, and 41² = 1681. The two shorter sides squared add up to the longest side squared, so by Pythagoras' theorem the triangle is right-angled.", "81 + 1600 = 1681 = 41²"]
].map(r => ({ id: r[0], sec: r[0][0], lvl: r[1], q: r[2], parts: r[3], sol: r[4], ans: r[5] }));

/* ---------- Unit 5 (after autumn half term): LCM, HCF, fractions and percentages ---------- */
SECTIONS.push({ id: "E", name: "Fractions & %", blurb: "Unit 5 · After half term. HCF and LCM, fractions, mixed numbers and percentages. No calculator." });
Q.push(...[
  ["E1", 0, "Find the highest common factor (HCF) of 126 and 180.", [N("18")], "126 = 2 × 3² × 7 and 180 = 2² × 3² × 5. In a Venn diagram the shared primes are 2, 3 and 3, so HCF = 2 × 3² = 18.", "18"],
  ["E2", 0, "Find the lowest common multiple (LCM) of 24, 36 and 40.", [N("360")], "24 = 2³ × 3, 36 = 2² × 3², 40 = 2³ × 5. Take every prime at its highest power: 2³ × 3² × 5 = 360.", "360"],
  ["E3", 0, "Write in order, smallest first: {3/4}, {2/3}, {5/8}.", [{ t: "seq", a: [5 / 8, 2 / 3, 3 / 4], ph: "e.g. 1/2, 3/5, 4/5" }], "Use a common denominator of 24: {18/24}, {16/24}, {15/24}. So {5/8} < {2/3} < {3/4}.", "{5/8}, {2/3}, {3/4}"],
  ["E4", 0, "Find {3/5} of £45.", [N("27", { pre: "£" })], "{1/5} of 45 = 9, so {3/5} = 3 × 9.", "£27"],
  ["E5", 0, "Work out {2/3} + {1/4}.", [N("11/12", { frac: true })], "Common denominator 12: {8/12} + {3/12} = {11/12}.", "{11/12}"],
  ["E6", 1, "Work out 3{1/2} − 1{2/3}. Give your answer as a mixed number.", [N("1 5/6", { mixed: true })], "Change to improper fractions: {7/2} − {5/3} = {21/6} − {10/6} = {11/6} = 1{5/6}.", "1{5/6}"],
  ["E7", 1, "Write {23/5} as a mixed number.", [N("4 3/5", { mixed: true })], "23 ÷ 5 = 4 remainder 3, so 4{3/5}.", "4{3/5}"],
  ["E8", 1, "Write {7/25} as a percentage.", [N("28", { post: "%" })], "Make the denominator 100: {7/25} = {28/100} = 28%.", "28%"],
  ["E9", 1, "Increase £80 by 15%.", [N("92", { pre: "£" })], "10% = £8, 5% = £4, so 15% = £12. £80 + £12 = £92. (Or 80 × 1.15.)", "£92"],
  ["E10", 1, "What fraction of 180 is 120? Give it in its simplest form.", [N("2/3", { frac: true })], "{120/180}, then divide top and bottom by 60.", "{2/3}"],
  ["E11", 2, "Work out 2{1/4} × 1{1/3}.", [N("3")], "{9/4} × {4/3} = {36/12} = 3.", "3"],
  ["E12", 2, "Work out 2{1/2} ÷ {3/4}. Give your answer as a mixed number.", [N("3 1/3", { mixed: true })], "{5/2} ÷ {3/4} = {5/2} × {4/3} = {20/6} = 3{1/3}.", "3{1/3}"],
  ["E13", 2, "After a 20% increase a bike costs £180. What was the price before the increase?", [N("150", { pre: "£" })], "A 20% increase means multiplying by 1.2. To go back, divide: £180 ÷ 1.2 = £150. (Not 20% of 180: that gives the wrong answer £144.)", "£150"],
  ["E14", 2, "A £250 phone is reduced by 12%. Use a multiplier to find the new price.", [N("220", { pre: "£" })], "A 12% decrease leaves 88%, so the multiplier is 0.88. £250 × 0.88 = £220.", "£220"],
  ["E15", 2, "Explain why a 10% increase followed by a 10% decrease does not take you back to the original amount.", [{ t: "self" }], "Try £100: +10% gives £110, then −10% of £110 is £11, leaving £99. The decrease is 10% of a bigger number. With multipliers: 1.1 × 0.9 = 0.99, so you always end 1% lower.", "You end at 99% of the start"]
].map(r => ({ id: r[0], sec: r[0][0], lvl: r[1], q: r[2], parts: r[3], sol: r[4], ans: r[5] })));
