<script lang="ts">
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { PasswordSchema } from './schema';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';

	export let data: PageData;

	let show_password = false;

	const form = superForm(data.form, {
		validators: zodClient(PasswordSchema)
	});
	const { form: formStore, enhance, submitting, posted, errors } = form;
</script>

<form class="w-full flex items-center justify-center" method="POST" use:enhance>
	<Card.Root class="lg:w-sm sm:w-full">
		<Card.Header class="space-y-1">
			<Card.Title class="text-2xl">Password reset</Card.Title>
			<Card.Description>Enter new password below</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<Form.Field {form} name="password" let:constraints>
				<Form.Control let:attrs>
					<Form.Label>New Password</Form.Label>
					<Input
						{...constraints}
						{...attrs}
						bind:value={$formStore.password}
						type={show_password ? 'text' : 'password'}
					/>
				</Form.Control>
				<!-- <Form.Description>Enter a new password</Form.Description> -->
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="confirm_password" let:constraints>
				<Form.Control let:attrs>
					<Form.Label>Confirm Password</Form.Label>
					<Input
						{...constraints}
						{...attrs}
						bind:value={$formStore.confirm_password}
						type={show_password ? 'text' : 'password'}
					/>
				</Form.Control>
				<!-- <Form.Description>Re-enter a new password</Form.Description> -->
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer class="gap-4">
			<div class="w-full">
				<div class="flex gap-1 items-center p-2 mb-5">
					<Checkbox bind:checked={show_password} />
					<span>Show password</span>
				</div>
				<Form.Button class="w-full flex gap-4" disabled={$submitting}>
					<span>Save password</span>
					{#if $submitting}
						<span class="loading loading-spinner"></span>
					{/if}
				</Form.Button>
			</div>
		</Card.Footer>
	</Card.Root>
</form>
