# Zakat Module

A guided, evidence-first **Zakat calculator**: monetary wealth, gold & silver,
business assets, agriculture (ʿushr), and livestock — with nisab from live
gold/silver rates and every result carrying an ADQ verification status.

> Full design & workflow: **[Zakat-Specification.md](../../../../docs/Handbook/06-Features/Zakat/Zakat-Specification.md)**.

## One calculator, many parts

All calculation lives in the **Core Calculator**; the UI never computes, it only
calls it (same discipline as Mirath).

```
engine/
├── ZakatCalculator.ts     ← Core Calculator (the only entry point)
├── constants.ts           ← sourced weights & rates (87.48g / 612.36g, 2.5%, ushr, 653kg)
├── types.ts               ← ZakatInput / ZakatResult / ZakatDueLine
├── verification.ts        ← wraps the shared ADQ status vocabulary
└── parts/
    ├── nisab.ts           ← nisab value = price/g × grams
    ├── monetaryAssets.ts  ← Monetary + Gold&Silver + Business + Investments, 2.5%
    ├── livestock.ts       ← camel/cattle/sheep tables (Bukhari 1454, Abu Dawud)
    └── agriculture.ts     ← ushr 10% / 5%, nisab 653kg, in kind
services/metalPrices.ts    ← live gold/silver fetch (gold-api.com), manual fallback
pages/                     ← ZakatHome, ZakatCalculator (call the engine only)
```

## Usage

```ts
import { ZakatCalculator } from '@/features/zakat/engine/ZakatCalculator';

const result = ZakatCalculator.calculate({
  nisabBasis: 'silver',            // forced explicit choice; null → no result
  prices: { goldPricePerGram, silverPricePerGram, currency: 'USD' },
  monetary: { cash, goldValue, silverValue, businessGoods, investments },
  liabilities: { deductibleDebts },
  livestock: { camels, cattle, sheep },     // optional
  agriculture: [{ cropName, quantityKg, irrigatedByEffort }], // optional
});
// → { monetary, dueLines[], totalMonetaryDue, overallStatus, notes }
```

Money categories return an `amount`; livestock & crops return `inKind` (paid in
kind). Each `dueLine` carries a `status` (✔ / ⚠ / 📖 / 🔍) and a `source`.

## Verification & non-negotiables

- `npm run verify-zakat` — 43 hand-checked cases; part of `npm run build`.
- **Never invent a price** — only live-fetched or user-entered values are shown.
- **Never silently pick a disputed opinion** — see the shared status vocabulary
  at `src/platform/fiqh/verificationStatus.ts`.

## Awaiting scholarly sign-off before "lock"

The livestock/agriculture tables are the classical Sunni consensus, but the
amount-due composition above the tables (camels > 120; cattle at 120/240) is a
point of juristic discretion — those results are tagged ⚠ Scholarly Difference
in-app and must be confirmed by a qualified scholar before the module is locked.
