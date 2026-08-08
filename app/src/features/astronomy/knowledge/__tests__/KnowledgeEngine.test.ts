import { describe, it, expect } from 'vitest';
import { KnowledgeEngine } from '../engine/KnowledgeEngine';

describe('KnowledgeEngine Integration Tests', () => {
  const engine = new KnowledgeEngine();

  it('should retrieve historical astronomers including Al-Biruni and Ibn al-Shatir', () => {
    const astronomers = engine.getAstronomers();
    expect(astronomers.length).toBeGreaterThanOrEqual(7);

    const biruni = astronomers.find(a => a.id === 'al-biruni');
    expect(biruni).toBeDefined();
    expect(biruni?.arabicName).toContain('البيروني');
  });
});
