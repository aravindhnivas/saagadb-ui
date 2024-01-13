import { z, type AnyZodObject } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const zint = () => {
	// make the default value undefined and not 0
	return z
		.number()
		.int()
		.default(undefined as unknown as number);
};

export const schemas: {
	[key: string]: AnyZodObject;
} = {
	'species-metadata': z.object({
		species: z.number().int(),
		linelist: z.number().int(),
		degree_of_freedom: z.number().int(),
		molecule_tag: z.number().int().optional(),
		hyperfine: z.boolean(),
		category: z.string().min(1),
		mu_a: z.string().nullable(),
		mu_b: z.string().nullable(),
		mu_c: z.string().nullable(),
		a_const: z.string().nullable(),
		b_const: z.string().nullable(),
		c_const: z.string().nullable(),
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
		{ id: uuidv4(), name: 'qpart_file', required: true },
		{ id: uuidv4(), name: 'int_file', required: false },
		{ id: uuidv4(), name: 'var_file', required: false },
		{ id: uuidv4(), name: 'fit_file', required: false },
		{ id: uuidv4(), name: 'lin_file', required: false }
	],
	reference: [{ id: uuidv4(), name: 'bibtex', required: true }],
	'meta-reference': [],
	line: [{ id: uuidv4(), name: 'cat_file', required: true }]
};

export const dropdowns: {
	[key: string]: { id: string; name: string; key: string }[];
} = {
	'species-metadata': [
		{ id: uuidv4(), name: 'species', key: 'name_formula' },
		{ id: uuidv4(), name: 'linelist', key: 'linelist_name' }
	],
	reference: [],
	'meta-reference': [
		{ id: uuidv4(), name: 'meta', key: '' },
		{ id: uuidv4(), name: 'ref', key: '' }
	],
	line: [{ id: uuidv4(), name: 'meta', key: '' }]
};

export const ids = ['species-metadata', 'reference', 'meta-reference', 'line'] as const;
