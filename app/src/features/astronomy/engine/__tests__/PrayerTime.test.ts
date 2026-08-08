import { describe, it, expect } from 'vitest';
import { PrayerTimeEngine } from '../math/PrayerTimeEngine';
import { TimeEngine } from '../math/TimeEngine';
import { calculationMethods } from '../../mock/calculation-methods';

describe('PrayerTimeEngine', () => {
  const engine = new PrayerTimeEngine();

  const makkah = {
    name: 'Makkah',
    coordinates: { latitude: 21.4225, longitude: 39.8262 },
    timezone: 'Asia/Riyadh'
  };

  const london = {
    name: 'London',
    coordinates: { latitude: 51.5074, longitude: -0.1278 },
    timezone: 'Europe/London'
  };

  const srinagar = {
    name: 'Srinagar',
    coordinates: { latitude: 34.0837, longitude: 74.7973, elevation: 1585 },
    timezone: 'Asia/Kolkata',
    elevation: 1585,
  };

  const ummAlQura = calculationMethods.find(m => m.id === 'method:umm_al_qura')!;
  const mwl = calculationMethods.find(m => m.id === 'method:mwl')!;
  const karachi = calculationMethods.find(m => m.id === 'method:karachi')!;

  // Convert a Julian Date to its calendar day in a given IANA timezone.
  const dayInTz = (jdValue: number, timeZone: string) =>
    new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })
      .format(new Date((jdValue - 2440587.5) * 86400000));

  it('should calculate standard prayer times for Makkah (Umm al-Qura)', () => {
    const date = { year: 2026, month: 1, day: 1, hour: 0, minute: 0, second: 0 };
    const jd = TimeEngine.calculateJulianDate(date);
    
    const result = engine.calculatePrayerTimes(jd, makkah, ummAlQura);
    const times = result.data;
    
    expect(times.fajr).not.toBeNull();
    expect(times.sunrise).not.toBeNull();
    expect(times.dhuhr).not.toBeNull();
    expect(times.asrStandard).not.toBeNull();
    expect(times.asrHanafi).not.toBeNull();
    expect(times.maghrib).not.toBeNull();
    expect(times.isha).not.toBeNull();

    // Chronological order verification
    expect(times.fajr!.value).toBeLessThan(times.sunrise!.value);
    expect(times.sunrise!.value).toBeLessThan(times.dhuhr!.value);
    expect(times.dhuhr!.value).toBeLessThan(times.asrStandard!.value);
    expect(times.asrStandard!.value).toBeLessThan(times.asrHanafi!.value);
    expect(times.asrHanafi!.value).toBeLessThan(times.maghrib!.value);
    expect(times.maghrib!.value).toBeLessThan(times.isha!.value);

    // Umm al-Qura Isha is 90 mins (0.0625 days) after Maghrib
    const diff = times.isha!.value - times.maghrib!.value;
    expect(diff).toBeCloseTo(90 / 1440, 4);
  });

  it('should calculate standard prayer times for London (MWL)', () => {
    const date = { year: 2026, month: 4, day: 1, hour: 0, minute: 0, second: 0 };
    const jd = TimeEngine.calculateJulianDate(date);
    
    const result = engine.calculatePrayerTimes(jd, london, mwl);
    const times = result.data;

    expect(times.fajr).not.toBeNull();
    expect(times.isha).not.toBeNull();
  });

  // Regression: for a far-east longitude the pre-dawn Fajr falls before the
  // local date's 0h UT. The engine used to wrap the day-fraction and return
  // Fajr one calendar day ahead of that morning's sunrise. Fajr must be the
  // first prayer of the SAME Gregorian date, preceding sunrise.
  it('should place Fajr before sunrise on the same Gregorian date (Srinagar)', () => {
    const date = { year: 2026, month: 7, day: 29, hour: 0, minute: 0, second: 0 };
    const jd = TimeEngine.calculateJulianDate(date);
    const times = engine.calculatePrayerTimes(jd, srinagar, karachi).data;

    expect(times.fajr).not.toBeNull();
    expect(times.sunrise).not.toBeNull();

    expect(times.fajr!.value).toBeLessThan(times.sunrise!.value);
    expect(dayInTz(times.fajr!.value, srinagar.timezone)).toBe('2026-07-29');
    expect(dayInTz(times.sunrise!.value, srinagar.timezone)).toBe('2026-07-29');
  });
});
