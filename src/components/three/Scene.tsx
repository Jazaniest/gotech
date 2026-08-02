import { Canvas } from '@react-three/fiber';
  import { Environment } from '@react-three/drei';
  import { Suspense } from 'react';
  import Arrow from './Arrow';
  import HeroArrows from './HeroArrows';
  import Lighting from './Lighting';

  const Scene = () => {
    return (
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <Suspense fallback={null}>
          <Lighting />
          <Arrow />
          <HeroArrows />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    );
  };

  export default Scene;