<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';

	let message: string = '';
	$: if ($page.url.searchParams.get('message')) {
		message = $page.url.searchParams.get('message') as string;
	}
	export let data: PageData;
	const { form, errors, enhance } = superForm(data.form, {
		onError: (err) => {
			message = err.result.error.message;
		}
	});
</script>

<form class="grid gap-2 px-5" method="POST" use:enhance>
	<div>
		{#each Object.keys($form) as key}
			<div class="form-control w-full">
				<label class="label" for="{key}-id">
					<span class="label-text">{key}</span>
				</label>
				<input
					name={key}
					id="{key}-id"
					type="text"
					placeholder="Type here"
					class="input input-bordered w-full"
					bind:value={$form[key]}
				/>
				{#if $errors[key]}
					<p class="text-xs text-error">{$errors[key]}</p>
				{/if}
			</div>
		{/each}
	</div>
	<div class="form-control w-[20rem] m-auto">
		<button class="btn btn-primary">Upload</button>
	</div>
</form>
