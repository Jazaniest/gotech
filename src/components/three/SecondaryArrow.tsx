import { useRef } from 'react';
import type * as THREE from 'three';
import DecorativeArrow from './DecorativeArrow';
import { useSecondaryArrowAnimation } from '../../animations/useSecondaryArrowAnimation';
import type { SecondaryArrowProps } from '../../types/components/three/SecondaryArrow';

const SecondaryArrow = ({ xOffset = 0.3, yOffset = 0, zOffset = 0 }: SecondaryArrowProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const vanesRef = useRef<THREE.Group>(null!);

  useSecondaryArrowAnimation({ groupRef, vanesRef, xOffset, yOffset, zOffset });

  return <DecorativeArrow ref={groupRef} vanesRef={vanesRef} color="#e4f22e" />;
};

export default SecondaryArrow;
