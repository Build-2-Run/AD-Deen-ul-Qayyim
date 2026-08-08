import {
  ObserverLocation,
  GregorianDate,
  HijriCalendarType,
  EngineResult
} from '../models';
import { FiqhRuleDecision } from './contracts/IFiqhRuleStrategy';
import { StrategyRegistry, strategyRegistry } from './StrategyRegistry';
import {
  sanitizeDate,
  sanitizeObserver,
  sanitizeJulianDate
} from './validators/InputValidators';
import { TimeEngine } from '../engine/math/TimeEngine';

export class FiqhPlatform {
  private registry: StrategyRegistry;

  constructor(registry?: StrategyRegistry) {
    this.registry = registry ?? strategyRegistry;
  }

  public getRegistry(): StrategyRegistry {
    return this.registry;
  }

  /**
   * Evaluates Hijri Month boundary decision under a specific Fiqh authority.
   */
  public evaluateMonthStart(
    date: GregorianDate,
    location: ObserverLocation,
    strategyId: HijriCalendarType = 'Astronomical'
  ): EngineResult<FiqhRuleDecision> {
    // 1. Runtime Input Validation
    const cleanDate = sanitizeDate(date);
    const cleanLocation = sanitizeObserver(location);

    const jd = TimeEngine.calculateJulianDate(cleanDate);
    sanitizeJulianDate(jd);

    // 2. Lookup & Execute Strategy
    const strategy = this.registry.getStrategy(strategyId);
    return strategy.evaluateMonthStart(jd, cleanLocation);
  }
}

export const fiqhPlatform = new FiqhPlatform();
