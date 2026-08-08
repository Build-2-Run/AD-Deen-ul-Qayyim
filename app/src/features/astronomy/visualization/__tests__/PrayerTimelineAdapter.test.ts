import { describe, it, expect } from 'vitest';
import { PrayerTimelineAdapter } from '../adapters/PrayerTimelineAdapter';
import { AstronomyPlatform } from '../../service/AstronomyPlatform';

describe('PrayerTimelineAdapter Integration Tests', () => {
  const platform = new AstronomyPlatform();
  const makkah = {
    name: 'Makkah',
    coordinates: { latitude: 21.4225, longitude: 39.8262 },
    timezone: 'Asia/Riyadh'
  };
  const date = { year: 2026, month: 4, day: 1 };
  const dailyResult = platform.getDailyAstronomy(makkah, date);

  it('should adapt prayer times into 24-hour linear timeline segments', () => {
    const segments = PrayerTimelineAdapter.adaptPrayerTimeline(dailyResult);
    expect(segments.length).toBe(6);
    expect(segments[0].startPercent).toBeGreaterThanOrEqual(0);
    expect(segments[5].endPercent).toBe(100);
  });
});
