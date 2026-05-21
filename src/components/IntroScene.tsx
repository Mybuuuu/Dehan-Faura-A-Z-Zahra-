import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface IntroSceneProps {
  onStart: () => void;
}

export function IntroScene({ onStart }: IntroSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.1;
        meshRef.current.rotation.x += delta * 0.05;
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
    if (ringRef.current) {
        ringRef.current.rotation.z -= delta * 0.2;
        ringRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  const sphereSegments = isMobile ? 16 : 32;
  const ringSegments = isMobile ? 32 : 64;

  return (
    <group>
      <mesh 
        ref={meshRef}
        onClick={onStart}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 5.2 : 5}
      >
        <sphereGeometry args={[1, sphereSegments, sphereSegments]} />
        <meshStandardMaterial 
          color="#111111"
          emissive="#7e22ce"
          emissiveIntensity={hovered ? 1.5 : 0.8}
          roughness={0.4}
          metalness={0.9}
        />
      </mesh>
      
      {/* Saturn Nested Cosmic Rings */}
      <group ref={ringRef} rotation={[Math.PI / 3.5, 0.2, 0]}>
        {/* Ring A */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6.8, 8.5, ringSegments]} />
          <meshBasicMaterial color="#d8b4fe" transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Ring B (Gap decoration) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[8.8, 9.8, ringSegments]} />
          <meshBasicMaterial color="#fda4af" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>

        {/* Ring C (Outer thin glow) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[10.1, 10.3, ringSegments]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}
