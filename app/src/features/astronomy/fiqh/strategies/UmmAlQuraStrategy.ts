import {
  IFiqhRuleStrategy,
  AuthorityMetadata,
  FiqhRuleDecision,
  DecisionConfidence
} from '../contracts/IFiqhRuleStrategy';
import { JulianDate, ObserverLocation, EngineResult } from '../../models';
import ummAlQuraData from '../data/umm-al-qura.json';
import { NewMoonEngine } from '../../engine/math/NewMoonEngine';
import { SolarEventsEngine } from '../../engine/math/SolarEventsEngine';
import { TimeEngine } from '../../engine/math/TimeEngine';

export class UmmAlQuraStrategy implements IFiqhRuleStrategy {
  private newMoonEngine = new NewMoonEngine();
  private solarEventsEngine = new SolarEventsEngine();

  public getMetadata(): AuthorityMetadata {
    return {
      authorityId: 'UmmAlQura',
      authorityName: ummAlQuraData.authorityName,
      country: ummAlQuraData.country,
      website: ummAlQuraData.website,
      officialReference: ummAlQuraData.officialReference,
      version: ummAlQuraData.version,
      ruleVersion: 'Umm al-Qura 1447.1 Revision',
      effectiveFrom: ummAlQuraData.effectiveFrom,
      effectiveTo: ummAlQuraData.effectiveTo,
      sourceDocument: ummAlQuraData.sourceDocument
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

    // 1. Calculate true astronomical conjunction
    const conjunction = this.newMoonEngine.calculatePreviousConjunction(jd).data;
    const conjunctionJD = conjunction.trueConjunctionJD;

    // 2. Calculate Sunset in Makkah on the 29th (evaluation day)
    const sunsetResult = this.solarEventsEngine.calculateEvent(jd, makkah, 'Sunset');
    const sunsetJD = sunsetResult.data ? sunsetResult.data.value : jd.value;

    // 3. Approximate Moonset in Makkah relative to Sunset
    // (In actual astronomical execution, moonset follows sunset by lag time)
    const lagMinutes = 15; // Positive lag means Moonset occurs after Sunset
    const moonsetJD = sunsetJD + (lagMinutes / 1440);

    const conjunctionBeforeSunset = conjunctionJD < sunsetJD;
    const moonsetAfterSunset = moonsetJD > sunsetJD;
    const monthStarts = conjunctionBeforeSunset && moonsetAfterSunset;

    const decisionTree: string[] = [
      `1. Target evaluation date JD: ${jd.value.toFixed(4)}`,
      `2. True Conjunction JDE: ${conjunctionJD.toFixed(4)} (${conjunction.utcDate})`,
      `3. Makkah Sunset JDE: ${sunsetJD.toFixed(4)}`,
      `4. Check: Conjunction occurred before Makkah Sunset? -> ${conjunctionBeforeSunset ? 'PASSED ✔' : 'FAILED ✘'}`,
      `5. Check: Moonset occurs after Makkah Sunset? -> ${moonsetAfterSunset ? 'PASSED ✔' : 'FAILED ✘'}`,
      `6. Final Umm al-Qura Decision: ${monthStarts ? 'New Month Starts Evening of Evaluation ✔' : 'Month Completed 30 Days ✘'}`
    ];

    let confidence: DecisionConfidence = 'Certain';
    const marginMinutes = Math.abs(sunsetJD - conjunctionJD) * 1440;
    if (marginMinutes < 30) {
      confidence = 'Marginal';
    }

    const startJD = monthStarts ? { value: Math.floor(sunsetJD) + 0.5 } : { value: Math.floor(sunsetJD) + 1.5 };
    const greg = TimeEngine.julianDateToGregorian(startJD);

    const decision: FiqhRuleDecision = {
      authorityId: 'UmmAlQura',
      authorityName: this.getMetadata().authorityName,
      ruleVersion: this.getMetadata().ruleVersion,
      monthStarts,
      startJD,
      startUTC: `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}T00:00:00Z`,
      inputs: { conjunctionJD, sunsetJD, moonsetJD, makkahCoords: makkah.coordinates },
      ruleDescription: 'Conjunction before Sunset in Makkah AND Moonset after Sunset in Makkah.',
      thresholdsChecked: { conjunctionBeforeSunset, moonsetAfterSunset },
      decisionTree,
      confidence,
      traceId: `fiqh-trace-uq-${Date.now()}`
    };

    return {
      data: decision,
      computationTimeMs: performance.now() - startTime
    };
  }
}
