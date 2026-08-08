import { DailyAstronomyResult } from '../service/types';
import { ObserverLocation, VisibilityGridResult, EclipseResult } from '../models';
import { SolarPathAdapter } from './adapters/SolarPathAdapter';
import { LunarPathAdapter } from './adapters/LunarPathAdapter';
import { PrayerTimelineAdapter } from './adapters/PrayerTimelineAdapter';
import { CrescentVisibilityAdapter } from './adapters/CrescentVisibilityAdapter';
import { EclipseMapAdapter } from './adapters/EclipseMapAdapter';
import { Globe3DAdapter } from './adapters/Globe3DAdapter';
import { QiblaArcAdapter } from './adapters/QiblaArcAdapter';
import { HorizonDiagramAdapter } from './adapters/HorizonDiagramAdapter';

export class VisualizationPlatform {
  public generateSolarPath(result: DailyAstronomyResult) {
    return SolarPathAdapter.adaptSolarPath(result);
  }

  public generateMoonPath(result: DailyAstronomyResult) {
    return LunarPathAdapter.adaptLunarPath(result);
  }

  public generatePrayerTimeline(result: DailyAstronomyResult) {
    return PrayerTimelineAdapter.adaptPrayerTimeline(result);
  }

  public generateVisibilityMap(gridResult: VisibilityGridResult, criterion?: 'Yallop' | 'Odeh' | 'Danjon') {
    return CrescentVisibilityAdapter.adaptVisibilityContours(gridResult, criterion);
  }

  public generateEclipseMap(eclipse: EclipseResult) {
    return EclipseMapAdapter.adaptEclipseMap(eclipse);
  }

  public generateGlobe(location: ObserverLocation) {
    return Globe3DAdapter.adaptLocationToVector3D(location);
  }

  public generateQiblaArc(observer: ObserverLocation, numVertices?: number) {
    return QiblaArcAdapter.adaptQiblaArc3D(observer, numVertices);
  }

  public generateHorizonDiagram(result: DailyAstronomyResult) {
    return HorizonDiagramAdapter.adaptHorizonDiagram(result);
  }
}

export const visualizationPlatform = new VisualizationPlatform();
