<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';
	import KeyField from '$lib/components/forms/key-field.svelte';

	export let data: PageData;

	const { form, errors, enhance, constraints, message } = superForm(data.form, {
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
