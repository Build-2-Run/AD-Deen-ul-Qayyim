import { describe, it, expect } from 'vitest';
import { GeodesyEngine } from '../math/Geodesy';

describe('GeodesyEngine', () => {
  it('should calculate distance and bearing using Vincenty (London to New York)', () => {
    // London
    const p1 = { latitude: 51.5074, longitude: -0.1278 };
    // New York
    const p2 = { latitude: 40.7128, longitude: -74.0060 };

    const result = GeodesyEngine.inverse(p1, p2);
    
    expect(result.methodUsed).toBe('Vincenty');
    
    // Distance should be approx 5,585 km
    expect(result.distance / 1000).toBeCloseTo(5585, 0);

    // Initial bearing from London to NY is approx 288 degrees
    expect(result.initialBearing).toBeCloseTo(288, 0);
  });

  it('should fallback to Spherical for nearly antipodal points', () => {
    // Exact antipodes often fail Vincenty convergence
    const p1 = { latitude: 10, longitude: 10 };
    const p2 = { latitude: -10, longitude: -170 }; // Exact antipode

    const result = GeodesyEngine.inverse(p1, p2);
    
    expect(result.methodUsed).toBe('Spherical');
    // Distance should be roughly half Earth's circumference (~20,000 km)
    expect(result.distance / 1000).toBeCloseTo(20015, -1);
  });
});
