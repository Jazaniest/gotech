import { forwardRef, useMemo } from 'react';
import * as THREE from 'three';
import { createShaftLabelTexture } from './shaftLabelTexture';
import { createVaneBrandTexture } from './vaneBrandTexture';

// Bentuk & material di sini SENGAJA disalin persis dari Arrow.tsx (bukan
// disederhanakan) supaya panah dekoratif di Hero identik bentuknya dengan
// panah utama. Bedanya cuma: tidak ada ref per-bagian (shaft/point/vanes/
// nock) karena panah dekoratif ini tidak butuh animasi "explode" seperti
// panah utama — cuma digerakkan sebagai satu kesatuan lewat group terluar
// (lihat useHeroArrowsAnimation.ts).
const SHAFT_RADIUS = 0.04;
const SHAFT_LENGTH = 8;
const VANE_COUNT = 3;

interface DecorativeArrowProps {
  brandLabel?: string;
  color?: string;
}

const DecorativeArrow = forwardRef<THREE.Group, DecorativeArrowProps>(
  ({ brandLabel = 'GOTECH', color = '#FFD400' }, ref) => {
    const labelTexture = useMemo(() => createShaftLabelTexture(brandLabel), [brandLabel]);
    const LABEL_LENGTH = 1.4;
    const LABEL_RADIUS = SHAFT_RADIUS + 0.002;
    const LABEL_ARC = Math.PI / 2.2;
    const LABEL_THETA_START = -LABEL_ARC / 2;
    const LABEL_COUNT = 1;

    const brandTexture = useMemo(() => createVaneBrandTexture(brandLabel), [brandLabel]);
    const VANE_LENGTH = 0.9;
    const VANE_HEIGHT = 0.16;

    const NOCK_BODY_RADIUS = 0.075;
    const NOCK_PRONG_RADIUS_TOP = 0.028;
    const NOCK_PRONG_RADIUS_BOTTOM = 0.04;
    const NOCK_PRONG_HEIGHT = 0.16;
    const NOCK_PRONG_OFFSET = 0.032;
    const NOCK_PRONG_SPLAY = 0.18;

    // Arrowhead — satu profil lathe di-revolve 360°, sama seperti Arrow.tsx.
    const pointGeometry = useMemo(() => {
      const profile = [
        new THREE.Vector2(SHAFT_RADIUS, -0.15),
        new THREE.Vector2(SHAFT_RADIUS * 1.15, 0.0),
        new THREE.Vector2(SHAFT_RADIUS * 0.7, 0.2),
        new THREE.Vector2(0.0, 0.42),
      ];
      return new THREE.LatheGeometry(profile, 32);
    }, []);

    // Vane — profil low-arch dari SplineCurve, sama seperti Arrow.tsx.
    const vaneGeometry = useMemo(() => {
      const L = VANE_LENGTH;
      const H = VANE_HEIGHT;

      const outerPoints = [
        new THREE.Vector2(0, L / 2),
        new THREE.Vector2(H * 0.38, L * 0.46),
        new THREE.Vector2(H * 0.82, L * 0.36),
        new THREE.Vector2(H * 1.0, L * 0.2),
        new THREE.Vector2(H * 0.93, L * 0.0),
        new THREE.Vector2(H * 0.72, -L * 0.2),
        new THREE.Vector2(H * 0.42, -L * 0.37),
        new THREE.Vector2(H * 0.16, -L * 0.47),
        new THREE.Vector2(0, -L / 2),
      ];

      const spline = new THREE.SplineCurve(outerPoints);
      const smoothPoints = spline.getPoints(48);

      const shape = new THREE.Shape();
      shape.moveTo(smoothPoints[0].x, smoothPoints[0].y);
      for (let i = 1; i < smoothPoints.length; i++) {
        shape.lineTo(smoothPoints[i].x, smoothPoints[i].y);
      }
      shape.lineTo(0, L / 2);

      const geo = new THREE.ShapeGeometry(shape, 1);
      geo.computeVertexNormals();
      return geo;
    }, []);

    // Nock body — satu profil lathe, sama seperti Arrow.tsx.
    const nockBodyGeometry = useMemo(() => {
      const profile = [
        new THREE.Vector2(SHAFT_RADIUS, 0.13),
        new THREE.Vector2(NOCK_BODY_RADIUS * 0.8, 0.07),
        new THREE.Vector2(NOCK_BODY_RADIUS, 0.01),
        new THREE.Vector2(NOCK_BODY_RADIUS * 0.92, -0.05),
        new THREE.Vector2(NOCK_BODY_RADIUS * 0.68, -0.09),
      ];
      return new THREE.LatheGeometry(profile, 32);
    }, []);

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
      <group ref={ref}>
        {/* Shaft */}
        <mesh position={[0, 0, 0]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_LENGTH, 32]} />
          <meshPhysicalMaterial
            color="#1b1c1f"
            roughness={0.35}
            metalness={0.6}
            clearcoat={0.5}
            clearcoatRoughness={0.25}
          />
        </mesh>

        {/* Label */}
        {Array.from({ length: LABEL_COUNT }).map((_, i) => {
          const angle = (i * 2 * Math.PI) / LABEL_COUNT;
          return (
            <mesh key={i} position={[0, 0, 0]} rotation-x={Math.PI / 2} rotation-z={angle}>
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
              />
            </mesh>
          );
        })}

        {/* Arrowhead */}
        <mesh position={[0, 0, 4]} rotation-x={Math.PI / 2} geometry={pointGeometry}>
          <meshPhysicalMaterial color="#d9dbe0" roughness={0.15} metalness={1} />
        </mesh>

        {/* Vanes */}
        <group position={[0, 0, -3.8]}>
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
                    />
                  ) : (
                    <meshStandardMaterial
                      color={color}
                      roughness={0.35}
                      metalness={0}
                      side={THREE.DoubleSide}
                    />
                  )}
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Nock */}
        <group position={[0, 0, -4]} rotation-x={Math.PI / 2}>
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
              />
            </mesh>
          ))}
        </group>
      </group>
    );
  }
);

DecorativeArrow.displayName = 'DecorativeArrow';

export default DecorativeArrow;
