import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 360;
const SPARK_COUNT = 160;
const MAX_CONNECTIONS = 7;
const CONNECTION_DISTANCE = 0.34;
const OUTLINE_PARTICLES = 112;
const STEM_PARTICLES = 48;
const MAX_TRIANGLES = 115;

const BRAIN_OUTLINE = [
  [0.31, -1.34],
  [0.2, -1.25],
  [0.21, -1.08],
  [0.16, -0.91],
  [0.05, -0.75],
  [-0.12, -0.64],
  [-0.33, -0.6],
  [-0.54, -0.52],
  [-0.75, -0.42],
  [-0.92, -0.25],
  [-1.04, -0.04],
  [-1.08, 0.18],
  [-1.01, 0.38],
  [-0.94, 0.57],
  [-0.79, 0.76],
  [-0.6, 0.92],
  [-0.37, 1.03],
  [-0.12, 1.08],
  [0.12, 1.07],
  [0.35, 1],
  [0.55, 0.9],
  [0.73, 0.75],
  [0.9, 0.57],
  [1, 0.37],
  [1.04, 0.16],
  [1, -0.03],
  [0.93, -0.18],
  [0.83, -0.29],
  [0.72, -0.4],
  [0.62, -0.48],
  [0.51, -0.55],
  [0.43, -0.65],
  [0.41, -0.81],
  [0.47, -0.98],
  [0.49, -1.14],
  [0.43, -1.29],
];

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

function isInsideBrain(x, y) {
  let inside = false;

  for (
    let current = 0, previous = BRAIN_OUTLINE.length - 1;
    current < BRAIN_OUTLINE.length;
    previous = current, current += 1
  ) {
    const [currentX, currentY] = BRAIN_OUTLINE[current];
    const [previousX, previousY] = BRAIN_OUTLINE[previous];
    const crossesHorizontalRay =
      currentY > y !== previousY > y &&
      x <
        ((previousX - currentX) * (y - currentY)) /
          (previousY - currentY) +
          currentX;

    if (crossesHorizontalRay) inside = !inside;
  }

  return inside;
}

function getOutlinePoint(progress) {
  const segmentLengths = [];
  let perimeter = 0;

  for (let index = 0; index < BRAIN_OUTLINE.length; index += 1) {
    const current = BRAIN_OUTLINE[index];
    const next = BRAIN_OUTLINE[(index + 1) % BRAIN_OUTLINE.length];
    const length = Math.hypot(next[0] - current[0], next[1] - current[1]);
    segmentLengths.push(length);
    perimeter += length;
  }

  let distance = progress * perimeter;

  for (let index = 0; index < segmentLengths.length; index += 1) {
    if (distance <= segmentLengths[index]) {
      const current = BRAIN_OUTLINE[index];
      const next = BRAIN_OUTLINE[(index + 1) % BRAIN_OUTLINE.length];
      const amount = distance / segmentLengths[index];
      return [
        THREE.MathUtils.lerp(current[0], next[0], amount),
        THREE.MathUtils.lerp(current[1], next[1], amount),
      ];
    }
    distance -= segmentLengths[index];
  }

  return BRAIN_OUTLINE[0];
}

function createBrainPoints() {
  const random = seededRandom(1440);
  const points = new Float32Array(PARTICLE_COUNT * 3);
  const phases = new Float32Array(PARTICLE_COUNT);

  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    let x;
    let y;
    let z;

    if (index < OUTLINE_PARTICLES) {
      const progress =
        (index + (random() - 0.5) * 0.16) / OUTLINE_PARTICLES;
      [x, y] = getOutlinePoint(
        (progress + 1) % 1,
      );
      x *= 0.99 + random() * 0.018;
      y *= 0.99 + random() * 0.018;
      z = Math.sin(index * 0.91) * 0.045;
    } else if (index < OUTLINE_PARTICLES + STEM_PARTICLES) {
      do {
        x = random() * 0.66 - 0.12;
        y = random() * 0.84 - 1.34;
      } while (!isInsideBrain(x, y));
      z = (random() - 0.5) * 0.15;
    } else {
      do {
        x = random() * 2.12 - 1.08;
        y = random() * 2.42 - 1.34;
      } while (!isInsideBrain(x, y));

      const edgeTaper = 1 - Math.min(0.78, Math.abs(x) / 1.1) * 0.22;
      const depth = 0.22 * edgeTaper;
      z = (random() * 2 - 1) * depth;
    }

    points[index * 3] = x;
    points[index * 3 + 1] = y;
    points[index * 3 + 2] = z;
    phases[index] = random() * Math.PI * 2;
  }

  return { points, phases };
}

function createSparkPoints() {
  const random = seededRandom(721);
  const points = new Float32Array(SPARK_COUNT * 3);

  for (let index = 0; index < SPARK_COUNT; index += 1) {
    let x;
    let y;

    do {
      x = random() * 2.12 - 1.08;
      y = random() * 2.42 - 1.34;
    } while (!isInsideBrain(x, y));

    points[index * 3] = x;
    points[index * 3 + 1] = y;
    points[index * 3 + 2] = (random() - 0.5) * 0.34;
  }

  return points;
}

function createTriangleIndices(positions) {
  const random = seededRandom(972);
  const triangles = [];
  const knownTriangles = new Set();

  for (
    let center = 0;
    center < PARTICLE_COUNT && triangles.length / 3 < MAX_TRIANGLES;
    center += 1
  ) {
    const centerOffset = center * 3;
    const neighbors = [];

    for (let other = 0; other < PARTICLE_COUNT; other += 1) {
      if (other === center) continue;
      const otherOffset = other * 3;
      const distance = Math.hypot(
        positions[centerOffset] - positions[otherOffset],
        positions[centerOffset + 1] - positions[otherOffset + 1],
      );

      if (distance < CONNECTION_DISTANCE * 1.22) {
        neighbors.push({ index: other, distance });
      }
    }

    neighbors.sort((first, second) => first.distance - second.distance);
    const closest = neighbors.slice(0, 6);

    for (
      let first = 0;
      first < closest.length - 1 &&
      triangles.length / 3 < MAX_TRIANGLES;
      first += 1
    ) {
      for (
        let second = first + 1;
        second < closest.length &&
        triangles.length / 3 < MAX_TRIANGLES;
        second += 1
      ) {
        if (random() > 0.2) continue;

        const firstIndex = closest[first].index;
        const secondIndex = closest[second].index;
        const firstOffset = firstIndex * 3;
        const secondOffset = secondIndex * 3;
        const neighborDistance = Math.hypot(
          positions[firstOffset] - positions[secondOffset],
          positions[firstOffset + 1] - positions[secondOffset + 1],
        );

        if (neighborDistance > CONNECTION_DISTANCE * 1.18) continue;

        const area = Math.abs(
          (positions[firstOffset] - positions[centerOffset]) *
            (positions[secondOffset + 1] - positions[centerOffset + 1]) -
            (positions[firstOffset + 1] - positions[centerOffset + 1]) *
              (positions[secondOffset] - positions[centerOffset]),
        );
        if (area < 0.004) continue;

        const triangle = [center, firstIndex, secondIndex].sort(
          (firstValue, secondValue) => firstValue - secondValue,
        );
        const key = triangle.join("-");
        if (knownTriangles.has(key)) continue;

        knownTriangles.add(key);
        triangles.push(center, firstIndex, secondIndex);
      }
    }
  }

  return triangles;
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
    group.rotation.set(-0.04, 0, 0);
    scene.add(group);

    const { points: basePositions, phases } = createBrainPoints();
    const particlePositions = basePositions.slice();
    const particleGeometry = new THREE.BufferGeometry();
    const particleAttribute = new THREE.BufferAttribute(particlePositions, 3);
    particleAttribute.setUsage(THREE.DynamicDrawUsage);
    particleGeometry.setAttribute("position", particleAttribute);

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xeaffff,
      size: 0.029,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.94,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.renderOrder = 3;
    group.add(particles);

    const sparkGeometry = new THREE.BufferGeometry();
    sparkGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(createSparkPoints(), 3),
    );
    const sparkMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.011,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.68,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sparks = new THREE.Points(sparkGeometry, sparkMaterial);
    sparks.renderOrder = 2;
    group.add(sparks);

    const triangleIndices = createTriangleIndices(basePositions);
    const facePositions = new Float32Array(triangleIndices.length * 3);
    const faceColors = new Float32Array(triangleIndices.length * 3);
    const faceRandom = seededRandom(305);

    for (let vertex = 0; vertex < triangleIndices.length; vertex += 1) {
      const sourceOffset = triangleIndices[vertex] * 3;
      const targetOffset = vertex * 3;
      const tone =
        0.38 + Math.floor(vertex / 3) % 4 * 0.09 + faceRandom() * 0.08;

      facePositions[targetOffset] = particlePositions[sourceOffset];
      facePositions[targetOffset + 1] = particlePositions[sourceOffset + 1];
      facePositions[targetOffset + 2] = particlePositions[sourceOffset + 2];
      faceColors[targetOffset] = tone * 0.18;
      faceColors[targetOffset + 1] = tone * 0.88;
      faceColors[targetOffset + 2] = tone;
    }

    const faceGeometry = new THREE.BufferGeometry();
    const facePositionAttribute = new THREE.BufferAttribute(facePositions, 3);
    facePositionAttribute.setUsage(THREE.DynamicDrawUsage);
    faceGeometry.setAttribute("position", facePositionAttribute);
    faceGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(faceColors, 3),
    );
    const faceMaterial = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const faces = new THREE.Mesh(faceGeometry, faceMaterial);
    faces.renderOrder = 1;
    group.add(faces);

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
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    lines.renderOrder = 2;
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
          lineColors[firstLineOffset] = brightness * 0.2;
          lineColors[firstLineOffset + 1] = brightness * 0.82;
          lineColors[firstLineOffset + 2] = brightness * 0.88;
          lineVertex += 1;

          const secondLineOffset = lineVertex * 3;
          linePositions[secondLineOffset] = particlePositions[secondOffset];
          linePositions[secondLineOffset + 1] =
            particlePositions[secondOffset + 1];
          linePositions[secondLineOffset + 2] =
            particlePositions[secondOffset + 2];
          lineColors[secondLineOffset] = brightness * 0.2;
          lineColors[secondLineOffset + 1] = brightness * 0.82;
          lineColors[secondLineOffset + 2] = brightness * 0.88;
          lineVertex += 1;
        }
      }

      lineGeometry.setDrawRange(0, lineVertex);
      linePositionAttribute.needsUpdate = true;
      lineColorAttribute.needsUpdate = true;
    };

    const updateFaces = () => {
      for (let vertex = 0; vertex < triangleIndices.length; vertex += 1) {
        const sourceOffset = triangleIndices[vertex] * 3;
        const targetOffset = vertex * 3;
        facePositions[targetOffset] = particlePositions[sourceOffset];
        facePositions[targetOffset + 1] = particlePositions[sourceOffset + 1];
        facePositions[targetOffset + 2] = particlePositions[sourceOffset + 2];
      }
      facePositionAttribute.needsUpdate = true;
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

          const idleRotation = isDragging ? 0 : Math.sin(seconds * 0.34) * 0.07;
          group.rotation.x += (targetRotationX - group.rotation.x) * 0.075;
          group.rotation.y +=
            (targetRotationY + idleRotation - group.rotation.y) * 0.075;
          particleAttribute.needsUpdate = true;
        }

        updateConnections();
        updateFaces();
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
    updateFaces();
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
      sparkGeometry.dispose();
      sparkMaterial.dispose();
      faceGeometry.dispose();
      faceMaterial.dispose();
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
