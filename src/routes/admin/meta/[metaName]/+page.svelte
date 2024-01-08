<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';
	import KeyField from '$lib/components/forms/key-field.svelte';
	import { page } from '$app/stores';
	import Dropdown from '$lib/components/dropdown.svelte';

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

	$: if (data.dropdown) {
		console.log('check');
		for (const { id, name } of data.dropdown) {
			console.log(data[name]);
		}
	}
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
			{#each Object.keys($form) as key (key)}
				{#if !data.fileInput?.map((input) => input.name).includes(key)}
					<KeyField
						{key}
						bind:value={$form[key]}
						errors={$errors[key]}
						constraints={$constraints[key]}
					>
						{#if data.dropdown?.map((f) => f.name).includes(key)}
							<Dropdown items={data.dropdown} />
						{/if}
					</KeyField>
				{/if}
			{/each}
		</div>

		{#each data.fileInput as { id, name, required } (id)}
			<div class="form-control w-full max-w-xs">
				<label for="{name}-input" class="label">
					<span class="label-text">Pick <em>"{name}"</em></span>
				</label>
				<input
					{name}
					id="{name}-input"
					type="file"
					class="file-input file-input-bordered w-full max-w-xs"
					{required}
				/>
			</div>
		{/each}
		<div class="form-control w-[20rem] m-auto">
			<button class="btn btn-primary">Upload</button>
		</div>
	</form>
{/if}
