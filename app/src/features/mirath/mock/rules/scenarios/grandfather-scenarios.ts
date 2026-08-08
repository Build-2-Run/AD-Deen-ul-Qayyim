import { WorkedExample } from '../../../models';

/**
 * Bab al-Jadd wa'l-Ikhwa — the grandfather (jadd) inheriting alongside
 * full/consanguine siblings under the Jumhur (Zayd ibn Thabit) doctrine.
 *
 * Under this doctrine the grandfather does NOT exclude the siblings (that is
 * the Hanafi/Abu Hanifa view). Instead he takes the BEST of three options:
 *   (a) muqasamah — sharing the residue as if he were a brother (2:1),
 *   (b) one-third of the remainder, or
 *   (c) one-sixth of the whole estate.
 *
 * These scenarios guard MuqasamahProcessor. All expected shares are
 * hand-derived from the classical rules (not engine output).
 */
export const grandfatherScenarios: WorkedExample[] = [
  {
    id: 'example:muqasamah_gf_1fb',
    title: 'Grandfather + 1 Full Brother (Muqasamah)',
    description: 'Grandfather shares equally with a single brother (muqasamah beats 1/3 of remainder).',
    type: 'example',
    difficulty: 'Advanced',
    estate: { gross: 27000, funeral: 0, debts: 0, bequests: 0, net: 27000 },
    shares: [
      { heirId: 'heir:paternal_grandfather', heirName: 'Grandfather', fraction: '1/2', amount: 13500, rationale: 'Muqasamah: shares residue equally with the brother (2:1 with one male = 1:1).' },
      { heirId: 'heir:full_brother', heirName: 'Full Brother', fraction: '1/2', amount: 13500, rationale: 'Shares residue equally with the grandfather.' }
    ]
  },
  {
    id: 'example:muqasamah_gf_2fb',
    title: 'Grandfather + 2 Full Brothers',
    description: 'Three-way equal split; muqasamah equals one-third of remainder.',
    type: 'example',
    difficulty: 'Advanced',
    estate: { gross: 27000, funeral: 0, debts: 0, bequests: 0, net: 27000 },
    shares: [
      { heirId: 'heir:paternal_grandfather', heirName: 'Grandfather', fraction: '1/3', amount: 9000, rationale: 'Muqasamah with two brothers = one-third each.' },
      { heirId: 'heir:full_brother', heirName: 'Full Brother 1', fraction: '1/3', amount: 9000, rationale: 'One-third each in muqasamah.' },
      { heirId: 'heir:full_brother', heirName: 'Full Brother 2', fraction: '1/3', amount: 9000, rationale: 'One-third each in muqasamah.' }
    ]
  },
  {
    id: 'example:muqasamah_gf_3fb',
    title: 'Grandfather + 3 Full Brothers (1/3 floor)',
    description: 'With three or more brothers, one-third of the estate becomes better for the grandfather than muqasamah.',
    type: 'example',
    difficulty: 'Advanced',
    estate: { gross: 27000, funeral: 0, debts: 0, bequests: 0, net: 27000 },
    shares: [
      { heirId: 'heir:paternal_grandfather', heirName: 'Grandfather', fraction: '1/3', amount: 9000, rationale: 'Takes one-third of remainder (muqasamah would give only 1/4).' },
      { heirId: 'heir:full_brother', heirName: 'Full Brother 1', fraction: '2/9', amount: 6000, rationale: 'Three brothers split the remaining two-thirds equally.' },
      { heirId: 'heir:full_brother', heirName: 'Full Brother 2', fraction: '2/9', amount: 6000, rationale: 'Three brothers split the remaining two-thirds equally.' },
      { heirId: 'heir:full_brother', heirName: 'Full Brother 3', fraction: '2/9', amount: 6000, rationale: 'Three brothers split the remaining two-thirds equally.' }
    ]
  },
  {
    id: 'example:muqasamah_gf_1fs',
    title: 'Grandfather + 1 Full Sister',
    description: 'Grandfather and sister share the estate as residuaries in a 2:1 ratio (the sister does not take a fixed 1/2 while the grandfather is present).',
    type: 'example',
    difficulty: 'Advanced',
    estate: { gross: 27000, funeral: 0, debts: 0, bequests: 0, net: 27000 },
    shares: [
      { heirId: 'heir:paternal_grandfather', heirName: 'Grandfather', fraction: '2/3', amount: 18000, rationale: 'Muqasamah: takes two shares to the sister\'s one.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister', fraction: '1/3', amount: 9000, rationale: 'Takes one share to the grandfather\'s two.' }
    ]
  },
  {
    id: 'example:muqasamah_gf_fb_husband',
    title: 'Grandfather + Full Brother + Husband',
    description: 'Husband takes his fixed 1/2; the grandfather and brother share the remaining 1/2 by muqasamah.',
    type: 'example',
    difficulty: 'Advanced',
    estate: { gross: 27000, funeral: 0, debts: 0, bequests: 0, net: 27000 },
    shares: [
      { heirId: 'heir:husband', heirName: 'Husband', fraction: '1/2', amount: 13500, rationale: 'Fixed 1/2 (no descendants).' },
      { heirId: 'heir:paternal_grandfather', heirName: 'Grandfather', fraction: '1/4', amount: 6750, rationale: 'Muqasamah on the 1/2 residue (1/4 beats 1/6-of-whole and 1/3-of-remainder).' },
      { heirId: 'heir:full_brother', heirName: 'Full Brother', fraction: '1/4', amount: 6750, rationale: 'Shares the residue equally with the grandfather.' }
    ]
  }
];
