import { describe, it, expect } from 'vitest';
import { HijriCalendarEngine } from '../math/HijriCalendarEngine';

describe('HijriCalendarEngine', () => {
  const engine = new HijriCalendarEngine();

  it('should mathematically convert Gregorian to Astronomical Hijri and identify month boundary', () => {
    // Let's test a date near Ramadan 1445 AH (around March 11-12, 2024)
    const date = { year: 2024, month: 3, day: 13, hour: 12, minute: 0, second: 0 };
    
    const result = engine.gregorianToHijri(date, 'Astronomical');
    const hijri = result.data;
    
    expect(hijri).not.toBeNull();
    // 2024 March corresponds to Ramadan 1445
    expect(hijri.year).toBe(1445);
    expect(hijri.month).toBe(9); // Ramadan
    expect(hijri.monthName).toBe('Ramadan');
    
    // Day should be positive and valid
    expect(hijri.day).toBeGreaterThan(0);
    expect(hijri.day).toBeLessThanOrEqual(30);
  });

  it('should reverse Astronomical Hijri to approximate Gregorian', () => {
    const hijriDate = { year: 1445, month: 9, day: 1 };
    const result = engine.hijriToGregorian(hijriDate, 'Astronomical');
    
    const greg = result.data;
    
    // 1 Ramadan 1445 was roughly March 11, 2024 (depending on astronomical vs observational)
    expect(greg.year).toBe(2024);
    expect(greg.month).toBe(3);
    // Should be very close to the 11th or 12th
    expect(greg.day).toBeGreaterThanOrEqual(10);
    expect(greg.day).toBeLessThanOrEqual(13);
  });
});
