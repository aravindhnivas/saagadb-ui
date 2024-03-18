<script lang="ts">
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import loginSchema from '$lib/schemas/login';
	import { Checkbox } from '$lib/components/ui/checkbox';
	// import { toast } from 'svelte-sonner';
	import { base } from '$app/paths';

	export let data: PageData;
	let show_password = false;
</script>

<div class="w-full flex items-center justify-center">
	<Form.Root form={data.form} schema={loginSchema} let:config let:submitting>
		<Card.Root class="lg:w-sm sm:w-full">
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Login with your account</Card.Title>
				<Card.Description>Enter your email and password below</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<Form.Field {config} name="email" let:constraints let:attrs>
					<Form.Item>
						<Form.Label>Email</Form.Label>
						<Form.Input type="email" {...constraints} {...attrs.input} />
						<Form.Validation {...attrs.validation} />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="password" let:constraints let:attrs>
					<Form.Item>
						<Form.Label>Password</Form.Label>
						<Form.Input
							type={show_password ? 'text' : 'password'}
							{...constraints}
							{...attrs.input}
						/>
						<Form.Validation {...attrs.validation} />
					</Form.Item>
				</Form.Field>
			</Card.Content>
			<Card.Footer class="gap-4">
				<div class="w-full">
					<div class="flex gap-1 items-center p-2 mb-5">
						<Checkbox bind:checked={show_password} />
						<span>Show password</span>
						<a class="ml-auto hover:underline text-sm" href="{base}/forgot-password"
							>Forgot password ?</a
						>
					</div>
					<Form.Button class="w-full flex gap-4" disabled={submitting}>
						<span>{submitting ? 'Logging in...' : 'Login'}</span>
						{#if submitting}
							<span class="loading loading-spinner"></span>
						{/if}
					</Form.Button>
				</div>
			</Card.Footer>
		</Card.Root>
	</Form.Root>
</div>
