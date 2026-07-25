import { useEffect, useRef } from "react";
import createGlobe from "cobe";

const BAKU = [40.4093, 49.8671];
const ISTANBUL = [41.0082, 28.9784];

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
      width: size,
      height: size,
      phi: rotation.current.phi,
      theta: rotation.current.theta,
      dark: 1,
      diffuse: 2,
      mapSamples: 16000,
      mapBrightness: 2.2,
      baseColor: [0.72, 0.72, 0.7],
      markerColor: [0.72, 0.72, 0.7],
      glowColor: [0.3, 0.3, 0.29],
      opacity: 1,
      scale: 1,
      markers: [
        { location: BAKU, size: 0.065, color: [0.72, 0.72, 0.7] },
        { location: ISTANBUL, size: 0.095, color: [1, 0.76, 0.18] },
      ],
      onRender: (state) => {
        state.phi = rotation.current.phi;
        state.theta = rotation.current.theta;
        state.width = size;
        state.height = size;
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
        <div className="globe-route" aria-hidden="true">
          <svg viewBox="0 0 430 190">
            <path d="M116 106 C164 28 272 25 324 92" />
            <circle cx="116" cy="106" r="3" />
            <circle className="active-point" cx="324" cy="92" r="4" />
          </svg>
          <span className="route-label route-baku">BAKU</span>
          <span className="route-label route-istanbul">ISTANBUL</span>
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
