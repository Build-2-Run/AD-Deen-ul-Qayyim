export type KnowledgeNodeType = 
  | 'quran' 
  | 'hadith' 
  | 'fiqh' 
  | 'history' 
  | 'science' 
  | 'concept' 
  | 'platform';

export type AuthorityClass = 
  | 'primary_revelation' 
  | 'primary_sunnah' 
  | 'scholarly_consensus' 
  | 'scholarly_opinion' 
  | 'historical_record' 
  | 'scientific_observation' 
  | 'educational';

export interface KnowledgeMetadata {
  authorityClass: AuthorityClass;
  source?: string;
  collection?: string;
  readingLevel?: 'beginner' | 'intermediate' | 'advanced';
  confidence?: 'high' | 'medium' | 'low';
  language: string[];
  category?: string;
  badges?: string[];
}

export interface BreadcrumbItem {
  id: string;
  label: string;
}

export interface RelatedNode {
  id: string;
  title: string;
  type: KnowledgeNodeType;
  relation: string; // e.g. "explains", "is_referenced_in", "historical_context"
  summary?: string;
}

export interface Citation {
  id: string;
  source: string;
  collection?: string;
  reference: string;
  authority: AuthorityClass;
  preview: string;
}

export interface KnowledgeNode {
  id: string;
  type: KnowledgeNodeType;
  title: string;
  subtitle?: string;
  arabicText?: string;
  primaryTranslation?: string;
  body?: string;
  prefixContent?: string;
  nodeNumber?: number | string;
  metadata: KnowledgeMetadata;
  breadcrumbs: BreadcrumbItem[];
  relatedNodes?: RelatedNode[];
  citations?: Citation[];
}
