import type { FiqhStatusId } from '../../../platform/fiqh/verificationStatus';

/**
 * Sunnah & Nafl reference catalogue. This is fiqh *reference* content, not a
 * calculation — rakʿah counts are concise summaries of the classical schools in
 * our own words (see the page-level "verify with a scholar" note). Where the
 * schools genuinely differ, the item is marked 'scholarly-difference'. The two
 * cited hadith are well-established and attributed.
 */

export type Emphasis = 'Muʾakkadah' | 'Ghayr muʾakkadah' | 'Nafl' | 'Witr';

export interface Ruling {
  rakah: string;
  emphasis: Emphasis;
  status: FiqhStatusId;
  note?: string;
}

export interface PrayerSunnah {
  key: string;
  label: string;
  before: Ruling[];
  after: Ruling[];
}

/** The regular sunan ar-rawātib around the five obligatory prayers. */
export const RAWATIB: PrayerSunnah[] = [
  {
    key: 'fajr',
    label: 'Fajr',
    before: [{ rakah: '2', emphasis: 'Muʾakkadah', status: 'consensus', note: 'Among the most emphasised of all voluntary prayers; the Prophet ﷺ rarely left them.' }],
    after: [],
  },
  {
    key: 'dhuhr',
    label: 'Dhuhr',
    before: [{ rakah: '4 (some pray 2)', emphasis: 'Muʾakkadah', status: 'scholarly-difference', note: 'The Ḥanafīs pray 4 before; others commonly pray 2 or 4.' }],
    after: [{ rakah: '2 (some add 2 more)', emphasis: 'Muʾakkadah', status: 'scholarly-difference', note: 'Two are emphasised; a further two are extra nafl in some schools.' }],
  },
  {
    key: 'asr',
    label: 'Asr',
    before: [{ rakah: '4', emphasis: 'Ghayr muʾakkadah', status: 'scholarly-difference', note: 'Recommended but not emphasised. No sunnah is prayed after ʿAsr (until Maghrib).' }],
    after: [],
  },
  {
    key: 'maghrib',
    label: 'Maghrib',
    before: [],
    after: [{ rakah: '2', emphasis: 'Muʾakkadah', status: 'consensus' }],
  },
  {
    key: 'isha',
    label: 'Isha',
    before: [],
    after: [
      { rakah: '2', emphasis: 'Muʾakkadah', status: 'consensus' },
      { rakah: '1, 3, 5…', emphasis: 'Witr', status: 'scholarly-difference', note: 'Witr closes the night prayers. The Ḥanafīs hold it wājib (obligatory); the majority hold it a strongly emphasised sunnah. Valid from after Isha until Fajr.' },
    ],
  },
];

export interface VoluntaryPrayer {
  key: string;
  label: string;
  rakah: string;
  when: string;
  status: FiqhStatusId;
  note: string;
}

/** Standalone voluntary prayers (their timings are on the Today screen). */
export const VOLUNTARY: VoluntaryPrayer[] = [
  { key: 'ishraq', label: 'Ishrāq', rakah: '2', when: 'Shortly after sunrise', status: 'consensus', note: 'Prayed once the sun has fully risen and the forbidden time has passed.' },
  { key: 'duha', label: 'Chāsht (Ḍuḥā)', rakah: '2–8', when: 'Forenoon, before Zawāl', status: 'consensus', note: 'The forenoon prayer; commonly 2 to 8 rakʿah, best in the mid to late morning.' },
  { key: 'awwabin', label: 'Awwābīn', rakah: '2–6', when: 'Between Maghrib and Isha', status: 'scholarly-difference', note: 'Voluntary prayer after Maghrib; the number prayed varies between scholars.' },
  { key: 'tahajjud', label: 'Tahajjud', rakah: '2+ (in pairs)', when: 'Night, best in the last third', status: 'consensus', note: 'The night prayer, prayed after sleeping; the last third of the night is the most virtuous time.' },
];

export const SUNNAH_EVIDENCE: { text: string; source: string; status: FiqhStatusId }[] = [
  {
    text: 'Whoever prays twelve rakʿah of voluntary prayer in a day and a night, a house will be built for him in Paradise — two before Fajr, four before Dhuhr and two after it, two after Maghrib, and two after Isha.',
    source: 'Umm Ḥabībah — Sahih Muslim 728 (meaning; regular rawātib)',
    status: 'consensus',
  },
  {
    text: 'The two rakʿah before Fajr are dearer to me than the world and all that it contains.',
    source: 'ʿĀʾishah — Sahih Muslim 725',
    status: 'consensus',
  },
];
