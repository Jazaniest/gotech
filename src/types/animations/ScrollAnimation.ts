import * as THREE from 'three';

export interface UseScrollAnimationProps {
    groupRef: React.RefObject<THREE.Group>;
    visualsRef: React.RefObject<THREE.Group>;
    shaftRef: React.RefObject<THREE.Mesh>;
    pointRef: React.RefObject<THREE.Mesh>;
    nockRef: React.RefObject<THREE.Mesh>;
    vanesRef: React.RefObject<THREE.Group>;
}