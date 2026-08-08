import { describe, it, expect } from 'vitest';
import { VectorMath } from '../render/VectorMath';
import { Projection } from '../render/Projection';
import { CoordinateNormalizer } from '../render/CoordinateNormalizer';

describe('Render & Geometry Utilities Integration Tests', () => {
  it('should convert latitude and longitude to 3D unit sphere vector', () => {
    const vec = VectorMath.latLonToUnitSphere(0, 0);
    expect(vec.x).toBeCloseTo(1, 4);
    expect(vec.y).toBeCloseTo(0, 4);
    expect(vec.z).toBeCloseTo(0, 4);

    const mag = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
    expect(mag).toBeCloseTo(1.0, 5);
  });

  it('should project horizontal coordinates to 2D stereographic screen points', () => {
    const zenith = Projection.projectHorizontal(90, 0, 'stereographic');
    expect(zenith.x).toBeCloseTo(0, 4);
    expect(zenith.y).toBeCloseTo(0, 4);
    expect(zenith.visible).toBe(true);
  });

  it('should normalize coordinates to viewport pixel dimensions', () => {
    const point = { x: 0, y: 0, visible: true };
    const vp = CoordinateNormalizer.toViewport(point, 800, 600);
    expect(vp.x).toBe(400);
    expect(vp.y).toBe(300);
  });
});
