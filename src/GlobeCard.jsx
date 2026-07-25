import { useEffect, useRef } from "react";
import createGlobe from "cobe";

const BAKU = [40.4093, 49.8671];
const ISTANBUL = [41.0082, 28.9784];

export default function GlobeCard() {
  const viewportRef = useRef(null);
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const dragging = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });
  // Center the opening view between Baku and Istanbul.
  const rotation = useRef({ phi: -2.25, theta: 0.25 });
  const size = useRef(430);

  useEffect(() => {
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    if (!viewport || !canvas) return undefined;

    const resize = () => {
      size.current = viewport.getBoundingClientRect().width;
    };
    resize();

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const globe = createGlobe(canvas, {
      devicePixelRatio: pixelRatio,
      width: size.current,
      height: size.current,
      phi: rotation.current.phi,
      theta: rotation.current.theta,
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

    const render = () => {
      if (!dragging.current) rotation.current.phi += 0.004;
      globe.update({
        phi: rotation.current.phi,
        theta: rotation.current.theta,
        width: size.current * pixelRatio,
        height: size.current * pixelRatio,
      });
      frameRef.current = requestAnimationFrame(render);
    };
    frameRef.current = requestAnimationFrame(render);

    const observer = new ResizeObserver(resize);
    observer.observe(viewport);

    const startDrag = (event) => {
      dragging.current = true;
      pointer.current = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const moveGlobe = (event) => {
      if (!dragging.current) return;
      rotation.current.phi += (event.clientX - pointer.current.x) * 0.005;
      rotation.current.theta = Math.max(
        -Math.PI / 3,
        Math.min(
          Math.PI / 3,
          rotation.current.theta + (event.clientY - pointer.current.y) * 0.005
        )
      );
      pointer.current = { x: event.clientX, y: event.clientY };
    };
    const stopDrag = (event) => {
      dragging.current = false;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("pointerdown", startDrag);
    canvas.addEventListener("pointermove", moveGlobe);
    canvas.addEventListener("pointerup", stopDrag);
    canvas.addEventListener("pointercancel", stopDrag);

    return () => {
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", startDrag);
      canvas.removeEventListener("pointermove", moveGlobe);
      canvas.removeEventListener("pointerup", stopDrag);
      canvas.removeEventListener("pointercancel", stopDrag);
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
