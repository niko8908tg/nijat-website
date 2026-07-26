import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "[role='button']",
  ".globe-canvas",
  ".travel-map-svg",
].join(",");

const ACCENT = { red: 255, green: 90, blue: 32 };
const TRAIL_LENGTH = 34;

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function accent(alpha) {
  return `rgba(${ACCENT.red}, ${ACCENT.green}, ${ACCENT.blue}, ${alpha})`;
}

export default function TopographicCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!canvas || !finePointer.matches || reducedMotion.matches) {
      return undefined;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let targetX = viewportWidth / 2;
    let targetY = viewportHeight / 2;
    let cursorX = targetX;
    let cursorY = targetY;
    let hoverTarget = 0;
    let hoverAmount = 0;
    let visibilityTarget = 0;
    let visibility = 0;
    let speed = 0;
    let animationFrame = 0;
    const trail = [];

    const resizeCanvas = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;

      const naturalRatio = Math.min(window.devicePixelRatio || 1, 2);
      const safeRatio = Math.min(
        naturalRatio,
        3072 / Math.max(viewportWidth, viewportHeight),
      );

      canvas.width = Math.round(viewportWidth * safeRatio);
      canvas.height = Math.round(viewportHeight * safeRatio);
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;
      context.setTransform(safeRatio, 0, 0, safeRatio, 0, 0);
    };

    const isInteractive = (target) =>
      target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR));

    const handlePointerMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      visibilityTarget = 1;
      hoverTarget = isInteractive(event.target) ? 1 : 0;
    };

    const handlePointerOver = (event) => {
      hoverTarget = isInteractive(event.target) ? 1 : 0;
    };

    const handlePointerDown = () => {
      hoverAmount = Math.max(hoverAmount, 0.6);
    };

    const handlePointerLeave = () => {
      visibilityTarget = 0;
      hoverTarget = 0;
    };

    const draw = () => {
      const previousX = cursorX;
      const previousY = cursorY;

      cursorX += (targetX - cursorX) * 0.18;
      cursorY += (targetY - cursorY) * 0.18;
      hoverAmount += (hoverTarget - hoverAmount) * 0.15;
      visibility += (visibilityTarget - visibility) * 0.12;

      const movement = Math.hypot(cursorX - previousX, cursorY - previousY);
      speed += (movement - speed) * 0.2;

      trail.push({ x: cursorX, y: cursorY });
      if (trail.length > TRAIL_LENGTH) {
        trail.shift();
      }

      context.clearRect(0, 0, viewportWidth, viewportHeight);

      if (visibility > 0.002) {
        const speedFactor = clamp((speed - 1.5) / 6);

        if (speedFactor > 0.02 && trail.length > 1) {
          context.lineWidth = 1.4;
          context.lineCap = "round";
          context.lineJoin = "round";

          for (let index = 1; index < trail.length; index += 1) {
            const progress = index / trail.length;
            const opacity =
              progress * progress * 0.7 * visibility * speedFactor;

            context.beginPath();
            context.moveTo(trail[index - 1].x, trail[index - 1].y);
            context.lineTo(trail[index].x, trail[index].y);
            context.strokeStyle = accent(opacity);
            context.stroke();
          }
        }

        const dotOpacity = (1 - hoverAmount) * visibility;
        if (dotOpacity > 0.002) {
          context.beginPath();
          context.arc(cursorX, cursorY, 4.5, 0, Math.PI * 2);
          context.fillStyle = accent(dotOpacity);
          context.fill();
        }

        if (hoverAmount > 0.01) {
          context.beginPath();
          context.arc(
            cursorX,
            cursorY,
            6 + hoverAmount * 8,
            0,
            Math.PI * 2,
          );
          context.lineWidth = 1.25;
          context.strokeStyle = accent(hoverAmount * visibility);
          context.stroke();
        }
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    animationFrame = window.requestAnimationFrame(draw);

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave,
    );
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="topographic-cursor"
      aria-hidden="true"
    />
  );
}
