const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}
const table = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  table[n] = c;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

function createPng(width, height, getPixel) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = makeChunk('IHDR', ihdrData);

  const raw = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    raw[offset++] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      raw[offset++] = r;
      raw[offset++] = g;
      raw[offset++] = b;
      raw[offset++] = a;
    }
  }
  const idat = makeChunk('IDAT', zlib.deflateSync(raw));
  const iend = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, ihdr, idat, iend]);
}

const publicDir = path.resolve(__dirname, '../public');
fs.mkdirSync(publicDir, { recursive: true });

function renderMagicIcon(x, y, w, h, isMaskable = false) {
  const nx = x / w;
  const ny = y / h;
  const cx = 0.5;
  const cy = 0.5;
  const dx = nx - cx;
  const dy = ny - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background Gradient (Deep Indigo to Purple to Violet)
  const bgR = Math.floor(79 + (124 - 79) * nx + (147 - 79) * ny);
  const bgG = Math.floor(70 + (58 - 70) * nx + (51 - 70) * ny);
  const bgB = Math.floor(229 + (237 - 229) * nx + (234 - 229) * ny);

  // Rounded squircle corner for non-maskable icons
  if (!isMaskable) {
    const cornerR = 0.22;
    const qx = Math.max(Math.abs(dx) - (0.5 - cornerR), 0);
    const qy = Math.max(Math.abs(dy) - (0.5 - cornerR), 0);
    const outside = Math.sqrt(qx * qx + qy * qy);
    if (outside > cornerR) {
      return [0, 0, 0, 0]; // Transparent
    }
  }

  // Safe scale
  const scale = isMaskable ? 0.65 : 0.8;
  const sx = (nx - cx) / scale + cx;
  const sy = (ny - cy) / scale + cy;

  // Let's draw an iconic "M" + Database Cylinders
  // Cylinder 1 (top): cy=0.35, width=0.45, rx=0.22, ry=0.07
  // Cylinder 2 (mid): cy=0.52
  // Cylinder 3 (bot): cy=0.69
  const inCylinder = (px, py, baseY) => {
    const dX = (px - 0.5) / 0.23;
    const dY = (py - baseY) / 0.08;
    return (dX * dX + dY * dY) <= 1.0;
  };

  const inCylinderBody = (px, py, topY, botY) => {
    return Math.abs(px - 0.5) <= 0.23 && py >= topY && py <= botY;
  };

  let isIcon = false;
  let isHighlight = false;

  // Top cap
  if (inCylinder(sx, sy, 0.35)) {
    isIcon = true;
    if (sy < 0.35) isHighlight = true;
  }
  // Mid section
  if (inCylinderBody(sx, sy, 0.35, 0.48) || inCylinder(sx, sy, 0.48)) {
    isIcon = true;
  }
  // Bot section
  if (inCylinderBody(sx, sy, 0.48, 0.62) || inCylinder(sx, sy, 0.62)) {
    isIcon = true;
  }

  // Sparkle / Star at top-right (sx ~ 0.72, sy ~ 0.28)
  const starX = Math.abs(sx - 0.72);
  const starY = Math.abs(sy - 0.28);
  if ((starX < 0.08 && starY < 0.02) || (starY < 0.08 && starX < 0.02) || (starX * starY < 0.0015 && starX < 0.07 && starY < 0.07)) {
    return [255, 255, 255, 255];
  }

  if (isIcon) {
    // Database groove lines
    if (Math.abs(sy - 0.41) < 0.012 || Math.abs(sy - 0.55) < 0.012) {
      return [99, 102, 241, 240];
    }
    if (isHighlight) {
      return [255, 255, 255, 255];
    }
    return [240, 245, 255, 255];
  }

  // Outer subtle glow
  return [Math.min(255, bgR), Math.min(255, bgG), Math.min(255, bgB), 255];
}

console.log('Generating PWA icons...');

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, (x, y, w, h) => renderMagicIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, (x, y, w, h) => renderMagicIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, (x, y, w, h) => renderMagicIcon(x, y, w, h, true)));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, (x, y, w, h) => renderMagicIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(48, 48, (x, y, w, h) => renderMagicIcon(x, y, w, h, false)));

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="magicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="50%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#ec4899" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#4f46e5" flood-opacity="0.4"/>
    </filter>
  </defs>
  <rect width="512" height="512" rx="120" fill="url(#magicGrad)"/>
  <g filter="url(#glow)">
    <!-- Top Cylinder -->
    <ellipse cx="256" cy="180" rx="120" ry="38" fill="#ffffff" />
    <path d="M 136 180 V 230 C 136 268 376 268 376 230 V 180 Z" fill="#e0e7ff" opacity="0.95"/>
    <ellipse cx="256" cy="230" rx="120" ry="38" fill="#c7d2fe" opacity="0.4" />
    <!-- Mid Cylinder -->
    <path d="M 136 245 V 295 C 136 333 376 333 376 295 V 245 Z" fill="#e0e7ff" opacity="0.95"/>
    <ellipse cx="256" cy="295" rx="120" ry="38" fill="#c7d2fe" opacity="0.4" />
    <!-- Bottom Cylinder -->
    <path d="M 136 310 V 360 C 136 398 376 398 376 360 V 310 Z" fill="#ffffff"/>
    <!-- Sparkle Stars -->
    <path d="M 370 120 Q 370 145 395 145 Q 370 145 370 170 Q 370 145 345 145 Q 370 145 370 120 Z" fill="#ffffff"/>
    <path d="M 140 130 Q 140 145 155 145 Q 140 145 140 160 Q 140 145 125 145 Q 140 145 140 130 Z" fill="#fde047"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
console.log('PWA icons created successfully in /public!');
