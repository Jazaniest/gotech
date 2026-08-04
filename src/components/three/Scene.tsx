import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense, useEffect } from 'react';
import Arrow from './Arrow';
import SecondaryArrow from './SecondaryArrow';
import HeroArrows from './HeroArrows';
import Lighting from './Lighting';

interface SceneProps {
  onReady?: () => void;
}

// Komponen "kosong" ini sengaja ditaruh di Suspense boundary YANG SAMA
// dengan Environment. React cuma akan me-render (dan menjalankan
// useEffect) komponen ini SETELAH Suspense itu resolve - yaitu persis
// begitu file HDR Environment selesai diunduh. Ini sinyal paling akurat
// buat tahu kapan scene benar-benar siap ditampilkan, tanpa race
// condition seperti kalau pakai useProgress (yang bisa lapor "100%"
// duluan sebelum loader-nya sendiri sempat mulai).
const EnvironmentReady = ({ onReady }: { onReady?: () => void }) => {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
};

const Scene = ({ onReady }: SceneProps) => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <Lighting />
      <Arrow>
        <SecondaryArrow />
      </Arrow>
      <HeroArrows />
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <EnvironmentReady onReady={onReady} />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
