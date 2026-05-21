import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { audioReactivity } from '../utils/audioReactivity';

export interface Constellation {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  nodes: { id: string; pos: [number, number, number]; name: string }[];
  affirmation: string;
}

const CONSTELLATIONS: Constellation[] = [
  {
    id: 'const-hope',
    name: 'Hope Stella',
    color: '#fda4af', // pink-300
    glowColor: 'rgba(244, 63, 94, 0.65)',
    nodes: [
      { id: 'h1', pos: [-15, 6, -8], name: 'Comfort' },
      { id: 'h2', pos: [-12, 9, -10], name: 'Warmth' },
      { id: 'h3', pos: [-8, 7, -6], name: 'Light' },
      { id: 'h4', pos: [-10, 4, -5], name: 'Hope' },
      { id: 'h5', pos: [-14, 3, -6], name: 'Estrella' },
    ],
    affirmation: 'galaxies probably envy your light, Dehan. please stay for more beautiful days.',
  },
  {
    id: 'const-serenity',
    name: 'Serene Matcha',
    color: '#86efac', // green-300
    glowColor: 'rgba(34, 197, 94, 0.65)',
    nodes: [
      { id: 's1', pos: [14, -4, 6], name: 'Calm' },
      { id: 's2', pos: [17, -2, 4], name: 'Peace' },
      { id: 's3', pos: [19, -6, 2], name: 'Sweetness' },
      { id: 's4', pos: [15, -8, 5], name: 'Home' },
    ],
    affirmation: 'some stars exist just to find u. the universe feels softer and warmer with u.',
  },
  {
    id: 'const-eternity',
    name: 'Eternity Crystal',
    color: '#d8b4fe', // purple-300
    glowColor: 'rgba(168, 85, 247, 0.65)',
    nodes: [
      { id: 'e1', pos: [-2, 12, -14], name: 'Dream' },
      { id: 'e2', pos: [3, 14, -16], name: 'Magic' },
      { id: 'e3', pos: [6, 11, -12], name: 'Forever' },
      { id: 'e4', pos: [1, 9, -13], name: 'Grace' },
    ],
    affirmation: 'u were always enough, and u make ordinary moments feel beautiful.',
  },
];

interface ConstellationSystemProps {
  onUnlockAffirmation: (text: string) => void;
  activeConstellationId: string | null;
  setActiveConstellationId: (id: string | null) => void;
}

export function ConstellationSystem({ 
  onUnlockAffirmation, 
  activeConstellationId, 
  setActiveConstellationId 
}: ConstellationSystemProps) {
  // Keeps track of clicked nodes per constellation
  const [visitedNodes, setVisitedNodes] = useState<Record<string, string[]>>({
    'const-hope': [],
    'const-serenity': [],
    'const-eternity': [],
  });
  
  // Highlighting/hover states
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Line segments points calculation
  const getLinePoints = (constellation: Constellation) => {
    const visited = visitedNodes[constellation.id] || [];
    if (visited.length < 2) return [];

    const points: THREE.Vector3[] = [];
    for (let i = 0; i < visited.length - 1; i++) {
      const nodeA = constellation.nodes.find(n => n.id === visited[i]);
      const nodeB = constellation.nodes.find(n => n.id === visited[i + 1]);
      if (nodeA && nodeB) {
        points.push(new THREE.Vector3(...nodeA.pos));
        points.push(new THREE.Vector3(...nodeB.pos));
      }
    }
    
    // If complete (all nodes visited), close the loop nicely
    if (visited.length === constellation.nodes.length) {
      const lastNode = constellation.nodes.find(n => n.id === visited[visited.length - 1]);
      const firstNode = constellation.nodes.find(n => n.id === visited[0]);
      if (lastNode && firstNode) {
        points.push(new THREE.Vector3(...lastNode.pos));
        points.push(new THREE.Vector3(...firstNode.pos));
      }
    }

    return points;
  };

  const handleNodeClick = (constellationId: string, nodeId: string) => {
    const list = [...(visitedNodes[constellationId] || [])];
    const constellation = CONSTELLATIONS.find(c => c.id === constellationId);
    if (!constellation) return;

    if (list.includes(nodeId)) {
      // If clicked again and completed, unlock affirmation
      if (list.length === constellation.nodes.length) {
        onUnlockAffirmation(constellation.affirmation);
        setActiveConstellationId(constellationId);
      }
      return; // Already selected
    }

    const newList = [...list, nodeId];
    setVisitedNodes(prev => ({
      ...prev,
      [constellationId]: newList
    }));

    // Check if fully connected now!
    if (newList.length === constellation.nodes.length) {
      setTimeout(() => {
        onUnlockAffirmation(constellation.affirmation);
        setActiveConstellationId(constellationId);
      }, 600);
    }
  };

  const handleResetConstellation = (constellationId: string) => {
    setVisitedNodes(prev => ({
      ...prev,
      [constellationId]: []
    }));
    if (activeConstellationId === constellationId) {
      setActiveConstellationId(null);
    }
  };

  return (
    <group>
      {CONSTELLATIONS.map((constellation) => {
        const visited = visitedNodes[constellation.id] || [];
        const isCompleted = visited.length === constellation.nodes.length;
        const linePoints = getLinePoints(constellation);

        return (
          <group key={constellation.id}>
            {/* Draw active glowing connection lines */}
            {linePoints.length > 0 && (
              <group>
                {Array.from({ length: linePoints.length / 2 }).map((_, idx) => {
                  const pA = linePoints[idx * 2];
                  const pB = linePoints[idx * 2 + 1];
                  
                  return (
                    <line key={idx}>
                      <bufferGeometry attach="geometry">
                        <float32BufferAttribute 
                          attach="attributes-position" 
                          args={[new Float32Array([pA.x, pA.y, pA.z, pB.x, pB.y, pB.z]), 3]} 
                        />
                      </bufferGeometry>
                      <lineBasicMaterial 
                        color={constellation.color} 
                        transparent 
                        opacity={isCompleted ? 0.8 : 0.45} 
                        linewidth={1}
                        blending={THREE.AdditiveBlending}
                      />
                    </line>
                  );
                })}
              </group>
            )}

            {/* Constellation Nodes */}
            {constellation.nodes.map((node) => {
              const isVisited = visited.includes(node.id);
              const isHovered = hoveredNode === node.id;
              
              return (
                <group key={node.id} position={node.pos}>
                  {/* Subtle outer orbit ring */}
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.35, 0.4, 16]} />
                    <meshBasicMaterial 
                      color={constellation.color} 
                      transparent 
                      opacity={isVisited ? 0.5 : 0.15} 
                      blending={THREE.AdditiveBlending}
                    />
                  </mesh>

                  {/* Node Star Mesh */}
                  <mesh 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNodeClick(constellation.id, node.id);
                    }}
                    onPointerOver={(e) => {
                      e.stopPropagation();
                      setHoveredNode(node.id);
                    }}
                    onPointerOut={(e) => {
                      e.stopPropagation();
                      setHoveredNode(null);
                    }}
                    scale={isHovered ? 1.4 : 1.0}
                  >
                    <sphereGeometry args={[0.18, 16, 16]} />
                    <meshBasicMaterial 
                      color={isVisited ? '#ffffff' : constellation.color} 
                      transparent 
                      opacity={isVisited ? 1.0 : 0.4}
                    />
                  </mesh>

                  {/* Interactive node marker labels */}
                  <Html center distanceFactor={14} pointerEvents="none">
                    <div className="flex flex-col items-center select-none leading-none">
                      <span 
                        className="text-[9px] uppercase tracking-widest font-mono select-none pointer-events-none mt-7 px-1.5 py-0.5 rounded transition-all duration-300"
                        style={{
                          color: isVisited ? '#ffffff' : constellation.color,
                          textShadow: isVisited ? `0 0 10px ${constellation.color}` : 'none',
                          opacity: isHovered || isVisited ? 1.0 : 0.4,
                        }}
                      >
                        {node.name}
                      </span>
                    </div>
                  </Html>
                </group>
              );
            })}

            {/* Interactive Overlay controller tag for reset/reset label */}
            {constellation.nodes.length > 0 && (
              <Html 
                position={constellation.nodes[0].pos} 
                center 
                distanceFactor={18} 
                pointerEvents="auto"
              >
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResetConstellation(constellation.id);
                  }}
                  className="bg-black/40 hover:bg-black/80 text-white/50 hover:text-white border border-white/5 text-[8px] tracking-[0.25em] h-5 px-2 py-0.5 rounded-full select-none cursor-pointer flex items-center justify-center -translate-y-8 gap-1 transition-all duration-300 min-w-[70px]"
                >
                  <span>{constellation.name}:</span>
                  <span className="text-pink-300 font-semibold uppercase font-mono">
                    {visited.length}/{constellation.nodes.length}
                  </span>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
