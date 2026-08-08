import { describe, it, expect } from 'vitest';
import { GlossaryEngine } from '../engine/GlossaryEngine';

describe('GlossaryEngine Integration Tests', () => {
  const engine = new GlossaryEngine();

  it('should retrieve terms by ID', () => {
    const hilal = engine.getTermById('hilal');
    expect(hilal).toBeDefined();
    expect(hilal?.termArabic).toBe('الهلال');
  });

  it('should search multilingual terms', () => {
    const res = engine.searchGlossary('twilight');
    expect(res.length).toBeGreaterThan(0);
  });
});
