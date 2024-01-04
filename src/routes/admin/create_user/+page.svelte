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
	let response_data;

	const { form, errors, enhance, constraints } = superForm(data.form, {
		onResult: ({ result }) => {
			const { type, status } = result;
			if (type === 'error') {
				message = `Error: ${result.error.message} (${status})`;
				return;
			}

			response_data = result.data?.response;
			// console.log(response_data);
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
<form class="grid gap-2 px-5" method="POST" use:enhance>
	<div class="justify-self-center min-w-[25em]">
		<KeyField
			key="name"
			bind:value={$form.name}
			errors={$errors.name}
			constraints={$constraints.name}
		/>
		<KeyField
			key="organization"
			bind:value={$form.organization}
			errors={$errors.organization}
			constraints={$constraints.organization}
		/>
		<KeyField
			key="email"
			bind:value={$form.email}
			errors={$errors.email}
			constraints={$constraints.email}
		/>
		<KeyField
			key="password"
			bind:value={$form.password}
			errors={$errors.password}
			constraints={$constraints.password}
		/>
	</div>
	<div class="form-control w-[20rem] justify-self-center">
		<button class="btn btn-primary">Create new user</button>
	</div>
</form>
