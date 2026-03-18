import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const root = process.cwd();

function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePng(width, height, pixels) {
  const stride = width * 4;
  const rows = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    rows[y * (stride + 1)] = 0;
    for (let x = 0; x < width; x += 1) {
      const src = (y * width + x) * 4;
      const dst = y * (stride + 1) + 1 + x * 4;
      rows[dst] = pixels[src];
      rows[dst + 1] = pixels[src + 1];
      rows[dst + 2] = pixels[src + 2];
      rows[dst + 3] = pixels[src + 3];
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", zlib.deflateSync(rows)),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

function writePng(relPath, width, height, painter) {
  const pixels = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const rgba = painter(x, y, width, height);
      const index = (y * width + x) * 4;
      pixels[index] = rgba[0];
      pixels[index + 1] = rgba[1];
      pixels[index + 2] = rgba[2];
      pixels[index + 3] = rgba[3];
    }
  }

  const out = path.join(root, relPath);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, makePng(width, height, pixels));
}

function rect(x, y, w, h, color, set) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      set(xx, yy, color);
    }
  }
}

function drawItem(relPath, base, accent, glow, kind) {
  const width = 16;
  const height = 16;
  const pixels = Buffer.alloc(width * height * 4);
  const set = (x, y, rgba) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const index = (y * width + x) * 4;
    pixels[index] = rgba[0];
    pixels[index + 1] = rgba[1];
    pixels[index + 2] = rgba[2];
    pixels[index + 3] = rgba[3];
  };

  if (kind === "pistol") {
    rect(4, 7, 8, 3, base, set);
    rect(10, 8, 4, 1, glow, set);
    rect(6, 10, 2, 4, accent, set);
    rect(3, 8, 1, 1, accent, set);
    rect(11, 7, 1, 1, glow, set);
  } else if (kind === "rifle") {
    rect(2, 6, 12, 3, base, set);
    rect(12, 6, 4, 2, glow, set);
    rect(4, 9, 3, 4, accent, set);
    rect(2, 5, 4, 1, accent, set);
    rect(8, 5, 3, 1, glow, set);
  } else if (kind === "scatter") {
    rect(3, 6, 9, 4, base, set);
    rect(12, 7, 4, 2, glow, set);
    rect(5, 10, 3, 4, accent, set);
    rect(3, 5, 4, 1, accent, set);
    rect(9, 6, 1, 4, glow, set);
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      if (pixels[index + 3] === 0) continue;
      const darken = ((x + y) % 3) * 6;
      pixels[index] = Math.max(0, pixels[index] - darken);
      pixels[index + 1] = Math.max(0, pixels[index + 1] - darken);
      pixels[index + 2] = Math.max(0, pixels[index + 2] - darken);
    }
  }

  const out = path.join(root, relPath);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, makePng(width, height, pixels));
}

drawItem("assets/dfsp/textures/item/pulse_pistol.png", [91, 108, 122, 255], [44, 61, 77, 255], [36, 220, 206, 255], "pistol");
drawItem("assets/dfsp/textures/item/pulse_rifle.png", [76, 92, 112, 255], [30, 44, 58, 255], [84, 195, 255, 255], "rifle");
drawItem("assets/dfsp/textures/item/scattergun.png", [108, 97, 90, 255], [64, 53, 48, 255], [255, 142, 67, 255], "scatter");

writePng("assets/dfsp/textures/block/reactor_frame.png", 16, 16, (x, y) => {
  const edge = x < 3 || x > 12 || y < 3 || y > 12;
  const brace = x === y || x + y === 15;
  if (edge) return [88, 102, 117, 255];
  if (brace) return [59, 70, 82, 255];
  return [24, 30, 38, 255];
});

writePng("assets/dfsp/textures/block/reactor_core.png", 16, 16, (x, y) => {
  const dx = x - 7.5;
  const dy = y - 7.5;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 2.2) return [169, 255, 255, 255];
  if (dist < 4.2) return [42, 214, 255, 255];
  if (dist < 6.2) return [19, 92, 143, 255];
  return [7, 23, 48, 255];
});

writePng("pack.png", 64, 64, (x, y, width, height) => {
  const edge = x < 4 || y < 4 || x >= width - 4 || y >= height - 4;
  const centerX = width / 2;
  const centerY = height / 2;
  const dx = x - centerX + 0.5;
  const dy = y - centerY + 0.5;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (edge) return [22, 29, 38, 255];
  if (dist < 10) return [94, 242, 255, 255];
  if (dist < 16) return [26, 143, 184, 255];
  if ((Math.abs(dx) < 5 && Math.abs(dy) < 22) || (Math.abs(dx) < 22 && Math.abs(dy) < 5)) {
    return [76, 95, 109, 255];
  }
  return [10 + ((x + y) % 9), 18 + (y % 12), 26 + (x % 18), 255];
});
