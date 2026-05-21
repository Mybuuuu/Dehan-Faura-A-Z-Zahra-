import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';
import { memories } from '../data';
import { Memory } from '../types';

interface FinalSceneProps {
  onFocusMemory: (id: string, position: THREE.Vector3) => void;
  focusedMemory: Memory | null;
}

// Analytical coordinate calculator for orbiting memories
function getMemoryPosition(index: number, time: number) {
  // Distribute across 3 distinct shell levels to feel massive
  const r = 11 + (index % 3) * 5.0;
  // Dynamic orbiting speeds with alternating rotation directions
  const speed = (0.04 + (index % 4) * 0.012) * (index % 2 === 0 ? 1 : -1);
  const startAngle = (index * (Math.PI * 2)) / memories.length;
  const angle = startAngle + time * speed;
  
  const x = Math.cos(angle) * r;
  const z = Math.sin(angle) * r;
  
  // Height distribution on vertical shell axis
  const baseHeight = -4.5 + (index * 0.75);
  // Organic vertical drift/floating pulse
  const wave = Math.sin(time * 0.5 + index) * 1.5;
  const y = baseHeight + wave;
  
  return new THREE.Vector3(x, y, z);
}

// 1. Hover/constellation responsive memory cards inside the galaxy network
interface MemoryCardProps {
  memory: Memory;
  idx: number;
  onFocus: (id: string, position: THREE.Vector3) => void;
  focused: boolean;
}

function MemoryCard({ memory, idx, onFocus, focused }: MemoryCardProps) {
  const cardRef = useRef<THREE.Group>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  // Play/pause the video decoder programmatically based on active hover/focus state to prevent memory/CPU spikes.
  useEffect(() => {
    if (videoRef.current) {
      if (focused || hovered) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [focused, hovered]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pos = getMemoryPosition(idx, time);
    
    if (cardRef.current) {
      cardRef.current.position.copy(pos);
      // Perfect billboarding: makes the memory face the screen flawlessly in space
      cardRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <group ref={cardRef}>
      <Html center distanceFactor={16} pointerEvents="auto">
        <div 
          onClick={(e) => {
            e.stopPropagation();
            if (cardRef.current) {
              const globalPos = new THREE.Vector3();
              cardRef.current.getWorldPosition(globalPos);
              onFocus(memory.id, globalPos);
            }
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`
            relative p-2.5 rounded-2xl backdrop-blur-md border cursor-pointer select-none
            transition-all duration-700 w-[150px] flex flex-col items-center gap-1.5
            ${focused 
              ? 'bg-rose-500/20 border-rose-300 shadow-[0_0_40px_rgba(244,63,94,0.6)] scale-110' 
              : 'bg-black/50 border-white/10 hover:border-pink-400/40 hover:bg-black/70 shadow-[0_0_20px_rgba(251,113,133,0.15)] hover:shadow-[0_0_30px_rgba(251,113,133,0.35)] hover:scale-105'
            }
          `}
        >
          {/* Neon scan lines decoration */}
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-rose-400 to-transparent opacity-50 animate-pulse"></div>
          
          {memory.type === 'photo' ? (
            <div className="relative w-[130px] h-[90px] rounded-lg overflow-hidden border border-white/5 bg-neutral-900">
              <img 
                src={memory.url} 
                alt="Memory" 
                loading="lazy" 
                className="w-full h-full object-cover select-none pointer-events-none" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="relative w-[130px] h-[90px] rounded-lg overflow-hidden border border-white/5 bg-black">
              <video 
                ref={videoRef}
                src={memory.url} 
                muted 
                loop 
                playsInline 
                preload="metadata"
                className="w-full h-full object-cover select-none pointer-events-none" 
              />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            </div>
          )}
          
          <p className="text-[10px] text-pink-100/90 font-serif italic text-center leading-tight tracking-wide px-1 line-clamp-2 mt-0.5 select-none font-light">
            "{memory.caption}"
          </p>
        </div>
      </Html>
    </group>
  );
}

// 2. Cosmic Constellation Web / Glowing Connection Grid (Optimized with zero runtime allocation)
interface ConstellationLinesProps {
  glowIntensity: number;
}

function ConstellationLines({ glowIntensity }: ConstellationLinesProps) {
  const geomRef = useRef<THREE.BufferGeometry>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (geomRef.current) {
      const attr = geomRef.current.getAttribute('position') as THREE.BufferAttribute;
      if (attr) {
        const array = attr.array as Float32Array;
        let index = 0;
        
        for (let i = 0; i < memories.length; i++) {
          const posA = getMemoryPosition(i, time);
          
          // Connection A: Gird lines locking each node to the central gravitation point
          array[index++] = posA.x;
          array[index++] = posA.y;
          array[index++] = posA.z;
          array[index++] = 0;
          array[index++] = 0;
          array[index++] = 0;
          
          // Connection B: Sequential ring bounds to adjacent nodes
          const nextIdx = (i + 1) % memories.length;
          const posNext = getMemoryPosition(nextIdx, time);
          array[index++] = posA.x;
          array[index++] = posA.y;
          array[index++] = posA.z;
          array[index++] = posNext.x;
          array[index++] = posNext.y;
          array[index++] = posNext.z;
          
          // Connection C: Visual network cross-links
          const crossIdx = (i + 4) % memories.length;
          const posCross = getMemoryPosition(crossIdx, time);
          array[index++] = posA.x;
          array[index++] = posA.y;
          array[index++] = posA.z;
          array[index++] = posCross.x;
          array[index++] = posCross.y;
          array[index++] = posCross.z;
        }
        attr.needsUpdate = true;
      }
    }
  });

  return (
    <lineSegments>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute 
          attach="attributes-position"
          args={[new Float32Array(memories.length * 6 * 3), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial 
        color={glowIntensity > 3.0 ? '#fb7185' : '#ec4899'} 
        transparent 
        opacity={glowIntensity > 3.0 ? 0.35 : 0.18} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </lineSegments>
  );
}

// 3. Flower Petals & Dreamy Particle atmosphere swirling surrounding Dehan
function SwirlingAtmosphere({ glowIntensity }: { glowIntensity: number }) {
  const petalsRef = useRef<THREE.Points>(null);
  const sparklesRef = useRef<THREE.Points>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const petalData = useMemo(() => {
    const count = isMobile ? 80 : 250;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r = 4 + Math.random() * 26;
        const theta = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 16;
        pos[i * 3] = Math.cos(theta) * r;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    return pos;
  }, [isMobile]);

  const sparkleData = useMemo(() => {
    const count = isMobile ? 120 : 350;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r = 1 + Math.random() * 32;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [isMobile]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const swirlSpeed = glowIntensity > 3.0 ? 2.5 : 1.0;
    
    if (petalsRef.current) {
      petalsRef.current.rotation.y = time * 0.1 * swirlSpeed;
      petalsRef.current.position.y = Math.sin(time * 0.25) * 1.5;
    }
    if (sparklesRef.current) {
      sparklesRef.current.rotation.y = -time * 0.06 * swirlSpeed;
      sparklesRef.current.rotation.x = Math.sin(time * 0.08) * 0.1;
    }
  });

  return (
    <group>
      {/* Pink/Rose Petals */}
      <Points ref={petalsRef} positions={petalData} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#fda4af"
          size={isMobile ? 0.3 : 0.45}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.65}
        />
      </Points>
      {/* Gold stars / sparkles */}
      <Points ref={sparklesRef} positions={sparkleData} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#fde047"
          size={isMobile ? 0.18 : 0.28}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.7}
        />
      </Points>
    </group>
  );
}

// 4. Central Majestic Planet representing Dehan herself
function GiantCenterPlanet({ glowIntensity }: { glowIntensity: number }) {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (planetRef.current) {
      planetRef.current.rotation.y = time * 0.06;
      // Heartbeat pulse breathing scale
      const pulseRate = glowIntensity > 3.0 ? 3.0 : 1.5;
      const amplitude = glowIntensity > 3.0 ? 0.07 : 0.04;
      const pulse = 1.0 + Math.sin(time * pulseRate) * amplitude;
      planetRef.current.scale.setScalar(pulse);
    }

    if (ringRef.current) {
      ringRef.current.rotation.y = -time * 0.015;
    }
  });

  const sphereSegments = isMobile ? 16 : 32;
  const ringSegments = isMobile ? 32 : 64;

  return (
    <group>
      {/* Core Planet */}
      <mesh ref={planetRef} scale={4.5}>
        <sphereGeometry args={[1, sphereSegments, sphereSegments]} />
        <meshStandardMaterial 
          color="#1e1b4b" 
          emissive="#fb7185" 
          emissiveIntensity={glowIntensity}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* Atmospheric Inner Glow */}
      <mesh scale={5.5}>
        <sphereGeometry args={[1, sphereSegments, isMobile ? 8 : 16]} />
        <meshBasicMaterial 
          color="#f472b6" 
          transparent 
          opacity={0.16 + (glowIntensity * 0.03)} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
        />
      </mesh>

      {/* Atmospheric Elegant Outer Aura */}
      <mesh scale={7.2}>
        <sphereGeometry args={[1, sphereSegments, isMobile ? 8 : 16]} />
        <meshBasicMaterial 
          color="#e11d48" 
          transparent 
          opacity={0.08 + (glowIntensity * 0.02)} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
        />
      </mesh>

      {/* Large nested Saturnian rings */}
      <group ref={ringRef}>
        {/* Ring A: Soft Pink-Rose */}
        <mesh rotation={[Math.PI / 3.4, 0.35, 0]}>
          <ringGeometry args={[6.6, 9.0, ringSegments]} />
          <meshBasicMaterial color="#fb7185" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Ring B: Dream Glittering Amber/Gold */}
        <mesh rotation={[Math.PI / 2.9, -0.2, 0.25]}>
          <ringGeometry args={[9.5, 11.5, ringSegments]} />
          <meshBasicMaterial color="#fcd34d" transparent opacity={0.18} side={THREE.DoubleSide} />
        </mesh>

        {/* Ring C: Translucent holographic space outline */}
        <mesh rotation={[Math.PI / 4.2, 0.1, -0.15]}>
          <ringGeometry args={[12.2, 12.5, ringSegments]} />
          <meshBasicMaterial color="#a7f3d0" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

// Main Scene Component compiles everything perfectly
export function FinalScene({ onFocusMemory, focusedMemory }: FinalSceneProps) {
  const worldRef = useRef<THREE.Group>(null);
  const glowRef = useRef<number>(2.0);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    // Slow majestic celestial floating movement
    if (worldRef.current) {
      worldRef.current.rotation.y = time * 0.02;
    }

    // Swell the central planet glow when the final climax appears at 15s
    if (time >= 15) {
      glowRef.current = THREE.MathUtils.lerp(glowRef.current, 5.0, delta * 0.5);
    } else {
      glowRef.current = THREE.MathUtils.lerp(glowRef.current, 1.8, delta * 0.5);
    }
  });

  return (
    <group ref={worldRef}>
      {/* Central lighting point focused exclusively here */}
      <pointLight position={[0, 0, 0]} intensity={4 + glowRef.current} color="#fb7185" />

      {/* Giant Center Planet - representing Dehan */}
      <GiantCenterPlanet glowIntensity={glowRef.current} />

      {/* Swirling celestial surroundings */}
      <SwirlingAtmosphere glowIntensity={glowRef.current} />

      {/* Connected constellation line segments */}
      <ConstellationLines glowIntensity={glowRef.current} />

      {/* 13 Orbiting holographic memory cards */}
      {memories.map((memory, i) => (
        <MemoryCard 
          key={memory.id} 
          memory={memory} 
          idx={i} 
          onFocus={onFocusMemory} 
          focused={focusedMemory?.id === memory.id} 
        />
      ))}
    </group>
  );
}
