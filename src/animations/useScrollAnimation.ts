import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useBreakpoint } from '../lib/useBreakpoint';
import type { UseScrollAnimationProps } from '../types/animations/ScrollAnimation';

gsap.registerPlugin(ScrollTrigger);

const BASE_ROTATION = { x: -Math.PI / 2, y: 0, z: 0 };

const PART_Z = {
  shaft: 0,
  point: 4,
  vanes: -3.8,
  nock: -4,
};

const SPECS_ROLL = -Math.PI;
const NOCK_ROLL = -Math.PI + Math.PI / 6;
const rolls = [0, -Math.PI / 2, -Math.PI / 2, SPECS_ROLL, NOCK_ROLL, 0];

const CAMERA_CONFIG = {
  desktop: {
    fov: 47,
    heroDistance: 12,
    brandStory: { cam: [0.7, 0.4, PART_Z.shaft + 0.9] as const, target: [0.2, -0.2, PART_Z.shaft] as const },
    productHighlights: { cam: [1.3, 0.7, PART_Z.point + 2.6] as const, target: [0, 0, PART_Z.point] as const },
    specs: { cam: [-1.6, 0.9, PART_Z.vanes + 2.8] as const, target: [0, 0, PART_Z.vanes - 0.4] as const },
    nock: { cam: [1.2, 0.6, PART_Z.nock + 2.6] as const, target: [0, 0, PART_Z.nock] as const },
  },
  tablet: {
    fov: 50,
    heroDistance: 14,
    brandStory: { cam: [0.55, 0.32, PART_Z.shaft + 1.2] as const, target: [0.15, -0.15, PART_Z.shaft] as const },
    productHighlights: { cam: [1.0, 0.6, PART_Z.point + 3.2] as const, target: [0, 0, PART_Z.point] as const },
    specs: { cam: [-1.25, 0.72, PART_Z.vanes + 3.4] as const, target: [0, 0, PART_Z.vanes - 0.4] as const },
    nock: { cam: [0.9, 0.5, PART_Z.nock + 3.2] as const, target: [0, 0, PART_Z.nock] as const },
  },
  mobile: {
    fov: 58,
    heroDistance: 16,
    brandStory: { cam: [0.95, 0.25, PART_Z.shaft + 1.6] as const, target: [0.1, -0.1, PART_Z.shaft] as const },
    productHighlights: { cam: [1.5, 0.45, PART_Z.point + 3.8] as const, target: [0, 0, PART_Z.point] as const },
    specs: { cam: [-0.9, 0.55, PART_Z.vanes + 4.0] as const, target: [0, 0, PART_Z.vanes - 0.4] as const },
    nock: { cam: [0.65, 0.4, PART_Z.nock + 3.8] as const, target: [0, 0, PART_Z.nock] as const },
  },
};

export const useScrollAnimation = ({ groupRef, shaftRef, pointRef, nockRef, vanesRef }: UseScrollAnimationProps) => {
  const { camera } = useThree();
  const breakpoint = useBreakpoint();

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    const config = CAMERA_CONFIG[breakpoint];

    const ctx = gsap.context(() => {
      gsap.set(groupRef.current.rotation, BASE_ROTATION);
      gsap.set(camera.position, { x: 0, y: 0, z: config.heroDistance });

      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = config.fov;
        camera.updateProjectionMatrix();
      }

      gsap.set(pointRef.current.position, { z: PART_Z.point });
      gsap.set(vanesRef.current.position, { z: PART_Z.vanes });
      gsap.set(vanesRef.current.rotation, { z: 0 });

      groupRef.current.updateMatrixWorld(true);

      const localToWorld = (x: number, y: number, z: number) =>
        groupRef.current.localToWorld(new THREE.Vector3(x, y, z));

      const target = { x: 0, y: 0, z: 0 };
      const roll = { value: 0 };
      const aim = () => {
        camera.up.set(Math.sin(roll.value), Math.cos(roll.value), 0);
        camera.lookAt(target.x, target.y, target.z);
      };
      aim();

      const checkpoints = [
        { cam: { x: 0, y: 0, z: config.heroDistance }, target: { x: 0, y: 0, z: 0 } },
        {
          cam: localToWorld(config.brandStory.cam[0], config.brandStory.cam[1], config.brandStory.cam[2]),
          target: localToWorld(config.brandStory.target[0], config.brandStory.target[1], config.brandStory.target[2]),
        },
        {
          cam: localToWorld(config.productHighlights.cam[0], config.productHighlights.cam[1], config.productHighlights.cam[2]),
          target: localToWorld(config.productHighlights.target[0], config.productHighlights.target[1], config.productHighlights.target[2]),
        },
        {
          cam: localToWorld(config.specs.cam[0], config.specs.cam[1], config.specs.cam[2]),
          target: localToWorld(config.specs.target[0], config.specs.target[1], config.specs.target[2]),
        },
        {
          cam: localToWorld(config.nock.cam[0], config.nock.cam[1], config.nock.cam[2]),
          target: localToWorld(config.nock.target[0], config.nock.target[1], config.nock.target[2]),
        },
        { cam: { x: 0, y: 0, z: config.heroDistance }, target: { x: 0, y: 0, z: 0 } },
      ];

      const shot = (
        selector: string,
        from: { cam: THREE.Vector3 | typeof target; target: THREE.Vector3 | typeof target },
        to: { cam: THREE.Vector3 | typeof target; target: THREE.Vector3 | typeof target },
        fromRoll: number,
        toRoll: number,
        end: string = 'bottom top'
      ) =>
        gsap.timeline({
          scrollTrigger: { trigger: selector, start: 'top top', end, scrub: true },
        })
          .fromTo(
            camera.position,
            { x: from.cam.x, y: from.cam.y, z: from.cam.z },
            { x: to.cam.x, y: to.cam.y, z: to.cam.z, onUpdate: aim, ease: 'power1.inOut', immediateRender: false },
            0
          )
          .fromTo(
            target,
            { x: from.target.x, y: from.target.y, z: from.target.z },
            { x: to.target.x, y: to.target.y, z: to.target.z, onUpdate: aim, ease: 'power1.inOut', immediateRender: false },
            0
          )
          .fromTo(
            roll,
            { value: fromRoll },
            { value: toRoll, onUpdate: aim, ease: 'power1.inOut', immediateRender: false },
            0
          );

      shot('.hero', checkpoints[0], checkpoints[1], rolls[0], rolls[1]);

      shot('.brand-story', checkpoints[1], checkpoints[2], rolls[1], rolls[2]);

      shot('.product-highlights', checkpoints[2], checkpoints[3], rolls[2], rolls[3]);
      gsap.timeline({
        scrollTrigger: { trigger: '.product-highlights', start: 'top top', end: 'bottom top', scrub: true },
      })
        .fromTo(pointRef.current.position, { z: PART_Z.point }, { z: PART_Z.point + 1.4, ease: 'power1.inOut', immediateRender: false }, 0.3)
        .to(pointRef.current.position, { z: PART_Z.point, ease: 'power1.inOut' }, 0.8);

      shot('.specs', checkpoints[3], checkpoints[4], rolls[3], rolls[4]);
      gsap.timeline({
        scrollTrigger: { trigger: '.specs', start: 'top top', end: 'bottom top', scrub: true },
      })
        .fromTo(vanesRef.current.rotation, { z: 0 }, { z: Math.PI * 2, ease: 'power1.inOut', immediateRender: false }, 0.3)
        .to(vanesRef.current.rotation, { z: 0, ease: 'power1.inOut' }, 0.8);

      shot('.nock', checkpoints[4], checkpoints[5], rolls[4], rolls[5]);

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [groupRef, shaftRef, pointRef, nockRef, vanesRef, camera, breakpoint]);
};
