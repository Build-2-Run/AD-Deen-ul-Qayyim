// Source: spa5k/tafsir_api (github.com/spa5k/tafsir_api), served via jsDelivr.
// Slugs verified live against the CDN before wiring — do not guess new ones without re-verifying.
export interface TafsirEdition {
  id: string;
  arabicName: string;
  englishName: string;
  slug: string;
  language: 'ar' | 'en';
}

export const TAFSIR_EDITIONS: TafsirEdition[] = [
  { id: 'ibn-kathir', arabicName: 'تفسير ابن كثير', englishName: 'Ibn Kathir', slug: 'ar-tafsir-ibn-kathir', language: 'ar' },
  { id: 'tabari', arabicName: 'تفسير الطبري', englishName: 'al-Tabari', slug: 'ar-tafsir-al-tabari', language: 'ar' },
  { id: 'qurtubi', arabicName: 'تفسير القرطبي', englishName: 'al-Qurtubi', slug: 'ar-tafseer-al-qurtubi', language: 'ar' },
  { id: 'saadi', arabicName: "تفسير السعدي", englishName: "As-Sa'di", slug: 'ar-tafseer-al-saddi', language: 'ar' },
  // Ma'arif-ul-Qur'an was authored in Urdu; this API only has the English translation, not an Arabic edition.
  { id: 'maarif', arabicName: "معارف القرآن", englishName: "Ma'arif-ul-Qur'an (English)", slug: 'en-tafsir-maarif-ul-quran', language: 'en' },
  { id: 'muyassar', arabicName: 'التفسير الميسر', englishName: 'Al-Muyassar', slug: 'ar-tafsir-muyassar', language: 'ar' },
  { id: 'jalalayn', arabicName: 'تفسير الجلالين', englishName: 'al-Jalalayn', slug: 'ar-tafsir-al-jalalayn', language: 'ar' },
];
