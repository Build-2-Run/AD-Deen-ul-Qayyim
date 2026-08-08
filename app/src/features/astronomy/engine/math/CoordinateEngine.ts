import { EclipticCoordinates, EquatorialCoordinates, HorizontalCoordinates, JulianDate, ObserverLocation } from '../../models';
import { EngineState } from '../core/EngineState';
import { toRadians, toDegrees, normalizeDegrees } from './MathUtils';
import { TimeEngine } from './TimeEngine';

export class CoordinateEngine {
  /**
   * Converts Ecliptic Coordinates (Longitude, Latitude) to Equatorial Coordinates (Right Ascension, Declination).
   * Meeus Chapter 13.
   */
  public static eclipticToEquatorial(
    ecliptic: EclipticCoordinates,
    obliquity: number,
    state?: EngineState
  ): EquatorialCoordinates {
    const lam = toRadians(ecliptic.eclipticLongitude);
    const bet = toRadians(ecliptic.eclipticLatitude);
    const eps = toRadians(obliquity);

    // RA = atan2(sin(lam)*cos(eps) - tan(bet)*sin(eps), cos(lam))
    const raRad = Math.atan2(
      Math.sin(lam) * Math.cos(eps) - Math.tan(bet) * Math.sin(eps),
      Math.cos(lam)
    );
    let raDeg = normalizeDegrees(toDegrees(raRad));

    // Dec = asin(sin(bet)*cos(eps) + cos(bet)*sin(eps)*sin(lam))
    const decRad = Math.asin(
      Math.sin(bet) * Math.cos(eps) + Math.cos(bet) * Math.sin(eps) * Math.sin(lam)
    );
    const decDeg = toDegrees(decRad);

    if (state) {
      state.addTrace(
        'ECLIPTIC_TO_EQUATORIAL',
        'Convert Ecliptic to Equatorial Coordinates',
        { lambda: ecliptic.eclipticLongitude, beta: ecliptic.eclipticLatitude, epsilon: obliquity },
        { rightAscension: raDeg, declination: decDeg },
        'Meeus Eq 13.3, 13.4'
      );
    }

    return { rightAscension: raDeg, declination: decDeg, distance: ecliptic.distance };
  }

  /**
   * Converts Equatorial Coordinates to Horizontal Coordinates (Azimuth, Altitude)
   * for a specific observer and time.
   */
  public static equatorialToHorizontal(
    jd: JulianDate,
    equatorial: EquatorialCoordinates,
    location: ObserverLocation,
    state?: EngineState
  ): HorizontalCoordinates {
    const haDeg = this.calculateHourAngle(jd, equatorial.rightAscension, location.coordinates.longitude, state);
    const H = toRadians(haDeg);
    const lat = toRadians(location.coordinates.latitude);
    const dec = toRadians(equatorial.declination);

    // Altitude = asin(sin(lat)*sin(dec) + cos(lat)*cos(dec)*cos(H))
    const altRad = Math.asin(
      Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(H)
    );

    // Azimuth = atan2(sin(H), cos(H)*sin(lat) - tan(dec)*cos(lat))
    // Note: Astronomers measure Azimuth from South towards West. Navigators measure from North towards East.
    // We will use standard North = 0, East = 90 format.
    let azRad = Math.atan2(
      Math.sin(H),
      Math.cos(H) * Math.sin(lat) - Math.tan(dec) * Math.cos(lat)
    );
    
    // Convert to North-based Azimuth
    let azDeg = normalizeDegrees(toDegrees(azRad) + 180);
    const altDeg = toDegrees(altRad);

    if (state) {
      state.addTrace(
        'EQUATORIAL_TO_HORIZONTAL',
        'Convert Equatorial to Horizontal Coordinates',
        { HA: haDeg, lat: location.coordinates.latitude, dec: equatorial.declination },
        { azimuth: azDeg, altitude: altDeg },
        'Meeus Eq 13.5, 13.6 (adjusted for North=0)'
      );
    }

    return { azimuth: azDeg, altitude: altDeg };
  }

  /**
   * Calculates the apparent Greenwich Sidereal Time (GST) at 0h UT.
   */
  public static calculateGreenwichSiderealTime(jd: JulianDate, state?: EngineState): number {
    const T = TimeEngine.calculateJulianCentury(jd, state);
    
    // Meeus Eq 12.4
    let gmst = 280.46061837 + 360.98564736629 * (jd.value - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000.0;
    gmst = normalizeDegrees(gmst);

    if (state) {
      state.addTrace('GMST', 'Calculate Greenwich Mean Sidereal Time', { jd: jd.value, T }, gmst, 'Meeus Eq 12.4');
    }

    return gmst;
  }

  /**
   * Calculates the Hour Angle (HA) for an object at a given RA for a specific longitude.
   */
  public static calculateHourAngle(
    jd: JulianDate,
    rightAscension: number,
    longitude: number,
    state?: EngineState
  ): number {
    const gmst = this.calculateGreenwichSiderealTime(jd, state);
    // Local Sidereal Time = GMST + Longitude (if East is positive)
    let lst = normalizeDegrees(gmst + longitude);
    
    // Hour Angle = LST - RA
    let ha = normalizeDegrees(lst - rightAscension);

    if (state) {
      state.addTrace('HOUR_ANGLE', 'Calculate Hour Angle (HA)', { gmst, longitude, rightAscension, lst }, ha, 'HA = LST - RA');
    }

    return ha;
  }

  /**
   * Converts Geocentric Equatorial Coordinates to Topocentric Equatorial Coordinates.
   * Corrects for the observer's position on the Earth's surface (Parallax).
   * Meeus Chapter 40.
   */
  public static geocentricToTopocentric(
    jd: JulianDate,
    geocentric: EquatorialCoordinates,
    equatorialHorizontalParallax: number,
    location: ObserverLocation,
    state?: EngineState
  ): EquatorialCoordinates {
    const H = this.calculateHourAngle(jd, geocentric.rightAscension, location.coordinates.longitude, state);
    
    const lat = location.coordinates.latitude;
    const elevation = location.elevation || 0;
    const a = 6378.14; // Earth equatorial radius in km
    const f = 1 / 298.257; // Earth flattening
    const b = a * (1 - f); // Polar radius

    // Calculate rho*sin(phi\') and rho*cos(phi\') (Meeus Eq 11.1, 11.2)
    const latRad = toRadians(lat);
    const u = Math.atan((b / a) * Math.tan(latRad));
    const rhoSinPhiPrime = (b / a) * Math.sin(u) + (elevation / 1000 / a) * Math.sin(latRad);
    const rhoCosPhiPrime = Math.cos(u) + (elevation / 1000 / a) * Math.cos(latRad);

    const piRad = toRadians(equatorialHorizontalParallax);
    const decRad = toRadians(geocentric.declination);
    const hRad = toRadians(H);

    // Delta RA (Meeus Eq 40.2)
    const deltaRaRad = Math.atan2(
      -rhoCosPhiPrime * Math.sin(piRad) * Math.sin(hRad),
      Math.cos(decRad) - rhoCosPhiPrime * Math.sin(piRad) * Math.cos(hRad)
    );
    const deltaRaDeg = toDegrees(deltaRaRad);
    
    let topocentricRA = normalizeDegrees(geocentric.rightAscension + deltaRaDeg);

    // Topocentric Declination (Meeus Eq 40.3)
    const topocentricDecRad = Math.atan2(
      (Math.sin(decRad) - rhoSinPhiPrime * Math.sin(piRad)) * Math.cos(deltaRaRad),
      Math.cos(decRad) - rhoCosPhiPrime * Math.sin(piRad) * Math.cos(hRad)
    );
    const topocentricDec = toDegrees(topocentricDecRad);

    if (state) {
      state.addTrace(
        'GEOCENTRIC_TO_TOPOCENTRIC',
        'Convert Geocentric to Topocentric Equatorial',
        { RA: geocentric.rightAscension, Dec: geocentric.declination, parallax: equatorialHorizontalParallax },
        { topocentricRA, topocentricDec },
        'Meeus Eq 40.2, 40.3'
      );
    }

    return {
      rightAscension: topocentricRA,
      declination: topocentricDec,
      distance: geocentric.distance // Distance varies slightly topocentrically, but often omitted unless specifically needed
    };
  }
}
