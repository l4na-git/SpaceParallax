import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

import { useAppStore } from '../../../store/useAppStore';
import { SolarSystemScene } from './SolarSystemScene';

export function SimulationCanvas() {
  const paused = useAppStore((state) => state.simulation.settings.paused);
  const speedMultiplier = useAppStore((state) => state.simulation.settings.speedMultiplier);

  return (
    <Canvas
      camera={{ fov: 44, near: 0.1, far: 300, position: [0, 8, 38] }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#050608']} />
      <fog attach="fog" args={['#050608', 34, 110]} />
      <Suspense fallback={null}>
        <SolarSystemScene paused={paused} speedMultiplier={speedMultiplier} />
      </Suspense>
    </Canvas>
  );
}
