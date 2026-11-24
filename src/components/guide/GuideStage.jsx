import { Component, Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import GuideCharacter from "./GuideCharacter";

/**
 * Where the guide stands for each section, as fractions of the visible viewport.
 * x: horizontal centre (0 = middle, 0.5 = right edge), h: height, floor: feet height from
 * the bottom edge, yaw: turn toward the content (negative = toward the left column).
 * Each section has its own spot, so he visibly walks between them as you scroll.
 */
const LAYOUT = {
  desktop: {
    hero: { x: 0.24, h: 0.84, floor: 0.02, yaw: -0.12 },
    engineering: { x: 0.26, h: 0.8, floor: 0.01, yaw: -0.3 },
    memory: { x: 0.28, h: 0.8, floor: 0.01, yaw: -0.5 },
    llms: { x: 0.23, h: 0.78, floor: 0.01, yaw: -0.35 },
    infra: { x: 0.27, h: 0.8, floor: 0.01, yaw: -0.5 },
    experience: { x: 0.31, h: 0.8, floor: 0.01, yaw: -0.45 },
    projects: { x: 0.25, h: 0.8, floor: 0.01, yaw: -0.35 },
    contact: { x: 0.25, h: 0.8, floor: 0.01, yaw: -0.15 },
    default: { x: 0.25, h: 0.8, floor: 0.01, yaw: -0.32 },
  },
  // Phones: the guide stands top-right in the hero (he's hidden in the sections).
  mobile: {
    default: { x: 0.2, h: 0.36, floor: 0.53, yaw: -0.2 },
  },
};

const DESCENT_SECONDS = 1.8;
// Long, soft deceleration: falls quickly at first, then floats the last stretch down.
const easeOut = (t) => 1 - Math.pow(1 - t, 4);

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/** Soft round contact shadow drawn from a tiny canvas gradient. */
function useShadowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(30,40,70,0.5)");
    grad.addColorStop(0.5, "rgba(30,40,70,0.16)");
    grad.addColorStop(1, "rgba(30,40,70,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

const _head = new THREE.Vector3();

function Placement({ section, isMobile, reducedMotion, onLanded, onClick, headRef, children }) {
  const outer = useRef();
  const body = useRef();
  const shadow = useRef();
  const start = useRef(null);
  const landed = useRef(false);
  const first = useRef(true);
  const stride = useRef(0);
  const goalPos = useMemo(() => new THREE.Vector3(), []);
  const lastPos = useMemo(() => new THREE.Vector3(), []);
  const shadowTex = useShadowTexture();

  useFrame((state, delta) => {
    const vp = state.viewport.getCurrentViewport(state.camera, [0, 0, 0]);
    const set = isMobile ? LAYOUT.mobile : LAYOUT.desktop;
    const l = set[section] || set.default;
    const h = vp.height * l.h;
    const maxX = vp.width / 2 - h * 0.3;
    goalPos.set(Math.min(vp.width * l.x, maxX), -vp.height / 2 + vp.height * l.floor, 0);

    const g = outer.current;
    if (!g) return;
    lastPos.copy(g.position);
    if (first.current || reducedMotion) {
      g.position.copy(goalPos);
      g.scale.setScalar(h);
      g.rotation.y = l.yaw;
      first.current = false;
    } else {
      easing.damp3(g.position, goalPos, 0.6, delta);
      easing.damp(g.scale, "x", h, 0.6, delta);
      g.scale.y = g.scale.z = g.scale.x;
      easing.dampAngle(g.rotation, "y", l.yaw, 0.45, delta);
    }

    // Descent from the sky (character units: 1 = character height).
    const now = state.clock.elapsedTime;
    if (start.current === null) start.current = now;
    const p = reducedMotion ? 1 : Math.min((now - start.current) / DESCENT_SECONDS, 1);
    const e = easeOut(p);
    const lift = (1 - e) * (vp.height / h) * 1.2;

    // Walking between spots: a little bounce and sway that scales with speed.
    const speed = delta > 0 ? lastPos.distanceTo(g.position) / delta / h : 0;
    const moving = Math.min(speed * 2.5, 1);
    stride.current += delta * 9 * moving;
    const step = reducedMotion ? 0 : Math.abs(Math.sin(stride.current)) * 0.025 * moving;
    const hover = section === "hero" && !reducedMotion ? 0.012 + Math.sin(now * 1.1) * 0.008 * e : 0;
    if (body.current) {
      body.current.position.y = lift + hover + step;
      body.current.rotation.z = reducedMotion ? 0 : Math.sin(stride.current) * 0.03 * moving;
    }
    if (shadow.current) {
      const s = 0.35 + 0.65 * e;
      shadow.current.scale.set(s, s, s);
      shadow.current.material.opacity = 0.7 * e;
    }
    if (!landed.current && p >= 1) {
      landed.current = true;
      onLanded?.();
    }

    // Publish the head's screen position for the speech bubble (CSS custom properties).
    if (headRef?.current) {
      _head.copy(headRef.current).project(state.camera);
      const root = document.documentElement.style;
      root.setProperty("--guide-x", `${((_head.x + 1) / 2) * state.size.width}px`);
      root.setProperty("--guide-y", `${((1 - _head.y) / 2) * state.size.height}px`);
    }
  });

  const setCursor = (v) => {
    document.body.style.cursor = v;
  };

  return (
    <group ref={outer}>
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} renderOrder={-1}>
        <planeGeometry args={[0.55, 0.55]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={0} />
      </mesh>
      <group ref={body}>
        {/* Invisible hit area: hover shows a pointer, click makes him wave and talk. */}
        <mesh
          position={[0, 0.52, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          onPointerOver={() => setCursor("pointer")}
          onPointerOut={() => setCursor("")}
        >
          <boxGeometry args={[0.42, 1.02, 0.3]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
        </mesh>
        {children}
      </group>
    </group>
  );
}

class WebGLBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn("[guide] 3D guide disabled:", error);
    this.props.onFail?.();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function GuideStage({ section, pose, gesture, talking, isMobile, reducedMotion, paused, onLanded, onClick, onFail }) {
  const headRef = useRef(new THREE.Vector3());

  return (
    <WebGLBoundary onFail={onFail}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 30, near: 0.1, far: 50 }}
        dpr={isMobile ? [1, 1.5] : [1, 1.75]}
        // Stop rendering entirely while the guide is hidden (phones, below the hero).
        frameloop={paused ? "never" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
        // The canvas lets clicks through to the page; R3F listens on the page root instead,
        // so only the character itself is clickable.
        eventSource={document.getElementById("root")}
        eventPrefix="client"
      >
        <hemisphereLight args={["#eef4ff", "#dfe6f2", 1.0]} />
        <directionalLight position={[2, 6, 6]} intensity={1.9} color="#ffffff" />
        <directionalLight position={[0, 8, -5]} intensity={1.6} color="#f2f6ff" />
        <directionalLight position={[-5, 2, -3]} intensity={0.8} color="#bcd4ff" />
        <Environment />
        <Suspense fallback={null}>
          <Placement
            section={section}
            isMobile={isMobile}
            reducedMotion={reducedMotion}
            onLanded={onLanded}
            onClick={onClick}
            headRef={headRef}
          >
            <GuideCharacter pose={pose} gesture={gesture} talking={talking} headOut={headRef} reducedMotion={reducedMotion} />
          </Placement>
        </Suspense>
      </Canvas>
    </WebGLBoundary>
  );
}
