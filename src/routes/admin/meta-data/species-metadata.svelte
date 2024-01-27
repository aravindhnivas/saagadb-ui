<script lang="ts">
	import FormCombobox from '$lib/components/combobox/form-combobox.svelte';
	import { getContext } from 'svelte';

	export let config;
	const species = getContext('species') as Species[];
	const linelist = getContext('linelist') as Linelist[];
</script>

<div class="grid-auto-fill lg:max-w-md sm:max-w-full">
	<FormCombobox
		val_type="number"
		{config}
		name={'species'}
		items={species.map((f) => ({
			value: `${f.id}`,
			label: f.name_formula
		}))}
	/>
	<FormCombobox
		val_type="number"
		{config}
		name={'linelist'}
		items={linelist.map((f) => ({
			value: `${f.id}`,
			label: f.linelist_name
		}))}
	/>
</div>
