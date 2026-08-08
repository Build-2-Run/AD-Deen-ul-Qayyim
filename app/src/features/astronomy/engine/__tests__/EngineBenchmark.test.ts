import { describe, it, expect } from 'vitest';
import { SolarEphemerisEngine } from '../math/SolarEphemerisEngine';
import { LunarEphemerisEngine } from '../math/LunarEphemerisEngine';
import { QiblaEngine } from '../math/QiblaEngine';

describe('Astronomy Engine Performance & Throughput Benchmark', () => {
  const solarEngine = new SolarEphemerisEngine();
  const lunarEngine = new LunarEphemerisEngine();
  const qiblaEngine = new QiblaEngine();

  it('should benchmark execution performance across 1,000 iterations', () => {
    const jd = { value: 2451545.0 }; // J2000.0
    const iterations = 1000;

    // 1. Solar Benchmark
    const startSolar = performance.now();
    for (let i = 0; i < iterations; i++) {
      solarEngine.calculateSolarCoordinates(jd);
    }
    const elapsedSolar = performance.now() - startSolar;
    const solarOpsPerSec = Math.round((iterations / elapsedSolar) * 1000);

    // 2. Lunar Benchmark (60 Periodic Terms)
    const startLunar = performance.now();
    for (let i = 0; i < iterations; i++) {
      lunarEngine.calculateLunarCoordinates(jd);
    }
    const elapsedLunar = performance.now() - startLunar;
    const lunarOpsPerSec = Math.round((iterations / elapsedLunar) * 1000);

    // 3. Qibla Geodesic Benchmark
    const london = { latitude: 51.5074, longitude: -0.1278 };
    const startQibla = performance.now();
    for (let i = 0; i < iterations; i++) {
      qiblaEngine.calculateQibla({ name: 'London', coordinates: london, timezone: 'Europe/London' });
    }
    const elapsedQibla = performance.now() - startQibla;
    const qiblaOpsPerSec = Math.round((iterations / elapsedQibla) * 1000);

    console.log(`[PERFORMANCE BENCHMARK REPORT]`);
    console.log(`  Solar Ephemeris: ${elapsedSolar.toFixed(2)} ms (${solarOpsPerSec.toLocaleString()} ops/sec)`);
    console.log(`  Lunar Ephemeris (60 Terms): ${elapsedLunar.toFixed(2)} ms (${lunarOpsPerSec.toLocaleString()} ops/sec)`);
    console.log(`  Qibla Geodesic (WGS84 Vincenty): ${elapsedQibla.toFixed(2)} ms (${qiblaOpsPerSec.toLocaleString()} ops/sec)`);

    expect(elapsedSolar).toBeLessThan(1000);
    expect(elapsedLunar).toBeLessThan(2000);
    expect(elapsedQibla).toBeLessThan(1000);
  });
});
