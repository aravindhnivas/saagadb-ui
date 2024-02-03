import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const zint = () => {
	return z
		.number()
		.int()
		.default(undefined as unknown as number);
};

export const Schemas = {
	'species-metadata': z.object({
		species: zint(),
		linelist: zint(),
		degree_of_freedom: z.union([z.string(), z.number().int()]),
		molecule_tag: z.union([z.string(), z.number().int()]).optional(),
		hyperfine: z.boolean(),
		category: z.string().min(1),
		mu_a: z.string().default(''),
		mu_b: z.string().default(''),
		mu_c: z.string().default(''),
		a_const: z.string().default(''),
		b_const: z.string().default(''),
		c_const: z.string().default(''),
		data_date: z
			.string()
			.min(1)
			.refine((str) => !isNaN(Date.parse(str)), {
				message: 'Invalid date format'
			}),
		data_contributor: z.string().min(1),
		qpart_file: z.string().optional(),
		int_file: z.string().default('').optional(),
		var_file: z.string().default('').optional(),
		fit_file: z.string().default('').optional(),
		lin_file: z.string().default('').optional(),
		notes: z.string().default('').optional()
	}),
	reference: z.object({
		doi: z.string().min(5),
		ref_url: z.string().min(5),
		notes: z.string().default('').optional(),
		bibtex: z.string().optional()
	}),
	'meta-reference': z.object({
		meta: zint(),
		ref: zint(),
		dipole_moment: z.boolean(),
		spectrum: z.boolean(),
		notes: z.string().default('').optional()
	}),
	line: z.object({
		meta: zint(),
		cat_file: z.string().optional(),
		qn_label_str: z.string().min(1),
		contains_rovibrational: z.boolean(),
		vib_qn: z.string().optional(),
		notes: z.string().default('').optional()
	})
} as const;

export const fileInputs: {
	[key: string]: { id: string; name: string; required: boolean; extension: string }[];
} = {
	'species-metadata': [
		{ id: uuidv4(), name: 'qpart_file', required: true, extension: '.qpart' },
		{ id: uuidv4(), name: 'int_file', required: false, extension: '.int' },
		{ id: uuidv4(), name: 'var_file', required: false, extension: '.var' },
		{ id: uuidv4(), name: 'fit_file', required: false, extension: '.fit' },
		{ id: uuidv4(), name: 'lin_file', required: false, extension: '.lin' }
	],
	reference: [{ id: uuidv4(), name: 'bibtex', required: true, extension: '.bib' }],
	'meta-reference': [],
	line: [{ id: uuidv4(), name: 'cat_file', required: true, extension: '.cat' }]
};

export const dropdowns: {
	[key: string]: { id: string; name: string; key: string }[];
} = {
	'species-metadata': [
		{ id: uuidv4(), name: 'species', key: 'name_formula' },
		{ id: uuidv4(), name: 'linelist', key: 'linelist_name' }
	],
	reference: [],
	'meta-reference': [],
	line: []
};

export const ids = ['species-metadata', 'reference', 'meta-reference', 'line'] as const;

export const metadata_items = [
	{ value: 'species-metadata', name: 'Species metadata' },
	{ value: 'reference', name: 'Reference' },
	{ value: 'meta-reference', name: 'Meta reference' },
	{ value: 'line', name: 'Line' }
] as const;
