import { describe, it, expect, beforeEach } from 'vitest';
import {
  CanonicalNodeRegistry,
  CanonicalRelationshipRegistry,
  UniversalGraphRegistry,
  GraphBootstrapper,
  ModuleGraphIntegration,
  UniversalNode,
  UniversalEdge,
  KnowledgeDomainType
} from '../index';

// Import backward compatibility shims to verify legacy re-exports
import { UniversalNode as ShimNode } from '../../../features/astronomy/knowledge/graph/models/UniversalNode';
import { UniversalKnowledgeGraph as ShimGraph } from '../../../features/astronomy/knowledge/graph/models/UniversalKnowledgeGraph';

describe('Platform Knowledge Framework (Phase 10B.1B)', () => {
  beforeEach(() => {
    UniversalGraphRegistry.getInstance().clear();
  });

  it('1. should validate canonical stable ID format syntax (adq:<domain>:<type>:<id>)', () => {
    const registry = new CanonicalNodeRegistry();

    expect(registry.validateStableIdFormat('adq:quran:surah:2')).toBe(true);
    expect(registry.validateStableIdFormat('adq:quran:ayah:2:185')).toBe(true);
    expect(registry.validateStableIdFormat('adq:hadith:bukhari:1907')).toBe(true);
    expect(registry.validateStableIdFormat('adq:astronomy:sun')).toBe(true);
    expect(registry.validateStableIdFormat('adq:node:water')).toBe(true); // Legacy format compatibility

    expect(registry.validateStableIdFormat('invalid-id')).toBe(false);
    expect(registry.validateStableIdFormat('adq:sun')).toBe(false);
    expect(registry.validateStableIdFormat('')).toBe(false);
  });

  it('2. should enforce node immutability (Object.freeze)', () => {
    const registry = new CanonicalNodeRegistry();
    const node: UniversalNode = {
      id: 'adq:test:node:1',
      category: 'TestCategory',
      domain: 'Astronomy',
      names: { english: 'Test Node', arabic: 'عنصر تجريبي' },
      aliases: ['test'],
      description: 'A test node for immutability verification.',
      tags: ['test'],
      citations: [],
      educationalLevel: 'Beginner',
      authenticity: { grade: 'SAHIH', verificationStatus: 'CANONICAL' },
      provenance: { creator: 'Test', version: '1.0', lastUpdated: '2026-07-22', license: 'MIT' }
    };

    registry.registerNode(node);
    const retrieved = registry.getNode('adq:test:node:1');

    expect(retrieved).toBeDefined();
    expect(Object.isFrozen(retrieved)).toBe(true);
  });

  it('3. should reject duplicate node ID registrations', () => {
    const registry = new CanonicalNodeRegistry();
    const node: UniversalNode = {
      id: 'adq:test:node:duplicate',
      category: 'TestCategory',
      domain: 'Astronomy',
      names: { english: 'Test', arabic: 'تجربة' },
      aliases: [],
      description: 'Test',
      tags: [],
      citations: [],
      educationalLevel: 'Beginner',
      authenticity: { grade: 'SAHIH', verificationStatus: 'CANONICAL' },
      provenance: { creator: 'Test', version: '1.0', lastUpdated: '2026-07-22', license: 'MIT' }
    };

    registry.registerNode(node);
    expect(() => registry.registerNode(node)).toThrow(/Duplicate Node Error/);
  });

  it('4. should reject relationship pointing to non-existent endpoints', () => {
    const nodeRegistry = new CanonicalNodeRegistry();
    const relRegistry = new CanonicalRelationshipRegistry(nodeRegistry);

    const edge: UniversalEdge = {
      id: 'edge:test:invalid',
      sourceId: 'adq:nonexistent:node:1',
      targetId: 'adq:nonexistent:node:2',
      relationType: 'explains',
      narrative: 'Test',
      weight: 1.0,
      isBidirectional: false
    };

    expect(() => relRegistry.registerRelationship(edge)).toThrow(/Invalid Edge Endpoint Error/);
  });

  it('5. should sort module integrations deterministically by priority integer', () => {
    const registry = UniversalGraphRegistry.getInstance();

    const moduleA: ModuleGraphIntegration = {
      getModuleId: () => 'astronomy',
      getDomain: () => 'Astronomy' as KnowledgeDomainType,
      getPriority: () => 400,
      registerNodes: () => {},
      registerRelationships: () => {}
    };

    const moduleB: ModuleGraphIntegration = {
      getModuleId: () => 'quran',
      getDomain: () => 'Qur\'an' as KnowledgeDomainType,
      getPriority: () => 100,
      registerNodes: () => {},
      registerRelationships: () => {}
    };

    registry.registerModule(moduleA);
    registry.registerModule(moduleB);

    const ordered = registry.getOrderedIntegrations();
    expect(ordered[0].getModuleId()).toBe('quran');
    expect(ordered[1].getModuleId()).toBe('astronomy');
  });

  it('6. should complete full bootstrap sequence and stamp semantic versioning', async () => {
    const registry = UniversalGraphRegistry.getInstance();

    const mockIntegration: ModuleGraphIntegration = {
      getModuleId: () => 'mock-module',
      getDomain: () => 'Nature' as KnowledgeDomainType,
      getPriority: () => 150,
      registerNodes: (nodeReg) => {
        nodeReg.registerNode({
          id: 'adq:nature:element:water',
          category: 'Element',
          domain: 'Nature',
          names: { english: 'Water', arabic: 'الماء' },
          aliases: ['h2o'],
          description: 'Water element',
          tags: ['water'],
          citations: [],
          educationalLevel: 'Beginner',
          authenticity: { grade: 'SAHIH', verificationStatus: 'CANONICAL' },
          provenance: { creator: 'Test', version: '1.0', lastUpdated: '2026-07-22', license: 'MIT' }
        });

        nodeReg.registerNode({
          id: 'adq:worship:act:wudu',
          category: 'Worship',
          domain: 'Worship',
          names: { english: 'Wudu', arabic: 'الوضوء' },
          aliases: ['ablution'],
          description: 'Wudu act',
          tags: ['wudu'],
          citations: [],
          educationalLevel: 'Beginner',
          authenticity: { grade: 'SAHIH', verificationStatus: 'CANONICAL' },
          provenance: { creator: 'Test', version: '1.0', lastUpdated: '2026-07-22', license: 'MIT' }
        });
      },
      registerRelationships: (relReg) => {
        relReg.registerRelationship({
          id: 'edge:water->wudu',
          sourceId: 'adq:nature:element:water',
          targetId: 'adq:worship:act:wudu',
          relationType: 'legal ruling for',
          narrative: 'Water is required for Wudu.',
          weight: 1.0,
          isBidirectional: false
        });
      }
    };

    registry.registerModule(mockIntegration);

    const bootstrapper = new GraphBootstrapper(registry);
    const result = await bootstrapper.bootstrap('test');

    expect(result.graph.getAllNodes().length).toBe(2);
    expect(result.graph.getAllEdges().length).toBe(1);
    expect(result.version.version).toBe('1.0.0');
    expect(result.version.schemaVersion).toBe('1.0.0');
    expect(result.validationReport.isValid).toBe(true);
    expect(result.validationReport.orphanNodesCount).toBe(0);
    expect(result.validationReport.hasCycles).toBe(false);
  });

  it('7. should maintain backward compatibility through re-export shims', () => {
    const testNode: ShimNode = {
      id: 'adq:astronomy:sun',
      category: 'Star',
      domain: 'Astronomy',
      names: { english: 'Sun', arabic: 'الشمس' },
      aliases: [],
      description: 'The Sun',
      tags: [],
      citations: [],
      educationalLevel: 'Beginner',
      authenticity: { grade: 'SAHIH', verificationStatus: 'CANONICAL' },
      provenance: { creator: 'Test', version: '1.0', lastUpdated: '2026-07-22', license: 'MIT' }
    };

    const graph = new ShimGraph();
    graph.addNode(testNode);

    expect(graph.getNode('adq:astronomy:sun')?.names.english).toBe('Sun');
  });
});
