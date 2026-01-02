(function () {
  const DEFAULT_URL = "https://oktv.ge/";
  const DATA_CODEWORDS = 19;
  const EC_CODEWORDS = 7;
  const MODULE_COUNT = 21;
  const QUIET_ZONE = 4;

  const gfExp = new Array(512);
  const gfLog = new Array(256);

  (function initGalois() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      gfExp[i] = x;
      gfLog[x] = i;
      x <<= 1;
      if (x & 0x100) {
        x ^= 0x11d;
      }
    }
    for (let i = 255; i < 512; i++) {
      gfExp[i] = gfExp[i - 255];
    }
  })();

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return gfExp[gfLog[a] + gfLog[b]];
  }

  function polyMul(p, q) {
    const result = new Array(p.length + q.length - 1).fill(0);
    for (let i = 0; i < p.length; i++) {
      for (let j = 0; j < q.length; j++) {
        result[i + j] ^= gfMul(p[i], q[j]);
      }
    }
    return result;
  }

  function rsGeneratorPoly(degree) {
    let poly = [1];
    for (let i = 0; i < degree; i++) {
      poly = polyMul(poly, [1, gfExp[i]]);
    }
    return poly;
  }

  function rsCompute(data, degree) {
    const gen = rsGeneratorPoly(degree);
    const ec = new Array(degree).fill(0);
    data.forEach((byte) => {
      const factor = byte ^ ec[0];
      ec.shift();
      ec.push(0);
      for (let i = 0; i < degree; i++) {
        ec[i] ^= gfMul(gen[i + 1], factor);
      }
    });
    return ec;
  }

  function pushBits(buffer, value, length) {
    for (let i = length - 1; i >= 0; i--) {
      buffer.push((value >> i) & 1);
    }
  }

  function buildDataBits(text) {
    const encoder = window.TextEncoder ? new TextEncoder() : null;
    const bytes = encoder
      ? Array.from(encoder.encode(text))
      : Array.from(text).map((ch) => ch.charCodeAt(0) & 0xff);

    const bits = [];
    pushBits(bits, 0x4, 4);
    pushBits(bits, bytes.length, 8);
    bytes.forEach((b) => pushBits(bits, b, 8));

    const maxBits = DATA_CODEWORDS * 8;
    const remaining = maxBits - bits.length;
    if (remaining > 0) {
      pushBits(bits, 0, Math.min(4, remaining));
    }
    while (bits.length % 8 !== 0) {
      bits.push(0);
    }

    const dataBytes = [];
    for (let i = 0; i < bits.length; i += 8) {
      let value = 0;
      for (let j = 0; j < 8; j++) {
        value = (value << 1) | bits[i + j];
      }
      dataBytes.push(value);
    }

    let padToggle = true;
    while (dataBytes.length < DATA_CODEWORDS) {
      dataBytes.push(padToggle ? 0xec : 0x11);
      padToggle = !padToggle;
    }

    const ecBytes = rsCompute(dataBytes, EC_CODEWORDS);
    const allBytes = dataBytes.concat(ecBytes);
    const finalBits = [];
    allBytes.forEach((byte) => {
      for (let i = 7; i >= 0; i--) {
        finalBits.push((byte >> i) & 1);
      }
    });

    return finalBits;
  }

  function placeFinder(modules, row, col) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = row + r;
        const cc = col + c;
        if (rr < 0 || rr >= MODULE_COUNT || cc < 0 || cc >= MODULE_COUNT) {
          continue;
        }
        if (r === -1 || r === 7 || c === -1 || c === 7) {
          modules[rr][cc] = false;
        } else if (r === 0 || r === 6 || c === 0 || c === 6) {
          modules[rr][cc] = true;
        } else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) {
          modules[rr][cc] = true;
        } else {
          modules[rr][cc] = false;
        }
      }
    }
  }

  function setupTiming(modules) {
    for (let i = 8; i < MODULE_COUNT - 8; i++) {
      const dark = i % 2 === 0;
      modules[6][i] = dark;
      modules[i][6] = dark;
    }
  }

  function getBCHDigit(data) {
    let digit = 0;
    while (data !== 0) {
      digit++;
      data >>>= 1;
    }
    return digit;
  }

  function getBCHTypeInfo(data) {
    let d = data << 10;
    const g = 0x537;
    while (getBCHDigit(d) - getBCHDigit(g) >= 0) {
      d ^= g << (getBCHDigit(d) - getBCHDigit(g));
    }
    return ((data << 10) | d) ^ 0x5412;
  }

  function setupFormatInfo(modules, maskPattern) {
    const errorLevel = 1;
    const formatInfo = getBCHTypeInfo((errorLevel << 3) | maskPattern);

    for (let i = 0; i < 15; i++) {
      const mod = ((formatInfo >> i) & 1) === 1;
      if (i < 6) {
        modules[8][i] = mod;
      } else if (i < 8) {
        modules[8][i + 1] = mod;
      } else {
        modules[8][MODULE_COUNT - 15 + i] = mod;
      }

      if (i < 8) {
        modules[MODULE_COUNT - i - 1][8] = mod;
      } else {
        modules[14 - i][8] = mod;
      }
    }
    modules[MODULE_COUNT - 8][8] = true;
  }

  function mapData(modules, dataBits, maskPattern) {
    let bitIndex = 0;
    let direction = -1;

    for (let col = MODULE_COUNT - 1; col > 0; col -= 2) {
      if (col === 6) {
        col -= 1;
      }
      for (let i = 0; i < MODULE_COUNT; i++) {
        const row = direction === -1 ? MODULE_COUNT - 1 - i : i;
        for (let c = 0; c < 2; c++) {
          const cc = col - c;
          if (modules[row][cc] !== null) continue;
          const bit = bitIndex < dataBits.length ? dataBits[bitIndex++] : 0;
          const masked = maskPattern === 0 ? (row + cc) % 2 === 0 : false;
          modules[row][cc] = masked ? !bit : bit;
        }
      }
      direction *= -1;
    }
  }

  function createMatrix(text) {
    const modules = Array.from({ length: MODULE_COUNT }, () =>
      Array.from({ length: MODULE_COUNT }, () => null)
    );

    placeFinder(modules, 0, 0);
    placeFinder(modules, 0, MODULE_COUNT - 7);
    placeFinder(modules, MODULE_COUNT - 7, 0);
    setupTiming(modules);

    const dataBits = buildDataBits(text);
    mapData(modules, dataBits, 0);
    setupFormatInfo(modules, 0);

    return modules;
  }

  function drawQr(canvas, modules, size) {
    const totalModules = MODULE_COUNT + QUIET_ZONE * 2;
    const moduleSize = Math.max(4, Math.ceil(size / totalModules));
    const actualSize = moduleSize * totalModules;

    canvas.width = actualSize;
    canvas.height = actualSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, actualSize, actualSize);
    ctx.fillStyle = "#0f172a";

    for (let r = 0; r < MODULE_COUNT; r++) {
      for (let c = 0; c < MODULE_COUNT; c++) {
        if (modules[r][c]) {
          const x = (c + QUIET_ZONE) * moduleSize;
          const y = (r + QUIET_ZONE) * moduleSize;
          ctx.fillRect(x, y, moduleSize, moduleSize);
        }
      }
    }
  }

  function resolvePayload(value) {
    if (!value) return DEFAULT_URL;
    try {
      const resolved = new URL(value, window.location.origin).href;
      const encoder = window.TextEncoder ? new TextEncoder() : null;
      const length = encoder
        ? encoder.encode(resolved).length
        : resolved.length;
      if (length > 17) {
        return DEFAULT_URL;
      }
      return resolved;
    } catch (error) {
      return DEFAULT_URL;
    }
  }

  function initQr() {
    document.querySelectorAll(".footer-qr-canvas").forEach((canvas) => {
      const sizeAttr = parseInt(canvas.getAttribute("data-qr-size"), 10);
      const size = Number.isFinite(sizeAttr) ? sizeAttr : 168;
      const payload = resolvePayload(canvas.getAttribute("data-qr-url"));
      const modules = createMatrix(payload);
      drawQr(canvas, modules, size);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initQr);
  } else {
    initQr();
  }
})();
