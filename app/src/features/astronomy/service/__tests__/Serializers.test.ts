import { describe, it, expect } from 'vitest';
import { AstronomyPlatform } from '../AstronomyPlatform';
import { Serializers } from '../Serializers';

describe('Serializers Integration Tests', () => {
  const platform = new AstronomyPlatform();
  const london = {
    name: 'London',
    coordinates: { latitude: 51.5074, longitude: -0.1278 },
    timezone: 'Europe/London'
  };

  const date = { year: 2026, month: 4, day: 1, hour: 0, minute: 0, second: 0 };
  const dailyResult = platform.getDailyAstronomy(london, date);

  it('should serialize payload to JSON', () => {
    const json = Serializers.toJSON(dailyResult);
    expect(json).toContain('"engineVersion": "5.0.0"');
  });

  it('should serialize results to CSV', () => {
    const csv = Serializers.toCSV([dailyResult]);
    expect(csv).toContain('Date,Hijri Year,Hijri Month');
    expect(csv).toContain('2026-04-01');
  });

  it('should serialize results to iCalendar (.ics)', () => {
    const ics = Serializers.toICS([dailyResult], 'London Test');
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('SUMMARY:Fajr Prayer - London');
    expect(ics).toContain('END:VCALENDAR');
  });
});
