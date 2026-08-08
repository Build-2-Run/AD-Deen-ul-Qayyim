import { Vector2D } from '../types/visualization-types';

export class CoordinateNormalizer {
  /**
   * Normalizes a [-1, 1] vector to custom canvas viewport dimensions (width, height).
   */
  public static toViewport(point: Vector2D, width: number, height: number): Vector2D {
    const x = ((point.x + 1) / 2) * width;
    const y = ((1 - point.y) / 2) * height; // Invert Y axis for standard screen coordinates
    return {
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      visible: point.visible
    };
  }

  /**
   * Clamps value into [min, max] range.
   */
  public static clamp(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, val));
  }
}
