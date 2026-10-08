"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// --- Navier-Stokes GPGPU Shaders (Rich Waves, Organic Randomness & Silky Liquid Motion) ---
const quadVertShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const advectionShader = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 uTexelSize;
  uniform float uDt;
  uniform float uDissipation;
  varying vec2 vUv;

  vec4 bilerp(sampler2D sam, vec2 uv, vec2 tsize) {
    vec2 st = uv / tsize - 0.5;
    vec2 iuv = floor(st);
    vec2 fuv = fract(st);
    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
  }

  void main() {
    vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexelSize;
    vec4 result = uDissipation * bilerp(uSource, coord, uTexelSize);
    gl_FragColor = result;
  }
`;

const splatShader = `
  precision highp float;
  uniform sampler2D uTarget;
  uniform float uAspectRatio;
  uniform vec2 uPoint;
  uniform vec3 uColor;
  uniform float uRadius;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - uPoint;
    p.x *= uAspectRatio;
    vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const curlShader = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;
  varying vec2 vUv;

  void main() {
    float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
    float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
    float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
    float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

const vorticityShader = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform vec2 uTexelSize;
  uniform float uCurlStrength;
  uniform float uDt;
  varying vec2 vUv;

  void main() {
    float L = texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x;
    float T = texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x;
    float B = texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x;
    float C = texture2D(uCurl, vUv).x;

    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    float len = length(force) + 0.0001;
    force = force / len * uCurlStrength * C;

    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * uDt;
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const divergenceShader = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;
  varying vec2 vUv;

  void main() {
    float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
    float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
    float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const pressureShader = `
  precision highp float;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  uniform vec2 uTexelSize;
  varying vec2 vUv;

  void main() {
    float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
    float C = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - C) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const gradientSubtractShader = `
  precision highp float;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;
  varying vec2 vUv;

  void main() {
    float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity -= vec2(R - L, T - B) * 0.5;
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

// Master Mask Composite Shader with Multi-Harmonic Waves & Organic Randomness
const maskCompositeFragShader = `
  precision highp float;
  uniform sampler2D uBaseTexture;
  uniform sampler2D uRevealTexture;
  uniform sampler2D uDye;
  uniform float uRevealSize;
  uniform float uEdgeSoftness;
  uniform float uEdgeWidth;
  uniform float uPlaneAspect;
  uniform float uContentScale;
  uniform vec4 uBaseBgColor;
  uniform vec4 uRevealBgColor;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv, float imageAspect, float planeAspect) {
    vec2 ratio = vec2(
      min(planeAspect / imageAspect, 1.0),
      min(imageAspect / planeAspect, 1.0)
    );
    return vec2(
      uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  }

  void main() {
    vec2 uv = vUv;
    float dye = texture2D(uDye, uv).r;

    // Shared 16:9 UV mapping
    vec2 sharedUv = coverUv(uv, 16.0 / 9.0, uPlaneAspect);
    vec2 scaledUv = (sharedUv - 0.5) / uContentScale + 0.5;

    // Seamless feathered boundary calculation for centered 16:9 logo box
    vec2 edgeDist = min(scaledUv, 1.0 - scaledUv);
    float boxDist = min(edgeDist.x, edgeDist.y);
    float boxFade = smoothstep(0.002, 0.040, boxDist);

    vec4 baseColor = uBaseBgColor;
    vec4 sharpRevealColor = uRevealBgColor;

    if (boxDist > 0.001) {
      vec2 clampedUv = clamp(scaledUv, 0.001, 0.999);
      vec4 sampleBase = texture2D(uBaseTexture, clampedUv);
      baseColor = mix(uBaseBgColor, sampleBase, boxFade);

      // High-clarity video sampling with edge-safe Laplacian unsharp mask
      vec2 texel = vec2(1.0 / 1280.0, 1.0 / 720.0);
      vec4 cCenter = texture2D(uRevealTexture, clampedUv);
      vec4 cTop    = texture2D(uRevealTexture, clamp(clampedUv + vec2(0.0, texel.y), 0.001, 0.999));
      vec4 cBottom = texture2D(uRevealTexture, clamp(clampedUv - vec2(0.0, texel.y), 0.001, 0.999));
      vec4 cLeft   = texture2D(uRevealTexture, clamp(clampedUv - vec2(texel.x, 0.0), 0.001, 0.999));
      vec4 cRight  = texture2D(uRevealTexture, clamp(clampedUv + vec2(texel.x, 0.0), 0.001, 0.999));
      vec4 laplacian = 4.0 * cCenter - (cTop + cBottom + cLeft + cRight);

      float sharpenStrength = 0.35 * smoothstep(0.02, 0.08, boxDist);
      vec4 sharpVideo = clamp(cCenter + sharpenStrength * laplacian, 0.0, 1.0);

      sharpRevealColor = mix(uRevealBgColor, sharpVideo, boxFade);
    }

    // Pure liquid mask with crisp surface tension (identical to noth.in)
    float raw = dye * uRevealSize;
    float mask = smoothstep(uEdgeSoftness, uEdgeSoftness + uEdgeWidth, raw);
    mask = clamp(mask, 0.0, 1.0);

    gl_FragColor = mix(baseColor, sharpRevealColor, mask);
  }
`;

export default function FluidHero() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoDarkRef = useRef<HTMLVideoElement>(null);
  const videoCreamRef = useRef<HTMLVideoElement>(null);

  const [theme, setTheme] = useState<"dark" | "cream">("dark");

  const simulationRef = useRef<{
    setTextures: (base: THREE.Texture, reveal: THREE.Texture) => void;
    setBaseBgColor: (r: number, g: number, b: number, a: number) => void;
    setRevealBgColor: (r: number, g: number, b: number, a: number) => void;
  } | null>(null);

  const texDarkBaseRef = useRef<THREE.Texture | null>(null);
  const texCreamBaseRef = useRef<THREE.Texture | null>(null);
  const texRevealRef = useRef<THREE.VideoTexture | null>(null);

  const switchTheme = useCallback((newTheme: "dark" | "cream") => {
    setTheme(newTheme);
    const sim = simulationRef.current;
    if (!sim) return;

    if (newTheme === "dark") {
      if (texDarkBaseRef.current && texRevealRef.current) {
        sim.setTextures(texDarkBaseRef.current, texRevealRef.current);
      }
      sim.setBaseBgColor(0.0, 0.0, 0.0, 1.0);
      sim.setRevealBgColor(238.25 / 255, 236.33 / 255, 227.14 / 255, 1.0);
    } else {
      if (texCreamBaseRef.current && texRevealRef.current) {
        sim.setTextures(texCreamBaseRef.current, texRevealRef.current);
      }
      sim.setBaseBgColor(246 / 255, 245 / 255, 240 / 255, 1.0);
      sim.setRevealBgColor(238.25 / 255, 236.33 / 255, 227.14 / 255, 1.0);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    switchTheme(theme === "dark" ? "cream" : "dark");
  }, [theme, switchTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "t" || e.key === "T") {
        if (!["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
          toggleTheme();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const videoDark = videoDarkRef.current;
    const videoCream = videoCreamRef.current;
    const container = containerRef.current;
    if (!canvas || !videoCream || !container) return;

    // Exact fluid parameters from noth.in for pure liquid flow & forward water throw
    const settings = {
      simResolution: 256,
      dyeResolution: 512,
      velocityDissipation: 0.962, // Gliding liquid momentum
      dyeDissipation: 0.988,      // Velvety lingering dye trail
      pressureIterations: 20,     // Incompressibility Jacobi solver
      curlStrength: 0.0,          // Zero turbulent smoke curl (pure sleek water stream)
      splatRadius: 0.00006,       // Tight injection that expands naturally via velocity advection
      splatForce: 5900,           // Powerful ballistic velocity impulse
      revealSize: 3.9,            // Generous liquid reveal coverage
      edgeSoftness: 0.5,          // Clean liquid threshold
      edgeWidth: 0.01,            // Razor-sharp surface tension meniscus
    };

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.autoClear = false;

    const isIos = typeof navigator !== "undefined" && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    const floatType = isIos ? THREE.HalfFloatType : THREE.FloatType;

    const createFBO = (w: number, h: number, filter: THREE.MinificationTextureFilter = THREE.LinearFilter) =>
      new THREE.WebGLRenderTarget(w, h, {
        minFilter: filter,
        magFilter: filter as THREE.MagnificationTextureFilter,
        format: THREE.RGBAFormat,
        type: floatType,
        depthBuffer: false,
        stencilBuffer: false,
      });

    const createDoubleFBO = (w: number, h: number, filter: THREE.MinificationTextureFilter = THREE.LinearFilter) => ({
      read: createFBO(w, h, filter),
      write: createFBO(w, h, filter),
      swap() {
        const tmp = this.read;
        this.read = this.write;
        this.write = tmp;
      },
    });

    const simRes = settings.simResolution;
    const dyeRes = settings.dyeResolution;
    const simTexelSize = new THREE.Vector2(1 / simRes, 1 / simRes);
    const dyeTexelSize = new THREE.Vector2(1 / dyeRes, 1 / dyeRes);

    const velocity = createDoubleFBO(simRes, simRes);
    const dye = createDoubleFBO(dyeRes, dyeRes);
    const divergenceRT = createFBO(simRes, simRes, THREE.NearestFilter);
    const curlRT = createFBO(simRes, simRes, THREE.NearestFilter);
    const pressure = createDoubleFBO(simRes, simRes, THREE.NearestFilter);

    const quadScene = new THREE.Scene();
    const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const makePassMat = (fragShader: string, uniforms: Record<string, { value: unknown }>) =>
      new THREE.ShaderMaterial({
        vertexShader: quadVertShader,
        fragmentShader: fragShader,
        uniforms,
        depthTest: false,
        depthWrite: false,
      });

    const splatMat = makePassMat(splatShader, {
      uTarget: { value: null },
      uAspectRatio: { value: 1.0 },
      uPoint: { value: new THREE.Vector2(0.5, 0.5) },
      uColor: { value: new THREE.Vector3(0, 0, 0) },
      uRadius: { value: settings.splatRadius },
    });

    const curlMat = makePassMat(curlShader, {
      uVelocity: { value: null },
      uTexelSize: { value: simTexelSize },
    });

    const vorticityMat = makePassMat(vorticityShader, {
      uVelocity: { value: null },
      uCurl: { value: null },
      uTexelSize: { value: simTexelSize },
      uCurlStrength: { value: settings.curlStrength },
      uDt: { value: 0.016 },
    });

    const advectionMat = makePassMat(advectionShader, {
      uVelocity: { value: null },
      uSource: { value: null },
      uTexelSize: { value: simTexelSize },
      uDt: { value: 1.0 },
      uDissipation: { value: settings.velocityDissipation },
    });

    const divergenceMat = makePassMat(divergenceShader, {
      uVelocity: { value: null },
      uTexelSize: { value: simTexelSize },
    });

    const pressureMat = makePassMat(pressureShader, {
      uPressure: { value: null },
      uDivergence: { value: null },
      uTexelSize: { value: simTexelSize },
    });

    const gradientSubMat = makePassMat(gradientSubtractShader, {
      uPressure: { value: null },
      uVelocity: { value: null },
      uTexelSize: { value: simTexelSize },
    });

    const quadMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), splatMat);
    quadScene.add(quadMesh);

    const renderPass = (material: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget) => {
      quadMesh.material = material;
      renderer.setRenderTarget(target);
      renderer.render(quadScene, quadCamera);
    };

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const textureLoader = new THREE.TextureLoader();

    const texDarkBase = textureLoader.load("/base_dark_16_9.png");
    texDarkBase.minFilter = THREE.LinearMipmapLinearFilter;
    texDarkBase.magFilter = THREE.LinearFilter;
    texDarkBase.generateMipmaps = true;
    texDarkBase.anisotropy = maxAniso;
    texDarkBaseRef.current = texDarkBase;

    const texCreamBase = textureLoader.load("/base_cream_16_9.jpg");
    texCreamBase.minFilter = THREE.LinearMipmapLinearFilter;
    texCreamBase.magFilter = THREE.LinearFilter;
    texCreamBase.generateMipmaps = true;
    texCreamBase.anisotropy = maxAniso;
    texCreamBaseRef.current = texCreamBase;

    const texOffwhiteReveal = new THREE.VideoTexture(videoCream);
    texOffwhiteReveal.minFilter = THREE.LinearFilter;
    texOffwhiteReveal.magFilter = THREE.LinearFilter;
    texOffwhiteReveal.anisotropy = maxAniso;
    texRevealRef.current = texOffwhiteReveal;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const maskMaterial = new THREE.ShaderMaterial({
      vertexShader: quadVertShader,
      fragmentShader: maskCompositeFragShader,
      uniforms: {
        uBaseTexture: { value: theme === "dark" ? texDarkBase : texCreamBase },
        uRevealTexture: { value: texOffwhiteReveal },
        uDye: { value: null },
        uRevealSize: { value: settings.revealSize },
        uEdgeSoftness: { value: settings.edgeSoftness },
        uEdgeWidth: { value: settings.edgeWidth },
        uPlaneAspect: { value: 16 / 9 },
        uContentScale: { value: 0.58 },
        uBaseBgColor: {
          value:
            theme === "dark"
              ? new THREE.Vector4(0.0, 0.0, 0.0, 1.0)
              : new THREE.Vector4(246 / 255, 245 / 255, 240 / 255, 1.0),
        },
        uRevealBgColor: {
          value: new THREE.Vector4(238.25 / 255, 236.33 / 255, 227.14 / 255, 1.0),
        },
      },
      depthTest: false,
      depthWrite: false,
    });

    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), maskMaterial);
    scene.add(screenMesh);

    simulationRef.current = {
      setTextures: (base: THREE.Texture, reveal: THREE.Texture) => {
        maskMaterial.uniforms.uBaseTexture.value = base;
        maskMaterial.uniforms.uRevealTexture.value = reveal;
      },
      setBaseBgColor: (r: number, g: number, b: number, a: number) => {
        (maskMaterial.uniforms.uBaseBgColor.value as THREE.Vector4).set(r, g, b, a);
      },
      setRevealBgColor: (r: number, g: number, b: number, a: number) => {
        (maskMaterial.uniforms.uRevealBgColor.value as THREE.Vector4).set(r, g, b, a);
      },
    };

    let planeAspect = window.innerWidth / window.innerHeight;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      planeAspect = width / height;

      renderer.setSize(width, height, false);
      maskMaterial.uniforms.uPlaneAspect.value = planeAspect;

      const isMobile = width <= 768;
      maskMaterial.uniforms.uContentScale.value = isMobile ? 0.85 : 0.58;
    };
    resize();
    window.addEventListener("resize", resize);

    const mouseSegments: { x0: number; y0: number; x1: number; y1: number }[] = [];
    let prevMouse: { x: number; y: number } | null = null;
    let hasPrevMouse = false;

    const onMouseMoveNormalized = (normX: number, normY: number) => {
      const x = Math.max(0, Math.min(1, normX));
      const y = 1.0 - Math.max(0, Math.min(1, normY)); // Invert for WebGL coordinates

      if (!hasPrevMouse || !prevMouse) {
        prevMouse = { x, y };
        hasPrevMouse = true;
        return;
      }

      const dx = x - prevMouse.x;
      const dy = y - prevMouse.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 0.0001) {
        mouseSegments.push({
          x0: prevMouse.x,
          y0: prevMouse.y,
          x1: x,
          y1: y,
        });
        prevMouse = { x, y };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) {
        hasPrevMouse = false;
        prevMouse = null;
        return;
      }

      const normX = (e.clientX - rect.left) / rect.width;
      const normY = (e.clientY - rect.top) / rect.height;
      onMouseMoveNormalized(normX, normY);
    };

    const handleMouseLeave = () => {
      hasPrevMouse = false;
      prevMouse = null;
    };

    const handleTouchStart = (e: TouchEvent) => {
      hasPrevMouse = false;
      prevMouse = null;
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const rect = container.getBoundingClientRect();
        const normX = (t.clientX - rect.left) / rect.width;
        const normY = (t.clientY - rect.top) / rect.height;
        onMouseMoveNormalized(normX, normY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const rect = container.getBoundingClientRect();
        const normX = (t.clientX - rect.left) / rect.width;
        const normY = (t.clientY - rect.top) / rect.height;
        onMouseMoveNormalized(normX, normY);
      }
    };

    const handleTouchEnd = () => {
      hasPrevMouse = false;
      prevMouse = null;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    const playVideos = () => {
      if (videoDark) videoDark.play().catch(() => {});
      if (videoCream) videoCream.play().catch(() => {});
    };
    playVideos();
    window.addEventListener("click", playVideos, { once: true });
    window.addEventListener("touchstart", playVideos, { once: true });

    let animId: number;

    const animate = () => {
      // 1. Splat velocity & dye along smooth unbroken segment steps
      if (mouseSegments.length > 0) {
        const segs = mouseSegments.splice(-16);
        mouseSegments.length = 0;

        for (let i = 0; i < segs.length; i++) {
          const seg = segs[i];
          const dx = seg.x1 - seg.x0;
          const dy = seg.y1 - seg.y0;
          const dist = Math.hypot(dx, dy);
          const steps = Math.min(6, Math.max(1, Math.ceil(dist / 0.008)));

          for (let step = 1; step <= steps; step++) {
            const t = step / steps;
            const px = seg.x0 + dx * t;
            const py = seg.y0 + dy * t;

            // Velocity splat: imparts physical momentum along drag vector
            splatMat.uniforms.uTarget.value = velocity.read.texture;
            splatMat.uniforms.uAspectRatio.value = planeAspect;
            (splatMat.uniforms.uPoint.value as THREE.Vector2).set(px, py);
            (splatMat.uniforms.uColor.value as THREE.Vector3).set(dx * settings.splatForce, dy * settings.splatForce, 0);
            splatMat.uniforms.uRadius.value = settings.splatRadius;
            renderPass(splatMat, velocity.write);
            velocity.swap();

            // Dye splat: injects white reveal dye
            splatMat.uniforms.uTarget.value = dye.read.texture;
            (splatMat.uniforms.uColor.value as THREE.Vector3).set(1.0, 1.0, 1.0);
            splatMat.uniforms.uRadius.value = settings.splatRadius;
            renderPass(splatMat, dye.write);
            dye.swap();
          }
        }
      }

      // 2. Vorticity / Curl
      curlMat.uniforms.uVelocity.value = velocity.read.texture;
      renderPass(curlMat, curlRT);

      vorticityMat.uniforms.uVelocity.value = velocity.read.texture;
      vorticityMat.uniforms.uCurl.value = curlRT.texture;
      vorticityMat.uniforms.uCurlStrength.value = settings.curlStrength;
      vorticityMat.uniforms.uDt.value = 0.016;
      renderPass(vorticityMat, velocity.write);
      velocity.swap();

      // 3. Advection (Velocity) with uDt = 1.0 for forward liquid momentum
      advectionMat.uniforms.uVelocity.value = velocity.read.texture;
      advectionMat.uniforms.uSource.value = velocity.read.texture;
      advectionMat.uniforms.uTexelSize.value = simTexelSize;
      advectionMat.uniforms.uDt.value = 1.0;
      advectionMat.uniforms.uDissipation.value = settings.velocityDissipation;
      renderPass(advectionMat, velocity.write);
      velocity.swap();

      // 4. Advection (Dye) with uDt = 1.0 for forward liquid water throw
      advectionMat.uniforms.uVelocity.value = velocity.read.texture;
      advectionMat.uniforms.uSource.value = dye.read.texture;
      advectionMat.uniforms.uTexelSize.value = dyeTexelSize;
      advectionMat.uniforms.uDt.value = 1.0;
      advectionMat.uniforms.uDissipation.value = settings.dyeDissipation;
      renderPass(advectionMat, dye.write);
      dye.swap();

      // 5. Divergence
      divergenceMat.uniforms.uVelocity.value = velocity.read.texture;
      renderPass(divergenceMat, divergenceRT);

      // 6. Pressure Jacobi Solver
      renderer.setRenderTarget(pressure.read);
      renderer.clear();
      renderer.setRenderTarget(null);
      pressureMat.uniforms.uDivergence.value = divergenceRT.texture;
      for (let i = 0; i < settings.pressureIterations; i++) {
        pressureMat.uniforms.uPressure.value = pressure.read.texture;
        renderPass(pressureMat, pressure.write);
        pressure.swap();
      }

      // 7. Gradient Subtraction
      gradientSubMat.uniforms.uPressure.value = pressure.read.texture;
      gradientSubMat.uniforms.uVelocity.value = velocity.read.texture;
      renderPass(gradientSubMat, velocity.write);
      velocity.swap();

      // 8. Video texture frame update
      if (videoCream.readyState >= videoCream.HAVE_CURRENT_DATA) {
        texOffwhiteReveal.needsUpdate = true;
      }

      // 9. Composite Mask Shader Output to Canvas
      maskMaterial.uniforms.uDye.value = dye.read.texture;

      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(scene, camera);

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      renderer.dispose();
    };
  }, [theme]);

  const isCream = theme === "cream";

  return (
    <section
      ref={containerRef}
      id="intro"
      className={`relative w-full h-screen min-h-screen overflow-hidden select-none transition-colors duration-500 ${
        isCream ? "bg-[#f6f5f0] text-[#111111]" : "bg-[#000000] text-[#ffffff]"
      }`}
    >
      {/* Ambient Radial Spotlight */}
      <div
        className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] max-w-[900px] max-h-[900px] opacity-30 z-0 transition-opacity duration-500"
        style={{
          background: isCream
            ? "radial-gradient(circle, rgba(255, 43, 43, 0.3) 0%, rgba(0, 0, 0, 0) 70%)"
            : "radial-gradient(circle, rgba(255, 51, 51, 0.45) 0%, rgba(0, 0, 0, 0) 70%)",
        }}
      />

      {/* Offscreen Video Elements for WebGL VideoTexture */}
      <video
        ref={videoDarkRef}
        src="/video_dark.mp4"
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <video
        ref={videoCreamRef}
        src="/video.mp4"
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      {/* Full-Screen WebGL Fluid Mask Canvas */}
      <div className="absolute inset-0 z-[1] w-full h-full pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Page UI Container (Pristine layout matching index.html) */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-10 lg:px-14 lg:py-9 pointer-events-none">
        {/* Top Header */}
        <header className="flex justify-between items-start pointer-events-auto">
          <div
            className="font-['Space_Grotesk',sans-serif] text-[0.95rem] leading-[1.5] tracking-tight font-medium"
            style={{ color: isCream ? "#666666" : "#888888" }}
          >
            Not a style, a perspective.<br />
            <span className="font-semibold" style={{ color: isCream ? "#111111" : "#ffffff" }}>
              Because Red Studios is Everythin&apos;.
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="interactive-target flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold backdrop-blur-md transition-all duration-200 hover:scale-105"
              style={{
                background: isCream ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)",
                border: isCream ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(255,255,255,0.12)",
                color: isCream ? "#111111" : "#ffffff",
              }}
              title="Toggle between Dark Obsidian & Studio Cream (or press 'T')"
            >
              <span className="w-2 h-2 rounded-full bg-[#ff3333] shadow-[0_0_8px_#ff3333]" />
              <span>Theme: {isCream ? "Studio Cream" : "Dark Obsidian"}</span>
            </button>

            {/* Availability Status Badge */}
            <div
              className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: isCream ? "#666666" : "#888888" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e] animate-pulse" />
              Available Q4/2026
            </div>

            {/* Book a Call CTA */}
            <a
              href="#call"
              className="interactive-target px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: isCream ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)",
                border: isCream ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(255,255,255,0.12)",
                color: isCream ? "#111111" : "#ffffff",
              }}
            >
              Book a Call
            </a>
          </div>
        </header>

        {/* Center: Open Stage showcasing the Red Studios logo & fluid reveal */}
        <div className="flex-1 pointer-events-none" />

        {/* Bottom Instruction Tag & Scroll Down Pill */}
        <div className="flex flex-col items-center gap-3 my-4 pointer-events-auto">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-['Space_Grotesk',sans-serif] font-semibold tracking-wider uppercase backdrop-blur-md pointer-events-none"
            style={{
              background: isCream ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)",
              border: isCream ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(255,255,255,0.12)",
              color: isCream ? "#666666" : "#888888",
            }}
          >
            <span>● Navier-Stokes Fluid Reveal — Move cursor across the logo</span>
          </div>

          <a
            href="#editorial-showcase"
            className="interactive-target inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-['Space_Grotesk',sans-serif] tracking-wider uppercase transition-all duration-200 hover:text-[#ff3333]"
            style={{
              color: isCream ? "#777777" : "#aaaaaa",
            }}
          >
            <span>Scroll to Explore</span>
            <span className="animate-bounce text-[#ff3333] font-bold">↓</span>
          </a>
        </div>

        {/* Footer */}
        <footer
          className="flex justify-between items-center pointer-events-auto text-xs"
          style={{ color: isCream ? "#666666" : "#888888" }}
        >
          <div className="flex items-center gap-4">
            <span className="tracking-wider uppercase font-semibold">LONDON / TOKYO / NEW YORK</span>
            <span className="hidden sm:inline opacity-60">© 2026 Red Studios. All rights reserved.</span>
          </div>

          <nav className="flex items-center gap-4 sm:gap-6">
            <a href="#instagram" className="interactive-target hover:text-[#ff3333] transition-colors">
              Instagram
            </a>
            <a href="#twitter" className="interactive-target hover:text-[#ff3333] transition-colors">
              Twitter / X
            </a>
            <a href="#behance" className="interactive-target hover:text-[#ff3333] transition-colors">
              Behance
            </a>
            <a href="#brief" className="interactive-target hover:text-[#ff3333] transition-colors">
              Contact
            </a>
          </nav>
        </footer>
      </div>
    </section>
  );
}
