import { ZakatDueLine } from '../types';
import { FiqhStatusId } from '../../../../platform/fiqh/verificationStatus';

/**
 * Livestock (al-anʿam) Zakat. Grazing (sāʾima) animals held a full year.
 * Tables from the Prophetic prescription on Sadaqah recorded in
 * Sahih al-Bukhari (1454) and Sunan Abi Dawud (1568, 1570).
 *
 * The explicit tables are consensus. The composition of the amount due above
 * the tables (camels > 120; cattle herds that split into 30s and 40s more than
 * one way, e.g. 120) is a point of juristic discretion → tagged
 * 'scholarly-difference'.
 */

const SHEEP_SRC = 'Sahih al-Bukhari 1454 (letter of Abu Bakr on Sadaqah)';
const CATTLE_SRC = 'Sunan Abi Dawud 1576; Jami at-Tirmidhi 623';
const CAMEL_SRC = 'Sahih al-Bukhari 1454';

/** Nisab (minimum herd size) below which no livestock zakat is due. */
export const CAMEL_NISAB = 5;
export const CATTLE_NISAB = 30;
export const SHEEP_NISAB = 40;

function line(
  category: ZakatDueLine['category'],
  label: string,
  inKind: string,
  detail: string,
  source: string,
  status: FiqhStatusId
): ZakatDueLine {
  return { category, label, inKind, detail, source, status, needsVerification: status !== 'consensus' };
}

/** Sheep & goats (ghanam). */
export function sheepZakat(n: number): ZakatDueLine | null {
  if (n < SHEEP_NISAB) return null;
  let due: number;
  if (n <= 120) due = 1;
  else if (n <= 200) due = 2;
  else if (n <= 399) due = 3;
  else due = Math.floor(n / 100); // 400→4, then +1 per additional 100
  return line('livestock-sheep', 'Sheep & goats', `${due} sheep/goat${due > 1 ? 's' : ''}`, `${n} head → ${due} due.`, SHEEP_SRC, 'consensus');
}

interface Decomp {
  small: number;
  large: number;
  leftover: number;
  ambiguous: boolean;
}

/**
 * Decompose a herd into groups of `smallUnit` and `largeUnit`, maximising
 * coverage (minimising uncounted leftover). Flags herds that have more than
 * one equally-valid decomposition (a point of juristic discretion).
 */
function decompose(n: number, smallUnit: number, largeUnit: number): Decomp {
  let minLeftover = Infinity;
  const solutions: Array<{ small: number; large: number }> = [];
  for (let large = 0; large <= Math.floor(n / largeUnit); large++) {
    const rem = n - largeUnit * large;
    const small = Math.floor(rem / smallUnit);
    const leftover = rem - smallUnit * small;
    if (leftover < minLeftover) {
      minLeftover = leftover;
      solutions.length = 0;
      solutions.push({ small, large });
    } else if (leftover === minLeftover) {
      solutions.push({ small, large });
    }
  }
  // Tie-break: fewest total animals, then prefer more of the older (large) animal.
  solutions.sort((a, b) => a.small + a.large - (b.small + b.large) || b.large - a.large);
  const chosen = solutions[0];
  return { small: chosen.small, large: chosen.large, leftover: minLeftover, ambiguous: solutions.length > 1 };
}

/** Cattle (baqar): every 30 → tabīʿ (1yr), every 40 → musinnah (2yr). */
export function cattleZakat(n: number): ZakatDueLine | null {
  if (n < CATTLE_NISAB) return null;
  if (n < 40) return line('livestock-cattle', 'Cattle', '1 tabīʿ (1-year-old)', `${n} head.`, CATTLE_SRC, 'consensus');
  if (n < 60) return line('livestock-cattle', 'Cattle', '1 musinnah (2-year-old)', `${n} head.`, CATTLE_SRC, 'consensus');
  const d = decompose(n, 30, 40); // small = tabīʿ, large = musinnah
  const parts: string[] = [];
  if (d.large) parts.push(`${d.large} musinnah (2yr)`);
  if (d.small) parts.push(`${d.small} tabīʿ (1yr)`);
  return line(
    'livestock-cattle',
    'Cattle',
    parts.join(' + '),
    `${n} head${d.leftover ? ` (${d.leftover} not additionally assessed)` : ''}.`,
    CATTLE_SRC,
    d.ambiguous ? 'scholarly-difference' : 'consensus'
  );
}

/** Camels (ibil). Explicit table to 120, then every 40 → bint labūn, every 50 → ḥiqqah. */
export function camelZakat(n: number): ZakatDueLine | null {
  if (n < CAMEL_NISAB) return null;
  const c = (inKind: string, status: FiqhStatusId = 'consensus') =>
    line('livestock-camels', 'Camels', inKind, `${n} head.`, CAMEL_SRC, status);
  if (n <= 24) {
    const sheep = Math.floor(n / 5); // 5→1, 10→2, 15→3, 20→4
    return c(`${sheep} sheep/goat${sheep > 1 ? 's' : ''}`);
  }
  if (n <= 35) return c('1 bint makhāḍ (1-year-old she-camel)');
  if (n <= 45) return c('1 bint labūn (2-year-old she-camel)');
  if (n <= 60) return c('1 ḥiqqah (3-year-old she-camel)');
  if (n <= 75) return c('1 jadhaʿah (4-year-old she-camel)');
  if (n <= 90) return c('2 bint labūn');
  if (n <= 120) return c('2 ḥiqqah');
  // n > 120: every 40 → bint labūn, every 50 → ḥiqqah. Schools differ on the restart.
  const d = decompose(n, 40, 50); // small = bint labūn, large = ḥiqqah
  const parts: string[] = [];
  if (d.large) parts.push(`${d.large} ḥiqqah`);
  if (d.small) parts.push(`${d.small} bint labūn`);
  return c(parts.join(' + '), 'scholarly-difference');
}

export function livestockZakat(herd: { camels: number; cattle: number; sheep: number }): ZakatDueLine[] {
  const lines: ZakatDueLine[] = [];
  const camel = camelZakat(herd.camels || 0);
  const cattle = cattleZakat(herd.cattle || 0);
  const sheep = sheepZakat(herd.sheep || 0);
  if (camel) lines.push(camel);
  if (cattle) lines.push(cattle);
  if (sheep) lines.push(sheep);
  return lines;
}
