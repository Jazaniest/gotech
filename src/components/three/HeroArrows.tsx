import React, { useMemo } from 'react';
import type * as THREE from 'three';
import DecorativeArrow from './DecorativeArrow';
import { useHeroArrowsAnimation, type ArrowSpread } from '../../animations/useHeroArrowsAnimation';
import { useBreakpoint } from '../../lib/useBreakpoint';

// Jumlah panah dekoratif TAMBAHAN di luar 2 panah utama (Arrow.tsx +
// SecondaryArrow.tsx). Total yang kelihatan di Hero = ARROW_COUNT + 2.
// Saat exit Gallery -> Pricing, panah utama & SecondaryArrow IKUT keluar
// juga (lihat useScrollAnimation.ts & useSecondaryArrowAnimation.ts),
// jadi total yang "membelah" keluar = ARROW_COUNT (3 kiri+3 kanan) + 2
// panah utama (1 kiri+1 kanan) = 4 kiri + 4 kanan.
const ARROW_COUNT = 6;
const COLORS = ['#FFD400', '#e4f22e', '#FFD400', '#e4f22e', '#FFD400', '#e4f22e'];

// Titik tengah baris = titik tengah pasangan panah utama (0 dan 0.3 dari
// SecondaryArrow.tsx), supaya 2 panah utama itu benar-benar di TENGAH,
// diapit simetris oleh panah dekoratif.
const CENTER = 0.15;

// Offset tiap panah dekoratif dari CENTER: 3 di kiri (negatif), 3 di
// kanan (positif). Tiga set - DESKTOP (jarak lebih lebar & lega),
// TABLET (di antara keduanya), dan MOBILE (dirapatkan, karena layar
// portrait jauh lebih sempit) - lihat catatan breakpoint di
// useScrollAnimation.ts untuk alasan kenapa breakpoint tetap dipilih
// ketimbang skala proporsional otomatis.
const OFFSETS = {
  desktop: [-1.8, -1.2, -0.6, 0.6, 1.2, 1.8],
  tablet: [-1.45, -0.98, -0.5, 0.5, 0.98, 1.45],
  mobile: [-1.1, -0.75, -0.4, 0.4, 0.75, 1.1],
};

// Jarak keluar panggung pas exit (sumbu X, menjauh dari CENTER).
const EXIT_DISTANCE = { desktop: 14, tablet: 11, mobile: 8 };

const HeroArrows = () => {
  const breakpoint = useBreakpoint();
  const offsets = OFFSETS[breakpoint];
  const exitDistance = EXIT_DISTANCE[breakpoint];

  // Refs manual (bukan useRef per-elemen) karena jumlahnya dinamis dan
  // harus stabil sepanjang lifetime komponen buat dipakai gsap.context().
  const refs = useMemo(
    () =>
      Array.from({ length: ARROW_COUNT }, () =>
        React.createRef<THREE.Group>()
      ),
    []
  );

  // Posisi "ramai" di Hero: satu baris rapi & sejajar, semua di y=0 dan
  // z=0 (ruang LOKAL shaft utama) - 3 panah di kiri CENTER, 3 di kanan,
  // simetris, dengan pasangan panah utama pas di tengah-tengah barisan.
  // Karena komponen ini di-render sebagai CHILD dari group panah utama
  // (lihat Scene.tsx), baris ini otomatis ikut ter-rotasi BASE_ROTATION
  // yang sama seperti 2 panah utama - jadi benar-benar sejajar, bukan
  // cuma kelihatan sejajar dari satu sudut kamera tertentu.
  const spreads = useMemo<ArrowSpread[]>(() => {
    return offsets.map((offset) => ({
      x: CENTER + offset,
      y: 0,
      z: 0,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakpoint]);

  // Posisi keluar panggung: yang di kiri CENTER geser lebih jauh ke
  // kiri, yang di kanan geser lebih jauh ke kanan - jadi keluarnya
  // "membelah" ke dua arah, sejalan dengan sisi masing-masing di barisan.
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
