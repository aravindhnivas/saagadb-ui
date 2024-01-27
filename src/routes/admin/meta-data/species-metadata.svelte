<script lang="ts">
	import FormCombobox from '$lib/components/combobox/form-combobox.svelte';

	export let config;
	export let species: Species[];
	export let linelist: Linelist[];
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
