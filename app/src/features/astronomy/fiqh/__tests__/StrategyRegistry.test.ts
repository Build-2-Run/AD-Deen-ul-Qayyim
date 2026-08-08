import { describe, it, expect } from 'vitest';
import { StrategyRegistry } from '../StrategyRegistry';
import { fiqhPlatform } from '../FiqhPlatform';

describe('StrategyRegistry & FiqhPlatform Integration Tests', () => {
  const registry = new StrategyRegistry();

  it('should list all registered default strategies', () => {
    const list = registry.listStrategies();
    expect(list.length).toBeGreaterThanOrEqual(6);
    expect(list.map(s => s.id)).toContain('UmmAlQura');
    expect(list.map(s => s.id)).toContain('Diyanet');
    expect(list.map(s => s.id)).toContain('ISNA');
    expect(list.map(s => s.id)).toContain('MoonsightingCommittee');
  });

  it('should evaluate month start via FiqhPlatform singleton with input validation', () => {
    const date = { year: 2026, month: 3, day: 19 };
    const makkah = {
      name: 'Makkah',
      coordinates: { latitude: 21.4225, longitude: 39.8262 },
      timezone: 'Asia/Riyadh'
    };

    const res = fiqhPlatform.evaluateMonthStart(date, makkah, 'UmmAlQura');
    expect(res.data.authorityId).toBe('UmmAlQura');
    expect(res.data.decisionTree.length).toBeGreaterThan(0);
  });
});
