import { describe, it, expect } from 'vitest';
import { AstronomyPlatform, astronomyService } from '../AstronomyPlatform';

describe('AstronomyPlatform Facade Integration Tests', () => {
  const makkah = {
    name: 'Makkah',
    coordinates: { latitude: 21.4225, longitude: 39.8262 },
    timezone: 'Asia/Riyadh'
  };

  const date = { year: 2026, month: 4, day: 1, hour: 0, minute: 0, second: 0 };

  it('should compute full daily astronomy payload via facade', () => {
    const result = astronomyService.getDailyAstronomy(makkah, date);

    expect(result).toBeDefined();
    expect(result.version.engineVersion).toBe('5.0.0');
    expect(result.sun).toBeDefined();
    expect(result.moon).toBeDefined();
    expect(result.prayerTimes).toBeDefined();
    expect(result.hijri).toBeDefined();
    expect(result.qibla).toBeDefined();
    expect(result.visibility).toBeDefined();
    expect(result.warnings).toHaveLength(0);
  });

  it('should support lazy evaluation via options flags', () => {
    const platform = new AstronomyPlatform();
    const result = platform.getDailyAstronomy(makkah, date, {
      includeSun: false,
      includeMoon: false,
      includePrayerTimes: true,
      includeHijri: false,
      includeQibla: false,
      includeVisibility: false
    });

    expect(result.sun).toBeUndefined();
    expect(result.moon).toBeUndefined();
    expect(result.hijri).toBeUndefined();
    expect(result.qibla).toBeUndefined();
    expect(result.visibility).toBeUndefined();
    expect(result.prayerTimes).toBeDefined();
  });

  it('should trigger events on calculation and cache hits', () => {
    const platform = new AstronomyPlatform();
    const events: string[] = [];

    platform.addEventListener(e => {
      events.push(e.type);
    });

    // First call (Cache Miss)
    platform.getDailyAstronomy(makkah, date);
    expect(events).toContain('beforeCalculation');
    expect(events).toContain('cacheMiss');
    expect(events).toContain('afterCalculation');

    // Second call (Cache Hit)
    platform.getDailyAstronomy(makkah, date);
    expect(events).toContain('cacheHit');
  });

  it('should isolate errors when an individual engine fails', () => {
    const platform = new AstronomyPlatform();
    // Intentionally inject a failing engine plugin
    platform.getRegistry().registerEngine('qiblaEngine', {
      calculateQibla: () => {
        throw new Error('Geodesic network failure');
      }
    });

    const result = platform.getDailyAstronomy(makkah, date);
    expect(result.qibla).toBeUndefined();
    expect(result.sun).toBeDefined();
    expect(result.warnings).toContain('QiblaEngine Error: Geodesic network failure');
  });
});
