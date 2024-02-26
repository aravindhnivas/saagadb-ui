<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { AlertCircle } from 'lucide-svelte/icons';

	export let variant: 'default' | 'destructive' = 'default';
	export let message: string = '';
	export let error: Error | null = null;
	export let title: string = 'Info';
</script>

<Alert.Root class="select-text" variant={error ? 'destructive' : variant || 'default'}>
	<slot><AlertCircle class="h-4 w-4" /></slot>

	<Alert.Title>
		<span>{title || (variant === 'destructive' || error ? 'Error' : title)}</span>
	</Alert.Title>

	<Alert.Description>
		<!-- {error ?  : message} -->
		{#if error}
			{import.meta.env.DEV ? error.stack : error.message}
		{:else}
			<slot name="message">{message ?? ''}</slot>
		{/if}
	</Alert.Description>
</Alert.Root>
