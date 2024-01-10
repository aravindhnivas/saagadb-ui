<script lang="ts">
	import { enhance } from '$app/forms';
	import { edit_mode } from '$lib/utils/stores';
	import type { PageData } from './$types';
	export let data: PageData;
	const species = data?.species;
	// console.log({ data });

	const metadata = [
		{ name: 'Category', value: data?.meta?.category },
		{ name: 'A <em>/ MHz</em>', value: data?.meta?.a_const },
		{ name: 'B <em>/ MHz</em>', value: data?.meta?.b_const },
		{ name: 'C <em>/ MHz</em>', value: data?.meta?.c_const },
		{ name: 'mu<sub>a</sub> <em>/ D</em>', value: data?.meta?.mu_a ?? '' },
		{ name: 'mu<sub>b</sub> <em>/ D</em>', value: data?.meta?.mu_b ?? '' },
		{ name: 'mu<sub>c</sub> <em>/ D</em>', value: data?.meta?.mu_c ?? '' },
		{ name: 'Date added', value: data?.meta?.data_date },
		{ name: 'Contributor', value: data?.meta?.data_contributor },
		{ name: 'Notes', value: data?.meta?.notes }
	];
</script>

{#if $edit_mode}
	<form method="POST" class="ml-auto" use:enhance>
		<button class="badge badge-warning badge-md">EDIT</button>
		<button formaction="?/delete_species" class="badge badge-error badge-md">DELETE</button>
	</form>
{/if}

<div class="content">
	<h1 class="text-xl font-300">
		{@html species.name_html}
		{$edit_mode ? `(id = ${species.id})` : ''}
	</h1>
	<h1 class="text-xl font-500">{species.iupac_name}</h1>
	<h2>{Number(species.molecular_mass).toFixed(2)} atomic mass</h2>
	<h2><em>SMILES: </em>{species.standard_inchi}</h2>
	<h2><em>SELFIES: </em>{species.selfies}</h2>
	<h2>{species.notes}</h2>
</div>

<div class="overflow-x-auto">
	<table class="table border-2">
		<!-- head -->
		<thead>
			<tr>
				<th class="border-r-5"></th>
				<th>Value</th>
			</tr>
		</thead>
		<tbody>
			{#each metadata as { name, value }}
				<tr class="border">
					<td class="border-r-5 pr-5">{@html name}</td>
					<td class="px-5">{value}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
