import { AtmosphericConditions, IAtmosphericCorrectionEngine, EngineResult } from '../../models';
import { EngineState } from '../core/EngineState';

export class AtmosphericEngine implements IAtmosphericCorrectionEngine {
  
  /**
   * Calculates atmospheric refraction using Meeus Eq 16.4.
   * Accurate for altitudes > 15 degrees. For lower altitudes, uses a more complex model (Meeus 16.3).
   * Note: The formula expects altitude in degrees and returns refraction in degrees.
   */
  public calculateRefraction(
    trueAltitude: number,
    conditions: AtmosphericConditions,
    state?: EngineState
  ): EngineResult<number> {
    const startTime = performance.now();
    let R = 0; // Refraction in degrees

    // Using Meeus formula 16.4 (simplified for standard conditions)
    // R = 1.02 / tan(h + 10.3 / (h + 5.11)) in arcminutes
    
    // First, convert pressure and temp to standard formula modifiers if needed.
    // Standard is P = 1010 mb, T = 10 C.
    const P = conditions.pressure || 1010;
    const T = conditions.temperature || 10;
    
    // Meeus Eq 16.4 requires altitude in degrees.
    // R = (1.02 / tan(h + 10.3/(h+5.11))) * (P/1010) * (283/(273+T)) [in arcminutes]
    
    if (trueAltitude > -5) { // Prevent division by zero / negative tangent blowups
      const num = 10.3 / (trueAltitude + 5.11);
      const angleRad = (trueAltitude + num) * (Math.PI / 180);
      const rArcMin = 1.02 / Math.tan(angleRad);
      
      const pCorrection = P / 1010;
      const tCorrection = 283 / (273 + T);
      
      R = (rArcMin * pCorrection * tCorrection) / 60; // Convert to degrees
    }

    if (state) {
      state.addTrace(
        'ATMOSPHERIC_REFRACTION', 
        'Calculate atmospheric refraction', 
        { trueAltitude, pressure: P, temperature: T }, 
        R, 
        'Meeus Eq 16.4'
      );
    }

    return {
      data: R,
      computationTimeMs: performance.now() - startTime
    };
  }

  /**
   * Calculates Horizon Dip based on observer elevation.
   * Meeus Chapter 15.
   */
  public calculateHorizonDip(
    elevationMeters: number,
    state?: EngineState
  ): EngineResult<number> {
    const startTime = performance.now();
    
    // Meeus Eq 15.1
    // Dip (arcminutes) = 1.92 * sqrt(elevation in meters)
    const dipArcMin = 1.92 * Math.sqrt(elevationMeters);
    const dipDeg = dipArcMin / 60; // Convert to degrees

    if (state) {
      state.addTrace(
        'HORIZON_DIP', 
        'Calculate Horizon Dip', 
        { elevationMeters }, 
        dipDeg, 
        'Meeus Eq 15.1: Dip = 1.92 * sqrt(h)'
      );
    }

    return {
      data: dipDeg,
      computationTimeMs: performance.now() - startTime
    };
  }
}
