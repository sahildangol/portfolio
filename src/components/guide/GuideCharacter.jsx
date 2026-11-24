import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Packed by tools/model/pack.py (one file, JPEG textures, ~2 MB).
export const MODEL_URL = "/models/guide.glb";

/*
 * Poses are target directions for each limb segment, in the character's own space:
 * +X = character's left (screen-right when facing the camera), +Y = up, +Z = toward the camera.
 * Bones are aimed at these directions on top of the (stilled) idle animation, so the rig's
 * internal axes never matter.
 */
const POSES = {
  idle: {},
  // Floating down: arms softly open and low, right knee gently bent.
  descend: {
    R: { upper: [-0.36, -0.92, 0.16], fore: [-0.5, -0.66, 0.56] },
    L: { upper: [0.36, -0.92, 0.16], fore: [0.5, -0.66, 0.56] },
    RL: { upper: [-0.06, -0.86, 0.5], fore: [-0.02, -0.96, -0.27] },
  },
  // Landed: arms open, "welcome".
  welcome: {
    R: { upper: [-0.42, -0.88, 0.22], fore: [-0.55, -0.42, 0.72] },
    L: { upper: [0.42, -0.88, 0.22], fore: [0.55, -0.42, 0.72] },
  },
  // Open hand presenting the content on the left.
  present: {
    R: { upper: [-0.45, -0.82, 0.36], fore: [-0.7, -0.05, 0.71] },
  },
  // Clear point at the content on the left: arm extended, slightly forward and up.
  point: {
    R: { upper: [-0.88, -0.22, 0.42], fore: [-0.9, 0.08, 0.42] },
  },
};

// Wave: right arm up, forearm swinging. Used as a short gesture on top of any pose.
const WAVE = { upper: [-0.82, 0.05, 0.3], fore: [-0.18, 0.95, 0.25] };

// Head glance per pose (radians). yaw + = toward screen-right; pitch - = chin up.
const POSE_HEAD = {
  descend: { yaw: 0, pitch: -0.12 },
  present: { yaw: -0.3, pitch: 0.04 },
  point: { yaw: -0.42, pitch: 0.02 },
};

const LIMBS = ["R", "L", "RL", "LL"];

/*
 * Bones held at a fixed pose (the average of their idle motion) so the torso never twists and
 * the shoulders, collar and armour never rotate: root, pelvis, spine, clavicles, neck, head,
 * the gold shoulder ribbon, the shoulder armour plates and the weapon prop.
 * Arms, legs, cape, hair and eyelids keep their natural motion.
 */
const HOLD = [
  "Bip00108", "Bip001Pelvis", "Bip001Spine", "Bip001LClavicle", "Bip001RClavicle", "Bip001Neck", "Bip001Head",
  "Bone001", "Bone002", "Bone010", "Bone011", "Bone012", "Bone013", "Bone024",
  "Bone028", "Bone030", "Bone031", "Bone032", "Bone033", "Bone034", "Bone035",
];

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _cur = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _axis = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _qa = new THREE.Quaternion();
const _qw = new THREE.Quaternion();
const _pq = new THREE.Quaternion();
const _gq = new THREE.Quaternion();
const _gqi = new THREE.Quaternion();
const _id = new THREE.Quaternion();
const _e = new THREE.Euler();

/** Pre-multiply a world-space rotation onto a bone, keeping it in its parent's space. */
function applyWorldRotation(bone, qWorld) {
  bone.getWorldQuaternion(_qw);
  _qw.premultiply(qWorld);
  bone.parent.getWorldQuaternion(_pq);
  bone.quaternion.copy(_pq.invert().multiply(_qw));
  bone.updateMatrixWorld(true);
}

/** Rotate `bone` (by `weight`) so the segment bone→child points along `dirWorld`. */
function aimBone(bone, child, dirWorld, weight) {
  bone.getWorldPosition(_a);
  child.getWorldPosition(_b);
  _cur.subVectors(_b, _a);
  if (_cur.lengthSq() < 1e-10) return null;
  _cur.normalize();
  _qa.setFromUnitVectors(_cur, dirWorld);
  _q.copy(_id).slerp(_qa, weight);
  applyWorldRotation(bone, _q);
  return _q;
}

// GLTFLoader sanitises node names ("Bip001 L Hand" -> "Bip001_L_Hand"), so compare without separators.
const squash = (name) => name.replace(/[\s_.]/g, "");
const findBone = (root, prefix) => {
  const want = squash(prefix);
  let found = null;
  root.traverse((o) => {
    if (!found && o.isBone && squash(o.name).startsWith(want)) found = o;
  });
  return found;
};

/** Average of a quaternion track (sign-aligned), so a held bone sits in its typical pose. */
function averageQuaternion(values) {
  const n = values.length / 4;
  const acc = [0, 0, 0, 0];
  for (let i = 0; i < n; i++) {
    const d = values[i * 4] * values[0] + values[i * 4 + 1] * values[1] + values[i * 4 + 2] * values[2] + values[i * 4 + 3] * values[3];
    const s = d < 0 ? -1 : 1;
    for (let k = 0; k < 4; k++) acc[k] += s * values[i * 4 + k];
  }
  return new THREE.Quaternion(acc[0], acc[1], acc[2], acc[3]).normalize();
}
function averageVector(values) {
  const n = values.length / 3;
  const v = new THREE.Vector3();
  for (let i = 0; i < n; i++) v.add(_a.set(values[i * 3], values[i * 3 + 1], values[i * 3 + 2]));
  return v.multiplyScalar(1 / n);
}

const damp = THREE.MathUtils.damp;

/**
 * gesture: { type: "wave" | "nod", at: performance.now() / 1000 } — a short one-off on top of the pose.
 * talking: moves the jaw while the guide is "speaking".
 * headOut: a Vector3 ref filled every frame with the head's world position (for the speech bubble).
 */
export default function GuideCharacter({ pose = "idle", gesture = null, talking = false, headOut, reducedMotion = false }) {
  const { scene, animations } = useGLTF(MODEL_URL);
  const root = useRef();
  const mixer = useMemo(() => new THREE.AnimationMixer(scene), [scene]);
  const holds = useRef([]);

  const rig = useMemo(() => {
    const b = (name) => findBone(scene, name);
    const limb = (upper, fore, end, twists) => ({
      upper: b(upper),
      fore: b(fore),
      end: b(end),
      upperTwist: twists[0] ? b(twists[0]) : null,
      foreTwist: twists[1] ? b(twists[1]) : null,
      weight: 0,
      upperDir: new THREE.Vector3(0, -1, 0),
      foreDir: new THREE.Vector3(0, -1, 0),
    });
    return {
      R: limb("Bip001 R UpperArm", "Bip001 R Forearm", "Bip001 R Hand", ["Bip001 RUpArmTwist", "Bip001 R ForeTwist"]),
      L: limb("Bip001 L UpperArm", "Bip001 L Forearm", "Bip001 L Hand", ["Bip001 LUpArmTwist", "Bip001 L ForeTwist"]),
      RL: limb("Bip001 R Thigh", "Bip001 R Calf", "Bip001 R Foot", []),
      LL: limb("Bip001 L Thigh", "Bip001 L Calf", "Bip001 L Foot", []),
      head: b("Bip001 Head"),
      jaw: b("Bone027"),
      ribbon: b("Bone028"),
      headYaw: 0,
      headPitch: 0,
      jawOpen: 0,
    };
  }, [scene]);

  // Rest rotations of every bone we turn by hand. They are restored at the start of each frame,
  // so a bone without an animation track can never accumulate rotation.
  const rest = useMemo(() => {
    const bones = [rig.head, rig.jaw];
    for (const side of LIMBS) {
      const l = rig[side];
      bones.push(l.upper, l.fore, l.end, l.upperTwist, l.foreTwist);
    }
    return bones.filter(Boolean).map((b) => ({ b, q: b.quaternion.clone() }));
  }, [rig]);

  // One-time setup: hide weapons/FX, fix materials, normalise size and facing.
  const fit = useMemo(() => {
    scene.traverse((o) => {
      if (!o.isMesh) return;
      // Daggers (material "…3-2") and the floating effect orb (material "FX_…") don't suit a friendly guide.
      if (/weapon|FX/i.test(`${o.name} ${o.material?.name}`) || /_3-2$/.test(o.material?.name || "")) o.visible = false;
      o.frustumCulled = false; // skinned bounds don't follow the animation
      const m = o.material;
      if (m && m.metalness !== undefined) {
        m.metalness = Math.min(m.metalness, 0.45);
        m.envMapIntensity = 0.9;
      }
    });
    scene.updateWorldMatrix(true, true);
    const toScene = scene.matrixWorld.clone().invert();
    const rel = new THREE.Matrix4();
    const box = new THREE.Box3();
    scene.traverse((o) => {
      if (o.isMesh && o.visible) {
        let bb;
        if (o.isSkinnedMesh) {
          o.computeBoundingBox();
          bb = o.boundingBox.clone();
        } else {
          o.geometry.computeBoundingBox();
          bb = o.geometry.boundingBox.clone();
        }
        rel.multiplyMatrices(toScene, o.matrixWorld);
        box.union(bb.applyMatrix4(rel));
      }
    });
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 1 / size.y;
    const l = findBone(scene, "Bip001 L Clavicle")?.getWorldPosition(new THREE.Vector3()).applyMatrix4(toScene);
    const r = findBone(scene, "Bip001 R Clavicle")?.getWorldPosition(new THREE.Vector3()).applyMatrix4(toScene);
    let yaw = 0;
    if (l && r) {
      const lat = l.sub(r);
      yaw = -Math.atan2(-lat.z, lat.x);
    }
    return { scale, offset: [-center.x * scale, -box.min.y * scale, -center.z * scale], yaw };
  }, [scene]);

  // Idle animation, minus the held bones (which we set ourselves every frame).
  useEffect(() => {
    const source = animations.find((c) => c.name === "city_idle") || animations[0];
    if (!source) return undefined;
    const clip = source.clone();
    const held = [];
    clip.tracks = clip.tracks.filter((tr) => {
      const dot = tr.name.lastIndexOf(".");
      const nodeName = tr.name.slice(0, dot);
      const prop = tr.name.slice(dot + 1);
      if (!HOLD.some((h) => squash(nodeName).startsWith(h))) return true;
      const obj = scene.getObjectByName(nodeName);
      if (obj && prop === "quaternion") held.push({ obj, prop, value: averageQuaternion(tr.values) });
      if (obj && prop === "position") held.push({ obj, prop, value: averageVector(tr.values) });
      return false;
    });
    holds.current = held;
    const action = mixer.clipAction(clip);
    action.play();
    return () => {
      action.stop();
      mixer.uncacheRoot(scene);
    };
  }, [animations, mixer, scene]);

  useLayoutEffect(() => {
    const target = POSES[pose] || {};
    for (const side of LIMBS) {
      const t = target[side];
      if (t) {
        rig[side].upperDir.set(...t.upper).normalize();
        rig[side].foreDir.set(...t.fore).normalize();
        rig[side].weight = 1;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rig]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    for (const r of rest) r.b.quaternion.copy(r.q);
    mixer.update(dt);
    // Held bones: written every frame, so nothing they carry can drift or accumulate.
    for (const h of holds.current) h.obj[h.prop].copy(h.value);
    if (rig.ribbon) rig.ribbon.scale.setScalar(0.0001); // hide the shoulder ribbon entirely
    if (!root.current) return;

    root.current.updateWorldMatrix(true, false);
    scene.updateMatrixWorld(true);
    root.current.getWorldQuaternion(_gq);
    _gqi.copy(_gq).invert();

    const now = state.clock.elapsedTime;
    const lambda = reducedMotion ? 30 : 6;
    const target = { ...(POSES[pose] || {}) };
    // Gesture start times come from the page (performance clock, seconds).
    const since = gesture ? performance.now() / 1000 - gesture.at : Infinity;
    const waving = gesture?.type === "wave" && since >= 0 && since < 2.4 && !reducedMotion;
    if (waving) target.R = WAVE;

    for (const side of LIMBS) {
      const limb = rig[side];
      if (!limb.upper || !limb.fore || !limb.end) continue;
      const goal = target[side];
      limb.weight = damp(limb.weight, goal ? 1 : 0, lambda, dt);
      if (goal) {
        const k = 1 - Math.exp(-lambda * dt);
        limb.upperDir.lerp(_dir.set(...goal.upper).normalize(), k).normalize();
        _dir.set(...goal.fore);
        if (waving && side === "R") _dir.x += Math.sin(since * 9) * 0.28;
        limb.foreDir.lerp(_dir.normalize(), waving && side === "R" ? 0.5 : k).normalize();
      }
      if (limb.weight < 0.002) continue;
      _dir.copy(limb.upperDir).applyQuaternion(_gq);
      const qu = aimBone(limb.upper, limb.fore, _dir, limb.weight);
      // UpArmTwist hangs off the clavicle, so it turns with the upper arm by hand.
      if (qu && limb.upperTwist) applyWorldRotation(limb.upperTwist, qu);
      _dir.copy(limb.foreDir).applyQuaternion(_gq);
      const qf = aimBone(limb.fore, limb.end, _dir, limb.weight);
      if (qf && limb.foreTwist) applyWorldRotation(limb.foreTwist, qf);
    }

    // Head: a glance toward the content per pose, plus a nod gesture. Head bone only.
    if (rig.head) {
      const nod = gesture?.type === "nod" && since >= 0 && since < 0.9 && !reducedMotion ? Math.sin((since / 0.9) * Math.PI) * 0.22 : 0;
      rig.headYaw = damp(rig.headYaw, POSE_HEAD[pose]?.yaw ?? 0, reducedMotion ? 30 : 4, dt);
      rig.headPitch = damp(rig.headPitch, POSE_HEAD[pose]?.pitch ?? 0, reducedMotion ? 30 : 4, dt);
      _e.set(rig.headPitch + nod, rig.headYaw, 0, "YXZ");
      _q.setFromEuler(_e).premultiply(_gq).multiply(_gqi);
      applyWorldRotation(rig.head, _q);
      if (headOut) rig.head.getWorldPosition(headOut.current);
    }

    // Jaw: moves while talking (a soft, irregular open/close).
    if (rig.jaw) {
      const goal = talking && !reducedMotion ? 0.05 + 0.07 * Math.abs(Math.sin(now * 11) * Math.sin(now * 4.3)) : 0;
      rig.jawOpen = damp(rig.jawOpen, goal, 18, dt);
      if (rig.jawOpen > 0.002) {
        _axis.set(1, 0, 0).applyQuaternion(_gq);
        _q.setFromAxisAngle(_axis, rig.jawOpen);
        applyWorldRotation(rig.jaw, _q);
      }
    }
  });

  return (
    <group ref={root}>
      <group rotation={[0, fit.yaw, 0]}>
        <group scale={fit.scale} position={fit.offset}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
