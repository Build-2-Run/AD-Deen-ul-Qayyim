import {
  IFiqhRuleStrategy,
  AuthorityMetadata,
  FiqhRuleDecision,
  DecisionConfidence
} from '../contracts/IFiqhRuleStrategy';
import { JulianDate, ObserverLocation, EngineResult } from '../../models';
import isnaData from '../data/isna.json';
import { NewMoonEngine } from '../../engine/math/NewMoonEngine';
import { SolarEventsEngine } from '../../engine/math/SolarEventsEngine';
import { TimeEngine } from '../../engine/math/TimeEngine';

export class ISNAStrategy implements IFiqhRuleStrategy {
  private newMoonEngine = new NewMoonEngine();
  private solarEventsEngine = new SolarEventsEngine();

  public getMetadata(): AuthorityMetadata {
    return {
      authorityId: 'ISNA',
      authorityName: isnaData.authorityName,
      country: isnaData.country,
      website: isnaData.website,
      officialReference: isnaData.officialReference,
      version: isnaData.version,
      ruleVersion: 'ISNA / FCNA 2006 Revision',
      effectiveFrom: isnaData.effectiveFrom,
      effectiveTo: isnaData.effectiveTo,
      sourceDocument: isnaData.sourceDocument
    };
  }

  public evaluateMonthStart(
    jd: JulianDate,
    _location: ObserverLocation
  ): EngineResult<FiqhRuleDecision> {
    const startTime = performance.now();
    const makkah: ObserverLocation = {
      name: 'Makkah Al-Mukarramah',
      coordinates: { latitude: 21.422487, longitude: 39.826206 },
      timezone: 'Asia/Riyadh'
    };

    const conjunction = this.newMoonEngine.calculatePreviousConjunction(jd).data;
    const conjunctionJD = conjunction.trueConjunctionJD;

    const sunsetResult = this.solarEventsEngine.calculateEvent(jd, makkah, 'Sunset');
    const sunsetJD = sunsetResult.data ? sunsetResult.data.value : jd.value;

    const conjunctionBeforeSunset = conjunctionJD < sunsetJD;
    const monthStarts = conjunctionBeforeSunset;

    const decisionTree: string[] = [
      `1. Target evaluation date JD: ${jd.value.toFixed(4)}`,
      `2. True Conjunction JDE: ${conjunctionJD.toFixed(4)} (${conjunction.utcDate})`,
      `3. Makkah Sunset JDE: ${sunsetJD.toFixed(4)}`,
      `4. Check: Conjunction occurred before Makkah Sunset? -> ${conjunctionBeforeSunset ? 'PASSED ✔' : 'FAILED ✘'}`,
      `5. Final ISNA / FCNA Decision: ${monthStarts ? 'New Month Starts Evening of Evaluation ✔' : 'Month Completed 30 Days ✘'}`
    ];

    let confidence: DecisionConfidence = 'Certain';
    const marginMinutes = Math.abs(sunsetJD - conjunctionJD) * 1440;
    if (marginMinutes < 20) {
      confidence = 'Marginal';
    }

    const startJD = monthStarts ? { value: Math.floor(sunsetJD) + 0.5 } : { value: Math.floor(sunsetJD) + 1.5 };
    const greg = TimeEngine.julianDateToGregorian(startJD);

    const decision: FiqhRuleDecision = {
      authorityId: 'ISNA',
      authorityName: this.getMetadata().authorityName,
      ruleVersion: this.getMetadata().ruleVersion,
      monthStarts,
      startJD,
      startUTC: `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}T00:00:00Z`,
      inputs: { conjunctionJD, sunsetJD },
      ruleDescription: 'Conjunction before Sunset in Makkah.',
      thresholdsChecked: { conjunctionBeforeSunset },
      decisionTree,
      confidence,
      traceId: `fiqh-trace-isna-${Date.now()}`
    };

    return {
      data: decision,
      computationTimeMs: performance.now() - startTime
    };
  }
}
