<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	const species = data?.species;
	console.log(data);

	const metadata = [
		{ name: 'Category', value: data?.meta?.category },
		{ name: 'A', value: data?.meta?.a_const },
		{ name: 'B', value: data?.meta?.b_const },
		{ name: 'C', value: data?.meta?.c_const },
		{ name: 'mu_a', value: data?.meta?.mu_a ?? '' },
		{ name: 'mu_b', value: data?.meta?.mu_b ?? '' },
		{ name: 'mu_c', value: data?.meta?.mu_c ?? '' },
		{ name: 'Date_added', value: data?.meta?.data_date },
		{ name: 'Ref', value: data?.meta?.data_contributor },
		{ name: 'Notes', value: data?.meta?.notes }
	];
</script>

<h1 class="text-xl">{species.iupac_name}</h1>
<h2>{Number(species.molecular_mass).toFixed(2)} atomic mass</h2>
<h2><em>SMILES: </em>{species.standard_inchi}</h2>
<h2><em>SELFIES: </em>{species.selfies}</h2>
<h2>{species.notes}</h2>

<div class="overflow-x-auto">
	<table class="table border-2">
		<!-- head -->
		<thead>
			<tr>
				<th></th>
				<th>Value</th>
			</tr>
		</thead>
		<tbody>
			{#each metadata as { name, value }}
				<tr>
					<td>{name}</td>
					<td>{value}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
