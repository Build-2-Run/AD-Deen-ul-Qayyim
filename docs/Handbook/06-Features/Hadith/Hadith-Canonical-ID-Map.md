# ADQ Hadith Canonical Node ID Specification & Mapping

**Phase**: 10B.3A — Hadith Integration Readiness Audit  
**Status**: Canonical Mapping Specification  
**Date**: 2026-07-22  
**Target Domain**: `Hadith` & `Scholars` (`src/content/hadith/` & `DatasetRegistry`)

---

## 1. Hadith Collection Nodes (`adq:hadith:collection:<name>`)

### 1.1 `adq:hadith:collection:bukhari` — Sahih al-Bukhari
- **Canonical ID**: `adq:hadith:collection:bukhari`
- **Category**: `HadithCollection`
- **Domain**: `Hadith`
- **Source Dataset**: `src/content/hadith/compiled/collections/bukhari/metadata.json`
- **Source Registry**: `DatasetRegistry.loadCollection('bukhari')`
- **Multilingual Names**: `{ english: "Sahih al-Bukhari", arabic: "صحيح البخاري" }`
- **Compiler**: Imam Muhammad al-Bukhari (`adq:scholar:bukhari`)
- **Total Hadiths**: 7,563
- **Authenticity**: `{ grade: "SAHIH", verificationStatus: "CANONICAL" }`
- **Educational Level**: `Beginner`
- **Cross-Domain Links Available**: `adq:scholar:bukhari` (`created by`), `adq:quran:surah:1`

---

## 2. Hadith Compiler / Scholar Nodes (`adq:scholar:<id>`)

### 2.1 `adq:scholar:bukhari` — Imam Muhammad al-Bukhari
- **Canonical ID**: `adq:scholar:bukhari`
- **Category**: `HistoricalScholar`
- **Domain**: `Scholars`
- **Source Dataset**: `bukhari/metadata.json` (`author` field)
- **Names**: `{ english: "Imam Muhammad al-Bukhari", arabic: "الإمام محمد بن إسماعيل البخاري" }`
- **Era**: 194–256 AH (810–870 CE)
- **Location**: Bukhara / Samarkand
- **Authenticity**: `{ grade: "SCHOLARLY_CONSENSUS", verificationStatus: "CANONICAL" }`
- **Cross-Domain Links Available**: `adq:hadith:collection:bukhari` (`compiled`), `adq:place:bukhara`

---

## 3. Hadith Narration Nodes (`adq:hadith:<collection>:<number>`)

### 3.1 `adq:hadith:bukhari:1` — Intention (Niyyah) Hadith
- **Canonical ID**: `adq:hadith:bukhari:1`
- **Category**: `Hadith`
- **Domain**: `Hadith`
- **Source Dataset**: `bukhari/book-001.json` (`hadith:bukhari:book:1:hadith:1`)
- **Source Registry**: `DatasetRegistry.loadNode('hadith:bukhari:book:1:hadith:1')`
- **Companion Narrator**: ‘Umar bin Al-Khattab
- **Arabic Text**: `إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى`
- **English Translation**: "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended."
- **Grade**: `Sahih`
- **Cross-Domain Links Already Available**: `adq:quran:verse:98:5` (`relations` array in JSON), `adq:hadith:collection:bukhari` (`part of`), `adq:scholar:bukhari` (`created by`)
- **Cross-Domain Links Later**: `adq:fiqh:niyyah`, `adq:ethics:sincerity`

### 3.2 `adq:hadith:bukhari:1907` — Ramadan Moonsighting Hadith
- **Canonical ID**: `adq:hadith:bukhari:1907`
- **Category**: `Hadith`
- **Domain**: `Hadith`
- **Source Dataset**: `src/features/astronomy/knowledge/content/hadith-astronomy-map.json`
- **Arabic Text**: `صُومُوا لِرُؤْيَتِهِ وَأَفْطِرُوا لِرُؤْيَتِهِ`
- **English Translation**: "Fast when you see the crescent moon and break your fast when you see it..."
- **Grade**: `Sahih`
- **Cross-Domain Links Already Available**: `adq:astronomy:hilal` (`governs`), `adq:ramadan` (`governs`), `adq:quran:verse:2:189` (`references`)

### 3.3 `adq:hadith:bukhari:521` — Solar Meridian Dhuhr Hadith
- **Canonical ID**: `adq:hadith:bukhari:521`
- **Category**: `Hadith`
- **Domain**: `Hadith`
- **Source Dataset**: `hadith-astronomy-map.json`
- **Arabic Text**: `إِذَا زَالَتِ الشَّمْسُ فَصَلُّوا الظُّهْرَ`
- **English Translation**: "When the sun passes its meridian, offer the Dhuhr prayer."
- **Grade**: `Sahih`
- **Cross-Domain Links Already Available**: `adq:astronomy:zawal` (`scientific explanation of`), `adq:prayer:dhuhr` (`legal ruling for`)
