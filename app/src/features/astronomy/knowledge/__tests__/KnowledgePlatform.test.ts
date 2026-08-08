import { describe, it, expect } from 'vitest';
import { knowledgePlatform } from '../KnowledgePlatform';

describe('KnowledgePlatform Facade Integration Tests', () => {
  it('should search knowledge base across citations, terms, and astronomers', () => {
    const res = knowledgePlatform.searchKnowledge('sun');
    expect(res.citations.length).toBeGreaterThan(0);
  });

  it('should retrieve educational modules and astronomers via facade', () => {
    const astronomers = knowledgePlatform.getHistoricalAstronomers();
    expect(astronomers.length).toBeGreaterThan(5);

    const mod = knowledgePlatform.getEducationalModule('module-prayer-sun');
    expect(mod).toBeDefined();
  });
});
