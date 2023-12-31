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
		qpart_file: z.string().optional(),
		int_file: z.string().optional(),
		var_file: z.string().optional(),
		fit_file: z.string().optional(),
		lin_file: z.string().optional(),
		notes: z.string().min(5).optional()
	}),
	reference: z.object({
		doi: z.string(),
		ref_url: z.string(),
		notes: z.string().optional(),
		bibtex: z.string().optional()
	}),
	'meta-reference': z.object({
		meta: z.number().int(),
		ref: z.number().int(),
		dipole_moment: z.boolean(),
		spectrum: z.boolean(),
		notes: z.string().optional()
	}),
	line: z.object({
		meta: z.number().int(),
		cat_file: z.string().optional(),
		qn_label_str: z.string(),
		contains_rovibrational: z.boolean(),
		vib_qn: z.string().default('').optional(),
		notes: z.string().optional()
	})
};

export const fileInputs: {
	[key: string]: { id: string; name: string; required: boolean }[];
} = {
	'species-metadata': [
		{ id: crypto.randomUUID(), name: 'qpart_file', required: true },
		{ id: crypto.randomUUID(), name: 'int_file', required: false },
		{ id: crypto.randomUUID(), name: 'var_file', required: false },
		{ id: crypto.randomUUID(), name: 'fit_file', required: false },
		{ id: crypto.randomUUID(), name: 'lin_file', required: false }
	],
	reference: [{ id: crypto.randomUUID(), name: 'bibtex', required: true }],
	'meta-reference': [],
	line: [{ id: crypto.randomUUID(), name: 'cat_file', required: true }]
};

export const dropdowns: {
	[key: string]: { id: string; name: string }[];
} = {
	'species-metadata': [
		{ id: crypto.randomUUID(), name: 'species' },
		{ id: crypto.randomUUID(), name: 'linelist' }
	],
	reference: [],
	'meta-reference': [
		{ id: crypto.randomUUID(), name: 'meta' },
		{ id: crypto.randomUUID(), name: 'ref' }
	],
	line: [{ id: crypto.randomUUID(), name: 'meta' }]
};
