import {
  IFiqhRuleStrategy,
  AuthorityMetadata,
  FiqhRuleDecision,
  DecisionConfidence
} from '../contracts/IFiqhRuleStrategy';
import { JulianDate, ObserverLocation, EngineResult } from '../../models';
import mcwData from '../data/mcw.json';
import { MoonVisibilityEngine } from '../../engine/math/MoonVisibilityEngine';
import { TimeEngine } from '../../engine/math/TimeEngine';

export class MoonsightingCommitteeStrategy implements IFiqhRuleStrategy {
  private visibilityEngine = new MoonVisibilityEngine();

  public getMetadata(): AuthorityMetadata {
    return {
      authorityId: 'MoonsightingCommittee',
      authorityName: mcwData.authorityName,
      country: mcwData.country,
      website: mcwData.website,
      officialReference: mcwData.officialReference,
      version: mcwData.version,
      ruleVersion: 'MCW Global Sighting Verification 2026.1',
      effectiveFrom: mcwData.effectiveFrom,
      effectiveTo: mcwData.effectiveTo,
      sourceDocument: mcwData.sourceDocument
    };
  }

  public evaluateMonthStart(
    jd: JulianDate,
    location: ObserverLocation
  ): EngineResult<FiqhRuleDecision> {
    const startTime = performance.now();
    const visResult = this.visibilityEngine.evaluateVisibility(jd, location);
    const vis = visResult.data;

    const allowedCategories = mcwData.rules.yallopCategoriesAllowed; // ['A', 'B', 'C']
    const code = vis.evaluations.yallop.code;

    const sightingPossible = allowedCategories.includes(code);
    const monthStarts = sightingPossible;

    const decisionTree: string[] = [
      `1. Target evaluation point: ${location.name}`,
      `2. Yallop Visibility Code: ${code} (${vis.evaluations.yallop.classification})`,
      `3. Check: Yallop Code in allowed sighting categories [A, B, C]? -> ${sightingPossible ? 'PASSED ✔' : 'FAILED 8'}`,
      `4. Final MCW Decision: ${monthStarts ? 'New Month Starts Evening of Evaluation ✔' : 'Month Completed 30 Days ✘'}`
    ];

    let confidence: DecisionConfidence = 'Certain';
    if (code === 'C') {
      confidence = 'Marginal';
    } else if (code === 'B') {
      confidence = 'Probable';
    }

    const startJD = monthStarts ? { value: Math.floor(jd.value) + 0.5 } : { value: Math.floor(jd.value) + 1.5 };
    const greg = TimeEngine.julianDateToGregorian(startJD);

    const decision: FiqhRuleDecision = {
      authorityId: 'MoonsightingCommittee',
      authorityName: this.getMetadata().authorityName,
      ruleVersion: this.getMetadata().ruleVersion,
      monthStarts,
      startJD,
      startUTC: `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}T00:00:00Z`,
      inputs: { yallopCode: code, yallopClassification: vis.evaluations.yallop.classification },
      ruleDescription: 'Naked-eye or optical sighting verification (Yallop Category A, B, or C).',
      thresholdsChecked: { allowedCategories: allowedCategories.join(','), code, sightingPossible },
      decisionTree,
      confidence,
      traceId: `fiqh-trace-mcw-${Date.now()}`
    };

    return {
      data: decision,
      computationTimeMs: performance.now() - startTime
    };
  }
}
