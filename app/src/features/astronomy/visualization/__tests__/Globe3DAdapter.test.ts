import { describe, it, expect } from 'vitest';
import { Globe3DAdapter } from '../adapters/Globe3DAdapter';
import { QiblaArcAdapter } from '../adapters/QiblaArcAdapter';

describe('Globe3DAdapter & QiblaArcAdapter Integration Tests', () => {
  const makkah = {
    name: 'Makkah',
    coordinates: { latitude: 21.4225, longitude: 39.8262 },
    timezone: 'Asia/Riyadh'
  };

  it('should adapt location into 3D unit sphere vector', () => {
    const vec = Globe3DAdapter.adaptLocationToVector3D(makkah);
    expect(vec.x).toBeDefined();
    expect(vec.y).toBeDefined();
    expect(vec.z).toBeDefined();
  });

  it('should generate Great-Circle 3D arc vertices to Kaaba', () => {
    const london = {
      name: 'London',
      coordinates: { latitude: 51.5074, longitude: -0.1278 },
      timezone: 'Europe/London'
    };

    const arc = QiblaArcAdapter.adaptQiblaArc3D(london, 16);
    expect(arc.length).toBe(17);
  });
});
