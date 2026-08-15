import { forwardRef, useMemo } from 'react';
import * as THREE from 'three';
import { createShaftLabelTexture } from './shaftLabelTexture';
import { createVaneBrandTexture } from './vaneBrandTexture';
import {
  SHAFT_RADIUS,
  VANE_COUNT,
  LABEL_COUNT,
  NOCK_PRONG_OFFSET,
  NOCK_PRONG_SPLAY,
  DEFAULT_BRAND_LABEL,
  DEFAULT_VANE_LABEL,
  sharedLabelTexture,
  sharedBrandTexture,
  shaftGeometry,
  labelGeometry,
  pointGeometry,
  vaneGeometry,
  nockBodyGeometry,
  nockProngGeometry,
} from './arrowAssets';

interface DecorativeArrowProps {
  brandLabel?: string;
  color?: string;
  vanesRef?: React.RefObject<THREE.Group | null>;
}

const DecorativeArrow = forwardRef<THREE.Group, DecorativeArrowProps>(
  ({ brandLabel = DEFAULT_BRAND_LABEL, color = '#FFD400', vanesRef }, ref) => {
    const isDefaultLabel = brandLabel === DEFAULT_BRAND_LABEL;

    const labelTexture = useMemo(
      () => (isDefaultLabel ? sharedLabelTexture : createShaftLabelTexture(brandLabel)),
      [isDefaultLabel, brandLabel]
    );
    const brandTexture = useMemo(
      () => (isDefaultLabel ? sharedBrandTexture : createVaneBrandTexture(DEFAULT_VANE_LABEL)),
      [isDefaultLabel]
    );

    return (
      <group ref={ref}>
        {/* Shaft */}
        <mesh position={[0, 0, 0]} rotation-x={Math.PI / 2} geometry={shaftGeometry}>
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
            <group key={i} rotation-z={angle}>
              <mesh position={[0, 0, 0]} rotation-x={Math.PI / 2} geometry={labelGeometry}>
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

        {/* Arrowhead */}
        <mesh position={[0, 0, 4]} rotation-x={Math.PI / 2} geometry={pointGeometry}>
          <meshPhysicalMaterial color="#d9dbe0" roughness={0.15} metalness={1} />
        </mesh>

        {/* Vanes */}
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
            />
          </mesh>

          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[side * NOCK_PRONG_OFFSET, -0.09 - 0.16 / 2 + 0.01, 0]}
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
