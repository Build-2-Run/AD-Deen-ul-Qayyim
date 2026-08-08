# ADQ Seerah Module Knowledge Graph Integration Specification

**Phase**: 10B.8 — Seerah Knowledge Domain Integration (Experience-Oriented)  
**Status**: Production Module Integration Specification  
**Date**: 2026-07-22  
**Target Path**: `src/platform/knowledge/integrations/SeerahGraphIntegration.ts`

---

## 1. Registered Canonical Nodes

| Canonical Node ID | Category | Domain | Multilingual Name | Description |
|-------------------|----------|--------|-------------------|-------------|
| `adq:seerah:event:hijrah` | `HistoricalEvent` | `Seerah` | The Great Hijrah (الهجرة النبوية) | Epochal migration from Makkah to Madinah (1 AH). |
| `adq:seerah:event:badr` | `HistoricalEvent` | `Seerah` | Battle of Badr (غزوة بدر الكبرى) | Decisive miraculous first battle (17 Ramadan 2 AH). |
| `adq:seerah:event:uhud` | `HistoricalEvent` | `Seerah` | Battle of Uhud (غزوة أحد) | Strategic battle at Mount Uhud (3 AH). |
| `adq:seerah:event:khandaq` | `HistoricalEvent` | `Seerah` | Battle of the Trench (غزوة الخندق) | Defense of Madinah against confederates (5 AH). |
| `adq:seerah:event:hudaybiyyah` | `HistoricalEvent` | `Seerah` | Treaty of Hudaybiyyah (صلح الحديبية) | 10-year peace treaty declared "Manifest Victory" (6 AH). |
| `adq:seerah:event:fath-makkah` | `HistoricalEvent` | `Seerah` | Conquest of Makkah (فتح مكة المكرمة) | Bloodless liberation of Makkah (20 Ramadan 8 AH). |
| `adq:seerah:event:farewell-pilgrimage` | `HistoricalEvent` | `Seerah` | Farewell Pilgrimage (حجة الوداع) | Prophet's final Hajj and Farewell Sermon (10 AH). |
| `adq:place:makkah` | `SacredPlace` | `Seerah` | Makkah (مكة المكرمة) | Sanctuary city & birthplace of Prophet Muhammad ﷺ. |
| `adq:place:madinah` | `SacredPlace` | `Seerah` | Madinah (المدينة المنورة) | City of migration & Prophet's Mosque. |
| `adq:place:cave-hira` | `SacredPlace` | `Seerah` | Cave of Hira (غار حراء) | Mountain cave of first Qur'anic revelation. |
| `adq:place:cave-thawr` | `SacredPlace` | `Seerah` | Cave of Thawr (غار ثور) | Migration shelter cave. |
| `adq:place:masjid-quba` | `SacredPlace` | `Seerah` | Masjid Quba (مسجد قباء) | First mosque built in Islam. |
| `adq:place:masjid-nabawi` | `SacredPlace` | `Seerah` | Masjid an-Nabawi (المسجد النبوي) | Prophet's Mosque in Madinah. |
| `adq:place:badr` | `SacredPlace` | `Seerah` | Valley of Badr (بدر) | Site of Battle of Badr. |
| `adq:place:uhud` | `SacredPlace` | `Seerah` | Mount Uhud (جبل أحد) | Site of Battle of Uhud. |
| `adq:place:arafat` | `SacredPlace` | `Seerah` | Plain of Arafat (عرفات) | Site of Farewell Sermon. |
| `adq:person:prophet-muhammad` | `HistoricalPerson` | `Seerah` | Prophet Muhammad ﷺ (محمد رسول الله) | Final Messenger of Allah (570–632 CE). |
| `adq:person:abu-bakr` | `HistoricalPerson` | `Seerah` | Abu Bakr al-Siddiq (أبو بكر الصديق) | First Caliph & migration companion. |
| `adq:person:uthman-ibn-affan` | `HistoricalPerson` | `Seerah` | Uthman ibn Affan (عثمان بن عفان) | Third Caliph & Mus'haf compiler. |
| `adq:person:ali-ibn-abi-talib` | `HistoricalPerson` | `Seerah` | Ali ibn Abi Talib (علي بن أبي طالب) | Fourth Caliph & cousin/son-in-law. |
| `adq:person:khadijah` | `HistoricalPerson` | `Seerah` | Khadijah (خديجة بنت خويلد) | First wife & first believer in Islam. |
| `adq:person:aisha` | `HistoricalPerson` | `Seerah` | Aisha (عائشة بنت أبي بكر) | Mother of Believers & major Hadith narrator. |
| `adq:person:bilal` | `HistoricalPerson` | `Seerah` | Bilal ibn Rabah (بلال بن رباح) | First Mu'adh-dhin of Islam. |
| `adq:person:hamzah` | `HistoricalPerson` | `Seerah` | Hamzah (حمزة بن عبد المطلب) | Lion of Allah & leader of martyrs. |
