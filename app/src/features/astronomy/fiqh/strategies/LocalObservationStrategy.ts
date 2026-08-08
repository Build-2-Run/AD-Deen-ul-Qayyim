import {
  IFiqhRuleStrategy,
  AuthorityMetadata,
  FiqhRuleDecision,
  DecisionConfidence
} from '../contracts/IFiqhRuleStrategy';
import { JulianDate, ObserverLocation, EngineResult } from '../../models';
import { MoonVisibilityEngine } from '../../engine/math/MoonVisibilityEngine';
import { TimeEngine } from '../../engine/math/TimeEngine';

export class LocalObservationStrategy implements IFiqhRuleStrategy {
  private visibilityEngine = new MoonVisibilityEngine();

  public getMetadata(): AuthorityMetadata {
    return {
      authorityId: 'LocalObservation',
      authorityName: 'Local Naked-Eye Observation',
      country: 'Local Community / Regional Horizon',
      website: 'https://fiqhcouncil.org/',
      officialReference: 'Classical Fiqh Principle of Local Ru\'yah (Matla\')',
      version: '2026.1',
      ruleVersion: 'Classical Matla\' Sighting 2026.1',
      effectiveFrom: '0001-01-01',
      effectiveTo: '9999-12-31',
      sourceDocument: 'Hadith: "Fast when you see it and break fast when you see it"'
    };
  }

  public evaluateMonthStart(
    jd: JulianDate,
    location: ObserverLocation
  ): EngineResult<FiqhRuleDecision> {
    const startTime = performance.now();
    const visResult = this.visibilityEngine.evaluateVisibility(jd, location);
    const vis = visResult.data;

    // Local naked-eye sighting requires Odeh Category A or B at observer's local location
    const odehCode = vis.evaluations.odeh.code;
    const monthStarts = odehCode === 'A' || odehCode === 'B';

    const decisionTree: string[] = [
      `1. Local Observer Location: ${location.name} (${location.coordinates.latitude}°, ${location.coordinates.longitude}°)`,
      `2. Local Odeh Sighting Category: Code ${odehCode} (${vis.evaluations.odeh.classification})`,
      `3. Check: Naked-eye sighting probable at local horizon [Code A or B]? -> ${monthStarts ? 'PASSED ✔' : 'FAILED ✘'}`,
      `4. Final Local Ru'yah Decision: ${monthStarts ? 'New Month Starts Evening of Local Sighting ✔' : 'Month Completed 30 Days ✘'}`
    ];

    let confidence: DecisionConfidence = 'Certain';
    if (odehCode === 'B') {
      confidence = 'Probable';
    } else if (odehCode === 'C') {
      confidence = 'Marginal';
    }

    const startJD = monthStarts ? { value: Math.floor(jd.value) + 0.5 } : { value: Math.floor(jd.value) + 1.5 };
    const greg = TimeEngine.julianDateToGregorian(startJD);

    const decision: FiqhRuleDecision = {
      authorityId: 'LocalObservation',
      authorityName: this.getMetadata().authorityName,
      ruleVersion: this.getMetadata().ruleVersion,
      monthStarts,
      startJD,
      startUTC: `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}T00:00:00Z`,
      inputs: { odehCode, odehClassification: vis.evaluations.odeh.classification, location: location.name },
      ruleDescription: 'Local naked-eye crescent sighting at observer horizon (Odeh Category A or B).',
      thresholdsChecked: { odehCode, monthStarts },
      decisionTree,
      confidence,
      traceId: `fiqh-trace-local-${Date.now()}`
    };

    return {
      data: decision,
      computationTimeMs: performance.now() - startTime
    };
  }
}
