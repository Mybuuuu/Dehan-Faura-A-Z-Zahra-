import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PointMaterial, Points } from '@react-three/drei';
import { audioReactivity } from '../utils/audioReactivity';

export function CosmicParticles() {
  const ref = useRef<THREE.Points>(null);
  const petalsRef = useRef<THREE.Points>(null);
  const galaxyRef = useRef<THREE.Points>(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Generate random particles (stars/dust)
  const sphere = useMemo(() => {
    const particleCount = isMobile ? 700 : 1800;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const r = 50 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta); // x
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
        positions[i * 3 + 2] = r * Math.cos(phi); // z
    }
    return positions;
  }, [isMobile]);

  // Generate deeper galaxy swirl
  const galaxySwirl = useMemo(() => {
    const count = isMobile ? 300 : 800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // distribute them in a spiral/swirl shape
        const r = 35 + Math.random() * 45;
        const theta = (Math.random() * Math.PI * 2) + (r * 0.15); // spiral mapping
        const y = (Math.random() - 0.5) * 15;
        
        positions[i * 3] = Math.cos(theta) * r;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(theta) * r;
    }
    return positions;
  }, [isMobile]);

  // Generate petals/romantic dust
  const petals = useMemo(() => {
    const particleCount = isMobile ? 120 : 350;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const r = 30 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta); // x
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
        positions[i * 3 + 2] = r * Math.cos(phi); // z
    }
    return positions;
  }, [isMobile]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const soundReact = audioReactivity.getLevel(time);
    const speedMultiplier = 1.0 + soundReact * 0.8;

    if (ref.current) {
        ref.current.rotation.y = time * 0.03 * speedMultiplier;
        ref.current.rotation.x = Math.sin(time * 0.1) * 0.05;
    }
    if (galaxyRef.current) {
        // Slow cinematic swirl
        galaxyRef.current.rotation.y = time * 0.015 * speedMultiplier;
        galaxyRef.current.rotation.z = Math.sin(time * 0.05) * 0.05;
    }
    if (petalsRef.current) {
        petalsRef.current.rotation.y = time * 0.08 * speedMultiplier;
        petalsRef.current.position.y = Math.sin(time * 0.2) * 2;
    }
  });

  return (
    <>
      <group rotation={[0, 0, Math.PI / 4]}>
        <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color="#fda4af"
            size={0.15}
            sizeAttenuation={true}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </Points>
      </group>
      
      {/* Deep Galaxy Swirl */}
      <group rotation={[0.2, 0, -0.3]}>
        <Points ref={galaxyRef} positions={galaxySwirl} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color="#a855f7" /* purple nebula vibe */
            size={0.25}
            sizeAttenuation={true}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={0.4}
          />
        </Points>
      </group>

      <group>
        <Points ref={petalsRef} positions={petals} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color="#be123c" /* dark red */
            size={0.4}
            sizeAttenuation={true}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={0.6}
          />
        </Points>
      </group>
    </>
  );
}
