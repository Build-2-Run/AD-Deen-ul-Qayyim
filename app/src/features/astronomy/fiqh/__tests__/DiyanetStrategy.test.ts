import { describe, it, expect } from 'vitest';
import { DiyanetStrategy } from '../strategies/DiyanetStrategy';
import { TimeEngine } from '../../engine/math/TimeEngine';

describe('DiyanetStrategy Integration Tests', () => {
  const strategy = new DiyanetStrategy();
  const istanbul = {
    name: 'Istanbul',
    coordinates: { latitude: 41.0082, longitude: 28.9784 },
    timezone: 'Europe/Istanbul'
  };

  it('should evaluate global 8-deg elongation & 5-deg altitude rule', () => {
    const jd = TimeEngine.calculateJulianDate({ year: 2026, month: 3, day: 19 });
    const result = strategy.evaluateMonthStart(jd, istanbul).data;

    expect(result.authorityId).toBe('Diyanet');
    expect(result.thresholdsChecked.minElongation).toBe(8.0);
    expect(result.thresholdsChecked.minAltitude).toBe(5.0);
    expect(result.decisionTree).toBeDefined();
  });
});
