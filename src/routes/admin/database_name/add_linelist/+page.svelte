<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';
	import KeyField from '$lib/components/forms/key-field.svelte';

	export let data: PageData;

	const { form, errors, constraints, enhance, message } = superForm(data.form, {
		resetForm: true,
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Species added!');
			}
		}
	});
</script>

{#if $message}
	<div role="alert" class="alert alert-warning w-100 m-auto">
		<i class="i-mdi-alert"></i>
		<span>{JSON.stringify($message)}</span>
	</div>
{/if}

<form
	class="grid gap-2 px-5"
	method="POST"
	action="?/get_linelist"
	use:enhance
	enctype="multipart/form-data"
>
	<!-- <div class="form-control w-full max-w-xs">
		<label for="file-input" class="label">
			<span class="label-text">Pick a file</span>
		</label>
		<input
			name="file"
			id="file-input"
			type="file"
			class="file-input file-input-bordered w-full max-w-xs"
		/>
	</div> -->
	<div>
		<KeyField
			key="linelist_name"
			bind:value={$form.linelist_name}
			errors={$errors.linelist_name}
			constraints={$constraints.linelist_name}
		/>
	</div>
	<div class="form-control w-[20rem] m-auto">
		<button class="btn btn-primary">Upload</button>
	</div>
</form>
