import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useScrollAnimation } from '../../animations/useScrollAnimation';
import { createShaftLabelTexture } from './shaftLabelTexture';
import { createVaneBrandTexture } from './vaneBrandTexture';

const SHAFT_RADIUS = 0.04;
const SHAFT_LENGTH = 8;
const VANE_COUNT = 3;

const Arrow = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const shaftRef = useRef<THREE.Mesh>(null!);
  const pointRef = useRef<THREE.Mesh>(null!);
  const nockRef = useRef<THREE.Mesh>(null!);
  const vanesRef = useRef<THREE.Group>(null!);

  const labelTexture = useMemo(() => createShaftLabelTexture('GOTECH PURE CARBON'), []);
  const LABEL_LENGTH = 1.4;   // panjang strip di sepanjang shaft (Z)
  const LABEL_RADIUS = SHAFT_RADIUS + 0.002;
  const LABEL_ARC = Math.PI / 2.2;       // lebar tiap band
  const LABEL_THETA_START = -LABEL_ARC / 2;
  const LABEL_COUNT = 3;                  // jumlah band di sekeliling shaft

  const brandTexture = useMemo(() => createVaneBrandTexture('GOTECH'), []);
  const VANE_LENGTH = 0.9;
  const VANE_HEIGHT = 0.16;

  const NOCK_BODY_RADIUS = 0.075;
  const NOCK_PRONG_RADIUS_TOP = 0.028;
  const NOCK_PRONG_RADIUS_BOTTOM = 0.04;
  const NOCK_PRONG_HEIGHT = 0.16;
  const NOCK_PRONG_OFFSET = 0.032;  // jarak tiap prong dari sumbu tengah, bikin celah
  const NOCK_PRONG_SPLAY = 0.18;    // sudut buka prong ke luar, biar seperti "V"


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

  // Profil low-arch ala AAE Max, dibangun dari SplineCurve (Catmull-Rom)
  // yang otomatis melewati semua titik kontrol dengan lengkungan mulus,
  // tanpa patahan di sambungan segmen seperti pendekatan bezier manual.
  const vaneGeometry = useMemo(() => {
    const L = VANE_LENGTH;
    const H = VANE_HEIGHT;

    // titik-titik siluet sisi luar (punggung), dari tip depan ke tip belakang:
    // naik cepat di depan → puncak agak di depan → landai panjang & mulus
    // menurun → meruncing tajam di belakang.
    const outerPoints = [
      new THREE.Vector2(0, L / 2),          // tip depan (di shaft)
      new THREE.Vector2(H * 0.38, L * 0.46),
      new THREE.Vector2(H * 0.82, L * 0.36),
      new THREE.Vector2(H * 1.0, L * 0.2),   // titik puncak tertinggi
      new THREE.Vector2(H * 0.93, L * 0.0),
      new THREE.Vector2(H * 0.72, -L * 0.2),
      new THREE.Vector2(H * 0.42, -L * 0.37),
      new THREE.Vector2(H * 0.16, -L * 0.47),
      new THREE.Vector2(0, -L / 2),          // tip belakang (di shaft)
    ];

    const spline = new THREE.SplineCurve(outerPoints);
    const smoothPoints = spline.getPoints(48); // sampling rapat = mulus, tanpa facet

    const shape = new THREE.Shape();
    shape.moveTo(smoothPoints[0].x, smoothPoints[0].y);
    for (let i = 1; i < smoothPoints.length; i++) {
      shape.lineTo(smoothPoints[i].x, smoothPoints[i].y);
    }
    // sisi dalam (menempel shaft) — garis lurus balik ke tip depan,
    // karena memang menempel rata di permukaan shaft
    shape.lineTo(0, L / 2);

    const geo = new THREE.ShapeGeometry(shape, 1);
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Body nock — barrel yang membesar dari shaft, dibangun dari satu
  // profil lathe (sama seperti pendekatan arrowhead), jadi mulus &
  // menyatu tanpa sambungan.
  const nockBodyGeometry = useMemo(() => {
    const profile = [
      new THREE.Vector2(SHAFT_RADIUS, 0.13),              // embed ke ujung shaft
      new THREE.Vector2(NOCK_BODY_RADIUS * 0.8, 0.07),
      new THREE.Vector2(NOCK_BODY_RADIUS, 0.01),           // bagian terlebar (perut barrel)
      new THREE.Vector2(NOCK_BODY_RADIUS * 0.92, -0.05),
      new THREE.Vector2(NOCK_BODY_RADIUS * 0.68, -0.09),   // leher, tempat prong mulai
    ];
    return new THREE.LatheGeometry(profile, 32);
  }, []);

  // Prong — dua "telinga" pembentuk slot tali busur. Default axis
  // CylinderGeometry sudah di Y, jadi selaras langsung dengan profil
  // lathe di atas tanpa rotasi tambahan.
  const nockProngGeometry = useMemo(
    () =>
      new THREE.CylinderGeometry(
        NOCK_PRONG_RADIUS_TOP,
        NOCK_PRONG_RADIUS_BOTTOM,
        NOCK_PRONG_HEIGHT,
        16
      ),
    []
  );

  return (
    <group ref={groupRef}>
      {/* Shaft asli */}
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

      {/* Label — beberapa band tersebar radial, biar kelihatan dari segala sisi */}
      {Array.from({ length: LABEL_COUNT }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / LABEL_COUNT;
        return (
          <group key={i} rotation-z={angle}>
            <mesh position={[0, 0, 0]} rotation-x={Math.PI / 2}>
              <cylinderGeometry
                args={[
                  LABEL_RADIUS,
                  LABEL_RADIUS,
                  LABEL_LENGTH,
                  32,
                  1,
                  true,
                  LABEL_THETA_START,
                  LABEL_ARC,
                ]}
              />
              <meshStandardMaterial
                map={labelTexture}
                transparent
                roughness={0.4}
                metalness={0.2}
                name={`shaft-label-${i}`}
              />
            </mesh>
          </group>
        );
      })}

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
          const isBrandVane = i === 2;

          return (
            <group key={i} rotation-z={angle}>
              <mesh
                position={[SHAFT_RADIUS, 0, 0]}
                rotation={[Math.PI / 2, 0, 0.2]}
                geometry={vaneGeometry}
              >
                {isBrandVane ? (
                  <meshStandardMaterial
                    map={brandTexture}
                    roughness={0.35}
                    metalness={0}
                    side={THREE.DoubleSide}
                    name={`vane-${i}-brand`}
                  />
                ) : (
                  <meshStandardMaterial
                    color="#FFD400"
                    roughness={0.35}
                    metalness={0}
                    side={THREE.DoubleSide}
                    name={`vane-${i}`}
                  />
                )}
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Nock — group berisi body + 2 prong, di-posisikan & dirotasi sekali
   di level group, biar konsisten dengan konvensi arrowhead */}
      <group ref={nockRef} position={[0, 0, -4]} rotation-x={Math.PI / 2}>
        <mesh geometry={nockBodyGeometry}>
          <meshPhysicalMaterial
            color="#e4f22e"
            transparent
            opacity={0.72}
            roughness={0.15}
            metalness={0}
            clearcoat={0.8}
            clearcoatRoughness={0.1}
            transmission={0.35}
            thickness={0.05}
            name="nock-body"
          />
        </mesh>

        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * NOCK_PRONG_OFFSET, -0.09 - NOCK_PRONG_HEIGHT / 2 + 0.01, 0]}
            rotation-z={side * NOCK_PRONG_SPLAY}
            geometry={nockProngGeometry}
          >
            <meshPhysicalMaterial
              color="#e4f22e"
              transparent
              opacity={0.72}
              roughness={0.15}
              metalness={0}
              clearcoat={0.8}
              clearcoatRoughness={0.1}
              transmission={0.35}
              thickness={0.05}
              name={`nock-prong-${side}`}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default Arrow;