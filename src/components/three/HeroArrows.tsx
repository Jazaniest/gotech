import React, { useMemo } from 'react';
import type * as THREE from 'three';
import DecorativeArrow from './DecorativeArrow';
import { useHeroArrowsAnimation, type ArrowSpread } from '../../animations/useHeroArrowsAnimation';

// Jumlah panah dekoratif TAMBAHAN di luar panah utama (Arrow.tsx).
// Total yang kelihatan di Hero = ARROW_COUNT + 1 (panah utama).
const ARROW_COUNT = 6;
const COLORS = ['#FFD400', '#e4f22e', '#FFD400', '#e4f22e', '#FFD400', '#e4f22e'];

const HeroArrows = () => {
  // Refs manual (bukan useRef per-elemen) karena jumlahnya dinamis dan
  // harus stabil sepanjang lifetime komponen buat dipakai gsap.context().
  const refs = useMemo(
    () =>
      Array.from({ length: ARROW_COUNT }, () =>
        React.createRef<THREE.Group>()
      ),
    []
  );

  // Posisi "ramai" di Hero: tersebar simetris kiri-kanan & naik-turun di
  // sekitar panah utama (yang ada di x=0, mengikuti pose BASE_ROTATION-nya).
  const spreads = useMemo<ArrowSpread[]>(() => {
    return Array.from({ length: ARROW_COUNT }, (_, i) => {
      const mid = (ARROW_COUNT - 1) / 2;
      const t = i - mid; // index simetris, mis. -2.5 .. 2.5
      return {
        x: t * 1.15,
        y: (i % 2 === 0 ? 1 : -1) * (0.35 + Math.abs(t) * 0.18),
        z: -1.2 - Math.abs(t) * 0.35,
      };
    });
  }, []);

  // Posisi keluar panggung: tiap panah minggir jauh ke kiri (x negatif)
  // atau kanan (x positif), sesuai sisi awalnya di spread.
  const exits = useMemo<ArrowSpread[]>(() => {
    return spreads.map((s) => ({
      x: s.x < 0 ? s.x - 12 : s.x + 12,
      y: s.y * 2.2,
      z: s.z - 1,
    }));
  }, [spreads]);

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
