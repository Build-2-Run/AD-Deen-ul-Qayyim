import { ObserverLocation, AtmosphericConditions, CalculationMethod, TimeScale } from '../../models';

export interface EngineConfig {
  timeScale: TimeScale;
  useDeltaT: boolean;
}

export class EngineContext {
  public readonly observer?: ObserverLocation;
  public readonly atmosphere?: AtmosphericConditions;
  public readonly method?: CalculationMethod;
  public readonly config: EngineConfig;

  constructor(
    observer?: ObserverLocation,
    atmosphere?: AtmosphericConditions,
    method?: CalculationMethod,
    config?: Partial<EngineConfig>
  ) {
    this.observer = observer;
    this.atmosphere = atmosphere;
    this.method = method;
    this.config = {
      timeScale: config?.timeScale || 'UTC',
      useDeltaT: config?.useDeltaT ?? true
    };
  }
}
