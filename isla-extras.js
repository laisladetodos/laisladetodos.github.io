'use strict';
/* Dibujos extra compartidos por los vídeos (engine) y la isla en directo (web: isla-extras.js).
   Edificio: drawCustom(o, z, t)  ·  detalles: drawDetails(o, z, t)
   o = { x, y, forma, color, pared, puerta, det: [...] , ang (puerto) } */


/* ===== edificios orientados: face = 'S' (+y, cara izquierda visible), 'E' (+x, derecha visible), 'N'/'W' (de espaldas) ===== */
function roofAlongY(x, y, w, d, z, h, hr, roof, wall) {
  const ov = 0.03, xa = x - ov, xb = x + w + ov, ya = y, yb = y + d, zr = z + h, zt = z + h + hr, xm = x + w / 2, Y = y + d;
  fillPolyS([P(xa, ya, zr), P(xa, yb, zr), P(xm, yb, zt), P(xm, ya, zt)], shade(roof, -0.12));
  fillPolyS([P(x, Y, zr), P(x + w, Y, zr), P(xm, Y, zt)], wall);
  fillPolyS([P(xb, ya, zr), P(xb, yb, zr), P(xm, yb, zt), P(xm, ya, zt)], roof);
  const r1 = P(xm, ya, zt), r2 = P(xm, yb, zt); ctx.strokeStyle = shade(roof, 0.35); ctx.lineWidth = Math.max(1.5, U() * 0.025); ctx.beginPath(); ctx.moveTo(r1[0], r1[1]); ctx.lineTo(r2[0], r2[1]); ctx.stroke();
}
function roofAlongX(x, y, w, d, z, h, hr, roof, wall) {
  const ov = 0.03, xa = x, xb = x + w, ya = y - ov, yb = y + d + ov, zr = z + h, zt = z + h + hr, ym = y + d / 2, X = x + w;
  fillPolyS([P(xa, ya, zr), P(xb, ya, zr), P(xb, ym, zt), P(xa, ym, zt)], shade(roof, -0.12));
  fillPolyS([P(X, y, zr), P(X, y + d, zr), P(X, ym, zt)], shade(wall, -0.18));
  fillPolyS([P(xa, yb, zr), P(xb, yb, zr), P(xb, ym, zt), P(xa, ym, zt)], roof);
  const r1 = P(xa, ym, zt), r2 = P(xb, ym, zt); ctx.strokeStyle = shade(roof, 0.35); ctx.lineWidth = Math.max(1.5, U() * 0.025); ctx.beginPath(); ctx.moveTo(r1[0], r1[1]); ctx.lineTo(r2[0], r2[1]); ctx.stroke();
}
function drawHouseF(o, z, face) {
  face = face || 'S';
  const rot = face === 'E' || face === 'W';
  const w0 = o.w ?? 0.62, d0 = o.d ?? 0.55, w = rot ? d0 : w0, d = rot ? w0 : d0, h = o.h ?? 0.42, hr = o.hr ?? 0.3;
  const x = o.x - w / 2, y = o.y - d / 2, roof = o.roof || C.coral, wall = o.wall || C.wall, door = o.puerta || C.woodDark;
  box(x, y, w, d, h, z, wall, { noTop: true });
  const Y = y + d, X = x + w, gl = C.glass, gl2 = shade(C.glass, -0.2);
  if (face === 'S') {
    fillPoly(faceL(x + w * 0.38, x + w * 0.62, z, z + h * 0.62, Y), door);
    fillPoly(faceL(x + w * 0.1, x + w * 0.28, z + h * 0.45, z + h * 0.78, Y), gl); fillPoly(faceL(x + w * 0.72, x + w * 0.9, z + h * 0.45, z + h * 0.78, Y), gl);
    fillPoly(faceR(y + d * 0.3, y + d * 0.7, z + h * 0.45, z + h * 0.78, X), gl2);
  } else if (face === 'E') {
    fillPoly(faceR(y + d * 0.38, y + d * 0.62, z, z + h * 0.62, X), shade(door, -0.15));
    fillPoly(faceR(y + d * 0.1, y + d * 0.28, z + h * 0.45, z + h * 0.78, X), gl2); fillPoly(faceR(y + d * 0.72, y + d * 0.9, z + h * 0.45, z + h * 0.78, X), gl2);
    fillPoly(faceL(x + w * 0.3, x + w * 0.7, z + h * 0.45, z + h * 0.78, Y), gl);
  } else {   // de espaldas a nosotros: solo ventanas traseras pequeñas
    if (rot) { fillPoly(faceL(x + w * 0.35, x + w * 0.65, z + h * 0.45, z + h * 0.72, Y), gl); fillPoly(faceR(y + d * 0.15, y + d * 0.35, z + h * 0.45, z + h * 0.72, X), gl2); fillPoly(faceR(y + d * 0.65, y + d * 0.85, z + h * 0.45, z + h * 0.72, X), gl2); }
    else { fillPoly(faceL(x + w * 0.15, x + w * 0.35, z + h * 0.45, z + h * 0.72, Y), gl); fillPoly(faceL(x + w * 0.65, x + w * 0.85, z + h * 0.45, z + h * 0.72, Y), gl); fillPoly(faceR(y + d * 0.35, y + d * 0.65, z + h * 0.45, z + h * 0.72, X), gl2); }
  }
  if (rot) roofAlongY(x, y, w, d, z, h, hr, roof, wall); else roofAlongX(x, y, w, d, z, h, hr, roof, wall);
}
function drawShopF(o, z, face) {
  face = face || 'S';
  const rot = face === 'E' || face === 'W';
  const w0 = o.w ?? 0.75, d0 = o.d ?? 0.6, w = rot ? d0 : w0, d = rot ? w0 : d0, h = o.h ?? 0.48;
  const x = o.x - w / 2, y = o.y - d / 2, col = o.col || C.coral, Y = y + d, X = x + w;
  box(x, y, w, d, h, z, o.wall || '#FDEBD3', { tcol: shade(col, 0.55) });
  const n = 5;
  if (face === 'S') {
    fillPoly(faceL(x + w * 0.1, x + w * 0.9, z, z + h * 0.55, Y), C.glass); fillPoly(faceL(x + w * 0.42, x + w * 0.58, z, z + h * 0.55, Y), shade(C.glass, -0.25));
    for (let i = 0; i < n; i++) { const xa = x + w * i / n, xb = x + w * (i + 1) / n; fillPolyS([P(xa, Y, z + h * 0.78), P(xb, Y, z + h * 0.78), P(xb, Y + 0.16, z + h * 0.6), P(xa, Y + 0.16, z + h * 0.6)], i % 2 ? '#FFFFFF' : col); }
  } else if (face === 'E') {
    fillPoly(faceR(y + d * 0.1, y + d * 0.9, z, z + h * 0.55, X), shade(C.glass, -0.15)); fillPoly(faceR(y + d * 0.42, y + d * 0.58, z, z + h * 0.55, X), shade(C.glass, -0.35));
    for (let i = 0; i < n; i++) { const ya = y + d * i / n, yb = y + d * (i + 1) / n; fillPolyS([P(X, ya, z + h * 0.78), P(X, yb, z + h * 0.78), P(X + 0.16, yb, z + h * 0.6), P(X + 0.16, ya, z + h * 0.6)], i % 2 ? '#EDEDED' : shade(col, -0.12)); }
  } else if (!rot) {   // vista trasera: ventana y toldo de la terraza de atrás
    fillPoly(faceL(x + w * 0.2, x + w * 0.8, z + h * 0.18, z + h * 0.55, Y), C.glass);
    for (let i = 0; i < n; i++) { const xa = x + w * (0.12 + 0.76 * i / n), xb = x + w * (0.12 + 0.76 * (i + 1) / n); fillPolyS([P(xa, Y, z + h * 0.72), P(xb, Y, z + h * 0.72), P(xb, Y + 0.12, z + h * 0.58), P(xa, Y + 0.12, z + h * 0.58)], i % 2 ? '#FFFFFF' : col); }
  } else {
    fillPoly(faceR(y + d * 0.2, y + d * 0.8, z + h * 0.18, z + h * 0.55, X), shade(C.glass, -0.15));
    for (let i = 0; i < n; i++) { const ya = y + d * (0.12 + 0.76 * i / n), yb = y + d * (0.12 + 0.76 * (i + 1) / n); fillPolyS([P(X, ya, z + h * 0.72), P(X, yb, z + h * 0.72), P(X + 0.12, yb, z + h * 0.58), P(X + 0.12, ya, z + h * 0.58)], i % 2 ? '#EDEDED' : shade(col, -0.12)); }
  }
}

function drawTreeHouse(o, z) {
  const x = o.x, y = o.y; shadowAt(x, y, z, 0.45, 0.22);
  box(x - 0.08, y - 0.08, 0.16, 0.16, 0.62, z, C.woodDark);
  for (const [dx, dy] of [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]]) box(x + dx - 0.03, y + dy - 0.03, 0.06, 0.06, 0.6, z, C.wood);
  box(x - 0.36, y - 0.36, 0.72, 0.72, 0.06, z + 0.6, C.wood, { tcol: '#C98C57' });
  const [lx, ly] = P(x, y, z + 0.95); const u = U();
  ctx.fillStyle = '#3E9A4F'; for (const [dx, dy, r] of [[-0.35, 0.05, 0.3], [0.35, 0.0, 0.3], [0, -0.25, 0.36]]) { ctx.beginPath(); ctx.arc(lx + dx * u, ly + dy * u - 0.25 * u, r * u, 0, 7); ctx.fill(); }
  drawHouse({ x, y, w: 0.46, d: 0.42, h: 0.3, hr: 0.22, roof: '#C2502E', wall: '#E8C9A0' }, z + 0.66);
  const a = P(x - 0.1, y + 0.45, z), b = P(x - 0.1, y + 0.36, z + 0.62); ctx.strokeStyle = C.woodDark; ctx.lineWidth = Math.max(2, u * 0.025);
  for (const off of [-0.06, 0.06]) { ctx.beginPath(); ctx.moveTo(a[0] + off * u, a[1]); ctx.lineTo(b[0] + off * u, b[1]); ctx.stroke(); }
  for (let k = 1; k < 6; k++) { const q = k / 6; ctx.beginPath(); ctx.moveTo(lerp(a[0], b[0], q) - 0.06 * u, lerp(a[1], b[1], q)); ctx.lineTo(lerp(a[0], b[0], q) + 0.06 * u, lerp(a[1], b[1], q)); ctx.stroke(); }
}
// tamaño de los carteles: 1 en la web (se leen con zoom o tocando el edificio); los vídeos (desde el Día 8) usan
// SIGN_SCALE = 1.6 para que se lean en el móvil en los planos cercanos (en los lejanos siguen pequeños y no se amontonan)
var SIGN_SCALE = 1;
/* ---- Día 8 (10 nov): bomberos, iglesia, parque, piscina pública y escenario (todo dentro de su parcela, ~0,85) ---- */
function sq(x0, y0, x1, y1, zz, col) { fillPoly([P(x0, y0, zz), P(x1, y0, zz), P(x1, y1, zz), P(x0, y1, zz)], col); }
function drawBomberos(o, z) {
  shopWithSign(o, z, '#D7263D', 'BOMBEROS', '#FFFFFF', '#F6E3E3');
  const [x, y] = enFrente(o, 0.42 * ((o.face === 'N' || o.face === 'W') ? -1 : 1), 0.12), rot = o.face === 'E' || o.face === 'W', w = rot ? 0.17 : 0.34, d = rot ? 0.34 : 0.17;
  shadowAt(x, y, z, 0.2, 0.1);
  box(x - w / 2, y - d / 2, w, d, 0.13, z + 0.02, '#D7263D', { tcol: '#E9535F' });
  box(x - w / 2 + (rot ? 0.02 : 0.03), y - d / 2 + (rot ? 0.03 : 0.02), w - (rot ? 0.04 : 0.06), d - (rot ? 0.06 : 0.04), 0.03, z + 0.15, '#EDEDED');
  for (const q of [0.25, 0.75]) { const [wx, wy] = P(x - w / 2 + w * (rot ? 0.5 : q), y - d / 2 + d * (rot ? q : 0.5), z); ctx.fillStyle = '#222'; ctx.beginPath(); ctx.ellipse(wx, wy, U() * 0.035, U() * 0.02, 0, 0, 7); ctx.fill(); }
}
function drawIglesia(o, z) {
  shadowAt(o.x, o.y, z, 0.42, 0.2);
  const [tx, ty] = enFrente(o, -0.08, -0.26), torre = () => { box(tx - 0.09, ty - 0.09, 0.18, 0.18, 0.92, z, '#FBF7EE', { tcol: '#EFE7D6' });
    const [cx, cy] = P(tx, ty, z + 0.92), u = U(); ctx.fillStyle = '#B5452E'; ctx.beginPath(); ctx.moveTo(cx - 0.13 * u, cy + 0.02 * u); ctx.lineTo(cx, cy - 0.2 * u); ctx.lineTo(cx + 0.13 * u, cy + 0.02 * u); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#6B4A2B'; ctx.fillRect(cx - 0.008 * u, cy - 0.34 * u, 0.016 * u, 0.15 * u); ctx.fillRect(cx - 0.045 * u, cy - 0.3 * u, 0.09 * u, 0.016 * u);
    const [bx, by] = P(tx, ty + 0.09, z + 0.68); ctx.fillStyle = '#E0B13A'; ctx.beginPath(); ctx.arc(bx, by, 0.035 * u, Math.PI, 2 * Math.PI); ctx.fill(); };
  const delante = tx + ty > o.x + o.y;
  if (!delante) torre();
  drawHouseF({ x: o.x, y: o.y, roof: '#B5452E', h: 0.46, wall: '#FBF7EE' }, z, o.face);
  if (delante) torre();
}
function drawParque(o, z, t) {
  const g = 0.42; sq(o.x - g, o.y - g, o.x + g, o.y + g, z + 0.006, '#7CC562');
  sq(o.x - 0.06, o.y - g, o.x + 0.06, o.y + g, z + 0.008, '#E2D9C6'); sq(o.x - g, o.y - 0.06, o.x + g, o.y + 0.06, z + 0.008, '#E2D9C6');
  const [fx, fy] = P(o.x, o.y, z + 0.01), u = U(); ctx.fillStyle = '#C9CFD6'; ctx.beginPath(); ctx.ellipse(fx, fy, 0.16 * u, 0.08 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#4FC3E8'; ctx.beginPath(); ctx.ellipse(fx, fy, 0.12 * u, 0.06 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.ellipse(fx, fy - 0.06 * u - Math.abs(Math.sin(t * 5)) * 0.02 * u, 0.02 * u, 0.06 * u, 0, 0, 7); ctx.fill();
  for (const [dx, dy] of [[-0.24, -0.24], [0.24, 0.24]]) box(o.x + dx - 0.12, o.y + dy - 0.03, 0.24, 0.06, 0.06, z, '#B07443', { tcol: '#C98C57' });
  for (const [dx, dy, s] of [[-0.3, -0.05, 0.55], [0.26, -0.26, 0.75], [-0.26, 0.24, 0.7], [0.3, 0.06, 0.6]]) drawTree({ x: o.x + dx, y: o.y + dy, s, col: '#3E9A4F' }, z);
}
function drawPiscinaPublica(o, z, t) {
  const g = 0.42; sq(o.x - g, o.y - g, o.x + g, o.y + g, z + 0.006, '#F4EFE6');
  sq(o.x - 0.3, o.y - 0.3, o.x + 0.3, o.y + 0.22, z + 0.008, '#3FA9D6'); sq(o.x - 0.27, o.y - 0.27, o.x + 0.27, o.y + 0.19, z + 0.01, '#4FC3E8');
  for (let i = 1; i < 4; i++) { const a = P(o.x - 0.27 + i * 0.135, o.y - 0.27, z + 0.012), b = P(o.x - 0.27 + i * 0.135, o.y + 0.19, z + 0.012); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = Math.max(1, U() * 0.01); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  const u = U(); for (const [dx, dy, col] of [[-0.3, 0.34, '#F2614C'], [0.05, 0.34, '#FFC83D'], [0.32, 0.34, '#2E8FA8']]) { const [bx, by] = P(o.x + dx, o.y + dy, z); ctx.fillStyle = '#9A9A9A'; ctx.fillRect(bx - 0.006 * u, by - 0.3 * u, 0.012 * u, 0.3 * u);
    ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(bx, by - 0.3 * u, 0.13 * u, 0.06 * u, 0, Math.PI, 2 * Math.PI); ctx.fill(); ctx.fillRect(bx - 0.13 * u, by - 0.3 * u, 0.26 * u, 0.012 * u); }
}
function drawEscenario(o, z, t) {
  const back = (o.face === 'N' || o.face === 'W'), [f, sd] = FRENTE[o.face || 'S'], c = (a, b) => [o.x + f[0] * a + sd[0] * b, o.y + f[1] * a + sd[1] * b];
  shadowAt(o.x, o.y, z, 0.42, 0.2);
  box(o.x - 0.34, o.y - 0.3, 0.68, 0.6, 0.12, z, '#7C4A26', { tcol: '#B07443' });
  const pared = () => { const [ax, ay] = c(-0.27, -0.32), [bx, by] = c(-0.27, 0.32); fillPoly([P(ax, ay, z + 0.12), P(bx, by, z + 0.12), P(bx, by, z + 0.62), P(ax, ay, z + 0.62)], '#7A1F2B'); fillPoly([P(ax, ay, z + 0.56), P(bx, by, z + 0.56), P(bx, by, z + 0.62), P(ax, ay, z + 0.62)], '#E0B13A'); };
  const focos = () => { for (const b of [-0.3, 0.3]) { const [px, py] = c(0.2, b), [sx, sy] = P(px, py, z + 0.12), u = U(); ctx.fillStyle = '#333'; ctx.fillRect(sx - 0.008 * u, sy - 0.42 * u, 0.016 * u, 0.42 * u);
      ctx.fillStyle = Math.sin(t * 6 + b * 9) > 0 ? '#FFE45C' : '#FF8FB1'; ctx.beginPath(); ctx.arc(sx, sy - 0.44 * u, 0.035 * u, 0, 7); ctx.fill(); } };
  if (!back) { pared(); focos(); } else { focos(); pared(); }
}
function signBoard(x, y, z, kind, label) {
  const [bx, by] = P(x, y, z), k = SIGN_SCALE;
  if (k !== 1) { ctx.save(); ctx.translate(bx, by); ctx.scale(k, k); ctx.translate(-bx, -by); signBoard0(bx, by, kind, label); ctx.restore(); return; }
  signBoard0(bx, by, kind, label);
}
function signBoard0(bx, by, kind, label) {
  const u = U();
  ctx.fillStyle = C.woodDark; ctx.fillRect(bx - 0.015 * u, by - 0.18 * u, 0.03 * u, 0.18 * u);
  if (label) {
    ctx.font = F('IDBlack', Math.max(6, 0.11 * u)); const tw = ctx.measureText(label).width + 0.1 * u;
    rrect(bx - tw / 2, by - 0.36 * u, tw, 0.2 * u, 0.05 * u, kind || '#FFFFFF', C.navy, Math.max(1.2, u * 0.015));
    txt(label, bx, by - 0.22 * u, F('IDBlack', Math.max(6, 0.11 * u)), C.navy); return;
  }
  rrect(bx - 0.16 * u, by - 0.44 * u, 0.32 * u, 0.28 * u, 0.06 * u, '#FFFFFF', C.navy, Math.max(1.5, u * 0.02));
  if (kind === 'vet') { ctx.fillStyle = C.green; const s = 0.07 * u; ctx.fillRect(bx - s * 0.35, by - 0.3 * u - s, s * 0.7, s * 2); ctx.fillRect(bx - s, by - 0.3 * u - s * 0.35, s * 2, s * 0.7); }
  else icon('mug', bx, by - 0.29 * u, 0.0042 * u, C.navy);
}
function drawBar(o, z) { drawShopF({ x: o.x, y: o.y, w: 0.66, d: 0.56, h: 0.44, col: o.col || o.color }, z, o.face); signBoard(o.x + 0.05, o.y - 0.05, z + 0.44, 'bar'); }
function drawVet(o, z) { drawShopF({ x: o.x, y: o.y, w: 0.52, d: 0.46, h: 0.38, col: C.green, wall: '#FFFFFF' }, z, o.face); signBoard(o.x, o.y - 0.05, z + 0.38, 'vet'); }
function shopWithSign(o, z, col, label, signCol, wall) { drawShopF({ x: o.x, y: o.y, w: 0.6, d: 0.52, h: 0.42, col, wall }, z, o.face); signBoard(o.x + 0.02, o.y - 0.05, z + 0.42, signCol, label); }
function drawCave(o, z) {
  const [bx, by] = P(o.x, o.y, z); const u = U();
  shadowAt(o.x, o.y, z, 0.5, 0.25);
  ctx.fillStyle = '#8C8A86'; ctx.beginPath(); ctx.ellipse(bx, by - 0.12 * u, 0.5 * u, 0.42 * u, 0, Math.PI, 0); ctx.lineTo(bx + 0.5 * u, by); ctx.lineTo(bx - 0.5 * u, by); ctx.fill();
  ctx.fillStyle = '#A7A49E'; ctx.beginPath(); ctx.ellipse(bx - 0.12 * u, by - 0.3 * u, 0.28 * u, 0.22 * u, -0.3, 0, 7); ctx.fill();
  ctx.fillStyle = '#6E6C69'; ctx.beginPath(); ctx.ellipse(bx + 0.22 * u, by - 0.1 * u, 0.22 * u, 0.18 * u, 0.2, 0, 7); ctx.fill();
  ctx.fillStyle = '#2A2622'; ctx.beginPath(); ctx.ellipse(bx + 0.02 * u, by - 0.02 * u, 0.15 * u, 0.2 * u, 0, Math.PI, 0); ctx.lineTo(bx + 0.17 * u, by + 0.02 * u); ctx.lineTo(bx - 0.13 * u, by + 0.02 * u); ctx.fill();
  ctx.fillStyle = '#5BAA55'; for (const [dx, dy] of [[-0.35, -0.42], [0.1, -0.5], [0.32, -0.3]]) { ctx.beginPath(); ctx.arc(bx + dx * u, by + dy * u, 0.07 * u, 0, 7); ctx.fill(); }
}
function drawPuerto(o, z) {
  const a = o.ang ?? 0, cx = Math.cos(a), cy = Math.sin(a), u = U();
  for (let i = 0; i < 12; i++) { const k = i * 0.22; box(o.x + cx * k - 0.2, o.y + cy * k - 0.2, 0.4, 0.4, 0.06, z - 0.02, i % 2 ? '#B9824E' : C.wood, { tcol: i % 2 ? '#C9925E' : '#D6A06A' }); }
  for (const s of [-1, 1]) for (const k of [1.2, 2.3]) { box(o.x + cx * k - cy * 0.17 * s - 0.03, o.y + cy * k + cx * 0.17 * s - 0.03, 0.06, 0.06, 0.22, z - 0.12, C.woodDark); }
  const [sx, sy] = P(o.x - cy * 0.25, o.y + cx * 0.25, z); signBoard(o.x - cy * 0.25, o.y + cx * 0.25, z, '#FFFFFF', 'PUERTO');
}
function drawRestaurant(o, z) { const fc = o.face || 'S', atras = fc === 'N' || fc === 'W'; if (atras) drawTerrazaF(o, z, o.color || '#C8233A'); shopWithSign(o, z, o.color || '#C8233A', o.cartel || 'RESTAURANTE', '#FFFFFF'); if (!atras) drawTerrazaF(o, z, o.color || '#C8233A'); }
function drawUnicornio(o, z) {
  shadowAt(o.x, o.y, z, 0.42, 0.2);
  drawHouse({ x: o.x, y: o.y, roof: '#C9A2F2', h: 0.44, wall: '#FFE4F2' }, z);
  const u = U(); const [hx, hy] = P(o.x - 0.31, o.y + 0.05, z + 0.66);   // cuerno dorado en el frontón
  ctx.fillStyle = '#F5C542'; ctx.beginPath(); ctx.moveTo(hx - 0.05 * u, hy); ctx.lineTo(hx + 0.05 * u, hy); ctx.lineTo(hx + 0.02 * u, hy - 0.32 * u); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#E0A92A'; ctx.lineWidth = Math.max(1, u * 0.012); for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(hx - 0.05 * u + k * 0.008 * u, hy - k * 0.07 * u); ctx.lineTo(hx + 0.05 * u - k * 0.004 * u, hy - k * 0.07 * u - 0.03 * u); ctx.stroke(); }
  const cols = ['#FF8FB1', '#FFC861', '#8FE3B0', '#7FC8FF', '#B79BFF'];          // crin de colores por el tejado
  for (let i = 0; i < 5; i++) { const [mx, my] = P(o.x - 0.2 + i * 0.12, o.y - 0.02, z + 0.72 - i * 0.01); ctx.fillStyle = cols[i]; ctx.beginPath(); ctx.arc(mx, my, 0.07 * u, 0, 7); ctx.fill(); }
}
function drawTigre(o, z) {
  shadowAt(o.x, o.y, z, 0.42, 0.2);
  drawHouseF({ x: o.x, y: o.y, roof: '#2B2B2B', h: 0.44, wall: '#F29B38' }, z, o.face);
  const u = U(), w = 0.62, d = 0.55, x0 = o.x - w / 2, Y = o.y + d / 2, X = o.x + w / 2;
  ctx.strokeStyle = '#2B2B2B'; ctx.lineWidth = Math.max(1.5, u * 0.03); ctx.lineCap = 'round';
  for (const q of [0.12, 0.3, 0.7, 0.88]) { const a = P(x0 + w * q, Y, z + 0.38), b = P(x0 + w * q + 0.04, Y, z + 0.18); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  for (const q of [0.2, 0.5, 0.8]) { const a = P(X, o.y - d / 2 + d * q, z + 0.4), b = P(X, o.y - d / 2 + d * q + 0.05, z + 0.2); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  for (const dx of [-0.2, 0.2]) { const [ex, ey] = P(o.x + dx, o.y, z + 0.78); ctx.fillStyle = '#F29B38'; ctx.beginPath(); ctx.moveTo(ex - 0.07 * u, ey); ctx.lineTo(ex, ey - 0.13 * u); ctx.lineTo(ex + 0.07 * u, ey); ctx.fill(); ctx.fillStyle = '#2B2B2B'; ctx.beginPath(); ctx.moveTo(ex - 0.03 * u, ey); ctx.lineTo(ex, ey - 0.07 * u); ctx.lineTo(ex + 0.03 * u, ey); ctx.fill(); }
}
function drawTorre(o, z) {   // torre de control: fuste de piedra y cabina acristalada arriba
  shadowAt(o.x, o.y, z, 0.32, 0.16);
  box(o.x - 0.17, o.y - 0.17, 0.34, 0.34, 0.9, z, '#A9A699', { tcol: '#BDBAAE' });
  for (const zz of [0.3, 0.6]) box(o.x - 0.18, o.y - 0.18, 0.36, 0.36, 0.03, z + zz, '#8E8B80');
  if (o.face === 'E') fillPoly(faceR(o.y - 0.06, o.y + 0.06, z, z + 0.22, o.x + 0.17), shade(C.woodDark, -0.1)); else if (o.face !== 'N' && o.face !== 'W') fillPoly(faceL(o.x - 0.06, o.x + 0.06, z, z + 0.22, o.y + 0.17), C.woodDark);
  for (const zz of [0.4, 0.68]) { fillPoly(faceL(o.x - 0.04, o.x + 0.04, z + zz, z + zz + 0.1, o.y + 0.17), '#3B4A55'); fillPoly(faceR(o.y - 0.04, o.y + 0.04, z + zz, z + zz + 0.1, o.x + 0.17), '#33424C'); }
  box(o.x - 0.26, o.y - 0.26, 0.52, 0.52, 0.04, z + 0.9, '#7E7B72');
  box(o.x - 0.22, o.y - 0.22, 0.44, 0.44, 0.2, z + 0.94, '#9FD8EE', { tcol: '#3A3A3A' });
  for (const q of [0.25, 0.5, 0.75]) { fillPoly(faceL(o.x - 0.22 + 0.44 * q - 0.008, o.x - 0.22 + 0.44 * q + 0.008, z + 0.94, z + 1.14, o.y + 0.22), '#3A3A3A'); fillPoly(faceR(o.y - 0.22 + 0.44 * q - 0.008, o.y - 0.22 + 0.44 * q + 0.008, z + 0.94, z + 1.14, o.x + 0.22), '#3A3A3A'); }
  box(o.x - 0.25, o.y - 0.25, 0.5, 0.5, 0.05, z + 1.14, '#D9D6CC');
  const [ax, ay] = P(o.x, o.y, z + 1.19); const u = U(); ctx.fillStyle = '#666'; ctx.fillRect(ax - 0.008 * u, ay - 0.22 * u, 0.016 * u, 0.22 * u);
  ctx.fillStyle = '#E8384F'; ctx.beginPath(); ctx.arc(ax, ay - 0.23 * u, 0.025 * u, 0, 7); ctx.fill();
}
function drawHuerto(o, z, t) {
  const g = 0.42; fillPoly([P(o.x - g, o.y - g, z + 0.006), P(o.x + g, o.y - g, z + 0.006), P(o.x + g, o.y + g, z + 0.006), P(o.x - g, o.y + g, z + 0.006)], '#9A6B3F');
  for (let i = 0; i < 4; i++) { const yy = o.y - g + 0.12 + i * 0.2; fillPoly([P(o.x - g + 0.06, yy, z + 0.008), P(o.x + 0.1, yy, z + 0.008), P(o.x + 0.1, yy + 0.08, z + 0.008), P(o.x - g + 0.06, yy + 0.08, z + 0.008)], '#5BAA55');
    for (let k = 0; k < 4; k++) { const [px, py] = P(o.x - g + 0.12 + k * 0.12, yy + 0.04, z + 0.01); ctx.fillStyle = k % 2 ? '#F2614C' : '#3E9A4F'; ctx.beginPath(); ctx.arc(px, py - U() * 0.03, Math.max(1.5, U() * 0.025), 0, 7); ctx.fill(); } }
  fenceLine(o.x - g, o.y - g, o.x + g, o.y - g, z); fenceLine(o.x - g, o.y - g, o.x - g, o.y + g, z);
  drawHouseF({ x: o.x + 0.25, y: o.y - 0.22, w: 0.3, d: 0.28, h: 0.26, hr: 0.16, roof: '#B5452E', wall: '#C9925E' }, z, 'S');
  drawHorse(o.x + 0.25, o.y + 0.2, z, t);
  fenceLine(o.x + g, o.y - g, o.x + g, o.y + g, z); fenceLine(o.x - g, o.y + g, o.x + g, o.y + g, z, [0.4, 0.6]);
}
function drawHorse(x, y, z, t) { const [bx, by] = P(x, y, z); const u = U() * 1.2, b = Math.sin(t * 2) * 0.006 * u;
  ctx.fillStyle = 'rgba(20,40,40,0.2)'; ctx.beginPath(); ctx.ellipse(bx, by, 0.14 * u, 0.045 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#8B5A2B'; for (const dx of [-0.08, -0.04, 0.05, 0.09]) ctx.fillRect(bx + dx * u - 0.01 * u, by - 0.12 * u, 0.02 * u, 0.12 * u);
  ctx.beginPath(); ctx.ellipse(bx, by - 0.15 * u + b, 0.12 * u, 0.055 * u, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(bx + 0.08 * u, by - 0.18 * u); ctx.lineTo(bx + 0.13 * u, by - 0.3 * u + b); ctx.lineTo(bx + 0.19 * u, by - 0.27 * u + b); ctx.lineTo(bx + 0.12 * u, by - 0.15 * u); ctx.fill();
  ctx.fillStyle = '#3B2614'; ctx.beginPath(); ctx.moveTo(bx + 0.09 * u, by - 0.2 * u); ctx.lineTo(bx + 0.12 * u, by - 0.3 * u + b); ctx.lineTo(bx + 0.1 * u, by - 0.18 * u); ctx.fill(); ctx.fillRect(bx - 0.14 * u, by - 0.17 * u, 0.03 * u, 0.09 * u); }
function drawRabbit(x, y, z, t, s = 1) { const [bx, by] = P(x, y, z); const u = U() * s, hop = Math.max(0, Math.sin(t * 5)) * 0.02 * u;
  ctx.fillStyle = 'rgba(20,40,40,0.2)'; ctx.beginPath(); ctx.ellipse(bx, by, 0.08 * u, 0.03 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#F7F7F2'; ctx.beginPath(); ctx.ellipse(bx, by - 0.06 * u - hop, 0.07 * u, 0.055 * u, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(bx + 0.06 * u, by - 0.11 * u - hop, 0.04 * u, 0, 7); ctx.fill();
  for (const dx of [0.045, 0.075]) { ctx.beginPath(); ctx.ellipse(bx + dx * u, by - 0.19 * u - hop, 0.013 * u, 0.05 * u, 0.1, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#E8A9A0'; ctx.beginPath(); ctx.arc(bx + 0.095 * u, by - 0.11 * u - hop, 0.008 * u, 0, 7); ctx.fill(); }
function drawMoto(x, y, z) { const [bx, by] = P(x, y, z); const u = U();
  ctx.fillStyle = '#222'; for (const dx of [-0.08, 0.08]) { ctx.beginPath(); ctx.arc(bx + dx * u, by - 0.04 * u, 0.04 * u, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#D7263D'; ctx.beginPath(); ctx.moveTo(bx - 0.09 * u, by - 0.07 * u); ctx.lineTo(bx + 0.06 * u, by - 0.07 * u); ctx.lineTo(bx + 0.08 * u, by - 0.13 * u); ctx.lineTo(bx - 0.05 * u, by - 0.12 * u); ctx.fill();
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(bx - 0.12 * u, by - 0.2 * u, 0.09 * u, 0.08 * u); ctx.fillStyle = '#D7263D'; ctx.fillRect(bx - 0.12 * u, by - 0.2 * u, 0.09 * u, 0.02 * u); }
function drawBasic(o, z) { shadowAt(o.x, o.y, z, 0.24, 0.12); drawHouseF({ x: o.x, y: o.y, w: 0.34, d: 0.3, h: 0.24, hr: 0.16, roof: '#C9CFD6', wall: '#FBFBF7' }, z, o.face); }
function fenceLine(x0, y0, x1, y1, z, gap) {   // valla blanca de madera
  const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 0.09)), u = U(), h = 0.13;
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = Math.max(1, u * 0.018); ctx.lineCap = 'round';
  for (let i = 0; i <= n; i++) { const q = i / n; if (gap && q > gap[0] && q < gap[1]) continue; const x = lerp(x0, x1, q), y = lerp(y0, y1, q);
    const a = P(x, y, z), b = P(x, y, z + h); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  ctx.strokeStyle = '#E8E2D6'; ctx.lineWidth = Math.max(1, u * 0.012);
  for (const hh of [0.05, 0.1]) { const segs = gap ? [[0, gap[0]], [gap[1], 1]] : [[0, 1]];
    for (const [q0, q1] of segs) { const a = P(lerp(x0, x1, q0), lerp(y0, y1, q0), z + hh), b = P(lerp(x0, x1, q1), lerp(y0, y1, q1), z + hh); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
}
function drawCustom(o, z, t) {
  const f = o.forma || 'casa';
  if (f === 'arbol') return drawTreeHouse(o, z);
  if (f === 'bar') return drawBar(o, z);
  if (f === 'veterinario') return drawVet(o, z);
  if (f === 'kebab') return shopWithSign(o, z, '#E9A93B', 'KEBAB', '#FFE6A8');
  if (f === 'pizzeria') return shopWithSign(o, z, '#2E9E5B', 'PIZZA', '#FFFFFF', '#FFFFFF');
  if (f === 'moviles') return shopWithSign(o, z, '#2E8FA8', 'MÓVILES', '#D9F2FA');
  if (f === 'comisaria') return shopWithSign(o, z, '#2B4C9B', 'POLICÍA', '#FFFFFF', '#EEF2FA');
  if (f === 'perrera') { shadowAt(o.x, o.y, z, 0.42, 0.2); drawHouseF({ x: o.x, y: o.y, roof: '#B5651D', h: 0.38, wall: '#FCEBD2' }, z, o.face); return; }
  if (f === 'restaurante') return drawRestaurant(o, z);
  if (f === 'cueva') return drawCaveBig(o, z);
  if (f === 'puerto') return drawPuerto(o, z);
  if (f === 'tienda') return drawShopF({ x: o.x, y: o.y, col: o.color }, z, o.face);
  if (f === 'basica') return drawBasic(o, z);
  if (f === 'unicornio') return drawUnicornio(o, z);
  if (f === 'tigre') { if (!(o.det || o.detalles || []).includes('minipiscina')) return drawTigre(o, z);
    // piscina dentro de su parcela: la casa se echa un poco atrás y a un lado, la piscina delante (más grande que los tigres)
    const vis = (o.face === 'N' || o.face === 'W') ? -1 : 1, [f, sd] = FRENTE[o.face || 'S'];
    const c = (a, b, zz) => P(o.x + f[0] * a * vis + sd[0] * b, o.y + f[1] * a * vis + sd[1] * b, zz);
    fillPoly([c(0.13, 0.14, z + 0.008), c(0.45, 0.14, z + 0.008), c(0.45, 0.47, z + 0.008), c(0.13, 0.47, z + 0.008)], '#FFFFFF');
    fillPoly([c(0.16, 0.17, z + 0.01), c(0.42, 0.17, z + 0.01), c(0.42, 0.44, z + 0.01), c(0.16, 0.44, z + 0.01)], '#4FC3E8');
    fillPoly([c(0.16, 0.17, z + 0.011), c(0.42, 0.17, z + 0.011), c(0.42, 0.22, z + 0.011), c(0.16, 0.22, z + 0.011)], '#7FD6F0');
    const [hx, hy] = enFrente(o, -0.16 * vis, -0.2); return drawTigre({ ...o, x: hx, y: hy, s: 0.85 }, z); }
  if (f === 'torre') return drawTorre(o, z);
  if (f === 'huerto') return drawGranja(o, z, t);
  if (f === 'lavanderia') return shopWithSign(o, z, o.color || '#9ED3F0', 'LAVANDERÍA', '#FFFFFF', o.pared || '#DDF1FB');
  if (f === 'super') return shopWithSign(o, z, '#2E9E5B', 'SUPER', '#FFFFFF', '#FFFFFF');
  if (f === 'peluqueria') return shopWithSign(o, z, '#B66DFF', 'PELUQUERÍA', '#FFFFFF', '#F6EEFF');
  if (f === 'mascotas') return shopWithSign(o, z, '#2BA8A0', 'MASCOTAS', '#FFFFFF', '#E6F7F5');
  if (f === 'kayaks') { shopWithSign(o, z, '#F28C28', 'KAYAKS', '#FFFFFF', '#FFF1E0'); return; }
  if (f === 'mexicano') return shopWithSign(o, z, '#2E9E5B', 'MEXICANO', '#FFFFFF', '#FFF4E0');
  if (f === 'carniceria') return shopWithSign(o, z, '#B5452E', 'CARNICERÍA', '#FFFFFF', '#FBEDE8');
  if (f === 'churreria') return shopWithSign(o, z, '#E9A93B', 'CHURROS', '#FFF3D6', '#FFF6E6');
  if (f === 'cuartel') { shopWithSign(o, z, '#5B6B3A', 'CUARTEL', '#E9EDDC', '#C9C3A6'); const [bx, by] = enFrente(o, 0.4, -0.28); for (let i = 0; i < 3; i++) box(bx - 0.08 + i * 0.055, by - 0.03, 0.05, 0.06, 0.05, z, '#B9A77A'); const [fx, fy] = enFrente(o, 0.36, 0.3); drawFlag(fx, fy, z, t, 'espana'); return; }
  if (f === 'colegio') { shopWithSign(o, z, '#E9A93B', 'COLE', '#FFFFFF', o.pared || '#FFFFFF'); return; }
  if (f === 'pollo') return shopWithSign(o, z, '#C8233A', 'POLLO FRITO', '#FFFFFF', '#FFF4E0');
  if (f === 'recreativos') return shopWithSign(o, z, '#6B3FD8', 'RECREATIVOS', '#FFE45C', '#EDE6FF');
  if (f === 'bomberos') return drawBomberos(o, z);
  if (f === 'iglesia') return drawIglesia(o, z);
  if (f === 'parque') return drawParque(o, z, t);
  if (f === 'piscina_publica') return drawPiscinaPublica(o, z, t);
  if (f === 'escenario') return drawEscenario(o, z, t);
  if (f === 'refugio') { shadowAt(o.x, o.y, z, 0.42, 0.2); drawHouseF({ x: o.x, y: o.y, roof: '#3E9A4F', h: 0.4, wall: '#FCEBD2' }, z, o.face); return; }
  if ((o.det || o.detalles || []).includes('piscina')) {   // jardín propio con piscina, dentro de su parcela
    const g = 0.42; fillPoly([P(o.x - g, o.y - g, z + 0.006), P(o.x + g, o.y - g, z + 0.006), P(o.x + g, o.y + g, z + 0.006), P(o.x - g, o.y + g, z + 0.006)], '#86CC6E');
    fenceLine(o.x - g, o.y - g, o.x + g, o.y - g, z); fenceLine(o.x - g, o.y - g, o.x - g, o.y + g, z);
    const px = o.x - 0.22, py = o.y + 0.2, pw = 0.26, pd = 0.36;
    fillPoly([P(px - pw / 2, py - pd / 2, z + 0.008), P(px + pw / 2, py - pd / 2, z + 0.008), P(px + pw / 2, py + pd / 2, z + 0.008), P(px - pw / 2, py + pd / 2, z + 0.008)], '#FFFFFF');
    fillPoly([P(px - pw / 2 + 0.035, py - pd / 2 + 0.035, z + 0.01), P(px + pw / 2 - 0.035, py - pd / 2 + 0.035, z + 0.01), P(px + pw / 2 - 0.035, py + pd / 2 - 0.035, z + 0.01), P(px - pw / 2 + 0.035, py + pd / 2 - 0.035, z + 0.01)], '#4FC3E8');
    const hx = o.x + 0.12, hy = o.y - 0.12; shadowAt(hx, hy, z, 0.34, 0.17);
    drawHouse({ x: hx, y: hy, w: 0.5, d: 0.44, roof: o.color || C.coral, h: 0.38, hr: 0.26, wall: o.pared }, z);
    if (o.puerta) { const w = 0.5, d = 0.44, x = hx - w / 2, Y = hy - d / 2 + d; fillPoly(faceL(x + w * 0.38, x + w * 0.62, z, z + 0.38 * 0.62, Y), o.puerta); }
    fenceLine(o.x + g, o.y - g, o.x + g, o.y + g, z); fenceLine(o.x - g, o.y + g, o.x + g, o.y + g, z, [0.25, 0.45]);
    return;
  }
  shadowAt(o.x, o.y, z, 0.42, 0.2);
  drawHouseF({ x: o.x, y: o.y, roof: o.color || C.coral, h: 0.42, wall: o.pared, puerta: o.puerta }, z, o.face);
}

/* --- detalles --- */
function drawCat(x, y, z, t, s = 1, col = '#F29F4B', col2) {
  const [bx, by] = P(x, y, z); const u = U() * s; const bob = Math.sin(t * 3 + x) * 0.01 * u;
  ctx.fillStyle = 'rgba(20,40,40,0.2)'; ctx.beginPath(); ctx.ellipse(bx, by, 0.1 * u, 0.04 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(bx, by - 0.07 * u, 0.09 * u, 0.06 * u, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(bx + 0.07 * u, by - 0.14 * u + bob, 0.05 * u, 0, 7); ctx.fill();
  for (const dx of [0.04, 0.1]) { ctx.beginPath(); ctx.moveTo(bx + dx * u - 0.02 * u, by - 0.17 * u + bob); ctx.lineTo(bx + dx * u, by - 0.22 * u + bob); ctx.lineTo(bx + dx * u + 0.02 * u, by - 0.17 * u + bob); ctx.fill(); }
  ctx.strokeStyle = col; ctx.lineWidth = 0.02 * u; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(bx - 0.08 * u, by - 0.08 * u); ctx.quadraticCurveTo(bx - 0.16 * u, by - 0.12 * u + Math.sin(t * 4 + x) * 0.03 * u, bx - 0.13 * u, by - 0.2 * u); ctx.stroke();
  if (col2) { ctx.fillStyle = col2; ctx.beginPath(); ctx.ellipse(bx - 0.025 * u, by - 0.09 * u, 0.045 * u, 0.035 * u, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(bx + 0.085 * u, by - 0.165 * u + bob, 0.028 * u, Math.PI, 2 * Math.PI); ctx.fill(); }   // manchas (gato de dos colores)
  ctx.fillStyle = col === '#2B2B2B' ? '#E9D35B' : C.navy; for (const dx of [0.055, 0.085]) { ctx.beginPath(); ctx.arc(bx + dx * u, by - 0.145 * u + bob, 0.007 * u, 0, 7); ctx.fill(); }
}
function drawDog(x, y, z, t, s = 1, col = '#C58B4E', ears = '#8A5A2E', small = false) {
  const [bx, by] = P(x, y, z); const u = U() * s * (small ? 0.75 : 1); const wag = Math.sin(t * 9 + x) * 0.03 * u;
  ctx.fillStyle = 'rgba(20,40,40,0.2)'; ctx.beginPath(); ctx.ellipse(bx, by, 0.11 * u, 0.04 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(bx, by - 0.08 * u, 0.1 * u, 0.06 * u, 0, 0, 7); ctx.fill();
  for (const dx of [-0.06, 0.06]) ctx.fillRect(bx + dx * u - 0.012 * u, by - 0.05 * u, 0.024 * u, 0.05 * u);
  ctx.beginPath(); ctx.arc(bx + 0.09 * u, by - 0.15 * u, 0.055 * u, 0, 7); ctx.fill();
  ctx.fillStyle = ears; if (small) { for (const dx of [0.06, 0.12]) { ctx.beginPath(); ctx.moveTo(bx + dx * u - 0.025 * u, by - 0.18 * u); ctx.lineTo(bx + dx * u, by - 0.26 * u); ctx.lineTo(bx + dx * u + 0.025 * u, by - 0.18 * u); ctx.fill(); } }
  else { ctx.beginPath(); ctx.ellipse(bx + 0.06 * u, by - 0.14 * u, 0.02 * u, 0.045 * u, 0.3, 0, 7); ctx.fill(); }
  ctx.strokeStyle = col; ctx.lineWidth = 0.02 * u; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx - 0.09 * u, by - 0.1 * u); ctx.lineTo(bx - 0.15 * u, by - 0.17 * u + wag); ctx.stroke();
  ctx.fillStyle = C.navy; ctx.beginPath(); ctx.arc(bx + 0.11 * u, by - 0.16 * u, 0.008 * u, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(bx + 0.145 * u, by - 0.14 * u, 0.01 * u, 0, 7); ctx.fill();
}
function drawCobaya(x, y, z, t, s = 1, body = '#B8763A') {
  const [bx, by] = P(x, y, z); const u = U() * s; const w = Math.sin(t * 6) * 0.004 * u;
  ctx.fillStyle = 'rgba(20,40,40,0.2)'; ctx.beginPath(); ctx.ellipse(bx, by, 0.1 * u, 0.035 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(bx, by - 0.06 * u, 0.1 * u, 0.065 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.ellipse(bx + 0.04 * u, by - 0.06 * u, 0.06 * u, 0.055 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = body; ctx.beginPath(); ctx.arc(bx + 0.08 * u, by - 0.09 * u + w, 0.045 * u, 0, 7); ctx.fill();
  ctx.fillStyle = '#E8A9A0'; ctx.beginPath(); ctx.arc(bx + 0.06 * u, by - 0.13 * u + w, 0.018 * u, 0, 7); ctx.fill();
  ctx.fillStyle = C.navy; ctx.beginPath(); ctx.arc(bx + 0.1 * u, by - 0.095 * u + w, 0.008 * u, 0, 7); ctx.fill();
}
function drawFlag(x, y, z, t, kind) {
  const [bx, by] = P(x, y, z); const u = U();
  ctx.fillStyle = '#DDDDDD'; ctx.fillRect(bx - 0.01 * u, by - 0.42 * u, 0.02 * u, 0.42 * u);
  ctx.fillStyle = '#F2C94C'; ctx.beginPath(); ctx.arc(bx, by - 0.43 * u, 0.018 * u, 0, 7); ctx.fill();
  const fw = 0.26 * u, fh = 0.16 * u, x0 = bx + 0.01 * u, y0 = by - 0.41 * u;
  const wv = (q) => Math.sin(t * 4 + q * 3) * 0.015 * u;
  const quad = (q0, q1, r0, r1, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x0 + fw * q0, y0 + fh * r0 + wv(q0)); ctx.lineTo(x0 + fw * q1, y0 + fh * r0 + wv(q1)); ctx.lineTo(x0 + fw * q1, y0 + fh * r1 + wv(q1)); ctx.lineTo(x0 + fw * q0, y0 + fh * r1 + wv(q0)); ctx.closePath(); ctx.fill(); };
  if (kind === 'peru') { quad(0, 1 / 3, 0, 1, '#D91023'); quad(1 / 3, 2 / 3, 0, 1, '#FFFFFF'); quad(2 / 3, 1, 0, 1, '#D91023'); }
  else if (kind === 'espana') { quad(0, 1, 0, 0.25, '#AA151B'); quad(0, 1, 0.25, 0.75, '#F1BF00'); quad(0, 1, 0.75, 1, '#AA151B'); }
  else if (kind === 'marruecos') { quad(0, 1, 0, 1, '#C1272D'); const cx = x0 + fw * 0.5, cy = y0 + fh * 0.5 + wv(0.5), r = fh * 0.3; ctx.strokeStyle = '#006233'; ctx.lineWidth = Math.max(1, u * 0.012); ctx.beginPath(); for (let i = 0; i <= 5; i++) { const a = -Math.PI / 2 + i * 4 * Math.PI / 5; ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } ctx.stroke(); }
  else if (kind === 'canarias') { quad(0, 1 / 3, 0, 1, '#FFFFFF'); quad(1 / 3, 2 / 3, 0, 1, '#0768A9'); quad(2 / 3, 1, 0, 1, '#FCD116'); }
  else if (kind === 'zamora') { for (let i = 0; i < 8; i++) quad(0, 1, i / 8, (i + 1) / 8, '#C8102E'); quad(0, 0.35, 0, 0.3, '#2E7D32'); }
  else if (kind === 'cuba') { for (let i = 0; i < 5; i++) quad(0, 1, i / 5, (i + 1) / 5, i % 2 ? '#FFFFFF' : '#002A8F');
    ctx.fillStyle = '#CF142B'; ctx.beginPath(); ctx.moveTo(x0, y0 + wv(0)); ctx.lineTo(x0 + fw * 0.42, y0 + fh * 0.5 + wv(0.42)); ctx.lineTo(x0, y0 + fh + wv(0)); ctx.closePath(); ctx.fill(); }
}
function drawFlagPeru(x, y, z, t) { drawFlag(x, y, z, t, 'peru'); }
function drawHamster(x, y, z, t, s = 1) { drawCobaya(x, y, z, t, s * 0.8, '#E59A4C'); }
function drawHeartAt(x, y, z, rr) { const [hx, hy] = P(x, y, z), r = rr * U();   // corazón grande de pie sobre el tejado
  ctx.fillStyle = '#E8384F'; ctx.beginPath(); ctx.moveTo(hx, hy + r * 0.9); ctx.bezierCurveTo(hx - r * 1.6, hy - r * 0.2, hx - r * 0.8, hy - r * 1.4, hx, hy - r * 0.5); ctx.bezierCurveTo(hx + r * 0.8, hy - r * 1.4, hx + r * 1.6, hy - r * 0.2, hx, hy + r * 0.9); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(hx - r * 0.45, hy - r * 0.55, r * 0.2, r * 0.12, -0.6, 0, 7); ctx.fill(); }
function drawHeart(o, z) { const fc = o.face || 'S', [hx, hy] = (fc === 'E' || fc === 'W') ? P(o.x + 0.275, o.y - 0.12, z + 0.24) : P(o.x + 0.12, o.y + 0.275, z + 0.24); const u = U(); const r = 0.05 * u;
  ctx.fillStyle = '#E8384F'; ctx.beginPath(); ctx.moveTo(hx, hy + r * 1.4); ctx.bezierCurveTo(hx - r * 2.2, hy - r * 0.2, hx - r * 0.9, hy - r * 1.9, hx, hy - r * 0.6); ctx.bezierCurveTo(hx + r * 0.9, hy - r * 1.9, hx + r * 2.2, hy - r * 0.2, hx, hy + r * 1.4); ctx.fill(); }
function drawFlowers(o, z, vis = 1) { const cols = ['#F2614C', '#FFC83D', '#E76F8A', '#B66DFF'];
  for (let i = 0; i < 8; i++) { const [x, y] = enFrente(o, 0.34 * vis, -0.3 + i * 0.085); if (Math.abs(-0.3 + i * 0.085) < 0.1) continue; const [fx, fy] = P(x, y, z); ctx.fillStyle = '#3E9A4F'; ctx.fillRect(fx - 1, fy - U() * 0.06, 2, U() * 0.06); ctx.fillStyle = cols[i % 4]; ctx.beginPath(); ctx.arc(fx, fy - U() * 0.07, Math.max(2, U() * 0.028), 0, 7); ctx.fill(); } }
function drawPool(o, z) { const x = o.x + 0.62, y = o.y - 0.05, w = 0.42, d = 0.5;
  fillPoly([P(x - w / 2, y - d / 2, z + 0.01), P(x + w / 2, y - d / 2, z + 0.01), P(x + w / 2, y + d / 2, z + 0.01), P(x - w / 2, y + d / 2, z + 0.01)], '#FFFFFF');
  fillPoly([P(x - w / 2 + 0.05, y - d / 2 + 0.05, z + 0.012), P(x + w / 2 - 0.05, y - d / 2 + 0.05, z + 0.012), P(x + w / 2 - 0.05, y + d / 2 - 0.05, z + 0.012), P(x - w / 2 + 0.05, y + d / 2 - 0.05, z + 0.012)], '#4FC3E8'); }
/* --- orientación de los detalles: delante (f) y a lo largo de la fachada (s) según hacia dónde mira el edificio --- */
const FRENTE = { S: [[0, 1], [1, 0]], N: [[0, -1], [-1, 0]], E: [[1, 0], [0, -1]], W: [[-1, 0], [0, 1]] };
function enFrente(o, a, b) { const [f, s] = FRENTE[o.face || 'S']; return [o.x + f[0] * a + s[0] * b, o.y + f[1] * a + s[1] * b]; }
function alturaTejado(o) {   // [altura de la cumbrera, ¿tejado plano?]
  const f = o.forma || 'casa';
  if (['tienda'].includes(f)) return [0.48, true];
  if (['bar'].includes(f)) return [0.44, true];
  if (['veterinario'].includes(f)) return [0.38, true];
  if (['kebab', 'pizzeria', 'moviles', 'comisaria', 'restaurante', 'lavanderia', 'super', 'peluqueria', 'mascotas', 'kayaks', 'mexicano', 'carniceria', 'churreria', 'cuartel', 'colegio', 'pollo', 'recreativos', 'bomberos'].includes(f)) return [0.42, true];
  if (f === 'refugio') return [0.7, false];
  if (f === 'perrera') return [0.68, false];
  if (f === 'tigre' || f === 'unicornio') return [0.74, false];
  if ((o.det || []).includes('piscina')) return [0.64, false];
  return [0.72, false];
}
function drawKayaks(o, z, vis = 1) {   // dos kayaks de colores apoyados en un soporte delante de la tienda, con un remo
  const [f, sd] = FRENTE[o.face || 'S'];
  const at = (a, b, h) => P(o.x + f[0] * a * vis + sd[0] * b, o.y + f[1] * a * vis + sd[1] * b, z + h);
  for (const b of [-0.3, 0.3]) { const [p, q] = [at(0.5, b, 0), at(0.5, b, 0.16)]; ctx.strokeStyle = '#7A5230'; ctx.lineWidth = Math.max(1.5, U() * 0.025); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); }
  [[0.1, '#E8384F'], [0.17, '#FFC83D']].forEach(([h, col], k) => { const a = 0.47 + k * 0.07, L = 0.42, Wd = 0.065, pts = [];
    for (let i = 0; i <= 12; i++) { const q = i / 12 * 2 - 1; pts.push(at(a + Wd * Math.sqrt(1 - q * q), q * L, h)); }
    for (let i = 12; i >= 0; i--) { const q = i / 12 * 2 - 1; pts.push(at(a - Wd * Math.sqrt(1 - q * q), q * L, h)); }
    fillPoly(pts, col); const c = [at(a, -0.08, h + 0.005), at(a, 0.08, h + 0.005)]; ctx.strokeStyle = '#2B2B2B'; ctx.lineWidth = Math.max(2, U() * 0.04); ctx.beginPath(); ctx.moveTo(...c[0]); ctx.lineTo(...c[1]); ctx.stroke(); });
  const r0 = at(0.62, -0.45, 0.02), r1 = at(0.62, -0.05, 0.02); ctx.strokeStyle = '#3B3B3B'; ctx.lineWidth = Math.max(1.5, U() * 0.02); ctx.beginPath(); ctx.moveTo(...r0); ctx.lineTo(...r1); ctx.stroke();
  for (const r of [r0, r1]) { ctx.fillStyle = '#2E8FA8'; ctx.beginPath(); ctx.ellipse(r[0], r[1], U() * 0.04, U() * 0.02, 0, 0, 7); ctx.fill(); }
}
function drawTerrazaF(o, z, col) {   // mesas con sombrilla delante del local, en el suelo
  for (const k of [-1, 1]) {
    const [tx, ty] = enFrente(o, 0.5, k * 0.2), u = U();
    for (const c of [-1, 1]) { const [cx, cy] = enFrente({ ...o, x: tx, y: ty }, 0, c * 0.08); box(cx - 0.025, cy - 0.025, 0.05, 0.05, 0.06, z, C.woodDark); }
    const [lx, ly] = P(tx, ty, z), [mx, my] = P(tx, ty, z + 0.1), [px, py] = P(tx, ty, z + 0.3);
    ctx.fillStyle = '#E6E1D8'; ctx.fillRect(lx - 0.006 * u, my, 0.012 * u, ly - my);
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.ellipse(mx, my, 0.06 * u, 0.03 * u, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#5A4A3A'; ctx.fillRect(px - 0.005 * u, py, 0.01 * u, my - py);
    ctx.fillStyle = k > 0 ? (col || '#2E8FA8') : '#FFFFFF'; ctx.beginPath(); ctx.moveTo(px - 0.13 * u, py + 0.03 * u); ctx.quadraticCurveTo(px, py - 0.08 * u, px + 0.13 * u, py + 0.03 * u); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = Math.max(1, u * 0.006); ctx.stroke();
  }
}
function drawDetails(o, z, t, push) {   // push(d, fn): cada detalle con su propia profundidad (si no, se dibuja ya)
  const det = o.det || []; let flags = 0, tc = 0, np = 0;
  const [hTop, plano] = alturaTejado(o), arriba = o.x + o.y + 0.05;
  const put = (d, fn) => push ? push(d, fn) : fn();
  const vis = (o.face === 'N' || o.face === 'W') ? -1 : 1;   // si la casa nos da la espalda, los animales en el jardín de atrás (que es el que se ve)
  const pet = () => enFrente(o, 0.48 * vis, [-0.2, 0.2, 0, -0.32, 0.32][np++ % 5]);
  const techo = () => { const r = enFrente(o, plano ? -0.05 : 0, [-0.12, 0.13][tc++ % 2]); return [r[0], r[1], z + hTop - (plano ? 0 : 0.03)]; };
  const suelo = (draw) => { const [x, y] = pet(); put(x + y, () => draw(x, y)); };
  for (const d of det) {
    const k = np + 1;
    const cat = (col, s = 1.2, col2) => suelo((x, y) => drawCat(x, y, z, t + k, s, col, col2));
    const dog = (...a) => suelo((x, y) => drawDog(x, y, z, t + k, ...a));
    if (d === 'gato' || d === 'gato_naranja') cat(undefined);
    if (d === 'gato_blanco') cat('#F4F4F0');
    if (d === 'gato_gris') cat('#7C7C80');
    if (d === 'gato_negro') cat('#2B2B2B', 1.1);
    if (d === 'gato_gris_blanco') cat('#F4F4F0', 1.2, '#7C7C80');
    if (d === 'gato_blanco_marron') cat('#F4F4F0', 1.2, '#8B5A2B');
    if (d === 'arbol') { const [x, y] = enFrente(o, 0.42 * vis, -0.3); put(x + y, () => drawTree({ x, y, s: 0.75 }, z)); }
    if (d === 'corazon_tejado') { const [hx, hy] = enFrente(o, plano ? -0.05 : 0, 0); put(arriba + 0.03, () => drawHeartAt(hx, hy, z + hTop + 0.13, 0.16)); }   // grande, con la punta apoyada en el centro de la cumbrera
    if (d === 'gatos') { cat('#4A4A4A', 1.2); cat(undefined, 1.2); }
    if (d === 'gatos_techo') { const a = techo(), b = techo(); put(arriba, () => { drawCat(a[0], a[1], a[2], t, 1.05, '#4A4A4A'); drawCat(b[0], b[1], b[2], t + 1, 1.05); }); }
    if (d === 'gato_blanco_techo') { const a = techo(); put(arriba, () => drawCat(a[0], a[1], a[2], t, 1.1, '#F4F4F0')); }
    if (d === 'conejo') suelo((x, y) => drawRabbit(x, y, z, t, 1.3));
    if (d === 'perro') dog(1.2);
    if (d === 'beagle') dog(1.15, '#F3E2C7', '#8A5A2E');
    if (d === 'bichon') dog(1.1, '#FAFAFA', '#E6E6E6', true);
    if (d === 'chihuahua') dog(1.2, '#D9A866', '#B98545', true);
    if (d === 'perros') { dog(1.2); dog(1.1, '#F2F2F2', '#9A9A9A'); }
    if (d === 'cobaya') suelo((x, y) => drawCobaya(x, y, z, t, 1.4));
    if (d === 'hamster') suelo((x, y) => drawHamster(x, y, z, t, 1.4));
    if (d === 'moto') { const [x, y] = enFrente(o, 0.45, 0.36); put(x + y, () => drawMoto(x, y, z)); }
    if (d === 'terraza') { const [x, y] = enFrente(o, 0.5, 0); put(x + y, () => drawTerrazaF(o, z)); }
    if (d === 'kayaks') { const [kx, ky] = enFrente(o, 0.5 * vis, 0); put(kx + ky, () => drawKayaks(o, z, vis)); }
    if (d === 'tigres') { for (const [a, b, sc] of [[0.3, 0.06, 0.8], [0.47, 0.3, 0.75]]) { const [x, y] = enFrente(o, a * vis, b); put(x + y + 0.05, () => drawCat(x, y, z, t + a + b, sc, '#F28C28')); } }
    if (d === 'pez') { const [x, y] = enFrente(o, 0.44 * vis, d === 'pez' ? 0.3 : -0.28); put(x + y - 0.2, () => { const [cx, cy] = P(x, y, z + 0.008), u = U(); ctx.fillStyle = d === 'pez' ? '#8C8A86' : '#FFFFFF'; ctx.beginPath(); ctx.ellipse(cx, cy, 0.17 * u, 0.09 * u, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#4FC3E8'; ctx.beginPath(); ctx.ellipse(cx, cy, 0.14 * u, 0.07 * u, 0, 0, 7); ctx.fill();
      if (d === 'pez') { ctx.fillStyle = '#F2802C'; const q = Math.sin(t * 2) * 0.04 * u; ctx.beginPath(); ctx.ellipse(cx + q, cy, 0.035 * u, 0.017 * u, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(cx + q - 0.03 * u, cy); ctx.lineTo(cx + q - 0.055 * u, cy - 0.015 * u); ctx.lineTo(cx + q - 0.055 * u, cy + 0.015 * u); ctx.fill(); } }); }
    if (d === 'paqueteria') { const [x, y] = enFrente(o, 0.38, -0.32); put(x + y, () => { box(x - 0.07, y - 0.05, 0.14, 0.1, 0.22, z, '#F2C94C', { tcol: '#F7DA7A' }); for (const k of [0.06, 0.13]) fillPoly(faceL(x - 0.06, x + 0.06, z + k, z + k + 0.05, y + 0.05), '#C9A230'); }); }
    if (d === 'corazon') put(arriba, () => drawHeart(o, z));
    if (d === 'flores') { const [x, y] = enFrente(o, 0.34 * vis, 0); put(x + y, () => drawFlowers(o, z, vis)); }
    if (['peru', 'espana', 'zamora', 'cuba', 'canarias', 'marruecos'].includes(d)) {
      const [x, y] = plano ? enFrente(o, -0.12, 0.2 - flags * 0.22) : enFrente(o, 0, 0.22 - flags * 0.2), fl = flags++;
      put(arriba + 0.01, () => drawFlag(x, y, z + hTop - (plano ? 0 : 0.02), t + fl, d)); }
  }
}
/* barrio de casas básicas: huecos en la parte de atrás de la isla, lejos de lo ya construido */
function barrioSlots(R, ocupados, n, seed) {
  const out = [], sp = 0.42;
  for (let i = -14; i <= 14; i++) for (let j = -14; j <= 14; j++) {
    const x = i * sp, y = j * sp; if (x + y > -0.9) continue;
    const th = Math.atan2(y, x), r = Math.hypot(x, y); if (r > islandR(th, R, seed) - 0.4) continue;
    if (ocupados.some(o => Math.hypot(o.x - x, o.y - y) < (o.forma === 'arbol' ? 0.75 : 0.6))) continue;
    out.push({ x, y, d: Math.hypot(x + 1.3, y + 1.3) });
  }
  return out.sort((a, b) => a.d - b.d).slice(0, n);
}

/* ================= CIUDAD: zonas, manzanas, calles y forma de la isla ================= */
const _islandR0 = islandR;
let CITY = null;            // { shape: Float64Array, SR }
let VIEW_ROT = 0;           // giro de la vista en pasos de 90° (solo la web; los vídeos usan 0)
function rotXY(x, y) { switch (((VIEW_ROT % 4) + 4) % 4) { case 0: return [x, y]; case 1: return [-y, x]; case 2: return [-x, -y]; default: return [y, -x]; } }
const FACES = ['S', 'W', 'N', 'E'];
function rotFace(f) { if (!f) return f; return FACES[(FACES.indexOf(f) + ((VIEW_ROT % 4) + 4) % 4) % 4]; }
window.islandR = function (th, R, seed) {
  if (!CITY) return _islandR0(th, R, seed);
  th -= VIEW_ROT * Math.PI / 2;
  const N = CITY.shape.length; let f = (((th / (2 * Math.PI)) % 1) + 1) % 1 * N;
  const i = Math.floor(f) % N, j = (i + 1) % N, a = f - Math.floor(f), v = CITY.shape[i] * (1 - a) + CITY.shape[j] * a;
  if (Math.abs(seed - (CITY.seed + 1.3)) < 1e-9) { const k = R / grassRad(CITY.SR); return Math.max(0.1, (v - anchoCosta(th)) * k); }   // hierba hasta las rocas; en las playas, su franja de arena
  return v * R / CITY.SR;
};
const FERRY_DX = 0.95, FERRY_DY = 1.95, PIER_LEN = 2.7;   // ferry atracado entero en el agua, junto al muelle largo
// el ferry crece con la gente nueva que trae ese día (1 → pequeño; ~70 → x1.45; 300+ → grande)
function ferryScale(nuevos) { return clamp(0.75 + Math.sqrt(Math.max(0, nuevos || 0)) / 12, 0.75, 2.0); }
function ferryXY(rc, s = 1) { return [-(0.3 + 0.75 * s), rc + 0.55 + 1.4 * s]; }   // a la izquierda del muelle: el muelle queda delante y lo tapa
function pierLen(s = 1) { return PIER_LEN * Math.max(1, 0.35 + 0.75 * s); }
function drawFerryS(fx, fy, z, t, s = 1, alpha = 1) { const [ax, ay] = P(fx, fy, 0); ctx.save(); ctx.translate(ax, ay); ctx.scale(s, s); ctx.translate(-ax, -ay); drawFerry(fx, fy, z, t, alpha); ctx.restore(); }
/* ================= CIUDAD v2 (7 nov 2026): trazado irregular, campo, sitios lógicos, playas y rocas =================
   Trazado fijo y grande (no cambia al crecer): calles por subdivisión irregular, manzanas de tamaños distintos,
   parcelas a lo largo de cada calle mirando a ella. Se ocupan desde la plaza hacia fuera, así el pueblo crece solo.
   Sitios especiales fuera del casco: cueva en costa rocosa, torre vigilando la entrada del puerto, granja/huerta en el
   campo, casa del árbol en un bosquecillo. Sus coordenadas se guardan (x, y) la primera vez para que no se muevan. */
const ZONAS = { com: { nombre: 'BARRIO DEL MUELLE' }, resA: { nombre: 'BARRIO DE LAS PALMERAS' }, resB: { nombre: 'BARRIO DEL FARO' }, bas: { nombre: 'BARRIO NUEVO' } };
const AVE = 0.35, LOT = 0.95, SETB = 0.06;
const ESPECIALES = ['puerto', 'cueva', 'torre', 'huerto', 'arbol', 'cuartel'];
// el cuartel va junto a la torre de control: zona militar al lado del puerto
function junto(torre) { const th = Math.atan2(torre.y, torre.x), r = Math.hypot(torre.x, torre.y), a = th + 0.7 / r, r2 = r - 2.1; return { x: Math.cos(a) * r2, y: Math.sin(a) * r2 }; }
// río de los kayaks (mejora "rampa_kayak" de la tienda de kayaks): sale del lado de la tienda y baja serpenteando hasta el mar
function rioKayak(plan) {
  const k = plan.items.find(i => i.forma === 'kayaks' && (i.det || i.detalles || []).includes('rampa_kayak') && i.x != null); if (!k) return null;
  const sx = k.x + 0.15, sy = k.y + 0.55, th = Math.atan2(sy + 6, sx + 1.2), ex = Math.cos(th), ey = Math.sin(th);
  let r = Math.hypot(sx, sy); const R = islandR(th, 5, CITY.seed) + 0.6, pts = [];
  for (let i = 0; i <= 40; i++) { const q = i / 40, x = lerp(sx, ex * R, q) + Math.sin(q * 9) * 0.28 * Math.sin(q * Math.PI), y = lerp(sy, ey * R, q); pts.push([x, y]); }
  return pts;
}
let _TRAZADO = null;
function trazado() {
  if (_TRAZADO) return _TRAZADO;
  const rnd = mulberry32(91373), streets = [], blocks = [];
  function split(r, depth) {
    const w = r.x1 - r.x0, h = r.y1 - r.y0, maxB = 2.4 + rnd() * 2.6;
    if (depth >= 2 && w < maxB && h < maxB) { blocks.push(r); return; }
    const vert = depth === 0 ? true : depth === 1 ? false : (w > h ? rnd() < 0.85 : rnd() < 0.15);
    const sw = depth <= 1 ? 0.7 : depth === 2 ? 0.55 : 0.42, main = depth <= 1;
    if (vert) { if (w < 2 * 2.15 + sw) { blocks.push(r); return; }
      const c = depth === 0 ? 0 : r.x0 + 2.15 + sw / 2 + rnd() * (w - 2 * 2.15 - sw);
      streets.push({ x0: c - sw / 2, x1: c + sw / 2, y0: r.y0, y1: r.y1, w: sw, main, v: true });
      split({ x0: r.x0, x1: c - sw / 2, y0: r.y0, y1: r.y1 }, depth + 1); split({ x0: c + sw / 2, x1: r.x1, y0: r.y0, y1: r.y1 }, depth + 1); }
    else { if (h < 2 * 2.15 + sw) { blocks.push(r); return; }
      const c = depth === 1 ? 0 : r.y0 + 2.15 + sw / 2 + rnd() * (h - 2 * 2.15 - sw);
      streets.push({ x0: r.x0, x1: r.x1, y0: c - sw / 2, y1: c + sw / 2, w: sw, main, v: false });
      split({ x0: r.x0, x1: r.x1, y0: r.y0, y1: c - sw / 2 }, depth + 1); split({ x0: r.x0, x1: r.x1, y0: c + sw / 2, y1: r.y1 }, depth + 1); }
  }
  split({ x0: -18, x1: 18, y0: -18, y1: 18 }, 0);
  const lots = [];
  blocks.forEach((b, bi) => {
    const W = b.x1 - b.x0, H = b.y1 - b.y0, d = LOT;
    const along = len => { const k = Math.floor((len + 1e-6) / LOT), pad = (len - k * LOT) / 2; return Array.from({ length: k }, (_, i) => pad + LOT / 2 + i * LOT); };
    for (const xo of along(W)) { lots.push({ x: b.x0 + xo, y: b.y0 + d / 2 + SETB, face: 'N', b: bi }); if (H >= 2 * d + 0.12) lots.push({ x: b.x0 + xo, y: b.y1 - d / 2 - SETB, face: 'S', b: bi }); }
    const inner = H - 2 * d - 2 * SETB;
    if (inner >= LOT) for (const yo of along(inner)) { const y = b.y0 + d + SETB + yo; lots.push({ x: b.x0 + d / 2 + SETB, y, face: 'W', b: bi }); if (W >= 2 * d + 0.12) lots.push({ x: b.x1 - d / 2 - SETB, y, face: 'E', b: bi }); }
  });
  lots.forEach((l, i) => { l.i = i; const j = (h2(i, 3, 5) - 0.5) * 0.08; if (l.face === 'N' || l.face === 'S') l.x += j; else l.y += j;
    l.dist = Math.hypot(l.x, l.y); l.th = Math.atan2(l.y, l.x);
    const dir = { S: [0, 1], N: [0, -1], E: [1, 0], W: [-1, 0] }[l.face], fx = l.x + dir[0] * (LOT / 2 + 0.3), fy = l.y + dir[1] * (LOT / 2 + 0.3);
    l.main = streets.some(s => s.main && fx >= s.x0 - 0.05 && fx <= s.x1 + 0.05 && fy >= s.y0 - 0.05 && fy <= s.y1 + 0.05); });
  return (_TRAZADO = { streets, blocks, lots });
}
const enSectorBasico = th => th < -Math.PI / 2 - 0.12 && th > -Math.PI + 0.12;
const costaV = th => Math.sin(2 * th + 1.3) + 0.6 * Math.sin(5 * th + 0.4);
const distMuelle = th => Math.abs(((th - Math.PI / 2 + Math.PI * 3) % (2 * Math.PI)) - Math.PI);
function rocoso(th) { return distMuelle(th) > 0.75 && costaV(th) > 0.45; }
// peso de roca (0 = playa, 1 = roca entera): sube suave en los extremos de cada tramo rocoso
function rocaPeso(th) { if (distMuelle(th) <= 0.75) return 0; const q = clamp((costaV(th) - 0.45) / 0.12); return q * q * (3 - 2 * q); }
// ladera de roca en un vértice: borde interior = borde de la hierba (un poco por dentro, para no dejar rendijas de arena)
function rocaV(th, i, vr = 0) { const R0 = islandR(th + vr, 5, CITY.seed), ri = R0 - anchoCosta(th) - 0.04, e = rocaPeso(th);
  return { ri, ro: ri + (R0 - ri + 0.03 + h2(i, 31) * 0.07) * e, zo: lerp(Z_GRASS - 0.004, Z_SAND * 0.55 + h2(i, 33) * 0.06, e) }; }
// altura de la ladera de roca en (x, y) (para apoyar las piedras sueltas encima)
function rocaZ(x, y) { const th = Math.atan2(y, x), v = rocaV(th, 0), r = Math.hypot(x, y); return lerp(Z_GRASS, v.zo, clamp((r - v.ri) / Math.max(0.05, v.ro - v.ri))); }
// ancho de la franja de costa (sin girar): roca estrecha; playa ancha, que se ensancha lejos de las rocas
function anchoCosta(th) { if (rocoso(th)) return 0.42; const v = costaV(th), q = distMuelle(th) <= 0.75 ? 1 : clamp((0.45 - v) / 0.5); return 0.42 + 0.75 * q * q * (3 - 2 * q); }
function callesActivas(activos) {   // calles que tocan manzanas con algo construido, a lo largo de esas manzanas
  const T = trazado(), act = activos.map(bi => T.blocks[bi]), out = [];
  for (const s of T.streets) {
    const lado = act.filter(b => s.v ? (Math.abs(b.x1 - s.x0) < 0.02 || Math.abs(b.x0 - s.x1) < 0.02) && b.y1 > s.y0 && b.y0 < s.y1
                                      : (Math.abs(b.y1 - s.y0) < 0.02 || Math.abs(b.y0 - s.y1) < 0.02) && b.x1 > s.x0 && b.x0 < s.x1);
    if (!lado.length) continue;
    if (s.v) out.push([s.x0, Math.max(s.y0, Math.min(...lado.map(b => b.y0)) - s.w), s.x1, Math.min(s.y1, Math.max(...lado.map(b => b.y1)) + s.w)]);
    else out.push([Math.max(s.x0, Math.min(...lado.map(b => b.x0)) - s.w), s.y0, Math.min(s.x1, Math.max(...lado.map(b => b.x1)) + s.w), s.y1]);
  }
  return out;
}
// Nada encima del río de los kayaks (10 nov): se planifica, se calcula el río final y, si algo ha caído encima, se vuelve a
// planificar sin esas parcelas. Lo que ya estaba no se mueve (esas parcelas no eran suyas); solo cambia lo que pisaba el río.
function planCiudad(items, nBasic, seed) {
  const fuera = new Set(), base = items.map(o => ({ ...o }));
  for (let pasada = 0; ; pasada++) {
    items.forEach((o, i) => { for (const k of ['x', 'y', 'face', 'lot']) if (k in base[i]) o[k] = base[i][k]; else delete o[k]; });
    const plan = planCiudad0(items, nBasic, seed, fuera), rio = rioKayak(plan); if (!rio || pasada >= 4) return plan;
    const cerca = (x, y) => rio.some(([a, b]) => Math.hypot(a - x, b - y) < 0.62); let n = fuera.size;
    for (const l of trazado().lots) if (cerca(l.x, l.y)) fuera.add(l.i);
    if (fuera.size === n) return plan;
  }
}
function planCiudad0(items, nBasic, seed, fuera) {
  const _vr = VIEW_ROT; VIEW_ROT = 0; CITY = null;
  const T = trazado(), libres = new Set(T.lots.map(l => l.i)), usados = [];
  const iK = items.findIndex(o => o.forma === 'kayaks' && (o.det || o.detalles || []).includes('rampa_kayak')); let idx = -1;   // el río solo cuenta para lo que llega después de la tienda de kayaks
  const especiales = items.filter(it => ESPECIALES.includes(it.forma));
  const lejosEsp = l => especiales.every(e => e.x == null || Math.hypot(e.x - l.x, e.y - l.y) > (e.forma === 'huerto' ? 2.4 : 1.7));
  for (const l of T.lots) if (l.dist < 1.95) libres.delete(l.i);                                  // plaza grande y abierta
  const jardines = [];
  const elegir = score => { let best = null, bs = 1e9; for (const i of libres) { const l = T.lots[i]; if (iK >= 0 && idx > iK && fuera.has(i)) continue; if (enSectorBasico(l.th) && l.dist > 1.8) continue; if (!lejosEsp(l)) continue; const s = score(l); if (s < bs) { bs = s; best = l; } } if (best) libres.delete(best.i); return best; };
  for (const it of items) {
    idx++;
    if (ESPECIALES.includes(it.forma)) continue;
    const neg = !['casa', 'tigre', 'unicornio'].includes(it.forma || 'casa');
    const l = elegir(neg ? (q => q.dist * (1 + 0.12 * h2(q.i, 9)) - (q.main ? 1.2 : 0)) : (q => q.dist * (1 + 0.18 * h2(q.i, 11)) + (q.main ? 0.7 : 0)));
    if (l) { Object.assign(it, { x: l.x, y: l.y, face: l.face, lot: l.i }); usados.push(l);
      // a cada lado, una parcela libre de jardín: las casas no quedan pegadas
      for (const m of T.lots) if (libres.has(m.i) && m.b === l.b && m.face === l.face && Math.hypot(m.x - l.x, m.y - l.y) < 1.2) { libres.delete(m.i); jardines.push({ ...m, de: it.u || it.usuario }); } }
  }
  const basics = [];
  for (const l of [...T.lots].filter(l => libres.has(l.i) && !fuera.has(l.i) && enSectorBasico(l.th) && lejosEsp(l)).sort((a, b) => a.dist - b.dist)) { if (basics.length >= nBasic) break; const ns = l.face === 'N' || l.face === 'S';
    for (const k of [-1, 1]) if (basics.length < nBasic) basics.push({ x: l.x + (ns ? k * 0.245 : 0), y: l.y + (ns ? 0 : k * 0.245), face: l.face, forma: 'basica', lot: l.i });
    libres.delete(l.i); usados.push(l); }
  // radio del pueblo por ángulo
  const N = 180, ang = i => i / N * 2 * Math.PI, dif = (a, b) => Math.abs(((a - b + Math.PI * 3) % (2 * Math.PI)) - Math.PI);
  const town = new Float64Array(N).fill(1.6);
  const marca = (x, y, m, arr) => { const d = Math.hypot(x, y), th = Math.atan2(y, x), w = Math.atan2(m, Math.max(0.01, d)); for (let i = 0; i < N; i++) { const dd = dif(ang(i), th); if (dd < w) arr[i] = Math.max(arr[i], (d + m) * Math.cos(dd)); } };
  for (const l of [...usados, ...jardines]) marca(l.x, l.y, 0.9, town);
  // bloques activos (para calles) y su contorno
  const activos = new Set([...usados, ...jardines].map(l => l.b));
  for (const bi of activos) { const b = T.blocks[bi]; for (const [x, y] of [[b.x0, b.y0], [b.x1, b.y0], [b.x0, b.y1], [b.x1, b.y1]]) marca(x, y, 0.7, town); }
  for (const [x0, y0, x1, y1] of callesActivas([...activos])) { const n = Math.ceil(Math.max(x1 - x0, y1 - y0) / 0.3); for (let k = 0; k <= n; k++) { const q = k / n; for (const [x, y] of [[x0 + (x1 - x0) * q, y0], [x0 + (x1 - x0) * q, y1], [x0, y0 + (y1 - y0) * q], [x1, y0 + (y1 - y0) * q]]) marca(x, y, 0.45, town); } }   // la isla siempre cubre las calles
  // forma de la isla: el pueblo + bastante campo alrededor, con cabos y calas
  const avg = town.reduce((a, b) => a + b, 0) / N, extra = 2.6 + Math.sqrt(usados.length) * 0.12;
  let sh = new Float64Array(N);
  for (let i = 0; i < N; i++) { const a = ang(i); sh[i] = Math.max(town[i] + extra * 0.75, (avg + extra) * (1 + 0.12 * Math.sin(3 * a + 1.1) + 0.09 * Math.sin(5 * a + 2.3) + 0.05 * Math.sin(9 * a + 0.7))); }
  CITY = { shape: sh, SR: 5, seed };
  const R = (th) => islandR(th, 5, seed);
  // sitios especiales (si no tienen sitio guardado)
  const libreAng = (th) => R(th) - town[Math.round(((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) / (2 * Math.PI) * N) % N];
  for (const e of especiales) {
    if (e.forma === 'puerto') { Object.assign(e, { x: 0, y: R(Math.PI / 2) - 0.3, ang: Math.PI / 2 }); continue; }
    if (e.forma === 'cuartel') { const to = especiales.find(o => o.forma === 'torre' && o.x != null); if (to) { Object.assign(e, junto(to), { face: to.face || 'E' }); continue; } }
    const costa = e.forma === 'cueva' || e.forma === 'torre', rr = th => R(th) - anchoCosta(th) - (e.forma === 'cueva' ? 0.5 : 1.1);
    if (costa && e.th != null) { Object.assign(e, { x: Math.cos(e.th) * rr(e.th), y: Math.sin(e.th) * rr(e.th) }); continue; }
    if (!costa && e.x != null) continue;
    let best = null, bs = -1e9;
    for (let k = 0; k < 360; k++) { const th = k / 360 * 2 * Math.PI, dp = dif(th, Math.PI / 2), free = libreAng(th); let s, r;
      if (e.forma === 'torre') { const a = 2.0 / R(Math.PI / 2); s = -Math.abs(dif(th, Math.PI / 2 + a)) * 20 - (dp < a * 0.6 ? 9 : 0); r = R(th) - anchoCosta(th) - 1.1; }
      else if (e.forma === 'cueva') { s = (rocoso(th) ? 6 : -6) + free * 0.5 - (dp < 1 ? 9 : 0); r = R(th) - anchoCosta(th) - 0.5; }
      else if (e.forma === 'huerto') { s = -Math.abs(free - 4.5) * 1.5 - (dp < 0.8 ? 9 : 0) - (rocoso(th) ? 2 : 0); r = (R(th) + town[k / 2 | 0]) / 2 + 0.2; }
      else { s = -Math.abs(free - 3.2) * 2 - (dp < 0.8 ? 9 : 0); r = town[k / 2 | 0] + 1.4; }
      for (const o of especiales) if (o !== e && o.x != null) { const d = Math.hypot(o.x - Math.cos(th) * r, o.y - Math.sin(th) * r); if (d < 3) s -= (3 - d) * 4; }
      if (s > bs) { bs = s; best = { x: Math.cos(th) * r, y: Math.sin(th) * r, th: costa ? th : undefined }; } }
    Object.assign(e, best, { nuevoSitio: true });
    if (e.forma === 'torre') e.face = e.x < 0 ? 'E' : 'W';
  }
  // la isla también cubre los sitios especiales
  for (const e of especiales) if (e.forma !== 'puerto') marca(e.x, e.y, e.forma === 'huerto' ? 2.0 : 1.2, town);
  for (let i = 0; i < N; i++) sh[i] = Math.max(sh[i], town[i] + 0.5 + anchoCosta(ang(i)));
  for (let p = 0; p < 3; p++) { const nx = new Float64Array(N); for (let i = 0; i < N; i++) nx[i] = Math.max(town[i] + 0.45 + anchoCosta(ang(i)), (sh[(i + N - 1) % N] + 2 * sh[i] + sh[(i + 1) % N]) / 4); sh = nx; }
  CITY.shape = sh;
  for (const e of especiales) { if (e.forma === 'puerto') e.y = R(Math.PI / 2) - 0.3; if (e.forma === 'torre') e.face = e.x < 0 ? 'E' : 'W';
    if (e.th != null) { const r = R(e.th) - anchoCosta(e.th) - (e.forma === 'cueva' ? 0.5 : 1.1); e.x = Math.cos(e.th) * r; e.y = Math.sin(e.th) * r; } }
  { const to = especiales.find(o => o.forma === 'torre'), cu = especiales.find(o => o.forma === 'cuartel'); if (to && cu) Object.assign(cu, junto(to), { face: to.face }); }
  const plan = { items, basics, especiales, activos: [...activos], usados, jardines, SR: 5, zonas: { bas: basics } };
  plan.arboles = arbolesCampo(plan, seed); plan.rocas = rocasCosta();
  VIEW_ROT = _vr;
  return plan;
}
function arbolesCampo(plan, seed) {
  const T = trazado(), out = [], occ = [...plan.usados.map(l => [l.x, l.y, 1.05]), ...plan.especiales.map(e => [e.x, e.y, e.forma === 'huerto' ? 1.9 : e.forma === 'arbol' ? 0.6 : 1.1]), ...(() => { const to = plan.especiales.find(o => o.forma === 'torre'), cu = plan.especiales.find(o => o.forma === 'cuartel'); return to && cu && to.x != null && cu.x != null ? [[(to.x + cu.x) / 2, (to.y + cu.y) / 2, 1.6]] : []; })(), [0, 0, 1.95], ...(plan.jardines || []).map(l => [l.x, l.y, 0.6])];
  const actB = plan.activos.map(bi => T.blocks[bi]);
  const rio = rioKayak(plan) || [];
  for (const l of plan.jardines || []) { const k = l.i; out.push({ x: l.x + (h2(k, 31) - 0.5) * 0.3, y: l.y + (h2(k, 32) - 0.5) * 0.3, s: 0.5 + h2(k, 33) * 0.25, de: l.de }); if (h2(k, 34) < 0.5) out.push({ x: l.x + (h2(k, 35) - 0.5) * 0.5, y: l.y + (h2(k, 36) - 0.5) * 0.5, s: 0.38, de: l.de }); }
  for (let k = 0; k < 8; k++) { const a = Math.PI / 4 + k * Math.PI / 2 + (k > 3 ? 0.35 : -0.35); out.push({ x: Math.cos(a) * 1.5, y: Math.sin(a) * 1.5, s: 0.55 }); }   // árboles de la plaza
  for (let i = -30; i <= 30; i++) for (let j = -30; j <= 30; j++) {
    const x = i * 0.75 + (h2(i, j, 1) - 0.5) * 0.5, y = j * 0.75 + (h2(i, j, 2) - 0.5) * 0.5, th = Math.atan2(y, x), r = Math.hypot(x, y);
    if (r > islandR(th, 5, seed) - anchoCosta(th) - 0.3) continue;
    if (Math.abs(x) < 0.9 && y > 0) continue;                                                   // camino al muelle
    if (occ.some(([ox, oy, m]) => Math.hypot(ox - x, oy - y) < m)) continue;
    if (rio.some(([rx, ry]) => Math.hypot(rx - x, ry - y) < 0.55)) continue;
    const enB = actB.find(b => x > b.x0 - 0.75 && x < b.x1 + 0.75 && y > b.y0 - 0.75 && y < b.y1 + 0.75);
    if (enB) { const m = 1.25; if (x > enB.x0 + m && x < enB.x1 - m && y > enB.y0 + m && y < enB.y1 - m && h2(i, j, 13) < 0.45) out.push({ x, y, s: 0.45 + h2(i, j, 4) * 0.3 }); continue; }
    const bosque = Math.sin(x * 0.55 + 1.7) * Math.cos(y * 0.6 - 0.4) + 0.5 * Math.sin((x + y) * 0.9);
    const cercaArbol = plan.especiales.some(e => e.forma === 'arbol' && Math.hypot(e.x - x, e.y - y) < 2.0);
    if (bosque > 0.35 || cercaArbol || h2(i, j, 7) < 0.09) out.push({ x, y, s: 0.55 + h2(i, j, 4) * 0.4, palm: !cercaArbol && !rocoso(th) && h2(i, j, 9) < 0.4 && r > islandR(th, 5, seed) - anchoCosta(th) - 1.2 });
  }
  return out;
}
function rocasCosta() {
  const out = [];
  for (let k = 0; k < 360; k++) { const th = k / 360 * 2 * Math.PI; if (!rocoso(th) || h2(k, 5) < 0.35) continue; const R0 = islandR(th, 5, CITY.seed);
    const r = R0 - 0.1 + (h2(k, 2) - 0.5) * 0.24; out.push({ x: Math.cos(th) * r, y: Math.sin(th) * r, s: 0.6 + h2(k, 3) * 0.8 });
    if (h2(k, 6) < 0.25) { const rw = R0 + 0.12 + h2(k, 7) * 0.2; out.push({ x: Math.cos(th) * rw, y: Math.sin(th) * rw, s: 0.5 + h2(k, 8) * 0.6, agua: true }); } }
  return out;
}
function rectW(x0, y0, x1, y1, z, col) { const a = rotXY(x0, y0), b = rotXY(x1, y1), X0 = Math.min(a[0], b[0]), X1 = Math.max(a[0], b[0]), Y0 = Math.min(a[1], b[1]), Y1 = Math.max(a[1], b[1]);
  fillPoly([P(X0, Y0, z), P(X1, Y0, z), P(X1, Y1, z), P(X0, Y1, z)], col); }
function isR0(th, R) { return islandR(th + VIEW_ROT * Math.PI / 2, R, 0); }   // radio en el marco original
function drawPierR(rc, z, len = PIER_LEN) {   // muelle del ferry, girable
  const w = 0.46, y0 = rc - 0.35, a = rotXY(-w / 2, y0), b = rotXY(w / 2, y0 + len);
  box(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), 0.05, z - 0.06, C.wood, { tcol: '#C98C57' });
  for (const [px, py] of [[-w / 2, y0 + len], [w / 2, y0 + len], [w / 2, y0 + len * 0.5]]) { const [qx, qy] = rotXY(px, py); box(qx - 0.05, qy - 0.05, 0.1, 0.1, 0.2, z - 0.1, C.woodDark); }
}
function drawRock(x, y, z, s) { const [bx, by] = P(x, y, z); const u = U() * s;
  ctx.fillStyle = '#7E7B75'; ctx.beginPath(); ctx.moveTo(bx - 0.16 * u, by); ctx.lineTo(bx - 0.1 * u, by - 0.14 * u); ctx.lineTo(bx + 0.04 * u, by - 0.19 * u); ctx.lineTo(bx + 0.16 * u, by - 0.06 * u); ctx.lineTo(bx + 0.14 * u, by + 0.03 * u); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#9C9891'; ctx.beginPath(); ctx.moveTo(bx - 0.1 * u, by - 0.14 * u); ctx.lineTo(bx + 0.04 * u, by - 0.19 * u); ctx.lineTo(bx + 0.06 * u, by - 0.08 * u); ctx.lineTo(bx - 0.06 * u, by - 0.05 * u); ctx.closePath(); ctx.fill(); }
function drawCityGround(plan, zf, alpha = 1) {
  if (alpha <= 0) return; ctx.save(); ctx.globalAlpha = alpha;
  const T = trazado(), z = zf(0, 0) + 0.004, ASF = '#A9AFAB', CAM = '#E2D9C6', TIERRA = '#C9A578', N = CITY.shape.length, VR = VIEW_ROT * Math.PI / 2;
  // costa rocosa (corregido 9 nov): ladera de roca desde el borde de la hierba (a su altura) hasta el mar, con el borde irregular;
  // en los extremos del tramo se estrecha poco a poco hacia la playa (antes: franja plana tipo muro, con arena asomando y corte brusco)
  for (let i = 0; i < N; i++) { const a0 = i / N * 2 * Math.PI, a1 = (i + 1) / N * 2 * Math.PI, e0 = rocaPeso(a0), e1 = rocaPeso(a1); if (e0 <= 0 && e1 <= 0) continue;
    const pt = (a, r, zz) => { const [rx, ry] = rotXY(Math.cos(a) * r, Math.sin(a) * r); return P(rx, ry, zz); };
    const v0 = rocaV(a0, i, VR), v1 = rocaV(a1, i + 1, VR), col = ['#8E8B85', '#85827C', '#98958E'][Math.floor(h2(i, 21) * 3)];
    fillPoly([pt(a0, v0.ri, Z_GRASS - 0.004), pt(a1, v1.ri, Z_GRASS - 0.004), pt(a1, v1.ro, v1.zo), pt(a0, v0.ro, v0.zo)], col);
    const [nx, ny] = rotXY(Math.cos((a0 + a1) / 2), Math.sin((a0 + a1) / 2));
    if (nx + ny > 0) fillPoly([pt(a0, v0.ro, v0.zo), pt(a1, v1.ro, v1.zo), pt(a1, v1.ro, 0), pt(a0, v0.ro, 0)], shade(col, -0.2)); }
  // calles: solo las que tocan manzanas con algo construido, recortadas a ellas y a la isla
  const act = plan.activos.map(bi => T.blocks[bi]), calles = [];
  const dentro = (x, y) => Math.hypot(x, y) < islandR(Math.atan2(y, x) + VR, 5, CITY.seed) - anchoCosta(Math.atan2(y, x)) - 0.3;
  const recorta = (a, b, pt) => { while (a < b && !dentro(...pt(a))) a += 0.05; while (b > a && !dentro(...pt(b))) b -= 0.05; return [a, b]; };
  for (const [x0, y0, x1, y1] of callesActivas(plan.activos)) {
    if (x1 - x0 < y1 - y0) { const cx = (x0 + x1) / 2; const [ya, yb] = recorta(y0, y1, y => [cx, y]); if (yb > ya) calles.push([x0, ya, x1, yb]); }
    else { const cy = (y0 + y1) / 2; const [xa, xb] = recorta(x0, x1, x => [x, cy]); if (xb > xa) calles.push([xa, y0, xb, y1]); }
  }
  const maxY = Math.max(1.5, ...act.filter(b => b.x0 <= 0.4 && b.x1 >= -0.4 || Math.abs(b.x0 - AVE) < 0.05 || Math.abs(b.x1 + AVE) < 0.05).map(b => b.y1));
  const muelle = [-AVE, maxY - 0.2, AVE, isR0(Math.PI / 2, 5) - 0.1]; calles.push(muelle);
  // caminos de tierra (se dibujan antes que las calles: llegan al borde de la acera y no se suben encima)
  // zona militar: explanada de grava con valla alrededor de la torre y el cuartel; un solo camino desde la puerta de la valla hasta la carretera del muelle
  { const to = plan.especiales.find(o => o.forma === 'torre'), cu = plan.especiales.find(o => o.forma === 'cuartel');
    if (to && to.x != null) { const L = [to, cu].filter(o => o && o.x != null);
      const x0 = Math.min(...L.map(o => o.x)) - 0.6, x1 = Math.max(...L.map(o => o.x)) + 0.6, y0 = Math.min(...L.map(o => o.y)) - 0.6, y1 = Math.max(...L.map(o => o.y)) + 0.6;
      const lado = muelle[0] > x1 ? 1 : -1, gx = lado > 0 ? x1 : x0, gy = clamp(to.y, y0 + 0.3, y1 - 0.3), tx = lado > 0 ? muelle[0] : muelle[2], ty = clamp(gy, muelle[1], muelle[3]);
      // camino de tierra: de la puerta de la valla a la carretera (curva suave si hace falta)
      const pts = []; for (let k = 0; k <= 20; k++) { const q = k / 20; pts.push([lerp(gx - lado * 0.05, tx, q), lerp(gy, ty, q * q * (3 - 2 * q))]); }
      const w = 0.13, A = [], B = []; for (let k = 0; k < pts.length; k++) { const p0 = pts[Math.max(0, k - 1)], p1 = pts[Math.min(pts.length - 1, k + 1)], dx = p1[0] - p0[0], dy = p1[1] - p0[1], m = Math.hypot(dx, dy) || 1; A.push([pts[k][0] - dy / m * w, pts[k][1] + dx / m * w]); B.push([pts[k][0] + dy / m * w, pts[k][1] - dx / m * w]); }
      fillPoly([...A, ...B.reverse()].map(([x, y]) => { const [rx, ry] = rotXY(x, y); return P(rx, ry, z + 0.001); }), TIERRA);
      rectW(x0, y0, x1, y1, z + 0.0008, '#C8C3A4');
      // caminito de grava más oscura de la puerta de la valla a la puerta de la torre
      rectW(Math.min(gx, to.x), to.y - 0.1, Math.max(gx, to.x), to.y + 0.1, z + 0.0009, '#B3AD8C'); if (Math.abs(gy - to.y) > 0.01) rectW(gx - 0.1, Math.min(gy, to.y), gx + 0.1, Math.max(gy, to.y), z + 0.0009, '#B3AD8C');
      const fz = (xa, ya, xb, yb, gap) => { const [a, b] = rotXY(xa, ya), [c, d] = rotXY(xb, yb); fenceLine(a, b, c, d, z, gap); };
      const gq = (gy - y0) / (y1 - y0), gap = [gq - 0.12, gq + 0.12];
      fz(x0, y0, x1, y0); fz(x0, y1, x1, y1); fz(x0, y0, x0, y1, lado < 0 ? gap : null); fz(x1, y0, x1, y1, lado > 0 ? gap : null); } }
  for (const e of plan.especiales) { if (!['huerto', 'arbol'].includes(e.forma) || e.x == null) continue;
    const cand = (e.forma === 'torre' || e.forma === 'cuartel') ? [muelle] : calles; let best = null, bd = 1e9;
    for (const [x0, y0, x1, y1] of cand) { const px = clamp(e.x, x0, x1), py = clamp(e.y, y0, y1), d = Math.hypot(px - e.x, py - e.y); if (d < bd) { bd = d; best = [px, py, Math.abs(py - e.y) > Math.abs(px - e.x)]; } }
    if (!best) continue; const [tx, ty] = best;
    const [sx, sy] = e.forma === 'torre' ? [e.x + Math.sign(tx - e.x) * 0.2, e.y] : [e.x, e.y];
    // camino con curva suave: sale del sitio y entra recto (perpendicular) en la acera
    const ent = 0.35, [ex2, ey2] = best[2] ? [tx, ty + Math.sign(sy - ty) * ent] : [tx + Math.sign(sx - tx) * ent, ty];
    const cx = (sx + ex2) / 2 + (h2(e.x * 7, e.y * 3) - 0.5) * 0.9, cy = (sy + ey2) / 2 + (h2(e.y * 5, e.x * 2) - 0.5) * 0.9;
    const pts = []; for (let k = 0; k <= 24; k++) { const q = k / 24, a = (1 - q) * (1 - q), b = 2 * q * (1 - q), c = q * q; pts.push([a * sx + b * cx + c * ex2, a * sy + b * cy + c * ey2]); }
    pts.push([tx, ty]);
    const w = 0.12, L = [], Rr = [];
    for (let k = 0; k < pts.length; k++) { const p0 = pts[Math.max(0, k - 1)], p1 = pts[Math.min(pts.length - 1, k + 1)], dx = p1[0] - p0[0], dy = p1[1] - p0[1], m = Math.hypot(dx, dy) || 1;
      L.push([pts[k][0] - dy / m * w, pts[k][1] + dx / m * w]); Rr.push([pts[k][0] + dy / m * w, pts[k][1] - dx / m * w]); }
    fillPoly([...L, ...Rr.reverse()].map(([x, y]) => { const [rx, ry] = rotXY(x, y); return P(rx, ry, z + 0.001); }), TIERRA); }
  // río de los kayaks: agua con orillas, por debajo de las calles (las calles lo cruzan con un puentecito)
  const rio = rioKayak(plan);
  if (rio) { const band = (w, col, zz) => { const A = [], B = []; for (let k = 0; k < rio.length; k++) { const p0 = rio[Math.max(0, k - 1)], p1 = rio[Math.min(rio.length - 1, k + 1)], dx = p1[0] - p0[0], dy = p1[1] - p0[1], m = Math.hypot(dx, dy) || 1, ww = w * (k === 0 ? 0.7 : 1); A.push([rio[k][0] - dy / m * ww, rio[k][1] + dx / m * ww]); B.push([rio[k][0] + dy / m * ww, rio[k][1] - dx / m * ww]); }
      fillPoly([...A, ...B.reverse()].map(([x, y]) => { const [rx, ry] = rotXY(x, y); return P(rx, ry, zz); }), col); };
    band(0.24, '#5E9E54', z + 0.0006); band(0.17, '#4FB6DE', z + 0.0007); band(0.07, '#7FD3F0', z + 0.00075); }
  for (const [x0, y0, x1, y1] of calles) rectW(x0, y0, x1, y1, z + 0.002, ASF);
  if (rio) for (const [x0, y0, x1, y1] of calles) { const hit = rio.filter(([x, y]) => x > x0 - 0.15 && x < x1 + 0.15 && y > y0 - 0.02 && y < y1 + 0.02); if (!hit.length) continue;
    const cx = hit.reduce((a, p) => a + p[0], 0) / hit.length, cy = hit.reduce((a, p) => a + p[1], 0) / hit.length, horiz = x1 - x0 > y1 - y0;
    const rail = (ax, ay, bx, by) => { const [p, q] = rotXY(ax, ay), [r2, s2] = rotXY(bx, by); box(Math.min(p, r2) - 0.02, Math.min(q, s2) - 0.02, Math.abs(r2 - p) + 0.04, Math.abs(s2 - q) + 0.04, 0.07, z + 0.002, '#D9D2C3', { tcol: '#EEE8DB' }); };
    if (horiz) { rail(cx - 0.24, y0, cx + 0.24, y0); rail(cx - 0.24, y1, cx + 0.24, y1); } else { rail(x0, cy - 0.24, x0, cy + 0.24); rail(x1, cy - 0.24, x1, cy + 0.24); } }
  // plaza
  const circ = (r, zz, col) => { const pl = []; for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2; pl.push(P(Math.cos(a) * r, Math.sin(a) * r, zz)); } fillPoly(pl, col); };
  circ(1.7, z + 0.007, '#EFE6D2'); circ(1.25, z + 0.0075, '#E7DCC4'); circ(0.6, z + 0.008, '#E2D5BA');
  // caminitos de cada parcela hasta su calle
  for (const l of [...plan.items.filter(i => i.lot != null), ...plan.basics]) { const h = LOT / 2 + SETB + 0.02, wv = l.forma === 'basica' ? 0.07 : 0.13, dir = { S: [0, 1], N: [0, -1], E: [1, 0], W: [-1, 0] }[l.face];
    if (dir[1]) rectW(l.x - wv, Math.min(l.y + dir[1] * 0.12, l.y + dir[1] * h), l.x + wv, Math.max(l.y + dir[1] * 0.12, l.y + dir[1] * h), z + 0.001, CAM); else rectW(Math.min(l.x + dir[0] * 0.12, l.x + dir[0] * h), l.y - wv, Math.max(l.x + dir[0] * 0.12, l.x + dir[0] * h), l.y + wv, z + 0.001, CAM); }
  ctx.restore();
}
function drawParks(plan, zf, push) {
  const rio = rioKayak(plan);
  if (rio) [[0.24, '#E8384F'], [0.58, '#FFC83D']].forEach(([q, col]) => { const k = Math.round(q * (rio.length - 1)), p0 = rio[k], p1 = rio[k + 1], [x, y] = rotXY(...p0);
    push(x + y, () => { const z = zf(x, y) + 0.01, dx = p1[0] - p0[0], dy = p1[1] - p0[1], m = Math.hypot(dx, dy), hull = [];
      for (let i = 0; i <= 12; i++) { const t2 = i / 12 * 2 - 1, w = 0.055 * Math.sqrt(1 - t2 * t2), [a, b] = rotXY(p0[0] + dx / m * t2 * 0.32 - dy / m * w, p0[1] + dy / m * t2 * 0.32 + dx / m * w); hull.push(P(a, b, z)); }
      for (let i = 12; i >= 0; i--) { const t2 = i / 12 * 2 - 1, w = 0.055 * Math.sqrt(1 - t2 * t2), [a, b] = rotXY(p0[0] + dx / m * t2 * 0.32 + dy / m * w, p0[1] + dy / m * t2 * 0.32 - dx / m * w); hull.push(P(a, b, z)); }
      fillPoly(hull, col); const [cx, cy] = P(x, y, z + 0.02); ctx.fillStyle = '#2B2B2B'; ctx.beginPath(); ctx.ellipse(cx, cy, U() * 0.035, U() * 0.018, 0, 0, 7); ctx.fill(); }); });
  for (const a of plan.arboles || []) { const [x, y] = rotXY(a.x, a.y), z = zf(x, y); push(x + y, () => a.palm ? drawPalm({ x, y, s: a.s * 1.1 }, z) : drawTree({ x, y, s: a.s }, z)); }
  for (const r of plan.rocas || []) { const [x, y] = rotXY(r.x, r.y); push(x + y, () => drawRock(x, y, r.agua ? 0.02 : rocaZ(r.x, r.y), r.s)); }
}
function zonaCentro(plan, k) { const L = k === 'bas' ? plan.basics : plan.items.filter(i => i.x != null); if (!L.length) return null; const xs = L.map(l => l.x), ys = L.map(l => l.y); return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 }; }
/* sitios especiales más grandes */
function drawCaveBig(o, z) { const [bx, by] = P(o.x, o.y, z); const u = U() * 1.7;
  for (const [dx, dy, r, c] of [[-0.25, -0.05, 0.42, '#8C8A86'], [0.25, 0.0, 0.38, '#7E7B75'], [0, -0.25, 0.45, '#9A9790'], [0.05, -0.05, 0.36, '#8C8A86']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(bx + dx * u, by + dy * u, r * u, r * 0.75 * u, 0, Math.PI, 0); ctx.lineTo(bx + (dx + r) * u, by + (dy + 0.05) * u); ctx.lineTo(bx + (dx - r) * u, by + (dy + 0.05) * u); ctx.fill(); }
  ctx.fillStyle = '#2A2622'; ctx.beginPath(); ctx.ellipse(bx + 0.02 * u, by + 0.02 * u, 0.15 * u, 0.2 * u, 0, Math.PI, 0); ctx.lineTo(bx + 0.17 * u, by + 0.05 * u); ctx.lineTo(bx - 0.13 * u, by + 0.05 * u); ctx.fill();
  ctx.fillStyle = '#5BAA55'; for (const [dx, dy] of [[-0.4, -0.38], [0.1, -0.55], [0.36, -0.3], [-0.1, -0.45]]) { ctx.beginPath(); ctx.arc(bx + dx * u, by + dy * u, 0.07 * u, 0, 7); ctx.fill(); } }
function drawGranja(o, z, t) {   // casita + campo de cultivo grande + cercado de caballos
  const x = o.x, y = o.y;
  const field = (x0, y0, x1, y1) => { fillPoly([P(x0, y0, z + 0.006), P(x1, y0, z + 0.006), P(x1, y1, z + 0.006), P(x0, y1, z + 0.006)], '#9A6B3F');
    for (let yy = y0 + 0.1; yy < y1 - 0.05; yy += 0.18) fillPoly([P(x0 + 0.06, yy, z + 0.008), P(x1 - 0.06, yy, z + 0.008), P(x1 - 0.06, yy + 0.08, z + 0.008), P(x0 + 0.06, yy + 0.08, z + 0.008)], '#6DB85A'); };
  field(x - 1.1, y - 1.0, x + 0.1, y + 0.1); field(x - 1.1, y + 0.25, x - 0.2, y + 1.0);
  fillPoly([P(x + 0.3, y + 0.15, z + 0.005), P(x + 1.15, y + 0.15, z + 0.005), P(x + 1.15, y + 1.05, z + 0.005), P(x + 0.3, y + 1.05, z + 0.005)], '#A8D47F');
  fenceLine(x + 0.3, y + 0.15, x + 1.15, y + 0.15, z); fenceLine(x + 0.3, y + 0.15, x + 0.3, y + 1.05, z);
  drawHouseF({ x: x + 0.7, y: y - 0.55, w: 0.62, d: 0.5, h: 0.36, hr: 0.24, roof: '#B5452E', wall: '#F3E3C3' }, z, 'S');
  for (const [hx, hy] of [[0.3, 0.05], [0.45, 0.02], [0.37, -0.08]]) { const [bx, by] = P(x + hx, y + hy, z); const u = U(); ctx.fillStyle = '#E2B84D'; ctx.beginPath(); ctx.ellipse(bx, by - 0.05 * u, 0.07 * u, 0.055 * u, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#C49A35'; ctx.lineWidth = Math.max(1, u * 0.008); ctx.stroke(); }
  drawHorse(x + 0.65, y + 0.5, z, t); drawHorse(x + 0.9, y + 0.8, z, t + 1.3);
  fenceLine(x + 1.15, y + 0.15, x + 1.15, y + 1.05, z); fenceLine(x + 0.3, y + 1.05, x + 1.15, y + 1.05, z, [0.4, 0.6]);
}
