'use strict';
/* Dibujos extra compartidos por los vídeos (engine) y la isla en directo (web: isla-extras.js).
   Edificio: drawCustom(o, z, t)  ·  detalles: drawDetails(o, z, t)
   o = { x, y, forma, color, pared, puerta, det: [...] , ang (puerto) } */


/* ===== edificios orientados: face = 'S' (+y, cara izquierda visible), 'E' (+x, derecha visible), 'N'/'W' (de espaldas) ===== */
function roofAlongY(x, y, w, d, z, h, hr, roof, wall) {
  const ov = 0.07, xa = x - ov, xb = x + w + ov, ya = y - ov, yb = y + d + ov, zr = z + h, zt = z + h + hr, xm = x + w / 2, Y = y + d;
  fillPolyS([P(xa, ya, zr), P(xa, yb, zr), P(xm, yb, zt), P(xm, ya, zt)], shade(roof, -0.12));
  fillPolyS([P(x, Y, zr), P(x + w, Y, zr), P(xm, Y, zt)], wall);
  fillPolyS([P(xb, ya, zr), P(xb, yb, zr), P(xm, yb, zt), P(xm, ya, zt)], roof);
  const r1 = P(xm, ya, zt), r2 = P(xm, yb, zt); ctx.strokeStyle = shade(roof, 0.35); ctx.lineWidth = Math.max(1.5, U() * 0.025); ctx.beginPath(); ctx.moveTo(r1[0], r1[1]); ctx.lineTo(r2[0], r2[1]); ctx.stroke();
}
function roofAlongX(x, y, w, d, z, h, hr, roof, wall) {
  const ov = 0.07, xa = x - ov, xb = x + w + ov, ya = y - ov, yb = y + d + ov, zr = z + h, zt = z + h + hr, ym = y + d / 2, X = x + w;
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
  } else {
    fillPoly(faceL(x + w * 0.4, x + w * 0.6, z + h * 0.3, z + h * 0.6, Y), C.glass);
    if (rot) fillPoly(faceR(y + d * 0.4, y + d * 0.6, z + h * 0.3, z + h * 0.6, X), shade(C.glass, -0.2));
  }
}

function drawTreeHouse(o, z) {
  const x = o.x, y = o.y; shadowAt(x, y, z, 0.45, 0.22);
  box(x - 0.08, y - 0.08, 0.16, 0.16, 0.62, z, C.woodDark);
  for (const [dx, dy] of [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]]) box(x + dx - 0.03, y + dy - 0.03, 0.06, 0.06, 0.6, z, C.wood);
  box(x - 0.36, y - 0.36, 0.72, 0.72, 0.06, z + 0.6, C.wood, { tcol: '#C98C57' });
  const [lx, ly] = P(x, y, z + 0.95); const u = U();
  ctx.fillStyle = '#3E9A4F'; for (const [dx, dy, r] of [[-0.35, 0.05, 0.3], [0.35, 0.0, 0.3], [0, -0.25, 0.36]]) { ctx.beginPath(); ctx.arc(lx + dx * u, ly + dy * u - 0.25 * u, r * u, 0, 7); ctx.fill(); }
  drawHouse({ x, y, w: 0.46, d: 0.42, h: 0.3, hr: 0.22, roof: '#4FA36B', wall: '#E8C9A0' }, z + 0.66);
  const a = P(x - 0.1, y + 0.45, z), b = P(x - 0.1, y + 0.36, z + 0.62); ctx.strokeStyle = C.woodDark; ctx.lineWidth = Math.max(2, u * 0.025);
  for (const off of [-0.06, 0.06]) { ctx.beginPath(); ctx.moveTo(a[0] + off * u, a[1]); ctx.lineTo(b[0] + off * u, b[1]); ctx.stroke(); }
  for (let k = 1; k < 6; k++) { const q = k / 6; ctx.beginPath(); ctx.moveTo(lerp(a[0], b[0], q) - 0.06 * u, lerp(a[1], b[1], q)); ctx.lineTo(lerp(a[0], b[0], q) + 0.06 * u, lerp(a[1], b[1], q)); ctx.stroke(); }
  ctx.fillStyle = '#58B865'; ctx.beginPath(); ctx.arc(lx + 0.42 * u, ly - 0.05 * u, 0.2 * u, 0, 7); ctx.fill();
}
function signBoard(x, y, z, kind, label) {
  const [bx, by] = P(x, y, z); const u = U();
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
  // barquita amarrada
  const bxw = o.x + cx * 0.75 - cy * 0.45, byw = o.y + cy * 0.75 + cx * 0.45; const [px, py] = P(bxw, byw, Z_SAND - 0.12);
  ctx.fillStyle = '#F2614C'; ctx.beginPath(); ctx.moveTo(px - 0.3 * u, py - 0.08 * u); ctx.lineTo(px + 0.3 * u, py - 0.08 * u); ctx.lineTo(px + 0.2 * u, py + 0.06 * u); ctx.lineTo(px - 0.22 * u, py + 0.06 * u); ctx.fill();
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(px - 0.08 * u, py - 0.24 * u, 0.16 * u, 0.16 * u);
  ctx.fillStyle = C.navy; ctx.fillRect(px - 0.005 * u, py - 0.42 * u, 0.012 * u, 0.2 * u);
  const [sx, sy] = P(o.x - cy * 0.25, o.y + cx * 0.25, z); signBoard(o.x - cy * 0.25, o.y + cx * 0.25, z, '#FFFFFF', 'PUERTO');
}
function drawRestaurant(o, z) {
  shopWithSign(o, z, o.color || '#C8233A', 'RESTAURANTE', '#FFFFFF');
  const tx = o.x + 0.15, ty = o.y + 0.5; box(tx - 0.08, ty - 0.08, 0.16, 0.16, 0.14, z, '#FFFFFF');
  const [ux, uy] = P(tx, ty, z + 0.42); const u = U(); ctx.fillStyle = C.woodDark; const [ex, ey] = P(tx, ty, z + 0.14); ctx.fillRect(ux - 0.01 * u, uy, 0.02 * u, ey - uy);
  ctx.fillStyle = '#C8233A'; ctx.beginPath(); ctx.ellipse(ux, uy, 0.24 * u, 0.09 * u, 0, Math.PI, 0); ctx.fill();
}
function drawUnicornio(o, z) {
  shadowAt(o.x, o.y, z, 0.42, 0.2);
  drawHouse({ x: o.x, y: o.y, roof: '#C9A2F2', h: 0.44, wall: '#FFE4F2' }, z);
  const u = U(); const [hx, hy] = P(o.x - 0.31, o.y + 0.05, z + 0.66);   // cuerno dorado en el frontón
  ctx.fillStyle = '#F5C542'; ctx.beginPath(); ctx.moveTo(hx - 0.05 * u, hy); ctx.lineTo(hx + 0.05 * u, hy); ctx.lineTo(hx + 0.02 * u, hy - 0.32 * u); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#E0A92A'; ctx.lineWidth = Math.max(1, u * 0.012); for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(hx - 0.05 * u + k * 0.008 * u, hy - k * 0.07 * u); ctx.lineTo(hx + 0.05 * u - k * 0.004 * u, hy - k * 0.07 * u - 0.03 * u); ctx.stroke(); }
  const cols = ['#FF8FB1', '#FFC861', '#8FE3B0', '#7FC8FF', '#B79BFF'];          // crin de colores por el tejado
  for (let i = 0; i < 5; i++) { const [mx, my] = P(o.x - 0.2 + i * 0.12, o.y - 0.02, z + 0.72 - i * 0.01); ctx.fillStyle = cols[i]; ctx.beginPath(); ctx.arc(mx, my, 0.07 * u, 0, 7); ctx.fill(); }
}
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
  if (f === 'cueva') return drawCave(o, z);
  if (f === 'puerto') return drawPuerto(o, z);
  if (f === 'tienda') return drawShopF({ x: o.x, y: o.y, col: o.color }, z, o.face);
  if (f === 'basica') return drawBasic(o, z);
  if (f === 'unicornio') return drawUnicornio(o, z);
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
function drawCat(x, y, z, t, s = 1, col = '#F29F4B') {
  const [bx, by] = P(x, y, z); const u = U() * s; const bob = Math.sin(t * 3 + x) * 0.01 * u;
  ctx.fillStyle = 'rgba(20,40,40,0.2)'; ctx.beginPath(); ctx.ellipse(bx, by, 0.1 * u, 0.04 * u, 0, 0, 7); ctx.fill();
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(bx, by - 0.07 * u, 0.09 * u, 0.06 * u, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(bx + 0.07 * u, by - 0.14 * u + bob, 0.05 * u, 0, 7); ctx.fill();
  for (const dx of [0.04, 0.1]) { ctx.beginPath(); ctx.moveTo(bx + dx * u - 0.02 * u, by - 0.17 * u + bob); ctx.lineTo(bx + dx * u, by - 0.22 * u + bob); ctx.lineTo(bx + dx * u + 0.02 * u, by - 0.17 * u + bob); ctx.fill(); }
  ctx.strokeStyle = col; ctx.lineWidth = 0.02 * u; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(bx - 0.08 * u, by - 0.08 * u); ctx.quadraticCurveTo(bx - 0.16 * u, by - 0.12 * u + Math.sin(t * 4 + x) * 0.03 * u, bx - 0.13 * u, by - 0.2 * u); ctx.stroke();
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
  ctx.fillStyle = '#DDDDDD'; ctx.fillRect(bx - 0.012 * u, by - 0.75 * u, 0.024 * u, 0.75 * u);
  const fw = 0.36 * u, fh = 0.22 * u, x0 = bx + 0.012 * u, y0 = by - 0.74 * u;
  const wv = (q) => Math.sin(t * 4 + q * 3) * 0.015 * u;
  const quad = (q0, q1, r0, r1, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x0 + fw * q0, y0 + fh * r0 + wv(q0)); ctx.lineTo(x0 + fw * q1, y0 + fh * r0 + wv(q1)); ctx.lineTo(x0 + fw * q1, y0 + fh * r1 + wv(q1)); ctx.lineTo(x0 + fw * q0, y0 + fh * r1 + wv(q0)); ctx.closePath(); ctx.fill(); };
  if (kind === 'peru') { quad(0, 1 / 3, 0, 1, '#D91023'); quad(1 / 3, 2 / 3, 0, 1, '#FFFFFF'); quad(2 / 3, 1, 0, 1, '#D91023'); }
  else if (kind === 'espana') { quad(0, 1, 0, 0.25, '#AA151B'); quad(0, 1, 0.25, 0.75, '#F1BF00'); quad(0, 1, 0.75, 1, '#AA151B'); }
  else if (kind === 'canarias') { quad(0, 1 / 3, 0, 1, '#FFFFFF'); quad(1 / 3, 2 / 3, 0, 1, '#0768A9'); quad(2 / 3, 1, 0, 1, '#FCD116'); }
  else if (kind === 'zamora') { for (let i = 0; i < 8; i++) quad(0, 1, i / 8, (i + 1) / 8, '#C8102E'); quad(0, 0.35, 0, 0.3, '#2E7D32'); }
  else if (kind === 'cuba') { for (let i = 0; i < 5; i++) quad(0, 1, i / 5, (i + 1) / 5, i % 2 ? '#FFFFFF' : '#002A8F');
    ctx.fillStyle = '#CF142B'; ctx.beginPath(); ctx.moveTo(x0, y0 + wv(0)); ctx.lineTo(x0 + fw * 0.42, y0 + fh * 0.5 + wv(0.42)); ctx.lineTo(x0, y0 + fh + wv(0)); ctx.closePath(); ctx.fill(); }
}
function drawFlagPeru(x, y, z, t) { drawFlag(x, y, z, t, 'peru'); }
function drawHamster(x, y, z, t, s = 1) { drawCobaya(x, y, z, t, s * 0.8, '#E59A4C'); }
function drawHeart(o, z) { const w = 0.62, d = 0.55; const [hx, hy] = P(o.x + w * 0.2, o.y + d / 2, z + 0.24); const u = U(); const r = 0.05 * u;
  ctx.fillStyle = '#E8384F'; ctx.beginPath(); ctx.moveTo(hx, hy + r * 1.4); ctx.bezierCurveTo(hx - r * 2.2, hy - r * 0.2, hx - r * 0.9, hy - r * 1.9, hx, hy - r * 0.6); ctx.bezierCurveTo(hx + r * 0.9, hy - r * 1.9, hx + r * 2.2, hy - r * 0.2, hx, hy + r * 1.4); ctx.fill(); }
function drawFlowers(o, z) { const cols = ['#F2614C', '#FFC83D', '#E76F8A', '#B66DFF'];
  for (let i = 0; i < 8; i++) { const [fx, fy] = P(o.x - 0.3 + i * 0.085, o.y + 0.34, z); ctx.fillStyle = '#3E9A4F'; ctx.fillRect(fx - 1, fy - U() * 0.06, 2, U() * 0.06); ctx.fillStyle = cols[i % 4]; ctx.beginPath(); ctx.arc(fx, fy - U() * 0.07, Math.max(2, U() * 0.028), 0, 7); ctx.fill(); } }
function drawPool(o, z) { const x = o.x + 0.62, y = o.y - 0.05, w = 0.42, d = 0.5;
  fillPoly([P(x - w / 2, y - d / 2, z + 0.01), P(x + w / 2, y - d / 2, z + 0.01), P(x + w / 2, y + d / 2, z + 0.01), P(x - w / 2, y + d / 2, z + 0.01)], '#FFFFFF');
  fillPoly([P(x - w / 2 + 0.05, y - d / 2 + 0.05, z + 0.012), P(x + w / 2 - 0.05, y - d / 2 + 0.05, z + 0.012), P(x + w / 2 - 0.05, y + d / 2 - 0.05, z + 0.012), P(x - w / 2 + 0.05, y + d / 2 - 0.05, z + 0.012)], '#4FC3E8'); }
function drawDetails(o, z, t) {
  const det = o.det || []; let flags = 0;
  for (const d of det) {
    if (d === 'gato') drawCat(o.x - 0.15, o.y + 0.5, z, t, 1.2);
    if (d === 'gato_negro') drawCat(o.x + 0.2, o.y + 0.3, z, t, 1.1, '#2B2B2B');
    if (d === 'gatos') { drawCat(o.x + 0.45, o.y - 0.12, z, t, 1.25, '#4A4A4A'); drawCat(o.x + 0.45, o.y + 0.18, z, t + 1, 1.25); }
    if (d === 'cobaya') drawCobaya(o.x + 0.5, o.y + 0.2, z, t, 1.4);
    if (d === 'hamster') drawHamster(o.x + 0.15, o.y + 0.5, z, t, 1.4);
    if (d === 'chihuahua') drawDog(o.x + 0.2, o.y + 0.52, z, t, 1.2, '#D9A866', '#B98545', true);
    if (d === 'perros') { drawDog(o.x - 0.2, o.y + 0.55, z, t, 1.2); drawDog(o.x + 0.25, o.y + 0.5, z, t + 1, 1.1, '#F2F2F2', '#9A9A9A'); }
    if (d === 'corazon') drawHeart(o, z);
    if (d === 'flores') drawFlowers(o, z);
    if (['peru', 'espana', 'zamora', 'cuba', 'canarias'].includes(d)) { drawFlag(o.x + 0.2 - flags * 0.32, o.y + flags * 0.05, z + 0.7, t + flags, d); flags++; }
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
window.islandR = function (th, R, seed) {
  if (!CITY) return _islandR0(th, R, seed);
  const N = CITY.shape.length; let f = (((th / (2 * Math.PI)) % 1) + 1) % 1 * N;
  const i = Math.floor(f) % N, j = (i + 1) % N, a = f - Math.floor(f), v = CITY.shape[i] * (1 - a) + CITY.shape[j] * a;
  if (Math.abs(seed - (CITY.seed + 1.3)) < 1e-9) { const k = R / grassRad(CITY.SR); return Math.max(0.1, (v - 0.38) * k); }   // hierba casi hasta la orilla
  return v * R / CITY.SR;
};
const FERRY_DX = 0.95, FERRY_DY = 1.95, PIER_LEN = 2.7;   // ferry atracado entero en el agua, junto al muelle largo
function ferryXY(rc) { return [FERRY_DX, rc + FERRY_DY]; }
const ZONAS = {
  com:  { sx: 1, sy: 1, p: 0.95, s: 0.42, b: 2, nombre: 'BARRIO DEL MUELLE', pad: '#E9E2D0', mix: true },
  resA: { sx: -1, sy: 1, p: 0.95, s: 0.42, b: 2, nombre: 'BARRIO DE LAS PALMERAS', pad: '#E6EAD6', mix: true },
  resB: { sx: 1, sy: -1, p: 0.95, s: 0.42, b: 2, nombre: 'BARRIO DEL FARO', pad: '#EDE3D6', mix: true },
  bas:  { sx: -1, sy: -1, p: 0.62, s: 0.36, b: 2, nombre: 'BARRIO NUEVO', pad: '#DFE5E8' },
};
const CITY_OFF = 0.8, AVE = 0.34;
/* parcelas de una zona: en los barrios mixtos, manzanas desplazadas, algo de desorden y algún parque */
function zonaLots(q, n) {
  const cand = [];
  for (let c = 0; c < 14; c++) for (let r = 0; r < 14; r++) {
    const bi = Math.floor(c / q.b), bj = Math.floor(r / q.b);
    let X = CITY_OFF + q.p / 2 + c * q.p + bi * q.s, Y = CITY_OFF + q.p / 2 + r * q.p + bj * q.s, park = false, d;
    if (q.mix) {
      park = (c + r > 1) && h2(c, r, 11) < 0.14;
      d = Math.hypot(c, r * 1.15) + h2(c, r, 7) * 0.9;
    } else d = Math.max(c, r) * 10 + c + r + r * 0.01;
    const lc = c % q.b, lr = r % q.b, porFilas = q.mix ? (bi + bj) % 2 === 0 : true;
    const face = porFilas ? (lr === q.b - 1 ? (q.sy > 0 ? 'S' : 'N') : (q.sy > 0 ? 'N' : 'S')) : (lc === q.b - 1 ? (q.sx > 0 ? 'E' : 'W') : (q.sx > 0 ? 'W' : 'E'));
    cand.push({ c, r, bi, bj, x: q.sx * X, y: q.sy * Y, park, d, face });
  }
  cand.sort((a, b) => a.d - b.d);
  const out = []; let k = 0;
  for (const l of cand) { if (k >= n) break; out.push(l); if (!l.park) k++; }
  return out;
}
function planCiudad(items, nBasic, seed) {
  CITY = null;
  const grupos = { com: [], resA: [], resB: [] }; let puerto = null, nr = 0; const orden = ['com', 'resA', 'resB'];
  for (const it of items) { if (it.forma === 'puerto') { puerto = it; continue; } grupos[orden[nr++ % 3]].push(it); }
  const zonas = {}, parks = [];
  for (const k of orden) { const L = zonaLots(ZONAS[k], grupos[k].length); let i = 0;
    for (const l of L) { if (l.park) { parks.push(l); continue; } Object.assign(grupos[k][i++], { x: l.x, y: l.y, zona: k, face: l.face }); } zonas[k] = L; }
  const basics = zonaLots(ZONAS.bas, nBasic).map(l => ({ ...l, forma: 'basica', zona: 'bas' })); zonas.bas = basics;
  // forma de la isla: cubre todas las parcelas con margen
  const N = 180, need = new Float64Array(N);
  for (let i = 0; i < N; i++) need[i] = _islandR0(i / N * 2 * Math.PI, 1.9, seed);
  const pts = [];
  for (const k in zonas) { const q = ZONAS[k]; for (const l of zonas[k]) pts.push([l.x, l.y, q.p * 0.5 + 0.75]); }
  pts.push([0, 0, 1.4]);
  // las calles que rodean cada barrio también tienen que quedar en tierra
  for (const k in zonas) { const q = ZONAS[k], L = zonas[k]; if (!L.length) continue;
    const mbi = Math.max(...L.map(l => Math.floor(l.c / q.b))), mbj = Math.max(...L.map(l => Math.floor(l.r / q.b)));
    const far = n => CITY_OFF + n * q.b * q.p + (n - 0.5) * q.s + q.s / 2, Xm = far(mbi + 1), Ym = far(mbj + 1);
    for (let f = 0; f <= 1.0001; f += 0.1) { pts.push([q.sx * Xm, q.sy * lerp(AVE, Ym, f), 0.55]); pts.push([q.sx * lerp(AVE, Xm, f), q.sy * Ym, 0.55]); } }
  for (const [x, y, m] of pts) { const d = Math.hypot(x, y), th = Math.atan2(y, x), w = Math.atan2(m, Math.max(0.01, d));
    for (let i = 0; i < N; i++) { const a = i / N * 2 * Math.PI; let dd = Math.abs(((a - th + Math.PI * 3) % (2 * Math.PI)) - Math.PI); if (dd < w) need[i] = Math.max(need[i], (d + m) * Math.cos(dd)); } }
  let sh = Float64Array.from(need);
  for (let pass = 0; pass < 4; pass++) { const nx = new Float64Array(N); for (let i = 0; i < N; i++) { let s = 0; for (let k = -4; k <= 4; k++) s += sh[(i + k + N) % N]; nx[i] = Math.max(need[i], s / 9); } sh = nx; }
  // salientes y entrantes que aparecen según crece la ciudad (nunca delante del muelle)
  const tot = items.length + nBasic, ang = i => i / N * 2 * Math.PI, dif = (a, b) => Math.abs(((a - b + Math.PI * 3) % (2 * Math.PI)) - Math.PI);
  for (let k = 0; k < 7; k++) {
    const a0 = h2(k, 17, 3) * 2 * Math.PI; if (dif(a0, Math.PI / 2) < 0.6) continue;
    const umbral = k * 22; if (tot <= umbral) continue;
    const amp = (k % 3 === 2 ? -0.9 : 1) * Math.min(3.2, 0.8 + (tot - umbral) / 35), w = 0.12 + h2(k, 5, 9) * 0.2;
    for (let i = 0; i < N; i++) { const g = Math.exp(-Math.pow(dif(ang(i), a0) / w, 2)); sh[i] = Math.max(need[i] + 0.25, sh[i] + amp * g); }
  }
  for (let pass = 0; pass < 2; pass++) { const nx = new Float64Array(N); for (let i = 0; i < N; i++) nx[i] = Math.max(need[i] + 0.2, (sh[(i + N - 1) % N] + 2 * sh[i] + sh[(i + 1) % N]) / 4); sh = nx; }
  for (let i = 0; i < N; i++) sh[i] *= 1 + 0.03 * Math.sin(ang(i) * 7 + seed) + 0.02 * Math.sin(ang(i) * 13 + seed * 2);
  const SR = 5; CITY = { shape: sh, SR, seed };
  // el puerto es el muelle del ferry (uno solo); su dueño lo va mejorando como cualquier construcción
  if (puerto) { const r = islandR(Math.PI / 2, SR, seed); Object.assign(puerto, { x: 0, y: r - 0.3, ang: Math.PI / 2, zona: 'puerto' }); }
  return { items, basics, zonas, parks, SR };
}
function rectW(x0, y0, x1, y1, z, col) { fillPoly([P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)], col); }
function drawCityGround(plan, zf, alpha = 1) {
  if (alpha <= 0) return; ctx.save(); ctx.globalAlpha = alpha;
  const z = zf(0, 0) + 0.004, ASF = '#A9AFAB', ACERA = '#D9D3C4', CAMINO = '#E2D9C6';
  const W2 = (xa, xb, ya, yb, zz, col) => rectW(Math.min(xa, xb), Math.min(ya, yb), Math.max(xa, xb), Math.max(ya, yb), zz, col);
  for (const k in plan.zonas) { const q = ZONAS[k], L = plan.zonas[k]; if (!L.length) continue;
    const mbi = Math.max(...L.map(l => Math.floor(l.c / q.b))), mbj = Math.max(...L.map(l => Math.floor(l.r / q.b)));
    const edge = n => CITY_OFF + n * q.b * q.p + (n - 0.5) * q.s;                  // centro de la calle n
    const far = n => edge(n) + q.s / 2;
    const Xmax = far(mbi + 1), Ymax = far(mbj + 1);
    // calles: una entre cada fila y columna de manzanas, y otra rodeando el barrio
    for (let n = 1; n <= mbi + 1; n++) { const c = edge(n); W2(q.sx * (c - q.s / 2), q.sx * (c + q.s / 2), q.sy * AVE, q.sy * Ymax, z, ASF); }
    for (let n = 1; n <= mbj + 1; n++) { const c = edge(n); W2(q.sx * AVE, q.sx * Xmax, q.sy * (c - q.s / 2), q.sy * (c + q.s / 2), z, ASF); }
    // caminito de cada casa hasta su calle
    for (const l of L) { if (l.park) { W2(l.x - q.p * 0.45, l.x + q.p * 0.45, l.y - q.p * 0.45, l.y + q.p * 0.45, z + 0.001, '#7FC56C'); continue; }
      const h = q.p / 2 + 0.02, wv = q.p * 0.14;
      if (l.face === 'S') W2(l.x - wv, l.x + wv, l.y + 0.12, l.y + h, z + 0.002, CAMINO);
      if (l.face === 'N') W2(l.x - wv, l.x + wv, l.y - 0.12, l.y - h, z + 0.002, CAMINO);
      if (l.face === 'E') W2(l.x + 0.12, l.x + h, l.y - wv, l.y + wv, z + 0.002, CAMINO);
      if (l.face === 'W') W2(l.x - 0.12, l.x - h, l.y - wv, l.y + wv, z + 0.002, CAMINO); }
  }
  // avenidas en cruz (con aceras) y plaza
  const R = CITY ? CITY.SR : 3; const ye = islandR(Math.PI / 2, R, 0) - 0.1, yb = -islandR(-Math.PI / 2, R, 0) + 0.35, xe = islandR(0, R, 0) - 0.35, xb = -islandR(Math.PI, R, 0) + 0.35;
  rectW(-AVE - 0.08, yb, AVE + 0.08, ye, z + 0.004, ACERA); rectW(xb, -AVE - 0.08, xe, AVE + 0.08, z + 0.004, ACERA);
  rectW(-AVE, yb, AVE, ye, z + 0.005, ASF); rectW(xb, -AVE, xe, AVE, z + 0.005, ASF);
  ctx.setLineDash([U() * 0.12, U() * 0.12]); ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = Math.max(1, U() * 0.025);
  for (const [a, b] of [[[0, 0.9], [0, ye]], [[0, -0.9], [0, yb]], [[0.9, 0], [xe, 0]], [[-0.9, 0], [xb, 0]]]) { ctx.beginPath(); const p0 = P(a[0], a[1], z + 0.006), p1 = P(b[0], b[1], z + 0.006); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke(); }
  ctx.setLineDash([]);
  const pl = []; for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2; pl.push(P(Math.cos(a) * 0.78, Math.sin(a) * 0.78, z + 0.007)); } fillPoly(pl, '#EFE6D2');
  const pl2 = []; for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2; pl2.push(P(Math.cos(a) * 0.5, Math.sin(a) * 0.5, z + 0.008)); } fillPoly(pl2, '#E2D5BA');
  ctx.restore();
}
function drawParks(plan, zf, push) { for (const l of plan.parks || []) { const z = zf(l.x, l.y);
  push(l.x + l.y - 0.2, () => drawTree({ x: l.x - 0.18, y: l.y - 0.1, s: 0.75 }, z)); push(l.x + l.y + 0.2, () => drawTree({ x: l.x + 0.15, y: l.y + 0.18, s: 0.6 }, z)); } }
function zonaCentro(plan, k) { const L = plan.zonas[k]; if (!L || !L.length) return null; const xs = L.map(l => l.x), ys = L.map(l => l.y); return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2, top: { x: Math.min(...xs), y: Math.min(...ys) } }; }
