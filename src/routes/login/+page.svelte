<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';

	let message: string;
	$: message = $page.url.searchParams.get('message') || '';
	export let data: PageData;
	const { form, errors, enhance } = superForm(data.form);
	// $: console.log({ $form, $errors });
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
			<div class="form-control">
				<label class="label" for="email-input">
					<span class="label-text">Email</span>
				</label>
				<input
					name="email"
					id="email"
					type="email"
					placeholder="email"
					class="input input-bordered"
					required
					bind:value={$form.email}
				/>
				{#if $errors.email}
					<p class="text-xs text-error">{$errors.email}</p>
				{/if}
			</div>
			<div class="form-control">
				<label class="label" for="password-input">
					<span class="label-text">Password</span>
				</label>
				<input
					name="password"
					id="password"
					type="password"
					placeholder="password"
					class="input input-bordered"
					required
					bind:value={$form.password}
				/>
				{#if $errors.password}
					<p class="text-xs text-error">{$errors.password}</p>
				{/if}
				<!-- <label class="label" for="forgot-password-link">
					<a href="https://example.com" class="label-text-alt link link-hover">Forgot password?</a>
				</label> -->
			</div>
			<div class="form-control">
				<button class="btn btn-primary">Login</button>
			</div>
		</form>
	</div>
</div>
