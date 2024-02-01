<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Combobox from '$lib/components/combobox/combobox.svelte';
	import { getForm } from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { base } from '$app/paths';
	import Loader from '$lib/components/utils/loader.svelte';
	import { CDMS, JPL } from 'cdms-jpl-api';

	const { form, reset } = getForm();

	let molecule_tag = '';
	let fetching = false;
	let database_type: 'cdms' | 'jpl' = 'cdms';

	const parse_cdms = async () => {
		reset();
		try {
			fetching = true;
			if (!molecule_tag) return toast.error('Please enter a molecule tag tag first');
			const res = await fetch(`${base}/api/${database_type}/${molecule_tag}`);
			if (!res.ok) return toast.error(res.statusText);
			const html_data = await res.text();
			if (database_type === 'cdms') {
				const cdms_data = await CDMS(html_data);
				console.log(cdms_data);
				const { name } = cdms_data;
				$form.name = name.default;
				$form.iupac_name = '';
				$form.name_formula = name.formula.default;
				$form.name_html = name.html.default;
			} else if (database_type === 'jpl') {
				const jpl_data = await JPL(html_data);
				console.log(jpl_data);
				$form.name = jpl_data.name_meta.join(', ');
				$form.name_formula = jpl_data.Name;
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		} finally {
			fetching = false;
		}
	};
</script>

<div class="grid grid-cols-6 gap-4 items-end">
	<Combobox
		label="database"
		items={[
			{ value: 'cdms', label: 'CDMS' },
			{ value: 'jpl', label: 'JPL' }
		]}
		bind:value={database_type}
	/>
	<div class="flex flex-col gap-4">
		<Label>molecule tag</Label>
		<Input bind:value={molecule_tag} placeholder="Enter {database_type} molecule tag" />
	</div>
	<Button on:click={async () => await parse_cdms()}>Auto fill</Button>
	<Loader {fetching} class="col-span-3" />
</div>
