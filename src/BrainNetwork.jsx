import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import brainModelUrl from "./assets/brain.glb?url";

const NODE_DENSITY = 0.5;
const MAX_CONNECTIONS = 2;
const CONNECTION_DISTANCE = 0.078;

const nodeVertexShader = `
  uniform float uPointSize;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uPointSize;
  }
`;

const nodeFragmentShader = `
  void main() {
    float distanceFromCenter = distance(gl_PointCoord, vec2(0.5));
    float alpha = 1.0 - smoothstep(0.38, 0.5, distanceFromCenter);
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

function disposeModel(model) {
  model.traverse((child) => {
    if (!child.isMesh) return;
    child.geometry?.dispose();
    if (Array.isArray(child.material)) {
      child.material.forEach((material) => material.dispose());
    } else {
      child.material?.dispose();
    }
  });
}

function getCellKey(x, y, z) {
  return `${x}|${y}|${z}`;
}

function createNetwork(nodes) {
  const cells = new Map();
  const connectionCounts = new Uint8Array(nodes.length);
  const positions = [];
  const cellSize = CONNECTION_DISTANCE;

  nodes.forEach((node, index) => {
    const cellX = Math.floor(node.x / cellSize);
    const cellY = Math.floor(node.y / cellSize);
    const cellZ = Math.floor(node.z / cellSize);
    const candidates = [];

    for (let x = -1; x <= 1; x += 1) {
      for (let y = -1; y <= 1; y += 1) {
        for (let z = -1; z <= 1; z += 1) {
          const nearby =
            cells.get(getCellKey(cellX + x, cellY + y, cellZ + z)) || [];

          nearby.forEach((candidateIndex) => {
            if (connectionCounts[candidateIndex] >= MAX_CONNECTIONS) return;
            const distance = node.distanceTo(nodes[candidateIndex]);
            if (distance <= CONNECTION_DISTANCE) {
              candidates.push({ candidateIndex, distance });
            }
          });
        }
      }
    }

    candidates
      .sort((first, second) => first.distance - second.distance)
      .slice(0, MAX_CONNECTIONS)
      .forEach(({ candidateIndex, distance }) => {
        if (
          connectionCounts[index] >= MAX_CONNECTIONS ||
          connectionCounts[candidateIndex] >= MAX_CONNECTIONS
        ) {
          return;
        }

        const candidate = nodes[candidateIndex];
        positions.push(
          node.x,
          node.y,
          node.z,
          candidate.x,
          candidate.y,
          candidate.z,
        );

        connectionCounts[index] += 1;
        connectionCounts[candidateIndex] += 1;
      });

    const key = getCellKey(cellX, cellY, cellZ);
    const cell = cells.get(key) || [];
    cell.push(index);
    cells.set(key, cell);
  });

  return new Float32Array(positions);
}

export default function BrainNetwork() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let disposed = false;
    let animationFrame = 0;
    let isVisible = true;
    let nodes = null;
    let nodeGeometry = null;
    let nodeMaterial = null;
    let network = null;
    let networkGeometry = null;
    let networkMaterial = null;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.01, 20);
    camera.position.set(0, 0, 1.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "brain-network-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const cameraTarget = new THREE.Vector2();

    const scheduleRender = () => {
      if (!animationFrame && isVisible) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = window.innerWidth <= 580 ? 1.75 : 1.2;
      camera.updateProjectionMatrix();
      scheduleRender();
    };

    const resetPointer = () => {
      cameraTarget.set(0, 0);
      scheduleRender();
    };

    const updatePointer = (event) => {
      const bounds = container.getBoundingClientRect();
      const inside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!inside) {
        resetPointer();
        return;
      }

      const pointerX =
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      const pointerY =
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      cameraTarget.set(pointerX * 0.2, pointerY * 0.2);
      scheduleRender();
    };

    const render = () => {
      animationFrame = 0;
      if (!isVisible) return;

      camera.position.x += (cameraTarget.x - camera.position.x) * 0.13;
      camera.position.y += (cameraTarget.y - camera.position.y) * 0.13;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);

      const cameraMoving =
        Math.abs(cameraTarget.x - camera.position.x) > 0.0002 ||
        Math.abs(cameraTarget.y - camera.position.y) > 0.0002;
      if (cameraMoving) scheduleRender();
    };

    const loader = new GLTFLoader();
    loader.load(
      brainModelUrl,
      (model) => {
        if (disposed) {
          disposeModel(model.scene);
          return;
        }

        model.scene.updateMatrixWorld(true);
        let sourceMesh = null;
        model.scene.traverse((child) => {
          if (!sourceMesh && child.isMesh) sourceMesh = child;
        });
        if (!sourceMesh) return;

        const brainGeometry = sourceMesh.geometry
          .clone()
          .applyMatrix4(sourceMesh.matrixWorld);
        const sourcePositions = brainGeometry.getAttribute("position");
        const nodeCount = Math.floor(sourcePositions.count * NODE_DENSITY);
        const nodePositions = [];
        const nodePositionData = new Float32Array(nodeCount * 3);
        const position = new THREE.Vector3();

        for (let index = 0; index < nodeCount; index += 1) {
          const sourceIndex = Math.floor(
            (index * sourcePositions.count) / nodeCount,
          );
          position.fromBufferAttribute(sourcePositions, sourceIndex);
          nodePositions.push(position.clone());
          nodePositionData[index * 3] = position.x;
          nodePositionData[index * 3 + 1] = position.y;
          nodePositionData[index * 3 + 2] = position.z;
        }

        nodeGeometry = new THREE.BufferGeometry();
        nodeGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(nodePositionData, 3),
        );
        nodeMaterial = new THREE.ShaderMaterial({
          uniforms: {
            uPointSize: { value: 2.4 * renderer.getPixelRatio() },
          },
          vertexShader: nodeVertexShader,
          fragmentShader: nodeFragmentShader,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        nodes = new THREE.Points(nodeGeometry, nodeMaterial);
        nodes.frustumCulled = false;
        nodes.renderOrder = 2;
        scene.add(nodes);

        const networkPositions = createNetwork(nodePositions);
        networkGeometry = new THREE.BufferGeometry();
        networkGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(networkPositions, 3),
        );
        networkMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.48,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        network = new THREE.LineSegments(networkGeometry, networkMaterial);
        network.renderOrder = 1;
        scene.add(network);

        container.classList.add("is-ready");
        brainGeometry.dispose();
        disposeModel(model.scene);
        scheduleRender();
      },
      undefined,
      () => {
        if (!disposed) container.classList.add("is-error");
      },
    );

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) scheduleRender();
      },
      { threshold: 0.05 },
    );
    visibilityObserver.observe(container);

    window.addEventListener("pointermove", updatePointer, { passive: true });
    container.addEventListener("pointerleave", resetPointer);
    resize();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", updatePointer);
      container.removeEventListener("pointerleave", resetPointer);
      nodes && scene.remove(nodes);
      network && scene.remove(network);
      nodeGeometry?.dispose();
      nodeMaterial?.dispose();
      networkGeometry?.dispose();
      networkMaterial?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      className="brain-network"
      ref={containerRef}
      role="img"
      aria-label="Interactive network of connected nodes in the shape of a brain."
    />
  );
}
