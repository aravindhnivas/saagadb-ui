<script lang="ts">
	import { edit_mode } from '$lib/utils/stores';
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import { onMount } from 'svelte';

	export let data: PageData;
	// const species = data?.species;
	// console.log(data);

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

{#if data.species}
	<div class="content">
		<h1 class="text-xl font-300">
			{@html data.species.name_html}
			{$edit_mode ? `(id = ${data.species.id})` : ''}
		</h1>
		<h1 class="text-xl font-500">{data.species.iupac_name}</h1>
		<h2>{Number(data.species.molecular_mass).toFixed(2)} atomic mass</h2>
		<h2><em class="font-bold">SMILES: </em>{data.species.smiles}</h2>
		<h2><em class="font-bold">Standard InChI: </em>{data.species.standard_inchi}</h2>
		<h2><em class="font-bold">InChIkey: </em>{data.species.standard_inchi_key}</h2>
		<h2><em class="font-bold">SELFIES: </em>{data.species.selfies}</h2>
		<h2>{data.species.notes}</h2>
	</div>
{:else}
	<p>No species found</p>
{/if}

{#if data.species && data.meta}
	<Table.Root class="lg:w-2xl sm:w-full">
		<Table.Caption>Species-metadata</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="p-0">Database</Table.Head>
				{#each data.meta as metadata}
					{@const key = data.linelist?.find((f) => f.id === metadata.linelist)?.linelist_name}
					<Table.Head class="text-center font-bold">
						<a href="/species/{data.species.id}/{metadata.id}">
							<span class="underline hover:text-blue">{key.toLocaleUpperCase()}</span>
						</a>
					</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each metadata_keys as key}
				<Table.Row>
					<Table.Cell class="p-0">{@html key.name}</Table.Cell>
					{#each data.meta as metadata (metadata.id)}
						<Table.Cell class="text-center p-0">{metadata[key.value] ?? '-'}</Table.Cell>
					{/each}
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{:else}
	<p>No metadata found</p>
{/if}
