import { describe, it, expect } from 'vitest';
import { ObservationEngine } from '../math/ObservationEngine';
import { CrescentParameters } from '../../models';

describe('Danjon Limit Evaluation', () => {
  const engine = new ObservationEngine();

  const baseParams: CrescentParameters = {
    conjunctionTime: { value: 2460382.5 },
    sunset: { value: 2460383.0 },
    moonset: { value: 2460383.03 },
    lagTimeMinutes: 43,
    moonAgeHours: 12,
    illuminationFraction: 0.005,
    elongation: 6.5, // Below 7.0 Danjon limit
    arcOfLight: 6.5,
    arcOfVision: 5.0,
    relativeAzimuth: 4.0,
    lunarAltitude: 4.2,
    solarAltitude: -0.8,
    lunarAzimuth: 270.0,
    solarAzimuth: 266.0,
    crescentWidth: 0.15,
    horizontalParallax: 0.95,
    refractionCorrection: 0.5667
  };

  it('should fail when Arc of Light is below 7.0 degrees', () => {
    const result = engine.evaluateDanjon(baseParams);
    expect(result.code).toBe('FAIL');
    expect(result.classification).toBe('Below Danjon Limit');
  });

  it('should pass when Arc of Light is at or above 7.0 degrees', () => {
    const validParams = { ...baseParams, elongation: 8.5, arcOfLight: 8.5 };
    const result = engine.evaluateDanjon(validParams);
    expect(result.code).toBe('PASS');
    expect(result.classification).toBe('Visible under Ideal Conditions');
  });
});
