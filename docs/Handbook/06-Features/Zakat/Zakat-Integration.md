# ADQ Zakat Module Knowledge Graph Integration Specification

**Phase**: 10B.6 — Zakat Knowledge Domain Integration  
**Status**: Production Module Integration Specification  
**Date**: 2026-07-22  
**Target Path**: `src/platform/knowledge/integrations/ZakatGraphIntegration.ts`

---

## 1. Registered Canonical Nodes

| Canonical Node ID | Category | Domain | Multilingual Name | Description |
|-------------------|----------|--------|-------------------|-------------|
| `adq:zakat:obligation` | `PillarConcept` | `Fiqh` | Zakat (الزكاة المفروضة) | The third pillar of Islam: mandatory annual almsgiving. |
| `adq:zakat:nisab` | `FiqhThreshold` | `Fiqh` | Nisab (النصاب) | Minimum wealth threshold (85g gold / 595g silver). |
| `adq:zakat:haul` | `FiqhCondition` | `Fiqh` | Hawl (الحول) | One Hijri lunar year holding requirement. |
| `adq:zakat:wealth` | `WealthCategory` | `Fiqh` | Zakatable Wealth (الأموال الزكوية) | Growth-oriented surplus wealth subject to Zakat. |
| `adq:zakat:purification` | `SpiritualConcept` | `Fiqh` | Purification (التزكية والنماء) | Spiritual and economic purification of soul and wealth. |
| `adq:zakat:gold` | `ZakatableAsset` | `Fiqh` | Gold (الذهب) | Precious metal asset (85g Nisab, 2.5% rate). |
| `adq:zakat:silver` | `ZakatableAsset` | `Fiqh` | Silver (الفضة) | Precious metal asset (595g Nisab, 2.5% rate). |
| `adq:zakat:cash` | `ZakatableAsset` | `Fiqh` | Cash & Currency (النقدين) | Currency and cash funds. |
| `adq:zakat:bank-balance` | `ZakatableAsset` | `Fiqh` | Bank Savings (الودائع) | Liquid savings in bank accounts. |
| `adq:zakat:business-inventory` | `ZakatableAsset` | `Fiqh` | Trade Goods (عروض التجارة) | Resale merchandise evaluated at market value. |
| `adq:zakat:shares` | `ZakatableAsset` | `Fiqh` | Stocks & Equity (الأسهم) | Equity investments in business entities. |
| `adq:zakat:agriculture` | `ZakatableAsset` | `Fiqh` | Agriculture (الزروع والثمار) | Produce & crops (5 Wasaq Nisab; 5% or 10% rate). |
| `adq:zakat:livestock` | `ZakatableAsset` | `Fiqh` | Grazing Livestock (الأنعام) | Free-grazing livestock herds. |
| `adq:zakat:minerals` | `ZakatableAsset` | `Fiqh` | Minerals & Rikaz (الركاز والمعادن) | Discovered treasure or extracted minerals (20% rate). |
| `adq:zakat:asnaf:fuqara` | `ZakatRecipient` | `Fiqh` | The Poor (الفقراء) | Qur'anic recipient category 1 (Surah 9:60). |
| `adq:zakat:asnaf:masakin` | `ZakatRecipient` | `Fiqh` | The Needy (المساكين) | Qur'anic recipient category 2 (Surah 9:60). |
| `adq:zakat:asnaf:amilin` | `ZakatRecipient` | `Fiqh` | Administrators (العاملين عليها) | Qur'anic recipient category 3 (Surah 9:60). |
| `adq:zakat:asnaf:muallafah` | `ZakatRecipient` | `Fiqh` | Reconciled Hearts (المؤلفة قلوبهم) | Qur'anic recipient category 4 (Surah 9:60). |
| `adq:zakat:asnaf:riqab` | `ZakatRecipient` | `Fiqh` | Freeing Captives (في الرقاب) | Qur'anic recipient category 5 (Surah 9:60). |
| `adq:zakat:asnaf:gharimin` | `ZakatRecipient` | `Fiqh` | Debtors (الغارمين) | Qur'anic recipient category 6 (Surah 9:60). |
| `adq:zakat:asnaf:fisabilillah` | `ZakatRecipient` | `Fiqh` | In Allah's Cause (في سبيل الله) | Qur'anic recipient category 7 (Surah 9:60). |
| `adq:zakat:asnaf:ibn-sabil` | `ZakatRecipient` | `Fiqh` | Stranded Wayfarers (ابن السبيل) | Qur'anic recipient category 8 (Surah 9:60). |

---

## 2. Key Relationship Topography

- `adq:zakat:obligation -> legal ruling for -> adq:worship:salah` (Paired third pillar of Islam)
- `adq:zakat:asnaf:fuqara -> references -> adq:quran:verse:9:60` (Surah At-Tawbah 9:60 Asnaf ordinance)
- `adq:zakat:haul -> legal ruling for -> adq:astronomy:hilal` (Hawl calculated via Hijri lunar calendar)
- `adq:zakat:gold -> part of -> adq:zakat:wealth` (Gold as primary Zakatable asset)
- `adq:zakat:asnaf:gharimin -> connected to -> adq:mirath:debt` (Distressed debt settlement cross-link)
