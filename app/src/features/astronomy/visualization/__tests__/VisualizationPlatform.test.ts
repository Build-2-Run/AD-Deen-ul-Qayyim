import { describe, it, expect } from 'vitest';
import { visualizationPlatform } from '../VisualizationPlatform';
import { astronomyService } from '../../service/AstronomyPlatform';

describe('VisualizationPlatform Facade Integration Tests', () => {
  const makkah = {
    name: 'Makkah',
    coordinates: { latitude: 21.4225, longitude: 39.8262 },
    timezone: 'Asia/Riyadh'
  };
  const date = { year: 2026, month: 4, day: 1 };
  const dailyResult = astronomyService.getDailyAstronomy(makkah, date);

  it('should generate all visualization adapter outputs via facade', () => {
    const solarPath = visualizationPlatform.generateSolarPath(dailyResult);
    expect(solarPath.points.length).toBeGreaterThan(10);

    const timeline = visualizationPlatform.generatePrayerTimeline(dailyResult);
    expect(timeline.length).toBe(6);

    const horizon = visualizationPlatform.generateHorizonDiagram(dailyResult);
    expect(horizon.cardinalLabels.length).toBe(4);

    const qiblaArc = visualizationPlatform.generateQiblaArc(makkah, 10);
    expect(qiblaArc.length).toBe(11);
  });
});
