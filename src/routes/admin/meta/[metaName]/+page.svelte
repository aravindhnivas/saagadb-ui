<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';
	import KeyField from '$lib/components/forms/key-field.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';

	export let data: PageData;

	let form: ReturnType<typeof superForm>['form'];
	let errors: ReturnType<typeof superForm>['errors'];
	let constraints: ReturnType<typeof superForm>['constraints'];
	let enhance: ReturnType<typeof superForm>['enhance'];
	let formId: ReturnType<typeof superForm>['formId'];
	let message: ReturnType<typeof superForm>['message'];

	$: if (data.form) {
		({ form, errors, constraints, enhance, formId, message } = superForm(data.form, {
			onUpdated({ form }) {
				if (form.valid) {
					toast.success('Species added!');
				}
			}
		}));
		// console.log({ $formId });
	}

	const check_key_to_include = (key: string) => {
		const arr_file_input = data.fileInput?.map((f) => f.name);
		const arr_dropdown = data.dropdown?.map((f) => f.name);
		const arr = new Set([...arr_file_input, ...arr_dropdown]);
		return !arr.has(key);
	};
</script>

{#if $message}
	<div role="alert" class="alert alert-warning w-100 m-auto">
		<i class="i-mdi-alert"></i>
		<span>{JSON.stringify($message)}</span>
	</div>
{/if}

{#if $form && $errors && $constraints}
	<form class="grid gap-2 px-5" method="POST" use:enhance>
		{#each data.dropdown as { id, name, key } (id)}
			<div class="w-full">
				<label class="label" for="{name}-id">
					<span class="label-text">{name}</span>
				</label>
				<Dropdown
					items={data[name]?.map((f) => ({
						id: f.id,
						name: f[key]
					}))}
					label="Select {name}"
					on:selected={({ detail }) => {
						$form[name] = detail.id;
					}}
				>
					<input
						{name}
						id="{name}-id"
						class="input input-bordered"
						placeholder="selected id"
						bind:value={$form[name]}
						required
					/>
				</Dropdown>
			</div>
		{/each}

		<div>
			{#each Object.keys($form) as key (key)}
				{#if check_key_to_include(key)}
					<KeyField
						{key}
						bind:value={$form[key]}
						errors={$errors[key]}
						constraints={$constraints[key]}
					/>
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
