import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const str_num = z
	.string()
	.default('')
	.refine((str) => !isNaN(Number(str)), {
		message: 'Invalid number'
	});

export const Schemas = {
	'species-metadata': z.object({
		species: z.union([z.string(), z.number().int()]).default(0),
		linelist: z.union([z.string(), z.number().int()]).default(0),
		degree_of_freedom: z.union([z.string(), z.number().int()]).default(0),
		molecule_tag: z
			.string()
			.min(1)
			.refine((str) => !isNaN(Number(str)), {
				message: 'Invalid number'
			}),
		hyperfine: z.boolean(),
		category: z.string().min(1),
		mu_a: z
			.string()
			.default('')
			.refine((str) => !isNaN(Number(str)), {
				message: 'Invalid number'
			}),
		mu_b: z
			.string()
			.default('')
			.refine((str) => !isNaN(Number(str)), {
				message: 'Invalid number'
			}),
		mu_c: z
			.string()
			.default('')
			.refine((str) => !isNaN(Number(str)), {
				message: 'Invalid number'
			}),
		a_const: z
			.string()
			.default('')
			.refine((str) => !isNaN(Number(str)), {
				message: 'Invalid number'
			}),
		b_const: z
			.string()
			.default('')
			.refine((str) => !isNaN(Number(str)), {
				message: 'Invalid number'
			}),
		c_const: z
			.string()
			.default('')
			.refine((str) => !isNaN(Number(str)), {
				message: 'Invalid number'
			}),
		data_date: z
			.string()
			.min(1)
			.refine((str) => !isNaN(Date.parse(str)), {
				message: 'Invalid date format'
			}),
		data_contributor: z.string().min(1),
		notes: z.string().default('').optional(),
		qpart_file: z.string().default(''),
		int_file: z
			.custom<File>((f) => f instanceof File, 'Please upload a file.')
			.refine((f) => f.name.endsWith('.int'), 'Please upload a .int file.')
			.nullable()
			.optional(),
		var_file: z
			.custom<File>((f) => f instanceof File, 'Please upload a file.')
			.refine((f) => f.name.endsWith('.var'), 'Please upload a .var file.')
			.nullable()
			.optional(),
		fit_file: z
			.custom<File>((f) => f instanceof File, 'Please upload a file.')
			.refine((f) => f.name.endsWith('.fit'), 'Please upload a .fit file.')
			.nullable()
			.optional(),
		lin_file: z
			.custom<File>((f) => f instanceof File, 'Please upload a file.')
			.refine((f) => f.name.endsWith('.lin'), 'Please upload a .lin file.')
			.nullable()
			.optional()
	}),
	reference: z.object({
		doi: z.string().min(5),
		ref_url: z.string().min(5),
		notes: z.string().default('').optional(),
		bibtex: z.string().optional()
	}),
	'meta-reference': z.object({
		meta: z.union([z.string(), z.number().int()]).default(0),
		ref: z.union([z.string(), z.number().int()]).default(0),
		dipole_moment: z.boolean(),
		spectrum: z.boolean(),
		notes: z.string().default('').optional()
	}),
	line: z.object({
		meta: z.union([z.string(), z.number().int()]).default(0),
		cat_file: z.string().default('').optional(),
		qn_label_str: z.string().min(1),
		contains_rovibrational: z.boolean(),
		vib_qn: z.string().default('').optional(),
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
