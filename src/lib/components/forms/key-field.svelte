<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';

	export let key: string;
	export let value: string | boolean;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = undefined;
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
			{:else if key === 'notes'}
				<textarea placeholder={key} class="textarea textarea-bordered textarea-md w-full" bind:value
				></textarea>
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
