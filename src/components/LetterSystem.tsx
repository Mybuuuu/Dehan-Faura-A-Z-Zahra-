import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Mail } from 'lucide-react';
import { audioReactivity } from '../utils/audioReactivity';

export interface FloatingLetter {
  id: string;
  pos: [number, number, number];
  title: string;
  excerpt: string;
  content: string;
  color: string;
}

const LETTERS: FloatingLetter[] = [
  {
    id: 'letter-survive',
    pos: [11, 4, -9],
    title: 'gentle reminder',
    excerpt: 'thank u for surviving...',
    content: 'thank u for surviving this far. the world can be incredibly loud and heavy, but somehow u carry so much softness. i hope u realize how much of a gift that is. your existence is enough.',
    color: 'from-pink-400/20 to-purple-400/20 border-pink-300/30 text-rose-200',
  },
  {
    id: 'letter-hug',
    pos: [-8, -6, -6],
    title: 'a cosmic hug',
    excerpt: 'i hope life hugs u...',
    content: 'i hope life hugs u gently this year. u deserve matcha-flavored slow days, warm blankets, and people who look at u and feel peaceful. never forget that u are safe here in this little space.',
    color: 'from-emerald-400/20 to-teal-400/20 border-emerald-300/30 text-emerald-200',
  },
  {
    id: 'letter-home',
    pos: [14, -7, 5],
    title: 'belonging',
    excerpt: 'some people feel like home...',
    content: 'some people feel like home. but u? u feel like a whole universe. your laughter is like stardust, spreading warmth to every dark and cold corner. thank u for being u.',
    color: 'from-amber-400/20 to-orange-400/20 border-amber-300/30 text-amber-200',
  },
  {
    id: 'letter-beauty',
    pos: [-15, 6, 4],
    title: 'ordinary magic',
    excerpt: 'u make ordinary things...',
    content: 'u make ordinary moments feel beautiful. a simple cup of tea, a random song, a silent walk—they all shine a little brighter when u are around. stay magic, stay you.',
    color: 'from-cyan-400/20 to-blue-400/20 border-cyan-300/30 text-cyan-200',
  },
];

interface LetterSystemProps {
  onOpenLetter: (letter: FloatingLetter) => void;
}

export function LetterSystem({ onOpenLetter }: LetterSystemProps) {
  return (
    <group>
      {LETTERS.map((letter) => (
        <LetterEnvelope key={letter.id} letter={letter} onOpen={onOpenLetter} />
      ))}
    </group>
  );
}

function LetterEnvelope({ letter, onOpen }: { letter: FloatingLetter; onOpen: (letter: FloatingLetter) => void }) {
  const envelopeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Subtle floating & rotation animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pulseFactor = audioReactivity.getLevel(time);

    if (envelopeRef.current) {
      // Gentle floating drift
      envelopeRef.current.position.y = letter.pos[1] + Math.sin(time * 0.7 + letter.pos[0]) * 1.2;
      envelopeRef.current.position.x = letter.pos[0] + Math.cos(time * 0.4 + letter.pos[2]) * 0.8;
      
      // Dynamic scaling according to music beat/reactive level
      const scaleMultiplier = 1.0 + pulseFactor * 0.12 + (hovered ? 0.1 : 0);
      envelopeRef.current.scale.setScalar(scaleMultiplier);

      // Slower spin
      envelopeRef.current.rotation.y = time * 0.15;
    }
  });

  return (
    <group ref={envelopeRef} position={letter.pos}>
      {/* Outer elegant glow ring helper inside the canvas */}
      <mesh>
        <sphereGeometry args={[1.0, 16, 16]} />
        <meshBasicMaterial 
          color={letter.id === 'letter-hug' ? '#4ade80' : '#f472b6'} 
          transparent 
          opacity={hovered ? 0.22 : 0.08} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Glassmorphic interactive HTML icon representation */}
      <Html center distanceFactor={14} pointerEvents="auto">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onOpen(letter);
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          className={`
            relative p-3.5 rounded-2xl backdrop-blur-lg border cursor-pointer select-none
            transition-all duration-700 flex flex-col items-center justify-center gap-1 w-24 h-24
            ${hovered 
              ? 'bg-rose-500/20 border-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.5)] -translate-y-1' 
              : 'bg-black/40 border-white/10 hover:border-pink-300/40 shadow-[0_0_15px_rgba(251,113,133,0.1)]'
            }
          `}
        >
          {/* Subtle neon spark */}
          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
          
          <Mail 
            size={22} 
            className={`transition-colors duration-500 ${hovered ? 'text-rose-300 scale-110' : 'text-neutral-400'}`} 
          />
          
          <span className="text-[7.5px] uppercase tracking-widest text-white/60 font-mono text-center leading-tight select-none truncate max-w-full">
            {letter.title}
          </span>
          <span className="text-[6.5px] text-pink-300/40 font-serif italic whitespace-nowrap">
            {letter.excerpt}
          </span>
        </button>
      </Html>
    </group>
  );
}
