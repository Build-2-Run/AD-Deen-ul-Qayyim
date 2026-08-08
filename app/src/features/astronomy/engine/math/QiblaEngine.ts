import {
  IQiblaEngine,
  QiblaResult,
  ObserverLocation,
  EngineResult
} from '../../models';
import { EngineState } from '../core/EngineState';
import { GeodesyEngine } from './Geodesy';
import { KAABA } from '../../mock/kaaba';

export class QiblaEngine implements IQiblaEngine {
  public calculateQibla(
    location: ObserverLocation
  ): EngineResult<QiblaResult> {
    const startTime = performance.now();
    const state = new EngineState();

    state.addTrace('QIBLA_START', 'Initiating Qibla calculation', {
      userLocation: location.coordinates,
      kaabaLocation: { latitude: KAABA.latitude, longitude: KAABA.longitude }
    }, null, 'Geodesic Initializer');

    const result = GeodesyEngine.inverse(
      location.coordinates,
      { latitude: KAABA.latitude, longitude: KAABA.longitude },
      state
    );

    // Calculate Great Circle Arc in degrees from distance and Earth's mean radius
    // arc = distance / R (in radians), then converted to degrees
    const meanEarthRadius = 6371008.8; // From WGS84
    const greatCircleArcRadians = result.distance / meanEarthRadius;
    const greatCircleArcDegrees = greatCircleArcRadians * (180 / Math.PI);

    const qiblaResult: QiblaResult = {
      azimuthDegrees: result.initialBearing,
      reverseBearingDegrees: result.finalBearing,
      distanceKm: result.distance / 1000,
      greatCircleArcDegrees,
      methodUsed: result.methodUsed
    };

    state.addTrace('QIBLA_COMPLETED', 'Calculated Qibla', { ...qiblaResult }, null, 'Finalization');

    return {
      data: qiblaResult,
      computationTimeMs: performance.now() - startTime
    };
  }
}
