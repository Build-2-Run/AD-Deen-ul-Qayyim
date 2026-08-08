import { describe, it, expect } from 'vitest';
import { EducationalModuleEngine } from '../engine/EducationalModuleEngine';

describe('EducationalModuleEngine Integration Tests', () => {
  const engine = new EducationalModuleEngine();

  it('should load educational modules with 3 levels', () => {
    const mod = engine.getModuleById('module-prayer-sun');
    expect(mod).toBeDefined();
    expect(mod?.levels.Beginner).toBeDefined();
    expect(mod?.levels.Intermediate).toBeDefined();
    expect(mod?.levels.Advanced).toBeDefined();
  });
});
