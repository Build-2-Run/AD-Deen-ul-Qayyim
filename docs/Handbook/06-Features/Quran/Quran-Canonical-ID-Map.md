# ADQ Qur'an Canonical Node ID Specification & Mapping

**Phase**: 10B.2A — Qur'an Integration Readiness Audit  
**Status**: Canonical Mapping Specification  
**Date**: 2026-07-22  
**Target Domain**: `Qur'an` (`src/features/quran/`)

---

## 1. Surah Node Mappings (`adq:quran:surah:<number>`)

### 1.1 `adq:quran:surah:1` — Al-Fatihah
- **Canonical ID**: `adq:quran:surah:1`
- **Category**: `Surah`
- **Domain**: `Qur'an`
- **Source Dataset**: `src/features/quran/mock/data.ts` (`mockQuranData[0]`)
- **Source Repository**: `QuranRepository.getSurah(1)`
- **Existing API**: `QuranRepository.getSurah(1)`
- **Multilingual Names**: `{ english: "The Opener", arabic: "الفاتحة", transliteration: "Al-Fatihah" }`
- **Revelation Info**: Meccan (Order: 5), 7 Ayahs
- **Authenticity**: `{ grade: "MUTAWATIR", verificationStatus: "CANONICAL" }`
- **Educational Level**: `Beginner`
- **Cross-Domain Links Available**: `adq:prayer:fajr` (recited in every rak'ah of Salat), `adq:worship:salat`
- **Cross-Domain Links Later**: `adq:tafsir:fatihah`, `adq:hadith:bukhari:fatihah`

### 1.2 `adq:quran:surah:2` — Al-Baqarah
- **Canonical ID**: `adq:quran:surah:2`
- **Category**: `Surah`
- **Domain**: `Qur'an`
- **Source Dataset**: `mockQuranData[1]`
- **Source Repository**: `QuranRepository.getSurah(2)`
- **Multilingual Names**: `{ english: "The Cow", arabic: "البقرة", transliteration: "Al-Baqarah" }`
- **Revelation Info**: Medinan (Order: 87), 286 Ayahs
- **Authenticity**: `{ grade: "MUTAWATIR", verificationStatus: "CANONICAL" }`
- **Educational Level**: `Beginner`
- **Cross-Domain Links Available**: `adq:astronomy:hilal` (verse 2:189), `adq:ramadan` (verse 2:185), `adq:worship:wudu` (verse 2:222)
- **Cross-Domain Links Later**: `adq:fiqh:fasting`, `adq:fiqh:usury`

### 1.3 `adq:quran:surah:3` — Al-Imran
- **Canonical ID**: `adq:quran:surah:3`
- **Category**: `Surah`
- **Domain**: `Qur'an`
- **Source Dataset**: `mockQuranData[2]`
- **Source Repository**: `QuranRepository.getSurah(3)`
- **Multilingual Names**: `{ english: "Family of Imran", arabic: "آل عمران", transliteration: "Al-Imran" }`
- **Revelation Info**: Medinan (Order: 89), 200 Ayahs
- **Authenticity**: `{ grade: "MUTAWATIR", verificationStatus: "CANONICAL" }`
- **Educational Level**: `Intermediate`
- **Cross-Domain Links Available**: `adq:place:makkah` (verse 3:96 — first House at Bakkah)

### 1.4 `adq:quran:surah:36` — Ya-Sin
- **Canonical ID**: `adq:quran:surah:36`
- **Category**: `Surah`
- **Domain**: `Qur'an`
- **Source Dataset**: `mockQuranData[3]`
- **Source Repository**: `QuranRepository.getSurah(36)`
- **Multilingual Names**: `{ english: "Ya-Sin", arabic: "يس", transliteration: "Ya-Sin" }`
- **Revelation Info**: Meccan (Order: 41), 83 Ayahs
- **Authenticity**: `{ grade: "MUTAWATIR", verificationStatus: "CANONICAL" }`
- **Educational Level**: `Beginner`
- **Cross-Domain Links Available**: `adq:astronomy:sun` (verse 36:38), `adq:astronomy:moon` (verse 36:39)

---

## 2. Ayah Node Mappings (`adq:quran:verse:<surah>:<ayah>`)

### 2.1 `adq:quran:verse:36:38` — Solar Motion Verse
- **Canonical ID**: `adq:quran:verse:36:38`
- **Category**: `QuranVerse`
- **Domain**: `Qur'an`
- **Source Dataset**: `mockQuranData[3].ayahs[1]` & `quran-astronomy-map.json`
- **Source Repository**: `QuranRepository.getSurah(36)`
- **Arabic Text**: `وَالشَّمْسُ تَجْرِي لِمُسْتَقَرٍّ لَّهَا ۚ ذَٰلِكَ تَقْدِيرُ الْعَزِيزِ الْعَلِيمِ`
- **English Translation**: "And the sun runs [on course] toward its stopping point. That is the determination of the Exalted in Might, the Knowing."
- **Authenticity**: `{ grade: "MUTAWATIR", verificationStatus: "CANONICAL" }`
- **Cross-Domain Links Available**: `adq:astronomy:sun` (`scientific explanation of`), `adq:quran:surah:36` (`part of`)

### 2.2 `adq:quran:verse:36:39` — Lunar Phases Verse
- **Canonical ID**: `adq:quran:verse:36:39`
- **Category**: `QuranVerse`
- **Domain**: `Qur'an`
- **Source Dataset**: `quran-astronomy-map.json`
- **Source Repository**: `QuranRepository.getSurah(36)`
- **Arabic Text**: `وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّىٰ عَادَ كَالْعُرْجُونِ الْقَدِيمِ`
- **English Translation**: "And the moon - We have determined for it phases, until it returns [appearing] like the old date stalk."
- **Authenticity**: `{ grade: "MUTAWATIR", verificationStatus: "CANONICAL" }`
- **Cross-Domain Links Available**: `adq:astronomy:moon` (`scientific explanation of`), `adq:astronomy:hilal` (`explains`)

### 2.3 `adq:quran:verse:2:189` — Ahillah Moonsighting Verse
- **Canonical ID**: `adq:quran:verse:2:189`
- **Category**: `QuranVerse`
- **Domain**: `Qur'an`
- **Source Dataset**: `quran-astronomy-map.json`
- **Source Repository**: `QuranRepository.getSurah(2)`
- **Arabic Text**: `يَسْأَلُونَكَ عَنِ الْأَهِلَّةِ ۖ قُلْ هِيَ مَوَاقِيتُ لِلنَّاسِ وَالْحَجِّ`
- **English Translation**: "They ask you about the new moons. Say, 'They are measurements of time for the people and for Hajj.'"
- **Authenticity**: `{ grade: "MUTAWATIR", verificationStatus: "CANONICAL" }`
- **Cross-Domain Links Available**: `adq:astronomy:hilal` (`legal ruling for`), `adq:ramadan` (`governs`)

---

## 3. Qur'anic Theme Node Mappings (`adq:quran:theme:<slug>`)

### 3.1 `adq:quran:theme:creation` — Theme of Creation & Celestial Harmony
- **Canonical ID**: `adq:quran:theme:creation`
- **Category**: `QuranTheme`
- **Domain**: `Qur'an`
- **Description**: The recurring Qur'anic theme highlighting physical creation, cosmic balance, and environmental signs.
- **Cross-Domain Links Available**: `adq:quran:verse:36:38`, `adq:quran:verse:36:39`, `adq:nature:water`, `adq:astronomy:sun`
