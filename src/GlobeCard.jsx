import { useEffect, useRef } from "react";
import createGlobe from "cobe";

const BAKU = [40.4093, 49.8671];
const ISTANBUL = [41.0082, 28.9784];

export default function GlobeCard() {
  const viewportRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    if (!viewport || !canvas) return undefined;

    let width = 0;
    let phi = -2.25;
    let theta = 0.25;
    let animationId = 0;
    let isDragging = false;
    let previousX = 0;
    let previousY = 0;

    const resize = () => {
      width = viewport.offsetWidth;
    };
    resize();

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi,
      theta,
      dark: 1,
      diffuse: 1.7,
      mapSamples: 16000,
      mapBrightness: 2.5,
      baseColor: [0.72, 0.72, 0.7],
      markerColor: [0.72, 0.72, 0.7],
      glowColor: [0.27, 0.27, 0.26],
      opacity: 1,
      scale: 0.92,
      markerElevation: 0.015,
      markers: [
        { id: "baku", location: BAKU, size: 0.055 },
        {
          id: "istanbul",
          location: ISTANBUL,
          size: 0.085,
          color: [1, 0.76, 0.18],
        },
      ],
      arcs: [
        {
          id: "baku-istanbul",
          from: BAKU,
          to: ISTANBUL,
          color: [0.83, 0.83, 0.81],
        },
      ],
      arcColor: [0.83, 0.83, 0.81],
      arcWidth: 0.42,
      arcHeight: 0.24,
    });

    const onPointerDown = (event) => {
      isDragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (event) => {
      if (!isDragging) return;
      phi += (event.clientX - previousX) * 0.005;
      theta = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, theta + (event.clientY - previousY) * 0.005)
      );
      previousX = event.clientX;
      previousY = event.clientY;
    };

    const onPointerUp = (event) => {
      if (!isDragging) return;
      isDragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    const render = () => {
      if (!isDragging) phi += 0.004;
      globe.update({
        phi,
        theta,
        width: width * 2,
        height: width * 2,
      });
      animationId = requestAnimationFrame(render);
    };
    render();

    const observer = new ResizeObserver(resize);
    observer.observe(viewport);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      globe.destroy();
    };
  }, []);

  return (
    <section className="globe-card" aria-labelledby="places-title">
      <div className="globe-stage">
        <div ref={viewportRef} className="globe-viewport">
          <canvas
            ref={canvasRef}
            className="globe-canvas"
            aria-label="Baku ve İstanbul arasındaki rotayı gösteren etkileşimli küre"
          />
          <span className="globe-marker-label marker-baku">BAKU</span>
          <span className="globe-marker-label marker-istanbul">ISTANBUL</span>
        </div>
        <p className="globe-hint">Drag to explore</p>
      </div>
      <footer className="globe-footer">
        <span id="places-title">places</span>
        <span>Baku&nbsp; · &nbsp;<strong>Istanbul</strong></span>
      </footer>
    </section>
  );
}
