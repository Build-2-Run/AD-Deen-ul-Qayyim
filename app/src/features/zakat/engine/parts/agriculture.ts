import { AGRICULTURE_NISAB_KG, BAG_WEIGHT_KG_DEFAULT, USHR_IRRIGATED, USHR_RAINFED } from '../constants';
import { AgricultureHarvest, ZakatDueLine } from '../types';

const AGRI_SRC = 'Sahih al-Bukhari 1483; Sahih Muslim 979; Qur\'an 6:141';

/**
 * Ḥanafī basis for taxing produce without a nisab minimum: the general
 * wording of the harvest-day verse, read (per Abū Ḥanīfah) without the
 * qualifying "five awsuq" report the Jumhūr apply to gate it. This is a
 * named school position, not a hadith of its own — flagged accordingly.
 */
const HANAFI_SRC = "Qur'an 6:141 (general wording, per Abū Ḥanīfah's reading — no nisab condition applied)";

/**
 * Agricultural Zakat (ʿushr). Due at harvest (no hawl).
 *
 * Grain/staple crops follow the Jumhūr rule regardless of the `fiqhSchool`
 * field: nisab-gated at ~653 kg (5 awsuq), 10%/5% by irrigation, paid in kind.
 *
 * Fresh fruit & vegetable produce is where the schools genuinely diverge:
 *  - Jumhūr (Mālikī/Shāfiʿī/Ḥanbalī): exempt from ʿushr at harvest — nothing
 *    is due here; the eventual sale proceeds re-enter the normal monetary
 *    zakat cycle (2.5%, after a full hawl) if still held as savings.
 *  - Ḥanafī: 10%/5% applies directly, with no nisab minimum, computed either
 *    on weight (kg/bags) or on sales revenue (boxes/crates).
 */
export function agricultureZakat(
  harvests: AgricultureHarvest[] | undefined,
  currency = ''
): ZakatDueLine[] {
  if (!harvests || harvests.length === 0) return [];
  const lines: ZakatDueLine[] = [];

  for (const h of harvests) {
    const rate = h.irrigatedByEffort ? USHR_IRRIGATED : USHR_RAINFED;
    const rateLabel = h.irrigatedByEffort ? '5% (irrigated by effort)' : '10% (rain/spring watered)';
    const isFruitVeg = h.category === 'fruit-vegetable';
    const school = isFruitVeg ? h.fiqhSchool : 'jumhur';

    // Jumhūr on fresh produce: nothing due at harvest.
    if (isFruitVeg && school === 'jumhur') continue;

    const noNisabGate = isFruitVeg && school === 'hanafi';
    const source = noNisabGate ? HANAFI_SRC : AGRI_SRC;

    if (h.unit === 'boxes') {
      const boxes = Math.max(0, h.quantity || 0);
      const price = Math.max(0, h.pricePerUnit || 0);
      if (boxes <= 0 || price <= 0) continue;
      const revenue = boxes * price;
      const due = revenue * rate;
      lines.push({
        category: 'agriculture',
        label: h.cropName || 'Crop',
        inKind: `${due.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency} (${rateLabel} of sales revenue)`,
        detail:
          `${boxes.toLocaleString()} box(es) × ${price.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}/box ` +
          `= ${revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency} revenue.` +
          (noNisabGate ? ' Ḥanafī view: no nisab minimum applied.' : ''),
        source,
        // Revenue-basis ʿushr on grain (no weight to check nisab against) is
        // an unusual combination this app can't verify — flagged for review.
        status: isFruitVeg ? 'scholarly-difference' : 'needs-review',
      });
      continue;
    }

    // kg or bags → weight-based.
    const bagWeight = h.bagWeightKg > 0 ? h.bagWeightKg : BAG_WEIGHT_KG_DEFAULT;
    const kg = h.unit === 'bags' ? Math.max(0, h.quantity || 0) * bagWeight : Math.max(0, h.quantity || 0);
    if (kg <= 0) continue;
    if (!noNisabGate && kg < AGRICULTURE_NISAB_KG) continue; // below nisab → nothing

    const dueKg = kg * rate;
    const inKind =
      h.unit === 'bags'
        ? formatBags(dueKg, bagWeight)
        : `${dueKg.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg`;

    lines.push({
      category: 'agriculture',
      label: h.cropName || 'Crop',
      inKind,
      detail:
        `${kg.toLocaleString()} kg harvested, ${rateLabel}.` +
        (noNisabGate ? ' Ḥanafī view: no nisab minimum applied.' : ''),
      source,
      status: isFruitVeg ? 'scholarly-difference' : 'consensus',
    });
  }
  return lines;
}

/** Express a due weight in bag units (e.g. "0.5 bag (32.50 kg)"). */
function formatBags(dueKg: number, bagWeightKg: number): string {
  const bags = bagWeightKg > 0 ? dueKg / bagWeightKg : 0;
  const bagsRounded = Math.round(bags * 100) / 100;
  const label = bagsRounded === 1 ? 'bag' : 'bags';
  return `${bagsRounded.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${label} (${dueKg.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg)`;
}
