import { PrayerGuide } from '../models';
import { KnowledgeNode, BreadcrumbItem, KnowledgeMetadata } from '../../knowledge/types';

export class PrayerAdapter {
  static toKnowledgeNode(guide: PrayerGuide): KnowledgeNode {
    const breadcrumbs: BreadcrumbItem[] = [
      { id: 'prayer', label: 'Prayer' },
      { id: `prayer-guides`, label: 'Guides' },
      { id: guide.id, label: guide.title }
    ];

    const metadata: KnowledgeMetadata = {
      authorityClass: 'scholarly_consensus',
      language: ['en'],
      collection: 'Fiqh al-Ibadat',
      badges: [guide.category]
    };

    return {
      id: guide.id,
      type: 'fiqh', // Mapping it to the generic Fiqh type since Prayer is a subset of Fiqh
      title: guide.title,
      body: guide.description,
      metadata,
      breadcrumbs
    };
  }
}
