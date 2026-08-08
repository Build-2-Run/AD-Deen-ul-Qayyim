import { describe, it, expect } from 'vitest';
import { ObservationEngine } from '../math/ObservationEngine';
import { CrescentParameters } from '../../models';

describe('Yallop Criterion Evaluation', () => {
  const engine = new ObservationEngine();

  const baseParams: CrescentParameters = {
    conjunctionTime: { value: 2460382.5 },
    sunset: { value: 2460383.0 },
    moonset: { value: 2460383.03 },
    lagTimeMinutes: 50,
    moonAgeHours: 20,
    illuminationFraction: 0.02,
    elongation: 12.0,
    arcOfLight: 12.0,
    arcOfVision: 13.5, // Generates q > 0.216 -> Category A
    relativeAzimuth: 4.0,
    lunarAltitude: 10.7,
    solarAltitude: -0.8,
    lunarAzimuth: 270.0,
    solarAzimuth: 266.0,
    crescentWidth: 0.35,
    horizontalParallax: 0.95,
    refractionCorrection: 0.5667
  };

  it('should categorize high visibility crescents as Category A (Easily Visible)', () => {
    const result = engine.evaluateYallop(baseParams);
    expect(result.code).toBe('A');
    expect(result.classification).toBe('Easily Visible');
    expect(result.score).toBeGreaterThan(0.216);
  });

  it('should categorize marginal crescents as Category C or D', () => {
    const marginalParams: CrescentParameters = {
      ...baseParams,
      arcOfVision: 10.0,
      crescentWidth: 0.20
    };
    const result = engine.evaluateYallop(marginalParams);
    expect(['C', 'D']).toContain(result.code);
  });

  it('should classify crescents below 7.0 degrees elongation as Category F (Below Danjon Limit)', () => {
    const belowLimitParams = { ...baseParams, arcOfLight: 5.0, elongation: 5.0 };
    const result = engine.evaluateYallop(belowLimitParams);
    expect(result.code).toBe('F');
    expect(result.classification).toBe('Below Danjon Limit');
  });
});
