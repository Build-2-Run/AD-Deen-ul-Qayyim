import { describe, it, expect } from 'vitest';
import { EclipseEngine } from '../math/EclipseEngine';

describe('EclipseEngine Validation & Canon Verification', () => {
  const engine = new EclipseEngine();

  it('should calculate Solar and Lunar eclipses for 2026', () => {
    const res = engine.calculateEclipses(2026);
    expect(res.data.length).toBeGreaterThan(0);

    const solar = res.data.find(e => e.eventType === 'Solar');
    expect(solar).toBeDefined();
    expect(solar?.greatestEclipseUTC).toContain('2026-');

    const lunar = res.data.find(e => e.eventType === 'Lunar');
    expect(lunar).toBeDefined();
    expect(lunar?.magnitude).toBeGreaterThan(0);
  });
});
