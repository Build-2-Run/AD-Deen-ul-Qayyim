import { describe, it, expect } from 'vitest';
import { UniversalRelationshipEngine } from '../UniversalRelationshipEngine';
import { UniversalExplanationEngine } from '../UniversalExplanationEngine';
import { CrossDomainExplorer } from '../CrossDomainExplorer';
import { LearningJourneyEngine } from '../LearningJourneyEngine';
import { AstronomyPlatform } from '../../../service/AstronomyPlatform';

describe('ADQ Universal Knowledge Graph Foundation (Phase 10A)', () => {
  const relEngine = new UniversalRelationshipEngine();
  const graph = relEngine.getGraph();
  const expEngine = new UniversalExplanationEngine(relEngine);
  const explorer = new CrossDomainExplorer(relEngine);
  const journeyEngine = new LearningJourneyEngine(relEngine);
  const platform = new AstronomyPlatform();

  it('should maintain universal graph integrity, valid nodes, and multilingual consistency', () => {
    const nodes = graph.getAllNodes();
    const edges = graph.getAllEdges();

    expect(nodes.length).toBeGreaterThanOrEqual(6);
    expect(edges.length).toBeGreaterThanOrEqual(4);

    for (const node of nodes) {
      expect(node.id).toContain('adq:node:');
      expect(node.names.english.length).toBeGreaterThan(0);
      expect(node.names.arabic.length).toBeGreaterThan(0);
      expect(node.domain).toBeDefined();
      expect(node.authenticity.verificationStatus).toBe('CANONICAL');
    }
  });

  it('should verify zero orphan nodes in the universal knowledge graph', () => {
    const orphans = graph.findOrphanNodes();
    expect(orphans.length).toBe(0);
  });

  it('should verify zero circular relationship cycles in directional flow', () => {
    const hasCycle = graph.detectCycles();
    expect(hasCycle).toBe(false);
  });

  it('should generate multi-domain explanation chains in UniversalExplanationEngine', () => {
    const exp = expEngine.explain('water');

    expect(exp.primaryNode.names.english).toContain('Water');
    expect(exp.steps.length).toBeGreaterThanOrEqual(2);
    expect(exp.crossDomainSummary).toContain('domain(s)');
    expect(exp.steps[0].citations.length).toBeGreaterThan(0);
  });

  it('should explore cross-domain clusters via CrossDomainExplorer for Water, Honey, Makkah, and Ramadan', () => {
    const waterExp = explorer.explore('water');
    const honeyExp = explorer.explore('honey');
    const makkahExp = explorer.explore('makkah');
    const ramadanExp = explorer.explore('ramadan');

    expect(waterExp.connectedDomains.length).toBeGreaterThan(0);
    expect(honeyExp.connectedDomains.length).toBeGreaterThan(0);
    expect(makkahExp.connectedDomains.length).toBeGreaterThan(0);
    expect(ramadanExp.connectedDomains.length).toBeGreaterThan(0);
  });

  it('should generate 9-step multi-discipline learning journey across domains', () => {
    const journey = journeyEngine.generateJourney('water', 'Intermediate');

    expect(journey.title).toContain('Water');
    expect(journey.steps.length).toBe(9);
    expect(journey.disciplinesCovered.length).toBeGreaterThan(1);
    expect(journey.steps[0].phase).toBe('Qur\'an Verse');
  });

  it('should expose the 14 Fundamental Questions on canonical nodes', () => {
    const waterNode = graph.getNode('adq:node:water');
    expect(waterNode?.fundamentalQuestions).toBeDefined();
    expect(waterNode?.fundamentalQuestions?.whatIsIt).toBeDefined();
    expect(waterNode?.fundamentalQuestions?.whyIsItImportant).toBeDefined();
    expect(waterNode?.fundamentalQuestions?.whereIsItMentioned).toBeDefined();
    expect(waterNode?.fundamentalQuestions?.howIsItConnected).toBeDefined();
  });

  it('should access Universal Knowledge Graph capabilities via AstronomyPlatform facade', () => {
    const exp = platform.explainUniversalTopic('honey');
    const explorerRes = platform.exploreCrossDomain('makkah');
    const journey = platform.generateLearningJourney('ramadan', 'Advanced');

    expect(exp.primaryNode.names.english).toContain('Honey');
    expect(explorerRes.connectedDomains.length).toBeGreaterThan(0);
    expect(journey.steps.length).toBe(9);
  });
});
