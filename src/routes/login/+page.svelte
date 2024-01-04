<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import KeyField from '$lib/components/forms/key-field.svelte';
	let message: string = '';
	$: if ($page.url.searchParams.get('message')) {
		message = $page.url.searchParams.get('message') as string;
	}
	export let data: PageData;
	const { form, errors, constraints, enhance } = superForm(data.form, {
		onError: (err) => {
			message = err.result.error.message;
		}
	});
</script>

<div class="w-full h-full flex flex-col gap-2 items-center justify-center">
	{#if message}
		<div role="alert" class="alert alert-warning w-100">
			<i class="i-mdi-alert"></i>
			<span>{message}</span>
		</div>
	{/if}

	<div class="md:w-[50%] w-full card shadow-2xl bg-base-100">
		<form class="card-body" method="POST" use:enhance>
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
			<div class="form-control">
				<button class="btn btn-primary">Login</button>
			</div>
		</form>
	</div>
</div>
