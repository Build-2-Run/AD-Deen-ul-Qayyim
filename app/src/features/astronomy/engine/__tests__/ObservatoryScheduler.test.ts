import { describe, it, expect } from 'vitest';
import { ObservatoryScheduler } from '../math/ObservatoryScheduler';

describe('ObservatoryScheduler Integration Tests', () => {
  const scheduler = new ObservatoryScheduler();
  const makkah = {
    name: 'Makkah',
    coordinates: { latitude: 21.4225, longitude: 39.8262 },
    timezone: 'Asia/Riyadh'
  };

  it('should generate observation schedule for Makkah', () => {
    const date = { year: 2026, month: 4, day: 1 };
    const res = scheduler.generateObservationSchedule(date, makkah);

    expect(res.data.bestObservationWindow.start).toBeDefined();
    expect(res.data.astronomicalNightStart).toBeDefined();
  });
});
