import { describe, it, expect } from 'vitest';
import { EngineRegistry } from '../EngineRegistry';
import { SolarEphemerisEngine } from '../../engine/math/SolarEphemerisEngine';

describe('EngineRegistry Unit & Safety Tests', () => {
  it('should retrieve registered engines via getRequiredEngine', () => {
    const registry = new EngineRegistry({
      solarEphemerisEngine: new SolarEphemerisEngine()
    });

    const engine = registry.getRequiredEngine('solarEphemerisEngine');
    expect(engine).toBeDefined();
  });

  it('should throw descriptive error when getting missing required engine', () => {
    const registry = new EngineRegistry();
    expect(() => registry.getRequiredEngine('lunarEphemerisEngine')).toThrow(
      "Required astronomy engine 'lunarEphemerisEngine' is not registered in EngineRegistry."
    );
  });
});
