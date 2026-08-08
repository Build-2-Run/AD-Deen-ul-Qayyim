import { describe, it, expect } from 'vitest';
import { BatchPredictionEngine } from '../BatchPredictionEngine';

describe('BatchPredictionEngine Long-Range Tests', () => {
  const predictor = new BatchPredictionEngine();

  it('should generate long-range multi-year eclipse tables', async () => {
    const eclipses = await predictor.generateCenturyEclipseTable(2026, 5);
    expect(eclipses.length).toBeGreaterThan(0);
    expect(eclipses[0].greatestEclipseUTC).toBeDefined();
  });

  it('should generate long-range multi-year Hijri year tables', async () => {
    const hijri = await predictor.generateCenturyHijriTable(2026, 3);
    expect(hijri.length).toBe(3);
  });
});
