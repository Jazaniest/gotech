// useScrollAnimation.ts
import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useBreakpoint } from '../lib/useBreakpoint';

interface UseScrollAnimationProps {
  groupRef: React.RefObject<THREE.Group>;
  visualsRef: React.RefObject<THREE.Group>;
  shaftRef: React.RefObject<THREE.Mesh>;
  pointRef: React.RefObject<THREE.Mesh>;
  nockRef: React.RefObject<THREE.Mesh>;
  vanesRef: React.RefObject<THREE.Group>;
}

gsap.registerPlugin(ScrollTrigger);

// Arrow selalu tegak vertikal (sumbu Y) - yang bergerak antar section
// cuma kameranya. Vertikal AMAN dari masalah "arrow jadi titik" karena
// itu cuma terjadi kalau arrow disejajarkan ke SUMBU KAMERA (Z, lurus ke
// arah pandang kamera yang ada di z=12 menghadap -Z) - vertikal (Y)
// justru tegak lurus terhadap arah pandang itu, jadi tetap kelihatan
// sebagai garis lurus di layar, bukan titik.
const BASE_ROTATION = { x: -Math.PI / 2, y: 0, z: 0 };

// Posisi Z lokal tiap bagian saat diam (sesuai geometry di Arrow.tsx)
const PART_Z = {
  shaft: 0,
  point: 4,
  vanes: -3.8,
  nock: -4,
};

// Roll kamera per section (radian) - SAMA untuk SEMUA breakpoint,
// karena ini murni soal komposisi/estetika (arah "atas" kamera), bukan
// soal muat/tidaknya di layar (itu urusan CAMERA_CONFIG di bawah).
// Index sejajar sama checkpoints: 0=Hero, 1=BrandStory, 2=ProductHighlights,
// 3=Specs, 4=Nock, 5=CTAFooter.
//
// -Math.PI dipakai (bukan +Math.PI) buat Specs walau hasilnya identik
// (180° sama aja mau positif atau negatif) - supaya transisi dari
// rolls[2] (-90°) ke rolls[3] cuma nempuh 90° (bukan muter 270° kalau
// pakai +Math.PI), jadi putarannya tetap mulus & searah, nggak
// "muter balik" tiba-tiba.
const SPECS_ROLL = -Math.PI;               // 180° - arrow kebalik, jadi "menghadap ke bawah"
const NOCK_ROLL = -Math.PI + Math.PI / 6;   // sedikit lebih miring dari full-flip - nock keliatan agak miring
const rolls = [0, -Math.PI / 2, -Math.PI / 2, SPECS_ROLL, NOCK_ROLL, 0];

// Dua set framing kamera: DESKTOP (angka lama, sudah di-tuning manual)
// dan MOBILE (layar sempit & portrait, jadi kamera ditarik lebih jauh +
// offset lateral dikecilkan supaya arrow yang vertikal & 8 arrow
// dekoratifnya tidak kepotong di tepi layar). Kenapa breakpoint tetap
// (bukan skala proporsional otomatis): tiap checkpoint di sini adalah
// hasil tuning manual yang presisi, jadi lebih aman & predictable kalau
// disediakan 2 set angka yang masing-masing sudah dikalibrasi sendiri,
// ketimbang satu formula yang mesti "menebak" hasil bagus di ukuran
// yang belum pernah dites.
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

// Jarak keluar panggung arrow UTAMA pas exit Gallery -> Pricing (sumbu X
// lokal, menjauh ke KIRI dari center). Nilainya sama dengan EXIT_DISTANCE
// punya panah dekoratif di HeroArrows.tsx, supaya kecepatan "terbang
// keluar" antara arrow utama dan panah dekoratif terasa senada, tiba
// bersamaan pas Gallery selesai / Pricing mulai terpusat.
// const MAIN_EXIT_DISTANCE = { desktop: 14, tablet: 11, mobile: 8 };

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

      // Reset pose lokal tiap part balik ke posisi diam secara EKSPLISIT,
      // bukan cuma dibiarkan menunggu ScrollTrigger merender progress
      // section-nya. Tanpa ini, pointRef/vanesRef bisa "nyangkut" di
      // pose explode-nya kalau ScrollTrigger.refresh() dari LenisScroller
      // (effect di komponen LAIN, timingnya independen) sempat balapan
      // dengan pembuatan trigger di sini - persis penyebab bug "tampilan
      // awal salah, baru benar setelah scroll turun-naik".
      gsap.set(pointRef.current.position, { z: PART_Z.point });
      gsap.set(vanesRef.current.position, { z: PART_Z.vanes });
      gsap.set(vanesRef.current.rotation, { z: 0 });

      groupRef.current.updateMatrixWorld(true);

      // Ubah titik dalam ruang LOKAL arrow jadi koordinat dunia, supaya
      // tiap shot didefinisikan relatif ke sumbu arrow sendiri - bukan
      // koordinat dunia acak yang harus dihitung manual tiap kali.
      const localToWorld = (x: number, y: number, z: number) =>
        groupRef.current.localToWorld(new THREE.Vector3(x, y, z));

      const target = { x: 0, y: 0, z: 0 };
      // Roll kamera - rotasi sumbu "atas" kamera di sekitar arah
      // pandangnya sendiri. Arrow yang vertikal murni (BASE_ROTATION di
      // atas) akan SELALU tampak tegak di layar dari sudut kamera
      // manapun (posisi kamera tidak memengaruhi ini), KECUALI kalau
      // vektor "up" kamera sendiri dimiringkan - itu fungsi roll di sini.
      // roll=0 -> up standar (0,1,0) -> arrow tampak tegak lurus.
      const roll = { value: 0 };
      const aim = () => {
        camera.up.set(Math.sin(roll.value), Math.cos(roll.value), 0);
        camera.lookAt(target.x, target.y, target.z);
      };
      aim();

      // Checkpoint kamera+target di tiap "pemberhentian" scroll, dihitung
      // SEKALI di awal - deterministik, tidak tergantung state runtime.
      // checkpoints[0] = pose awal Hero, checkpoint terakhir = balik lagi
      // ke pose awal itu di CTAFooter. Tiap section men-tween dari
      // checkpoint SEBELUMNYA ke checkpoint miliknya sendiri lewat
      // fromTo() eksplisit, BUKAN to().
      //
      // Kenapa ini penting: to() tidak punya nilai awal eksplisit - GSAP
      // mengambilnya dari state kamera "live" pada saat tween itu pertama
      // kali dirender, yang bisa berbeda-beda tergantung kapan
      // ScrollTrigger.refresh() jalan, seberapa cepat user scroll, dan
      // section mana yang duluan masuk viewport. Karena 5 ScrollTrigger
      // di sini semuanya mengubah camera.position yang SAMA, nilai awal
      // itu gampang "salah tangkap" -> muncul sebagai blink pas scroll
      // turun, dan lebih parah lagi pas scroll naik (tween ditarik mundur
      // ke nilai awal yang sudah salah dari awal). fromTo() dengan
      // checkpoint tetap ini menghilangkan ambiguitas itu sepenuhnya -
      // dari arah manapun discroll, titik awal & akhir tiap section
      // selalu pasti sama.
      const checkpoints = [
        { cam: { x: 0, y: 0, z: config.heroDistance }, target: { x: 0, y: 0, z: 0 } }, // 1. Hero
        {
          cam: localToWorld(config.brandStory.cam[0], config.brandStory.cam[1], config.brandStory.cam[2]),
          target: localToWorld(config.brandStory.target[0], config.brandStory.target[1], config.brandStory.target[2]),
        }, // 2. BrandStory - close-up dekat ke tengah shaft (carbon core)
        {
          cam: localToWorld(config.productHighlights.cam[0], config.productHighlights.cam[1], config.productHighlights.cam[2]),
          target: localToWorld(config.productHighlights.target[0], config.productHighlights.target[1], config.productHighlights.target[2]),
        }, // 3. ProductHighlights - dorong dekat ke ujung point
        {
          cam: localToWorld(config.specs.cam[0], config.specs.cam[1], config.specs.cam[2]),
          target: localToWorld(config.specs.target[0], config.specs.target[1], config.specs.target[2]),
        }, // 4. Specs - close-up ke vanes dengan sudut miring
        {
          cam: localToWorld(config.nock.cam[0], config.nock.cam[1], config.nock.cam[2]),
          target: localToWorld(config.nock.target[0], config.nock.target[1], config.nock.target[2]),
        }, // 5. Nock - close-up ke nock
        { cam: { x: 0, y: 0, z: config.heroDistance }, target: { x: 0, y: 0, z: 0 } }, // 6. CTAFooter - balik ke pose awal
      ];

      // Satu ScrollTrigger per section, trigger-nya elemen section itu
      // sendiri - jadi timing SELALU pas kapan section itu tampil di
      // layar, berapa pun tinggi section-nya. 'top top' -> 'bottom top'
      // dipilih supaya window tiap section pas 1 layar penuh dan
      // BERSAMBUNGAN tanpa tumpang tindih dengan section tetangga.
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

      // PENTING: tiap transisi kamera sekarang terjadi SELAMA scroll
      // section SEBELUMNYA, bukan section tujuannya sendiri. Alasannya:
      // section N baru terpusat penuh di layar tepat saat progress trigger
      // section N == 0 (top-nya pas di top viewport). Kalau transisi ke
      // pose section N dipasang di trigger section N sendiri, pose itu
      // baru SELESAI di progress==1 - yaitu pas section N sudah mulai
      // digantikan section N+1. Jadinya pose section N cuma kelihatan
      // sesaat sebelum tergantikan, bukan saat section N sedang dibaca.
      // Dengan memasang transisi di trigger section SEBELUMNYA, pose
      // section N sudah 100% tercapai sejak section N mulai terpusat.

      // Hero -> BrandStory (shaft)
      shot('.hero', checkpoints[0], checkpoints[1], rolls[0], rolls[1]);

      // BrandStory -> ProductHighlights (point)
      shot('.brand-story', checkpoints[1], checkpoints[2], rolls[1], rolls[2]);

      // ProductHighlights -> Specs (vanes), sekalian point explode SELAMA
      // ProductHighlights masih terlihat di layar
      shot('.product-highlights', checkpoints[2], checkpoints[3], rolls[2], rolls[3]);
      gsap.timeline({
        scrollTrigger: { trigger: '.product-highlights', start: 'top top', end: 'bottom top', scrub: true },
      })
        .fromTo(pointRef.current.position, { z: PART_Z.point }, { z: PART_Z.point + 1.4, ease: 'power1.inOut', immediateRender: false }, 0.3)
        .to(pointRef.current.position, { z: PART_Z.point, ease: 'power1.inOut' }, 0.8);

      // Specs -> Nock, sekalian vane spin SELAMA Specs masih
      // terlihat di layar. Cuma BERPUTAR di tempat (rotation.z), TIDAK
      // digeser posisinya - supaya tetap nempel di shaft, tidak
      // kelihatan "copot"/lepas seperti sebelumnya.
      shot('.specs', checkpoints[3], checkpoints[4], rolls[3], rolls[4]);
      gsap.timeline({
        scrollTrigger: { trigger: '.specs', start: 'top top', end: 'bottom top', scrub: true },
      })
        .fromTo(vanesRef.current.rotation, { z: 0 }, { z: Math.PI * 2, ease: 'power1.inOut', immediateRender: false }, 0.3)
        .to(vanesRef.current.rotation, { z: 0, ease: 'power1.inOut' }, 0.8);

      // Nock -> CTAFooter (balik ke pose awal / full showcase view)
      shot('.nock', checkpoints[4], checkpoints[5], rolls[4], rolls[5]);

      // Refresh + render langsung DI SINI, setelah semua trigger di atas
      // selesai dibuat - jangan cuma mengandalkan refresh() dari
      // LenisScroller yang jalan di effect komponen lain (bisa beda
      // urutan/race). Ini memastikan pose section-section di bawah Hero
      // sudah benar SEJAK render pertama, tanpa perlu scroll turun-naik.
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [groupRef, shaftRef, pointRef, nockRef, vanesRef, camera, breakpoint]);
};
