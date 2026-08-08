import { AtmosphericConditions } from '../../models';

export interface RefractionResult {
  refractionCorrectionArcmin: number; // Refraction angle in arcminutes
  trueAltitude: number;               // Geometric altitude
  apparentAltitude: number;           // Refracted altitude
}

export interface AtmosphereModelMetadata {
  id: string;
  name: string;
  standard: string;
  defaultPressureMbar: number;
  defaultTemperatureCelsius: number;
}

export interface IAtmosphereModel {
  getMetadata(): AtmosphereModelMetadata;
  calculateRefraction(
    geometricAltitudeDegrees: number,
    conditions?: AtmosphericConditions
  ): RefractionResult;
}
