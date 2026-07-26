import { useEffect, useRef } from "react";

const PARAMETERS = {
  pointsNumber: 40,
  widthFactor: 0.045,
  spring: 0.4,
  friction: 0.5,
};

export default function CurlyCursor() {
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
    let pixelRatio = 1;
    let animationFrame = 0;
    let pointerMoved = false;

    const pointer = {
      x: viewportWidth / 2,
      y: viewportHeight / 2,
    };

    const trail = Array.from({ length: PARAMETERS.pointsNumber }, () => ({
      x: pointer.x,
      y: pointer.y,
      dx: 0,
      dy: 0,
    }));

    const resizeCanvas = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(viewportWidth * pixelRatio);
      canvas.height = Math.round(viewportHeight * pixelRatio);
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const updatePointer = (event) => {
      pointerMoved = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const draw = (time) => {
      if (!pointerMoved) {
        pointer.x =
          (0.5 + 0.3 * Math.cos(0.002 * time) * Math.sin(0.005 * time)) *
          viewportWidth;
        pointer.y =
          (0.5 +
            0.2 * Math.cos(0.005 * time) +
            0.1 * Math.cos(0.01 * time)) *
          viewportHeight;
      }

      context.clearRect(0, 0, viewportWidth, viewportHeight);

      trail.forEach((point, index) => {
        const previous = index === 0 ? pointer : trail[index - 1];
        const spring =
          index === 0 ? 0.4 * PARAMETERS.spring : PARAMETERS.spring;

        point.dx += (previous.x - point.x) * spring;
        point.dy += (previous.y - point.y) * spring;
        point.dx *= PARAMETERS.friction;
        point.dy *= PARAMETERS.friction;
        point.x += point.dx;
        point.y += point.dy;
      });

      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "rgba(208, 208, 208, 0.72)";

      for (let index = 0; index < trail.length - 1; index += 1) {
        const previous = trail[Math.max(0, index - 1)];
        const point = trail[index];
        const next = trail[index + 1];
        const startX =
          index === 0 ? point.x : 0.5 * (previous.x + point.x);
        const startY =
          index === 0 ? point.y : 0.5 * (previous.y + point.y);
        const endX = 0.5 * (point.x + next.x);
        const endY = 0.5 * (point.y + next.y);

        context.beginPath();
        context.moveTo(startX, startY);
        context.quadraticCurveTo(point.x, point.y, endX, endY);
        context.lineWidth = Math.max(
          0.12,
          PARAMETERS.widthFactor * (PARAMETERS.pointsNumber - index),
        );
        context.stroke();
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    animationFrame = window.requestAnimationFrame(draw);

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", updatePointer, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", updatePointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="curly-cursor"
      aria-hidden="true"
    />
  );
}
