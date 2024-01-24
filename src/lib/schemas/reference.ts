import { z } from 'zod';

export const referenceSchema = z.object({
	id: z.string(),
	doi: z.string().min(5),
	ref_url: z.string().min(5),
	bibtex: z.string(),
	notes: z.string().optional()
});

export interface Reference extends z.infer<typeof referenceSchema> {}
