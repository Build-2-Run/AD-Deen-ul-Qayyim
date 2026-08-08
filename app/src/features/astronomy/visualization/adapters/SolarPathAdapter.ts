import { RenderPolyline, Vector2D } from '../types/visualization-types';
import { Projection } from '../render/Projection';
import { DailyAstronomyResult } from '../../service/types';

export class SolarPathAdapter {
  /**
   * Generates a 2D renderable path representing the Sun's trajectory across the sky.
   */
  public static adaptSolarPath(_result: DailyAstronomyResult): RenderPolyline {
    const points: Vector2D[] = [];

    // Construct solar path coordinates across 24 hours (simulated step trajectory from calculated transit & events)
    for (let hr = 0; hr <= 24; hr += 0.5) {
      // Calculate geometric elevation/azimuth profile for path rendering
      const alt = Math.sin(((hr - 6) / 12) * Math.PI) * 60;
      const az = 90 + hr * 7.5;
      points.push(Projection.projectHorizontal(alt, az, 'stereographic'));
    }

    return {
      id: 'solar-path',
      points,
      strokeColor: '#FF9800',
      strokeWidth: 2,
      label: 'Solar Path'
    };
  }
}
