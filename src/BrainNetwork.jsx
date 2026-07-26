import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 260;
const MAX_CONNECTIONS = 5;
const CONNECTION_DISTANCE = 0.4;

function seededRandom(seed) {
  let value = seed;

  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function createBrainPoints() {
  const random = seededRandom(1440);
  const points = new Float32Array(PARTICLE_COUNT * 3);
  const phases = new Float32Array(PARTICLE_COUNT);

  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    let x = 0;
    let y = 0;
    let z = 0;
    let lengthSquared = 2;

    while (lengthSquared > 1 || lengthSquared < 0.025) {
      x = random() * 2 - 1;
      y = random() * 2 - 1;
      z = random() * 2 - 1;
      lengthSquared = x * x + y * y + z * z;
    }

    if (index % 3 === 0) {
      const surfaceScale = (0.9 + random() * 0.1) / Math.sqrt(lengthSquared);
      x *= surfaceScale;
      y *= surfaceScale;
      z *= surfaceScale;
    }

    const side = index % 2 === 0 ? -1 : 1;
    const centralGroove = 0.045 + Math.max(0, y) * 0.055;
    const lowerTaper =
      y < -0.22 ? 1 - Math.min(0.24, (-y - 0.22) * 0.3) : 1;
    const fold =
      1 +
      Math.sin(y * 11 + index * 0.37) *
        Math.sin(z * 10 - index * 0.19) *
        0.025;

    points[index * 3] =
      side * (centralGroove + Math.abs(x) * 1.12) * lowerTaper * fold;
    points[index * 3 + 1] = y * 0.94;
    points[index * 3 + 2] = z * 0.76 * fold;
    phases[index] = random() * Math.PI * 2;
  }

  return { points, phases };
}

export default function BrainNetwork() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 4.35);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.domElement.className = "brain-network-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.set(-0.08, -0.28, 0);
    scene.add(group);

    const { points: basePositions, phases } = createBrainPoints();
    const particlePositions = basePositions.slice();
    const particleGeometry = new THREE.BufferGeometry();
    const particleAttribute = new THREE.BufferAttribute(particlePositions, 3);
    particleAttribute.setUsage(THREE.DynamicDrawUsage);
    particleGeometry.setAttribute("position", particleAttribute);

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xd1d5d8,
      size: 0.032,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);

    const maximumLineVertices = PARTICLE_COUNT * MAX_CONNECTIONS * 2;
    const linePositions = new Float32Array(maximumLineVertices * 3);
    const lineColors = new Float32Array(maximumLineVertices * 3);
    const lineGeometry = new THREE.BufferGeometry();
    const linePositionAttribute = new THREE.BufferAttribute(linePositions, 3);
    const lineColorAttribute = new THREE.BufferAttribute(lineColors, 3);
    linePositionAttribute.setUsage(THREE.DynamicDrawUsage);
    lineColorAttribute.setUsage(THREE.DynamicDrawUsage);
    lineGeometry.setAttribute("position", linePositionAttribute);
    lineGeometry.setAttribute("color", lineColorAttribute);
    lineGeometry.setDrawRange(0, 0);

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);

    const connections = new Uint8Array(PARTICLE_COUNT);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let animationFrame = 0;
    let isVisible = true;
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let targetRotationX = group.rotation.x;
    let targetRotationY = group.rotation.y;

    const updateConnections = () => {
      connections.fill(0);
      let lineVertex = 0;

      for (let first = 0; first < PARTICLE_COUNT; first += 1) {
        if (connections[first] >= MAX_CONNECTIONS) continue;
        const firstOffset = first * 3;

        for (
          let second = first + 1;
          second < PARTICLE_COUNT;
          second += 1
        ) {
          if (
            connections[first] >= MAX_CONNECTIONS ||
            connections[second] >= MAX_CONNECTIONS
          ) {
            continue;
          }

          const secondOffset = second * 3;
          const deltaX =
            particlePositions[firstOffset] - particlePositions[secondOffset];
          const deltaY =
            particlePositions[firstOffset + 1] -
            particlePositions[secondOffset + 1];
          const deltaZ =
            particlePositions[firstOffset + 2] -
            particlePositions[secondOffset + 2];
          const distance = Math.sqrt(
            deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ,
          );

          if (distance >= CONNECTION_DISTANCE) continue;

          connections[first] += 1;
          connections[second] += 1;

          const brightness =
            0.18 + (1 - distance / CONNECTION_DISTANCE) * 0.7;
          const firstLineOffset = lineVertex * 3;

          linePositions[firstLineOffset] = particlePositions[firstOffset];
          linePositions[firstLineOffset + 1] =
            particlePositions[firstOffset + 1];
          linePositions[firstLineOffset + 2] =
            particlePositions[firstOffset + 2];
          lineColors[firstLineOffset] = brightness * 0.78;
          lineColors[firstLineOffset + 1] = brightness * 0.84;
          lineColors[firstLineOffset + 2] = brightness * 0.88;
          lineVertex += 1;

          const secondLineOffset = lineVertex * 3;
          linePositions[secondLineOffset] = particlePositions[secondOffset];
          linePositions[secondLineOffset + 1] =
            particlePositions[secondOffset + 1];
          linePositions[secondLineOffset + 2] =
            particlePositions[secondOffset + 2];
          lineColors[secondLineOffset] = brightness * 0.78;
          lineColors[secondLineOffset + 1] = brightness * 0.84;
          lineColors[secondLineOffset + 2] = brightness * 0.88;
          lineVertex += 1;
        }
      }

      lineGeometry.setDrawRange(0, lineVertex);
      linePositionAttribute.needsUpdate = true;
      lineColorAttribute.needsUpdate = true;
    };

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const render = (time = 0) => {
      if (isVisible) {
        const seconds = time * 0.001;

        if (!reducedMotion) {
          for (let index = 0; index < PARTICLE_COUNT; index += 1) {
            const offset = index * 3;
            const phase = phases[index];
            particlePositions[offset] =
              basePositions[offset] + Math.sin(seconds * 0.58 + phase) * 0.012;
            particlePositions[offset + 1] =
              basePositions[offset + 1] +
              Math.cos(seconds * 0.52 + phase * 1.2) * 0.012;
            particlePositions[offset + 2] =
              basePositions[offset + 2] +
              Math.sin(seconds * 0.46 + phase * 0.8) * 0.01;
          }

          if (!isDragging) targetRotationY += 0.0011;
          group.rotation.x += (targetRotationX - group.rotation.x) * 0.075;
          group.rotation.y += (targetRotationY - group.rotation.y) * 0.075;
          particleAttribute.needsUpdate = true;
        }

        updateConnections();
        renderer.render(scene, camera);
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    const startDrag = (event) => {
      isDragging = true;
      previousPointerX = event.clientX;
      previousPointerY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      container.classList.add("is-dragging");
    };

    const drag = (event) => {
      if (!isDragging) return;
      targetRotationY += (event.clientX - previousPointerX) * 0.008;
      targetRotationX += (event.clientY - previousPointerY) * 0.006;
      targetRotationX = THREE.MathUtils.clamp(targetRotationX, -0.7, 0.7);
      previousPointerX = event.clientX;
      previousPointerY = event.clientY;
    };

    const endDrag = (event) => {
      isDragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
      container.classList.remove("is-dragging");
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    visibilityObserver.observe(container);

    renderer.domElement.addEventListener("pointerdown", startDrag);
    renderer.domElement.addEventListener("pointermove", drag);
    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);

    resize();
    updateConnections();
    renderer.render(scene, camera);
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", startDrag);
      renderer.domElement.removeEventListener("pointermove", drag);
      renderer.domElement.removeEventListener("pointerup", endDrag);
      renderer.domElement.removeEventListener("pointercancel", endDrag);
      particleGeometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      className="brain-network"
      ref={containerRef}
      role="img"
      aria-label="Interactive neural network in the shape of a brain. Drag to rotate."
    >
      <span className="brain-network-hint" aria-hidden="true">
        Drag to rotate
      </span>
    </div>
  );
}
