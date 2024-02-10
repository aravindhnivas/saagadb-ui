<script lang="ts">
	import { setContext } from 'svelte';
	import MetaTemplate from './(meta-template)/meta-template.svelte';

	export let meta_ref: MetaReference[];
	const include_keys = [
		{
			key: 'linelist_name',
			label: 'Linelist name',
			formatter: (val: string) => val?.toLocaleUpperCase()
		},
		{
			key: 'dipole_moment',
			label: 'Dipole moment',
			formatter: (val: string) => (val === 'true' ? '✅' : '❌')
		},
		{
			key: 'spectrum',
			label: 'Spectrum',
			formatter: (val: string) => (val === 'true' ? '✅' : '❌')
		},
		{
			key: 'ref_url',
			label: 'Reference',
			is_link: true
		}
	] as {
		key: keyof SpeciesMetadata;
		label: string;
		formatter?: <T>(val: T) => string;
		is_link?: boolean;
		href?: string;
	}[];

	setContext('include_keys', include_keys);
	setContext('api_key', 'meta-reference');
</script>

<MetaTemplate obj={meta_ref} />
