# ADQ Real-World Islamic Question Benchmark (500 Questions Framework)

**Phase**: 10B.9 — Tafsir Knowledge Domain Integration  
**Status**: Long-Term Verification Benchmark  
**Date**: 2026-07-23  
**Target Path**: `docs/Real-World-Islamic-Question-Benchmark.md`

---

## Executive Summary

This benchmark specifies 500 representative user questions across 14 Islamic knowledge categories to serve as ADQ's long-term evaluation suite for Graph-RAG retrieval and explainability trails.

---

## 1. Domain Category Taxonomy

1. **Aqeedah & Theology** (35 Questions)
2. **Salah & Prayer** (45 Questions)
3. **Zakat & Almsgiving** (40 Questions)
4. **Sawm & Fasting** (35 Questions)
5. **Hajj & Umrah** (40 Questions)
6. **Mirath & Inheritance** (35 Questions)
7. **Family & Marriage** (35 Questions)
8. **Seerah & Biography** (40 Questions)
9. **Qur'an & Revelation** (45 Questions)
10. **Hadith & Sunnah** (40 Questions)
11. **Tafsir & Exegesis** (35 Questions)
12. **Arabic Language & Morphology** (25 Questions)
13. **Astronomy & Moonsighting** (25 Questions)
14. **Daily Life & Contemporary Fiqh** (25 Questions)

---

## 2. Representative Question Matrix Samples

### Q1: Why is Maghrib prayer offered at sunset?
- **Domains Required**: `Prayer`, `Astronomy`, `Hadith`, `Qur'an`, `Tafsir`
- **Graph Nodes**: `adq:prayer:maghrib`, `adq:astronomy:sunset`, `adq:tafsir:razi:surah-17:78`, `adq:quran:verse:17:78`
- **Required Evidence**: Qur'an 17:78, Sahih al-Bukhari 521
- **Explainability Trail**: `Maghrib -> scientific explanation of -> Sunset -> explained by -> Qur'an 17:78 Exegesis`

### Q2: Who inherits if someone dies leaving a wife and two daughters?
- **Domains Required**: `Mirath`, `Qur'an`, `Tafsir`, `Fiqh`
- **Graph Nodes**: `adq:mirath:estate`, `adq:mirath:heir:wife`, `adq:mirath:heir:daughter`, `adq:tafsir:qurtubi:surah-4:11`
- **Required Evidence**: Qur'an 4:11, 4:12
- **Explainability Trail**: `Estate -> Wife (1/8 share) + Daughters (2/3 share) -> Governed by Surah An-Nisa 4:11`

### Q3: When does Ramadan fasting begin?
- **Domains Required**: `Worship`, `Astronomy`, `Hadith`, `Tafsir`
- **Graph Nodes**: `adq:worship:sawm`, `adq:astronomy:hilal`, `adq:tafsir:ibn-kathir:surah-2:183`, `adq:hadith:bukhari:1907`
- **Required Evidence**: Qur'an 2:183-185, Sahih al-Bukhari 1907
- **Explainability Trail**: `Sawm -> legal ruling for -> Hilal Moonsighting -> Sahih Bukhari 1907 ("Fast when you see the crescent")`
