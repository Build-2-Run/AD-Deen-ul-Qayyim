import { ZakatGuide } from '../models';
import { KnowledgeNode, BreadcrumbItem, KnowledgeMetadata } from '../../knowledge/types';

export class ZakatAdapter {
  static toKnowledgeNode(guide: ZakatGuide): KnowledgeNode {
    const breadcrumbs: BreadcrumbItem[] = [
      { id: 'zakat', label: 'Zakat' },
      { id: `zakat-guides`, label: 'Guides' },
      { id: guide.id, label: guide.title }
    ];

    const metadata: KnowledgeMetadata = {
      authorityClass: 'scholarly_consensus',
      language: ['en', 'ar'],
      collection: 'Fiqh of Zakat',
      badges: [guide.category]
    };

    return {
      id: guide.id,
      type: 'fiqh', // Zakat rules fall under Fiqh
      title: guide.title,
      body: guide.description,
      arabicText: guide.arabicEvidence,
      primaryTranslation: guide.translation,
      metadata,
      breadcrumbs
    };
  }
}
