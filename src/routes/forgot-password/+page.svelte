<script lang="ts">
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { base } from '$app/paths';
	import { EmailSchema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { ArrowBigLeft } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(EmailSchema)
	});
	const { form: formStore, enhance, submitting, posted, errors } = form;
</script>

<div class="w-full flex items-center justify-center">
	<form method="POST" use:enhance>
		<Card.Root class="lg:w-sm sm:w-full">
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">
					<div class="flex">
						<span>Reset password</span>
						<a class="flex gap-4 btn btn-sm btn-dark ml-auto" href="{base}/login"
							><ArrowBigLeft /> Login
						</a>
					</div>
				</Card.Title>
				<Card.Description>Enter your email to recieve reset link</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<Form.Field {form} name="email" let:constraints>
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} {...constraints} bind:value={$formStore.email} />
					</Form.Control>
					<Form.Description>Enter your registered email</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>
			<Card.Footer class="gap-4">
				{#if $posted && !$errors.email}
					<span class="text-sm">Check your email sent for reset link</span>
				{/if}
				<Form.Button class="w-full flex gap-4" disabled={$submitting}>
					<span>{$posted && !$errors.email ? 'Resend' : 'Request link'}</span>
					{#if $submitting}
						<span class="loading loading-spinner"></span>
					{/if}
				</Form.Button>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
