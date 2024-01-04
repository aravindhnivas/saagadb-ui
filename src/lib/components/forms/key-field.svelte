<script lang="ts">
	export let key: string;
	export let value: string;
	export let errors: string[] = [];
	// export let type: 'email' | 'password' | 'text';
	export let constraints = {};
</script>

<div class="form-control w-full">
	<label class="label" for="{key}-id">
		<span class="label-text">{key}</span>
	</label>

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

	{#if errors}
		<p class="text-xs text-error">{errors}</p>
	{/if}
</div>
<!-- 
<style lang="scss">
	input[required] {
		content: ' *';
		color: red;
	}
</style> -->
