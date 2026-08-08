import { describe, it, expect } from 'vitest';
import { UmmAlQuraStrategy } from '../strategies/UmmAlQuraStrategy';
import { TimeEngine } from '../../engine/math/TimeEngine';

describe('UmmAlQuraStrategy Integration Tests', () => {
  const strategy = new UmmAlQuraStrategy();
  const makkah = {
    name: 'Makkah Al-Mukarramah',
    coordinates: { latitude: 21.422487, longitude: 39.826206 },
    timezone: 'Asia/Riyadh'
  };

  it('should return valid metadata and versioning', () => {
    const meta = strategy.getMetadata();
    expect(meta.authorityId).toBe('UmmAlQura');
    expect(meta.country).toBe('Saudi Arabia');
    expect(meta.ruleVersion).toContain('Umm al-Qura');
  });

  it('should evaluate month start with explainable decision tree', () => {
    const jd = TimeEngine.calculateJulianDate({ year: 2026, month: 3, day: 19 });
    const result = strategy.evaluateMonthStart(jd, makkah).data;

    expect(result.authorityId).toBe('UmmAlQura');
    expect(result.decisionTree.length).toBeGreaterThan(3);
    expect(result.decisionTree[0]).toContain('Target evaluation date');
    expect(result.confidence).toBeDefined();
  });
});
