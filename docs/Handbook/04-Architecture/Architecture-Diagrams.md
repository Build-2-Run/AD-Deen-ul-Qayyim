# ADQ Architecture Diagrams

**Phase**: 10B.0.1 — Documentation & Architecture Intelligence  
**Status**: Analysis Only — Zero code modified  
**Date**: 2026-07-22

---

## 1. ADQ Platform Layer Architecture

```mermaid
graph TD
    subgraph "Presentation Layer"
        UI_QURAN[Qur'an UI]
        UI_HADITH[Hadith UI]
        UI_PRAYER[Prayer UI]
        UI_ASTRO[Astronomy UI]
        UI_MIRATH[Mirath UI]
        UI_ZAKAT[Zakat UI]
        UI_WORSHIP[Daily Worship UI]
        UI_KNOW[Knowledge Explorer]
        UI_LIB[Personal Library]
        UI_READER[Reader Lab]
    end

    subgraph "Feature Services Layer"
        SVC_QURAN[QuranRepository\nQuranSearchProvider]
        SVC_PRAYER[PrayerAdapter\nPrayerProvider]
        SVC_MIRATH[DistributionEngine\n+10 sub-engines]
        SVC_ZAKAT[ZakatProvider]
        SVC_KS[KnowledgeServices\nBookmark/Notes/Citation]
    end

    subgraph "Platform Layer (Phase 9/10)"
        ASTRO[AstronomyPlatform\nFacade + 17 Engines]
        KG[UniversalKnowledgeGraph\nadq:node:... system]
        FIQH[FiqhPlatform\n6 Strategies]
    end

    subgraph "Scientific Infrastructure"
        CACHE[AstronomyCache\nLRU 500 items]
        DATA[DatasetManager\nSHA-256 verified]
        REGISTRY[EngineRegistry\nDependency Injection]
        DS[DataSourceRegistry]
        OBS[ObservatoryRegistry]
    end

    subgraph "Celestial Providers"
        BSC5[BSC5 Bright Stars\n~300 stars]
        MESS[Messier Catalogue\nM1–M110]
        IAU[IAU Constellations\n88 boundaries]
        SAT[TLE Satellites\nISS, Hubble, etc.]
        PLAN[Planetary Engine\nMercury–Neptune]
    end

    UI_QURAN --> SVC_QURAN
    UI_PRAYER --> SVC_PRAYER
    UI_MIRATH --> SVC_MIRATH
    UI_ZAKAT --> SVC_ZAKAT
    UI_LIB --> SVC_KS
    UI_ASTRO --> ASTRO
    UI_KNOW --> KG
    UI_READER --> KG

    SVC_PRAYER --> ASTRO
    ASTRO --> KG
    ASTRO --> FIQH
    ASTRO --> CACHE
    ASTRO --> REGISTRY
    ASTRO --> DATA
    ASTRO --> DS
    ASTRO --> OBS
    REGISTRY --> BSC5
    REGISTRY --> MESS
    REGISTRY --> IAU
    REGISTRY --> SAT
    REGISTRY --> PLAN
```

---

## 2. AstronomyPlatform Engine Registry

```mermaid
graph LR
    AP[AstronomyPlatform\nFacade]
    ER[EngineRegistry\nDependency Injection]

    AP --> ER

    ER --> E1[SolarEphemerisEngine]
    ER --> E2[SolarEventsEngine\nSunrise/Sunset/Noon]
    ER --> E3[LunarEphemerisEngine\nELP-2000/82]
    ER --> E4[LunarPhaseEngine\nPhase %]
    ER --> E5[PrayerTimeEngine\nFajr/Dhuhr/Asr/Maghrib/Isha]
    ER --> E6[QiblaEngine\nVincenty Geodesy]
    ER --> E7[HijriCalendarEngine\nGregorian↔Hijri]
    ER --> E8[MoonVisibilityEngine\nYallop/Odeh]
    ER --> E9[EclipseEngine\nSolar+Lunar]
    ER --> E10[AstronomicalEventsEngine\nEquinox/Solstice/Apsides]
    ER --> E11[VisibilityWorldEngine\nGlobal Grid]
    ER --> E12[ObservatorySchedulerEngine]
    ER --> E13[PlanetaryEngine\nMercury-Neptune]
    ER --> E14[StellarEngine\nBSC5 Stars]
    ER --> E15[ConstellationEngine\n88 IAU]
    ER --> E16[DeepSkyEngine\nMessier M1-M110]
    ER --> E17[SatelliteEngine\nSGP4 Propagator]
```

---

## 3. Universal Knowledge Graph Model

```mermaid
graph LR
    subgraph "UniversalNode"
        N1["id: adq:node:sun\ncategory: NaturalElement\ndomain: Astronomy"]
        N2["id: adq:node:fajr\ncategory: Prayer\ndomain: Worship"]
        N3["id: adq:node:quran:36:38\ncategory: QuranVerse\ndomain: Quran"]
        N4["id: adq:node:scholar:al-battani\ncategory: HistoricalScholar\ndomain: Scholars"]
        N5["id: adq:node:fiqh:mirath\ncategory: FiqhRuling\ndomain: Fiqh"]
    end

    subgraph "UniversalEdge (19 types)"
        N1 -->|"scientific explanation of"| N2
        N3 -->|"references"| N1
        N4 -->|"discovered"| N1
        N1 -->|"governs"| N2
        N3 -->|"legal ruling for"| N2
    end
```

---

## 4. Mirath Engine Architecture

```mermaid
graph TD
    INPUT[Heir List\n+\nEstate Value\n+\nMadhhab]

    INPUT --> RSL[RuleSetLoader\nload madhhab ruleset]
    RSL --> EE[EligibilityEngine\ncheck each heir]
    EE --> BE[BlockingEngine\napply Hajb rules]
    BE --> FSE[FixedShareEngine\nassign Furud fractions]
    FSE --> RE[ResiduaryEngine\nassign Asabah residue]
    RE --> SCE[SpecialCaseEngine\nAwl / Radd / Mushtarakah\n/ Akdariyyah / etc.]
    SCE --> BEV[BranchEvaluator\ncalculate Asl / commonDenominator]
    BEV --> DE[DistributionEngine\nfinal share amounts]
    DE --> EXP[ExplanationEngine\nFiqh narrative]
    DE --> RESULT[DistributionResult\nshares + fractions + amounts]
    EXP --> RESULT

    subgraph "Special Processors"
        P1[AkdariyyahProcessor]
        P2[AwlProcessor]
        P3[KhunthaProcessor]
        P4[MissingPersonProcessor]
        P5[MuqasamahProcessor]
        P6[MushtarakahProcessor]
        P7[PregnancyProcessor]
        P8[RaddProcessor]
        P9[UmariyyataynProcessor]
    end

    SCE --> P1
    SCE --> P2
    SCE --> P3
    SCE --> P4
    SCE --> P5
    SCE --> P6
    SCE --> P7
    SCE --> P8
    SCE --> P9
```

---

## 5. FiqhPlatform Strategy Registry

```mermaid
graph LR
    FP[FiqhPlatform]
    SR[StrategyRegistry]
    FP --> SR

    SR --> S1[AstronomicalStrategy\nNew Moon Conjunction]
    SR --> S2[DiyanetStrategy\nTurkish Diyanet]
    SR --> S3[ISNAStrategy\nNorth America]
    SR --> S4[LocalObservationStrategy\nNaked Eye Sighting]
    SR --> S5[MoonsightingCommitteeStrategy\nGlobal Committee]
    SR --> S6[UmmAlQuraStrategy\nSaudi Official Calendar]

    S1 -->|"used for"| C1[Pure Astronomical Calendar]
    S2 -->|"used in"| C2[Turkey]
    S3 -->|"used in"| C3[US / Canada]
    S4 -->|"used in"| C4[Traditional Communities]
    S5 -->|"used by"| C5[International Bodies]
    S6 -->|"used in"| C6[Saudi Arabia / GCC]
```

---

## 6. Knowledge Services Architecture

```mermaid
graph TD
    USER[User Interaction]

    USER --> HOOK[useLibrary Hook]
    HOOK --> SR[ServiceRegistry\nSingleton]

    SR --> BS[BookmarkService\nlocalStorage: adq_bookmarks]
    SR --> NS[NotesService\nlocalStorage: adq_notes]
    SR --> CS[CollectionService\nlocalStorage: adq_collections]
    SR --> CTS[CitationService\nAPA / Chicago / BibTeX]
    SR --> SS[ShareService\nURL generation]

    BS -->|"operates on"| NID[Canonical Node IDs\nadq:node:...]
    NS -->|"operates on"| NID
    CS -->|"operates on"| NID
    CTS -->|"resolves from"| KG[UniversalKnowledgeGraph]
```

---

## 7. Cross-Domain Knowledge Flow

```mermaid
graph LR
    subgraph "Physical World"
        SUN[Sun]
    end

    subgraph "Astronomy"
        RISE[Sunrise\n+5.5° refraction]
        ZAW[Zawal\nSolar Meridian]
    end

    subgraph "Prayer"
        FAJR[Fajr\n-18° depression]
        DHUHR[Dhuhr\nAfter Zawal]
        MAGHRIB[Maghrib\nAt Sunset]
    end

    subgraph "Qur'an"
        V3638[36:38\nSun runs to its resting place]
        V2189[2:189\nCrescents are timekeeping]
    end

    subgraph "Hadith"
        H521[Bukhari 521\nWhen sun declines, pray Dhuhr]
    end

    subgraph "Fiqh"
        RULE[Shafi'i: Asr when shadow\n= object + shadow at Zawal]
    end

    SUN -->|calculates| RISE
    SUN -->|calculates| ZAW
    RISE --> FAJR
    ZAW --> DHUHR
    SUN --> MAGHRIB

    V3638 -->|explains| SUN
    V2189 -->|governs| DHUHR
    H521 -->|governs| DHUHR
    RULE -->|governs| DHUHR

    SUN -.->|adq:node:sun| KG[Universal\nKnowledge\nGraph]
    FAJR -.->|adq:node:fajr| KG
    V3638 -.->|adq:node:quran:36:38| KG
    H521 -.->|adq:node:hadith:bukhari:521| KG
```

---

## 8. Data Layer Maturity

```
Maturity Level  │  Module              │  Status
────────────────┼──────────────────────┼────────────────────────────
Level 5 (Full)  │  astronomy           │  ✅ Scientific platform complete
Level 4 (Good)  │  mirath              │  ✅ Engine complete, ❌ KG missing
Level 3 (Basic) │  quran               │  ✅ UI + mock, ❌ no full data
Level 3 (Basic) │  zakat               │  ✅ UI + mock, ❌ no engine docs
Level 3 (Basic) │  prayer              │  ✅ UI + adapter, ❌ no tests
Level 3 (Basic) │  knowledge-services  │  ✅ Services, ❌ not wired to KG
Level 2 (Shell) │  knowledge           │  ✅ UI components, mock data only
Level 2 (Shell) │  reader              │  ✅ UI, ❌ no data source
Level 2 (Shell) │  daily-worship       │  ✅ Minimal UI, inline data
Level 1 (UI)    │  hadith              │  ✅ Pages, ❌ no data layer at all
```

---

## 9. Phase Roadmap (Documentation Reference)

```
Phase 9B  ✅  Quran-Astronomy Knowledge Graph + Relationship Engine
Phase 10A ✅  Universal Knowledge Graph Foundation (UniversalNode/Edge/Graph)
Phase 10B.0  ✅  Canonical Repository Audit (all 10 modules inventoried)
Phase 10B.0.1 ✅  Repository Intelligence (this documentation layer)

NEXT:
Phase 10B.1   📋 Quran → Knowledge Graph integration (114 Surahs as nodes)
Phase 10B.2   📋 Hadith → Knowledge Graph (collections, narrators, hadith nodes)
Phase 10B.3   📋 Fiqh → Knowledge Graph (Mirath, Zakat, Prayer as nodes + Madhhab nodes)
Phase 10B.4   📋 Worship → Knowledge Graph (prayers, athkar, sawm)
Phase 10C     📋 Cross-domain explainer (Qur'an ↔ Hadith ↔ Fiqh ↔ Astronomy chains)
Phase 10D     📋 Universal search across all KG domains
Phase 11      📋 Tafsir module foundation
Phase 12      📋 Seerah / Islamic History module
```
