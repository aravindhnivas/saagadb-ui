<script lang="ts">
	import { base } from '$app/paths';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getForm } from 'formsnap';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	const { form } = getForm();

	const fetch_smiles = async () => {
		if (!$form.name) return toast.error('Please enter a name first');
		// console.log(`Fetching SMILES for ${$form.name}`);
		const res = await fetch(`${base}/api/pubchem/${$form.name}/CanonicalSMILES`);
		// console.log(`Received response ${res.status} ${res.statusText}`);
		if (!res.ok) return toast.error(res.statusText + ': could not fetch SMILES');

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

	let mol: ReturnType<typeof window.RDKit.get_mol>;

	const auto_fill_properties = async () => {
		if (!$form.smiles) return toast.error('Please enter a SMILES string first');

		mol = window.RDKit.get_mol($form.smiles);
		if (!mol) return toast.error('Invalid SMILES string');
		const InChI = mol?.get_inchi();
		const InChIkey = window.RDKit.get_inchikey_for_inchi(mol?.get_inchi());
		$form.standard_inchi = InChI;
		$form.standard_inchi_key = InChIkey;
	};
</script>

<div class="grid grid-cols-5 gap-4 items-start">
	<Button
		on:keyup={async (e) => {
			e.preventDefault();
			if (e.key === 'Enter') {
				await auto_fill_properties();
			}
		}}
		on:click={async () => await fetch_smiles()}>Fetch SMILES (PubChem)</Button
	>
	<Form.Input required class="col-span-2" placeholder="Enter smiles string" />
	<Button on:click={async () => await auto_fill_properties()}>Draw & fill InChI</Button>

	{#if mol}
		<div>{@html mol?.get_svg(100, 50)}</div>
	{/if}
</div>
<span class="text-sm text-gray-500"
	>Write isotopes mass within "[]" i.e., [15N] and connected hydrogens must be specified inside
	brackets i.e., [15NH].
</span>
