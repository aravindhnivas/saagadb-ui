<script lang="ts">
	import { edit_mode } from '$lib/utils/stores';

	export let species: Species;

	const mol = window.RDKit.get_mol(species.smiles);
	const mol_descriptor: MolecularDescriptor = mol ? JSON.parse(mol.get_descriptors()) : null;
	// console.log(mol?.get_new_coords());
</script>

<div class="grid grid-cols-2 gap-4 justify-items-start my-2">
	<div class="">
		<h1 class="text-xl font-300">
			{@html species.name_html}
			{$edit_mode ? `(id = ${species.id})` : ''}
		</h1>
		<h1 class="text-xl font-500">{species.iupac_name}</h1>
		<h2>
			<em class="font-bold">Molecular weight: </em>{mol_descriptor
				? mol_descriptor.amw
				: species.molecular_mass}
		</h2>

		{#if mol}
			<h2><em class="font-bold">Canonical SMILES: </em>{mol.get_smiles()}</h2>
			<h2><em class="font-bold">SMARTS: </em>{mol.get_smarts()}</h2>
			<h2><em class="font-bold">InChI: </em>{mol.get_inchi()}</h2>
			<h2>
				<em class="font-bold">InChIkey: </em>{window.RDKit.get_inchikey_for_inchi(mol.get_inchi())}
			</h2>
		{:else}
			<h2><em class="font-bold">SMILES: </em>{species.smiles}</h2>
			<h2><em class="font-bold">Standard InChI: </em>{species.standard_inchi}</h2>
			<h2><em class="font-bold">InChIkey: </em>{species.standard_inchi_key}</h2>
		{/if}

		<h2><em class="font-bold">SELFIES: </em>{species.selfies}</h2>
		<h2>{species.notes}</h2>
	</div>
	<div class="grid justify-items-center">
		{#if mol}
			<div>{@html mol?.get_svg()}</div>
		{:else}
			<p>No structure found</p>
		{/if}
		<p>Molecular structure</p>
	</div>
</div>
