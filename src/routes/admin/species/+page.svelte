<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';
	import KeyField from '$lib/components/forms/key-field.svelte';
	let message: string = '';

	$: if ($page.url.searchParams.get('message')) {
		message = $page.url.searchParams.get('message') as string;
	}

	export let data: PageData;
	// let response_data;
	// let large_message: string = '';
	const { form, errors, constraints, enhance } = superForm(data.form, {
		onResult: ({ result }) => {
			const { type, status } = result;
			if (type === 'error') {
				if (result.error.message.length > 100) {
					// large_message = result.error.message;
					console.warn(result.error.message);
					return;
				}
				message = `Error: ${result.error.message} (${status})`;
				return;
			}

			// response_data = result.data?.response;
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Species added!');
			}
		}
	});
</script>

{#if message}
	<div role="alert" class="alert alert-warning w-100 m-auto">
		<i class="i-mdi-alert"></i>
		<span>{message}</span>
	</div>
{/if}

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
