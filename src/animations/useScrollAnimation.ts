// useScrollAnimation.ts
import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Arrow selalu di pose diagonal ini - yang bergerak antar section cuma
// kameranya. Ini mencegah masalah "arrow jadi titik" kalau di-luruskan
// sementara kamera lihat dari sumbu Z negatif.
const BASE_ROTATION = { x: -Math.PI / 4, y: Math.PI / 8, z: 0 };

// Posisi Z lokal tiap bagian saat diam (sesuai geometry di Arrow.tsx)
const PART_Z = {
  shaft: 0,
  point: 4,
  vanes: -3.8,
  nock: -4,
};

export const useScrollAnimation = ({ groupRef, shaftRef, pointRef, nockRef, vanesRef }) => {
  const { camera } = useThree();

  useLayoutEffect(() => {
    if (!groupRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(groupRef.current.rotation, BASE_ROTATION);
      gsap.set(camera.position, { x: 0, y: 0, z: 12 });
      groupRef.current.updateMatrixWorld(true);

      // Ubah titik dalam ruang LOKAL arrow jadi koordinat dunia, supaya
      // tiap shot didefinisikan relatif ke sumbu arrow sendiri - bukan
      // koordinat dunia acak yang harus dihitung manual tiap kali.
      const localToWorld = (x: number, y: number, z: number) =>
        groupRef.current.localToWorld(new THREE.Vector3(x, y, z));

      const target = { x: 0, y: 0, z: 0 };
      const aim = () => camera.lookAt(target.x, target.y, target.z);
      aim();

      // Satu ScrollTrigger per section, trigger-nya elemen section itu
      // sendiri - jadi timing SELALU pas kapan section itu tampil di
      // layar, berapa pun tinggi section-nya. 'top top' -> 'bottom top'
      // dipilih supaya window tiap section pas 1 layar penuh dan
      // BERSAMBUNGAN tanpa tumpang tindih dengan section tetangga
      // (kalau overlap, dua tween akan rebutan properti camera.position
      // yang sama - persis bug yang kita perbaiki sebelumnya).
      const shot = (
        selector: string,
        camLocal: [number, number, number],
        targetLocal: [number, number, number]
      ) => {
        const camWorld = localToWorld(...camLocal);
        const targetWorld = localToWorld(...targetLocal);

        return gsap.timeline({
          scrollTrigger: { trigger: selector, start: 'top top', end: 'bottom top', scrub: 1 },
        })
          .to(camera.position, { x: camWorld.x, y: camWorld.y, z: camWorld.z, onUpdate: aim, ease: 'power1.inOut' }, 0)
          .to(target, { x: targetWorld.x, y: targetWorld.y, z: targetWorld.z, onUpdate: aim, ease: 'power1.inOut' }, 0);
      };

      // 2. BrandStory - orbit dekat ke tengah shaft
      shot('.brand-story', [1.8, 1, PART_Z.shaft + 2.2], [0, 0, PART_Z.shaft]);

      // 3. ProductHighlights - dorong dekat ke ujung point, lalu explode
      shot('.product-highlights', [1.3, 0.7, PART_Z.point + 2.6], [0, 0, PART_Z.point]);
      gsap.timeline({
        scrollTrigger: { trigger: '.product-highlights', start: 'top top', end: 'bottom top', scrub: 1 },
      })
        .fromTo(pointRef.current.position, { z: PART_Z.point }, { z: PART_Z.point + 1.4, ease: 'power1.inOut' }, 0.3)
        .to(pointRef.current.position, { z: PART_Z.point, ease: 'power1.inOut' }, 0.7);

      // 4. Specs - close-up ke vanes dengan sudut miring, sekalian spin explode
      shot('.specs', [-1.6, 0.9, PART_Z.vanes + 2.8], [0, 0, PART_Z.vanes - 0.4]);
      gsap.timeline({
        scrollTrigger: { trigger: '.specs', start: 'top top', end: 'bottom top', scrub: 1 },
      })
        .fromTo(vanesRef.current.position, { z: PART_Z.vanes }, { z: PART_Z.vanes - 1.2, ease: 'power1.inOut' }, 0.3)
        .fromTo(vanesRef.current.rotation, { z: 0 }, { z: Math.PI * 2, ease: 'power1.inOut' }, 0.3)
        .to(vanesRef.current.position, { z: PART_Z.vanes, ease: 'power1.inOut' }, 0.7)
        .to(vanesRef.current.rotation, { z: 0, ease: 'power1.inOut' }, 0.7);

      // 5. Gallery - close-up ke nock
      shot('.gallery', [1.2, 0.6, PART_Z.nock + 2.6], [0, 0, PART_Z.nock]);

      // 6. CTAFooter - tarik mundur ke full showcase view lagi
      gsap.timeline({
        scrollTrigger: { trigger: '.cta-footer', start: 'top top', end: 'center top', scrub: 1 },
      })
        .to(camera.position, { x: 0, y: 0, z: 12, onUpdate: aim, ease: 'power1.inOut' }, 0)
        .to(target, { x: 0, y: 0, z: 0, onUpdate: aim, ease: 'power1.inOut' }, 0);
    });

    return () => ctx.revert();
  }, [groupRef, shaftRef, pointRef, nockRef, vanesRef, camera]);
};