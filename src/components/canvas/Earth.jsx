import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";
const Earth = () => {
  const earth = useGLTF("./planet/scene.gltf");
  return (
    <primitive object={earth.scene} scale={2.15} position-y={-0.05} rotation-y={0} />
  );
};
const EarthCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop="always"
      gl={{ preserveDrawingBuffer: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      camera={{
        fov: 38,
        near: 0.1,
        far: 200,
        position: [0, 0.2, 7.5],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={1.05} />
        <directionalLight position={[5, 3, 6]} intensity={1.1} />
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 1.95}
          minPolarAngle={Math.PI / 2.2}
        />
        <Earth />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};
export default EarthCanvas;
