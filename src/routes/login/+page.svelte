<script lang="ts">
	import { EyeOff, Eye } from 'lucide-svelte';
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import loginSchema from '$lib/schemas/login';
	export let data: PageData;

	let show_password = false;
</script>

<div class="w-full flex items-center justify-center">
	<Form.Root form={data.form} schema={loginSchema} let:config>
		<Card.Root class="lg:w-sm sm:w-full">
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Login with your account</Card.Title>
				<Card.Description>Enter your email and password below</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<Form.Field {config} name="email">
					<Form.Item>
						<Form.Label>Email</Form.Label>
						<Form.Input type="email" class="w-[300px]" required />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field {config} name="password">
					<Form.Item>
						<Form.Label>Password</Form.Label>
						<div class="flex items-center gap-4">
							<Form.Input class="w-[300px]" type={show_password ? 'string' : 'password'} required />
							<button type="button" on:click={() => (show_password = !show_password)}>
								{#if show_password}
									<Eye />
								{:else}
									<EyeOff />
								{/if}
							</button>
						</div>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<Form.Button class="w-full">Login</Form.Button>
			</Card.Footer>
		</Card.Root>
	</Form.Root>
</div>
