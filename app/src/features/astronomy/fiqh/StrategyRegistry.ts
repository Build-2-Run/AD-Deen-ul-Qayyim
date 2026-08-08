import { IFiqhRuleStrategy } from './contracts/IFiqhRuleStrategy';
import { HijriCalendarType } from '../models';
import { UmmAlQuraStrategy } from './strategies/UmmAlQuraStrategy';
import { DiyanetStrategy } from './strategies/DiyanetStrategy';
import { ISNAStrategy } from './strategies/ISNAStrategy';
import { MoonsightingCommitteeStrategy } from './strategies/MoonsightingCommitteeStrategy';
import { AstronomicalStrategy } from './strategies/AstronomicalStrategy';
import { LocalObservationStrategy } from './strategies/LocalObservationStrategy';

export class StrategyRegistry {
  private strategies = new Map<string, IFiqhRuleStrategy>();

  constructor() {
    // Register standard default authorities
    this.registerStrategy(new UmmAlQuraStrategy());
    this.registerStrategy(new DiyanetStrategy());
    this.registerStrategy(new ISNAStrategy());
    this.registerStrategy(new MoonsightingCommitteeStrategy());
    this.registerStrategy(new AstronomicalStrategy());
    this.registerStrategy(new LocalObservationStrategy());
  }

  public registerStrategy(strategy: IFiqhRuleStrategy): void {
    const meta = strategy.getMetadata();
    this.strategies.set(meta.authorityId, strategy);
  }

  public getStrategy(authorityId: HijriCalendarType | string): IFiqhRuleStrategy {
    const strategy = this.strategies.get(authorityId);
    if (!strategy) {
      // Fallback to Astronomical default if requested strategy is not found
      return this.strategies.get('Astronomical')!;
    }
    return strategy;
  }

  public hasStrategy(authorityId: string): boolean {
    return this.strategies.has(authorityId);
  }

  public listStrategies(): Array<{ id: string; name: string; country: string; version: string }> {
    const list: Array<{ id: string; name: string; country: string; version: string }> = [];
    for (const [id, strategy] of this.strategies.entries()) {
      const meta = strategy.getMetadata();
      list.push({
        id,
        name: meta.authorityName,
        country: meta.country,
        version: meta.ruleVersion
      });
    }
    return list;
  }
}

export const strategyRegistry = new StrategyRegistry();
