<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';
	import KeyField from '$lib/components/forms/key-field.svelte';
	import { page } from '$app/stores';

	export let data: PageData;
	let message: string = '';
	$: if ($page.url.searchParams.get('message')) {
		message = $page.url.searchParams.get('message') as string;
	}

	const createSuperForm = (form: PageData['form']) => {
		return superForm(form, {
			onResult: ({ result }) => {
				const { type, status } = result;
				if (type === 'error') {
					if (result.error.message.length > 100) {
						console.warn(result.error.message);
						message = `Error: ${result.error.message.slice(0, 100)}... (${status})`;
						return;
					}
					message = `Error: ${result.error.message} (${status})`;
					return;
				}
			},
			onUpdated({ form }) {
				if (form.valid) {
					toast.success('Species added!');
				}
			}
		});
	};
	let form, errors, constraints, enhance;
	$: if (data.form) {
		({ form, errors, constraints, enhance } = createSuperForm(data.form));
	}
	$: console.log($form);
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
