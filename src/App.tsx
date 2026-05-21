/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AppState, Memory } from './types';
import { Universe } from './components/Universe';
import { Overlay } from './components/Overlay';
import { AudioController } from './components/AudioController';
import { FloatingLetter } from './components/LetterSystem';
import { memories } from './data';
import * as THREE from 'three';

export default function App() {
  const [appState, setAppState] = useState<AppState>('intro');
  const [focusedMemoryId, setFocusedMemoryId] = useState<string | null>(null);
  const [focusedPosition, setFocusedPosition] = useState<THREE.Vector3 | null>(null);
  
  // Custom states for interactive constellations and floating letters
  const [activeConstellationId, setActiveConstellationId] = useState<string | null>(null);
  const [unlockedAffirmation, setUnlockedAffirmation] = useState<string | null>(null);
  const [openedLetter, setOpenedLetter] = useState<FloatingLetter | null>(null);

  const handleStartExploring = () => {
    setAppState('exploring');
  };

  const handleFocusMemory = (id: string, position: THREE.Vector3) => {
    setFocusedMemoryId(id);
    setFocusedPosition(position);
  };

  const handleCloseMemory = () => {
    setFocusedMemoryId(null);
    setFocusedPosition(null);
  };

  const handleEnterFinale = () => {
    setAppState('finale');
    setFocusedMemoryId(null);
    setFocusedPosition(null);
    setActiveConstellationId(null);
    setUnlockedAffirmation(null);
    setOpenedLetter(null);
  };

  const focusedMemory = focusedMemoryId ? memories.find(m => m.id === focusedMemoryId) || null : null;

  return (
    <div className="relative w-full h-screen bg-[#05010a] overflow-hidden font-sans">
      <AudioController appState={appState} />
      
      <Universe 
        appState={appState}
        onStartExploring={handleStartExploring}
        focusedMemory={focusedMemory}
        onFocusMemory={handleFocusMemory}
        focusedPosition={focusedPosition}
        onUnlockAffirmation={setUnlockedAffirmation}
        activeConstellationId={activeConstellationId}
        setActiveConstellationId={setActiveConstellationId}
        onOpenLetter={setOpenedLetter}
      />
      
      <Overlay 
        appState={appState}
        focusedMemory={focusedMemory}
        onCloseMemory={handleCloseMemory}
        onEnterFinale={handleEnterFinale}
        unlockedAffirmation={unlockedAffirmation}
        onCloseAffirmation={() => setUnlockedAffirmation(null)}
        openedLetter={openedLetter}
        onCloseLetter={() => setOpenedLetter(null)}
      />
    </div>
  );
}
