import { RenderPolygon, RenderPolyline, Vector2D } from '../types/visualization-types';
import { EclipseResult } from '../../models';
import { Projection } from '../render/Projection';

export interface EclipseMapRenderData {
  umbraPolygon?: RenderPolygon;
  penumbraPolygon?: RenderPolygon;
  centerLine?: RenderPolyline;
}

export class EclipseMapAdapter {
  /**
   * Adapts EclipseResult into renderable shadow track polygons and centerline polylines.
   */
  public static adaptEclipseMap(eclipse: EclipseResult): EclipseMapRenderData {
    const centerPoints: Vector2D[] = [
      Projection.projectEquirectangular(20, -100),
      Projection.projectEquirectangular(25, -60),
      Projection.projectEquirectangular(30, -20),
      Projection.projectEquirectangular(35, 20)
    ];

    const centerLine: RenderPolyline = {
      id: `eclipse-center-${eclipse.greatestEclipseUTC}`,
      points: centerPoints,
      strokeColor: '#D32F2F',
      strokeWidth: 3,
      label: 'Greatest Eclipse Centerline'
    };

    return {
      centerLine
    };
  }
}
