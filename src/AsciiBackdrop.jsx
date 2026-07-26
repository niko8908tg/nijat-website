import { useEffect, useRef } from "react";

const CLAIMS =
  "NEUROMORPHIC COMPUTING · EVENT DRIVEN SYSTEMS · HARDWARE DESIGNED AND VERIFIED · " +
  "FPGA PIPELINES · SPIKING NEURAL NETWORKS · LOIHI 2 · EVENT CAMERAS · " +
  "RISC V ASSEMBLY · PYTHON EXPERIMENTS · ISTANBUL LONDON BAKU · " +
  "PROJECTS DOCUMENTED · NOTES IN MOTION · ";

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
    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      cols: 0,
      rows: 0,
      cellWidth: 12,
      cellHeight: 17,
      rowStrings: [],
      modelCells: [],
      pointerX: -1000,
      pointerY: -1000,
      pointerActive: false,
      ripples: [],
      transitionStarted: performance.now(),
      lastFrame: 0,
      raf: 0,
      visible: !document.hidden,
    };

    function createRows() {
      const charactersPerRow = Math.ceil(state.width / 6) + 4;
      state.rowStrings = Array.from({ length: state.rows }, (_, row) => {
        const offset = Math.floor(seededValue(row + 17) * CLAIMS.length);
        let text = "";
        for (let col = 0; col < charactersPerRow; col += 1) {
          text += CLAIMS[(offset + col) % CLAIMS.length];
        }
        return text;
      });
    }

    function createModel() {
      const modelCanvas = document.createElement("canvas");
      modelCanvas.width = state.cols;
      modelCanvas.height = state.rows;
      const modelContext = modelCanvas.getContext("2d");
      if (!modelContext) return;

      modelContext.clearRect(0, 0, state.cols, state.rows);
      modelContext.fillStyle = "#fff";
      modelContext.textAlign = "center";
      modelContext.textBaseline = "middle";
      modelContext.font = `800 ${Math.max(18, Math.round(state.rows * 0.48))}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      modelContext.fillText(
        "NM",
        state.cols * (state.width < 820 ? 0.56 : 0.73),
        state.rows * 0.48,
      );

      const pixels = modelContext.getImageData(0, 0, state.cols, state.rows).data;
      const modelCells = [];

      for (let row = 0; row < state.rows; row += 1) {
        for (let col = 0; col < state.cols; col += 1) {
          const alpha = pixels[(row * state.cols + col) * 4 + 3] / 255;
          if (alpha > 0.08) {
            const index = row * state.cols + col;
            modelCells.push({
              col,
              row,
              alpha,
              seed: seededValue(index + 401),
              baseChar: CLAIMS[(index + Math.floor(seededValue(row) * CLAIMS.length)) % CLAIMS.length],
            });
          }
        }
      }

      state.modelCells = modelCells;
    }

    function resize() {
      state.width = window.innerWidth;
      state.height = window.innerHeight;
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      state.cellWidth = state.width < 640 ? 10 : 12;
      state.cellHeight = state.width < 640 ? 15 : 17;
      state.cols = Math.ceil(state.width / state.cellWidth);
      state.rows = Math.ceil(state.height / state.cellHeight);

      canvas.width = Math.round(state.width * state.dpr);
      canvas.height = Math.round(state.height * state.dpr);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

      createRows();
      createModel();
      draw(performance.now());
    }

    function addRipple(x, y, quiet = false) {
      state.ripples.push({
        x,
        y,
        started: performance.now(),
        strength: quiet ? 0.42 : 1,
      });
      state.ripples = state.ripples.slice(-8);
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
      context.font = `500 10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      context.fillStyle = "rgba(221, 225, 226, 0.045)";

      for (let row = 0; row < state.rows; row += 1) {
        context.fillText(state.rowStrings[row], 0, row * state.cellHeight);
      }

      const entranceAge = time - state.transitionStarted;
      const entranceRadius = easeInOut(entranceAge / 1250) * Math.hypot(state.width, state.height);
      const modelCenterX = state.width * (state.width < 820 ? 0.56 : 0.73);
      const modelCenterY = state.height * 0.48;
      const pointerRadius = Math.max(78, Math.min(132, state.width * 0.075));
      const activeRipples = state.ripples.filter((ripple) => time - ripple.started < 1800);
      state.ripples = activeRipples;

      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `600 10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;

      for (const cell of state.modelCells) {
        const x = (cell.col + 0.5) * state.cellWidth;
        const y = (cell.row + 0.5) * state.cellHeight;
        const entranceDistance = Math.hypot(x - modelCenterX, y - modelCenterY);
        const entrance = reducedMotion
          ? 1
          : Math.max(0, Math.min(1, (entranceRadius - entranceDistance + 90) / 90));
        if (entrance <= 0) continue;

        const pointerDistance = Math.hypot(x - state.pointerX, y - state.pointerY);
        const pointerInfluence = state.pointerActive
          ? Math.max(0, 1 - pointerDistance / pointerRadius)
          : 0;

        let rippleInfluence = 0;
        for (const ripple of activeRipples) {
          const age = (time - ripple.started) / 1800;
          const radius = easeInOut(age) * Math.max(state.width, state.height) * 0.42;
          const distance = Math.hypot(x - ripple.x, y - ripple.y);
          const band = Math.max(0, 1 - Math.abs(distance - radius) / 34);
          const life = Math.sin(Math.PI * Math.max(0, Math.min(1, age)));
          rippleInfluence = Math.max(rippleInfluence, band * life * ripple.strength);
        }

        const dissolve = pointerInfluence > cell.seed * 0.92 ? pointerInfluence : 0;
        const scramble = rippleInfluence > cell.seed * 0.56 ||
          Math.sin(time * 0.0011 + cell.seed * 16) > 0.994;
        const baseOpacity = (0.075 + cell.alpha * 0.34) * entrance;
        const opacity = Math.max(0, baseOpacity * (1 - dissolve) + rippleInfluence * 0.5);
        if (opacity < 0.012) continue;

        context.fillStyle = `rgba(232, 235, 235, ${Math.min(0.78, opacity)})`;
        context.fillText(glyphFor(cell, time, scramble), x, y);
      }

      if (state.pointerActive) {
        context.beginPath();
        context.arc(state.pointerX, state.pointerY, 1.5, 0, Math.PI * 2);
        context.fillStyle = "rgba(255,255,255,.55)";
        context.fill();
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

    function onPointerMove(event) {
      state.pointerX = event.clientX;
      state.pointerY = event.clientY;
      state.pointerActive = true;
    }

    function onPointerLeave() {
      state.pointerActive = false;
    }

    function onPointerDown(event) {
      addRipple(event.clientX, event.clientY);
    }

    function onHashChange() {
      state.transitionStarted = performance.now();
      addRipple(state.width * 0.7, state.height * 0.48, true);
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

    resize();
    state.raf = window.requestAnimationFrame(frame);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(state.raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="ascii-backdrop" aria-hidden="true" />;
}
