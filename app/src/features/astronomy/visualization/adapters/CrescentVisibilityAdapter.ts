import { VisibilityContour, RenderPolygon, Vector2D } from '../types/visualization-types';
import { VisibilityGridResult } from '../../models';
import { Projection } from '../render/Projection';
import { ColorPalettes } from '../render/ColorPalettes';

export class CrescentVisibilityAdapter {
  /**
   * Adapts VisibilityGridResult into renderable contour polygon layers.
   */
  public static adaptVisibilityContours(
    gridResult: VisibilityGridResult,
    criterion: 'Yallop' | 'Odeh' | 'Danjon' = 'Yallop'
  ): VisibilityContour[] {
    const contoursMap = new Map<string, RenderPolygon[]>();

    for (const cell of gridResult.cells) {
      const code = criterion === 'Yallop' ? cell.yallopCode : (criterion === 'Odeh' ? cell.odehCode : cell.danjonCode);
      const points: Vector2D[] = [
        Projection.projectEquirectangular(cell.latitude, cell.longitude),
        Projection.projectEquirectangular(cell.latitude + gridResult.resolutionDegrees, cell.longitude),
        Projection.projectEquirectangular(cell.latitude + gridResult.resolutionDegrees, cell.longitude + gridResult.resolutionDegrees),
        Projection.projectEquirectangular(cell.latitude, cell.longitude + gridResult.resolutionDegrees)
      ];

      const palette = criterion === 'Yallop' ? ColorPalettes.Yallop : (criterion === 'Odeh' ? ColorPalettes.Odeh : ColorPalettes.Danjon);
      const colorHex = palette[code] ?? '#90A4AE';

      const poly: RenderPolygon = {
        id: `grid-${cell.latitude}-${cell.longitude}`,
        points,
        fillColor: colorHex,
        strokeColor: 'transparent',
        opacity: 0.6,
        label: `Category ${code}`
      };

      if (!contoursMap.has(code)) contoursMap.set(code, []);
      contoursMap.get(code)!.push(poly);
    }

    const contours: VisibilityContour[] = [];
    for (const [code, polys] of contoursMap.entries()) {
      const palette = criterion === 'Yallop' ? ColorPalettes.Yallop : (criterion === 'Odeh' ? ColorPalettes.Odeh : ColorPalettes.Danjon);
      contours.push({
        categoryCode: code,
        classification: `Visibility Category ${code}`,
        colorHex: palette[code] ?? '#90A4AE',
        polygons: polys
      });
    }

    return contours;
  }
}
