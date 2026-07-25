import { useEffect, useRef } from "react";
import createGlobe from "cobe";

const BAKU = [40.4093, 49.8671];

export default function GlobeCard() {
  const canvasRef = useRef(null);
  const dragging = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });
  const rotation = useRef({ phi: 1.5, theta: -0.18 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let size = canvas.offsetWidth;
    const updateSize = () => {
      size = canvas.offsetWidth;
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(canvas);

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: size * 2,
      height: size * 2,
      phi: rotation.current.phi,
      theta: rotation.current.theta,
      dark: 1,
      diffuse: 2,
      mapSamples: 16000,
      mapBrightness: 2.2,
      baseColor: [0.72, 0.72, 0.7],
      markerColor: [1, 0.82, 0.35],
      glowColor: [0.3, 0.3, 0.29],
      opacity: 1,
      scale: 0.92,
      markers: [{ location: BAKU, size: 0.085 }],
      onRender: (state) => {
        state.phi = rotation.current.phi;
        state.theta = rotation.current.theta;
        state.width = size * 2;
        state.height = size * 2;
      },
    });

    return () => {
      observer.disconnect();
      globe.destroy();
    };
  }, []);

  const startDrag = (event) => {
    dragging.current = true;
    pointer.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveGlobe = (event) => {
    if (!dragging.current) return;
    const deltaX = event.clientX - pointer.current.x;
    const deltaY = event.clientY - pointer.current.y;
    rotation.current.phi += deltaX / 180;
    rotation.current.theta = Math.max(
      -1.05,
      Math.min(1.05, rotation.current.theta + deltaY / 260)
    );
    pointer.current = { x: event.clientX, y: event.clientY };
  };

  const stopDrag = (event) => {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section className="globe-card" aria-labelledby="places-title">
      <div className="globe-stage">
        <canvas
          ref={canvasRef}
          className="globe-canvas"
          onPointerDown={startDrag}
          onPointerMove={moveGlobe}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          aria-label="Interactive globe showing Baku, Azerbaijan"
        />
        <div className="globe-location" aria-hidden="true">
          <svg viewBox="0 0 90 70">
            <path d="M3 7 C24 4 43 18 61 38" />
            <circle cx="62" cy="39" r="2.4" />
          </svg>
          <span>BAKU</span>
        </div>
        <p className="globe-hint">Drag to explore</p>
      </div>
      <footer className="globe-footer">
        <span id="places-title">places</span>
        <span>Baku&nbsp; · &nbsp;Azerbaijan</span>
      </footer>
    </section>
  );
}
