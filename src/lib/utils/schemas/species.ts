import { z } from 'zod';

export const schemaSchema = z.object({
	name: z.string().min(1),
	iupac_name: z.string().min(1),
	name_formula: z.string().min(1),
	name_html: z.string().min(1),
	smiles: z.string().min(1),
	standard_inchi: z.string().min(1),
	standard_inchi_key: z.string().min(1),
	notes: z.string().optional()
});
