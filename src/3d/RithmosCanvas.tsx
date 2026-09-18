import { useRef, type FC } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneProps {
  progress: number; // 0 to 1
}

const StageScene: FC<SceneProps> = ({ progress }) => {
  const redSpotlightRef = useRef<THREE.SpotLight>(null);
  const goldRimLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  const micGroupRef = useRef<THREE.Group>(null);
  const guitarGroupRef = useRef<THREE.Group>(null);
  const drumsGroupRef = useRef<THREE.Group>(null);
  const crowdGroupRef = useRef<THREE.Group>(null);

  // Cinematic camera & lighting updates per frame according to scroll progress
  useFrame(({ camera }) => {
    // Progression checkpoints:
    // 0 - 0.12: Empty stage (camera distant, calm)
    // 0.12 - 0.25: Red spotlight sweeps in
    // 0.25 - 0.40: Microphone appears
    // 0.40 - 0.55: Guitar enters from side, camera glides slightly
    // 0.55 - 0.70: Drums appear, gold rim light
    // 0.70 - 0.85: Band & crowd atmosphere
    // 0.85 - 1.00: Full visual intensity, gold accent

    // Cinematic camera position: gentle drift, strictly non-spinning
    const targetCamX = THREE.MathUtils.lerp(0, 0.4, Math.sin(progress * Math.PI));
    const targetCamY = THREE.MathUtils.lerp(1.8, 2.3, progress);
    const targetCamZ = THREE.MathUtils.lerp(6.5, 5.2, progress);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.08);
    camera.lookAt(0, 1.2, 0);

    // 1. Red spotlight intensity (0.12 - 0.85)
    if (redSpotlightRef.current) {
      if (progress < 0.12) {
        redSpotlightRef.current.intensity = 0;
      } else if (progress < 0.35) {
        const t = (progress - 0.12) / (0.35 - 0.12);
        redSpotlightRef.current.intensity = THREE.MathUtils.lerp(0, 4.5, t);
      } else {
        const t = (progress - 0.35) / (1.0 - 0.35);
        redSpotlightRef.current.intensity = THREE.MathUtils.lerp(4.5, 9.0, t);
      }
      redSpotlightRef.current.position.x = THREE.MathUtils.lerp(-4, -1.5, Math.min(progress * 1.5, 1));
    }

    // 2. Gold rim light (0.55 - 1.0)
    if (goldRimLightRef.current) {
      if (progress < 0.55) {
        goldRimLightRef.current.intensity = 0;
      } else {
        const t = (progress - 0.55) / 0.45;
        goldRimLightRef.current.intensity = THREE.MathUtils.lerp(0, 6.0, t);
      }
    }

    // 3. Microphone Stand (0.25 - 0.40)
    if (micGroupRef.current) {
      if (progress < 0.22) {
        micGroupRef.current.scale.set(0.001, 0.001, 0.001);
        micGroupRef.current.position.y = -1;
      } else if (progress < 0.40) {
        const t = Math.min((progress - 0.22) / 0.18, 1);
        const s = THREE.MathUtils.lerp(0.5, 1, t);
        micGroupRef.current.scale.set(s, s, s);
        micGroupRef.current.position.y = THREE.MathUtils.lerp(-0.5, 0, t);
      } else {
        micGroupRef.current.scale.set(1, 1, 1);
        micGroupRef.current.position.y = 0;
      }
    }

    // 4. Electric Guitar (0.40 - 0.55) enters from side
    if (guitarGroupRef.current) {
      if (progress < 0.38) {
        guitarGroupRef.current.position.x = 4.5;
        guitarGroupRef.current.scale.set(0.001, 0.001, 0.001);
      } else if (progress < 0.55) {
        const t = (progress - 0.38) / 0.17;
        guitarGroupRef.current.position.x = THREE.MathUtils.lerp(3.5, 1.4, t);
        guitarGroupRef.current.scale.set(1, 1, 1);
      } else {
        guitarGroupRef.current.position.x = 1.4;
        guitarGroupRef.current.scale.set(1, 1, 1);
      }
    }

    // 5. Drums (0.55 - 0.70)
    if (drumsGroupRef.current) {
      if (progress < 0.52) {
        drumsGroupRef.current.scale.set(0.001, 0.001, 0.001);
      } else if (progress < 0.70) {
        const t = (progress - 0.52) / 0.18;
        const s = THREE.MathUtils.lerp(0.2, 1, t);
        drumsGroupRef.current.scale.set(s, s, s);
      } else {
        drumsGroupRef.current.scale.set(1, 1, 1);
      }
    }

    // 6. Crowd atmosphere silhouettes (0.70 - 1.0)
    if (crowdGroupRef.current) {
      if (progress < 0.68) {
        crowdGroupRef.current.position.y = -2;
      } else {
        const t = Math.min((progress - 0.68) / 0.22, 1);
        crowdGroupRef.current.position.y = THREE.MathUtils.lerp(-1.5, -0.2, t);
      }
    }
  });

  return (
    <>
      {/* WARM IVORY AMBIENT LIGHT */}
      <ambientLight ref={ambientLightRef} intensity={0.8} color="#F4F0E8" />

      {/* RITHMOS RED SPOTLIGHT */}
      <spotLight
        ref={redSpotlightRef}
        color="#C91F25"
        position={[-3, 6, 2]}
        angle={0.65}
        penumbra={0.8}
        intensity={0}
        castShadow
      />

      {/* GOLD RIM LIGHT */}
      <directionalLight
        ref={goldRimLightRef}
        color="#C9A45C"
        position={[4, 5, -2]}
        intensity={0}
      />

      {/* STAGE FLOOR */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 12]} />
        <meshStandardMaterial
          color="#1c1917"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* REAR STAGE ARCHITECTURE */}
      <mesh position={[0, 3, -4]}>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#EDE8DE" roughness={0.9} />
      </mesh>

      {/* STAGE BACKLIGHT BEAMS / PILLARS */}
      {[-4, -2, 0, 2, 4].map((xPos, idx) => (
        <mesh key={idx} position={[xPos, 3, -3.8]}>
          <boxGeometry args={[0.08, 6, 0.08]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#C91F25' : '#C9A45C'}
            emissive={idx % 2 === 0 ? '#C91F25' : '#C9A45C'}
            emissiveIntensity={progress > 0.6 ? 0.6 : 0.1}
          />
        </mesh>
      ))}

      {/* 1. VINTAGE CONDENSER MICROPHONE STAND (CENTER STAGE) */}
      <group ref={micGroupRef} position={[-0.2, 0, 0.5]}>
        {/* Base plate */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.06, 24]} />
          <meshStandardMaterial color="#262626" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Main chrome pole */}
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.6, 16]} />
          <meshStandardMaterial color="#e5e5e5" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Boom swivel collar */}
        <mesh position={[0, 1.45, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#C91F25" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Microphone capsule */}
        <mesh position={[0, 1.55, 0]}>
          <capsuleGeometry args={[0.035, 0.09, 8, 16]} />
          <meshStandardMaterial color="#404040" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Red ring accent */}
        <mesh position={[0, 1.52, 0]}>
          <torusGeometry args={[0.038, 0.006, 8, 24]} />
          <meshStandardMaterial color="#C91F25" emissive="#C91F25" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* 2. ELECTRIC GUITAR & VINTAGE AMP (STAGE RIGHT) */}
      <group ref={guitarGroupRef} position={[1.4, 0, -0.5]}>
        {/* Guitar Amp Cabinet */}
        <mesh position={[0.6, 0.45, -0.6]}>
          <boxGeometry args={[0.7, 0.85, 0.4]} />
          <meshStandardMaterial color="#1a1816" roughness={0.6} />
        </mesh>
        {/* Amp Grill with Gold Piping */}
        <mesh position={[0.6, 0.45, -0.39]}>
          <planeGeometry args={[0.6, 0.7]} />
          <meshStandardMaterial color="#78716c" roughness={0.8} />
        </mesh>
        <mesh position={[0.6, 0.83, -0.38]}>
          <boxGeometry args={[0.55, 0.03, 0.01]} />
          <meshStandardMaterial color="#C9A45C" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Guitar on Stand */}
        <group position={[0, 0.6, 0]} rotation={[0.1, -0.4, 0.15]}>
          {/* Guitar Body (Refined double-cut contour) */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.35, 0.5, 0.06]} />
            <meshPhysicalMaterial
              color="#C91F25"
              metalness={0.2}
              roughness={0.2}
              clearcoat={0.6}
            />
          </mesh>
          {/* Pickguard */}
          <mesh position={[-0.04, 0.02, 0.032]}>
            <planeGeometry args={[0.18, 0.32]} />
            <meshStandardMaterial color="#EDE8DE" roughness={0.3} />
          </mesh>
          {/* Neck */}
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[0.07, 0.65, 0.04]} />
            <meshStandardMaterial color="#fef08a" roughness={0.6} />
          </mesh>
          {/* Headstock with Gold Tuners */}
          <mesh position={[0, 0.92, 0]}>
            <boxGeometry args={[0.08, 0.14, 0.03]} />
            <meshStandardMaterial color="#C91F25" />
          </mesh>
        </group>
      </group>

      {/* 3. PROFESSIONAL DRUM KIT (STAGE BACK CENTER) */}
      <group ref={drumsGroupRef} position={[-1.6, 0, -1.8]}>
        {/* Bass Drum */}
        <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.45, 24]} />
          <meshStandardMaterial color="#8F171C" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Bass Drum Front Skin */}
        <mesh position={[0, 0.45, 0.23]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.48, 24]} />
          <meshStandardMaterial color="#EDE8DE" roughness={0.7} />
        </mesh>
        {/* Snare Drum */}
        <mesh position={[0.6, 0.58, 0.3]}>
          <cylinderGeometry args={[0.22, 0.22, 0.16, 20]} />
          <meshStandardMaterial color="#C9A45C" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Rack Tom */}
        <mesh position={[-0.2, 0.85, -0.1]} rotation={[0.2, 0, -0.1]}>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 20]} />
          <meshStandardMaterial color="#8F171C" roughness={0.3} />
        </mesh>
        {/* Crash Cymbal (Gold brass shine) */}
        <group position={[0.7, 1.1, -0.2]}>
          <mesh rotation={[0.15, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.01, 24]} />
            <meshStandardMaterial color="#C9A45C" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 1.0, 12]} />
            <meshStandardMaterial color="#e5e5e5" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* 4. FOREGROUND AUDIENCE SILHOUETTES */}
      <group ref={crowdGroupRef} position={[0, -0.5, 3.8]}>
        {[-2.5, -1.8, -1.0, -0.3, 0.5, 1.2, 2.0, 2.7].map((x, i) => (
          <group key={i} position={[x, 0, (i % 3) * 0.2]}>
            {/* Torso */}
            <mesh position={[0, 0.6, 0]}>
              <capsuleGeometry args={[0.18, 0.6, 8, 16]} />
              <meshStandardMaterial color="#0c0a09" roughness={0.9} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.1, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="#0c0a09" roughness={0.9} />
            </mesh>
            {/* Raised Hands for celebratory energy */}
            {i % 2 === 0 && (
              <mesh position={[0.12, 1.25, 0]} rotation={[0, 0, -0.3]}>
                <capsuleGeometry args={[0.035, 0.35, 6, 12]} />
                <meshStandardMaterial color="#0c0a09" roughness={0.9} />
              </mesh>
            )}
          </group>
        ))}
      </group>
    </>
  );
};

export const RithmosCanvas: FC<SceneProps> = ({ progress }) => {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 1.8, 6.5], fov: 42 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
      >
        <StageScene progress={progress} />
      </Canvas>
    </div>
  );
};
