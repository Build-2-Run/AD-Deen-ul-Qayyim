import { describe, it, expect, beforeEach } from 'vitest';
import {
  OntologyRegistry,
  OntologyResolver,
  OntologyConcept
} from '../index';

describe('Canonical Ontology Framework (Phase 10B.3C)', () => {
  beforeEach(() => {
    OntologyRegistry.getInstance().resetToDefaults();
  });

  it('1. should resolve term aliases to canonical ontology concepts', () => {
    const resolver = new OntologyResolver();

    // Prayer aliases
    expect(resolver.resolveConceptId('salah')).toBe('adq:ontology:concept:prayer');
    expect(resolver.resolveConceptId('salat')).toBe('adq:ontology:concept:prayer');
    expect(resolver.resolveConceptId('namaz')).toBe('adq:ontology:concept:prayer');

    // Ramadan aliases
    expect(resolver.resolveConceptId('ramazan')).toBe('adq:ontology:concept:ramadan');
    expect(resolver.resolveConceptId('ramadhan')).toBe('adq:ontology:concept:ramadan');

    // Crescent Moon aliases
    expect(resolver.resolveConceptId('hilal')).toBe('adq:ontology:concept:crescent-moon');
    expect(resolver.resolveConceptId('crescent')).toBe('adq:ontology:concept:crescent-moon');

    // Inheritance aliases
    expect(resolver.resolveConceptId('mirath')).toBe('adq:ontology:concept:inheritance');
    expect(resolver.resolveConceptId('faraid')).toBe('adq:ontology:concept:inheritance');
  });

  it('2. should enforce canonical concept ID syntax (adq:ontology:concept:<slug>)', () => {
    const registry = OntologyRegistry.getInstance();

    const invalidConcept: OntologyConcept = {
      id: 'invalid:id:syntax',
      slug: 'invalid-slug',
      domain: 'Nature',
      names: { english: 'Invalid', arabic: 'غير صالح' },
      aliases: ['invalid'],
      description: 'Invalid concept test'
    };

    expect(() => registry.registerConcept(invalidConcept)).toThrow(
      /Invalid Ontology ID Error/
    );
  });

  it('3. should reject duplicate concept IDs and duplicate slugs', () => {
    const registry = OntologyRegistry.getInstance();

    const duplicateIdConcept: OntologyConcept = {
      id: 'adq:ontology:concept:prayer', // Already exists in defaults
      slug: 'new-prayer-slug',
      domain: 'Worship',
      names: { english: 'Prayer 2', arabic: 'صلاة 2' },
      aliases: ['new-prayer-alias'],
      description: 'Duplicate ID test'
    };

    expect(() => registry.registerConcept(duplicateIdConcept)).toThrow(
      /Duplicate Ontology Concept Error/
    );

    const duplicateSlugConcept: OntologyConcept = {
      id: 'adq:ontology:concept:unique-id-1',
      slug: 'prayer', // Slug 'prayer' already exists
      domain: 'Worship',
      names: { english: 'Unique ID', arabic: 'فريد' },
      aliases: ['unique-alias-1'],
      description: 'Duplicate Slug test'
    };

    expect(() => registry.registerConcept(duplicateSlugConcept)).toThrow(
      /Duplicate Ontology Slug Error/
    );
  });

  it('4. should detect alias collisions across concepts', () => {
    const registry = OntologyRegistry.getInstance();

    const collidingConcept: OntologyConcept = {
      id: 'adq:ontology:concept:custom-charity',
      slug: 'custom-charity',
      domain: 'Worship',
      names: { english: 'Custom Charity', arabic: 'صدقة' },
      aliases: ['salah'], // 'salah' is already claimed by adq:ontology:concept:prayer
      description: 'Alias collision test'
    };

    expect(() => registry.registerConcept(collidingConcept)).toThrow(
      /Alias Collision Error/
    );
  });

  it('5. should enforce concept immutability (Object.isFrozen)', () => {
    const registry = OntologyRegistry.getInstance();
    const concept = registry.getConcept('adq:ontology:concept:prayer');

    expect(concept).toBeDefined();
    expect(Object.isFrozen(concept)).toBe(true);
  });
});
