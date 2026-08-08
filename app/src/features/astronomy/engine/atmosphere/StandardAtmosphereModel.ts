import { IAtmosphereModel, AtmosphereModelMetadata, RefractionResult } from './IAtmosphereModel';
import { AtmosphericConditions } from '../../models';
import { toRadians } from '../math/MathUtils';

export class StandardAtmosphereModel implements IAtmosphereModel {
  public getMetadata(): AtmosphereModelMetadata {
    return {
      id: 'StandardAtmosphere',
      name: 'Standard ISO/ICAO Atmospheric Model',
      standard: 'Meeus Chapter 16 / Bennett Formula',
      defaultPressureMbar: 1010,
      defaultTemperatureCelsius: 10
    };
  }

  public calculateRefraction(
    geometricAltitudeDegrees: number,
    conditions?: AtmosphericConditions
  ): RefractionResult {
    const P = conditions?.pressure ?? 1010;
    const T = conditions?.temperature ?? 10;
    const h = geometricAltitudeDegrees;

    if (h < -0.9) {
      return { refractionCorrectionArcmin: 0, trueAltitude: h, apparentAltitude: h };
    }

    // Bennett's formula for atmospheric refraction (Meeus Eq 16.4) in arcminutes
    const hRad = toRadians(h + 7.31 / (h + 4.4));
    const R0 = 1.02 / Math.tan(hRad); // Refraction in arcminutes for standard 1010 mbar & 10 deg C

    // Temperature and pressure correction multiplier
    const Pmult = P / 1010;
    const Tmult = 283 / (273 + T);
    const R = R0 * Pmult * Tmult;

    const apparentAltitude = h + R / 60;

    return {
      refractionCorrectionArcmin: R,
      trueAltitude: h,
      apparentAltitude
    };
  }
}
