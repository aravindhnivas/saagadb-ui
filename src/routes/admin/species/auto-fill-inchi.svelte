<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { getForm } from 'formsnap';
	import { toast } from 'svelte-sonner';

	const { form } = getForm();
</script>

<Button
	type="button"
	class="btn btn-sm"
	on:click={() => {
		const smiles = $form.smiles;
		if (!smiles) return toast.error('Please enter a SMILES string first');
		const mol = window.RDKit.get_mol(smiles);
		if (!mol) return toast.error('Invalid SMILES string');
		const InChI = mol?.get_inchi();
		const InChIkey = window.RDKit.get_inchikey_for_inchi(mol?.get_inchi());
		$form.standard_inchi = InChI;
		$form.standard_inchi_key = InChIkey;
	}}>Auto fill InChI</Button
>
