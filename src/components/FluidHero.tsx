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
    if (uAspectRatio >= 1.0) {
      p.x *= uAspectRatio;
    } else {
      p.y /= uAspectRatio;
    }
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
  uniform float uCenterY;
  uniform vec4 uBaseBgColor;
  uniform vec4 uRevealBgColor;
  uniform float uIsMobile;
  varying vec2 vUv;

  vec2 getMappedUv(vec2 uv, float imageAspect, float planeAspect, float contentScale, float centerY) {
    if (planeAspect < 1.0) {
      // Mobile / Portrait: Fit the 16:9 canvas horizontally within screen with responsive margins
      float wScale = contentScale;
      float hScale = contentScale * (planeAspect / imageAspect);
      return vec2(
        (uv.x - 0.5) / wScale + 0.5,
        (uv.y - centerY) / hScale + 0.5
      );
    } else {
      // Desktop / Landscape: Cover mapping matching original desktop scale
      vec2 ratio = vec2(
        min(planeAspect / imageAspect, 1.0),
        min(imageAspect / planeAspect, 1.0)
      );
      vec2 sharedUv = vec2(
        uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        uv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );
      return (sharedUv - 0.5) / contentScale + 0.5;
    }
  }

  void main() {
    vec2 uv = vUv;
    float dye = texture2D(uDye, uv).r;

    // Responsive UV mapping: guarantees full 16:9 logo is visible and never cut off on mobile phones
    vec2 scaledUv = getMappedUv(uv, 16.0 / 9.0, uPlaneAspect, uContentScale, uCenterY);

    // Seamless feathered boundary calculation for centered 16:9 logo box
    vec2 edgeDist = min(scaledUv, 1.0 - scaledUv);
    float boxDist = min(edgeDist.x, edgeDist.y);
    float boxFade = smoothstep(0.002, 0.040, boxDist);

    vec4 baseColor = uBaseBgColor;
    vec4 sharpRevealColor = uRevealBgColor;

    if (boxDist > 0.001) {
      vec2 clampedUv = clamp(scaledUv, 0.001, 0.999);
      vec4 sampleBase = texture2D(uBaseTexture, clampedUv);

      // High-precision adaptive edge unsharp mask to keep 2K Didone letterforms razor-sharp on mobile Retina/OLED
      vec2 baseTexel = vec2(1.0 / 2048.0, 1.0 / 1152.0);
      vec4 bTop    = texture2D(uBaseTexture, clamp(clampedUv + vec2(0.0, baseTexel.y), 0.001, 0.999));
      vec4 bBottom = texture2D(uBaseTexture, clamp(clampedUv - vec2(0.0, baseTexel.y), 0.001, 0.999));
      vec4 bLeft   = texture2D(uBaseTexture, clamp(clampedUv - vec2(baseTexel.x, 0.0), 0.001, 0.999));
      vec4 bRight  = texture2D(uBaseTexture, clamp(clampedUv + vec2(baseTexel.x, 0.0), 0.001, 0.999));
      vec4 bLaplacian = 4.0 * sampleBase - (bTop + bBottom + bLeft + bRight);
      sampleBase = clamp(sampleBase + 0.35 * bLaplacian, 0.0, 1.0);

      baseColor = mix(uBaseBgColor, sampleBase, boxFade);

      vec4 sharpVideo = texture2D(uRevealTexture, clampedUv);
      vec2 texel = vec2(1.0 / 1280.0, 1.0 / 720.0);
      vec4 cTop    = texture2D(uRevealTexture, clamp(clampedUv + vec2(0.0, texel.y), 0.001, 0.999));
      vec4 cBottom = texture2D(uRevealTexture, clamp(clampedUv - vec2(0.0, texel.y), 0.001, 0.999));
      vec4 cLeft   = texture2D(uRevealTexture, clamp(clampedUv - vec2(texel.x, 0.0), 0.001, 0.999));
      vec4 cRight  = texture2D(uRevealTexture, clamp(clampedUv + vec2(texel.x, 0.0), 0.001, 0.999));
      vec4 laplacian = 4.0 * sharpVideo - (cTop + cBottom + cLeft + cRight);

      float sharpenStrength = 0.35 * smoothstep(0.02, 0.08, boxDist);
      sharpVideo = clamp(sharpVideo + sharpenStrength * laplacian, 0.0, 1.0);

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
  const videoCreamRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<"dark" | "cream">("dark");
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    );
  }, []);

  const simulationRef = useRef<{
    setTextures: (base: THREE.Texture, reveal: THREE.Texture) => void;
    setBaseBgColor: (r: number, g: number, b: number, a: number) => void;
    setRevealBgColor: (r: number, g: number, b: number, a: number) => void;
    requestRender?: () => void;
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
    sim.requestRender?.();
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
    const videoCream = videoCreamRef.current;
    const container = containerRef.current;
    if (!canvas || !videoCream || !container) return;

    const isMobileScreen = typeof window !== "undefined" && (
      window.innerWidth <= 768 ||
      (window.innerWidth <= 1024 && window.matchMedia("(pointer: coarse)").matches)
    );

    // Exact fluid parameters dynamically tuned for mobile 60-120fps efficiency while preserving max PC fidelity
    const settings = {
      simResolution: isMobileScreen ? 128 : 256,
      dyeResolution: isMobileScreen ? 256 : 512,
      velocityDissipation: 0.962, // Gliding liquid momentum
      dyeDissipation: isMobileScreen ? 0.966 : 0.988, // Natural settling on mobile (~2s) without freezing
      pressureIterations: isMobileScreen ? 6 : 20, // 6 Jacobi iterations on 128x128 grid cuts 70% mobile draw calls
      curlStrength: 0.0,          // Zero turbulent smoke curl (pure sleek water stream)
      splatRadius: isMobileScreen ? 0.00035 : 0.00006, // Wider natural touch swath for finger drags
      splatForce: isMobileScreen ? 4200 : 5900,
      revealSize: isMobileScreen ? 3.4 : 3.9,
      edgeSoftness: 0.5,          // Clean liquid threshold
      edgeWidth: 0.01,            // Razor-sharp surface tension meniscus
    };

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false, // Opaque canvas removes compositor blending pass on mobile Safari/Chrome
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      });
    } catch {
      return;
    }

    // Maintain 2.0 DPR on mobile and desktop so Retina & OLED screens render crystal-clear text and logos
    const maxDpr = 2.0;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
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

    const maxAniso = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    const textureLoader = new THREE.TextureLoader();

    const texDarkBase = textureLoader.load("/base_dark_16_9.png");
    texDarkBase.generateMipmaps = true;
    texDarkBase.minFilter = THREE.LinearMipmapLinearFilter;
    texDarkBase.magFilter = THREE.LinearFilter;
    texDarkBase.anisotropy = maxAniso;
    texDarkBaseRef.current = texDarkBase;

    const texCreamBase = textureLoader.load("/base_cream_16_9.jpg");
    texCreamBase.generateMipmaps = true;
    texCreamBase.minFilter = THREE.LinearMipmapLinearFilter;
    texCreamBase.magFilter = THREE.LinearFilter;
    texCreamBase.anisotropy = maxAniso;
    texCreamBaseRef.current = texCreamBase;

    const texOffwhiteReveal = new THREE.VideoTexture(videoCream);
    texOffwhiteReveal.minFilter = THREE.LinearFilter;
    texOffwhiteReveal.magFilter = THREE.LinearFilter;
    texOffwhiteReveal.generateMipmaps = false;
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
        uCenterY: { value: 0.5 },
        uIsMobile: { value: isMobileScreen ? 1.0 : 0.0 },
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

    let planeAspect = window.innerWidth / window.innerHeight;
    let animId = 0;
    let activeSimFrames = 120;
    let lastVideoUpdate = 0;
    let isHeroInView = true;
    let isLoopRunning = false;

    const mouseSegments: { x0: number; y0: number; x1: number; y1: number }[] = [];
    let prevMouse: { x: number; y: number } | null = null;
    let hasPrevMouse = false;

    const animate = () => {
      if (!isHeroInView) {
        isLoopRunning = false;
        return;
      }

      // 1. Splat velocity & dye along smooth unbroken segment steps
      if (mouseSegments.length > 0) {
        activeSimFrames = isMobileScreen ? 260 : 360;
        const maxSegs = isMobileScreen ? 4 : 16;
        const segs = mouseSegments.splice(-maxSegs);
        mouseSegments.length = 0;

        const maxSteps = isMobileScreen ? 2 : 6;
        const stepDiv = isMobileScreen ? 0.018 : 0.008;

        for (let i = 0; i < segs.length; i++) {
          const seg = segs[i];
          const dx = seg.x1 - seg.x0;
          const dy = seg.y1 - seg.y0;
          const dist = Math.hypot(dx, dy);
          const steps = Math.min(maxSteps, Math.max(1, Math.ceil(dist / stepDiv)));

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

      if (activeSimFrames > 0) {
        activeSimFrames--;

        // 2. Vorticity / Curl (skip when curlStrength is 0.0 to save 2 FBO render passes)
        if (settings.curlStrength > 0.0) {
          curlMat.uniforms.uVelocity.value = velocity.read.texture;
          renderPass(curlMat, curlRT);

          vorticityMat.uniforms.uVelocity.value = velocity.read.texture;
          vorticityMat.uniforms.uCurl.value = curlRT.texture;
          vorticityMat.uniforms.uCurlStrength.value = settings.curlStrength;
          vorticityMat.uniforms.uDt.value = 0.016;
          renderPass(vorticityMat, velocity.write);
          velocity.swap();
        }

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

        // 8. Video texture frame update throttled for 30fps source on mobile
        if (videoCream.readyState >= videoCream.HAVE_CURRENT_DATA) {
          const now = performance.now();
          if (!isMobileScreen || now - lastVideoUpdate >= 32) {
            texOffwhiteReveal.needsUpdate = true;
            lastVideoUpdate = now;
          }
        }

        // 9. Composite Mask Shader Output to Canvas
        maskMaterial.uniforms.uDye.value = dye.read.texture;
        renderer.setRenderTarget(null);
        renderer.clear();
        renderer.render(scene, camera);

        if (isHeroInView) {
          animId = requestAnimationFrame(animate);
        } else {
          isLoopRunning = false;
        }
      } else {
        // Simulation settled: cleanly clear FBOs so 0 residual dye/velocity remains
        renderer.setRenderTarget(dye.read);
        renderer.clear();
        renderer.setRenderTarget(dye.write);
        renderer.clear();
        renderer.setRenderTarget(velocity.read);
        renderer.clear();
        renderer.setRenderTarget(velocity.write);
        renderer.clear();

        maskMaterial.uniforms.uDye.value = dye.read.texture;
        renderer.setRenderTarget(null);
        renderer.clear();
        renderer.render(scene, camera);
        isLoopRunning = false;
      }
    };

    const startLoop = () => {
      if (!isLoopRunning && isHeroInView) {
        isLoopRunning = true;
        animId = requestAnimationFrame(animate);
      }
    };

    const stopLoop = () => {
      isLoopRunning = false;
      cancelAnimationFrame(animId);
    };

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
      requestRender: () => {
        activeSimFrames = Math.max(activeSimFrames, 15);
        startLoop();
      },
    };

    const resize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      planeAspect = width / height;

      const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      maskMaterial.uniforms.uPlaneAspect.value = planeAspect;
      splatMat.uniforms.uAspectRatio.value = planeAspect;

      // Dynamically measure visual center of the open stage between header and bottom controls
      let centerY = 0.5;
      if (stageRef.current && height > 0) {
        const stageRect = stageRef.current.getBoundingClientRect();
        if (stageRect.height > 0) {
          const stageCenterY = (stageRect.top + stageRect.height / 2) - rect.top;
          // In WebGL UV: 0.0 is bottom, 1.0 is top
          centerY = 1.0 - (stageCenterY / height);
          centerY = Math.max(0.35, Math.min(0.65, centerY));
        }
      }
      maskMaterial.uniforms.uCenterY.value = centerY;

      const isSmallPhone = width <= 480;
      const isMobile = width <= 768;
      let contentScale = isSmallPhone ? 0.86 : isMobile ? 0.78 : 0.58;

      // In portrait, ensure the 16:9 logo height never exceeds 76% of available open stage height
      if (width < height && stageRef.current) {
        const stageHeight = stageRef.current.getBoundingClientRect().height;
        if (stageHeight > 0) {
          const maxScaleForStage = (stageHeight * 0.76 * (16 / 9)) / width;
          contentScale = Math.min(contentScale, maxScaleForStage);
        }
      }
      maskMaterial.uniforms.uContentScale.value = contentScale;

      activeSimFrames = Math.max(activeSimFrames, 10);
      startLoop();
    };

    resize();
    const frameId = requestAnimationFrame(resize);
    const timerId = setTimeout(resize, 80);

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);

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
      startLoop();
    };

    const handleMouseLeave = () => {
      hasPrevMouse = false;
      prevMouse = null;
      activeSimFrames = Math.max(activeSimFrames, isMobileScreen ? 200 : 280);
    };

    const handleTouchStart = (e: TouchEvent) => {
      hasPrevMouse = false;
      prevMouse = null;
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const rect = container.getBoundingClientRect();
        if (t.clientY < rect.top || t.clientY > rect.bottom || t.clientX < rect.left || t.clientX > rect.right) return;

        const normX = (t.clientX - rect.left) / rect.width;
        const normY = (t.clientY - rect.top) / rect.height;
        onMouseMoveNormalized(normX, normY);
        // Instant tactile fluid response on initial touch
        mouseSegments.push({
          x0: normX,
          y0: 1.0 - normY,
          x1: normX + 0.001,
          y1: 1.0 - normY + 0.001,
        });
        startLoop();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const rect = container.getBoundingClientRect();
        if (t.clientY < rect.top || t.clientY > rect.bottom || t.clientX < rect.left || t.clientX > rect.right) {
          hasPrevMouse = false;
          prevMouse = null;
          return;
        }

        const normX = (t.clientX - rect.left) / rect.width;
        const normY = (t.clientY - rect.top) / rect.height;
        onMouseMoveNormalized(normX, normY);
        startLoop();
      }
    };

    const handleTouchEnd = () => {
      hasPrevMouse = false;
      prevMouse = null;
      activeSimFrames = Math.max(activeSimFrames, isMobileScreen ? 200 : 280);
      startLoop();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    const playVideos = () => {
      if (videoCream) videoCream.play().catch(() => {});
    };
    playVideos();
    window.addEventListener("click", playVideos, { once: true });
    window.addEventListener("touchstart", playVideos, { once: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        isHeroInView = entry.isIntersecting;
        if (isHeroInView) {
          activeSimFrames = Math.max(activeSimFrames, 5);
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    startLoop();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
      clearTimeout(timerId);
      stopLoop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
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
      className={`relative w-full h-[100vh] h-[100dvh] min-h-[100vh] min-h-[100dvh] overflow-hidden select-none transition-colors duration-500 ${
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

      {/* Offscreen Video Element for WebGL VideoTexture */}
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
      <div className="absolute inset-0 z-[1] w-full h-full pointer-events-none overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Page UI Container (Pristine layout matching index.html with safe-area protection) */}
      <div
        className="relative z-10 w-full h-full flex flex-col justify-between p-4 sm:p-10 lg:px-14 lg:py-9 pointer-events-none"
        style={{
          paddingTop: "max(1rem, env(safe-area-inset-top, 1rem))",
          paddingBottom: "max(1rem, env(safe-area-inset-bottom, 1rem))",
          paddingLeft: "max(1rem, env(safe-area-inset-left, 1rem))",
          paddingRight: "max(1rem, env(safe-area-inset-right, 1rem))",
        }}
      >
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 sm:gap-4 pointer-events-auto w-full">
          <div
            className="font-['Space_Grotesk',sans-serif] text-[11px] sm:text-[0.95rem] leading-[1.35] tracking-tight font-medium"
            style={{ color: isCream ? "#666666" : "#888888" }}
          >
            Not a style, a perspective.<br />
            <span className="font-semibold text-xs sm:text-base" style={{ color: isCream ? "#111111" : "#ffffff" }}>
              Because Red Studios is Everythin&apos;.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 self-start sm:self-auto">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="interactive-target flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{
                background: isCream ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)",
                border: isCream ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(255,255,255,0.12)",
                color: isCream ? "#111111" : "#ffffff",
              }}
              title="Toggle between Dark Obsidian & Studio Cream"
            >
              <span className="w-2 h-2 rounded-full bg-[#ff3333] shadow-[0_0_8px_#ff3333] shrink-0" />
              <span>Theme: {isCream ? "Studio Cream" : "Dark Obsidian"}</span>
            </button>

            {/* Availability Status Badge */}
            <div
              className="hidden md:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
              style={{ color: isCream ? "#666666" : "#888888" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e] animate-pulse shrink-0" />
              Available Q4/2026
            </div>

            {/* Book a Call CTA */}
            <a
              href="#call"
              className="interactive-target px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-[11px] sm:text-sm font-semibold backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
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
        <div ref={stageRef} className="flex-1 w-full min-h-0 flex items-center justify-center pointer-events-none" />

        {/* Bottom Instruction Tag & Scroll Down Pill */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 my-2 sm:my-4 pointer-events-auto max-w-[92vw] mx-auto">
          <div
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-['Space_Grotesk',sans-serif] font-semibold tracking-wider uppercase backdrop-blur-md pointer-events-none text-center max-w-full"
            style={{
              background: isCream ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)",
              border: isCream ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(255,255,255,0.12)",
              color: isCream ? "#666666" : "#888888",
            }}
          >
            <span>
              ● Navier-Stokes — {isTouch ? "Drag finger across logo" : "Move cursor across logo"}
            </span>
          </div>

          <a
            href="#editorial-showcase"
            className="interactive-target inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-['Space_Grotesk',sans-serif] tracking-wider uppercase transition-all duration-200 hover:text-[#ff3333]"
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
          className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 pointer-events-auto text-[10px] sm:text-xs"
          style={{ color: isCream ? "#666666" : "#888888" }}
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="tracking-wider uppercase font-semibold text-[9px] min-[380px]:text-[10px] sm:text-xs whitespace-nowrap">
              LONDON / TOKYO / NEW YORK
            </span>
            <span className="hidden sm:inline opacity-60">© 2026 Red Studios. All rights reserved.</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-2.5 min-[380px]:gap-3 sm:gap-6 text-[10px] sm:text-xs">
            <a href="#instagram" className="interactive-target hover:text-[#ff3333] transition-colors py-0.5 sm:py-1">
              Instagram
            </a>
            <a href="#twitter" className="interactive-target hover:text-[#ff3333] transition-colors py-0.5 sm:py-1">
              Twitter / X
            </a>
            <a href="#behance" className="interactive-target hover:text-[#ff3333] transition-colors py-0.5 sm:py-1">
              Behance
            </a>
            <a href="#brief" className="interactive-target hover:text-[#ff3333] transition-colors py-0.5 sm:py-1">
              Contact
            </a>
          </nav>
        </footer>
      </div>
    </section>
  );
}
