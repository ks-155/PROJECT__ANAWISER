"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Center,
  ContactShadows,
  Environment,
  MeshTransmissionMaterial,
  RoundedBox,
  Text3D,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type BlockSpec = {
  position: [number, number, number];
  size: [number, number, number];
  glass: boolean;
  phase: number;
  radius: number;
  tint?: string;
};

const FONT = "/fonts/helvetiker_bold.typeface.json";

function usePointerTarget() {
  const target = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return target;
}

function GlassMaterial({
  samples = 6,
  resolution = 256,
  thickness = 1.2,
  color = "#ffe8dc",
  attenuationColor = "#fb7185",
}: {
  samples?: number;
  resolution?: number;
  thickness?: number;
  color?: string;
  attenuationColor?: string;
}) {
  return (
    <MeshTransmissionMaterial
      backside
      samples={samples}
      resolution={resolution}
      transmission={1}
      thickness={thickness}
      roughness={0.06}
      ior={1.38}
      chromaticAberration={0.28}
      anisotropy={0.35}
      anisotropicBlur={0.35}
      distortion={0.12}
      distortionScale={0.24}
      temporalDistortion={0.06}
      color={color}
      attenuationColor={attenuationColor}
      attenuationDistance={1.7}
      clearcoat={1}
      clearcoatRoughness={0.06}
      iridescence={1}
      iridescenceIOR={1.4}
      iridescenceThicknessRange={[120, 720]}
      envMapIntensity={1.65}
    />
  );
}

function MatteMaterial({ color = "#6366f1" }: { color?: string }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.55}
      metalness={0.35}
      envMapIntensity={0.7}
    />
  );
}

function SilverLetterMaterial() {
  return (
    <meshPhysicalMaterial
      color="#e8e8ee"
      metalness={0.68}
      roughness={0.24}
      clearcoat={0.75}
      clearcoatRoughness={0.08}
      envMapIntensity={1.9}
    />
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]} receiveShadow>
      <planeGeometry args={[28, 28]} />
      <meshStandardMaterial color="#4a1818" roughness={0.9} metalness={0.08} />
    </mesh>
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  const blocksGroup = useRef<THREE.Group>(null);
  const pointer = usePointerTarget();
  const smooth = useRef({ x: 0, y: 0 });

  const blocks = useMemo<BlockSpec[]>(
    () => [
      { position: [-3.4, -0.95, 1.35], size: [1.05, 0.28, 0.72], glass: true, phase: 0.2, radius: 0.12, tint: "#67e8f9" },
      { position: [-2.1, -1.15, -0.55], size: [1.25, 0.22, 0.9], glass: false, phase: 1.1, radius: 0.1, tint: "#818cf8" },
      { position: [-0.85, -0.72, 1.75], size: [0.78, 0.3, 0.58], glass: true, phase: 2.0, radius: 0.12, tint: "#a78bfa" },
      { position: [0.55, -1.2, -1.15], size: [1.35, 0.2, 0.95], glass: false, phase: 0.7, radius: 0.1, tint: "#2dd4bf" },
      { position: [2.15, -0.85, 1.05], size: [0.95, 0.26, 0.68], glass: true, phase: 1.6, radius: 0.11, tint: "#22d3ee" },
      { position: [3.35, -0.55, -1.35], size: [0.82, 0.28, 0.6], glass: true, phase: 2.4, radius: 0.11, tint: "#c084fc" },
      { position: [-3.55, -0.48, -1.25], size: [0.78, 0.26, 0.58], glass: false, phase: 0.4, radius: 0.1, tint: "#6366f1" },
      { position: [1.05, -0.42, -1.95], size: [1.05, 0.22, 0.7], glass: true, phase: 1.9, radius: 0.11, tint: "#5eead4" },
      { position: [-1.35, -0.35, -1.85], size: [0.7, 0.24, 0.52], glass: false, phase: 2.8, radius: 0.1, tint: "#7c3aed" },
      { position: [3.0, -1.05, 0.25], size: [0.88, 0.2, 0.62], glass: false, phase: 0.9, radius: 0.1, tint: "#0d9488" },
      { position: [0.15, -0.95, 2.15], size: [0.62, 0.26, 0.48], glass: true, phase: 3.1, radius: 0.1, tint: "#38bdf8" },
      { position: [-2.85, -0.2, 0.35], size: [0.55, 0.22, 0.42], glass: true, phase: 1.35, radius: 0.09, tint: "#ddd6fe" },
    ],
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    smooth.current.x += (pointer.current.x - smooth.current.x) * 0.07;
    smooth.current.y += (pointer.current.y - smooth.current.y) * 0.07;

    if (group.current) {
      group.current.rotation.y = -0.18 + smooth.current.x * 0.22 + Math.sin(t * 0.22) * 0.02;
      group.current.rotation.x = 0.04 + smooth.current.y * -0.1;
      group.current.position.x = smooth.current.x * 0.18;
      group.current.position.z = smooth.current.y * 0.12;
    }

    if (blocksGroup.current) {
      blocksGroup.current.children.forEach((child, i) => {
        const b = blocks[i];
        if (!b) return;
        child.position.y = b.position[1] + Math.sin(t * 0.85 + b.phase) * 0.1;
        child.rotation.y = Math.sin(t * 0.35 + b.phase) * 0.06;
        child.rotation.x = Math.cos(t * 0.28 + b.phase) * 0.03;
      });
    }
  });

  return (
    <>
      <color attach="background" args={["#2a0c0c"]} />
      <fog attach="fog" args={["#321010", 11, 26]} />

      <ambientLight intensity={0.5} color="#ececf1" />
      <directionalLight position={[5, 8, 4]} intensity={1.35} color="#f4f4f5" />
      <directionalLight position={[-4, 3, -2]} intensity={0.55} color="#ff8a6a" />
      <pointLight position={[0.2, 3.2, 1.2]} intensity={1.35} color="#f1f1f5" distance={14} />
      <pointLight position={[-2.5, 2.2, 2.5]} intensity={0.7} color="#ff8a3d" distance={14} />
      <pointLight position={[3.2, 1.8, -1.5]} intensity={0.55} color="#e11d48" distance={12} />
      <pointLight position={[0.5, 2.5, 3]} intensity={0.4} color="#fb7185" distance={10} />
      <spotLight
        position={[0, 6, 2]}
        angle={0.55}
        penumbra={0.75}
        intensity={1.05}
        color="#ffd4c4"
        distance={20}
      />

      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.75} />
      </Suspense>

      <group ref={group}>
        <group position={[0, -0.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <Center>
            <Text3D
              font={FONT}
              size={0.82}
              height={0.44}
              curveSegments={8}
              bevelEnabled
              bevelThickness={0.04}
              bevelSize={0.025}
              bevelOffset={0}
              bevelSegments={3}
              letterSpacing={0.06}
            >
              ANAWISER
              <SilverLetterMaterial />
            </Text3D>
          </Center>
        </group>

        <group ref={blocksGroup}>
          {blocks.map((b, i) => (
            <RoundedBox
              key={`${b.position.join("-")}-${i}`}
              args={b.size}
              radius={b.radius}
              smoothness={4}
              position={b.position}
              castShadow
              receiveShadow
            >
              {b.glass ? (
                <GlassMaterial
                  samples={4}
                  resolution={160}
                  thickness={0.95}
                  color={b.tint || "#c8f5ff"}
                  attenuationColor={b.tint || "#22d3ee"}
                />
              ) : (
                <MatteMaterial color={b.tint || "#6366f1"} />
              )}
            </RoundedBox>
          ))}
        </group>

        <Ground />
        <ContactShadows
          position={[0, -1.34, 0]}
          opacity={0.45}
          scale={16}
          blur={2.8}
          far={4.5}
          resolution={512}
          color="#3b0d0d"
        />
      </group>
    </>
  );
}

export function SplineHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="spline-hero" aria-hidden />;
  }

  return (
    <div className="spline-hero" aria-hidden>
      <Canvas
        className="h-full w-full"
        style={{ width: "100%", height: "100%" }}
        dpr={[1, 1.5]}
        frameloop="always"
        shadows
        camera={{ position: [4.8, 5.6, 5.2], fov: 32, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, -0.9, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.18;
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default SplineHero;
