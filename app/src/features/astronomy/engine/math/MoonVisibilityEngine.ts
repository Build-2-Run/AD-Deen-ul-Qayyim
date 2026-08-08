import {
  IMoonVisibilityEngine,
  JulianDate,
  ObserverLocation,
  AtmosphericConditions,
  CrescentParameters,
  MoonVisibilityResult,
  EngineResult
} from '../../models';
import { EngineState } from '../core/EngineState';
import { SolarEventsEngine } from './SolarEventsEngine';
import { SolarEphemerisEngine } from './SolarEphemerisEngine';
import { LunarEphemerisEngine } from './LunarEphemerisEngine';
import { CoordinateEngine } from './CoordinateEngine';
import { NewMoonEngine } from './NewMoonEngine';
import { ObservationEngine } from './ObservationEngine';
import { toDegrees, toRadians } from './MathUtils';

export class MoonVisibilityEngine implements IMoonVisibilityEngine {
  private solarEventsEngine = new SolarEventsEngine();
  private solarEphemerisEngine = new SolarEphemerisEngine();
  private lunarEphemerisEngine = new LunarEphemerisEngine();
  private newMoonEngine = new NewMoonEngine();
  private observationEngine = new ObservationEngine();

  public calculateCrescentParameters(
    jd: JulianDate,
    location: ObserverLocation,
    atmosphere?: AtmosphericConditions
  ): EngineResult<CrescentParameters> {
    const startTime = performance.now();
    const state = new EngineState();

    state.addTrace('VISIBILITY_START', 'Initiating Crescent Parameters Calculation', {
      jd: jd.value,
      location: location.name
    });

    // 1. Calculate Sunset on the given date
    const sunsetResult = this.solarEventsEngine.calculateEvent(jd, location, 'Sunset', atmosphere);
    const sunsetJD = sunsetResult.data ?? jd;

    state.addTrace('SUNSET_CALCULATED', 'Calculated Sunset time', { sunsetJD: sunsetJD.value });

    // 2. Solar coordinates at Sunset
    const solarCoords = this.solarEphemerisEngine.calculateSolarCoordinates(sunsetJD, location, atmosphere).data;

    // 3. Lunar coordinates at Sunset
    const lunarCoords = this.lunarEphemerisEngine.calculateLunarCoordinates(sunsetJD, location, atmosphere).data;

    // Convert Solar and Lunar Equatorial coordinates to Topocentric Horizontal (Alt/Az)
    const solarHoriz = solarCoords.horizontal ?? CoordinateEngine.equatorialToHorizontal(
      sunsetJD,
      solarCoords.equatorial,
      location
    );

    const lunarHoriz = lunarCoords.horizontal ?? CoordinateEngine.equatorialToHorizontal(
      sunsetJD,
      lunarCoords.equatorial,
      location
    );

    state.addTrace('SOLAR_LUNAR_POSITIONS', 'Computed Altitudes and Azimuths at Sunset', {
      solarAltitude: solarHoriz.altitude,
      solarAzimuth: solarHoriz.azimuth,
      lunarAltitude: lunarHoriz.altitude,
      lunarAzimuth: lunarHoriz.azimuth
    });

    // 4. Conjunction time prior to Sunset
    const conjunctionEvent = this.newMoonEngine.calculatePreviousConjunction(sunsetJD).data;
    const conjunctionJD = { value: conjunctionEvent.trueConjunctionJD };

    // Moon Age at Sunset (hours)
    const moonAgeHours = (sunsetJD.value - conjunctionJD.value) * 24;

    // 5. Elongation / Arc of Light (ARCL) - angular separation between Sun and Moon
    // Right ascension is stored in DEGREES in this engine (CoordinateEngine
    // returns raDeg), so convert straight to radians — do NOT treat it as hours.
    const sunRA = toRadians(solarCoords.equatorial.rightAscension);
    const sunDec = toRadians(solarCoords.equatorial.declination);
    const moonRA = toRadians(lunarCoords.equatorial.rightAscension);
    const moonDec = toRadians(lunarCoords.equatorial.declination);

    const cosElongation = Math.sin(sunDec) * Math.sin(moonDec) +
                          Math.cos(sunDec) * Math.cos(moonDec) * Math.cos(sunRA - moonRA);
    const elongationDegrees = toDegrees(Math.acos(Math.max(-1, Math.min(1, cosElongation))));

    state.addTrace('ARCL_CALCULATED', 'Arc of Light (Elongation) computed', { elongationDegrees });

    // 6. Arc of Vision (ARCV) - Altitude difference between Moon and Sun at Sunset
    // At Sunset, Sun's center is approx -0.833° or 0° depending on geometric vs apparent.
    const arcOfVisionDegrees = lunarHoriz.altitude - solarHoriz.altitude;

    // 7. Relative Azimuth (DAZ)
    let relativeAzimuthDegrees = Math.abs(lunarHoriz.azimuth - solarHoriz.azimuth);
    if (relativeAzimuthDegrees > 180) {
      relativeAzimuthDegrees = 360 - relativeAzimuthDegrees;
    }

    // 8. Crescent Width W (in arcminutes)
    // Semi-diameter of moon in arcminutes SD' ~ 0.2724 * pi / R * (180/pi)*60 ... 
    // Approx SD = (angularDiameter in deg / 2) * 60 arcminutes
    const lunarSemiDiameterArcmin = (lunarCoords.angularDiameter / 2) * 60;
    // Crescent width W = SD' * (1 - cos(ARCL))
    const crescentWidthArcmin = lunarSemiDiameterArcmin * (1 - cosElongation);

    state.addTrace('CRESCENT_GEOMETRY', 'Computed ARCV, DAZ, and Crescent Width W', {
      arcOfVisionDegrees,
      relativeAzimuthDegrees,
      crescentWidthArcmin
    });

    // 9. Approximate Lag Time (Moonset - Sunset in minutes)
    // 1 degree altitude ~ 4 minutes of time, or find exact moonset
    // Approximate lag time from lunar altitude and setting rate:
    const lagTimeMinutes = Math.max(0, (lunarHoriz.altitude - (-0.5667)) * 4);
    
    let moonsetJD: JulianDate | null = null;
    if (lagTimeMinutes > 0) {
      moonsetJD = { value: sunsetJD.value + (lagTimeMinutes / 1440) };
    }

    const crescentParams: CrescentParameters = {
      conjunctionTime: conjunctionJD,
      sunset: sunsetJD,
      moonset: moonsetJD,
      lagTimeMinutes,
      moonAgeHours,
      // Illuminated fraction from the phase (elongation) angle: k = (1 − cos e) / 2.
      illuminationFraction: (1 - cosElongation) / 2,
      elongation: elongationDegrees,
      arcOfLight: elongationDegrees,
      arcOfVision: arcOfVisionDegrees,
      relativeAzimuth: relativeAzimuthDegrees,
      lunarAltitude: lunarHoriz.altitude,
      solarAltitude: solarHoriz.altitude,
      lunarAzimuth: lunarHoriz.azimuth,
      solarAzimuth: solarHoriz.azimuth,
      crescentWidth: crescentWidthArcmin,
      horizontalParallax: 0.95, // ~57 arcmin in deg
      refractionCorrection: 0.5667
    };

    return {
      data: crescentParams,
      computationTimeMs: performance.now() - startTime
    };
  }

  public evaluateVisibility(
    jd: JulianDate,
    location: ObserverLocation,
    atmosphere?: AtmosphericConditions
  ): EngineResult<MoonVisibilityResult> {
    const startTime = performance.now();
    const paramsResult = this.calculateCrescentParameters(jd, location, atmosphere);
    const params = paramsResult.data;

    // Evaluate all criteria concurrently using ObservationEngine
    const evaluations = this.observationEngine.evaluateAllCriteria(params);

    // Compute confidence level based on proximity to Danjon & Yallop threshold boundaries
    let confidence: 'Low' | 'Medium' | 'High' = 'High';
    if (params.elongation < 7.5 && params.elongation >= 6.5) {
      confidence = 'Low'; // Borderline Danjon limit
    } else if (evaluations.yallop.code === 'C' || evaluations.yallop.code === 'D') {
      confidence = 'Medium'; // Optical aid threshold zone
    }

    const result: MoonVisibilityResult = {
      parameters: params,
      evaluations,
      confidence,
      traceId: 'visibility-trace-' + Date.now()
    };

    return {
      data: result,
      computationTimeMs: performance.now() - startTime
    };
  }
}
