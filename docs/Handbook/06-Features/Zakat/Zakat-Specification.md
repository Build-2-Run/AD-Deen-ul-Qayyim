# Zakat — Workflow & Module Specification

> Status: **Draft spec, engine implemented, UI pending.** Written before the UI
> (per project workflow: spec → components). The livestock/agriculture rulings
> are implemented from classical sources but **await a scholar's sign-off**
> before the module is "locked."

## 1. Principle

Zakat is one calculator with parts, not many engines. All calculation lives in
the **Core Calculator** (`app/src/features/zakat/engine/ZakatCalculator.ts`).
**The UI never computes** — every number it shows comes from a call to the Core
Calculator, exactly like Mirath's `DistributionEngine`.

Two non-negotiables:

- **Never invent a price.** A metal price is shown only if it actually came from
  a live fetch or the user's own manual entry. No cached/placeholder "today's
  price."
- **Never silently pick a disputed opinion.** Every result line carries an ADQ
  **verification status** (`app/src/platform/fiqh/verificationStatus.ts`):
  ✔ Consensus · ⚠ Scholarly Difference · 📖 Local Authority · 🔍 Needs Review.

## 2. Engine parts (already built)

| Part | File | Responsibility |
|------|------|----------------|
| Core Calculator | `engine/ZakatCalculator.ts` | Orchestrates all parts → one `ZakatResult` |
| Nisab | `engine/parts/nisab.ts` | Nisab value from metal price × 87.48 g (gold) / 612.36 g (silver) |
| Monetary / Gold & Silver / Business | `engine/parts/monetaryAssets.ts` | Pools cash, gold & silver, business goods, investments; 2.5% above nisab; per-category breakdown |
| Agriculture | `engine/parts/agriculture.ts` | ʿushr 10% rain-fed / 5% irrigated, nisab ~653 kg, per crop, in kind |
| Livestock | `engine/parts/livestock.ts` | Camel/cattle/sheep tables; flags disputed compositions |
| Verification | `engine/verification.ts` | Wraps the shared ADQ status vocabulary; summarises a result |

Verified by `npm run verify-zakat` (43 hand-checked cases; part of `npm run build`).

## 3. User workflow

```
Currency  →  Nisab standard  →  Prices (live / manual)  →  Assets  →
Liabilities  →  Hawl confirmation  →  Review Assumptions  →  Calculate  →
Evidence  →  Result  →  Export
```

Two deliberate ordering choices (ADQ is educational):

- **Review Assumptions before Calculate** — the user confirms *what* is being
  assumed (which opinions/categories apply) before any number is produced. This
  prevents silently-wrong results.
- **Evidence before Result** — the user sees *why* before *what*. Trust is built
  by showing the reasoning first, the final figure second.

### 3.1 Currency
- User selects a display currency (default: their locale; changeable).
- Currency is a **display + input** concern only. The engine is currency-neutral
  — it works in whatever unit the prices and asset values share.

### 3.2 Nisab standard — **forced explicit choice**
- User must actively choose **Gold** or **Silver** before monetary results show.
- No default is assumed. Each option shows a one-line explanation (silver → lower
  threshold, more inclusive; gold → higher threshold) and its weight.
- Status: ✔ Consensus that both are valid bases; which to use for cash is itself
  a ⚠ Scholarly Difference — surface that note.

### 3.3 Prices — live with manual fallback
1. On entering the calculator, attempt to fetch the current gold & silver price
   per gram for the chosen currency.
2. On success: show the value, its **source**, and an "as of" timestamp; allow
   the user to override.
3. On failure / offline: prompt **manual entry** of price per gram. No fabricated
   default is pre-filled.
4. Nisab values recompute live from whichever prices are in effect.

### 3.4 Assets (parts, entered by category)
- **Monetary Assets** — cash, bank, savings.
- **Gold & Silver** — market value of metal held as wealth (personal-use
  jewellery is a ⚠ Scholarly Difference — note it, do not force).
- **Business Assets** — trade inventory + collectable receivables.
- **Investments** — zakatable portion of shares/funds.
- **Agriculture** — per crop: quantity (kg) + watering method (rain vs effort).
- **Livestock** — head count of camels, cattle, sheep/goats.

### 3.5 Liabilities
- Deductible short-term debts (due within the year) reduce net monetary wealth.
- Note: long-term debts (e.g. mortgages) are not deducted in full.

### 3.6 Hawl confirmation
- Before showing a monetary/livestock result, ask the user to confirm the wealth
  has been held for a full lunar year (~354 days). The engine does not know dates;
  this is an explicit user attestation. Agriculture skips this (due at harvest).

### 3.7 Review Assumptions
Before calculating, present a concise checklist of the assumptions that shape the
result so the user can verify them. Each is a real choice, not a hidden default:

- **Personal jewellery** — include personal-use gold/silver as zakatable? (⚠ see 5)
- **Business inventory** — are trade goods included?
- **Agriculture** — does the assessment include crops?
- **Livestock** — does it include grazing animals?
- **Nisab standard** — confirm gold vs silver (e.g. "my local scholar uses silver").

Changing an assumption updates the inputs shown and the calculation.

The personal-jewellery choice must be presented as a genuine ⚠ difference:

> **⚠ Scholarly Difference**
> Some scholars include personal gold jewellery in Zakat; others exempt ordinary
> personal jewellery. Choose the opinion you follow, or consult your local scholar.

### 3.8 Calculate → Evidence → Result
- Single call to `ZakatCalculator.calculate(input)`. **Evidence is shown first**,
  then the final figures.
- **Evidence:** each line's Qur'an/hadith source and its verification-status badge
  (✔ / ⚠ / 📖 / 🔍). Consensus vs difference is shown, never hidden.
- **Result:** net zakatable wealth, chosen nisab value, monetary Zakat due (money),
  and livestock/agriculture due **in kind**. The overall result carries the
  least-settled status of its lines.

### 3.9 "How was this calculated?" — the ADQ signature disclosure
Every ADQ calculator ends with a collapsible **How was this calculated?** panel.
Expanded, it exposes what the engine already knows:

```
Step 1 … Step 2 … Step 3      (the ordered trace)
Evidence                       (sources per line)
Formula                        (e.g. net × 2.5%, nisab = price/g × 87.48)
Assumptions                    (the choices from 3.7)
```

This is a cross-ADQ standard (Mirath already exposes a calculation trace; the
same disclosure applies everywhere). The engine is the single source — the UI
only renders what the calculator returns.

### 3.10 Export
- Export the assessment (PDF/CSV) — deferred; the `ExportProvider` interface
  already exists. **Not in v1 scope** (confirmed).

## 4. Data model

Input `ZakatInput` and output `ZakatResult` are defined in `engine/types.ts`.
Key shapes: `MetalPrices` (per-gram + currency + source + asOf), `MonetaryAssets`,
`Liabilities`, `LivestockHerd`, `AgricultureHarvest[]`, `NisabBasis`
(`'gold' | 'silver' | null`), and `ZakatDueLine` (money `amount` OR `inKind`
string, `status`, `source`).

## 5. Out of scope / open items

- **Scholar sign-off** on livestock (esp. camels > 120, cattle at 120/240) and
  agriculture before "lock." These are tagged ⚠ in-app.
- **Live price data source** — provider not yet chosen; manual entry is the
  guaranteed path. To be finalised later (user's call).
- **Persistence / saved calculations**, **Export** — deferred.
- Rikaz (treasure) and other minor categories — not included.
