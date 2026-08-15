import { useRef } from 'react';
import * as THREE from 'three';
import { useScrollAnimation } from '../../animations/useScrollAnimation';
import {
  SHAFT_RADIUS,
  VANE_COUNT,
  LABEL_COUNT,
  NOCK_PRONG_OFFSET,
  NOCK_PRONG_SPLAY,
  sharedLabelTexture,
  sharedBrandTexture,
  shaftGeometry,
  labelGeometry,
  pointGeometry,
  vaneGeometry,
  nockBodyGeometry,
  nockProngGeometry,
} from './arrowAssets';
import type { ArrowProps } from '../../types/components/three/Arrow';

const Arrow = ({ children }: ArrowProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const shaftRef = useRef<THREE.Mesh>(null!);
  const pointRef = useRef<THREE.Mesh>(null!);
  const nockRef = useRef<THREE.Mesh>(null!);
  const vanesRef = useRef<THREE.Group>(null!);
  const visualsRef = useRef<THREE.Group>(null!);

  useScrollAnimation({ groupRef, visualsRef, shaftRef, pointRef, nockRef, vanesRef });

  return (
    <group ref={groupRef}>
      <group ref={visualsRef}>
      {/* Shaft asli */}
      <mesh ref={shaftRef} position={[0, 0, 0]} rotation-x={Math.PI / 2} geometry={shaftGeometry}>
        <meshPhysicalMaterial
          color="#1b1c1f"
          roughness={0.35}
          metalness={0.6}
          clearcoat={0.5}
          clearcoatRoughness={0.25}
          name="shaft"
        />
      </mesh>

      {Array.from({ length: LABEL_COUNT }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / LABEL_COUNT;
        return (
          <group key={i} rotation-z={angle}>
            <mesh position={[0, 0, 0]} rotation-x={Math.PI / 2} geometry={labelGeometry}>
              <meshStandardMaterial
                map={sharedLabelTexture}
                transparent
                roughness={0.4}
                metalness={0.2}
                name={`shaft-label-${i}`}
              />
            </mesh>
          </group>
        );
      })}

      <mesh
        ref={pointRef}
        position={[0, 0, 4]}
        rotation-x={Math.PI / 2}
        geometry={pointGeometry}
      >
        <meshPhysicalMaterial color="#d9dbe0" roughness={0.15} metalness={1} name="point" />
      </mesh>

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
                    map={sharedBrandTexture}
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
            name="nock-body"
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
              name={`nock-prong-${side}`}
            />
          </mesh>
        ))}
      </group>
      </group>

      {children}
    </group>
  );
};

export default Arrow;
