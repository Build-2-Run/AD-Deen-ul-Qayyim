import {
  IFiqhRuleStrategy,
  AuthorityMetadata,
  FiqhRuleDecision,
  DecisionConfidence
} from '../contracts/IFiqhRuleStrategy';
import { JulianDate, ObserverLocation, EngineResult } from '../../models';
import diyanetData from '../data/diyanet.json';
import { MoonVisibilityEngine } from '../../engine/math/MoonVisibilityEngine';
import { TimeEngine } from '../../engine/math/TimeEngine';

export class DiyanetStrategy implements IFiqhRuleStrategy {
  private visibilityEngine = new MoonVisibilityEngine();

  public getMetadata(): AuthorityMetadata {
    return {
      authorityId: 'Diyanet',
      authorityName: diyanetData.authorityName,
      country: diyanetData.country,
      website: diyanetData.website,
      officialReference: diyanetData.officialReference,
      version: diyanetData.version,
      ruleVersion: 'Diyanet Istanbul Congress 2016 Specification',
      effectiveFrom: diyanetData.effectiveFrom,
      effectiveTo: diyanetData.effectiveTo,
      sourceDocument: diyanetData.sourceDocument
    };
  }

  public evaluateMonthStart(
    jd: JulianDate,
    location: ObserverLocation
  ): EngineResult<FiqhRuleDecision> {
    const startTime = performance.now();
    const visResult = this.visibilityEngine.calculateCrescentParameters(jd, location);
    const params = visResult.data;

    const minElongation = diyanetData.rules.minElongationDegrees; // 8.0 deg
    const minAltitude = diyanetData.rules.minAltitudeDegrees;   // 5.0 deg

    const elongationPassed = params.elongation >= minElongation;
    const altitudePassed = params.lunarAltitude >= minAltitude;
    const monthStarts = elongationPassed && altitudePassed;

    const decisionTree: string[] = [
      `1. Global/Local evaluation point: ${location.name}`,
      `2. Calculated Elongation (ARCL): ${params.elongation.toFixed(2)}° (Required: >= ${minElongation}°) -> ${elongationPassed ? 'PASSED ✔' : 'FAILED ✘'}`,
      `3. Calculated Lunar Altitude: ${params.lunarAltitude.toFixed(2)}° (Required: >= ${minAltitude}°) -> ${altitudePassed ? 'PASSED ✔' : 'FAILED ✘'}`,
      `4. Final Diyanet Decision: ${monthStarts ? 'New Month Starts Evening of Evaluation ✔' : 'Month Completed 30 Days ✘'}`
    ];

    let confidence: DecisionConfidence = 'Certain';
    if (Math.abs(params.elongation - minElongation) < 0.5 || Math.abs(params.lunarAltitude - minAltitude) < 0.5) {
      confidence = 'Marginal';
    }

    const startJD = monthStarts ? { value: Math.floor(jd.value) + 0.5 } : { value: Math.floor(jd.value) + 1.5 };
    const greg = TimeEngine.julianDateToGregorian(startJD);

    const decision: FiqhRuleDecision = {
      authorityId: 'Diyanet',
      authorityName: this.getMetadata().authorityName,
      ruleVersion: this.getMetadata().ruleVersion,
      monthStarts,
      startJD,
      startUTC: `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}T00:00:00Z`,
      inputs: { elongation: params.elongation, lunarAltitude: params.lunarAltitude },
      ruleDescription: 'Global visibility requirement: Elongation >= 8° AND Altitude >= 5°.',
      thresholdsChecked: { minElongation, minAltitude, elongationPassed, altitudePassed },
      decisionTree,
      confidence,
      traceId: `fiqh-trace-diyanet-${Date.now()}`
    };

    return {
      data: decision,
      computationTimeMs: performance.now() - startTime
    };
  }
}
