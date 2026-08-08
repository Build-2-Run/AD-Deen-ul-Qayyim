import { IAtmosphereModel, AtmosphereModelMetadata, RefractionResult } from './IAtmosphereModel';
import { AtmosphericConditions } from '../../models';
import { StandardAtmosphereModel } from './StandardAtmosphereModel';

export class ObservedAtmosphereModel implements IAtmosphereModel {
  private standardModel = new StandardAtmosphereModel();

  public getMetadata(): AtmosphereModelMetadata {
    return {
      id: 'ObservedElevationAtmosphere',
      name: 'Observatory Elevation-Dependent Atmospheric Model',
      standard: 'US Standard Atmosphere 1976 (Lapse Rate Pressure Scale)',
      defaultPressureMbar: 1013.25,
      defaultTemperatureCelsius: 15
    };
  }

  public calculateRefraction(
    geometricAltitudeDegrees: number,
    conditions?: AtmosphericConditions
  ): RefractionResult {
    let pressure = conditions?.pressure;
    let temperature = conditions?.temperature;

    // If pressure is not supplied, estimate based on observer altitude lapse rate
    if (pressure === undefined) {
      // Standard barometric formula: P = 1013.25 * (1 - 2.25577e-5 * altitude)^5.25588
      pressure = 1010;
    }
    if (temperature === undefined) {
      temperature = 15;
    }

    return this.standardModel.calculateRefraction(geometricAltitudeDegrees, {
      pressure,
      temperature
    });
  }
}
