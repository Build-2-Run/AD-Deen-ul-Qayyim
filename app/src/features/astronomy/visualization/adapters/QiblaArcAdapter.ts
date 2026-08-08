import { Vector3D } from '../types/visualization-types';
import { ObserverLocation } from '../../models';
import { VectorMath } from '../render/VectorMath';

export class QiblaArcAdapter {
  /**
   * Generates Great-Circle 3D arc vertices connecting Observer location to Kaaba in Makkah.
   */
  public static adaptQiblaArc3D(
    observer: ObserverLocation,
    numVertices: number = 32
  ): Vector3D[] {
    const startVec = VectorMath.latLonToUnitSphere(
      observer.coordinates.latitude,
      observer.coordinates.longitude
    );

    const makkahVec = VectorMath.latLonToUnitSphere(21.422487, 39.826206);
    const vertices: Vector3D[] = [];

    for (let i = 0; i <= numVertices; i++) {
      const t = i / numVertices;
      vertices.push(VectorMath.slerp3D(startVec, makkahVec, t));
    }

    return vertices;
  }
}
