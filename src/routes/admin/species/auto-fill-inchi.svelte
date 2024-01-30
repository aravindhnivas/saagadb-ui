<script lang="ts">
	import { base } from '$app/paths';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getForm } from 'formsnap';
	import { toast } from 'svelte-sonner';

	const { form } = getForm();

	const fetch_smiles = async () => {
		if (!$form.name) return toast.error('Please enter a name first');
		console.log(`Fetching SMILES for ${$form.name}`);
		const res = await fetch(`${base}/api/pubchem/${$form.name}/CanonicalSMILES`);
		console.log(`Received response ${res.status} ${res.statusText}`);
		if (!res.ok) return toast.error(res.statusText);

		const pubchem_data = (await res.json()) as { CID: string; CanonicalSMILES: string }[];

		console.log(`Received ${pubchem_data.length} results`);
		console.log(pubchem_data, pubchem_data[0].CanonicalSMILES);

		if (pubchem_data.length > 0) {
			$form.smiles = pubchem_data[0].CanonicalSMILES;
			if ($form.smiles) await auto_fill_properties();
		} else {
			return toast.error('No SMILES string found for this name');
		}
	};

	const auto_fill_properties = async () => {
		if (!$form.smiles) return toast.error('Please enter a SMILES string first');
		const mol = window.RDKit.get_mol($form.smiles);
		if (!mol) return toast.error('Invalid SMILES string');
		const InChI = mol?.get_inchi();
		const InChIkey = window.RDKit.get_inchikey_for_inchi(mol?.get_inchi());
		$form.standard_inchi = InChI;
		$form.standard_inchi_key = InChIkey;
	};
</script>

<Button type="button" class="btn btn-sm" on:click={async () => await fetch_smiles()}
	>Fetch SMILES</Button
>

<Button type="button" class="btn btn-sm" on:click={async () => await auto_fill_properties()}
	>Auto fill InChI</Button
>
