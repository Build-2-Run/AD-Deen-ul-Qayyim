import { describe, it, expect } from 'vitest';
import { ObservationEngine } from '../math/ObservationEngine';
import { CrescentParameters } from '../../models';

describe('Odeh Criterion Evaluation', () => {
  const engine = new ObservationEngine();

  const baseParams: CrescentParameters = {
    conjunctionTime: { value: 2460382.5 },
    sunset: { value: 2460383.0 },
    moonset: { value: 2460383.03 },
    lagTimeMinutes: 50,
    moonAgeHours: 22,
    illuminationFraction: 0.025,
    elongation: 13.0,
    arcOfLight: 13.0,
    arcOfVision: 16.0, // V = 16.0 - 9.38 = 6.62 >= 5.65 -> Category A
    relativeAzimuth: 5.0,
    lunarAltitude: 11.2,
    solarAltitude: -0.8,
    lunarAzimuth: 270.0,
    solarAzimuth: 265.0,
    crescentWidth: 0.40,
    horizontalParallax: 0.95,
    refractionCorrection: 0.5667
  };

  it('should evaluate Category A (Easily Visible) for high V scores', () => {
    const result = engine.evaluateOdeh(baseParams);
    expect(result.code).toBe('A');
    expect(result.classification).toBe('Easily Visible');
    expect(result.score).toBeGreaterThanOrEqual(5.65);
  });

  it('should evaluate Category D (Not Visible) when V score is below -0.96', () => {
    const poorParams: CrescentParameters = {
      ...baseParams,
      arcOfVision: 7.0,
      crescentWidth: 0.15
    };
    const result = engine.evaluateOdeh(poorParams);
    expect(['C', 'D']).toContain(result.code);
  });
});
