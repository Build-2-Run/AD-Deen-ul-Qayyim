const fs = require('fs');
const path = require('path');

const files = {
  'src/types/common.ts': `export type NodeStatus = 'Draft' | 'Internal Review' | 'Verified' | 'Published' | 'Needs Revision' | 'Archived';
export type EvidenceLevel = 'Mutawatir' | 'Sahih' | 'Hasan' | 'Consensus' | 'Majority';

export interface Reference {
  id: string;
  title: string;
  authorId?: string;
  type: string;
  volume?: string;
  page?: string;
  url?: string;
}

export interface Source {
  id: string;
  name: string;
  type: 'Primary' | 'Classical' | 'Modern';
}

export interface Media {
  id: string;
  type: 'Image' | 'Audio' | 'Video' | 'Interactive';
  url: string;
  altText: string;
  license: string;
}

export interface Translation {
  languageCode: string;
  text: string;
  translatorId?: string;
}

export interface Tag {
  id: string;
  label: string;
}

export interface Category {
  id: string;
  label: string;
  parentId?: string;
}

export interface Location {
  id: string;
  name: string;
  coordinates?: { lat: number; lng: number };
}

export interface TimelineEvent {
  id: string;
  name: string;
  date: string;
}
`,
  'src/types/knowledge.ts': `import { NodeStatus, Tag, Reference, Media, Translation } from './common';

export interface KnowledgeNode {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: NodeStatus;
  description?: string;
  learningStage?: string;
  tags?: Tag[];
  references?: Reference[];
  media?: Media[];
  translations?: Translation[];
  relatedNodes?: string[];
}

export interface KnowledgeConnection {
  sourceNodeId: string;
  targetNodeId: string;
  connectionType: 'Supports' | 'Explains' | 'Causes' | 'Mentions' | 'Located In' | 'Expands' | 'Timeline';
  context?: string;
}

export interface KnowledgeCollection {
  id: string;
  title: string;
  orderedNodeIds: string[];
  description?: string;
}
`,
  'src/types/quran.ts': `import { KnowledgeNode } from './knowledge';

export interface QuranNode extends KnowledgeNode {
  surahNumber: number;
  ayahNumber: number;
  arabicText: string;
  juzNumber?: number;
  revelationType?: 'Meccan' | 'Medinan';
}
`,
  'src/types/hadith.ts': `import { KnowledgeNode } from './knowledge';
import { EvidenceLevel } from './common';

export interface HadithNode extends KnowledgeNode {
  narrator: string;
  arabicText: string;
  grading: EvidenceLevel;
  collection: string;
  hadithNumber: number;
}
`,
  'src/types/history.ts': `import { KnowledgeNode } from './knowledge';
import { Location, TimelineEvent } from './common';

export interface HistoryNode extends KnowledgeNode {
  location?: Location;
  eventTimeline?: TimelineEvent;
  keyFigures?: string[];
}
`,
  'src/schemas/knowledge.schema.ts': `import { z } from 'zod';

const NodeStatusSchema = z.enum(['Draft', 'Internal Review', 'Verified', 'Published', 'Needs Revision', 'Archived']);

export const TagSchema = z.object({
  id: z.string(),
  label: z.string()
});

export const ReferenceSchema = z.object({
  id: z.string(),
  title: z.string(),
  authorId: z.string().optional(),
  type: z.string(),
  volume: z.string().optional(),
  page: z.string().optional(),
  url: z.string().url().optional()
});

export const TranslationSchema = z.object({
  languageCode: z.string(),
  text: z.string(),
  translatorId: z.string().optional()
});

export const KnowledgeNodeSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  status: NodeStatusSchema,
  description: z.string().optional(),
  learningStage: z.string().optional(),
  tags: z.array(TagSchema).optional(),
  references: z.array(ReferenceSchema).optional(),
  translations: z.array(TranslationSchema).optional(),
  relatedNodes: z.array(z.string()).optional()
});
`,
  'src/schemas/quran.schema.ts': `import { z } from 'zod';
import { KnowledgeNodeSchema } from './knowledge.schema';

export const QuranNodeSchema = KnowledgeNodeSchema.extend({
  surahNumber: z.number().int().min(1).max(114),
  ayahNumber: z.number().int().min(1),
  arabicText: z.string(),
  juzNumber: z.number().int().optional(),
  revelationType: z.enum(['Meccan', 'Medinan']).optional()
});
`,
  'src/schemas/hadith.schema.ts': `import { z } from 'zod';
import { KnowledgeNodeSchema } from './knowledge.schema';

const EvidenceLevelSchema = z.enum(['Mutawatir', 'Sahih', 'Hasan', 'Consensus', 'Majority']);

export const HadithNodeSchema = KnowledgeNodeSchema.extend({
  narrator: z.string(),
  arabicText: z.string(),
  grading: EvidenceLevelSchema,
  collection: z.string(),
  hadithNumber: z.number().int()
});
`,
  'src/data/quran/sample-surah.json': `{
  "id": "quran-1-1",
  "slug": "al-fatihah-1",
  "title": "Al-Fatihah, Ayah 1",
  "category": "Quran",
  "status": "Verified",
  "description": "The opening verse of the Quran.",
  "surahNumber": 1,
  "ayahNumber": 1,
  "arabicText": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
  "revelationType": "Meccan",
  "translations": [
    {
      "languageCode": "en",
      "text": "In the name of Allah, the Entirely Merciful, the Especially Merciful."
    }
  ]
}
`,
  'src/data/hadith/sample-hadith.json': `{
  "id": "hadith-bukhari-1",
  "slug": "actions-are-by-intentions",
  "title": "Actions are by Intentions",
  "category": "Hadith",
  "status": "Verified",
  "narrator": "Umar bin Al-Khattab",
  "arabicText": "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
  "grading": "Sahih",
  "collection": "Sahih al-Bukhari",
  "hadithNumber": 1,
  "translations": [
    {
      "languageCode": "en",
      "text": "The reward of deeds depends upon the intentions."
    }
  ]
}
`,
  'src/data/history/sample-event.json': `{
  "id": "history-badr",
  "slug": "battle-of-badr",
  "title": "The Battle of Badr",
  "category": "History",
  "status": "Verified",
  "description": "The first major military engagement between the Muslims and the Quraysh.",
  "keyFigures": ["Prophet Muhammad (ﷺ)", "Abu Jahl"],
  "location": {
    "id": "loc-badr",
    "name": "Badr, Hejaz",
    "coordinates": { "lat": 23.7333, "lng": 38.7833 }
  },
  "eventTimeline": {
    "id": "time-badr",
    "name": "Battle of Badr",
    "date": "17 Ramadan 2 AH"
  }
}
`,
  'src/services/validator.ts': `import { z } from 'zod';

export class ValidatorService {
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      console.error('Validation Error:', result.error);
      throw new Error('Data validation failed.');
    }
    return result.data;
  }
}
`,
  'src/services/data-loader.ts': `import { ValidatorService } from './validator';
import { QuranNodeSchema } from '../schemas/quran.schema';
import { HadithNodeSchema } from '../schemas/hadith.schema';
import type { QuranNode } from '../types/quran';
import type { HadithNode } from '../types/hadith';

export class DataLoader {
  static async loadQuranNode(url: string): Promise<QuranNode> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(\`Failed to fetch JSON: \${response.statusText}\`);
    const data = await response.json();
    return ValidatorService.validate(QuranNodeSchema, data);
  }

  static async loadHadithNode(url: string): Promise<HadithNode> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(\`Failed to fetch JSON: \${response.statusText}\`);
    const data = await response.json();
    return ValidatorService.validate(HadithNodeSchema, data);
  }
  
  // Method meant for Node.js backend/build-time scripts
  static loadJsonSync<T>(schema: any, jsonString: string): T {
    const data = JSON.parse(jsonString);
    return ValidatorService.validate(schema, data);
  }
}
`,
  'src/lib/search-index.ts': `import { KnowledgeNode } from '../types/knowledge';

export class SearchIndex {
  private indexStore: Map<string, KnowledgeNode> = new Map();

  index(node: KnowledgeNode): void {
    if (!node.id) throw new Error("Node must have an ID to be indexed.");
    this.indexStore.set(node.id, node);
  }

  search(query: string): KnowledgeNode[] {
    const results: KnowledgeNode[] = [];
    const lowerQuery = query.toLowerCase();

    this.indexStore.forEach((node) => {
      // Basic text matching for the foundation
      const matchTitle = node.title.toLowerCase().includes(lowerQuery);
      const matchDesc = node.description?.toLowerCase().includes(lowerQuery);
      
      if (matchTitle || matchDesc) {
        results.push(node);
      }
    });

    return results;
  }

  clear(): void {
    this.indexStore.clear();
  }
}
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}
console.log('Data infrastructure scaffolding complete.');
