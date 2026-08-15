import type * as THREE from 'three';

export interface ArrowSpread {
    x: number;
    y: number;
    z: number;
}

export interface UseHeroArrowsAnimationProps {
    refs: React.RefObject<THREE.Group>[];
    spreads: ArrowSpread[];
    exits: ArrowSpread[];
}