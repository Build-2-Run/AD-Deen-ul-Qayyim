import { describe, it, expect } from 'vitest';
import { BatchGenerator } from '../BatchGenerator';
import { calculationMethods } from '../../mock/calculation-methods';

describe('BatchGenerator Integration Tests', () => {
  const batch = new BatchGenerator();
  const makkah = {
    name: 'Makkah',
    coordinates: { latitude: 21.4225, longitude: 39.8262 },
    timezone: 'Asia/Riyadh'
  };
  const mwlMethod = calculationMethods.find(m => m.id === 'method:mwl')!;

  it('should generate a monthly prayer calendar asynchronously', async () => {
    const calendar = await batch.generatePrayerCalendar(makkah, mwlMethod, 2026, 4);
    expect(calendar).toHaveLength(30); // April has 30 days
    expect(calendar[0].prayerTimes).toBeDefined();
  });

  it('should generate a yearly Hijri calendar mapping', async () => {
    const hijriCal = await batch.generateHijriCalendar(2026, 'Astronomical');
    expect(hijriCal).toHaveLength(12);
    expect(hijriCal[0].year).toBeDefined();
  });
});
