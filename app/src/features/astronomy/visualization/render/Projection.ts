import { Vector2D } from '../types/visualization-types';
import { VectorMath } from './VectorMath';

export type ProjectionType = 'stereographic' | 'orthographic' | 'equirectangular';

export class Projection {
  /**
   * Projects Horizontal Coordinates (Altitude, Azimuth) to 2D Screen Plane [-1, 1].
   */
  public static projectHorizontal(
    altitudeDeg: number,
    azimuthDeg: number,
    type: ProjectionType = 'stereographic'
  ): Vector2D {
    const isAboveHorizon = altitudeDeg >= 0;
    const azRad = VectorMath.toRadians(azimuthDeg);
    const altRad = VectorMath.toRadians(altitudeDeg);

    let r = 0;
    if (type === 'stereographic') {
      // Stereographic projection radius (Zenith = 0, Horizon = 1)
      r = Math.tan((Math.PI / 2 - altRad) / 2);
    } else if (type === 'orthographic') {
      r = Math.cos(altRad);
    } else {
      // Equirectangular / simple linear polar
      r = (90 - altitudeDeg) / 90;
    }

    // In 2D plane: North is top (0, -r), East is right (r, 0)
    const x = r * Math.sin(azRad);
    const y = -r * Math.cos(azRad);

    return {
      x: Number(x.toFixed(6)),
      y: Number(y.toFixed(6)),
      visible: isAboveHorizon
    };
  }

  /**
   * Projects Latitude/Longitude to 2D Equirectangular Map Coordinates [0, 1].
   */
  public static projectEquirectangular(latitudeDeg: number, longitudeDeg: number): Vector2D {
    const x = (longitudeDeg + 180) / 360;
    const y = (90 - latitudeDeg) / 180;
    return {
      x: Number(x.toFixed(6)),
      y: Number(y.toFixed(6)),
      visible: true
    };
  }
}
