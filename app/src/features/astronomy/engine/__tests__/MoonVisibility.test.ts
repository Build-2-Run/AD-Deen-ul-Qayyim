import { describe, it, expect } from 'vitest';
import { MoonVisibilityEngine } from '../math/MoonVisibilityEngine';
import { TimeEngine } from '../math/TimeEngine';

describe('MoonVisibilityEngine', () => {
  const engine = new MoonVisibilityEngine();

  const makkah = {
    name: 'Makkah',
    coordinates: { latitude: 21.4225, longitude: 39.8262 },
    timezone: 'Asia/Riyadh'
  };

  it('should compute complete physical CrescentParameters at local Sunset', () => {
    // 2026-03-20 (around Ramadan / Shawwal 1447)
    const date = { year: 2026, month: 3, day: 20, hour: 0, minute: 0, second: 0 };
    const jd = TimeEngine.calculateJulianDate(date);

    const result = engine.calculateCrescentParameters(jd, makkah);
    const params = result.data;

    expect(params).not.toBeNull();
    expect(params.elongation).toBeGreaterThan(0);
    expect(params.arcOfLight).toBeGreaterThan(0);
    expect(params.crescentWidth).toBeGreaterThanOrEqual(0);
    expect(params.moonAgeHours).toBeGreaterThan(0);
  });

  it('should evaluate visibility across all 5 criteria simultaneously', () => {
    const date = { year: 2026, month: 3, day: 20, hour: 0, minute: 0, second: 0 };
    const jd = TimeEngine.calculateJulianDate(date);

    const result = engine.evaluateVisibility(jd, makkah);
    const vis = result.data;

    expect(vis.evaluations.danjon).toBeDefined();
    expect(vis.evaluations.yallop).toBeDefined();
    expect(vis.evaluations.odeh).toBeDefined();
    expect(vis.evaluations.ilyas).toBeDefined();
    expect(vis.evaluations.bruin).toBeDefined();

    expect(['Low', 'Medium', 'High']).toContain(vis.confidence);
  });
});
