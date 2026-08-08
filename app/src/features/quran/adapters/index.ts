import { Surah, Ayah } from '../models';
import { KnowledgeNode, BreadcrumbItem, KnowledgeMetadata } from '../../knowledge/types';

/**
 * Transforms Quran domain models into Universal KnowledgeNodes.
 * The Universal Reader and Knowledge Services consume KnowledgeNodes, not Surahs or Ayahs.
 */
export class QuranAdapter {
  
  static toSurahNode(surah: Omit<Surah, 'ayahs'>): KnowledgeNode {
    const breadcrumbs: BreadcrumbItem[] = [
      { id: 'quran', label: 'Quran' },
      { id: `quran:${surah.number}`, label: surah.name.transliteration }
    ];

    const metadata: KnowledgeMetadata = {
      authorityClass: 'primary_revelation',
      source: 'The Holy Quran',
      language: ['ar', 'en'],
      collection: 'Quran',
      badges: [surah.revelation.type, `${surah.ayahCount} Ayahs`]
    };

    return {
      id: surah.id,
      type: 'quran',
      title: surah.name.transliteration,
      subtitle: surah.name.english,
      arabicText: surah.name.arabic,
      body: `${surah.revelation.type} • ${surah.ayahCount} Ayahs`, // Brief summary for cards
      metadata,
      breadcrumbs
    };
  }

  static toAyahNode(ayah: Ayah, surah: Surah): KnowledgeNode {
    const breadcrumbs: BreadcrumbItem[] = [
      { id: 'quran', label: 'Quran' },
      { id: `quran:${surah.number}`, label: surah.name.transliteration },
      { id: ayah.id, label: `Ayah ${ayah.ayahNumber}` }
    ];

    const metadata: KnowledgeMetadata = {
      authorityClass: 'primary_revelation',
      source: 'The Holy Quran',
      language: ['ar', 'en'],
      collection: 'Quran',
      badges: [`Juz ${ayah.metadata.juz}`, `Page ${ayah.metadata.page}`]
    };

    let prefixContent;
    if (ayah.ayahNumber === 1 && surah.number !== 1 && surah.number !== 9) {
      prefixContent = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
    }

    return {
      id: ayah.id,
      type: 'quran',
      title: `${surah.name.transliteration} ${surah.number}:${ayah.ayahNumber}`,
      arabicText: ayah.text.arabic,
      primaryTranslation: ayah.translation?.en,
      prefixContent,
      nodeNumber: ayah.ayahNumber,
      metadata,
      breadcrumbs
    };
  }
}
