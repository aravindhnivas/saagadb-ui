import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const optional_number = z
	.string()
	.default('')
	.refine((str) => str === '' || !isNaN(parseFloat(str)), {
		message: 'Invalid number'
	})
	.optional();

const speciesMetadataScheme = z.object({
	species: z.union([z.string(), z.number().int()]),
	linelist: z.union([z.string(), z.number().int()]),
	degree_of_freedom: z
		.union([z.string(), z.number().int()])
		.refine((str) => !isNaN(parseFloat(str)), {
			message: 'Invalid number'
		}),
	molecule_tag: z.union([z.string(), z.number().int()]).refine((str) => !isNaN(parseFloat(str)), {
		message: 'Invalid number'
	}),
	hyperfine: z.boolean(),
	category: z.string().min(1),
	mu_a: optional_number,
	mu_b: optional_number,
	mu_c: optional_number,
	a_const: optional_number,
	b_const: optional_number,
	c_const: optional_number,
	data_date: z
		.string()
		.min(1)
		.refine((str) => !isNaN(Date.parse(str)), {
			message: 'Invalid date format'
		})
		.refine((str) => /^(\d{4})-(\d{2})-(\d{2})$/.test(str), {
			message: 'Invalid date format. Expected format is YYYY-MM-DD'
		}),
	data_contributor: z.string().min(1),
	qpart_file: z.string().refine((str) => str.includes('300'), {
		message: '300 K temperature is required'
	}),
	int_file: z.string().default('').optional(),
	var_file: z.string().default('').optional(),
	fit_file: z.string().default('').optional(),
	lin_file: z.string().default('').optional(),
	notes: z.string().default('').optional()
});

const lineScheme = z.object({
	meta: z.union([z.string(), z.number().int()]).refine((str) => !isNaN(parseFloat(str)), {
		message: 'Invalid id number'
	}),
	cat_file: z.string().default(''),
	qn_label_str: z.string().min(1),
	contains_rovibrational: z.boolean(),
	vib_qn: z.string().default('').optional(),
	notes: z.string().default('').optional()
});

const referenceScheme = z.object({
	doi: z.string().min(5),
	ref_url: z.string().min(5),
	notes: z.string().default('').optional(),
	bibtex: z.string().optional()
});

const metaReferenceScheme = z
	.object({
		meta: z.union([z.string(), z.number().int()]).refine((str) => !isNaN(parseFloat(str)), {
			message: 'Invalid id number'
		}),
		ref: z.union([z.string(), z.number().int()]).refine((str) => !isNaN(parseFloat(str)), {
			message: 'Invalid id number'
		}),
		dipole_moment: z.boolean(),
		spectrum: z.boolean(),
		notes: z.string().default('').optional()
	})
	.refine((data) => data.dipole_moment || data.spectrum, {
		message: 'Either dipole_moment or spectrum must be true'
	});

const directReferenceScheme = z
	.object({
		meta: z.union([z.string(), z.number().int()]).refine((str) => !isNaN(parseFloat(str)), {
			message: 'Invalid id number'
		}),
		doi: z.string().min(5),
		ref_url: z.string().min(5),
		bibtex: z.string().optional(),
		dipole_moment: z.boolean(),
		spectrum: z.boolean(),
		notes: z.string().default('').optional()
	})
	.refine((data) => data.dipole_moment || data.spectrum, {
		message: 'Either dipole_moment or spectrum must be true'
	});

const miscFilesUploadScheme = z.object({
	meta: z.union([z.string(), z.number().int()]).refine((str) => !isNaN(parseFloat(str)), {
		message: 'Invalid id number'
	}),
	name: z.string().min(3),
	misc_file: z.string().default(''),
	notes: z.string().default('').optional()
});

export const metadata_items = [
	{ value: 'species-metadata', name: 'Species metadata', scheme: speciesMetadataScheme },
	{ value: 'line', name: 'Line', scheme: lineScheme },
	{ value: 'misc-files-upload', name: 'Misc. files', scheme: miscFilesUploadScheme },
	{ value: 'direct-reference', name: 'Direct-reference', scheme: directReferenceScheme },
	{ value: 'reference', name: 'Reference', scheme: referenceScheme },
	{ value: 'meta-reference', name: 'Meta reference', scheme: metaReferenceScheme }
] as const;

export const ids = metadata_items.map((item) => item.value);

const Schemas: Record<string, z.ZodObject<{ [key: string]: z.ZodTypeAny }>> = {};
metadata_items.forEach((item) => {
	Schemas[item.value] = item.scheme;
});
export { Schemas };

export const fileInputs: {
	[key: string]: { id: string; name: string; required: boolean; extension: string }[];
} = {
	'species-metadata': [
		{ id: uuidv4(), name: 'cat_file', required: true, extension: '.cat' },
		{ id: uuidv4(), name: 'qpart_file', required: true, extension: '.qpart' },
		{ id: uuidv4(), name: 'int_file', required: false, extension: '.int' },
		{ id: uuidv4(), name: 'var_file', required: false, extension: '.var' },
		{ id: uuidv4(), name: 'fit_file', required: false, extension: '.fit' },
		{ id: uuidv4(), name: 'lin_file', required: false, extension: '.lin' }
	],
	reference: [{ id: uuidv4(), name: 'bibtex', required: true, extension: '.bib' }],
	'direct-reference': [{ id: uuidv4(), name: 'bibtex', required: true, extension: '.bib' }],
	'meta-reference': [],
	line: [{ id: uuidv4(), name: 'cat_file', required: true, extension: '.cat' }],
	'misc-files-upload': [{ id: uuidv4(), name: 'misc_file', required: true, extension: '' }]
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
