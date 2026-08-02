import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useScrollAnimation } from '../../animations/useScrollAnimation';

const SHAFT_RADIUS = 0.04;
const SHAFT_LENGTH = 8;
const VANE_COUNT = 3;
const VANE_LENGTH = 0.9;
const VANE_WIDTH = 0.22;

const Arrow = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const shaftRef = useRef<THREE.Mesh>(null!);
  const pointRef = useRef<THREE.Mesh>(null!);
  const nockRef = useRef<THREE.Mesh>(null!);
  const vanesRef = useRef<THREE.Group>(null!);

  useScrollAnimation({ groupRef, shaftRef, pointRef, nockRef, vanesRef });

  // Arrowhead sebagai SATU profil lathe yang di-revolve 360° —
  // menyatu dengan shaft tanpa sambungan/gap, bukan kerucut terpisah
  // dengan radius yang tiba-tiba lompat dari 0.04 ke 0.15.
  const pointGeometry = useMemo(() => {
    const profile = [
      new THREE.Vector2(SHAFT_RADIUS, -0.15),        // masuk/embed ke ujung shaft
      new THREE.Vector2(SHAFT_RADIUS * 1.15, 0.0),    // bahu, cuma sedikit lebih lebar dari shaft
      new THREE.Vector2(SHAFT_RADIUS * 0.7, 0.2),
      new THREE.Vector2(0.0, 0.42),                   // ujung lancip
    ];
    return new THREE.LatheGeometry(profile, 32);
  }, []);

  // Plane vane dengan sedikit lengkungan di sepanjang panjangnya,
  // biar terlihat seperti fletching asli, bukan bidang datar kaku.
  const vaneGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(VANE_WIDTH, VANE_LENGTH, 1, 12);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const t = pos.getY(i) / (VANE_LENGTH / 2); // -1..1 sepanjang vane
      pos.setX(i, pos.getX(i) + Math.sin(t * Math.PI * 0.5) * 0.05);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Shaft — panjangnya sekarang mengikuti sumbu Z (arah panjang
         arrow), bukan Y, jadi benar-benar segaris dengan tip & nock. */}
      <mesh ref={shaftRef} position={[0, 0, 0]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_LENGTH, 32]} />
        <meshPhysicalMaterial
          color="#1b1c1f"
          roughness={0.35}
          metalness={0.6}
          clearcoat={0.5}
          clearcoatRoughness={0.25}
          name="shaft"
        />
      </mesh>

      {/* Arrowhead — posisi z tetap 4, sama seperti sebelumnya, jadi
         timeline scroll di useScrollAnimation.ts tidak perlu diubah. */}
      <mesh
        ref={pointRef}
        position={[0, 0, 4]}
        rotation-x={Math.PI / 2}
        geometry={pointGeometry}
      >
        <meshPhysicalMaterial color="#d9dbe0" roughness={0.15} metalness={1} name="point" />
      </mesh>

      {/* Vanes — sekarang tiap vane punya group sendiri buat penempatan
         radial (rotation-z) di sekeliling shaft, sementara mesh di
         dalamnya diputar rotation-x agar sisi panjangnya mengikuti Z,
         bukan cuma berputar datar di satu titik. */}
      <group ref={vanesRef} position={[0, 0, -3.8]}>
        {Array.from({ length: VANE_COUNT }).map((_, i) => {
          const angle = (i * 2 * Math.PI) / VANE_COUNT;
          return (
            <group key={i} rotation-z={angle}>
              <mesh
                position={[SHAFT_RADIUS + VANE_WIDTH / 2, 0, 0]}
                rotation={[Math.PI / 2, 0, 0.2]}
                geometry={vaneGeometry}
              >
                <meshStandardMaterial
                  color="#FFD400"
                  roughness={0.35}
                  metalness={0}
                  side={THREE.DoubleSide}
                  name={`vane-${i}`}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Nock — torus secara default sudah "ring di bidang XY, lubang
         menghadap Z", jadi ini bagian yang dari awal SUDAH benar,
         tidak perlu rotation tambahan. */}
      <mesh ref={nockRef} position={[0, 0, -4]}>
        <torusGeometry args={[0.05, 0.015, 16, 32]} />
        <meshStandardMaterial color="#FFD400" roughness={0.3} metalness={0.1} name="nock" />
      </mesh>
    </group>
  );
};

export default Arrow;