import { useEffect, useRef } from "react";
import logoMaskSrc from "./assets/blacknici-mask.png";

const CLAIMS =
  "NEUROMORPHIC COMPUTING · EVENT DRIVEN SYSTEMS · HARDWARE DESIGNED AND VERIFIED · " +
  "FPGA PIPELINES · SPIKING NEURAL NETWORKS · LOIHI 2 · EVENT CAMERAS · " +
  "RISC V ASSEMBLY · PYTHON EXPERIMENTS · ";

const ATLAS = " ·.ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+*#@";
const FRAME_INTERVAL = 1000 / 30;

function seededValue(index) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function easeInOut(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function computeContentBounds(image) {
  const maxDim = 300;
  const scale = Math.min(1, maxDim / Math.max(image.naturalWidth, image.naturalHeight));
  const sampleWidth = Math.max(1, Math.round(image.naturalWidth * scale));
  const sampleHeight = Math.max(1, Math.round(image.naturalHeight * scale));

  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = sampleWidth;
  sampleCanvas.height = sampleHeight;
  const context = sampleCanvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return { left: 0.07, top: 0.04, width: 0.9, height: 0.9 };
  }

  context.fillStyle = "#fff";
  context.fillRect(0, 0, sampleWidth, sampleHeight);
  context.drawImage(image, 0, 0, sampleWidth, sampleHeight);
  const pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;

  let minX = sampleWidth;
  let maxX = 0;
  let minY = sampleHeight;
  let maxY = 0;

  for (let y = 0; y < sampleHeight; y += 1) {
    for (let x = 0; x < sampleWidth; x += 1) {
      const index = (y * sampleWidth + x) * 4;
      const luminance = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;

      if (luminance < 250) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return { left: 0.07, top: 0.04, width: 0.9, height: 0.9 };
  }

  const padX = (maxX - minX) * 0.04;
  const padY = (maxY - minY) * 0.04;

  return {
    left: Math.max(0, (minX - padX) / sampleWidth),
    top: Math.max(0, (minY - padY) / sampleHeight),
    width: Math.min(1, (maxX - minX + padX * 2) / sampleWidth),
    height: Math.min(1, (maxY - minY + padY * 2) / sampleHeight),
  };
}

export default function AsciiBackdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const logoImage = new Image();
    let logoReady = false;
    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      cols: 0,
      rows: 0,
      cellWidth: 4,
      cellHeight: 7,
      rowStrings: [],
      modelCells: [],
      pointerX: -1000,
      pointerY: -1000,
      pointerActive: false,
      ripples: [],
      entranceStarted: performance.now(),
      lastFrame: 0,
      raf: 0,
      visible: !document.hidden,
      logoBoundsFraction: null,
    };

    function createRows() {
      const charactersPerRow = Math.ceil(state.width / 4) + 12;
      state.rowStrings = Array.from({ length: state.rows }, (_, row) => {
        const offset = Math.floor(seededValue(row + 17) * CLAIMS.length);
        let text = "";

        for (let col = 0; col < charactersPerRow; col += 1) {
          text += CLAIMS[(offset + col) % CLAIMS.length];
        }

        return text;
      });
    }

    function createField() {
      let maskPixels = null;
      let logoBounds = null;

      if (logoReady) {
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = state.cols;
        maskCanvas.height = state.rows;
        const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });

        if (maskContext) {
          maskContext.fillStyle = "#fff";
          maskContext.fillRect(0, 0, state.cols, state.rows);

          const bounds = state.logoBoundsFraction || {
            left: 0.07,
            top: 0.04,
            width: 0.9,
            height: 0.9,
          };
          const sourceX = logoImage.naturalWidth * bounds.left;
          const sourceY = logoImage.naturalHeight * bounds.top;
          const sourceWidth = logoImage.naturalWidth * bounds.width;
          const sourceHeight = logoImage.naturalHeight * bounds.height;
          const imageAspect = sourceWidth / sourceHeight || 1;
          const maxPixelWidth = state.width * 0.82;
          const maxPixelHeight = state.height * 0.92;
          let drawPixelWidth = maxPixelWidth;
          let drawPixelHeight = drawPixelWidth / imageAspect;

          if (drawPixelHeight > maxPixelHeight) {
            drawPixelHeight = maxPixelHeight;
            drawPixelWidth = drawPixelHeight * imageAspect;
          }

          const drawWidth = drawPixelWidth / state.cellWidth;
          const drawHeight = drawPixelHeight / state.cellHeight;
          const logoLeft = (state.cols - drawWidth) / 2;
          const logoTop = (state.rows - drawHeight) / 2;
          maskContext.drawImage(
            logoImage,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            logoLeft,
            logoTop,
            drawWidth,
            drawHeight,
          );
          maskPixels = maskContext.getImageData(0, 0, state.cols, state.rows).data;
          logoBounds = { left: logoLeft, top: logoTop, width: drawWidth, height: drawHeight };
        }
      }

      const modelCells = [];
      const maskAt = (row, col) => {
        if (!maskPixels) return 0;
        const safeRow = Math.max(0, Math.min(state.rows - 1, row));
        const safeCol = Math.max(0, Math.min(state.cols - 1, col));
        const pixelIndex = (safeRow * state.cols + safeCol) * 4;
        const luminance = (
          maskPixels[pixelIndex] +
          maskPixels[pixelIndex + 1] +
          maskPixels[pixelIndex + 2]
        ) / (3 * 255);
        return Math.max(0, Math.min(1, (0.78 - luminance) / 0.5));
      };

      for (let row = 0; row < state.rows; row += 1) {
        for (let col = 0; col < state.cols; col += 1) {
          const index = row * state.cols + col;
          const logoX = logoBounds ? (col - logoBounds.left) / logoBounds.width : -1;
          const logoY = logoBounds ? (row - logoBounds.top) / logoBounds.height : -1;
          const isJawArea =
            (logoY > 0.58 && logoX > 0.08 && logoX < 0.3) ||
            (logoY > 0.55 && logoX > 0.84 && logoX < 0.96) ||
            (logoY > 0.88 && logoX > 0.28 && logoX < 0.88);
          const isMouthArea =
            (logoX > 0.4 && logoX < 0.9 && logoY > 0.64 && logoY < 0.86) ||
            (logoX > 0.7 && logoX < 0.93 && logoY > 0.6 && logoY < 0.86);
          const isUpperFacialHair =
            logoX > 0.42 && logoX < 0.69 && logoY > 0.54 && logoY < 0.635;
          const isLowerFacialHair =
            logoX > 0.61 && logoX < 0.9 && logoY > 0.87 && logoY < 0.97;
          const isRightEye =
            logoX > 0.61 && logoX < 0.78 && logoY > 0.42 && logoY < 0.61;
          const isNoseArea =
            logoX > 0.49 && logoX < 0.67 && logoY > 0.46 && logoY < 0.69;
          const isFineDetail = isRightEye || isNoseArea;
          const rawMask = maskAt(row, col);
          let mask = rawMask;

          if (isUpperFacialHair || isLowerFacialHair) continue;

          if (isMouthArea) {
            const boundaryStrength = Math.max(
              rawMask - maskAt(row, col - 1),
              rawMask - maskAt(row, col + 1),
              rawMask - maskAt(row - 1, col),
              rawMask - maskAt(row + 1, col),
            );
            mask = rawMask > 0.08 && boundaryStrength > 0.08 ? 1 : 0;
          } else if (isJawArea) {
            const neighbors = [
              maskAt(row, col - 1),
              maskAt(row, col + 1),
              maskAt(row - 1, col),
              maskAt(row + 1, col),
            ].sort((a, b) => b - a);
            const coreMask = neighbors[2];
            mask = rawMask > 0.08 && coreMask > 0.08 ? 1 : 0;
          }

          if (mask < 0.06 && seededValue(index + 73) < 0.72) continue;

          const claimIndex =
            (index + Math.floor(seededValue(row) * CLAIMS.length)) % CLAIMS.length;
          const baseChar = CLAIMS[claimIndex];
          let mouthChar = baseChar;

          if (isMouthArea && mask > 0 && !/[A-Z0-9]/.test(mouthChar)) {
            for (let offset = 1; offset < CLAIMS.length; offset += 1) {
              const candidate = CLAIMS[(claimIndex + offset) % CLAIMS.length];
              if (/[A-Z0-9]/.test(candidate)) {
                mouthChar = candidate;
                break;
              }
            }
          }

          modelCells.push({
            col,
            row,
            alpha: seededValue(index + 911),
            mask: Math.pow(mask, 0.72),
            fineDetail: isFineDetail && rawMask > 0.08,
            seed: seededValue(index + 401),
            baseChar: isMouthArea && mask > 0 ? mouthChar : baseChar,
          });
        }
      }

      state.modelCells = modelCells;
    }

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      state.width = Math.max(1, Math.round(bounds.width));
      state.height = Math.max(1, Math.round(bounds.height));
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      state.cellWidth = state.width < 280 ? 3.5 : 4;
      state.cellHeight = state.width < 280 ? 6 : 7;
      state.cols = Math.ceil(state.width / state.cellWidth);
      state.rows = Math.ceil(state.height / state.cellHeight);

      canvas.width = Math.round(state.width * state.dpr);
      canvas.height = Math.round(state.height * state.dpr);
      context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      createRows();
      createField();
      draw(performance.now());
    }

    function addRipple(x, y, quiet = false) {
      state.ripples.push({
        x,
        y,
        started: performance.now(),
        strength: quiet ? 0.42 : 1,
      });
      state.ripples = state.ripples.slice(-6);
    }

    function glyphFor(cell, time, scramble) {
      if (!scramble) return cell.baseChar;
      const frame = Math.floor(time / 54);
      const index = Math.floor(seededValue(cell.seed * 1000 + frame) * ATLAS.length);
      return ATLAS[index] || "·";
    }

    function draw(time) {
      if (!state.width || !state.height) return;

      context.clearRect(0, 0, state.width, state.height);
      context.textAlign = "left";
      context.textBaseline = "top";
      context.font = `500 6px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      context.fillStyle = "rgba(222, 225, 226, 0.065)";

      for (let row = 0; row < state.rows; row += 1) {
        context.fillText(state.rowStrings[row], 0, row * state.cellHeight);
      }

      const entranceAge = time - state.entranceStarted;
      const entranceRadius = easeInOut(entranceAge / 1100) * Math.hypot(state.width, state.height);
      const centerX = state.width * 0.5;
      const centerY = state.height * 0.5;
      const pointerRadius = Math.max(54, Math.min(92, state.width * 0.24));
      const activeRipples = state.ripples.filter((ripple) => time - ripple.started < 1800);
      state.ripples = activeRipples;

      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `600 6px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;

      for (const cell of state.modelCells) {
        const x = (cell.col + 0.5) * state.cellWidth;
        const y = (cell.row + 0.5) * state.cellHeight;
        const entranceDistance = Math.hypot(x - centerX, y - centerY);
        const entrance = reducedMotion
          ? 1
          : Math.max(0, Math.min(1, (entranceRadius - entranceDistance + 70) / 70));
        if (entrance <= 0) continue;

        const pointerDistance = Math.hypot(x - state.pointerX, y - state.pointerY);
        const pointerInfluence = state.pointerActive
          ? Math.max(0, 1 - pointerDistance / pointerRadius)
          : 0;

        let rippleInfluence = 0;
        for (const ripple of activeRipples) {
          const age = (time - ripple.started) / 1800;
          const radius = easeInOut(age) * Math.max(state.width, state.height) * 0.72;
          const distance = Math.hypot(x - ripple.x, y - ripple.y);
          const band = Math.max(0, 1 - Math.abs(distance - radius) / 24);
          const life = Math.sin(Math.PI * Math.max(0, Math.min(1, age)));
          rippleInfluence = Math.max(rippleInfluence, band * life * ripple.strength);
        }

        const dissolve = pointerInfluence > cell.seed * 0.92 ? pointerInfluence : 0;
        const scramble =
          rippleInfluence > cell.seed * 0.56 ||
          Math.sin(time * 0.0011 + cell.seed * 16) > 0.994;
        const glyph = glyphFor(cell, time, scramble);
        const maskOpacity = cell.mask * (cell.fineDetail ? 0.94 : 0.78);
        const baseOpacity = (0.012 + cell.alpha * 0.04 + maskOpacity) * entrance;
        const opacity = Math.max(0, baseOpacity * (1 - dissolve) + rippleInfluence * 0.5);
        if (opacity < 0.012) continue;

        context.fillStyle = `rgba(232, 232, 232, ${Math.min(0.96, opacity)})`;
        context.fillText(glyph, x, y);
      }
    }

    function frame(time) {
      if (!state.visible) return;
      if (time - state.lastFrame >= FRAME_INTERVAL) {
        state.lastFrame = time;
        draw(time);
      }
      state.raf = window.requestAnimationFrame(frame);
    }

    function localPointer(event) {
      const bounds = canvas.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const inside = x >= 0 && x <= bounds.width && y >= 0 && y <= bounds.height;
      return { x, y, inside };
    }

    function onPointerMove(event) {
      const pointer = localPointer(event);
      state.pointerX = pointer.x;
      state.pointerY = pointer.y;
      state.pointerActive = pointer.inside;
    }

    function onPointerDown(event) {
      const pointer = localPointer(event);
      if (pointer.inside) addRipple(pointer.x, pointer.y);
    }

    function onHashChange() {
      state.entranceStarted = performance.now();
      addRipple(state.width * 0.5, state.height * 0.5, true);
    }

    function onVisibilityChange() {
      state.visible = !document.hidden;
      if (state.visible) {
        state.lastFrame = 0;
        state.raf = window.requestAnimationFrame(frame);
      } else {
        window.cancelAnimationFrame(state.raf);
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    logoImage.decoding = "async";
    logoImage.onload = () => {
      logoReady = true;
      state.logoBoundsFraction = computeContentBounds(logoImage);
      createField();
      draw(performance.now());
    };
    logoImage.src = logoMaskSrc;
    resizeObserver.observe(canvas);
    resize();
    state.raf = window.requestAnimationFrame(frame);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(state.raf);
      resizeObserver.disconnect();
      logoImage.onload = null;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="ascii-backdrop" aria-hidden="true" />;
}
