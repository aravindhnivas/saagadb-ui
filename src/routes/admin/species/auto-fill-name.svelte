<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { getForm } from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { CDMS_Parser } from '$lib/utils/cdms_parser';
	import { base } from '$app/paths';
	import Loader from '$lib/components/utils/loader.svelte';
	const { form } = getForm();
	let cdms_tag = '';
	let fetching = false;
</script>

<div class="grid grid-cols-5 gap-4 items-end">
	<div class="flex flex-col gap-4">
		<Label>molecule tag</Label>
		<Input bind:value={cdms_tag} placeholder="Enter CDMS molecule tag" />
	</div>
	<Button
		on:click={async () => {
			try {
				fetching = true;
				if (!cdms_tag) return toast.error('Please enter a CDMS tag first');
				const res = await fetch(`${base}/api/cdms/${cdms_tag}`);
				if (!res.ok) return toast.error(res.statusText);
				const cdms_data = await res.text();
				const cdms_fetched_data = CDMS_Parser(cdms_data);
				const { name } = cdms_fetched_data;
				console.log(cdms_fetched_data);
				$form.name = name.default;
				$form.iupac_name = '';
				$form.name_formula = name.formula.default;
				$form.name_html = name.html.default;
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			} finally {
				fetching = false;
			}
		}}>Auto fill CDMS tag</Button
	>
	<Loader {fetching} class="col-span-3" />
</div>
