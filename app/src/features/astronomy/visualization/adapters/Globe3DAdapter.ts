import { Vector3D } from '../types/visualization-types';
import { ObserverLocation } from '../../models';
import { VectorMath } from '../render/VectorMath';

export class Globe3DAdapter {
  /**
   * Adapts latitude and longitude coordinates to a 3D unit sphere Vector3(x, y, z).
   */
  public static adaptLocationToVector3D(location: ObserverLocation): Vector3D {
    return VectorMath.latLonToUnitSphere(
      location.coordinates.latitude,
      location.coordinates.longitude
    );
  }
}
