import { describe, it, expect } from 'vitest';
import { VisibilityWorldEngine } from '../math/VisibilityWorldEngine';
import { TimeEngine } from '../math/TimeEngine';

describe('VisibilityWorldEngine Integration Tests', () => {
  const engine = new VisibilityWorldEngine();

  it('should generate a 30-degree global visibility grid', () => {
    const jd = TimeEngine.calculateJulianDate({ year: 2026, month: 4, day: 1 });
    const res = engine.generateVisibilityGrid(jd, 30);

    expect(res.data.resolutionDegrees).toBe(30);
    expect(res.data.cells.length).toBeGreaterThan(10);
    expect(res.data.cells[0].yallopCode).toBeDefined();
  });
});
