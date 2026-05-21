import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AppState } from '../types';

interface CameraRigProps {
  appState: AppState;
  targetPosition: THREE.Vector3 | null;
}

export function CameraRig({ appState, targetPosition }: CameraRigProps) {
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookAtTarget = useMemo(() => new THREE.Vector3(), []);
  const currentLookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    // Determine target camera position
    target.set(0, 0, 0);
    lookAtTarget.set(0, 0, 0);
    
    if (appState === 'intro') {
      target.set(0, 0, 25);
      lookAtTarget.set(0, 0, 0);
    } else if (appState === 'exploring') {
      if (targetPosition) {
        // Zoom into specific planet
        const dist = 6;
        const dir = targetPosition.clone().normalize();
        target.copy(targetPosition).add(dir.multiplyScalar(dist));
        target.y += 2; // slightly above
        lookAtTarget.copy(targetPosition);
      } else {
        // Wide view
        const time = state.clock.getElapsedTime();
        target.set(Math.sin(time * 0.05) * 40, 15, Math.cos(time * 0.05) * 40);
        lookAtTarget.set(0, 0, 0);
      }
    } else if (appState === 'finale') {
      target.set(0, 5, 30);
      lookAtTarget.set(0, 0, 0);
    }

    // Smoothly interpolate camera position
    state.camera.position.lerp(target, delta * 2);
    
    // Smoothly interpolate lookAt
    currentLookAt.set(0, 0, -1).applyQuaternion(state.camera.quaternion).add(state.camera.position);
    currentLookAt.lerp(lookAtTarget, delta * 3);
    state.camera.lookAt(currentLookAt);
  });

  return null;
}
