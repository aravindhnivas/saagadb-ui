<script lang="ts">
	import { Download } from 'lucide-svelte/icons';
	import * as Table from '$lib/components/ui/table';
	import { onMount } from 'svelte';

	export let species: Species;

	let mol: ReturnType<typeof window.RDKit.get_mol>;
	let mol_descriptor: MolecularDescriptor;
	let species_metadata_table = {};

	const load_all_data = () => {
		mol = window.RDKit.get_mol(species.smiles);
		mol_descriptor = mol ? JSON.parse(mol.get_descriptors()) : null;

		species_metadata_table = {
			'IUPAC name': species.iupac_name,
			'Chemical formula': species.name_html,
			'Molar mass': (mol_descriptor ? mol_descriptor.amw : species.molecular_mass) + ' g/mol',
			'Canonical SMILES': mol?.get_smiles(),
			SMARTS: mol?.get_smarts(),
			InChI: mol?.get_inchi(),
			InChIkey: window.RDKit.get_inchikey_for_inchi(mol?.get_inchi()),
			SELFIES: species.selfies,
			Notes: species.notes
		};
	};
	onMount(async () => {
		if (window.RDKit) load_all_data();
		if (!(species && species.smiles)) return;
	});
	let name = ['ABC', 'DEF', 'GHI'];
</script>

{#if species}
	<div class="flex flex-col items-center max-w-4xl">
		<span class="text-2xl">{species.name[0]}</span>
		{#if species.name.length > 1}
			<span class="text-md font-300">({species.name.slice(1).join(', ')})</span>
		{/if}
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
	</div>
{:else}
	<p>No species found</p>
{/if}
