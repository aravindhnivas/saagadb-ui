<script lang="ts">
	import MetaTemplate from './meta-template.svelte';

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
			key: 'ref_url',
			label: 'Reference URL'
		},
		{
			key: 'approved',
			label: 'Approved',
			formatter: (val: string) => (val === 'true' ? '✅' : '❌')
		}
	] as {
		key: keyof SpeciesMetadata;
		label: string;
		formatter?: <T>(val: T) => string;
	}[];
</script>

<MetaTemplate obj={meta_ref} {include_keys} />
