import {
  ISolarEphemerisEngine,
  ILunarEphemerisEngine,
  IPrayerTimeEngine,
  IQiblaEngine,
  IHijriCalendarEngine,
  IMoonVisibilityEngine,
  ISolarEventsEngine,
  ILunarPhaseEngine
} from '../models';
import { EclipseEngine } from '../engine/math/EclipseEngine';
import { VisibilityWorldEngine } from '../engine/math/VisibilityWorldEngine';
import { ObservatoryScheduler } from '../engine/math/ObservatoryScheduler';

export interface RegisteredEngines {
  solarEphemerisEngine?: ISolarEphemerisEngine;
  solarEventsEngine?: ISolarEventsEngine;
  lunarEphemerisEngine?: ILunarEphemerisEngine;
  lunarPhaseEngine?: ILunarPhaseEngine;
  prayerTimeEngine?: IPrayerTimeEngine;
  qiblaEngine?: IQiblaEngine;
  hijriCalendarEngine?: IHijriCalendarEngine;
  moonVisibilityEngine?: IMoonVisibilityEngine;
  eclipseEngine?: EclipseEngine;
  visibilityWorldEngine?: VisibilityWorldEngine;
  observatorySchedulerEngine?: ObservatoryScheduler;
}

export class EngineRegistry {
  private engines: RegisteredEngines = {};
  private customPlugins = new Map<string, unknown>();

  constructor(initialEngines?: RegisteredEngines) {
    if (initialEngines) {
      this.engines = { ...initialEngines };
    }
  }

  public registerEngine<K extends keyof RegisteredEngines>(key: K, instance: RegisteredEngines[K]): void {
    this.engines[key] = instance;
  }

  public getEngine<K extends keyof RegisteredEngines>(key: K): RegisteredEngines[K] {
    return this.engines[key];
  }

  public getRequiredEngine<K extends keyof RegisteredEngines>(key: K): NonNullable<RegisteredEngines[K]> {
    const engine = this.engines[key];
    if (!engine) {
      throw new Error(`Required astronomy engine '${String(key)}' is not registered in EngineRegistry.`);
    }
    return engine as NonNullable<RegisteredEngines[K]>;
  }

  public registerPlugin(pluginName: string, pluginInstance: unknown): void {
    this.customPlugins.set(pluginName, pluginInstance);
  }

  public getPlugin<T>(pluginName: string): T | undefined {
    return this.customPlugins.get(pluginName) as T | undefined;
  }

  public hasPlugin(pluginName: string): boolean {
    return this.customPlugins.has(pluginName);
  }
}
