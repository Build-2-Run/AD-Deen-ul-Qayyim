import { z } from 'zod';
import { KnowledgeNodeSchema } from './knowledge.schema';

export const QuranNodeSchema = KnowledgeNodeSchema.extend({
  surahNumber: z.number().int().min(1).max(114),
  ayahNumber: z.number().int().min(1),
  arabicText: z.string(),
  juzNumber: z.number().int().optional(),
  revelationType: z.enum(['Meccan', 'Medinan']).optional()
});
