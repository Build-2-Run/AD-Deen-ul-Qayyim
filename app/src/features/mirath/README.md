# Mirath Module — Islamic Inheritance (Fara'iḍ)

A rules-based **calculation engine** and **calculation workspace** for dividing
an estate according to Islamic inheritance law: settling obligations, assigning
the Qur'anic fixed shares (furūḍ), and distributing the residue to the agnatic
heirs (ʿaṣabah), including the classical special cases.

> **Doctrine scope (as of 2026-07-27):** the engine implements the **Jumhur
> (majority)** position — the doctrine of Zayd ibn Thabit adopted by the
> Maliki, Shafi'i, and Hanbali schools. The per-madhhab rulesets
> (`mock/rulesets/hanafi`, `maliki`, …) are **stubs that currently inherit
> Jumhur unchanged**, so every school returns identical numbers for now. The
> `RuleSetLoader` merge/override architecture is ready for real school-specific
> rules (e.g. Hanafi: grandfather blocks siblings; radd / dhawu al-arham
> differences) to be populated later.

## Public API

Call the engine directly (no service facade yet):

```ts
import { DistributionEngine } from '@/features/mirath/engine/DistributionEngine';
import { RuleSetLoader } from '@/features/mirath/engine/RuleSetLoader';
import type { Estate, Heir } from '@/features/mirath/models';

const estate: Estate = { totalAssets, funeralExpenses, debts, bequests };
const heirs: Heir[] = [ /* one object per heir; use the same id for duplicates */ ];

const result = DistributionEngine.calculate(estate, heirs, RuleSetLoader.load('Jumhur'));
// → EngineState { heirs: HeirState[], netDistributable, trace, ... }
```

Each `HeirState` carries `finalFraction` (a `Fraction`), `finalAmount`,
`isAsabah`, `isBlocked` / `blockedBy`, and `explanation`. Heirs of the same
kind are passed as **N separate objects sharing one canonical id**
(`heir:son`, `heir:full_brother`, …); the engine assigns each its per-head
share.

## Pipeline

`DistributionEngine.calculate` runs a fixed sequence, appending a `trace` entry
at every step (this is what powers the "calculation steps" panel in the UI):

1. **Eligibility** → 2. **Blocking (ḥajb)** → 3. **Fixed shares (furūḍ)** →
4. **Residuary (ʿaṣabah)** → 5. **Special cases** → 6. **Monetary distribution**
→ 7. **Explanation**.

Special cases (`engine/processors/`), run before Awl/Radd balancing:
Umariyyatayn, Mushtarakah (Ḥimāriyyah), Akdariyyah, Muqasamah (grandfather with
siblings), Missing Person, Pregnancy, Khuntha — then **Awl** (proportional
reduction) and **Radd** (return of surplus, spouses excluded).

## Folder map

| Folder | What it holds |
|--------|---------------|
| `engine/` | Pipeline engines (Eligibility, Blocking, FixedShare, Residuary, SpecialCase, Distribution, Explanation), `Fraction`, `RuleMatcher`, `RuleSetLoader`, `BranchEvaluator`, `types.ts` |
| `engine/processors/` | The 9 special-case processors listed above |
| `mock/rules/` | The rule data: `heirs`, `fixed-shares`, `blocking`, `asabah`, `special-cases`, and `scenarios/` (hand-written + regression cases) |
| `mock/rulesets/` | Per-madhhab rulesets — `jumhur` (base) + `hanafi`/`maliki`/`shafii`/`hanbali` (stubs inheriting Jumhur) |
| `models/` | `Heir`, `Estate`, `Relationship`, result types (`index.ts`) + rule types (`rules.ts`) |
| `pages/` | `MirathHome` (landing), `MirathWorkspace` (the calculator), `MirathEncyclopedia` (rule reference) |
| `scripts/` | `verify-mirath`, `verify-golden-references`, `validate-*` (run via tsx, excluded from the app typecheck) |
| `adapters/`, `providers/` | Knowledge-node adapter + module provider glue |

## Verification

```bash
npm run verify-mirath              # 205 scenarios + schema/engine/scholarly checks
npm run verify-golden-references   # 3 cases traced to classical texts (Sirajiyyah, Mughni, Umar's ruling)
```

`verify-mirath` also runs as the first step of `npm run build`, so a green
build guarantees the scenarios still pass. Scenario expected values in
`mock/rules/scenarios/*` are **hand-derived oracles**; the `auto-generated.ts`
set was seeded from the engine and serves as a regression guard.

## History

- **2026-07-27:** Fixed `MuqasamahProcessor` (it matched heirs by the
  inconsistent `relationship` field instead of canonical id, so the
  grandfather-with-siblings doctrine never fired and the grandfather wrongly
  excluded siblings). Added `scenarios/grandfather-scenarios.ts` and corrected
  `auto_gen_23`, whose expected value had encoded the bug.
- **2026-07-27:** Removed the dev/audit/placeholder pages (Debug, Verification,
  Evidence, Comparison, RuleGraph, RuleAudit, Readiness, AuditReport) and their
  routes — recoverable from git history. The module now exposes only the three
  user-facing pages.
