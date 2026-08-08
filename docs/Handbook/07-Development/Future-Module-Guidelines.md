# ADQ Future Module Development Guidelines & Graph Integration Standard

**Phase**: 10B.1A — Architecture & Developer Guidelines  
**Status**: Mandatory Development Standard  
**Date**: 2026-07-22  
**Target Audience**: ADQ Core Engine & Module Developers

---

## 1. Mandatory Platform Architectural Rules

Every developer adding or updating a module in the ADQ platform must comply with the following three immutable rules (ADR-005):

> [!IMPORTANT]
> ### 1. The Future Module Rule
> Every ADQ feature module (Seerah, Tafsir, Aqeedah, Arabic, Prophetic Medicine, History, Geography, Biology, Physics, Mathematics, Economics, Civilization, etc.) **must** implement `ModuleGraphIntegration` before it can be considered complete. No module may introduce knowledge outside the Universal Knowledge Graph.

> [!IMPORTANT]
> ### 2. Canonical Stable Node Identifier Standard
> All node identifiers must adhere strictly to the uniform pattern:  
> `adq:<domain_or_module>:<entity_type>:<identifier>`  
> 
> Valid Examples:
> - `adq:quran:surah:2`
> - `adq:quran:ayah:2:185`
> - `adq:hadith:bukhari:1907`
> - `adq:scholar:bukhari`
> - `adq:prayer:fajr`
> - `adq:mirath:kalalah`
> - `adq:zakat:nisab`
> - `adq:astronomy:sun`
> - `adq:biology:bee`
> - `adq:history:badr`
> - `adq:place:makkah`
> 
> *Invalid Examples*:
> - `node-123` (Missing prefix and structure)
> - `adq:sun` (Missing domain/type tiers)
> - `adq:quran:surah_2` (Must use colons for hierarchy separation)

> [!IMPORTANT]
> ### 3. Globally Stable Node ID Immutability Rule
> Every canonical node ID is permanent and immutable. Names, translations, descriptions, metadata, and relationships may evolve, but the canonical node ID **must never change** under any circumstances.

---

## 2. Step-by-Step Developer Guide: Building a Module Graph Integration

### Step 1: Create Integration File
In your feature module directory (or under `src/platform/knowledge/integrations/`), create a file named `<ModuleName>GraphIntegration.ts`.

### Step 2: Implement `ModuleGraphIntegration`
Use the following TypeScript boilerplate template:

```typescript
import {
  ModuleGraphIntegration,
  CanonicalNodeRegistry,
  CanonicalRelationshipRegistry,
  KnowledgeDomainType
} from '@/platform/knowledge';

export class SeerahGraphIntegration implements ModuleGraphIntegration {
  public getModuleId(): string {
    return 'seerah';
  }

  public getDomain(): KnowledgeDomainType {
    return 'Seerah';
  }

  public getPriority(): number {
    return 310; // Execution order priority
  }

  public registerNodes(registry: CanonicalNodeRegistry): void {
    const prov = {
      creator: 'ADQ Seerah Team',
      version: '1.0',
      lastUpdated: '2026-07-22',
      license: 'ADQ Open Knowledge Canon'
    };
    const auth = { grade: 'SAHIH', verificationStatus: 'CANONICAL' as const };

    registry.registerNode({
      id: 'adq:seerah:event:hijrah',
      category: 'HistoricalEvent',
      domain: 'Seerah',
      names: {
        english: 'The Hijrah (Migration to Madinah)',
        arabic: 'الهجرة النبوية'
      },
      aliases: ['hijrah', 'migration', 'madinah-migration'],
      description: 'The historic migration of Prophet Muhammad (ﷺ) from Makkah to Madinah.',
      tags: ['hijrah', 'seerah', 'madinah', 'makkah'],
      citations: [
        {
          code: 'Qur\'an 9:40',
          arabicText: 'إِلَّا تَنصُرُوهُ فَقَدْ نَصَرَهُ اللَّهُ',
          englishText: 'If you do not aid the Prophet - Allah has already aided him...',
          source: 'Qur\'an'
        }
      ],
      educationalLevel: 'Beginner',
      authenticity: auth,
      provenance: prov,
      fundamentalQuestions: {
        whatIsIt: 'The pivotal migration of early Muslims from persecution in Makkah to sanctuary in Madinah.',
        whyIsItImportant: 'Marks year 1 of the Hijri calendar and the establishment of the first Islamic state.',
        whereIsItMentioned: 'Referenced in Surah At-Tawbah (9:40) and numerous Sahih Hadith collections.',
        howIsItConnected: 'Links Makkah, Madinah, Hijri Calendar, and Prophetic Seerah.'
      }
    });
  }

  public registerRelationships(registry: CanonicalRelationshipRegistry): void {
    registry.registerRelationship({
      id: 'edge:seerah:hijrah->makkah',
      sourceId: 'adq:seerah:event:hijrah',
      targetId: 'adq:place:makkah',
      relationType: 'occurred at',
      narrative: 'The Hijrah originated in Makkah al-Mukarramah.',
      weight: 1.0,
      isBidirectional: false
    });
  }
}
```

### Step 3: Register in `UniversalGraphRegistry`
Register your integration provider during application bootstrap:

```typescript
import { UniversalGraphRegistry } from '@/platform/knowledge';
import { SeerahGraphIntegration } from './SeerahGraphIntegration';

UniversalGraphRegistry.getInstance().registerModule(new SeerahGraphIntegration());
```

---

## 3. Pre-Commit & CI Validation Checklist

Before submitting code for review, developers must run the automated graph validation suite:

```bash
npx vitest run src/platform/knowledge/__tests__/
```

The CI pipeline will automatically reject commits if:
1. Any node ID does not match `adq:<domain>:<type>:<id>` format.
2. Any edge references a non-existent source or target node ID.
3. Any orphan node is detected without relationships.
4. Any circular dependency cycle is introduced in directed relationships.
5. Any graph object is mutated after freezing.
