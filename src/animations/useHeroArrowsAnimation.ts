// useHeroArrowsAnimation.ts
import { useLayoutEffect } from 'react';
import type * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BASE_ROTATION = { x: -Math.PI / 4, y: Math.PI / 8, z: 0 };

export interface ArrowSpread {
  x: number;
  y: number;
  z: number;
}

interface UseHeroArrowsAnimationProps {
  refs: React.RefObject<THREE.Group | null>[];
  // Posisi "ramai" di Hero — semua panah berkumpul & tersebar di dekat panah utama.
  spreads: ArrowSpread[];
  // Posisi keluar panggung, minggir ke kiri/kanan, dipakai selama section tengah.
  exits: ArrowSpread[];
}

// Mengatur panah-panah dekoratif di Hero:
// 1) Tampil "ramai" tersebar di sekitar panah utama saat Hero pertama kali dilihat.
// 2) Selama Hero discroll, tiap panah minggir ke kiri/kanan dan mengecil ke 0 —
//    supaya section BrandStory..Gallery cuma menyisakan SATU panah utama.
// 3) Selama section Gallery (section terakhir sebelum CTA/pricing), semua panah
//    dekoratif ini balik & menyatu lagi ke tengah, tiba bersamaan saat CTAFooter mulai.
export const useHeroArrowsAnimation = ({ refs, spreads, exits }: UseHeroArrowsAnimationProps) => {
  useLayoutEffect(() => {
    if (refs.some((r) => !r.current)) return;

    const ctx = gsap.context(() => {
      refs.forEach((ref, i) => {
        const group = ref.current;
        if (!group) return;

        const spread = spreads[i];
        const exit = exits[i];

        // Pose awal: berkumpul ramai di Hero.
        gsap.set(group.position, { x: spread.x, y: spread.y, z: spread.z });
        gsap.set(group.position, { x: spread.x, y: spread.y, z: spread.z });
        gsap.set(group.rotation, BASE_ROTATION);
        gsap.set(group.scale, { x: 1, y: 1, z: 1 });

        // Hero discroll -> tiap panah minggir ke kiri/kanan sambil mengecil,
        // sampai habis (scale ~0) pas Hero selesai. Dari sini sampai akhir
        // Specs, mereka diam di posisi exit (tak ada trigger lain yang ubah).
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

        // Section Gallery (sesaat sebelum CTAFooter/"pricing") -> semua
        // panah dekoratif balik menyatu ke tengah & membesar lagi, tiba
        // bersamaan pas CTAFooter mulai kelihatan.
        gsap.timeline({
          scrollTrigger: {
            trigger: '.gallery',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }).to(
          group.position,
          { x: 0, y: 0, z: spread.z, ease: 'power1.out' },
          0
        ).to(
          group.scale,
          { x: 0.85, y: 0.85, z: 0.85, ease: 'power1.out' },
          0
        );
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [refs, spreads, exits]);
};
