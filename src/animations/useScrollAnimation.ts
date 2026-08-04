// useScrollAnimation.ts
import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';


interface UseScrollAnimationProps {
  groupRef: React.RefObject<THREE.Group>;
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

export const useScrollAnimation = ({ groupRef, shaftRef, pointRef, nockRef, vanesRef }: UseScrollAnimationProps) => {
  const { camera } = useThree();

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(groupRef.current.rotation, BASE_ROTATION);
      gsap.set(camera.position, { x: 0, y: 0, z: 12 });

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
      // Roll kamera per section (radian). Cuma BrandStory yang diisi -
      // supaya SEKILAS PANDANG arrow-nya kelihatan MIRING dari pojok
      // kiri-atas ke kanan-bawah (sesuai request), padahal arrow-nya
      // sendiri tetap tegak lurus vertikal (tidak diubah rotasinya).
      // Section lain roll=0 (kembali tegak), jadi transisinya otomatis
      // muter balik ke tegak begitu BrandStory discroll lewat.
      // const BRAND_STORY_ROLL = ;
      const rolls = [0, -Math.PI / 2, -Math.PI / 2, 0, 0, 0];

      const checkpoints = [
        { cam: { x: 0, y: 0, z: 12 }, target: { x: 0, y: 0, z: 0 } }, // 1. Hero
        {
          cam: localToWorld(0.7, 0.4, PART_Z.shaft + 0.9),
          target: localToWorld(0.2, -0.2, PART_Z.shaft),
        }, // 2. BrandStory - close-up dekat ke tengah shaft (carbon core)
        {
          cam: localToWorld(1.3, 0.7, PART_Z.point + 2.6),
          target: localToWorld(0, 0, PART_Z.point),
        }, // 3. ProductHighlights - dorong dekat ke ujung point
        {
          cam: localToWorld(-1.6, 0.9, PART_Z.vanes + 2.8),
          target: localToWorld(0, 0, PART_Z.vanes - 0.4),
        }, // 4. Specs - close-up ke vanes dengan sudut miring
        {
          cam: localToWorld(1.2, 0.6, PART_Z.nock + 2.6),
          target: localToWorld(0, 0, PART_Z.nock),
        }, // 5. Gallery - close-up ke nock
        { cam: { x: 0, y: 0, z: 12 }, target: { x: 0, y: 0, z: 0 } }, // 6. CTAFooter - balik ke pose awal
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
        .fromTo(pointRef.current.position, { z: PART_Z.point }, { z: PART_Z.point + 1.4, ease: 'power1.inOut' }, 0.3)
        .to(pointRef.current.position, { z: PART_Z.point, ease: 'power1.inOut' }, 0.8);

      // Specs -> Gallery (nock), sekalian vane spin SELAMA Specs masih
      // terlihat di layar. Cuma BERPUTAR di tempat (rotation.z), TIDAK
      // digeser posisinya - supaya tetap nempel di shaft, tidak
      // kelihatan "copot"/lepas seperti sebelumnya.
      shot('.specs', checkpoints[3], checkpoints[4], rolls[3], rolls[4]);
      gsap.timeline({
        scrollTrigger: { trigger: '.specs', start: 'top top', end: 'bottom top', scrub: true },
      })
        .fromTo(vanesRef.current.rotation, { z: 0 }, { z: Math.PI * 2, ease: 'power1.inOut' }, 0.3)
        .to(vanesRef.current.rotation, { z: 0, ease: 'power1.inOut' }, 0.8);

      // Gallery -> CTAFooter (balik ke pose awal / full showcase view)
      shot('.gallery', checkpoints[4], checkpoints[5], rolls[4], rolls[5]);

      // Refresh + render langsung DI SINI, setelah semua trigger di atas
      // selesai dibuat - jangan cuma mengandalkan refresh() dari
      // LenisScroller yang jalan di effect komponen lain (bisa beda
      // urutan/race). Ini memastikan pose section-section di bawah Hero
      // sudah benar SEJAK render pertama, tanpa perlu scroll turun-naik.
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [groupRef, shaftRef, pointRef, nockRef, vanesRef, camera]);
};