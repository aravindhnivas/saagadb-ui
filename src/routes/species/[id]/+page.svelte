<script lang="ts">
	import { edit_mode } from '$lib/utils/stores';
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import { onMount } from 'svelte';

	export let data: PageData;
	// const species = data?.species;
	console.log(data);

	let metadata_keys = [
		{ name: 'Category', value: 'category' },
		{ name: 'Molecule tag', value: 'molecule_tag' },
		{ name: 'A <em>/ MHz</em>', value: 'a_const' },
		{ name: 'B <em>/ MHz</em>', value: 'b_const' },
		{ name: 'C <em>/ MHz</em>', value: 'c_const' },
		{ name: 'mu<sub>a</sub> <em>/ D</em>', value: 'mu_a' },
		{ name: 'mu<sub>b</sub> <em>/ D</em>', value: 'mu_b' },
		{ name: 'mu<sub>c</sub> <em>/ D</em>', value: 'mu_c' },
		{ name: 'Hyperfine', value: 'hyperfine' },
		{ name: 'Degree of freedom', value: 'degree_of_freedom' },
		{ name: 'Date added', value: 'data_date' },
		{ name: 'Contributors', value: 'data_contributor' },
		{ name: 'Notes', value: 'notes' }
	];

	onMount(() => {
		if ($edit_mode) {
			metadata_keys = [{ name: 'meta_id', value: 'id' }, ...metadata_keys];
		}
	});
</script>

<div class="content">
	<h1 class="text-xl font-300">
		{@html data.species?.name_html}
		{$edit_mode ? `(id = ${data.species?.id})` : ''}
	</h1>
	<h1 class="text-xl font-500">{data.species?.iupac_name}</h1>
	<h2>{Number(data.species?.molecular_mass).toFixed(2)} atomic mass</h2>
	<h2><em>SMILES: </em>{data.species?.standard_inchi}</h2>
	<h2><em>SELFIES: </em>{data.species?.selfies}</h2>
	<h2>{data.species?.notes}</h2>
</div>

<Table.Root>
	<Table.Caption>Species-metadata</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]"></Table.Head>
			{#each data.meta as metadata}
				<Table.Head class="text-center font-bold"
					>{data.linelist
						?.find((f) => f.id === metadata.linelist)
						?.linelist_name.toLocaleUpperCase()}</Table.Head
				>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each metadata_keys as key}
			<Table.Row>
				<Table.Cell>{@html key.name}</Table.Cell>
				{#each data.meta as metadata (metadata.id)}
					{@const value = metadata[key.value]}
					<Table.Cell class="text-center">{value ?? '-'}</Table.Cell>
				{/each}
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
<!-- meta-references -->
<!-- {JSON.stringify(data.meta_references, null, 2)} -->
