import { describe, it, expect } from 'vitest';
import { LunarEphemerisEngine } from '../math/LunarEphemerisEngine';

describe('LunarEphemerisEngine', () => {
  const engine = new LunarEphemerisEngine();

  describe('calculateLunarCoordinates (Meeus Example 47.a)', () => {
    it('should calculate accurate Geocentric Longitude, Latitude, and Distance for 1992 April 12.0', () => {
      // 1992 April 12.0 UTC
      // Actually Meeus example 47.a uses JD = 2448724.5 (which is 1992 April 12.0 TD)
      // To strictly match Meeus inputs without delta T shifting our exact JD check, we'll force the JD:
      const testJd = { value: 2448724.5 };
      
      const result = engine.calculateLunarCoordinates(testJd);
      
      // Expected Geocentric Longitude = 133.162655
      // Because we use an approximate nutation in Phase 2B, we expect ~133.167
      expect(result.data.ecliptic!.eclipticLongitude).toBeCloseTo(133.16, 1);
      
      // Expected Geocentric Latitude = -3.229126
      expect(result.data.ecliptic!.eclipticLatitude).toBeCloseTo(-3.23, 2);
      
      // Expected Distance = 368409.7 km
      expect(result.data.distanceKm).toBeCloseTo(368409.7, 0); // precise to within a km
      
      // Expected Equatorial Horizontal Parallax = 0.99199 degrees
      expect(result.data.parallax).toBeCloseTo(0.99199, 4);
    });
  });
});
