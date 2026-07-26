import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const PARTICLES_PER_CURVE = 6;
const TARGET_FRAME_INTERVAL = 1000 / 30;

const tubeVertexShader = `
  uniform float uTime;
  uniform vec3 uMouse;

  varying vec2 vUv;
  varying float vProgress;

  void main() {
    vUv = uv;
    vProgress = smoothstep(-1.0, 1.0, sin(vUv.x * 8.0 + uTime * 3.0));

    vec3 transformed = position;
    float maxDistance = 0.05;
    float mouseDistance = length(uMouse - transformed);

    if (mouseDistance < maxDistance) {
      vec3 direction = normalize(uMouse - transformed);
      direction *= 1.0 - mouseDistance / maxDistance;
      transformed -= direction * 0.03;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const tubeFragmentShader = `
  uniform vec3 uColor;

  varying vec2 vUv;
  varying float vProgress;

  void main() {
    float fadeOut = smoothstep(1.0, 0.9, vUv.x);
    float fadeIn = smoothstep(0.0, 0.1, vUv.x);
    vec3 flowingWhite = mix(uColor, uColor * 0.25, vProgress);
    gl_FragColor = vec4(flowingWhite, fadeIn * fadeOut);
  }
`;

const particleVertexShader = `
  attribute float aRandom;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aRandom * 2.0 * (1.0 / -viewPosition.z);
  }
`;

const particleFragmentShader = `
  void main() {
    float distanceFromCenter = length(gl_PointCoord.xy - vec2(0.5));
    float intensity = 0.55 * smoothstep(0.5, 0.38, distanceFromCenter);
    gl_FragColor = vec4(vec3(intensity), 1.0);
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

function createCurve(points, closed = false) {
  return new THREE.CatmullRomCurve3(
    points,
    closed,
    "catmullrom",
    0.42,
  );
}

function createCurves() {
  const random = seededRandom(721);
  const curves = [];

  [-1, 1].forEach((hemisphere) => {
    [-0.028, 0, 0.028].forEach((depth, layer) => {
      const outline = [];

      for (let index = 0; index < 32; index += 1) {
        const angle = (index / 32) * Math.PI * 2;
        outline.push(
          new THREE.Vector3(
            hemisphere *
              (0.047 +
                0.047 * Math.cos(angle) +
                0.004 * Math.sin(angle * 3 + layer)),
            -0.006 +
              0.101 * Math.sin(angle) +
              0.005 * Math.sin(angle * 4 + layer),
            depth + 0.01 * Math.sin(angle * 2 + layer),
          ),
        );
      }

      curves.push(createCurve(outline, true));
    });

    for (let strand = 0; strand < 10; strand += 1) {
      const points = [];
      const latitude = THREE.MathUtils.lerp(-0.72, 0.72, random());
      const phase = random() * Math.PI * 2;
      const turns = THREE.MathUtils.lerp(1.15, 1.9, random());

      for (let index = 0; index < 22; index += 1) {
        const progress = index / 21;
        const angle = phase + progress * Math.PI * 2 * turns;
        const normalizedY = THREE.MathUtils.clamp(
          latitude +
            Math.sin(angle * 0.72 + strand) * 0.18 +
            Math.sin(progress * Math.PI * 2) * 0.08,
          -0.88,
          0.88,
        );
        const ring = Math.sqrt(1 - normalizedY * normalizedY);

        points.push(
          new THREE.Vector3(
            hemisphere *
              (0.046 +
                0.047 * ring * Math.cos(angle) +
                0.003 * Math.sin(angle * 3)),
            0.003 + normalizedY * 0.105,
            0.079 * ring * Math.sin(angle) +
              0.006 * Math.cos(angle * 2 + strand),
          ),
        );
      }

      curves.push(createCurve(points));
    }
  });

  for (let bridge = 0; bridge < 5; bridge += 1) {
    const points = [];
    const verticalOffset = (bridge - 2) * 0.017;

    for (let index = 0; index < 18; index += 1) {
      const progress = index / 17;
      points.push(
        new THREE.Vector3(
          THREE.MathUtils.lerp(-0.091, 0.091, progress),
          0.004 +
            verticalOffset +
            Math.sin(progress * Math.PI) * (0.025 + bridge * 0.003),
          (bridge - 2) * 0.011 +
            Math.sin(progress * Math.PI * 2 + bridge) * 0.008,
        ),
      );
    }

    curves.push(createCurve(points));
  }

  for (let stem = 0; stem < 3; stem += 1) {
    const points = [];
    const offset = (stem - 1) * 0.009;

    for (let index = 0; index < 14; index += 1) {
      const progress = index / 13;
      points.push(
        new THREE.Vector3(
          offset * (1 - progress) +
            Math.sin(progress * Math.PI * 2 + stem) * 0.003,
          -0.068 - progress * 0.066,
          offset * 0.75 + Math.sin(progress * Math.PI) * 0.006,
        ),
      );
    }

    curves.push(createCurve(points));
  }

  return curves;
}

export default function BrainNetwork() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.001, 5);
    camera.position.set(0, 0, 0.3);

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

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.rotateSpeed = 0.45;

    const brain = new THREE.Group();
    brain.position.y = 0.03;
    scene.add(brain);

    const curves = createCurves();
    const separateTubeGeometries = curves.map(
      (curve) => new THREE.TubeGeometry(curve, 40, 0.001, 2, false),
    );
    const tubeGeometry = mergeGeometries(separateTubeGeometries, false);
    separateTubeGeometries.forEach((geometry) => geometry.dispose());

    const mouseCurrent = new THREE.Vector3(10, 10, 10);
    const mouseTarget = new THREE.Vector3(10, 10, 10);
    const tubeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xffffff) },
        uMouse: { value: mouseCurrent },
      },
      vertexShader: tubeVertexShader,
      fragmentShader: tubeFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const tubes = new THREE.Mesh(tubeGeometry, tubeMaterial);
    tubes.renderOrder = 1;
    brain.add(tubes);

    const random = seededRandom();
    const particleCount = curves.length * PARTICLES_PER_CURVE;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const movingParticles = [];
    let particleIndex = 0;

    curves.forEach((curve) => {
      for (let index = 0; index < PARTICLES_PER_CURVE; index += 1) {
        const progress = random();
        const position = curve.getPointAt(progress);
        particlePositions[particleIndex * 3] = position.x;
        particlePositions[particleIndex * 3 + 1] = position.y;
        particlePositions[particleIndex * 3 + 2] = position.z;
        particleSizes[particleIndex] = THREE.MathUtils.lerp(0.3, 1, random());
        movingParticles.push({
          curve,
          progress,
          speed: random() * 0.01,
        });
        particleIndex += 1;
      }
    });

    const particleGeometry = new THREE.BufferGeometry();
    const particlePositionAttribute = new THREE.BufferAttribute(
      particlePositions,
      3,
    );
    particlePositionAttribute.setUsage(THREE.DynamicDrawUsage);
    particleGeometry.setAttribute("position", particlePositionAttribute);
    particleGeometry.setAttribute(
      "aRandom",
      new THREE.BufferAttribute(particleSizes, 1),
    );

    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.renderOrder = 2;
    brain.add(particles);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const pointerPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const pointerIntersection = new THREE.Vector3();
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let animationFrame = 0;
    let isVisible = true;
    let previousTime = performance.now();
    let previousRenderTime = 0;

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const updatePointer = (event) => {
      const bounds = container.getBoundingClientRect();
      const inside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!inside) {
        mouseTarget.set(10, 10, 10);
        return;
      }

      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      if (raycaster.ray.intersectPlane(pointerPlane, pointerIntersection)) {
        mouseTarget.copy(pointerIntersection);
        mouseTarget.y -= brain.position.y;
      }
    };

    const resetPointer = () => {
      mouseTarget.set(10, 10, 10);
    };

    const render = (time) => {
      animationFrame = window.requestAnimationFrame(render);
      if (time - previousRenderTime < TARGET_FRAME_INTERVAL) return;

      const delta = Math.min((time - previousTime) / 1000, 0.033);
      previousTime = time;
      previousRenderTime = time;

      if (isVisible) {
        controls.update();
        mouseCurrent.lerp(mouseTarget, reducedMotion ? 1 : 0.14);

        if (!reducedMotion) {
          tubeMaterial.uniforms.uTime.value = time * 0.001;

          movingParticles.forEach((particle, index) => {
            particle.progress =
              (particle.progress + particle.speed * delta * 60) % 1;
            const position = particle.curve.getPointAt(particle.progress);
            particlePositions[index * 3] = position.x;
            particlePositions[index * 3 + 1] = position.y;
            particlePositions[index * 3 + 2] = position.z;
          });
          particlePositionAttribute.needsUpdate = true;
        }

        renderer.render(scene, camera);
      }
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

    window.addEventListener("pointermove", updatePointer, { passive: true });
    container.addEventListener("pointerleave", resetPointer);

    resize();
    container.classList.add("is-ready");
    renderer.render(scene, camera);
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", updatePointer);
      container.removeEventListener("pointerleave", resetPointer);
      controls.dispose();
      tubeGeometry.dispose();
      tubeMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      container.classList.remove("is-ready");
    };
  }, []);

  return (
    <div
      className="brain-network"
      ref={containerRef}
      role="img"
      aria-label="Interactive white line animation in the shape of a brain."
    />
  );
}
