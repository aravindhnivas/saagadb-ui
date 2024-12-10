<script lang="ts">
	import { base } from '$app/paths';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getForm } from 'formsnap';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	import Loader from '$lib/components/utils/loader.svelte';
	const { form } = getForm();

	const fetch_smiles = async () => {
		if (!$form.iupac_name) return toast.error('Please enter a name first');
		const res = await fetch(`${base}/api/pubchem/${$form.iupac_name}/CanonicalSMILES`);

		if (!res.ok) return toast.error(res.statusText + ': could not fetch SMILES');

		const pubchem_data = (await res.json()) as { CID: string; CanonicalSMILES: string }[];

		if (pubchem_data.length > 0) {
			$form.smiles = pubchem_data[0].CanonicalSMILES;
			if ($form.smiles) await auto_fill_properties();
		} else {
			return toast.error('No SMILES string found for this name');
		}
	};

	let mol: ReturnType<typeof window.RDKit.get_mol>;

	const auto_fill_properties = async () => {
		$form.smiles = $form.smiles.trim();
		if (!$form.smiles) return toast.error('Please enter a SMILES string first');
		if (!window.RDKit) return toast.error('RDKit not loaded. Please refresh the page.');
		mol = window.RDKit.get_mol($form.smiles);
		if (!mol) {
			// console.log(mol);
			return toast.error('Invalid SMILES string');
		}
		const InChI = mol?.get_inchi();
		const InChIkey = window.RDKit.get_inchikey_for_inchi(mol?.get_inchi());
		$form.standard_inchi = InChI;
		$form.standard_inchi_key = InChIkey;
	};

	let fetching = false;
</script>

<div class="grid grid-cols-5 gap-4 items-start">
	<Button
		disabled={fetching}
		on:keyup={async (e) => {
			e.preventDefault();
			if (e.key === 'Enter') {
				await auto_fill_properties();
			}
		}}
		on:click={async () => {
			try {
				fetching = true;
				await fetch_smiles();
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			} finally {
				fetching = false;
			}
		}}
	>
		<Loader {fetching} description="Fetching..." />
		{#if !fetching}
			Fetch SMILES (PubChem)
		{/if}
	</Button>
	<Form.Input
		required
		class="col-span-2"
		placeholder="Enter smiles string"
		on:keyup={async (e) => {
			if (e.key === 'Enter') {
				await auto_fill_properties();
			}
		}}
	/>
	<Button on:click={async () => await auto_fill_properties()}>Draw & fill InChI</Button>

	{#if mol}
		<div>{@html mol?.get_svg(100, 50)}</div>
	{/if}
</div>
<span class="text-sm text-gray-500"
	>Write isotopes mass within "[]" i.e., [15N] and connected hydrogens must be specified inside
	brackets i.e., [15NH].
</span>
