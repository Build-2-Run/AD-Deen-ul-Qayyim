/**
 * Zakat constants — every value here traces to a classical source.
 * Nothing in this file is invented; where scholars differ, the difference
 * is noted rather than silently resolved.
 */

// Nisab by weight of pure metal.
// Gold: 20 mithqal ≈ 85 g (many use 87.48 g). Silver: 200 dirham ≈ 595 g
// (many use 612.36 g). We adopt the widely-used contemporary figures and
// expose them so they can be adjusted.
export const GOLD_NISAB_GRAMS = 87.48; // 20 mithqāl of gold (≈ 7.5 tola)
export const SILVER_NISAB_GRAMS = 612.36; // 200 dirham of silver (≈ 52.5 tola)

// 1 tola = 11.6638 g (the standard South-Asian jeweller's tola). Gold nisab is
// commonly quoted as 7.5 tola and silver as 52.5 tola.
export const TOLA_GRAMS = 11.6638;
export const gramsToTola = (grams: number): number => grams / TOLA_GRAMS;

// Rate on monetary wealth / trade goods held for a lunar year (hawl): 1/40 = 2.5%.
export const MONETARY_ZAKAT_RATE = 0.025;

// Agriculture (ʿushr): nisab is 5 awsuq ≈ 653 kg of the staple crop.
// Rate: 10% if watered without cost (rain/springs), 5% if irrigated by effort/cost.
// Source: "On that which is watered by rivers and rain, a tenth; on that watered
// by irrigation, half a tenth." (Sahih al-Bukhari 1483).
export const AGRICULTURE_NISAB_KG = 653;
export const USHR_RAINFED = 0.1; // 1/10
export const USHR_IRRIGATED = 0.05; // 1/20

// Common regional sack/bori weight (South Asia). This is a logistics
// convention, not a fiqh-fixed value — the UI exposes it as configurable.
export const BAG_WEIGHT_KG_DEFAULT = 65;

// Lunar year in days — used only for informational hawl hints, not a hard gate.
export const HAWL_DAYS = 354;

export const ZAKAT_ENGINE_VERSION = '0.1.0';
