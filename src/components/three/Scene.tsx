import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense, useEffect } from 'react';
import Arrow from './Arrow';
import SecondaryArrow from './SecondaryArrow';
import HeroArrows from './HeroArrows';
import Lighting from './Lighting';
import type { SceneProps } from '../../types/components/three/Scene';

const EnvironmentReady = ({ onReady }: { onReady?: () => void }) => {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
};

const Scene = ({ onReady }: SceneProps) => {
  return (
    <Canvas frameloop="demand" dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45 }}>
      <Lighting />
      <Arrow>
        <SecondaryArrow />
        <HeroArrows />
      </Arrow>
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <EnvironmentReady onReady={onReady} />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
