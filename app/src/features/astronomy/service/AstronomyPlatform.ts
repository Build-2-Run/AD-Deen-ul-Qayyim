import {
  ObserverLocation,
  GregorianDate
} from '../models';
import {
  DailyAstronomyOptions,
  DailyAstronomyResult,
  DailyAstronomyPayload,
  VersionMetadata,
  PlatformEvent,
  PlatformEventListener,
  PlatformEventType
} from './types';
import { AstronomyCache } from './AstronomyCache';
import { EngineRegistry, RegisteredEngines } from './EngineRegistry';
import { TimeEngine } from '../engine/math/TimeEngine';
import { SolarEphemerisEngine } from '../engine/math/SolarEphemerisEngine';
import { SolarEventsEngine } from '../engine/math/SolarEventsEngine';
import { LunarEphemerisEngine } from '../engine/math/LunarEphemerisEngine';
import { PrayerTimeEngine } from '../engine/math/PrayerTimeEngine';
import { QiblaEngine } from '../engine/math/QiblaEngine';
import { HijriCalendarEngine } from '../engine/math/HijriCalendarEngine';
import { MoonVisibilityEngine } from '../engine/math/MoonVisibilityEngine';
import { EclipseEngine } from '../engine/math/EclipseEngine';
import { VisibilityWorldEngine } from '../engine/math/VisibilityWorldEngine';
import { ObservatoryScheduler } from '../engine/math/ObservatoryScheduler';
import { DatasetManager } from '../infrastructure/dataset/DatasetManager';
import { DataSourceRegistry } from '../infrastructure/sources/DataSourceRegistry';
import { ObservatoryProfileRegistry } from '../infrastructure/observatories/ObservatoryProfileRegistry';
import { ValidationRunner } from '../infrastructure/validation/ValidationRunner';
import { ScientificReportGenerator } from '../infrastructure/reporting/ScientificReportGenerator';
import { ExplanationEngine } from '../knowledge/graph/ExplanationEngine';
import { TopicExplorer } from '../knowledge/graph/TopicExplorer';
import { LearningPathEngine, EducationalLevel } from '../knowledge/graph/LearningPathEngine';
import { UniversalExplanationEngine } from '../knowledge/graph/UniversalExplanationEngine';
import { CrossDomainExplorer } from '../knowledge/graph/CrossDomainExplorer';
import { LearningJourneyEngine } from '../knowledge/graph/LearningJourneyEngine';
import { BatchPredictionEngine } from './BatchPredictionEngine';
import { calculationMethods } from '../mock/calculation-methods';

export class AstronomyPlatform {
  private registry: EngineRegistry;
  private cache: AstronomyCache;
  private listeners: PlatformEventListener[] = [];
  private batchPredictor: BatchPredictionEngine;

  private static readonly VERSION: VersionMetadata = {
    engineVersion: '5.0.0',
    algorithmVersion: 'Jean Meeus (2nd Ed) / IAU 1980 / WGS84 Vincenty',
    datasetVersion: 'ADQ-Astronomy-2026.1'
  };

  constructor(
    customEngines?: RegisteredEngines,
    cacheSize: number = 500
  ) {
    // Default Dependency Injection initializer
    const defaultEngines: RegisteredEngines = {
      solarEphemerisEngine: customEngines?.solarEphemerisEngine ?? new SolarEphemerisEngine(),
      solarEventsEngine: customEngines?.solarEventsEngine ?? new SolarEventsEngine(),
      lunarEphemerisEngine: customEngines?.lunarEphemerisEngine ?? new LunarEphemerisEngine(),
      lunarPhaseEngine: customEngines?.lunarPhaseEngine ?? new LunarEphemerisEngine(),
      prayerTimeEngine: customEngines?.prayerTimeEngine ?? new PrayerTimeEngine(),
      qiblaEngine: customEngines?.qiblaEngine ?? new QiblaEngine(),
      hijriCalendarEngine: customEngines?.hijriCalendarEngine ?? new HijriCalendarEngine(),
      moonVisibilityEngine: customEngines?.moonVisibilityEngine ?? new MoonVisibilityEngine(),
      eclipseEngine: customEngines?.eclipseEngine ?? new EclipseEngine(),
      visibilityWorldEngine: customEngines?.visibilityWorldEngine ?? new VisibilityWorldEngine(),
      observatorySchedulerEngine: customEngines?.observatorySchedulerEngine ?? new ObservatoryScheduler()
    };

    this.registry = new EngineRegistry(defaultEngines);
    this.cache = new AstronomyCache(cacheSize);
    this.batchPredictor = new BatchPredictionEngine();
  }

  public addEventListener(listener: PlatformEventListener): void {
    this.listeners.push(listener);
  }

  public removeEventListener(listener: PlatformEventListener): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private emit(type: PlatformEventType, engineName?: string, message?: string, data?: unknown): void {
    const event: PlatformEvent = {
      type,
      timestamp: Date.now(),
      engineName,
      message,
      data
    };
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (e) {
        // Prevent listener error from disrupting platform
      }
    }
  }

  public getRegistry(): EngineRegistry {
    return this.registry;
  }

  public getCache(): AstronomyCache {
    return this.cache;
  }

  /**
   * Facade entry point: getDailyAstronomy
   * Unifies calculation with Lazy Evaluation, Caching, Error Isolation, & Event Emission.
   */
  public getDailyAstronomy(
    location: ObserverLocation,
    date: GregorianDate,
    options?: DailyAstronomyOptions
  ): DailyAstronomyResult {
    const startTime = performance.now();
    this.emit('beforeCalculation', 'AstronomyPlatform', 'Initiating getDailyAstronomy', { location, date, options });

    const cacheKey = this.cache.generateKey(location, date, options);
    const cachedResult = this.cache.get(cacheKey);

    if (cachedResult) {
      this.emit('cacheHit', 'AstronomyCache', `Retrieved cached calculation for key: ${cacheKey}`);
      return cachedResult;
    }

    this.emit('cacheMiss', 'AstronomyCache', `No cached entry found for key: ${cacheKey}`);

    const jd = TimeEngine.calculateJulianDate(date);
    const warnings: string[] = [];

    // Default options: All flags true unless explicitly set to false
    const opts = {
      includeSun: options?.includeSun ?? true,
      includeMoon: options?.includeMoon ?? true,
      includePrayerTimes: options?.includePrayerTimes ?? true,
      includeHijri: options?.includeHijri ?? true,
      includeQibla: options?.includeQibla ?? true,
      includeVisibility: options?.includeVisibility ?? true,
      calculationMethod: options?.calculationMethod ?? calculationMethods.find(m => m.id === 'method:mwl')!,
      hijriStrategy: options?.hijriStrategy ?? 'Astronomical',
      atmosphere: options?.atmosphere
    };

    const payload: DailyAstronomyPayload = {
      location,
      date,
      julianDate: jd,
      warnings,
      version: AstronomyPlatform.VERSION,
      computationTimeMs: 0,
      traceId: `platform-trace-${Date.now()}`
    };

    // 1. Solar Engine Lazy Execution & Error Isolation
    if (opts.includeSun) {
      try {
        const solarEphemeris = this.registry.getEngine('solarEphemerisEngine');
        const solarEvents = this.registry.getEngine('solarEventsEngine');

        if (solarEphemeris && solarEvents) {
          const coords = solarEphemeris.calculateSolarCoordinates(jd, location, opts.atmosphere).data;
          const sunrise = solarEvents.calculateEvent(jd, location, 'Sunrise', opts.atmosphere).data;
          const sunset = solarEvents.calculateEvent(jd, location, 'Sunset', opts.atmosphere).data;
          const transit = solarEvents.calculateEvent(jd, location, 'SolarNoon', opts.atmosphere).data;

          payload.sun = {
            coordinates: coords,
            events: { Sunrise: sunrise, Sunset: sunset, SolarNoon: transit }
          };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        warnings.push(`SolarEngine Error: ${msg}`);
        this.emit('warning', 'SolarEngine', msg, err);
      }
    }

    // 2. Lunar Engine Lazy Execution & Error Isolation
    if (opts.includeMoon) {
      try {
        const lunarEphemeris = this.registry.getEngine('lunarEphemerisEngine');
        const lunarPhase = this.registry.getEngine('lunarPhaseEngine');

        if (lunarEphemeris && lunarPhase) {
          const coords = lunarEphemeris.calculateLunarCoordinates(jd, location, opts.atmosphere).data;
          const phase = lunarPhase.calculatePhase(jd).data;

          payload.moon = {
            coordinates: coords,
            phase
          };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        warnings.push(`LunarEngine Error: ${msg}`);
        this.emit('warning', 'LunarEngine', msg, err);
      }
    }

    // 3. Prayer Times Engine Lazy Execution & Error Isolation
    if (opts.includePrayerTimes) {
      try {
        const prayerEngine = this.registry.getEngine('prayerTimeEngine');
        if (prayerEngine) {
          payload.prayerTimes = prayerEngine.calculatePrayerTimes(date, location, opts.calculationMethod, opts.atmosphere).data;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        warnings.push(`PrayerTimeEngine Error: ${msg}`);
        this.emit('warning', 'PrayerTimeEngine', msg, err);
      }
    }

    // 4. Hijri Calendar Engine Lazy Execution & Error Isolation
    if (opts.includeHijri) {
      try {
        const hijriEngine = this.registry.getEngine('hijriCalendarEngine');
        if (hijriEngine) {
          payload.hijri = hijriEngine.gregorianToHijri(date, opts.hijriStrategy).data;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        warnings.push(`HijriCalendarEngine Error: ${msg}`);
        this.emit('warning', 'HijriCalendarEngine', msg, err);
      }
    }

    // 5. Qibla Engine Lazy Execution & Error Isolation
    if (opts.includeQibla) {
      try {
        const qiblaEngine = this.registry.getEngine('qiblaEngine');
        if (qiblaEngine) {
          payload.qibla = qiblaEngine.calculateQibla(location).data;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        warnings.push(`QiblaEngine Error: ${msg}`);
        this.emit('warning', 'QiblaEngine', msg, err);
      }
    }

    // 6. Moon Visibility Engine Lazy Execution & Error Isolation
    if (opts.includeVisibility) {
      try {
        const visibilityEngine = this.registry.getEngine('moonVisibilityEngine');
        if (visibilityEngine) {
          payload.visibility = visibilityEngine.evaluateVisibility(jd, location, opts.atmosphere).data;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        warnings.push(`MoonVisibilityEngine Error: ${msg}`);
        this.emit('warning', 'MoonVisibilityEngine', msg, err);
      }
    }

    payload.computationTimeMs = performance.now() - startTime;
    const finalResult = Object.freeze(payload) as DailyAstronomyResult;

    this.cache.set(cacheKey, finalResult);
    this.emit('afterCalculation', 'AstronomyPlatform', 'Completed getDailyAstronomy', finalResult);

    return finalResult;
  }

  public getEclipses(year: number, location?: ObserverLocation) {
    const engine = this.registry.getRequiredEngine('eclipseEngine');
    return engine.calculateEclipses(year, location).data;
  }

  public getVisibilityGrid(date: { year: number; month: number; day: number }, resolutionDegrees: number = 5) {
    const jd = TimeEngine.calculateJulianDate(date);
    const engine = this.registry.getRequiredEngine('visibilityWorldEngine');
    return engine.generateVisibilityGrid(jd, resolutionDegrees).data;
  }

  public getObservationSchedule(date: { year: number; month: number; day: number }, location: ObserverLocation) {
    const scheduler = this.registry.getRequiredEngine('observatorySchedulerEngine');
    return scheduler.generateObservationSchedule(date, location);
  }

  public getDatasetManager() {
    return DatasetManager.getInstance();
  }

  public getDataSourceRegistry() {
    return DataSourceRegistry.getInstance();
  }

  public getObservatoryRegistry() {
    return ObservatoryProfileRegistry.getInstance();
  }

  public runValidationReport() {
    const runner = ValidationRunner.getInstance();
    const report = runner.runAllValidationSuites();
    const markdown = ScientificReportGenerator.generateMarkdownReport(report);
    return { report, markdown };
  }

  public explainTopic(nodeIdOrQuery: string) {
    const engine = new ExplanationEngine();
    return engine.explainTopic(nodeIdOrQuery);
  }

  public exploreTopic(query: string) {
    const explorer = new TopicExplorer();
    return explorer.exploreTopic(query);
  }

  public generateLearningPath(topicKey: string, level?: EducationalLevel) {
    const engine = new LearningPathEngine();
    return engine.generateLearningPath(topicKey, level);
  }

  public explainUniversalTopic(topicQuery: string) {
    const engine = new UniversalExplanationEngine();
    return engine.explain(topicQuery);
  }

  public exploreCrossDomain(query: string) {
    const explorer = new CrossDomainExplorer();
    return explorer.explore(query);
  }

  public generateLearningJourney(topicQuery: string, level?: EducationalLevel) {
    const engine = new LearningJourneyEngine();
    return engine.generateJourney(topicQuery, level);
  }

  public generateCenturyTables(startYear: number, numYears: number = 100, location?: ObserverLocation) {
    return this.batchPredictor.generateCenturyEclipseTable(startYear, numYears, location);
  }
}

// Global public singleton instance for easy imports across ADQ
export const astronomyService = new AstronomyPlatform();
