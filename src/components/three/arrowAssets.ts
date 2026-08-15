import * as THREE from 'three';
import { createShaftLabelTexture } from './shaftLabelTexture';
import { createVaneBrandTexture } from './vaneBrandTexture';

export const SHAFT_RADIUS = 0.04;
export const SHAFT_LENGTH = 8;
export const VANE_COUNT = 3;
export const LABEL_COUNT = 3;

const LABEL_LENGTH = 1.4;
const LABEL_RADIUS = SHAFT_RADIUS + 0.002;
const LABEL_ARC = Math.PI / 2.2;
const LABEL_THETA_START = -LABEL_ARC / 2;

const VANE_LENGTH = 0.9;
const VANE_HEIGHT = 0.16;

const NOCK_BODY_RADIUS = 0.075;
const NOCK_PRONG_RADIUS_TOP = 0.028;
const NOCK_PRONG_RADIUS_BOTTOM = 0.04;
const NOCK_PRONG_HEIGHT = 0.16;
export const NOCK_PRONG_OFFSET = 0.032;
export const NOCK_PRONG_SPLAY = 0.18;

export const DEFAULT_BRAND_LABEL = 'GOTECH PURE CARBON';
export const DEFAULT_VANE_LABEL = 'GOTECH';
export const sharedLabelTexture = createShaftLabelTexture(DEFAULT_BRAND_LABEL);
export const sharedBrandTexture = createVaneBrandTexture(DEFAULT_VANE_LABEL);

export const shaftGeometry = new THREE.CylinderGeometry(SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_LENGTH, 32);

export const labelGeometry = new THREE.CylinderGeometry(
  LABEL_RADIUS,
  LABEL_RADIUS,
  LABEL_LENGTH,
  32,
  1,
  true,
  LABEL_THETA_START,
  LABEL_ARC
);

export const pointGeometry = new THREE.LatheGeometry(
  [
    new THREE.Vector2(SHAFT_RADIUS, -0.15),
    new THREE.Vector2(SHAFT_RADIUS * 1.15, 0.0),
    new THREE.Vector2(SHAFT_RADIUS * 0.7, 0.2),
    new THREE.Vector2(0.0, 0.42),
  ],
  32
);

export const vaneGeometry = (() => {
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
})();

export const nockBodyGeometry = new THREE.LatheGeometry(
  [
    new THREE.Vector2(SHAFT_RADIUS, 0.13),
    new THREE.Vector2(NOCK_BODY_RADIUS * 0.8, 0.07),
    new THREE.Vector2(NOCK_BODY_RADIUS, 0.01),
    new THREE.Vector2(NOCK_BODY_RADIUS * 0.92, -0.05),
    new THREE.Vector2(NOCK_BODY_RADIUS * 0.68, -0.09),
  ],
  32
);

export const nockProngGeometry = new THREE.CylinderGeometry(
  NOCK_PRONG_RADIUS_TOP,
  NOCK_PRONG_RADIUS_BOTTOM,
  NOCK_PRONG_HEIGHT,
  16
);
