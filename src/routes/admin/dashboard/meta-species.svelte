<script lang="ts">
	import MetaTemplate from './meta-template.svelte';

	export let meta_species: SpeciesMetadata[];

	const include_keys = [
		{
			key: 'molecule_tag',
			label: 'Molecule tag'
		},
		{
			key: 'linelist_name',
			label: 'Linelist name',
			formatter: (val: string) => val?.toLocaleUpperCase()
		},
		{ key: 'a_const', label: 'A' },
		{ key: 'b_const', label: 'B' },
		{ key: 'c_const', label: 'C' },
		{ key: 'mu_a', label: 'µA' },
		{ key: 'mu_b', label: 'µB' },
		{ key: 'mu_c', label: 'µC' },
		{
			key: 'hyperfine',
			label: 'Hyperfine',
			formatter: (val: string) => (val === 'true' ? '✅' : '❌')
		},
		{ key: 'degree_of_freedom', label: 'Degree of freedom' },
		{ key: 'category', label: 'Category' },
		{ key: 'notes', label: 'notes' }
		// {
		// 	key: 'approved',
		// 	label: 'Approved',
		// 	formatter: (val: string) => (val === 'true' ? '✅' : '❌')
		// }
	] as {
		key: keyof SpeciesMetadata;
		label: string;
		formatter?: <T>(val: T) => string;
		is_link?: boolean;
		href?: string;
	}[];
</script>

<MetaTemplate obj={meta_species} {include_keys} api_key="species-metadata" />
