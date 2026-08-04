import React, { useMemo } from 'react';
import type * as THREE from 'three';
import DecorativeArrow from './DecorativeArrow';
import { useHeroArrowsAnimation, type ArrowSpread } from '../../animations/useHeroArrowsAnimation';

// Jumlah panah dekoratif TAMBAHAN di luar 2 panah utama (Arrow.tsx +
// SecondaryArrow.tsx). Total yang kelihatan di Hero = ARROW_COUNT + 2.
const ARROW_COUNT = 6;
const COLORS = ['#FFD400', '#e4f22e', '#FFD400', '#e4f22e', '#FFD400', '#e4f22e'];

// Titik tengah baris = titik tengah pasangan panah utama (0 dan 0.3 dari
// SecondaryArrow.tsx), supaya 2 panah utama itu benar-benar di TENGAH,
// diapit simetris oleh panah dekoratif.
const CENTER = 0.15;
// Offset tiap panah dekoratif dari CENTER: 3 di kiri (negatif), 3 di
// kanan (positif), jarak antar-panah konsisten (0.6).
const OFFSETS = [-1.8, -1.2, -0.6, 0.6, 1.2, 1.8];

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

  // Posisi "ramai" di Hero: satu baris rapi & sejajar, semua di y=0 dan
  // z=0 (ruang LOKAL shaft utama) - 3 panah di kiri CENTER, 3 di kanan,
  // simetris, dengan pasangan panah utama pas di tengah-tengah barisan.
  // Karena komponen ini di-render sebagai CHILD dari group panah utama
  // (lihat Scene.tsx), baris ini otomatis ikut ter-rotasi BASE_ROTATION
  // yang sama seperti 2 panah utama - jadi benar-benar sejajar, bukan
  // cuma kelihatan sejajar dari satu sudut kamera tertentu.
  const spreads = useMemo<ArrowSpread[]>(() => {
    return OFFSETS.map((offset) => ({
      x: CENTER + offset,
      y: 0,
      z: 0,
    }));
  }, []);

  // Posisi keluar panggung: yang di kiri CENTER geser lebih jauh ke
  // kiri, yang di kanan geser lebih jauh ke kanan - jadi keluarnya
  // "membelah" ke dua arah, sejalan dengan sisi masing-masing di barisan.
  const exits = useMemo<ArrowSpread[]>(() => {
    return spreads.map((s, i) => ({
      x: s.x + (OFFSETS[i] < 0 ? -14 : 14),
      y: 0,
      z: 0,
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
