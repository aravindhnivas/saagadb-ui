<script lang="ts">
	// import Dropdown from '$lib/components/dropdown.svelte';

	export let key: string;
	export let value: string;
	export let errors: string[] = [];
	export let constraints = {};
	// export let dropdown: string[] = [];
</script>

{#if typeof value === 'boolean'}
	<label class="label cursor-pointer gap-2 items-center justify-start">
		<input type="checkbox" class="checkbox" bind:checked={value} />
		<span class="label-text">{key}</span>
	</label>
{:else}
	<div class="form-control w-full">
		<label class="label" for="{key}-id">
			<span class="label-text">{key}</span>
		</label>

		<div class="flex gap-2">
			<slot />

			{#if key === 'email'}
				<input
					name={key}
					id="{key}-id"
					type="email"
					placeholder="Type here"
					class="input input-bordered w-full"
					aria-invalid={errors ? 'true' : undefined}
					bind:value
					{...constraints}
				/>
			{:else if key === 'password'}
				<input
					name={key}
					id="{key}-id"
					type="password"
					placeholder="Type here"
					class="input input-bordered w-full"
					aria-invalid={errors ? 'true' : undefined}
					bind:value
					{...constraints}
				/>
			{:else}
				<input
					name={key}
					id="{key}-id"
					type="text"
					placeholder="Type here"
					class="input input-bordered w-full"
					aria-invalid={errors ? 'true' : undefined}
					bind:value
					{...constraints}
				/>
			{/if}
		</div>

		{#if errors}
			<p class="text-xs text-error">{errors}</p>
		{/if}
	</div>
{/if}
