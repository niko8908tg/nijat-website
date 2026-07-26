import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import brainModelUrl from "./assets/brain.glb?url";

const COLORS = [0x963cbd, 0xff6f61, 0xc5299b, 0xfeae51];
const NODE_DENSITY = 0.7;

const vertexShader = `
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
    vec4 instancePosition = instanceMatrix * vec4(position, 1.0);
    float distanceFromPointer = distance(uPointer, instancePosition.xyz);
    float influence = smoothstep(0.45, 0.1, distanceFromPointer);
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

const fragmentShader = `
  varying vec3 vColor;

  void main() {
    gl_FragColor = vec4(vColor, 1.0);
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

export default function BrainNetwork() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let disposed = false;
    let animationFrame = 0;
    let particles = null;
    let particleGeometry = null;
    let particleMaterial = null;
    let raycastMesh = null;
    let isVisible = true;
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
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
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = window.innerWidth <= 580 ? 1.85 : 1.2;
      camera.updateProjectionMatrix();
    };

    const updatePointer = (event) => {
      const bounds = container.getBoundingClientRect();
      const inside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!inside || !raycastMesh) {
        targetHover = 0;
        cameraTarget.set(0, 0);
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
    };

    const resetPointer = () => {
      targetHover = 0;
      cameraTarget.set(0, 0);
    };

    const render = () => {
      if (isVisible) {
        const easing = reducedMotion ? 1 : 0.12;
        camera.position.x += (cameraTarget.x - camera.position.x) * easing;
        camera.position.y += (cameraTarget.y - camera.position.y) * easing;
        camera.lookAt(0, 0, 0);

        if (particleMaterial) {
          currentHover += (targetHover - currentHover) * easing;
          pointerCurrent.lerp(pointerTarget, easing);
          particleMaterial.uniforms.uHover.value = currentHover;
          particleMaterial.uniforms.uPointer.value.copy(pointerCurrent);
        }

        renderer.render(scene, camera);
      }

      animationFrame = window.requestAnimationFrame(render);
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
        const positions = brainGeometry.getAttribute("position");
        const count = Math.floor(positions.count * NODE_DENSITY);

        particleGeometry = new THREE.BoxGeometry(0.004, 0.004, 0.004);
        const rotations = new Float32Array(count);
        const sizes = new Float32Array(count);
        const colors = new Float32Array(count * 3);
        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3();

        particles = new THREE.InstancedMesh(
          particleGeometry,
          new THREE.ShaderMaterial({
            uniforms: {
              uPointer: { value: pointerCurrent },
              uHover: { value: 0 },
            },
            vertexShader,
            fragmentShader,
            wireframe: true,
          }),
          count,
        );
        particleMaterial = particles.material;

        for (let index = 0; index < count; index += 1) {
          const sourceIndex = Math.floor(
            (index * positions.count) / count,
          );
          position.fromBufferAttribute(positions, sourceIndex);
          matrix.makeTranslation(position.x, position.y, position.z);
          particles.setMatrixAt(index, matrix);

          rotations[index] = THREE.MathUtils.randFloat(-1, 1);
          sizes[index] = THREE.MathUtils.randFloat(0.3, 3);
          color.setHex(COLORS[Math.floor(Math.random() * COLORS.length)]);
          colors[index * 3] = color.r;
          colors[index * 3 + 1] = color.g;
          colors[index * 3 + 2] = color.b;
        }

        particleGeometry.setAttribute(
          "aRotation",
          new THREE.InstancedBufferAttribute(rotations, 1),
        );
        particleGeometry.setAttribute(
          "aSize",
          new THREE.InstancedBufferAttribute(sizes, 1),
        );
        particleGeometry.setAttribute(
          "aColor",
          new THREE.InstancedBufferAttribute(colors, 3),
        );
        particles.instanceMatrix.needsUpdate = true;
        particles.frustumCulled = false;
        scene.add(particles);

        raycastMesh = new THREE.Mesh(
          brainGeometry,
          new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
        );
        raycastMesh.updateMatrixWorld(true);
        pointerTarget.set(0, 0, 0);
        pointerCurrent.copy(pointerTarget);
        container.classList.add("is-ready");
        disposeModel(model.scene);
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
      },
      { threshold: 0.05 },
    );
    visibilityObserver.observe(container);

    window.addEventListener("pointermove", updatePointer, { passive: true });
    container.addEventListener("pointerleave", resetPointer);

    resize();
    renderer.render(scene, camera);
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", updatePointer);
      container.removeEventListener("pointerleave", resetPointer);
      particles && scene.remove(particles);
      particleGeometry?.dispose();
      particleMaterial?.dispose();
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
      aria-label="Interactive particle animation in the shape of a brain."
    />
  );
}
