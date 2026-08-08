import { describe, it, expect } from 'vitest';
import { DatasetManager } from '../dataset/DatasetManager';
import { DataSourceRegistry } from '../sources/DataSourceRegistry';
import { ScientificCacheManager } from '../cache/ScientificCacheManager';
import { ObservatoryProfileRegistry } from '../observatories/ObservatoryProfileRegistry';
import { ValidationRunner } from '../validation/ValidationRunner';
import { ScientificReportGenerator } from '../reporting/ScientificReportGenerator';
import { AstronomyPlatform } from '../../service/AstronomyPlatform';

describe('Scientific Infrastructure Suite (Phase 9A)', () => {
  const platform = new AstronomyPlatform();

  it('should manage and verify registered datasets with provenance', () => {
    const dsManager = DatasetManager.getInstance();
    const bsc5 = dsManager.getDataset('yale-bright-star-bsc5');

    expect(bsc5).toBeDefined();
    expect(bsc5?.name).toContain('Yale Bright Star');
    expect(bsc5?.sha256Checksum).toBeDefined();

    const verification = dsManager.verifyDataset('yale-bright-star-bsc5');
    expect(verification.isValid).toBe(true);
    expect(verification.checksumMatches).toBe(true);
  });

  it('should list external data sources without hardcoded URLs', () => {
    const sources = DataSourceRegistry.getInstance().getSources();
    expect(sources.length).toBeGreaterThanOrEqual(6);

    const jpl = DataSourceRegistry.getInstance().getSourceById('jpl-ssd');
    expect(jpl?.name).toContain('Horizons');
    expect(jpl?.supportedFormats).toContain('JSON');
  });

  it('should store and retrieve lazy values from ScientificCacheManager', () => {
    const cache = ScientificCacheManager.getInstance();
    cache.clear();

    const val = cache.getOrLoad('test-key', () => 42, 60000);
    expect(val).toBe(42);
    expect(cache.get('test-key')).toBe(42);
  });

  it('should retrieve authoritative observatory profiles', () => {
    const registry = ObservatoryProfileRegistry.getInstance();
    const profiles = registry.getProfiles();

    expect(profiles.length).toBeGreaterThanOrEqual(8);
    const noaa = registry.getProfileById('noaa-esrl');
    expect(noaa?.name).toContain('NOAA');
    expect(noaa?.location.coordinates.elevation).toBe(1655);
  });

  it('should execute ValidationRunner and generate Markdown report', () => {
    const runner = ValidationRunner.getInstance();
    const report = runner.runAllValidationSuites();

    expect(report.overallPassRatePercentage).toBe(100.0);
    expect(report.totalSuites).toBe(9);

    const md = ScientificReportGenerator.generateMarkdownReport(report);
    expect(md).toContain('# Scientific Data Infrastructure & Platform Audit Report');
    expect(md).toContain('Overall Pass Rate');
  });

  it('should access all scientific infrastructure via AstronomyPlatform facade', () => {
    const ds = platform.getDatasetManager();
    const sources = platform.getDataSourceRegistry();
    const obs = platform.getObservatoryRegistry();
    const reportRes = platform.runValidationReport();

    expect(ds).toBeDefined();
    expect(sources).toBeDefined();
    expect(obs).toBeDefined();
    expect(reportRes.report.overallPassRatePercentage).toBe(100.0);
    expect(reportRes.markdown.length).toBeGreaterThan(100);
  });
});
