import { describe, it, expect } from 'vitest';
import { AsrEngine } from '../math/AsrEngine';
import { TimeEngine } from '../math/TimeEngine';

describe('AsrEngine', () => {
  const engine = new AsrEngine();

  const makkah = {
    name: 'Makkah',
    coordinates: { latitude: 21.4225, longitude: 39.8262 },
    timezone: 'Asia/Riyadh'
  };

  it('should compute both Standard and Hanafi Asr times', () => {
    const date = { year: 2026, month: 1, day: 1, hour: 0, minute: 0, second: 0 };
    const jd = TimeEngine.calculateJulianDate(date);
    
    const asrStandard = engine.calculateAsr(jd, makkah, 1);
    const asrHanafi = engine.calculateAsr(jd, makkah, 2);
    
    expect(asrStandard.data).not.toBeNull();
    expect(asrHanafi.data).not.toBeNull();
    
    if (asrStandard.data && asrHanafi.data) {
      // Hanafi is always later than Standard
      expect(asrStandard.data.value).toBeLessThan(asrHanafi.data.value);
    }
  });
});
