import {
  JulianDate,
  EngineResult,
  VisibilityGridResult,
  VisibilityGridCell,
  ObserverLocation
} from '../../models';
import { MoonVisibilityEngine } from './MoonVisibilityEngine';
import { TimeEngine } from './TimeEngine';

export class VisibilityWorldEngine {
  private visibilityEngine = new MoonVisibilityEngine();

  /**
   * Generates a global latitude/longitude visibility grid for world map rendering.
   */
  public generateVisibilityGrid(
    jd: JulianDate,
    resolutionDegrees: number = 10
  ): EngineResult<VisibilityGridResult> {
    const startTime = performance.now();
    const cells: VisibilityGridCell[] = [];

    const res = Math.max(resolutionDegrees, 2);
    const greg = TimeEngine.julianDateToGregorian(jd);
    const utcDate = `${greg.year}-${String(greg.month).padStart(2, '0')}-${String(greg.day).padStart(2, '0')}T${String(greg.hour).padStart(2, '0')}:${String(greg.minute).padStart(2, '0')}:00Z`;

    for (let lat = -60; lat <= 60; lat += res) {
      for (let lon = -180; lon < 180; lon += res) {
        const location: ObserverLocation = {
          name: `GridCell (${lat}, ${lon})`,
          coordinates: { latitude: lat, longitude: lon },
          timezone: 'UTC'
        };

        const vis = this.visibilityEngine.evaluateVisibility(jd, location).data;
        cells.push({
          latitude: lat,
          longitude: lon,
          danjonCode: vis.evaluations.danjon.code,
          yallopCode: vis.evaluations.yallop.code,
          odehCode: vis.evaluations.odeh.code,
          bruinCode: vis.evaluations.bruin.code
        });
      }
    }

    const gridResult: VisibilityGridResult = {
      julianDate: jd,
      utcDate,
      resolutionDegrees: res,
      cells
    };

    return {
      data: gridResult,
      computationTimeMs: performance.now() - startTime
    };
  }
}
