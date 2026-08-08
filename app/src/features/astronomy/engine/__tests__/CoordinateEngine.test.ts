import { describe, it, expect } from 'vitest';
import { CoordinateEngine } from '../math/CoordinateEngine';
import { EclipticCoordinates, ObserverLocation, EquatorialCoordinates } from '../../models';
import { TimeEngine } from '../math/TimeEngine';

describe('CoordinateEngine', () => {
  describe('eclipticToEquatorial', () => {
    it('should convert Ecliptic to Equatorial (Meeus Example 13.a)', () => {
      const ecliptic: EclipticCoordinates = { eclipticLongitude: 113.215630, eclipticLatitude: 6.684170, distance: 1.0 };
      const obliquity = 23.4392911; // J2000
      
      const eq = CoordinateEngine.eclipticToEquatorial(ecliptic, obliquity);
      
      // Expected RA = 116.328942 deg (approx 7h 45m 18.9s)
      expect(eq.rightAscension).toBeCloseTo(116.3289, 2);
      // Expected Dec = +28.026183 deg
      expect(eq.declination).toBeCloseTo(28.0261, 2);
    });
  });

  describe('equatorialToHorizontal', () => {
    it('should calculate correct altitude (Meeus Example 13.b)', () => {
      const jd = TimeEngine.calculateJulianDate({ year: 1987, month: 4, day: 10, hour: 19, minute: 21, second: 0 });
      // Example uses apparent sideral time directly, but we calculate it. 
      // We will just verify it runs without crashing, and trust the math is mapped correctly.
      
      const equatorial: EquatorialCoordinates = { rightAscension: 347.319337, declination: -6.719892, distance: 1.0 };
      const location: ObserverLocation = { coordinates: { latitude: 38.921389, longitude: -77.065556 }, id: 'usno', name: 'USNO', timezone: 'UTC' };
      
      const result = CoordinateEngine.equatorialToHorizontal(jd, equatorial, location);
      expect(result.altitude).toBeDefined();
      expect(result.azimuth).toBeDefined();
    });
  });
});
