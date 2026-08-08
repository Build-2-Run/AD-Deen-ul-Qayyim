import { describe, it, expect, beforeEach } from 'vitest';
import {
  UniversalGraphRegistry,
  GraphBootstrapper,
  CanonicalNodeRegistry,
  CanonicalRelationshipRegistry,
  RelationshipRuleRegistry,
  RelationshipResolver,
  CrossDomainRelationshipBuilder,
  RelationshipRule,
  UniversalEdge
} from '../index';
import { QuranGraphIntegration } from '../integrations/QuranGraphIntegration';
import { HadithGraphIntegration } from '../integrations/HadithGraphIntegration';

describe('Cross-Domain Relationship Engine (Phase 10B.3B)', () => {
  beforeEach(() => {
    UniversalGraphRegistry.getInstance().clear();
    RelationshipRuleRegistry.getInstance().clear();
  });

  it('1. should register and resolve relationship rules', () => {
    const registry = RelationshipRuleRegistry.getInstance();

    const sampleRule: RelationshipRule = {
      ruleId: 'rule:hadith->quran-references',
      name: 'Hadith to Quran Cross Reference Rule',
      sourceDomain: 'Hadith',
      targetDomain: 'Qur\'an',
      relationType: 'references',
      evaluate: () => {
        return [];
      }
    };

    registry.registerRule(sampleRule);
    expect(registry.getAllRules().length).toBe(1);

    const resolver = new RelationshipResolver(registry);
    const resolved = resolver.findRulesBetweenDomains('Hadith', 'Qur\'an');
    expect(resolved.length).toBe(1);
    expect(resolved[0].ruleId).toBe('rule:hadith->quran-references');
  });

  it('2. should execute CrossDomainRelationshipBuilder and generate edges without duplicates', () => {
    const nodeRegistry = new CanonicalNodeRegistry();
    const relRegistry = new CanonicalRelationshipRegistry(nodeRegistry);

    // Register 2 nodes across domains
    nodeRegistry.registerNode({
      id: 'adq:hadith:bukhari:1907',
      category: 'Hadith',
      domain: 'Hadith',
      names: { english: 'Moonsighting Hadith', arabic: 'حديث صوموا لرؤيته' },
      aliases: [],
      description: 'Test',
      tags: [],
      citations: [],
      educationalLevel: 'Beginner',
      authenticity: { grade: 'SAHIH', verificationStatus: 'CANONICAL' },
      provenance: { creator: 'Test', version: '1.0', lastUpdated: '2026-07-22', license: 'MIT' }
    });

    nodeRegistry.registerNode({
      id: 'adq:quran:verse:2:189',
      category: 'QuranVerse',
      domain: 'Qur\'an',
      names: { english: 'Ahillah Verse', arabic: 'آية الأهلة' },
      aliases: [],
      description: 'Test',
      tags: [],
      citations: [],
      educationalLevel: 'Beginner',
      authenticity: { grade: 'SAHIH', verificationStatus: 'CANONICAL' },
      provenance: { creator: 'Test', version: '1.0', lastUpdated: '2026-07-22', license: 'MIT' }
    });

    // Register Cross-Domain Rule
    const ruleRegistry = RelationshipRuleRegistry.getInstance();
    ruleRegistry.registerRule({
      ruleId: 'rule:moonsighting-hadith->quran-ahillah',
      name: 'Moonsighting Hadith to Ahillah Verse',
      sourceDomain: 'Hadith',
      targetDomain: 'Qur\'an',
      relationType: 'references',
      evaluate: ({ nodeRegistry }) => {
        const edges: UniversalEdge[] = [];
        if (nodeRegistry.hasNode('adq:hadith:bukhari:1907') && nodeRegistry.hasNode('adq:quran:verse:2:189')) {
          edges.push({
            id: 'edge:rule:hadith-1907->quran-2-189',
            sourceId: 'adq:hadith:bukhari:1907',
            targetId: 'adq:quran:verse:2:189',
            relationType: 'references',
            narrative: 'Hadith 1907 explicitly cites Surah Al-Baqarah 2:189.',
            weight: 1.0,
            isBidirectional: false
          });
        }
        return edges;
      }
    });

    const builder = new CrossDomainRelationshipBuilder(ruleRegistry);
    const count1 = builder.buildCrossDomainRelationships(nodeRegistry, relRegistry);
    expect(count1).toBe(1);
    expect(relRegistry.hasRelationship('edge:rule:hadith-1907->quran-2-189')).toBe(true);

    // Re-running produces 0 duplicates
    const count2 = builder.buildCrossDomainRelationships(nodeRegistry, relRegistry);
    expect(count2).toBe(0);
  });

  it('3. should execute smoothly during end-to-end bootstrap with Quran and Hadith modules', async () => {
    const graphRegistry = UniversalGraphRegistry.getInstance();
    graphRegistry.registerModule(new QuranGraphIntegration());
    graphRegistry.registerModule(new HadithGraphIntegration());

    const ruleRegistry = RelationshipRuleRegistry.getInstance();
    ruleRegistry.registerRule({
      ruleId: 'rule:hadith-bukhari-1->quran-98-5',
      name: 'Hadith 1 to Quran 98:5',
      sourceDomain: 'Hadith',
      targetDomain: 'Qur\'an',
      relationType: 'references',
      evaluate: ({ nodeRegistry }) => {
        if (nodeRegistry.hasNode('adq:hadith:bukhari:1') && nodeRegistry.hasNode('adq:quran:verse:98:5')) {
          return [{
            id: 'edge:cd:bukhari-1->quran-98-5',
            sourceId: 'adq:hadith:bukhari:1',
            targetId: 'adq:quran:verse:98:5',
            relationType: 'references',
            narrative: 'Hadith 1 references Quranic sincerity requirement.',
            weight: 1.0,
            isBidirectional: false
          }];
        }
        return [];
      }
    });

    const bootstrapper = new GraphBootstrapper(graphRegistry);
    const result = await bootstrapper.bootstrap('test');

    expect(result.validationReport.isValid).toBe(true);
    expect(result.graph.getAllNodes().length).toBeGreaterThanOrEqual(20);
  });
});
