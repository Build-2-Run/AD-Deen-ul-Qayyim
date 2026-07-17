import { KnowledgeNode } from './knowledge';

export interface QuranNode extends KnowledgeNode {
  surahNumber: number;
  ayahNumber: number;
  arabicText: string;
  juzNumber?: number;
  revelationType?: 'Meccan' | 'Medinan';
}
