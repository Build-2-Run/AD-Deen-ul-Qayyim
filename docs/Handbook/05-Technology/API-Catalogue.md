# ADQ API Catalogue

**Phase**: 10B.0.1 — Documentation & Architecture Intelligence  
**Status**: Analysis Only — Zero code modified  
**Date**: 2026-07-22

---

## 1. `AstronomyPlatform` (Main Facade)
**File**: `src/features/astronomy/service/AstronomyPlatform.ts`  
**Singleton**: `export const astronomyService = new AstronomyPlatform();`  
**Version**: Engine `5.0.0`, Algorithm: Jean Meeus 2nd Ed / IAU 1980 / WGS84 Vincenty

### Constructor
```typescript
constructor(customEngines?: RegisteredEngines, cacheSize: number = 500)
```
Supports full Dependency Injection of any individual engine.

### Core Calculation Methods

| Method | Parameters | Returns | Callers |
|--------|-----------|---------|---------|
| `getDailyAstronomy()` | `location: ObserverLocation, date: GregorianDate, options?: DailyAstronomyOptions` | `DailyAstronomyResult` | Prayer UI, any daily summary UI |
| `getAstronomicalEvents()` | `year: number` | `AstronomicalEvent[]` | Events calendar UI |
| `getEclipses()` | `year: number, location?: ObserverLocation` | `EclipseEvent[]` | Eclipse viewer |
| `getVisibilityGrid()` | `date: {year,month,day}, resolutionDegrees?: number` | `VisibilityGrid` | World map visualizer |
| `getObservationSchedule()` | `date: {year,month,day}, location: ObserverLocation` | `ObservationSchedule` | Observatory scheduler |
| `generateCenturyTables()` | `startYear: number, numYears?: number, location?: ObserverLocation` | `EclipseTable` | Batch prediction |

### Celestial Object Methods

| Method | Parameters | Returns |
|--------|-----------|---------|
| `getPlanet()` | `bodyId: string, date, location?` | `PlanetPosition` |
| `getVisiblePlanets()` | `date, location: ObserverLocation` | `PlanetPosition[]` |
| `getStar()` | `starId: string, date, location?` | `StarPosition` |
| `getVisibleStars()` | `date, location, maxMagnitude?` | `StarPosition[]` |
| `getConstellation()` | `idOrAbbr: string` | `Constellation` |
| `findConstellationByCoordinate()` | `raHours: number, decDegrees: number` | `Constellation` |
| `getDeepSkyObject()` | `objectId: string, date, location?` | `DeepSkyPosition` |
| `getVisibleDeepSkyObjects()` | `date, location, maxMagnitude?` | `DeepSkyPosition[]` |
| `getSatellitePosition()` | `idOrNorad: string\|number, date, location?` | `SatellitePosition` |
| `predictSatellitePasses()` | `idOrNorad, startDate, durationDays, location, minElevation?` | `SatellitePass[]` |
| `getVisibleSatellites()` | `date, location, minElevation?` | `SatellitePosition[]` |

### Knowledge & Explanation Methods

| Method | Parameters | Returns |
|--------|-----------|---------|
| `explainTopic()` | `nodeIdOrQuery: string` | `ExplanationResult` |
| `exploreTopic()` | `query: string` | `TopicExplorationResult` |
| `generateLearningPath()` | `topicKey: string, level?: EducationalLevel` | `LearningPath` |
| `explainUniversalTopic()` | `topicQuery: string` | `UniversalExplanation` |
| `exploreCrossDomain()` | `query: string` | `CrossDomainResult` |
| `generateLearningJourney()` | `topicQuery: string, level?: EducationalLevel` | `LearningJourney` |

### Infrastructure Methods

| Method | Returns |
|--------|---------|
| `getDatasetManager()` | `DatasetManager` (singleton) |
| `getDataSourceRegistry()` | `DataSourceRegistry` (singleton) |
| `getObservatoryRegistry()` | `ObservatoryProfileRegistry` (singleton) |
| `runValidationReport()` | `{ report: ValidationReport, markdown: string }` |
| `getRegistry()` | `EngineRegistry` |
| `getCache()` | `AstronomyCache` |
| `addEventListener()` | `void` |
| `removeEventListener()` | `void` |

---

## 2. `UniversalKnowledgeGraph`
**File**: `src/features/astronomy/knowledge/graph/models/UniversalKnowledgeGraph.ts`

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `addNode()` | `node: UniversalNode` | `void` | Add a node (immutable freeze applied) |
| `addEdge()` | `edge: UniversalEdge` | `void` | Add edge — throws if source/target missing |
| `getNode()` | `id: string` | `UniversalNode \| undefined` | Lookup by canonical ID |
| `getEdge()` | `id: string` | `UniversalEdge \| undefined` | Lookup edge by ID |
| `getAllNodes()` | — | `ReadonlyArray<UniversalNode>` | Full node enumeration |
| `getAllEdges()` | — | `ReadonlyArray<UniversalEdge>` | Full edge enumeration |
| `getNodesByDomain()` | `domain: KnowledgeDomainType` | `UniversalNode[]` | Filter by domain |
| `getEdgesForNode()` | `nodeId: string` | `UniversalEdge[]` | All edges involving a node |
| `getConnectedNodes()` | `nodeId: string` | `UniversalNode[]` | All directly connected nodes |
| `findOrphanNodes()` | — | `UniversalNode[]` | Nodes with no edges |
| `detectCycles()` | — | `boolean` | DFS cycle detection |

---

## 3. `UniversalNode` Interface
**File**: `src/features/astronomy/knowledge/graph/models/UniversalNode.ts`

```typescript
interface UniversalNode {
  id: string;                        // e.g. "adq:node:ramadan", "adq:node:sun"
  category: string;                  // e.g. "NaturalElement", "SacredMonth"
  domain: KnowledgeDomainType;       // 30 domains supported
  names: MultilingualNames;          // english, arabic, transliteration, urdu, fr, tr, id
  aliases: ReadonlyArray<string>;
  description: string;
  tags: ReadonlyArray<string>;
  citations: ReadonlyArray<UniversalCitation>;
  educationalLevel: EducationalLevel; // Beginner | Intermediate | Advanced | Scholar
  authenticity: AuthenticityMetadata; // grade, sourceScholar, verificationStatus
  provenance: ProvenanceMetadata;     // creator, version, lastUpdated, license
  fundamentalQuestions?: FundamentalQuestions; // 14-question schema
  metadata?: Record<string, unknown>;
}
```

**`FundamentalQuestions`** (14 fields):
`whatIsIt`, `whyIsItImportant`, `whereIsItMentioned`, `howIsItConnected`, `quranContext?`, `hadithContext?`, `tafsirContext?`, `fiqhRulings?`, `historicalContext?`, `scientificExplanation?`, `scholarlyDiscussions?`, `relatedADQTopics?`, `prerequisiteTopics?`, `subsequentTopics?`

---

## 4. `UniversalEdge` Interface
**File**: `src/features/astronomy/knowledge/graph/models/UniversalEdge.ts`

```typescript
interface UniversalEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: UniversalRelationType;   // 19 types
  narrative: string;
  weight: number;                         // 0.0 to 1.0
  isBidirectional: boolean;
  citation?: UniversalCitation;
}
```

**19 Relation Types**: `explains`, `references`, `fulfills`, `governs`, `mentions`, `occurred at`, `created by`, `discovered by`, `related to`, `prerequisite of`, `consequence of`, `scientific explanation of`, `historical context of`, `linguistic meaning of`, `legal ruling for`, `connected to`, `compares with`, `located at`, `part of`

---

## 5. `KnowledgePlatform`
**File**: `src/features/astronomy/knowledge/KnowledgePlatform.ts`

| Method | Returns | Description |
|--------|---------|-------------|
| `explainTopic(query)` | `ExplanationResult` | Topic-based explanation |
| `exploreTopic(query)` | `TopicResult` | Related topic exploration |
| `resolveNode(id)` | `UniversalNode \| undefined` | Canonical node lookup |
| `getRelationships(nodeId)` | `UniversalEdge[]` | Edges for a node |

---

## 6. `FiqhPlatform`
**File**: `src/features/astronomy/fiqh/FiqhPlatform.ts`

| Method | Returns | Description |
|--------|---------|-------------|
| `getStrategy(id)` | `IHijriStrategy \| IPrayerStrategy` | Load Fiqh calculation strategy |
| `listStrategies()` | `StrategyMetadata[]` | All registered strategies |
| `calculateWithStrategy(id, params)` | `StrategyResult` | Apply a named strategy |

**Registered Strategies** (via `StrategyRegistry.ts`):
- `AstronomicalStrategy` — pure new moon conjunction
- `DiyanetStrategy` — Turkish Diyanet method
- `ISNAStrategy` — North American Islamic Society
- `LocalObservationStrategy` — Local naked-eye sighting
- `MoonsightingCommitteeStrategy` — Global committee decision
- `UmmAlQuraStrategy` — Saudi Um al-Qura official calendar

---

## 7. Mirath Engine APIs
**File**: `src/features/mirath/engine/index.ts`

| Class | Key Methods | Description |
|-------|------------|-------------|
| `DistributionEngine` | `calculate(heirs, estate, ruleset)` | Main orchestrator — returns `DistributionResult` |
| `EligibilityEngine` | `checkEligibility(heir, heirs)` | Determines if heir qualifies |
| `FixedShareEngine` | `computeFixedShares(heirs, rules)` | Assigns Furud fractions |
| `ResiduaryEngine` | `computeAsabah(heirs, remaining)` | Residuary distribution |
| `BlockingEngine` | `applyHajb(heirs, rules)` | Applies blocking rules |
| `BranchEvaluator` | `evaluateBranching(heirs)` | Calculates Asl factors |
| `SpecialCaseEngine` | `detectAndApply(shares)` | Awl, Radd, Mushtarakah, etc. |
| `RuleMatcher` | `match(heir, conditions)` | Evaluates rule eligibility conditions |
| `RuleSetLoader` | `load(madhhab)` | Loads typed `RuleSet` from `mock/rulesets/` |
| `ExplanationEngine` | `explain(result)` | Generates Fiqh narrative |
| `Fraction` | `add(a,b)`, `subtract(a,b)`, `multiply(a,b)`, `divide(a,b)`, `toDecimal()` | Exact rational arithmetic |

---

## 8. Qur'an Module APIs
**File**: `src/features/quran/repository/index.ts`

| Export | Type | Description |
|--------|------|-------------|
| `QuranRepository` | Class | `getSurahList()`, `getSurah(number)`, `getAyah(surah, ayah)`, `search(query)` |

**File**: `src/features/quran/services/QuranSearchProvider.ts`

| Method | Parameters | Returns |
|--------|-----------|---------|
| `search()` | `query: string` | `QuranSearchResult[]` |
| `searchByKeyword()` | `keyword: string` | `QuranSearchResult[]` |

---

## 9. Knowledge Services APIs
**File**: `src/features/knowledge-services/registry/ServiceRegistry.ts`

| Service | Key Methods |
|---------|------------|
| `BookmarkService` | `save(nodeId)`, `remove(nodeId)`, `list()`, `has(nodeId)` |
| `NotesService` | `add(nodeId, note)`, `get(nodeId)`, `delete(noteId)` |
| `CollectionService` | `create(name)`, `addToCollection(collId, nodeId)`, `getCollections()` |
| `CitationService` | `formatAPA(nodeId)`, `formatChicago(nodeId)`, `exportBibTeX(nodeIds[])` |
| `ShareService` | `generateLink(nodeId)`, `shareToClipboard(nodeId)` |

---

## 10. EngineRegistry
**File**: `src/features/astronomy/service/EngineRegistry.ts`

| Method | Returns | Description |
|--------|---------|-------------|
| `getEngine(name)` | `T \| undefined` | Lazy-load optional engine |
| `getRequiredEngine(name)` | `T` | Load engine or throw |
| `registerEngine(name, engine)` | `void` | Override engine at runtime |

**17 Registered Engines**: `solarEphemerisEngine`, `solarEventsEngine`, `lunarEphemerisEngine`, `lunarPhaseEngine`, `prayerTimeEngine`, `qiblaEngine`, `hijriCalendarEngine`, `moonVisibilityEngine`, `eclipseEngine`, `astronomicalEventsEngine`, `visibilityWorldEngine`, `observatorySchedulerEngine`, `planetaryEngine`, `stellarEngine`, `constellationEngine`, `deepSkyEngine`, `satelliteEngine`
