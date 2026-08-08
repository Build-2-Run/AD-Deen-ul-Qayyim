import { describe, it, expect } from 'vitest';
import { RelationshipEngine } from '../RelationshipEngine';
import { ExplanationEngine } from '../ExplanationEngine';
import { TopicExplorer } from '../TopicExplorer';
import { LearningPathEngine } from '../LearningPathEngine';
import { AstronomyPlatform } from '../../../service/AstronomyPlatform';

describe('Quran–Astronomy Knowledge Graph & Explainable Relationships (Phase 9B)', () => {
  const relEngine = new RelationshipEngine();
  const graph = relEngine.getGraph();
  const expEngine = new ExplanationEngine(relEngine);
  const explorer = new TopicExplorer(relEngine);
  const pathEngine = new LearningPathEngine(relEngine);
  const platform = new AstronomyPlatform();

  it('should maintain graph integrity, valid nodes, and consistent edge links', () => {
    const nodes = graph.getAllNodes();
    const edges = graph.getAllEdges();

    expect(nodes.length).toBeGreaterThanOrEqual(8);
    expect(edges.length).toBeGreaterThanOrEqual(6);

    for (const edge of edges) {
      expect(graph.getNode(edge.sourceId)).toBeDefined();
      expect(graph.getNode(edge.targetId)).toBeDefined();
      expect(edge.relationType).toBeDefined();
      expect(edge.description.length).toBeGreaterThan(0);
    }
  });

  it('should verify zero circular relationship cycles in directional flow', () => {
    const hasCycle = graph.detectCycles();
    expect(hasCycle).toBe(false);
  });

  it('should synthesize step-by-step reasoning tree in ExplanationEngine', () => {
    const explanation = expEngine.explainTopic('Sun');

    expect(explanation.targetNode.label).toContain('Sun');
    expect(explanation.steps.length).toBeGreaterThanOrEqual(2);
    expect(explanation.conclusion).toContain('connects');
    expect(explanation.steps[0].citations.length).toBeGreaterThan(0);
  });

  it('should explore related topics via TopicExplorer for Sun, Moon, Ramadan, and Prayer', () => {
    const sunRes = explorer.exploreTopic('Sun');
    const moonRes = explorer.exploreTopic('Moon');
    const ramadanRes = explorer.exploreTopic('Ramadan');
    const prayerRes = explorer.exploreTopic('Prayer');

    expect(sunRes.relatedNodes.length).toBeGreaterThan(0);
    expect(moonRes.relatedNodes.length).toBeGreaterThan(0);
    expect(ramadanRes.relatedNodes.length).toBeGreaterThan(0);
    expect(prayerRes.relatedNodes.length).toBeGreaterThan(0);
  });

  it('should generate progressive educational learning path', () => {
    const path = pathEngine.generateLearningPath('Sun', 'Intermediate');

    expect(path.topicTitle).toContain('Solar Mechanics');
    expect(path.steps.length).toBe(9);
    expect(path.level).toBe('Intermediate');
    expect(path.steps[0].title).toBe('The Sun (Al-Shams)');
  });

  it('should access Knowledge Graph capabilities via AstronomyPlatform facade', () => {
    const exp = platform.explainTopic('sun');
    const expTopic = platform.exploreTopic('ramadan');
    const path = platform.generateLearningPath('sun', 'Advanced');

    expect(exp.targetNode).toBeDefined();
    expect(expTopic.relatedNodes.length).toBeGreaterThan(0);
    expect(path.steps.length).toBe(9);
  });
});
