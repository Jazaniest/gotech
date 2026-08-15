import React, { useMemo } from 'react';
import type * as THREE from 'three';
import DecorativeArrow from './DecorativeArrow';
import { useHeroArrowsAnimation, type ArrowSpread } from '../../animations/useHeroArrowsAnimation';
import { useBreakpoint } from '../../lib/useBreakpoint';

const ARROW_COUNT = 6;
const COLORS = ['#FFD400', '#e4f22e', '#FFD400', '#e4f22e', '#FFD400', '#e4f22e'];

const CENTER = 0.15;

const OFFSETS = {
  desktop: [-1.8, -1.2, -0.6, 0.6, 1.2, 1.8],
  tablet: [-1.45, -0.98, -0.5, 0.5, 0.98, 1.45],
  mobile: [-1.1, -0.75, -0.4, 0.4, 0.75, 1.1],
};

const EXIT_DISTANCE = { desktop: 14, tablet: 11, mobile: 8 };

const HeroArrows = () => {
  const breakpoint = useBreakpoint();
  const offsets = OFFSETS[breakpoint];
  const exitDistance = EXIT_DISTANCE[breakpoint];

  const refs = useMemo(
    () =>
      Array.from({ length: ARROW_COUNT }, () =>
        React.createRef<THREE.Group>()
      ),
    []
  );

  const spreads = useMemo<ArrowSpread[]>(() => {
    return offsets.map((offset) => ({
      x: CENTER + offset,
      y: 0,
      z: 0,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakpoint]);

  const exits = useMemo<ArrowSpread[]>(() => {
    return spreads.map((s, i) => ({
      x: s.x + (offsets[i] < 0 ? -exitDistance : exitDistance),
      y: 0,
      z: 0,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spreads, exitDistance]);

  useHeroArrowsAnimation({ refs, spreads, exits });

  return (
    <>
      {refs.map((ref, i) => (
        <DecorativeArrow key={i} ref={ref} color={COLORS[i % COLORS.length]} />
      ))}
    </>
  );
};

export default HeroArrows;
