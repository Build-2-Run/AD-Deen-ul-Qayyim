import { describe, it, expect } from 'vitest';
import { QiblaEngine } from '../math/QiblaEngine';

describe('QiblaEngine', () => {
  const engine = new QiblaEngine();

  const cities = [
    { name: 'London', loc: { latitude: 51.5074, longitude: -0.1278 }, expectedQibla: 119 },
    { name: 'New York', loc: { latitude: 40.7128, longitude: -74.0060 }, expectedQibla: 58 },
    { name: 'Jakarta', loc: { latitude: -6.2088, longitude: 106.8456 }, expectedQibla: 295 },
    { name: 'Sydney', loc: { latitude: -33.8688, longitude: 151.2093 }, expectedQibla: 277 },
    { name: 'Cape Town', loc: { latitude: -33.9249, longitude: 18.4241 }, expectedQibla: 23 }, // Exact geodesic is ~23.46 degrees
    { name: 'Delhi', loc: { latitude: 28.6139, longitude: 77.2090 }, expectedQibla: 267 }
  ];

  it('should calculate accurate Qibla bearings for major global cities', () => {
    for (const city of cities) {
      const location = {
        name: city.name,
        coordinates: city.loc,
        timezone: 'UTC'
      };

      const result = engine.calculateQibla(location);
      
      expect(result.data.methodUsed).toBe('Vincenty');
      expect(result.data.azimuthDegrees).toBeCloseTo(city.expectedQibla, 0);
      expect(result.data.distanceKm).toBeGreaterThan(0);
      expect(result.data.greatCircleArcDegrees).toBeGreaterThan(0);
    }
  });

  it('should trace the geodesic calculation', () => {
    const london = {
      name: 'London',
      coordinates: { latitude: 51.5074, longitude: -0.1278 },
      timezone: 'Europe/London'
    };

    const result = engine.calculateQibla(london);
    expect(result.data.azimuthDegrees).toBeGreaterThan(0);
    expect(result.data.distanceKm).toBeGreaterThan(0);
  });
});
