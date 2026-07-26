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
      cellWidth: 5,
      cellHeight: 8,
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
      let maskValues = null;
      let logoBounds = null;

      if (logoReady) {
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = state.cols;
        maskCanvas.height = state.rows;
        const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });

        if (maskContext) {
          maskContext.fillStyle = "#fff";
          maskContext.fillRect(0, 0, state.cols, state.rows);

          const sourceX = logoImage.naturalWidth * 0.07;
          const sourceY = logoImage.naturalHeight * 0.04;
          const sourceWidth = logoImage.naturalWidth * 0.86;
          const sourceHeight = logoImage.naturalHeight * 0.9;
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
          maskValues = new Float32Array(state.cols * state.rows);
          logoBounds = { left: logoLeft, top: logoTop, width: drawWidth, height: drawHeight };

          for (let index = 0; index < maskValues.length; index += 1) {
            const pixelIndex = index * 4;
            const luminance = (
              maskPixels[pixelIndex] +
              maskPixels[pixelIndex + 1] +
              maskPixels[pixelIndex + 2]
            ) / (3 * 255);
            maskValues[index] = Math.max(0, Math.min(1, (0.8 - luminance) / 0.48));
          }
        }
      }

      const modelCells = [];

      for (let row = 0; row < state.rows; row += 1) {
        for (let col = 0; col < state.cols; col += 1) {
          const index = row * state.cols + col;
          const rawMask = maskValues?.[index] ?? 0;
          let edgeMask = 0;

          if (maskValues) {
            const left = maskValues[row * state.cols + Math.max(0, col - 1)] ?? 0;
            const right = maskValues[row * state.cols + Math.min(state.cols - 1, col + 1)] ?? 0;
            const above = maskValues[Math.max(0, row - 1) * state.cols + col] ?? 0;
            const below = maskValues[Math.min(state.rows - 1, row + 1) * state.cols + col] ?? 0;
            edgeMask = Math.max(
              Math.abs(rawMask - left),
              Math.abs(rawMask - right),
              Math.abs(rawMask - above),
              Math.abs(rawMask - below),
            );
          }

          const logoX = logoBounds ? (col - logoBounds.left) / logoBounds.width : -1;
          const logoY = logoBounds ? (row - logoBounds.top) / logoBounds.height : -1;
          const isFaceFeatureArea =
            logoX > 0.16 && logoX < 0.88 && logoY > 0.38 && logoY < 0.91;
          const mask = Math.min(
            1,
            rawMask * (isFaceFeatureArea ? 0.96 : 0.25) +
              edgeMask * (isFaceFeatureArea ? 0.5 : 0.72),
          );
          if (mask < 0.06 && seededValue(index + 73) < 0.72) continue;

          modelCells.push({
            col,
            row,
            alpha: seededValue(index + 911),
            mask: Math.pow(mask, 0.72),
            seed: seededValue(index + 401),
            baseChar:
              CLAIMS[(index + Math.floor(seededValue(row) * CLAIMS.length)) % CLAIMS.length],
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
      state.cellWidth = state.width < 280 ? 4 : 5;
      state.cellHeight = state.width < 280 ? 7 : 8;
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
      context.font = `500 7px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      context.fillStyle = "rgba(222, 225, 226, 0.045)";

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
      context.font = `600 7px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;

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
        const baseOpacity = (0.01 + cell.alpha * 0.032 + cell.mask * 0.86) * entrance;
        const opacity = Math.max(0, baseOpacity * (1 - dissolve) + rippleInfluence * 0.5);
        if (opacity < 0.012) continue;

        context.fillStyle = `rgba(232, 235, 235, ${Math.min(0.92, opacity)})`;
        context.fillText(glyphFor(cell, time, scramble), x, y);
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
