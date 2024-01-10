<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import KeyField from '$lib/components/forms/key-field.svelte';
	import Dropfile from '$lib/components/dropfile.svelte';
	import { toast } from 'svelte-sonner';

	export let data: PageData;
	const { form, errors, constraints, enhance, message } = superForm(data.form, {
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

<Dropfile
	on:parsed={({ detail }) => {
		const keys = Object.keys(detail.parsed);
		keys.forEach((key) => {
			if (!Object.keys($form).includes(key)) return;
			$form[key] = detail.parsed[key];
		});
	}}
/>

{#if $form && $errors && $constraints}
	<form class="grid gap-2 px-5" method="POST" use:enhance>
		<div>
			{#each Object.keys($form) as key}
				<KeyField
					{key}
					bind:value={$form[key]}
					errors={$errors[key]}
					constraints={$constraints[key]}
				/>
			{/each}
		</div>
		<div class="form-control w-[20rem] m-auto">
			<button class="btn btn-primary">Upload</button>
		</div>
	</form>
{/if}
