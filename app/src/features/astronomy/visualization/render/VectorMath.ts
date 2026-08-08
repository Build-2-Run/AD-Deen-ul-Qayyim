import { Vector3D } from '../types/visualization-types';

export class VectorMath {
  public static toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180.0;
  }

  public static toDegrees(radians: number): number {
    return (radians * 180.0) / Math.PI;
  }

  public static latLonToUnitSphere(latitudeDeg: number, longitudeDeg: number): Vector3D {
    const latRad = VectorMath.toRadians(latitudeDeg);
    const lonRad = VectorMath.toRadians(longitudeDeg);

    const x = Math.cos(latRad) * Math.cos(lonRad);
    const y = Math.cos(latRad) * Math.sin(lonRad);
    const z = Math.sin(latRad);

    return { x, y, z };
  }

  public static dot3D(a: Vector3D, b: Vector3D): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  public static cross3D(a: Vector3D, b: Vector3D): Vector3D {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x
    };
  }

  public static normalize3D(v: Vector3D): Vector3D {
    const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    if (mag === 0) return { x: 0, y: 0, z: 0 };
    return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
  }

  /**
   * Spherical Linear Interpolation (Slerp) between two 3D unit vectors.
   */
  public static slerp3D(start: Vector3D, end: Vector3D, t: number): Vector3D {
    let dot = VectorMath.dot3D(start, end);
    dot = Math.max(-1.0, Math.min(1.0, dot));

    const omega = Math.acos(dot);
    if (Math.abs(omega) < 1e-6) return start;

    const sinOmega = Math.sin(omega);
    const scaleStart = Math.sin((1 - t) * omega) / sinOmega;
    const scaleEnd = Math.sin(t * omega) / sinOmega;

    return {
      x: scaleStart * start.x + scaleEnd * end.x,
      y: scaleStart * start.y + scaleEnd * end.y,
      z: scaleStart * start.z + scaleEnd * end.z
    };
  }
}
