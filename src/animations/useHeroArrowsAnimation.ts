import { useLayoutEffect } from 'react';
import type * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ArrowSpread {
  x: number;
  y: number;
  z: number;
}

interface UseHeroArrowsAnimationProps {
  refs: React.RefObject<THREE.Group | null>[];
  spreads: ArrowSpread[];
  exits: ArrowSpread[];
}

export const useHeroArrowsAnimation = ({ refs, spreads, exits }: UseHeroArrowsAnimationProps) => {
  useLayoutEffect(() => {
    if (refs.some((r) => !r.current)) return;

    const ctx = gsap.context(() => {
      refs.forEach((ref, i) => {
        const group = ref.current;
        if (!group) return;

        const spread = spreads[i];
        const exit = exits[i];

        gsap.set(group.position, { x: spread.x, y: spread.y, z: spread.z });
        gsap.set(group.rotation, { x: 0, y: 0, z: 0 });
        gsap.set(group.scale, { x: 1, y: 1, z: 1 });

        gsap.timeline({
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }).to(
          group.position,
          { x: exit.x, y: exit.y, z: exit.z, ease: 'power1.in' },
          0
        ).to(
          group.scale,
          { x: 0.001, y: 0.001, z: 0.001, ease: 'power1.in' },
          0
        );

        gsap.timeline({
          scrollTrigger: {
            trigger: '.nock',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }).to(
          group.position,
          { x: spread.x, y: spread.y, z: spread.z, ease: 'power1.out' },
          0
        ).to(
          group.scale,
          { x: 1, y: 1, z: 1, ease: 'power1.out' },
          0
        );

        gsap.timeline({
          scrollTrigger: {
            trigger: '.gallery',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }).to(
          group.position,
          { x: exit.x, y: exit.y, z: exit.z, ease: 'power1.in' },
          0
        ).to(
          group.scale,
          { x: 0.001, y: 0.001, z: 0.001, ease: 'power1.in' },
          0
        );
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [refs, spreads, exits]);
};
