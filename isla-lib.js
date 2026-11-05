'use strict';
/* =====================================================================
   ISLA ENGINE · librería de dibujo isométrico + UI "papeleo oficial"
   Canvas 1080x1920 · todo se dibuja por código, sin assets externos
   ===================================================================== */
let W = 1080, H = 1920;
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');

const C = {
  sea0: '#3DB6C4', sea1: '#1A7E9B', sea2: '#0B4A66',
  sand: '#F4D7A1', sandSide: '#D9AC66',
  grass: '#8CCB6A', grassSide: '#5E9C49',
  ink: '#15232F', navy: '#10263A', paper: '#FFF8EA', paperEdge: '#E6D3AE',
  red: '#D7263D', green: '#169B5A', amber: '#E07B00', yellow: '#FFC83D', coral: '#F2614C',
  white: '#FFFFFF', wall: '#FFF3DF', wood: '#B07443', woodDark: '#7C4A26', skin: '#F2C29B',
  glass: '#7FC8E8'
};
const ROOFS = ['#F2614C', '#2E8FA8', '#E9A93B', '#3B4E8C', '#E76F8A', '#4FA36B'];
const SHIRTS = ['#F2614C', '#2E8FA8', '#FFC83D', '#6C5CE7', '#169B5A', '#E76F8A', '#10263A'];

/* ---------- utilidades ---------- */
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const easeOutCubic = t => 1 - Math.pow(1 - clamp(t), 3);
const easeInCubic = t => Math.pow(clamp(t), 3);
const easeInQuad = t => clamp(t) * clamp(t);
const easeInOutCubic = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const easeOutBack = (t, s = 1.70158) => { t = clamp(t); const c3 = s + 1; return 1 + c3 * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); };
function h2(i, j, s = 0) { const x = Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453; return x - Math.floor(x); }
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hexToRgb(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
function shade(h, k) { const [r, g, b] = hexToRgb(h); const f = k < 0 ? 0 : 255, a = Math.abs(k); return `rgb(${Math.round(r + (f - r) * a)},${Math.round(g + (f - g) * a)},${Math.round(b + (f - b) * a)})`; }
function rgba(h, a) { const [r, g, b] = hexToRgb(h); return `rgba(${r},${g},${b},${a})`; }
const FONT_MAP = { IDBlack: '900 {px}px "Rubik", system-ui, sans-serif', ISemi: '600 {px}px "Rubik", system-ui, sans-serif', IBold: '700 {px}px "Rubik", system-ui, sans-serif', MonoB: '700 {px}px "IBM Plex Mono", monospace', IDXB: '800 {px}px "Rubik", system-ui, sans-serif' };
const F = (fam, px) => (FONT_MAP[fam] || '{px}px sans-serif').replace('{px}', Math.round(px));
function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

/* ---------- cámara y proyección isométrica ---------- */
const cam = { x: 0, y: 0, zoom: 1, cx: 540, cy: 1010, u: 60, shx: 0, shy: 0 };
const U = () => cam.u * cam.zoom;
function P(x, y, z = 0) { const u = U(); const dx = x - cam.x, dy = y - cam.y; return [cam.cx + (dx - dy) * u, cam.cy + (dx + dy) * u * 0.5 - z * u * 1.15]; }
function poly(pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); }
function fillPoly(pts, col) { poly(pts); ctx.fillStyle = col; ctx.fill(); }
function fillPolyS(pts, col) { poly(pts); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke(); }

/* ---------- isla ---------- */
function islandR(th, R, seed) { return R * (1 + 0.09 * Math.sin(3 * th + seed) + 0.05 * Math.sin(5 * th + seed * 2.3) + 0.03 * Math.sin(9 * th + seed * 0.7)); }
function islandPts(R, seed, n = 120) { const out = []; for (let i = 0; i < n; i++) { const th = i / n * Math.PI * 2; const r = islandR(th, R, seed); out.push([r * Math.cos(th), r * Math.sin(th)]); } return out; }
const grassRad = R => (R - Math.min(1.3, 0.4 + R * 0.09)) * clamp((R - 1.5) / 0.8);
function inGrass(x, y, R, seed, m = 0) { const th = Math.atan2(y, x); return Math.hypot(x, y) < islandR(th, grassRad(R), seed + 1.3) - m; }
const Z_SAND = 0.18, Z_GRASS = 0.26;
function groundZ(x, y, R, seed) { return inGrass(x, y, R, seed) ? Z_GRASS : Z_SAND; }

function extrude(ptsW, z0, z1, topCol, sideCol) {
  const n = ptsW.length;
  const top = ptsW.map(p => P(p[0], p[1], z1));
  const bot = ptsW.map(p => P(p[0], p[1], z0));
  let cxw = 0, cyw = 0; for (const p of ptsW) { cxw += p[0]; cyw += p[1]; } cxw /= n; cyw /= n;
  const quads = [];
  for (let i = 0; i < n; i++) {
    const a = ptsW[i], b = ptsW[(i + 1) % n];
    let nx = b[1] - a[1], ny = -(b[0] - a[0]);
    const mx = (a[0] + b[0]) / 2 - cxw, my = (a[1] + b[1]) / 2 - cyw;
    if (nx * mx + ny * my < 0) { nx = -nx; ny = -ny; }
    if (nx + ny <= 0) continue;
    const L = Math.hypot(nx, ny) || 1; const k = ((ny - nx) / L) * 0.10 - 0.02;
    quads.push({ d: (a[0] + b[0] + a[1] + b[1]) / 2, pts: [top[i], top[(i + 1) % n], bot[(i + 1) % n], bot[i]], col: shade(sideCol, k) });
  }
  quads.sort((p, q) => p.d - q.d);
  for (const q of quads) fillPolyS(q.pts, q.col);
  fillPolyS(top, topCol);
}

function drawSea(t, R) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, C.sea2); g.addColorStop(0.5, C.sea1); g.addColorStop(1, '#0E5675');
  ctx.fillStyle = g; ctx.fillRect(-40, -40, W + 80, H + 80);
  const [ix, iy] = P(0, 0, 0);
  const rg = ctx.createRadialGradient(ix, iy, 0, ix, iy, 760);
  rg.addColorStop(0, 'rgba(90,205,212,0.38)'); rg.addColorStop(1, 'rgba(90,205,212,0)');
  ctx.fillStyle = rg; ctx.fillRect(-40, -40, W + 80, H + 80);
  // destellos de olas (en coordenadas de mundo)
  const u = U(); const sp = 1.6;
  const inv = (sx, sy) => { const a = (sx - cam.cx) / u, b = (sy - cam.cy) / (u * 0.5); return [(a + b) / 2 + cam.x, (b - a) / 2 + cam.y]; };
  const cs = [inv(-60, -60), inv(W + 60, -60), inv(-60, H + 60), inv(W + 60, H + 60)];
  const xs = cs.map(c => c[0]), ys = cs.map(c => c[1]);
  const i0 = Math.floor(Math.min(...xs) / sp), i1 = Math.ceil(Math.max(...xs) / sp);
  const j0 = Math.floor(Math.min(...ys) / sp), j1 = Math.ceil(Math.max(...ys) / sp);
  ctx.lineCap = 'round';
  const lw = Math.max(2, 0.05 * u);
  for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
    const ph = h2(i, j, 3) * 6.28;
    const a = Math.sin(t * 1.4 + ph);
    if (a < 0.15) continue;
    const x = i * sp + h2(i, j, 1) * sp + t * 0.12, y = j * sp + h2(i, j, 2) * sp;
    if (Math.hypot(x, y) < R * 1.25 + 1.0) continue;
    const L = 0.16 + 0.12 * h2(i, j, 4);
    const p1 = P(x - L, y + L, 0), p2 = P(x + L, y - L, 0);
    if (p1[0] < -40 || p1[0] > W + 40 || p1[1] < -40 || p1[1] > H + 40) continue;
    ctx.strokeStyle = `rgba(255,255,255,${0.32 * (a - 0.15)})`; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
  }
}

function drawShore(R, seed, t) {
  if (R <= 0.05) return;
  fillPoly(islandPts(R * 1.22 + 0.95, seed).map(p => P(p[0], p[1], 0)), 'rgba(110,215,210,0.22)');
  fillPoly(islandPts(R * 1.08 + 0.5, seed).map(p => P(p[0], p[1], 0)), 'rgba(150,232,218,0.40)');
  for (let k = 0; k < 3; k++) {
    const ph = ((t * 0.32) + k / 3) % 1;
    poly(islandPts(R + 0.08 + ph * 0.75, seed).map(p => P(p[0], p[1], 0)));
    ctx.strokeStyle = `rgba(255,255,255,${0.55 * (1 - ph) * (1 - ph)})`; ctx.lineWidth = Math.max(2, 0.05 * U()); ctx.stroke();
  }
  poly(islandPts(R + 0.05, seed).map(p => P(p[0], p[1], 0)));
  ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = Math.max(3, 0.07 * U()); ctx.stroke();
}

function drawIsland(R, seed) {
  if (R <= 0.05) return;
  extrude(islandPts(R, seed), 0, Z_SAND, C.sand, C.sandSide);
  const gr = grassRad(R);
  if (gr > 0.05) extrude(islandPts(gr, seed + 1.3), Z_SAND, Z_GRASS, C.grass, C.grassSide);
}

/* ---------- primitivas 3D ---------- */
function box(x, y, w, d, h, z, col, o = {}) {
  const A = P(x, y + d, z), B = P(x + w, y + d, z), Cc = P(x + w, y, z);
  const A2 = P(x, y + d, z + h), B2 = P(x + w, y + d, z + h), C2 = P(x + w, y, z + h), D2 = P(x, y, z + h);
  fillPolyS([A, B, B2, A2], o.lcol || shade(col, o.lk ?? 0));
  fillPolyS([B, Cc, C2, B2], o.rcol || shade(col, o.rk ?? -0.18));
  if (!o.noTop) fillPolyS([D2, A2, B2, C2], o.tcol || shade(col, o.tk ?? 0.14));
}
const faceL = (x0, x1, z0, z1, Y) => [P(x0, Y, z0), P(x1, Y, z0), P(x1, Y, z1), P(x0, Y, z1)];
const faceR = (y0, y1, z0, z1, X) => [P(X, y0, z0), P(X, y1, z0), P(X, y1, z1), P(X, y0, z1)];

function shadowAt(x, y, z, rx, ry) {
  const [sx, sy] = P(x, y, z); const u = U();
  ctx.fillStyle = 'rgba(20,40,40,0.18)'; ctx.beginPath(); ctx.ellipse(sx, sy, rx * u, ry * u, 0, 0, Math.PI * 2); ctx.fill();
}

function drawHouse(o, z) {
  const w = o.w ?? 0.62, d = o.d ?? 0.55, h = o.h ?? 0.42, hr = o.hr ?? 0.3;
  const x = o.x - w / 2, y = o.y - d / 2, roof = o.roof || C.coral;
  box(x, y, w, d, h, z, o.wall || C.wall, { noTop: true });
  const Y = y + d, X = x + w;
  fillPoly(faceL(x + w * 0.38, x + w * 0.62, z, z + h * 0.62, Y), C.woodDark);
  fillPoly(faceL(x + w * 0.1, x + w * 0.28, z + h * 0.45, z + h * 0.78, Y), C.glass);
  fillPoly(faceL(x + w * 0.72, x + w * 0.9, z + h * 0.45, z + h * 0.78, Y), C.glass);
  fillPoly(faceR(y + d * 0.3, y + d * 0.7, z + h * 0.45, z + h * 0.78, X), shade(C.glass, -0.2));
  const ov = 0.07, xa = x - ov, xb = x + w + ov, ya = y - ov, yb = y + d + ov, zr = z + h, zt = z + h + hr, ym = y + d / 2;
  fillPolyS([P(xa, ya, zr), P(xb, ya, zr), P(xb, ym, zt), P(xa, ym, zt)], shade(roof, -0.12));
  fillPolyS([P(X, y, zr), P(X, y + d, zr), P(X, ym, zt)], shade(o.wall || C.wall, -0.18));
  fillPolyS([P(xa, yb, zr), P(xb, yb, zr), P(xb, ym, zt), P(xa, ym, zt)], roof);
  const r1 = P(xa, ym, zt), r2 = P(xb, ym, zt);
  ctx.strokeStyle = shade(roof, 0.35); ctx.lineWidth = Math.max(1.5, U() * 0.025); ctx.beginPath(); ctx.moveTo(r1[0], r1[1]); ctx.lineTo(r2[0], r2[1]); ctx.stroke();
}

function drawShop(o, z) {
  const w = o.w ?? 0.75, d = o.d ?? 0.6, h = o.h ?? 0.48;
  const x = o.x - w / 2, y = o.y - d / 2, col = o.col || C.coral;
  box(x, y, w, d, h, z, o.wall || '#FDEBD3', { tcol: shade(col, 0.55) });
  const Y = y + d;
  fillPoly(faceL(x + w * 0.1, x + w * 0.9, z, z + h * 0.55, Y), C.glass);
  fillPoly(faceL(x + w * 0.42, x + w * 0.58, z, z + h * 0.55, Y), shade(C.glass, -0.25));
  // toldo a rayas
  const n = 5;
  for (let i = 0; i < n; i++) {
    const xa = x + w * i / n, xb = x + w * (i + 1) / n;
    fillPolyS([P(xa, Y, z + h * 0.78), P(xb, Y, z + h * 0.78), P(xb, Y + 0.16, z + h * 0.6), P(xa, Y + 0.16, z + h * 0.6)], i % 2 ? '#FFFFFF' : col);
  }
}

function drawTower(o, z) {
  const w = o.w ?? 0.7, d = o.d ?? 0.7, h = o.h ?? 1.6;
  const x = o.x - w / 2, y = o.y - d / 2, col = o.col || '#9FB7C9';
  box(x, y, w, d, h, z, col);
  const Y = y + d, X = x + w;
  const rows = Math.max(3, Math.round(h / 0.22));
  for (let r = 0; r < rows; r++) {
    const z0 = z + 0.12 + r * (h - 0.2) / rows, z1 = z0 + (h - 0.2) / rows * 0.55;
    for (let c = 0; c < 3; c++) {
      fillPoly(faceL(x + w * (0.1 + c * 0.3), x + w * (0.3 + c * 0.3), z0, z1, Y), rgba('#DFF3FF', 0.85));
      fillPoly(faceR(y + d * (0.1 + c * 0.3), y + d * (0.3 + c * 0.3), z0, z1, X), rgba('#A9D4EE', 0.85));
    }
  }
}

function drawTree(o, z) {
  const [bx, by] = P(o.x, o.y, z); const u = U(); const s = o.s ?? 1;
  shadowAt(o.x, o.y, z, 0.2 * s, 0.1 * s);
  ctx.fillStyle = C.woodDark; ctx.fillRect(bx - 0.035 * u * s, by - 0.3 * u * s, 0.07 * u * s, 0.3 * u * s);
  const r = 0.24 * u * s; const cy = by - 0.42 * u * s;
  ctx.fillStyle = o.col || '#4FA35A'; ctx.beginPath(); ctx.arc(bx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.arc(bx - r * 0.3, cy - r * 0.3, r * 0.45, 0, Math.PI * 2); ctx.fill();
}

function drawPalm(o, z, t) {
  const [bx, by] = P(o.x, o.y, z); const u = U(); const s = o.s ?? 1;
  shadowAt(o.x + 0.15, o.y + 0.1, z, 0.45 * s, 0.2 * s);
  const sway = Math.sin(t * 1.3) * 0.06;
  const tx = bx + (0.22 + sway) * u * s, ty = by - 1.05 * u * s;
  ctx.strokeStyle = '#9A6A3E'; ctx.lineCap = 'round'; ctx.lineWidth = 0.11 * u * s;
  ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx - 0.05 * u * s, by - 0.6 * u * s, tx, ty); ctx.stroke();
  ctx.strokeStyle = 'rgba(80,50,25,0.35)'; ctx.lineWidth = 0.02 * u * s;
  for (let k = 1; k < 6; k++) { const q = k / 6; const px = lerp(bx, tx, q * q) - 0.03 * u * s * Math.sin(q * 3), py = lerp(by, ty, q); ctx.beginPath(); ctx.moveTo(px - 0.05 * u * s, py); ctx.lineTo(px + 0.05 * u * s, py - 0.02 * u * s); ctx.stroke(); }
  const leaves = [[-2.6, '#3E9A4F'], [-1.9, '#4FB05C'], [-1.1, '#3E9A4F'], [-0.4, '#58B865'], [0.35, '#3E9A4F'], [3.4, '#4FB05C'], [2.6, '#58B865']];
  for (const [ang, col] of leaves) {
    const a = ang + Math.sin(t * 1.7 + ang) * 0.06; const L = 0.62 * u * s;
    const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * 0.55 + 0.25 * u * s;
    const mx = tx + Math.cos(a) * L * 0.5, my = ty + Math.sin(a) * L * 0.3 - 0.12 * u * s;
    const nx = -Math.sin(a) * 0.1 * u * s, ny = Math.cos(a) * 0.1 * u * s;
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(mx + nx, my + ny, ex, ey); ctx.quadraticCurveTo(mx - nx, my - ny, tx, ty); ctx.fill();
  }
  ctx.fillStyle = '#7A4E2A'; for (const [dx, dy] of [[-0.05, 0.04], [0.05, 0.05], [0, 0.08]]) { ctx.beginPath(); ctx.arc(tx + dx * u * s, ty + dy * u * s, 0.05 * u * s, 0, 7); ctx.fill(); }
}

function drawPier(x0, y0, len, z) {
  const w = 0.46;
  box(x0 - w / 2, y0, w, len, 0.05, z - 0.06, C.wood, { tcol: '#C98C57' });
  const u = U(); ctx.strokeStyle = 'rgba(90,50,20,0.35)'; ctx.lineWidth = Math.max(1, u * 0.012);
  for (let k = 1; k < len / 0.16; k++) { const a = P(x0 - w / 2, y0 + k * 0.16, z - 0.01), b = P(x0 + w / 2, y0 + k * 0.16, z - 0.01); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  for (const [px, py] of [[x0 - w / 2, y0 + len], [x0 + w / 2, y0 + len], [x0 + w / 2, y0 + len * 0.5]]) box(px - 0.05, py - 0.05, 0.1, 0.1, 0.2, z - 0.1, C.woodDark);
}

function drawFerry(fx, fy, z, t, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha;
  const L = 1.7, Wd = 0.72;
  const u = U();
  // estela
  for (let k = 0; k < 4; k++) {
    const ph = (t * 1.2 + k / 4) % 1; const yy = fy + L / 2 + ph * 1.6; const sp = 0.2 + ph * 0.5;
    const a = P(fx - sp, yy, 0), b = P(fx + sp, yy, 0), m = P(fx, fy + L / 2 - 0.1, 0);
    ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - ph)})`; ctx.lineWidth = Math.max(2, u * 0.04);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(m[0], m[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  }
  const hull = [[fx, fy - L / 2 - 0.3], [fx + Wd / 2, fy - L / 2 + 0.12], [fx + Wd / 2, fy + L / 2], [fx - Wd / 2, fy + L / 2], [fx - Wd / 2, fy - L / 2 + 0.12]];
  extrude(hull, z - 0.02, z + 0.12, '#E9EEF2', '#2E4F7A');
  extrude(hull, z + 0.12, z + 0.26, '#F4F6F8', '#F2614C');
  box(fx - 0.26, fy - 0.35, 0.52, 0.85, 0.32, z + 0.26, '#FFFFFF');
  for (let k = 0; k < 4; k++) fillPoly(faceL(fx - 0.26 + 0.07 + k * 0.11, fx - 0.26 + 0.13 + k * 0.11, z + 0.36, z + 0.48, fy + 0.5), C.navy);
  for (let k = 0; k < 6; k++) fillPoly(faceR(fy - 0.3 + k * 0.13, fy - 0.24 + k * 0.13, z + 0.36, z + 0.48, fx + 0.26), shade(C.navy, 0.2));
  box(fx - 0.08, fy + 0.15, 0.16, 0.16, 0.3, z + 0.58, C.yellow);
  box(fx - 0.08, fy + 0.15, 0.16, 0.16, 0.06, z + 0.88, C.navy);
  ctx.restore();
}

function drawPerson(x, y, z, col, t, s = 1, bounce = 0) {
  const [bx, by0] = P(x, y, z); const u = U() * s;
  const by = by0 - Math.abs(Math.sin(bounce)) * 0.05 * u;
  ctx.fillStyle = 'rgba(20,40,40,0.2)'; ctx.beginPath(); ctx.ellipse(bx, by0, 0.09 * u, 0.045 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(bx - 0.075 * u, by - 0.26 * u, 0.15 * u, 0.24 * u, 0.06 * u); ctx.fill();
  ctx.fillStyle = C.skin; ctx.beginPath(); ctx.arc(bx, by - 0.33 * u, 0.068 * u, 0, 7); ctx.fill();
}

function drawPitch(o, z) {
  const w = o.w ?? 1.5, d = o.d ?? 2.3; const x = o.x - w / 2, y = o.y - d / 2;
  box(x - 0.08, y - 0.08, w + 0.16, d + 0.16, 0.04, z, '#E8E1CF', { tcol: '#EDE6D6' });
  for (let k = 0; k < 6; k++) fillPolyS([P(x, y + d * k / 6, z + 0.045), P(x + w, y + d * k / 6, z + 0.045), P(x + w, y + d * (k + 1) / 6, z + 0.045), P(x, y + d * (k + 1) / 6, z + 0.045)], k % 2 ? '#5DB35A' : '#6CC067');
  const ln = (a, b) => { const p = P(a[0], a[1], z + 0.05), q = P(b[0], b[1], z + 0.05); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); };
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = Math.max(1.5, U() * 0.02);
  const m = 0.1; ln([x + m, y + m], [x + w - m, y + m]); ln([x + w - m, y + m], [x + w - m, y + d - m]); ln([x + w - m, y + d - m], [x + m, y + d - m]); ln([x + m, y + d - m], [x + m, y + m]); ln([x + m, y + d / 2], [x + w - m, y + d / 2]);
  const c = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * 6.283; c.push(P(o.x + Math.cos(a) * 0.25, o.y + Math.sin(a) * 0.25, z + 0.05)); } poly(c); ctx.stroke();
  for (const gy of [y + m, y + d - m]) box(o.x - 0.2, gy - 0.02, 0.4, 0.04, 0.12, z + 0.05, '#FFFFFF');
  if (o.team) { const p = P(x - 0.05, y + d + 0.05, z); ctx.fillStyle = o.team; ctx.fillRect(p[0] - 2, p[1] - 0.5 * U(), 3, 0.5 * U()); ctx.fillRect(p[0], p[1] - 0.5 * U(), 0.22 * U(), 0.14 * U()); }
}

function drawPlot(x, y, z, t, col = C.yellow) {
  const s = 0.42; const pts = [P(x - s, y - s, z + 0.01), P(x + s, y - s, z + 0.01), P(x + s, y + s, z + 0.01), P(x - s, y + s, z + 0.01)];
  poly(pts); ctx.fillStyle = rgba(col, 0.22); ctx.fill();
  ctx.setLineDash([10, 8]); ctx.lineDashOffset = -t * 30; ctx.strokeStyle = col; ctx.lineWidth = Math.max(3, U() * 0.035); ctx.stroke(); ctx.setLineDash([]);
  for (const p of pts) { const q = [p[0], p[1] - 0.18 * U()]; ctx.strokeStyle = C.wood; ctx.lineWidth = Math.max(2, U() * 0.03); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }
}

function drawSignPost(x, y, z, text, s = 1) {
  const [bx, by] = P(x, y, z); const u = U() * s;
  ctx.fillStyle = C.woodDark; ctx.fillRect(bx - 0.03 * u, by - 0.55 * u, 0.06 * u, 0.55 * u);
  ctx.font = F('IDBlack', Math.round(0.17 * u)); const tw = ctx.measureText(text).width;
  const bw = tw + 0.24 * u, bh = 0.3 * u;
  ctx.fillStyle = C.wood; ctx.beginPath(); ctx.roundRect(bx - bw / 2, by - 0.78 * u, bw, bh, 0.05 * u); ctx.fill();
  ctx.strokeStyle = C.woodDark; ctx.lineWidth = 0.025 * u; ctx.stroke();
  ctx.fillStyle = '#FFF4E0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, bx, by - 0.78 * u + bh / 2 + 1);
  ctx.textBaseline = 'alphabetic';
}

/* objeto genérico con animación "pop" */
function drawObj(o, t, R, seed) {
  const sIn = o.tin == null ? 1 : easeOutBack(prog(t, o.tin, o.tin + 0.32), 2.0);
  const sOut = o.tout == null ? 1 : 1 - easeInCubic(prog(t, o.tout, o.tout + 0.28));
  const s = sIn * sOut; if (s <= 0.01) return;
  const z = o.z ?? groundZ(o.x, o.y, R, seed);
  const [bx, by] = P(o.x, o.y, z);
  ctx.save(); ctx.translate(bx, by); ctx.scale(s, s); ctx.translate(-bx, -by);
  if (o.alpha != null) ctx.globalAlpha = o.alpha;
  switch (o.type) {
    case 'house': drawHouse(o, z); break;
    case 'shop': drawShop(o, z); break;
    case 'tower': drawTower(o, z); break;
    case 'tree': drawTree(o, z); break;
    case 'palm': drawPalm(o, z, t); break;
    case 'pitch': drawPitch(o, z); break;
  }
  ctx.restore();
}

/* ---------- UI ---------- */
function txt(s, x, y, fnt, fill, o = {}) {
  ctx.font = fnt; ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.base || 'alphabetic';
  if (o.stroke) { ctx.lineJoin = 'round'; ctx.miterLimit = 2; ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 10; ctx.strokeText(s, x, y); }
  ctx.fillStyle = fill; ctx.fillText(s, x, y);
}
function fitPx(s, fam, px, maxW) { ctx.font = F(fam, px); const w = ctx.measureText(s).width; return w > maxW ? Math.floor(px * maxW / w) : px; }
function rrect(x, y, w, h, r, fill, stroke, lw) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 2; ctx.stroke(); } }
function withShadow(fn, blur = 30, oy = 14, col = 'rgba(6,25,40,0.38)') { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = blur; ctx.shadowOffsetY = oy; fn(); ctx.restore(); }

function paperCard(x, y, w, h, r = 28) {
  withShadow(() => rrect(x, y, w, h, r, C.paper));
  rrect(x + 12, y + 12, w - 24, h - 24, r - 10, null, C.paperEdge, 3);
}

/* rótulo inferior con efecto rotulador amarillo: *palabras* resaltadas */
function caption(s, t, t0, t1, o = {}) {
  if (t < t0 || t > t1) return;
  const pin = easeOutBack(prog(t, t0, t0 + 0.24), 2.4), pout = prog(t, t1 - 0.12, t1);
  const px = o.px || 60, lh = px * 1.24, maxW = o.maxW || 800, cx = o.x || 520, cy = o.y || 1405;
  ctx.font = F('IDBlack', px);
  const toks = []; let hl = false;
  for (const part of s.split(/(\*)/)) { if (part === '*') { hl = !hl; continue; } for (const w of part.split(/(\s+)/)) { if (w === '') continue; toks.push({ w, hl, sp: /^\s+$/.test(w) }); } }
  const lines = [[]]; let cur = 0;
  for (const tk of toks) {
    tk.width = ctx.measureText(tk.w).width;
    if (!tk.sp && cur + tk.width > maxW && lines[lines.length - 1].length) { lines.push([]); cur = 0; }
    if (tk.sp && lines[lines.length - 1].length === 0) continue;
    lines[lines.length - 1].push(tk); cur += tk.width;
  }
  for (const L of lines) while (L.length && L[L.length - 1].sp) L.pop();
  const lw = lines.map(L => L.reduce((a, b) => a + b.width, 0));
  const bw = Math.max(...lw) + 64, bh = lines.length * lh + 40;
  ctx.save(); ctx.globalAlpha = 1 - pout;
  const s0 = lerp(0.82, 1, pin); ctx.translate(cx, cy); ctx.scale(s0, s0); ctx.rotate(-0.012); ctx.translate(-cx, -cy);
  withShadow(() => rrect(cx - bw / 2, cy - bh / 2, bw, bh, 26, '#FFFFFF'), 24, 10);
  const hp = easeOutCubic(prog(t, t0 + 0.12, t0 + 0.42));
  lines.forEach((L, li) => {
    let x = cx - lw[li] / 2; const y = cy - bh / 2 + 20 + lh * li + lh * 0.78;
    // resaltado
    let i = 0;
    while (i < L.length) {
      if (L[i].hl && !L[i].sp) {
        let j = i, wsum = 0; while (j < L.length && L[j].hl) { wsum += L[j].width; j++; }
        while (j - 1 > i && L[j - 1].sp) { wsum -= L[j - 1].width; j--; }
        let xs = x; for (let k = 0; k < i; k++) { } // x se calcula abajo
        L[i]._hlw = wsum; i = j;
      } else i++;
    }
    for (const tk of L) {
      if (tk._hlw) { ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.roundRect(x - 8, y - px * 0.62, (tk._hlw + 16) * hp, px * 0.74, 10); ctx.fill(); }
      ctx.fillStyle = C.navy; ctx.textAlign = 'left'; ctx.fillText(tk.w, x, y);
      x += tk.width;
    }
  });
  ctx.restore();
}

/* sello de tinta con textura */
const _stampCache = {};
function stampCanvas(text, color, fs) {
  const key = text + color + fs; if (_stampCache[key]) return _stampCache[key];
  const c = document.createElement('canvas'); const g = c.getContext('2d');
  g.font = F('IDBlack', fs); const tw = g.measureText(text).width;
  const pad = fs * 0.45, w = Math.ceil(tw + pad * 2 + fs * 0.3), h = Math.ceil(fs * 1.55);
  c.width = w + 20; c.height = h + 20;
  g.translate(10, 10);
  g.strokeStyle = color; g.lineWidth = fs * 0.1; g.beginPath(); g.roundRect(fs * 0.05, fs * 0.05, w - fs * 0.1, h - fs * 0.1, fs * 0.18); g.stroke();
  g.lineWidth = fs * 0.035; g.beginPath(); g.roundRect(fs * 0.2, fs * 0.2, w - fs * 0.4, h - fs * 0.4, fs * 0.1); g.stroke();
  g.fillStyle = color; g.font = F('IDBlack', fs); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w / 2, h / 2 + fs * 0.04);
  g.globalCompositeOperation = 'destination-out';
  const r = mulberry32(text.length * 97 + fs);
  for (let i = 0; i < 260; i++) { g.globalAlpha = 0.4 + r() * 0.6; g.beginPath(); g.arc(r() * w, r() * h, (0.4 + r() * 1.8) * fs / 60, 0, 7); g.fill(); }
  for (let i = 0; i < 6; i++) { g.globalAlpha = 0.25; g.lineWidth = 1 + r() * 2; g.beginPath(); const y0 = r() * h; g.moveTo(0, y0); g.lineTo(w, y0 + (r() - .5) * 20); g.stroke(); }
  _stampCache[key] = c; return c;
}
function stamp(cx, cy, text, color, t, t0, o = {}) {
  if (t < t0) return;
  const fs = o.fs || 72, rot = o.rot ?? -0.2;
  const p = prog(t, t0, t0 + 0.15);
  const s = p < 1 ? lerp(2.4, 1, easeInQuad(p)) : 1 + 0.05 * Math.exp(-(t - t0 - 0.15) * 30) * Math.sin((t - t0) * 60);
  const a = clamp(p * 2) * (o.alpha ?? 0.92) * (o.tout ? 1 - prog(t, o.tout, o.tout + 0.25) : 1);
  if (a <= 0) return;
  const c = stampCanvas(text, color, fs);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(s, s);
  ctx.drawImage(c, -c.width / 2, -c.height / 2); ctx.restore();
}

/* etiqueta flotante sobre un objeto */
function tag(sx, sy, text, o = {}) {
  const px = o.px || 34; ctx.font = F('IDBlack', px); const tw = ctx.measureText(text).width;
  const w = tw + 36, h = px * 1.45, bob = Math.sin((o.t || 0) * 3) * 6;
  const x = sx - w / 2, y = sy - h - 22 + bob;
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1;
  const sc = o.s ?? 1; ctx.translate(sx, sy); ctx.scale(sc, sc); ctx.translate(-sx, -sy);
  withShadow(() => { rrect(x, y, w, h, h / 2, o.bg || C.yellow); ctx.beginPath(); ctx.moveTo(sx - 14, y + h - 1); ctx.lineTo(sx + 14, y + h - 1); ctx.lineTo(sx, y + h + 16); ctx.closePath(); ctx.fill(); }, 14, 6);
  txt(text, sx, y + h / 2 + px * 0.36, F('IDBlack', px), o.fg || C.navy);
  ctx.restore();
}

/* chip superior */
function chip(x, y, label, o = {}) {
  const px = o.px || 40; ctx.font = F(o.fam || 'IDBlack', px); const tw = ctx.measureText(label).width;
  const w = tw + 44, h = px * 1.55; const xx = o.align === 'right' ? x - w : (o.align === 'center' ? x - w / 2 : x);
  withShadow(() => rrect(xx, y, w, h, 18, o.bg || C.yellow), 16, 6);
  txt(label, xx + w / 2, y + h / 2 + px * 0.36, F(o.fam || 'IDBlack', px), o.fg || C.navy);
  return w;
}

/* iconos simples */
function icon(kind, x, y, s, col = C.navy) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (kind === 'house') { ctx.beginPath(); ctx.moveTo(-26, -2); ctx.lineTo(0, -26); ctx.lineTo(26, -2); ctx.closePath(); ctx.fill(); ctx.fillRect(-18, -4, 36, 28); ctx.fillStyle = C.paper; ctx.fillRect(-6, 8, 12, 16); }
  if (kind === 'mug') { ctx.beginPath(); ctx.roundRect(-20, -8, 30, 32, 5); ctx.fill(); for (const [a, b, r] of [[-14, -12, 8], [-4, -16, 9], [6, -12, 8]]) { ctx.beginPath(); ctx.arc(a, b, r, 0, 7); ctx.fill(); } ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(12, 6, 9, -1.5, 1.5); ctx.stroke(); ctx.fillStyle = C.paper; ctx.fillRect(-13, 0, 4, 18); ctx.fillRect(-3, 0, 4, 18); }
  if (kind === 'shop') { ctx.fillRect(-24, -4, 48, 28); for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? C.paper : col; ctx.fillRect(-26 + i * 13, -20, 13, 14); } ctx.strokeRect(-26, -20, 52, 14); ctx.fillStyle = C.paper; ctx.fillRect(-6, 8, 12, 16); }
  if (kind === 'boat') { ctx.beginPath(); ctx.moveTo(-28, 6); ctx.lineTo(28, 6); ctx.lineTo(18, 22); ctx.lineTo(-18, 22); ctx.closePath(); ctx.fill(); ctx.fillRect(-2, -26, 4, 32); ctx.beginPath(); ctx.moveTo(4, -24); ctx.lineTo(24, 2); ctx.lineTo(4, 2); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}

/* gaviota */
function gull(x, y, t, s = 1) {
  const f = Math.sin(t * 9) * 0.5;
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6 * s; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - 34 * s, y - 10 * s - f * 18 * s); ctx.quadraticCurveTo(x - 14 * s, y - 16 * s - f * 10 * s, x, y); ctx.quadraticCurveTo(x + 14 * s, y - 16 * s - f * 10 * s, x + 34 * s, y - 10 * s - f * 18 * s); ctx.stroke();
  ctx.fillStyle = 'rgba(10,40,60,0.18)'; ctx.beginPath(); ctx.ellipse(x + 30 * s, y + 160 * s, 26 * s, 6 * s, 0, 0, 7); ctx.fill();
}

/* ---- dibujos del Día 3 (iguales que en los vídeos) ---- */
function drawTreeHouse(o, z) {
  const x = o.x, y = o.y; shadowAt(x, y, z, 0.45, 0.22);
  box(x - 0.08, y - 0.08, 0.16, 0.16, 0.62, z, C.woodDark);
  for (const [dx, dy] of [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]]) box(x + dx - 0.03, y + dy - 0.03, 0.06, 0.06, 0.6, z, C.wood);
  box(x - 0.36, y - 0.36, 0.72, 0.72, 0.06, z + 0.6, C.wood, { tcol: '#C98C57' });
  const [lx, ly] = P(x, y, z + 0.95); const u = U();
  ctx.fillStyle = '#3E9A4F'; for (const [dx, dy, r] of [[-0.35, 0.05, 0.3], [0.35, 0.0, 0.3], [0, -0.25, 0.36]]) { ctx.beginPath(); ctx.arc(lx + dx * u, ly + dy * u - 0.25 * u, r * u, 0, 7); ctx.fill(); }
  drawHouse({ x, y, w: 0.46, d: 0.42, h: 0.3, hr: 0.22, roof: '#4FA36B', wall: '#E8C9A0' }, z + 0.66);
  // escalera
  const a = P(x - 0.1, y + 0.45, z), b = P(x - 0.1, y + 0.36, z + 0.62); ctx.strokeStyle = C.woodDark; ctx.lineWidth = Math.max(2, u * 0.025);
  for (const off of [-0.06, 0.06]) { ctx.beginPath(); ctx.moveTo(a[0] + off * u, a[1]); ctx.lineTo(b[0] + off * u, b[1]); ctx.stroke(); }
  for (let k = 1; k < 6; k++) { const q = k / 6; ctx.beginPath(); ctx.moveTo(lerp(a[0], b[0], q) - 0.06 * u, lerp(a[1], b[1], q)); ctx.lineTo(lerp(a[0], b[0], q) + 0.06 * u, lerp(a[1], b[1], q)); ctx.stroke(); }
  ctx.fillStyle = '#58B865'; ctx.beginPath(); ctx.arc(lx + 0.42 * u, ly - 0.05 * u, 0.2 * u, 0, 7); ctx.fill();
}
function signBoard(x, y, z, kind) {
  const [bx, by] = P(x, y, z); const u = U();
  ctx.fillStyle = C.woodDark; ctx.fillRect(bx - 0.015 * u, by - 0.18 * u, 0.03 * u, 0.18 * u);
  rrect(bx - 0.16 * u, by - 0.44 * u, 0.32 * u, 0.28 * u, 0.06 * u, '#FFFFFF', C.navy, Math.max(1.5, u * 0.02));
  if (kind === 'vet') { ctx.fillStyle = C.green; const s = 0.07 * u; ctx.fillRect(bx - s * 0.35, by - 0.3 * u - s, s * 0.7, s * 2); ctx.fillRect(bx - s, by - 0.3 * u - s * 0.35, s * 2, s * 0.7); }
  else icon('mug', bx, by - 0.29 * u, 0.0042 * u, C.navy);
}
function drawBar(o, z) { drawShop({ x: o.x, y: o.y, w: 0.66, d: 0.56, h: 0.44, col: o.col }, z); signBoard(o.x + 0.05, o.y - 0.05, z + 0.44, 'bar'); }
function drawVet(o, z) { drawShop({ x: o.x, y: o.y, w: 0.52, d: 0.46, h: 0.38, col: C.green, wall: '#FFFFFF' }, z); signBoard(o.x, o.y - 0.05, z + 0.38, 'vet'); }
function drawCat(x, y, z, t, s = 1, col = '#F29F4B') {
  const [bx, by] = P(x, y, z); const u = U() * s; const bob = Math.sin(t * 3 + x) * 0.01 * u;
  ctx.fillStyle = 'rgba(20,40,40,0.2)'; ctx.beginPath(); ctx.ellipse(bx, by, 0.1 * u, 0.04 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(bx, by - 0.07 * u, 0.09 * u, 0.06 * u, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(bx + 0.07 * u, by - 0.14 * u + bob, 0.05 * u, 0, 7); ctx.fill();
  for (const dx of [0.04, 0.1]) { ctx.beginPath(); ctx.moveTo(bx + dx * u - 0.02 * u, by - 0.17 * u + bob); ctx.lineTo(bx + dx * u, by - 0.22 * u + bob); ctx.lineTo(bx + dx * u + 0.02 * u, by - 0.17 * u + bob); ctx.fill(); }
  ctx.strokeStyle = col; ctx.lineWidth = 0.02 * u; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(bx - 0.08 * u, by - 0.08 * u); ctx.quadraticCurveTo(bx - 0.16 * u, by - 0.12 * u + Math.sin(t * 4 + x) * 0.03 * u, bx - 0.13 * u, by - 0.2 * u); ctx.stroke();
  ctx.fillStyle = C.navy; for (const dx of [0.055, 0.085]) { ctx.beginPath(); ctx.arc(bx + dx * u, by - 0.145 * u + bob, 0.007 * u, 0, 7); ctx.fill(); }
}
function drawCobaya(x, y, z, t, s = 1) {
  const [bx, by] = P(x, y, z); const u = U() * s; const w = Math.sin(t * 6) * 0.004 * u;
  ctx.fillStyle = 'rgba(20,40,40,0.2)'; ctx.beginPath(); ctx.ellipse(bx, by, 0.1 * u, 0.035 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#B8763A'; ctx.beginPath(); ctx.ellipse(bx, by - 0.06 * u, 0.1 * u, 0.065 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.ellipse(bx + 0.04 * u, by - 0.06 * u, 0.06 * u, 0.055 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#B8763A'; ctx.beginPath(); ctx.arc(bx + 0.08 * u, by - 0.09 * u + w, 0.045 * u, 0, 7); ctx.fill();
  ctx.fillStyle = '#E8A9A0'; ctx.beginPath(); ctx.arc(bx + 0.06 * u, by - 0.13 * u + w, 0.018 * u, 0, 7); ctx.fill();
  ctx.fillStyle = C.navy; ctx.beginPath(); ctx.arc(bx + 0.1 * u, by - 0.095 * u + w, 0.008 * u, 0, 7); ctx.fill();
}
function drawFlagPeru(x, y, z, t) {
  const [bx, by] = P(x, y, z); const u = U();
  ctx.fillStyle = '#DDDDDD'; ctx.fillRect(bx - 0.012 * u, by - 0.75 * u, 0.024 * u, 0.75 * u);
  const fw = 0.36 * u, fh = 0.22 * u, x0 = bx + 0.012 * u, y0 = by - 0.74 * u;
  for (let i = 0; i < 3; i++) { ctx.fillStyle = i === 1 ? '#FFFFFF' : '#D91023';
    ctx.beginPath(); const xa = x0 + fw * i / 3, xb = x0 + fw * (i + 1) / 3; const wa = Math.sin(t * 4 + i) * 0.015 * u, wb = Math.sin(t * 4 + i + 1) * 0.015 * u;
    ctx.moveTo(xa, y0 + wa); ctx.lineTo(xb, y0 + wb); ctx.lineTo(xb, y0 + fh + wb); ctx.lineTo(xa, y0 + fh + wa); ctx.closePath(); ctx.fill(); }
}
