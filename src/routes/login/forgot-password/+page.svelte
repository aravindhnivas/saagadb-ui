<script lang="ts">
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { toast } from 'svelte-sonner';
	import { base } from '$app/paths';
	import { EmailSchema } from './schema';
	import { ArrowBigLeft } from 'lucide-svelte';

	export let data: PageData;
</script>

<div class="w-full flex items-center justify-center">
	<Form.Root form={data.form} schema={EmailSchema} let:config let:submitting let:posted>
		<Card.Root class="lg:w-sm sm:w-full">
			<Card.Header class="space-y-1">
				<a class="flex gap-4 btn btn-sm btn-dark w-[150px] ml-auto" href="{base}/login"
					><ArrowBigLeft /> Login
				</a>
				<Card.Title class="text-2xl">Reset password</Card.Title>
				<Card.Description>Enter your email to recieve reset link</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<Form.Field {config} name="email">
					<Form.Item>
						<Form.Label>Email</Form.Label>
						<Form.Input type="email" required />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			</Card.Content>
			<Card.Footer class="gap-4">
				{#if posted}
					<span class="text-sm">Check your email sent for reset link</span>
				{/if}
				<Form.Button class="w-full flex gap-4" disabled={submitting}>
					<span>{posted ? 'Resend' : 'Request reset-link'}</span>
					{#if submitting}
						<span class="loading loading-spinner"></span>
					{/if}
				</Form.Button>
			</Card.Footer>
		</Card.Root>
	</Form.Root>
</div>
