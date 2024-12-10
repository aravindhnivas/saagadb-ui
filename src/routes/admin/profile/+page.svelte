<script lang="ts">
	import { enhance } from '$app/forms';
	import { Check, LockKeyhole, UnlockKeyhole } from 'lucide-svelte/icons';
	import type { PageData } from './$types';
	import ChangePassword from './change-password.svelte';
	import { base } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Loader from '$lib/components/utils/loader.svelte';

	export let data: PageData;

	let disabled = true;
	const userKeys = [
		{ key: 'name', label: 'Name', editable: true },
		{ key: 'email', label: 'Email', editable: true },
		{ key: 'organization', label: 'Organization', editable: false },
		{ key: 'approver_name', label: 'Approver name', editable: false },
		{ key: 'is_staff', label: 'Admin user', editable: false },
		{ key: 'is_superuser', label: 'Superuser', editable: false }
	] as const;

	let verificationSent = false;

	async function resend_verification() {
		if (verificationSent) return toast.info('Verification email already sent');
		verificationSent = false;
		const res = await fetch(`${base}/api/user/resend-verify-email`, {
			method: 'GET'
		});

		const data = (await res.json()) as {
			detail: string;
		};
		if (res.ok) {
			verificationSent = true;
			toast.success(data.detail);
		} else {
			verificationSent = false;
			toast.error(data.detail);
		}
	}

	let uploading = false;
	const onSubmit: SubmitFunction = () => {
		uploading = true;
		return async ({ update, result }) => {
			const { data, type, status } = result as {
				data: {
					success: boolean;
					message: string;
				};
				type: string;
				status: number;
			};

			if (type !== 'success' || status !== 200) {
				toast.error('An error occurred');
				uploading = false;
				return;
			}

			if (data.success) {
				disabled = true;
				toast.success(data.message);
			} else {
				toast.error(data.message);
			}
			uploading = false;
			await update({ reset: false });
		};
	};
</script>

<h1 class="text-2xl font-bold mb-4">Profile</h1>

<Button variant="outline" size="sm" class="w-[150px]" on:click={() => (disabled = !disabled)}>
	<div class="flex gap-4 items-center">
		{#if disabled}
			<LockKeyhole />
		{:else}
			<UnlockKeyhole />
		{/if}
		<span>Edit</span>
	</div>
</Button>

<form
	enctype="multipart/form-data"
	use:enhance={onSubmit}
	method="POST"
	action="?/updateProfile&id={data.user.id}"
	class="grid grid-cols-4 gap-2 items-center select-text max-w-xl py-5"
>
	{#each userKeys as { key, label, editable }}
		<div class="col-span-1">{label}</div>
		<div class="col-span-3">
			{#if disabled || !editable}
				{data.user[key] ?? '-'}
			{:else}
				<Input value={data.user[key]} name={key} />
			{/if}
		</div>
	{/each}

	<div class="col-span-1">Account verified</div>
	<div class="col-span-3">
		{#if data.user.is_verified}
			<Check size="1.5em" />
		{:else}
			<div class="flex flex-col">
				<span>Not verified yet</span>
				{#if verificationSent}
					<span>Verification email sent</span>
				{:else}
					<button class="w-max hover:underline" on:click={resend_verification}
						>Send verification email</button
					>
				{/if}
			</div>
		{/if}
	</div>
	{#if !disabled}
		<Button type="submit" size="sm" class="col-span-4 w-[150px] ml-auto" disabled={uploading}>
			<Loader fetching={uploading} description="Uploading..." />
			{#if !uploading}
				<span>Save</span>
			{/if}
		</Button>
	{/if}
</form>

<Separator />

<ChangePassword form={data.form_change_password} />
