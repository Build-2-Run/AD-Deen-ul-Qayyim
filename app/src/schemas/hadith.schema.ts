import { z } from 'zod';
import { KnowledgeNodeSchema } from './knowledge.schema';

const EvidenceLevelSchema = z.enum(['Mutawatir', 'Sahih', 'Hasan', 'Consensus', 'Majority']);

export const HadithNodeSchema = KnowledgeNodeSchema.extend({
  narrator: z.string(),
  arabicText: z.string(),
  grading: EvidenceLevelSchema,
  collection: z.string(),
  hadithNumber: z.number().int()
});
