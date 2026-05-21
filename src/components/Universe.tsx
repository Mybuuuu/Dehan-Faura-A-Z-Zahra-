import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { memories } from '../data';
import { AppState, Memory } from '../types';
import { IntroScene } from './IntroScene';
import { Planet } from './Planet';
import { CosmicParticles } from './CosmicParticles';
import { CameraRig } from './CameraRig';
import { FinalScene } from './FinalScene';
import { ConstellationSystem } from './ConstellationSystem';
import { FloatingLetter, LetterSystem } from './LetterSystem';
import * as THREE from 'three';

interface UniverseProps {
  appState: AppState;
  onStartExploring: () => void;
  focusedMemory: Memory | null;
  onFocusMemory: (id: string, position: THREE.Vector3) => void;
  focusedPosition: THREE.Vector3 | null;
  onUnlockAffirmation: (text: string) => void;
  activeConstellationId: string | null;
  setActiveConstellationId: (id: string | null) => void;
  onOpenLetter: (letter: FloatingLetter) => void;
}

export function Universe({ 
  appState, 
  onStartExploring, 
  focusedMemory, 
  onFocusMemory, 
  focusedPosition,
  onUnlockAffirmation,
  activeConstellationId,
  setActiveConstellationId,
  onOpenLetter
}: UniverseProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <Canvas
      camera={{ position: [0, 0, 25], fov: 45 }}
      style={{ background: '#05010a', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      dpr={isMobile ? 1 : 2}
    >
      <ambientLight intensity={0.2} />
      {/* Dynamic cinematic lighting based on state */}
      {appState === 'intro' && <pointLight position={[0, 0, 0]} intensity={5} color="#c084fc" />}
      {appState === 'exploring' && <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />}
      {appState === 'finale' && <pointLight position={[0, 0, 0]} intensity={8} color="#fda4af" />}

      <CosmicParticles />
      <CameraRig appState={appState} targetPosition={focusedPosition} />

      {appState === 'intro' && <IntroScene onStart={onStartExploring} />}

      {appState === 'exploring' && (
        <group>
          {/* Central sun or gathering point */}
          <mesh>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
          </mesh>
          
          {memories.map((memory) => (
            <Planet 
              key={memory.id} 
              memory={memory} 
              onClick={onFocusMemory}
              focused={focusedMemory?.id === memory.id}
            />
          ))}

          {/* Interactive constellation mapping nodes */}
          <ConstellationSystem 
            onUnlockAffirmation={onUnlockAffirmation}
            activeConstellationId={activeConstellationId}
            setActiveConstellationId={setActiveConstellationId}
          />

          {/* Drifting holographic letters system */}
          <LetterSystem onOpenLetter={onOpenLetter} />
        </group>
      )}

      {appState === 'finale' && (
        <FinalScene 
          onFocusMemory={onFocusMemory} 
          focusedMemory={focusedMemory} 
        />
      )}

      {/* Cinematic Post-Processing */}
      <EffectComposer multisampling={isMobile ? 0 : 4}>
        <Bloom 
          luminanceThreshold={0.2} 
          mipmapBlur={!isMobile} 
          intensity={isMobile ? 1.0 : 1.5} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
}
