import * as THREE from 'three';

export interface UseSecondaryArrowAnimationProps {
    groupRef: React.RefObject<THREE.Group>;
    vanesRef: React.RefObject<THREE.Group>;
    xOffset: number;
    yOffset: number;
    zOffset: number;
}