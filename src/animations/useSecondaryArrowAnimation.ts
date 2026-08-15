import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import type { UseSecondaryArrowAnimationProps } from '../types/animations/SecondaryArrowAnimation';

gsap.registerPlugin(ScrollTrigger);

export const useSecondaryArrowAnimation = ({
  groupRef,
  vanesRef,
  xOffset,
  yOffset,
  zOffset,
}: UseSecondaryArrowAnimationProps) => {
  useLayoutEffect(() => {
    if (!groupRef.current) return;

    const ctx = gsap.context(() => {
      const group = groupRef.current;
      if (!group) return;

      gsap.set(group.position, { x: xOffset, y: yOffset, z: zOffset });
      gsap.set(group.rotation, { x: 0, y: 0, z: 0 });
      if (vanesRef.current) {
        gsap.set(vanesRef.current.rotation, { z: 0 });
      }

      gsap.timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      }).fromTo(
        group.rotation,
        { y: 0 },
        { y: Math.PI, ease: 'power1.inOut', immediateRender: false },
        0
      );

      gsap.timeline({
        scrollTrigger: {
          trigger: '.brand-story',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      }).fromTo(
        group.rotation,
        { y: Math.PI },
        { y: Math.PI * 2, ease: 'power1.inOut', immediateRender: false },
        0
      );

      if (vanesRef.current) {
        gsap.timeline({
          scrollTrigger: { trigger: '.specs', start: 'top top', end: 'bottom top', scrub: true },
        })
          .fromTo(vanesRef.current.rotation, { z: 0 }, { z: Math.PI * 2, ease: 'power1.inOut', immediateRender: false }, 0.3)
          .to(vanesRef.current.rotation, { z: 0, ease: 'power1.inOut' }, 0.8);
      }

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [groupRef, vanesRef, xOffset, yOffset, zOffset]);
};
