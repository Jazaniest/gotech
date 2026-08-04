// useSecondaryArrowAnimation.ts
import { useLayoutEffect } from 'react';
import type * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseSecondaryArrowAnimationProps {
  groupRef: React.RefObject<THREE.Group | null>;
  vanesRef: React.RefObject<THREE.Group | null>;
  // Offset di ruang LOKAL shaft utama, biar tidak numpuk/clipping.
  // X = menyamping dari shaft, Y = naik/turun, Z = maju/mundur sepanjang shaft.
  xOffset: number;
  yOffset: number;
  zOffset: number;
}

// Panah kedua ini di-render sebagai CHILD dari group panah utama
// (lihat Arrow.tsx -> {children}), jadi dia otomatis mewarisi
// BASE_ROTATION & seluruh transform panah utama - selalu "nempel" di
// sisi shaft ke mana pun kamera orbit antar section, persis kayak
// panah utama, bukan diam di world-space kayak DecorativeArrow yang
// jadi kelihatan "kabur/keluar" pas kamera zoom dekat.
//
// Karena itu, rotasi di sini HANYA rotasi lokal TAMBAHAN di atas rotasi
// parent - bukan set ulang BASE_ROTATION (kalau di-set ulang, rotasinya
// akan dobel/miring).
//
// Timeline rotasi lokal Y (grup utuh panah kedua):
// 1. Hero (0)                -> tegak, identik arrow utama.
// 2. Hero discroll ke BrandStory -> 180°, jadi berlawanan arah arrow utama.
// 3. BrandStory discroll ke ProductHighlights -> balik ke 0°, searah lagi
//    dengan arrow utama, dan tetap begitu sampai section terakhir.
//
// Transisi #3 SENGAJA dipasang di trigger '.brand-story' (section
// SEBELUM ProductHighlights), bukan '.product-highlights' sendiri -
// mengikuti konvensi yang sama seperti transisi kamera di
// useScrollAnimation.ts: supaya pose "searah lagi" itu sudah 100%
// tercapai SEJAK ProductHighlights mulai terpusat di layar, bukan baru
// selesai pas ProductHighlights sudah mau habis.
//
// Vane spin di section Specs: sama seperti vane arrow utama, CUMA
// berputar di tempat (rotation.z), TIDAK digeser posisinya - supaya
// tetap nempel di shaft, tidak kelihatan "copot".
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

      // Hero -> BrandStory: 0 -> 180°
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
        { y: Math.PI, ease: 'power1.inOut' },
        0
      );

      // BrandStory -> ProductHighlights: 180° -> 0° (balik searah arrow utama)
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
        { y: Math.PI * 2, ease: 'power1.inOut' },
        0
      );

      // Specs: vane spin di tempat, sinkron sama arrow utama
      if (vanesRef.current) {
        gsap.timeline({
          scrollTrigger: { trigger: '.specs', start: 'top top', end: 'bottom top', scrub: true },
        })
          .fromTo(vanesRef.current.rotation, { z: 0 }, { z: Math.PI * 2, ease: 'power1.inOut' }, 0.3)
          .to(vanesRef.current.rotation, { z: 0, ease: 'power1.inOut' }, 0.8);
      }

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [groupRef, vanesRef, xOffset, yOffset, zOffset]);
};
