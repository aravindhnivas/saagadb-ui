<script lang="ts">
	import { Download } from 'lucide-svelte';
	import * as Table from '$lib/components/ui/table';
	import { Compound } from 'pubchem';
	import { onMount } from 'svelte';

	export let species: Species;

	const mol = window?.RDKit.get_mol(species.smiles);
	const mol_descriptor: MolecularDescriptor = mol ? JSON.parse(mol.get_descriptors()) : null;

	const species_metadata_table = {
		'Chemical formula': species.name_html,
		'Molar mass': (mol_descriptor ? mol_descriptor.amw : species.molecular_mass) + ' g/mol',
		'Canonical SMILES': mol?.get_smiles(),
		SMARTS: mol?.get_smarts(),
		InChI: mol?.get_inchi(),
		InChIkey: window.RDKit.get_inchikey_for_inchi(mol?.get_inchi()),
		SELFIES: species.selfies,
		Notes: species.notes
	};

	onMount(async () => {
		if (!(species && species.smiles)) return;
		const compound = await Compound.fromSmiles(species.smiles);
		const compoundData = await compound.getData();
		console.log(compound, compoundData);
	});
</script>

{#if species}
	<div class="max-w-4xl text-2xl font-400 flex justify-center mb-[2rem]">
		{species.iupac_name?.toLocaleUpperCase()}
	</div>

	<div class="grid grid-cols-2 gap-4 my-2 max-w-4xl">
		{#if mol}
			{@const svg = mol.get_svg()}
			{@const blob = new Blob([svg], { type: 'image/svg+xml' })}
			{@const url = URL.createObjectURL(blob)}
			<div class="grid justify-items-center">
				<div>{@html svg}</div>
				<div class="flex gap-4">
					<span>Molecular structure </span>
					<a href={url} download="{species.iupac_name}.svg"><Download /></a>
				</div>
			</div>
		{:else}
			<p>No structure found</p>
		{/if}
		<Table.Root>
			<Table.Body>
				{#each Object.keys(species_metadata_table) as key}
					<Table.Row>
						<Table.Cell class="font-medium p-0.5">{key}</Table.Cell>
						<Table.Cell class="p-0.5">{@html species_metadata_table[key]}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<!-- <div class="grid content-center">
			<h2><em class="font-bold">Chemical formula: </em>{@html species.name_html}</h2>
			{$edit_mode ? `(id = ${species.id})` : ''}
			<h2>
				<em class="font-bold">Molar mass: </em>{mol_descriptor
					? mol_descriptor.amw
					: species.molecular_mass} g/mol
			</h2>

			{#if mol}
				<h2><em class="font-bold">Canonical SMILES: </em>{mol.get_smiles()}</h2>
				<h2><em class="font-bold">SMARTS: </em>{mol.get_smarts()}</h2>
				<h2><em class="font-bold">InChI: </em>{mol.get_inchi()}</h2>
				<h2>
					<em class="font-bold">InChIkey: </em>{window.RDKit.get_inchikey_for_inchi(
						mol.get_inchi()
					)}
				</h2>
			{:else}
				<h2><em class="font-bold">SMILES: </em>{species.smiles}</h2>
				<h2><em class="font-bold">Standard InChI: </em>{species.standard_inchi}</h2>
				<h2><em class="font-bold">InChIkey: </em>{species.standard_inchi_key}</h2>
			{/if}

			<h2><em class="font-bold">SELFIES: </em>{species.selfies}</h2>
			{#if species.notes}
				<h2>{species.notes}</h2>
			{/if}
		</div> -->
	</div>
{:else}
	<p>No species found</p>
{/if}
