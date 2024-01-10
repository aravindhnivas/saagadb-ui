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

<form class="grid gap-2 px-5" method="POST" use:enhance>
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
