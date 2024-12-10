<script lang="ts">
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { PasswordSchema } from './schema';
	import { Checkbox } from '$lib/components/ui/checkbox';

	export let data: PageData;
	let show_password = false;
</script>

<div class="w-full flex items-center justify-center">
	<Form.Root form={data.form} schema={PasswordSchema} let:config let:submitting let:posted>
		<Card.Root class="lg:w-sm sm:w-full">
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Password reset</Card.Title>
				<Card.Description>Enter new password below</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<Form.Field {config} name="password">
					<Form.Item>
						<Form.Label>Password</Form.Label>
						<Form.Input type={show_password ? 'string' : 'password'} required />
						<Form.Validation />
					</Form.Item>
				</Form.Field>

				<Form.Field {config} name="confirm_password">
					<Form.Item>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Input type={show_password ? 'string' : 'password'} required />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			</Card.Content>
			<Card.Footer class="gap-4">
				<div class="w-full">
					<div class="flex gap-1 items-center p-2 mb-5">
						<Checkbox bind:checked={show_password} />
						<span>Show password</span>
					</div>
					<Form.Button class="w-full flex gap-4" disabled={submitting}>
						<span>Save password</span>
						{#if submitting}
							<span class="loading loading-spinner"></span>
						{/if}
					</Form.Button>
				</div>
			</Card.Footer>
		</Card.Root>
	</Form.Root>
</div>
