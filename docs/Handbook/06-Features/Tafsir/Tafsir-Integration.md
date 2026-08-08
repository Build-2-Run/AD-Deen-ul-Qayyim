# ADQ Tafsir Module Knowledge Graph Integration Specification

**Phase**: 10B.9 — Tafsir Knowledge Domain Integration  
**Status**: Production Central Knowledge Hub Integration Specification  
**Date**: 2026-07-23  
**Target Path**: `src/platform/knowledge/integrations/TafsirGraphIntegration.ts`

---

## 1. Registered Canonical Nodes

| Canonical Node ID | Category | Domain | Multilingual Name | Description |
|-------------------|----------|--------|-------------------|-------------|
| `adq:mufassir:ibn-kathir` | `Scholar` | `Tafsir` | Hafiz Ibn Kathir (ابن كثير) | Premier commentator of Tafsir bil-Ma'thur (d. 774 AH). |
| `adq:mufassir:tabari` | `Scholar` | `Tafsir` | Al-Tabari (الطبري) | Father of exegesis, author of Jami' al-Bayan (d. 310 AH). |
| `adq:mufassir:qurtubi` | `Scholar` | `Tafsir` | Al-Qurtubi (القرطبي) | Maliki jurist, author of Al-Jami' li-Ahkam al-Qur'an (d. 671 AH). |
| `adq:mufassir:razi` | `Scholar` | `Tafsir` | Fakhr al-Din al-Razi (الفخر الرازي) | Rationalist scholar, author of Mafatih al-Ghayb (d. 606 AH). |
| `adq:mufassir:sadi` | `Scholar` | `Tafsir` | Abd al-Rahman al-Sa'di (السعدي) | Contemporary scholar, author of Taysir al-Karim al-Rahman (d. 1376 AH). |
| `adq:tafsir:methodology:bil-mathur` | `TafsirMethodology` | `Tafsir` | Tafsir bil-Ma'thur (التفسير بالمأثور) | Traditional exegesis by Qur'an, Hadith, and Sahabah. |
| `adq:tafsir:methodology:bil-ray` | `TafsirMethodology` | `Tafsir` | Tafsir bil-Ra'y (التفسير بالرأي) | Reasoned exegesis using linguistic & legal hermeneutics. |
| `adq:asbab-nuzul:cave-hira` | `AsbabAlNuzul` | `Tafsir` | Asbab Hira (سبب نزول أول الوحي) | Context of first revelation (Surah Al-Alaq 96:1-5). |
| `adq:asbab-nuzul:badr` | `AsbabAlNuzul` | `Tafsir` | Asbab Badr (سبب نزول آيات بدر) | Context of divine victory revelation at Badr (Surah 8:9). |
| `adq:asbab-nuzul:uhud` | `AsbabAlNuzul` | `Tafsir` | Asbab Uhud (سبب نزول آيات أحد) | Context of archers' test at Uhud (Surah 3:121). |
| `adq:asbab-nuzul:hudaybiyyah` | `AsbabAlNuzul` | `Tafsir` | Asbab Hudaybiyyah (سبب نزول سورة الفتح) | Context of Hudaybiyyah Manifest Victory (Surah 48:1). |
| `adq:asbab-nuzul:fath-makkah` | `AsbabAlNuzul` | `Tafsir` | Asbab Fath Makkah (سبب نزول سورة النصر) | Context of Makkah liberation revelation (Surah 110:1). |
| `adq:asbab-nuzul:zakat-asnaf` | `AsbabAlNuzul` | `Tafsir` | Asbab Zakat Asnaf (سبب نزول آية الصدقات) | Context defining 8 Zakat beneficiaries (Surah 9:60). |
| `adq:tafsir:ibn-kathir:surah-1` | `TafsirEntry` | `Tafsir` | Tafsir Fatiha (تفسير الفاتحة) | Ibn Kathir exegesis of Surah Al-Fatiha. |
| `adq:tafsir:ibn-kathir:surah-2:183` | `TafsirEntry` | `Tafsir` | Tafsir Sawm (تفسير آية الصيام) | Ibn Kathir exegesis of Fasting ordinance. |
| `adq:tafsir:tabari:surah-9:60` | `TafsirEntry` | `Tafsir` | Tafsir Asnaf (تفسير مصارف الزكاة) | Al-Tabari exegesis on 8 Zakat beneficiaries. |
| `adq:tafsir:qurtubi:surah-4:11` | `TafsirEntry` | `Tafsir` | Tafsir Mirath (تفسير آية المواريث) | Al-Qurtubi Fiqh exegesis on Mirath shares. |
| `adq:tafsir:razi:surah-17:78` | `TafsirEntry` | `Tafsir` | Tafsir Duluk (تفسير آية أقم الصلاة) | Al-Razi exegesis on solar meridian prayer times. |
