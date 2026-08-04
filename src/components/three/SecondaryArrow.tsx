import { useRef } from 'react';
import type * as THREE from 'three';
import DecorativeArrow from './DecorativeArrow';
import { useSecondaryArrowAnimation } from '../../animations/useSecondaryArrowAnimation';

interface SecondaryArrowProps {
  xOffset?: number;
  yOffset?: number;
  zOffset?: number;
}

// Panah "utama" kedua. Bentuknya identik dengan Arrow.tsx (dipinjam lewat
// DecorativeArrow yang memang dibuat sama persis), tapi tanpa animasi
// "explode" per-bagian - panah ini cuma butuh posisi (offset ke samping)
// dan rotasi (tegak di Hero, lalu 180° di section berikutnya), makanya
// cukup satu group ref lewat useSecondaryArrowAnimation. Vanes-nya juga
// punya ref sendiri (vanesRef) supaya bisa ikut spin di section Specs,
// sama seperti vane arrow utama.
//
// xOffset/yOffset/zOffset SENGAJA kecil (bukan beberapa unit) karena
// panah ini adalah child dari group arrow utama (lihat Arrow.tsx ->
// {children}) yang kameranya zoom SANGAT dekat (jarak ~1.2-3 unit) ke
// bagian-bagian tertentu di tiap section (BrandStory paling dekat, ~1.2
// unit). Kalau offset-nya besar, dia bakal jatuh di luar frame begitu
// kamera zoom rapat - offset kecil ini memastikan dia tetap kelihatan
// sejajar di sisi shaft di SEMUA section, bukan cuma pas kamera masih
// jauh (Hero). Ketiga offset ini dalam ruang LOKAL shaft utama (X =
// menyamping dari shaft, Y = naik/turun, Z = maju/mundur sepanjang
// shaft), jadi bisa dikombinasikan bebas buat atur posisi relatifnya.
const SecondaryArrow = ({ xOffset = 0.3, yOffset = 0, zOffset = 0 }: SecondaryArrowProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const vanesRef = useRef<THREE.Group>(null!);

  useSecondaryArrowAnimation({ groupRef, vanesRef, xOffset, yOffset, zOffset });

  return <DecorativeArrow ref={groupRef} vanesRef={vanesRef} color="#e4f22e" />;
};

export default SecondaryArrow;
