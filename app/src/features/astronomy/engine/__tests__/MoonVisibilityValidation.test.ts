import { describe, it, expect } from 'vitest';
import { ObservationEngine } from '../math/ObservationEngine';
import { visibilityReferenceDataset } from './datasets/visibility_reference_data';
import { CrescentParameters } from '../../models';

describe('Moon Visibility Criteria Agreement & Validation', () => {
  const engine = new ObservationEngine();

  it('should validate Yallop, Odeh, and Danjon against HMNAO/ICOP reference cases', () => {
    let passCount = 0;
    const totalCases = visibilityReferenceDataset.length;

    for (const testCase of visibilityReferenceDataset) {
      const mockParams: CrescentParameters = {
        conjunctionTime: { value: 2460382.5 },
        sunset: { value: 2460383.0 },
        moonset: { value: 2460383.03 },
        lagTimeMinutes: 45,
        moonAgeHours: 18,
        illuminationFraction: 0.02,
        elongation: testCase.arcOfLight,
        arcOfLight: testCase.arcOfLight,
        arcOfVision: testCase.arcOfVision,
        relativeAzimuth: 4.0,
        lunarAltitude: 8.0,
        solarAltitude: -0.8,
        lunarAzimuth: 270.0,
        solarAzimuth: 266.0,
        crescentWidth: testCase.crescentWidth,
        horizontalParallax: 0.95,
        refractionCorrection: 0.5667
      };

      const evaluations = engine.evaluateAllCriteria(mockParams);

      const yallopMatch = evaluations.yallop.code === testCase.expectedYallopCode;
      const odehMatch = evaluations.odeh.code === testCase.expectedOdehCode;
      const danjonMatch = (evaluations.danjon.code === 'PASS') === testCase.expectedDanjonPass;

      if (yallopMatch && odehMatch && danjonMatch) {
        passCount++;
      }
    }

    const passPercentage = (passCount / totalCases) * 100;
    console.log(`[MOON VISIBILITY VALIDATION REPORT]`);
    console.log(`  Test Cases Evaluated: ${totalCases}`);
    console.log(`  Matching Reference Cases: ${passCount}`);
    console.log(`  Agreement Rate: ${passPercentage.toFixed(1)}%`);

    expect(passPercentage).toBe(100);
  });
});
