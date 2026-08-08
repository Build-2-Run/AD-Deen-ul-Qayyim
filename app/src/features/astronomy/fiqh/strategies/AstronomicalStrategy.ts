import {
  IFiqhRuleStrategy,
  AuthorityMetadata,
  FiqhRuleDecision
} from '../contracts/IFiqhRuleStrategy';
import { JulianDate, ObserverLocation, EngineResult } from '../../models';
import { NewMoonEngine } from '../../engine/math/NewMoonEngine';
import { TimeEngine } from '../../engine/math/TimeEngine';

export class AstronomicalStrategy implements IFiqhRuleStrategy {
  private newMoonEngine = new NewMoonEngine();

  public getMetadata(): AuthorityMetadata {
    return {
      authorityId: 'Astronomical',
      authorityName: 'Pure Astronomical Calendar',
      country: 'Global Mathematical Baseline',
      website: 'https://meeus.astronomy.org/',
      officialReference: 'Jean Meeus Chapter 49 Conjunction Baseline',
      version: '2026.1',
      ruleVersion: 'Pure Conjunction 2026.1',
      effectiveFrom: '0001-01-01',
      effectiveTo: '9999-12-31',
      sourceDocument: 'Meeus Astronomical Algorithms Chapter 49 (True Conjunction JDE)'
    };
  }

  public evaluateMonthStart(
    jd: JulianDate,
    _location: ObserverLocation
  ): EngineResult<FiqhRuleDecision> {
    const startTime = performance.now();
    const conjunction = this.newMoonEngine.calculatePreviousConjunction(jd).data;
    const conjunctionJD = conjunction.trueConjunctionJD;

    const monthStarts = jd.value >= conjunctionJD;

    const decisionTree: string[] = [
      `1. Evaluation Julian Date: ${jd.value.toFixed(4)}`,
      `2. True Astronomical Conjunction JDE: ${conjunctionJD.toFixed(4)} (${conjunction.utcDate})`,
      `3. Check: Evaluation date is on or after True Conjunction? -> ${monthStarts ? 'PASSED ✔' : 'FAILED ✘'}`,
      `4. Final Pure Astronomical Decision: ${monthStarts ? 'New Month Starts Day Following Conjunction ✔' : 'Month Completed 30 Days ✘'}`
    ];

    const startJD = { value: Math.floor(conjunctionJD - 0.5) + 0.5 + 1 };
    const greg = TimeEngine.julianDateToGregorian(startJD);

    const decision: FiqhRuleDecision = {
      authorityId: 'Astronomical',
      authorityName: this.getMetadata().authorityName,
      ruleVersion: this.getMetadata().ruleVersion,
      monthStarts,
      startJD,
      startUTC: `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}T00:00:00Z`,
      inputs: { conjunctionJD, lunationNumber: conjunction.lunationNumber },
      ruleDescription: 'Month begins on Julian day following astronomical true conjunction in UTC.',
      thresholdsChecked: { monthStarts },
      decisionTree,
      confidence: 'Certain',
      traceId: `fiqh-trace-astro-${Date.now()}`
    };

    return {
      data: decision,
      computationTimeMs: performance.now() - startTime
    };
  }
}
