<script lang="ts">
	import { AlertCircle, CheckCheck, AlertTriangle } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { getForm } from 'formsnap';

	const { message } = getForm();
</script>

{#if $message && $message.text && $message.type}
	<Alert.Root class="my" variant={$message.type === 'error' ? 'destructive' : 'default'}>
		{#if $message.type === 'success'}
			<CheckCheck class="h-4 w-4" />
		{:else if $message.type === 'warning'}
			<AlertTriangle class="h-4 w-4" />
		{:else if $message.type === 'error'}
			<AlertCircle class="h-4 w-4" />
		{/if}
		<Alert.Title>{$message.type}</Alert.Title>
		<Alert.Description>{@html $message.text}</Alert.Description>
	</Alert.Root>
{/if}
