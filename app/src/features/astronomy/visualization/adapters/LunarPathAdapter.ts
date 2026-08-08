import { RenderPolyline, Vector2D } from '../types/visualization-types';
import { Projection } from '../render/Projection';
import { DailyAstronomyResult } from '../../service/types';

export class LunarPathAdapter {
  /**
   * Generates a 2D renderable path representing the Moon's trajectory across the sky.
   */
  public static adaptLunarPath(_result: DailyAstronomyResult): RenderPolyline {
    const points: Vector2D[] = [];

    for (let hr = 0; hr <= 24; hr += 0.5) {
      const alt = Math.sin(((hr - 8) / 12) * Math.PI) * 45;
      const az = 100 + hr * 7.5;
      points.push(Projection.projectHorizontal(alt, az, 'stereographic'));
    }

    return {
      id: 'lunar-path',
      points,
      strokeColor: '#9E9E9E',
      strokeWidth: 2,
      strokeDashArray: [4, 4],
      label: 'Lunar Path'
    };
  }
}
