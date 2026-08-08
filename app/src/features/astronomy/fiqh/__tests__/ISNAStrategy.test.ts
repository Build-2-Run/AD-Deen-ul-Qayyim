import { describe, it, expect } from 'vitest';
import { ISNAStrategy } from '../strategies/ISNAStrategy';
import { TimeEngine } from '../../engine/math/TimeEngine';

describe('ISNAStrategy Integration Tests', () => {
  const strategy = new ISNAStrategy();
  const chicago = {
    name: 'Chicago',
    coordinates: { latitude: 41.8781, longitude: -87.6298 },
    timezone: 'America/Chicago'
  };

  it('should evaluate Makkah conjunction criterion', () => {
    const jd = TimeEngine.calculateJulianDate({ year: 2026, month: 3, day: 19 });
    const result = strategy.evaluateMonthStart(jd, chicago).data;

    expect(result.authorityId).toBe('ISNA');
    expect(result.ruleDescription).toContain('Conjunction before Sunset in Makkah');
  });
});
