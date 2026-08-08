# Adhkār & Duʿās — Specification

> Status: **Draft for build** (2026-08-03). Phase-2 content pillar of the Salaat
> module. Spec-first per the per-module workflow (spec → engine → UI → docs → review → lock).
> Scope is deliberately curated; see §8 for what is out of scope.

## 1. Purpose & principles

A daily companion for the remembrances (adhkār) and supplications (duʿās) tied to
prayer and daily life, consuming the existing Salaat schedule for timing.

Non-negotiables (from the project brief):
- **Never fabricate** Arabic text, a reference, or a grading. Every entry traces to a
  real source; anything uncertain is flagged for the user, not filled in.
- **Authenticity before richness.** A small, hand-vetted set beats a large auto-fetched one.
- **Neutral on madhhab differences**, marked with the shared verification badge.
- **Calm UI** — restrained interactions, no gamification pressure.
- Ramadan/Eid and month boundaries still follow local ruʾyah (unchanged; not this module's concern).

## 2. Content scope (curated core — Phase 2)

**Adhkār (timed / situational) — ~30 entries:**
- **Morning (al-Ṣabāḥ)** — window: after Fajr until sunrise.
- **Evening (al-Masāʾ)** — window: after ʿAṣr until Maghrib.
- **After each Ṣalāh** — the post-farḍ set (Āyat al-Kursī, the muʿawwidhāt, taSbīḥ 33/33/33+1, etc.).
- **Before sleep** — (Āyat al-Kursī, last two āyāt of al-Baqarah, the three quls, etc.).
- A few **situational** (entering/leaving home, entering the masjid, after wuḍūʾ) — small, high-confidence only.

**Duʿās (situational) — ~20 entries**, categorised **by situation** (distress, guidance,
rain, forgiveness, travel, before eating…), each labelled Qurʾānic or Prophetic with its reference.

Ships as "core set — more coming." Expanding the set later is data-only (no code change).

## 3. Sourcing architecture — **offline-first** (adjustment from the skeleton)

> **Decision (needs user nod):** the fetch-and-cache emphasis is inverted from the
> original outline. Bundled vetted data is the **primary** source, not a fallback.
> Rationale: authenticity (never live-display an un-vetted weak chain) + reliability
> (Sunnah.com's API is keyed/CORS-restricted and unsuitable for client-side use).

| Layer | Role | Phase 2 |
|---|---|---|
| **Bundled dataset** (`data/adhkar/*.ts`) | Hand-vetted core: Arabic, transliteration, translation, reference, repeat count, verification status. **Primary & authoritative. Works fully offline.** | ✅ built |
| **Quran.com API** (`api.quran.com` v4) | *Optional enrichment* of Qurʾānic entries only — alternate translation/transliteration, and (later) audio. Cached; non-blocking; failure is invisible (bundled text stays). | ✅ enrichment only |
| **Sunnah.com API** | Live fetch of hadith adhkār. **Deferred** — keyed/CORS-restricted, and live weak-chain content conflicts with the authenticity rule. Hadith-based entries are **bundled with references** instead. | ⛔ out of scope P2 |

Content authority for the bundled set: **Ḥiṣn al-Muslim** (Fortress of the Muslim) for
Prophetic adhkār, and the **Qurʾān** directly for āyah-based ones (Āyat al-Kursī, the
quls, last two of al-Baqarah). Each entry stores its citation.

Caching (for the optional Quran.com enrichment): localStorage/IndexedDB, keyed by
resource + edition, stale-while-revalidate, with backoff on error. Never blocks render.

## 4. Verification status per entry

Reuses the shared `platform/fiqh/verificationStatus` vocabulary; every entry carries one:
- **✔ consensus** — e.g. Āyat al-Kursī, the taSbīḥ, al-Muʿawwidhāt.
- **⚠ scholarly-difference** — present in one collection/wording but not another; madhhab variance.
- **📖 local-authority** — situational choices that vary by locale/school.
- **🔍 needs-review** — anything not yet manually vetted (should not ship visible; used as a build gate).

## 5. Data model

```ts
type DhikrCategory =
  | 'morning' | 'evening' | 'after-salah' | 'before-sleep' | 'situational';

interface AdhkarEntry {
  id: string;                 // stable slug, e.g. 'ayat-al-kursi'
  category: DhikrCategory;
  title: string;              // short English label
  arabic: string;             // vetted Arabic (required)
  transliteration?: string;
  translation: string;        // English (required)
  repeat: number;             // times to recite (1, 3, 33, 100…)
  reference: string;          // e.g. 'Ḥiṣn al-Muslim 27' or 'Qurʾān 2:255'
  quranRef?: { surah: number; ayah: number | [number, number] }; // enables Quran.com enrichment
  status: FiqhStatusId;       // verification badge
  virtue?: string;            // optional short note on reward/benefit, sourced
}

interface DuaEntry {
  id: string;
  situation: string;          // 'distress' | 'guidance' | 'rain' | 'forgiveness' | 'travel' | 'before-eating' | …
  title: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  source: 'quran' | 'sunnah';
  reference: string;
  quranRef?: { surah: number; ayah: number | [number, number] };
  status: FiqhStatusId;
}
```

## 6. Timing & progress (the "engine")

- **Timed-set windows** come from the existing `logic/schedule.ts` (no new time math):
  morning = Fajr→sunrise, evening = ʿAṣr→Maghrib. The UI shows which set is "active now".
- **Progress state** (`logic/adhkarProgress.ts`, localStorage `adq.adhkar.progress`), per date:
  per-entry completion + current count for repeated dhikr. **No fabricated data** — starts empty;
  resets daily (morning/evening sets reset each day).
- Pure functions only; the UI renders state and calls setters.

## 7. UI patterns

- **Route** `/prayer/adhkar` (index: the sets + situations), reachable from a Salaat-home pill.
- **Set view** — a checklist of expandable cards.
  - **Card collapsed:** title, repeat count, verification badge, completion tick.
  - **Card expanded:** Arabic (`adq-arabic-display`), transliteration, translation, reference (+badge). Audio slot reserved, hidden in P2.
- **Counter:** **tap-to-increment** on the card (calm, restrained); a small reset; fills a ring/among the `repeat` count; auto-marks complete at target. (No type-a-number, no aggressive haptics.)
- **Daily progress:** a gentle completion indicator for the morning & evening sets (e.g. "12 / 18").
- **Duʿās:** grouped by situation; same expandable card, no counter.

## 8. Post-ṣalāh integration (gentle)

When a prayer is logged in the Salaat Tracker, surface the **after-ṣalāh** set via a
**subtle badge/link on the tracker card — not a modal, not a forced flow**. Tapping opens
the after-ṣalāh set. Morning/evening sets also surface a quiet "active now" hint during their window.

## 9. Out of scope (Phase 2)

- Qurʾān/dhikr **audio** (files/streaming/offline — deferred; schema slot reserved).
- The **full 100+** situational corpus (curated core now; data-only expansion later).
- **Live Sunnah.com** fetch (bundled-with-reference instead; revisit if a workable API path appears).
- Push/adhan notifications (out of scope for the whole local web app).

## 10. Confirmed decisions

1. **Scope:** curated core (~30 adhkār + ~20 duʿās), "more coming." ✅
2. **Audio:** text-only in Phase 2. ✅
3. **Counter:** tap-to-increment. ✅
4. **Post-ṣalāh:** gentle badge on the tracker, not a modal. ✅
5. **Sourcing (adjustment):** offline-first bundled vetted dataset primary; Quran.com enrichment only; Sunnah.com live-fetch deferred. ⚠ awaiting user nod.

## 11. Build order

1. Data schema + bundled core dataset (with references & badges; flag anything uncertain).
2. `logic/adhkarProgress.ts` (progress/counter, pure) + timed-set resolver off `schedule.ts`.
3. Optional Quran.com enrichment service (cached, non-blocking).
4. UI: `/prayer/adhkar` set/situation views + counter + expandable cards.
5. Post-ṣalāh gentle hook on the Salaat home.
6. README + review + lock.
