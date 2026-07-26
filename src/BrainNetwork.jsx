import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import brainModelUrl from "./assets/brain.glb?url";

const NODE_DENSITY = 0.5;
const MAX_CONNECTIONS = 2;
const CONNECTION_DISTANCE = 0.078;
const COLORS = [0x963cbd, 0xff6f61, 0xc5299b, 0xfeae51];

const nodeVertexShader = `
  uniform vec3 uPointer;
  uniform float uHover;

  attribute vec3 aColor;
  attribute float aRotation;
  attribute float aSize;

  varying vec3 vColor;

  #define PI 3.14159265359

  mat2 rotate2d(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  }

  void main() {
    vec4 nodePosition = instanceMatrix * vec4(position, 1.0);
    float pointerDistance = distance(uPointer, nodePosition.xyz);
    float influence = smoothstep(0.45, 0.1, pointerDistance);
    float scale = aSize + influence * 8.0 * uHover;

    vec3 transformed = position * scale;
    transformed.xz *= rotate2d(
      PI * influence * aRotation + PI * aRotation * 0.43
    );
    transformed.xy *= rotate2d(
      PI * influence * aRotation + PI * aRotation * 0.71
    );

    vec4 modelPosition = instanceMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * modelPosition;
    vColor = aColor;
  }
`;

const nodeFragmentShader = `
  varying vec3 vColor;

  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

function seededRandom(seed = 1440) {
  let state = seed;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

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
  const colors = [];
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

        const brightness =
          0.24 + (1 - distance / CONNECTION_DISTANCE) * 0.58;
        colors.push(
          brightness,
          brightness,
          brightness,
          brightness,
          brightness,
          brightness,
        );
        connectionCounts[index] += 1;
        connectionCounts[candidateIndex] += 1;
      });

    const key = getCellKey(cellX, cellY, cellZ);
    const cell = cells.get(key) || [];
    cell.push(index);
    cells.set(key, cell);
  });

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
  };
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
    let raycastMesh = null;
    let targetHover = 0;
    let currentHover = 0;

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

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(4, 4);
    const pointerTarget = new THREE.Vector3();
    const pointerCurrent = new THREE.Vector3();
    const cameraTarget = new THREE.Vector2();
    const color = new THREE.Color();

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
      targetHover = 0;
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

      if (!inside || !raycastMesh) {
        resetPointer();
        return;
      }

      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      cameraTarget.set(pointer.x * 0.2, pointer.y * 0.2);
      camera.updateMatrixWorld();
      raycaster.setFromCamera(pointer, camera);

      const intersection = raycaster.intersectObject(raycastMesh, false)[0];
      if (intersection) {
        pointerTarget.copy(intersection.point);
        targetHover = 1;
      } else {
        targetHover = 0;
      }
      scheduleRender();
    };

    const render = () => {
      animationFrame = 0;
      if (!isVisible) return;

      camera.position.x += (cameraTarget.x - camera.position.x) * 0.13;
      camera.position.y += (cameraTarget.y - camera.position.y) * 0.13;
      camera.lookAt(0, 0, 0);

      if (nodeMaterial) {
        currentHover += (targetHover - currentHover) * 0.13;
        pointerCurrent.lerp(pointerTarget, 0.13);
        nodeMaterial.uniforms.uHover.value = currentHover;
        nodeMaterial.uniforms.uPointer.value.copy(pointerCurrent);
      }

      renderer.render(scene, camera);

      const cameraMoving =
        Math.abs(cameraTarget.x - camera.position.x) > 0.0002 ||
        Math.abs(cameraTarget.y - camera.position.y) > 0.0002;
      const hoverMoving = Math.abs(targetHover - currentHover) > 0.002;
      const pointerMoving =
        pointerCurrent.distanceToSquared(pointerTarget) > 0.000001;

      if (cameraMoving || hoverMoving || pointerMoving) scheduleRender();
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

        nodeGeometry = new THREE.BoxGeometry(0.004, 0.004, 0.004);
        const rotations = new Float32Array(nodeCount);
        const sizes = new Float32Array(nodeCount);
        const colors = new Float32Array(nodeCount * 3);
        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3();
        const random = seededRandom();

        nodes = new THREE.InstancedMesh(
          nodeGeometry,
          new THREE.ShaderMaterial({
            uniforms: {
              uPointer: { value: pointerCurrent },
              uHover: { value: 0 },
            },
            vertexShader: nodeVertexShader,
            fragmentShader: nodeFragmentShader,
            wireframe: true,
          }),
          nodeCount,
        );
        nodeMaterial = nodes.material;

        for (let index = 0; index < nodeCount; index += 1) {
          const sourceIndex = Math.floor(
            (index * sourcePositions.count) / nodeCount,
          );
          position.fromBufferAttribute(sourcePositions, sourceIndex);
          nodePositions.push(position.clone());
          matrix.makeTranslation(position.x, position.y, position.z);
          nodes.setMatrixAt(index, matrix);

          rotations[index] = THREE.MathUtils.lerp(-1, 1, random());
          sizes[index] = THREE.MathUtils.lerp(0.3, 3, random());
          color.setHex(COLORS[Math.floor(random() * COLORS.length)]);
          colors[index * 3] = color.r;
          colors[index * 3 + 1] = color.g;
          colors[index * 3 + 2] = color.b;
        }

        nodeGeometry.setAttribute(
          "aRotation",
          new THREE.InstancedBufferAttribute(rotations, 1),
        );
        nodeGeometry.setAttribute(
          "aSize",
          new THREE.InstancedBufferAttribute(sizes, 1),
        );
        nodeGeometry.setAttribute(
          "aColor",
          new THREE.InstancedBufferAttribute(colors, 3),
        );
        nodes.instanceMatrix.needsUpdate = true;
        nodes.frustumCulled = false;
        nodes.renderOrder = 2;
        scene.add(nodes);

        const networkData = createNetwork(nodePositions);
        networkGeometry = new THREE.BufferGeometry();
        networkGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(networkData.positions, 3),
        );
        networkGeometry.setAttribute(
          "color",
          new THREE.BufferAttribute(networkData.colors, 3),
        );
        networkMaterial = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 0.72,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        network = new THREE.LineSegments(networkGeometry, networkMaterial);
        network.renderOrder = 1;
        scene.add(network);

        raycastMesh = new THREE.Mesh(
          brainGeometry,
          new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
        );
        raycastMesh.updateMatrixWorld(true);
        pointerTarget.set(0, 0, 0);
        pointerCurrent.copy(pointerTarget);

        container.classList.add("is-ready");
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
      raycastMesh?.geometry.dispose();
      raycastMesh?.material.dispose();
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
