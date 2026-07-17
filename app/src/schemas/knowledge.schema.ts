import { z } from 'zod';

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
