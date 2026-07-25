import { useEffect, useRef } from "react";
import createGlobe from "cobe";

const BAKU = [40.4093, 49.8671];
const ISTANBUL = [41.0082, 28.9784];

export default function GlobeCard() {
  const canvasRef = useRef(null);
  const routeRef = useRef(null);
  const routePathRef = useRef(null);
  const bakuLabelRef = useRef(null);
  const istanbulLabelRef = useRef(null);
  const dragging = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });
  const rotation = useRef({ phi: 1.5, theta: -0.18 });

  const projectLocation = ([latitude, longitude], phi, theta) => {
    const lat = (latitude * Math.PI) / 180;
    const lng = (longitude * Math.PI) / 180 - Math.PI;
    const cosLat = Math.cos(lat);
    const point = [
      -cosLat * Math.cos(lng),
      Math.sin(lat),
      cosLat * Math.sin(lng),
    ];
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);

    const x = point[0] * cosPhi + point[2] * sinPhi;
    const y =
      point[0] * sinPhi * sinTheta +
      point[1] * cosTheta -
      point[2] * cosPhi * sinTheta;
    const z =
      -point[0] * sinPhi * cosTheta +
      point[1] * sinTheta +
      point[2] * cosPhi * cosTheta;

    return {
      x: 215 + x * 172,
      y: 215 - y * 172,
      visible: z > 0,
    };
  };

  const updateRoute = (phi, theta) => {
    const baku = projectLocation(BAKU, phi, theta);
    const istanbul = projectLocation(ISTANBUL, phi, theta);
    const visible = baku.visible && istanbul.visible;

    if (routeRef.current) routeRef.current.style.opacity = visible ? "1" : "0";
    if (!visible) return;

    const lift = Math.max(38, Math.abs(istanbul.x - baku.x) * 0.3);
    const middleX = (baku.x + istanbul.x) / 2;
    const middleY = Math.min(baku.y, istanbul.y) - lift;

    routePathRef.current?.setAttribute(
      "d",
      `M ${baku.x} ${baku.y} Q ${middleX} ${middleY} ${istanbul.x} ${istanbul.y}`
    );
    if (bakuLabelRef.current) {
      bakuLabelRef.current.style.transform =
        `translate(${baku.x - 58}px, ${baku.y - 46}px)`;
    }
    if (istanbulLabelRef.current) {
      istanbulLabelRef.current.style.transform =
        `translate(${istanbul.x + 10}px, ${istanbul.y - 46}px)`;
    }
  };

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
        updateRoute(state.phi, state.theta);
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
        <div ref={routeRef} className="globe-route" aria-hidden="true">
          <svg viewBox="0 0 430 430">
            <path ref={routePathRef} d="" />
          </svg>
          <span ref={bakuLabelRef} className="route-label route-baku">BAKU</span>
          <span ref={istanbulLabelRef} className="route-label route-istanbul">ISTANBUL</span>
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
