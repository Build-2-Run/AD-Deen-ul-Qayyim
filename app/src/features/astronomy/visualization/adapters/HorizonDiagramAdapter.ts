import { RenderArc, RenderLabel, SkyObjectMarker } from '../types/visualization-types';
import { DailyAstronomyResult } from '../../service/types';

export interface HorizonDiagramRenderData {
  horizonRing: RenderArc;
  cardinalLabels: RenderLabel[];
  markers: SkyObjectMarker[];
}

export class HorizonDiagramAdapter {
  /**
   * Generates 360° cardinal compass cross-sections (N, E, S, W) with Solar and Lunar markers.
   */
  public static adaptHorizonDiagram(_result: DailyAstronomyResult): HorizonDiagramRenderData {
    const horizonRing: RenderArc = {
      id: 'horizon-ring',
      center: { x: 0, y: 0 },
      radius: 1.0,
      startAngleRad: 0,
      endAngleRad: Math.PI * 2,
      strokeColor: '#B0BEC5'
    };

    const cardinalLabels: RenderLabel[] = [
      { text: 'N', position: { x: 0, y: -1.1 }, fontSize: 14, color: '#D32F2F', anchor: 'middle' },
      { text: 'E', position: { x: 1.1, y: 0 }, fontSize: 14, color: '#FFFFFF', anchor: 'start' },
      { text: 'S', position: { x: 0, y: 1.1 }, fontSize: 14, color: '#FFFFFF', anchor: 'middle' },
      { text: 'W', position: { x: -1.1, y: 0 }, fontSize: 14, color: '#FFFFFF', anchor: 'end' }
    ];

    // Sun/Moon markers can be derived from _result.sun / _result.moon when the
    // worship-facing horizon view is built. Star/planet plotting was removed
    // with the celestial subsystem.
    const markers: SkyObjectMarker[] = [];

    return {
      horizonRing,
      cardinalLabels,
      markers
    };
  }
}
