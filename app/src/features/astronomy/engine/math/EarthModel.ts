/**
 * EarthModel.ts
 * 
 * Centralizes all Earth ellipsoid parameters for geodetic calculations.
 * Avoids hardcoding constants within isolated algorithms.
 */

export interface EllipsoidParameters {
  semiMajorAxis: number;      // a (meters)
  semiMinorAxis: number;      // b (meters)
  flattening: number;         // f
  eccentricitySquared: number;// e^2
  meanEarthRadius: number;    // R (meters)
}

/**
 * World Geodetic System 1984 (WGS 84)
 * The standard reference ellipsoid used by GPS and ADQ algorithms.
 */
export const WGS84: EllipsoidParameters = {
  semiMajorAxis: 6378137.0,
  semiMinorAxis: 6356752.314245,
  flattening: 1 / 298.257223563,
  eccentricitySquared: 0.00669437999014, // (a^2 - b^2) / a^2
  meanEarthRadius: 6371008.8 // IUGG mean radius
};

/**
 * Common utility function to fetch the default Earth model.
 * Currently defaults to WGS84.
 */
export function getDefaultEarthModel(): EllipsoidParameters {
  return WGS84;
}
