import { z } from 'zod';
interface Schema {
	[key: string]: unknown;
}
export const schemas: Schema = {
	'species-metadata': z.object({
		species: z.number().int(),
		molecule_tag: z.number().int().optional(),
		hyperfine: z.boolean(),
		degree_of_freedom: z.number().int(),
		category: z.string().min(1),
		mu_a: z.string().nullable(),
		mu_b: z.string().nullable(),
		mu_c: z.string().nullable(),
		a_const: z.string().nullable(),
		b_const: z.string().nullable(),
		c_const: z.string().nullable(),
		linelist: z.number().int(),
		data_date: z.string().min(1),
		data_contributor: z.string().refine((str) => !isNaN(Date.parse(str)), {
			message: 'Invalid date format'
		}),
		qpart_file: z.string(),
		int_file: z.string().optional(),
		var_file: z.string().optional(),
		fit_file: z.string().optional(),
		lin_file: z.string().optional(),
		notes: z.string().min(5).optional()
	}),
	reference: z.object({
		doi: z.string(),
		ref_url: z.string(),
		bibtex: z.string(),
		notes: z.string().optional()
	}),
	'meta-reference': z.object({
		ref: z.string(),
		dipole_moment: z.boolean(),
		spectrum: z.boolean(),
		notes: z.string().optional()
	}),
	line: z.object({
		meta: z.number().int(),
		cat_file: z.string(),
		qn_label_str: z.string(),
		contains_rovibrational: z.boolean(),
		vib_qn: z.string(),
		notes: z.string().optional()
	})
};
