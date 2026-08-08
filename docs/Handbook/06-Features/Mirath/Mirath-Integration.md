# ADQ Mirath Module Knowledge Graph Integration Specification

**Phase**: 10B.5 — Mirath Integration  
**Status**: Production Module Integration Specification  
**Date**: 2026-07-22  
**Target Path**: `src/platform/knowledge/integrations/MirathGraphIntegration.ts`

---

## 1. Registered Canonical Nodes

| Canonical Node ID | Category | Domain | Multilingual Name | Description |
|-------------------|----------|--------|-------------------|-------------|
| `adq:mirath:estate` | `EstateCore` | `Fiqh` | Tarikah (التركة) | Net distributable estate left behind by deceased. |
| `adq:mirath:debt` | `EstateDeduction` | `Fiqh` | Dayn (قضاء الديون) | Financial debt settlement (Priority 1 deduction). |
| `adq:mirath:wasiyyah` | `EstateDeduction` | `Fiqh` | Wasiyyah (الوصية) | Testamentary bequests (Priority 2 deduction, max 1/3). |
| `adq:mirath:heir:husband` | `HeirCategory` | `Fiqh` | Zawj (الزوج) | Share 1/2 without children; 1/4 with children. |
| `adq:mirath:heir:wife` | `HeirCategory` | `Fiqh` | Zawjah (الزوجة) | Share 1/4 without children; 1/8 with children. |
| `adq:mirath:heir:father` | `HeirCategory` | `Fiqh` | Ab (الأب) | Share 1/6 with male child; 1/6 + Residue with female child; 'Asabah without children. |
| `adq:mirath:heir:mother` | `HeirCategory` | `Fiqh` | Umm (الأم) | Share 1/3 without children/siblings; 1/6 with children/siblings. |
| `adq:mirath:heir:son` | `HeirCategory` | `Fiqh` | Ibn (الابن) | Primary Residuary ('Asabah); excludes collateral heirs. |
| `adq:mirath:heir:daughter` | `HeirCategory` | `Fiqh` | Bint (البنت) | Share 1/2 single; 2/3 multiple; 'Asabah with Son (2:1 ratio). |
| `adq:mirath:kalalah` | `SpecialInheritanceCase` | `Fiqh` | Kalalah (الكلالة) | Deceased with no living parents or children. |
| `adq:mirath:awl` | `InheritancePrinciple` | `Fiqh` | Awl (العول) | Share base expansion when sum of fractions > 1. |
| `adq:mirath:radd` | `InheritancePrinciple` | `Fiqh` | Radd (الرد) | Surplus redistribution when sum of fractions < 1. |
| `adq:opinion:hanafi:radd-spouse` | `JuristicOpinion` | `Fiqh` | Hanafi Radd | Permits surplus Radd to spouses if no blood heirs exist. |
| `adq:opinion:shafii:radd-baitulmal` | `JuristicOpinion` | `Fiqh` | Shafi'i & Maliki Radd | Directs surplus Radd to Bayt al-Mal if no blood heirs exist. |

---

## 2. Key Relationship Topography

- `adq:mirath:heir:son -> excludes -> adq:mirath:kalalah` (Son excludes collateral heirs)
- `adq:mirath:estate -> references -> adq:quran:verse:4:11` (An-Nisa 4:11 Quranic ordinance)
- `adq:mirath:kalalah -> references -> adq:quran:verse:4:176` (An-Nisa 4:176 Kalalah ordinance)
- `adq:mirath:radd -> part of -> adq:opinion:hanafi:radd-spouse` (Hanafi juristic opinion branch)
- `adq:mirath:radd -> part of -> adq:opinion:shafii:radd-baitulmal` (Shafi'i/Maliki juristic opinion branch)
