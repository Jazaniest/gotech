// useHeroArrowsAnimation.ts
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
  // Posisi "ramai" di Hero — semua panah berbaris rapi & sejajar dengan panah utama.
  spreads: ArrowSpread[];
  // Posisi keluar panggung, dipakai selama section tengah.
  exits: ArrowSpread[];
}

// Mengatur panah-panah dekoratif di Hero. Komponen ini di-render sebagai
// CHILD dari group panah utama (lihat Arrow.tsx -> {children} dan
// Scene.tsx), jadi rotasi di sini TIDAK di-set lagi (BASE_ROTATION sudah
// otomatis diwarisi dari parent) - kalau di-set ulang di sini, rotasinya
// akan dobel/miring. Posisi (spreads/exits) juga dalam ruang LOKAL yang
// sama seperti panah utama, jadi baris panah selalu sejajar sempurna ke
// mana pun kamera orbit, bukan cuma sejajar dari satu sudut tertentu.
//
// 1) Tampil "ramai" berbaris rapi di sekitar panah utama saat Hero pertama kali dilihat.
// 2) Selama Hero discroll, semua panah geser keluar & mengecil ke 0 —
//    supaya section BrandStory..Gallery cuma menyisakan panah utama & panah kedua.
// 3) Selama section Nock (sesaat sebelum Gallery/Pricing/CTAFooter), semua panah
//    dekoratif ini balik & menyatu lagi ke baris semula, tiba bersamaan saat section Nock berakhir.
export const useHeroArrowsAnimation = ({ refs, spreads, exits }: UseHeroArrowsAnimationProps) => {
  useLayoutEffect(() => {
    if (refs.some((r) => !r.current)) return;

    const ctx = gsap.context(() => {
      refs.forEach((ref, i) => {
        const group = ref.current;
        if (!group) return;

        const spread = spreads[i];
        const exit = exits[i];

        // Pose awal: berbaris rapi di Hero.
        gsap.set(group.position, { x: spread.x, y: spread.y, z: spread.z });
        gsap.set(group.rotation, { x: 0, y: 0, z: 0 });
        gsap.set(group.scale, { x: 1, y: 1, z: 1 });

        // Hero discroll -> tiap panah geser keluar sambil mengecil,
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

        // Section Nock (sesaat sebelum Gallery/Pricing/CTAFooter) -> semua
        // panah dekoratif balik menyatu ke baris semula & membesar lagi,
        // tiba bersamaan pas section Nock berakhir.
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
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [refs, spreads, exits]);
};
