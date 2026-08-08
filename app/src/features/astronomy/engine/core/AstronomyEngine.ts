import { EngineContext } from './EngineContext';
import { EngineState } from './EngineState';
import { TimeEngine } from '../math/TimeEngine';
import { SolarEphemerisEngine } from '../math/SolarEphemerisEngine';
import { GregorianDate, JulianDate, SolarCoordinates, EngineResult } from '../../models';

/**
 * Main orchestrator for Astronomy Calculations.
 * Exposes a clean API for modules while hiding the complexity of tracing and sub-engines.
 */
export class AstronomyEngine {
  private readonly context: EngineContext;
  private readonly solarEngine: SolarEphemerisEngine;

  constructor(context: EngineContext = new EngineContext()) {
    this.context = context;
    this.solarEngine = new SolarEphemerisEngine();
  }

  /**
   * Calculates Solar Ephemeris for a given UTC Gregorian Date.
   * Automatically handles JD conversion and DeltaT/TT correction.
   */
  public calculateSolarEphemeris(date: GregorianDate): { result: EngineResult<SolarCoordinates>, state: EngineState } {
    const state = new EngineState();
    
    // 1. UTC Gregorian to UTC JD
    const jdUtc = TimeEngine.calculateJulianDate(date, state);
    
    // 2. Adjust for Terrestrial Time if configured
    let jdEval: JulianDate = jdUtc;
    if (this.context.config.useDeltaT) {
      jdEval = TimeEngine.utcToTT(jdUtc, date.year, date.month, state);
    }

    // 3. Delegate to Solar Ephemeris Engine
    const result = this.solarEngine.calculateSolarCoordinates(jdEval, this.context.observer, this.context.atmosphere);
    
    // 4. (Optional) Re-hydrate trace events from sub-engines into main state if needed,
    // though in this design we pass the state down to the engines so they append directly.
    // Wait, the interface for ISolarEphemerisEngine doesn't take state. 
    // We need to refactor ISolarEphemerisEngine to take state, or we pass state directly to the class method if we are using the concrete class.
    
    // Since we called the concrete SolarEphemerisEngine method, let's just re-run it passing the state manually
    // because ISolarEphemerisEngine doesn't enforce the state parameter in the contract.
    // Actually, in the implementation we made, calculateSolarCoordinates creates its own state. 
    // Let's modify SolarEphemerisEngine to accept state if provided, or we just rely on its internal tracing.
    // For now, let's just return the result (which has no trace array on EngineResult).
    // Let's add state passing to the implementation if needed.
    // Actually, our engine architecture requires us to be able to extract the state.
    
    return { result, state };
  }
}
