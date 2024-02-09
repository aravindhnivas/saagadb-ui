<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { AlertCircle } from 'lucide-svelte';

	export let variant: 'default' | 'destructive' = 'default';
	export let message: string = '';
	export let error: Error | null = null;
	export let title: string = 'Alert/Info';
</script>

<Alert.Root class="select-text" variant={error ? 'destructive' : variant || 'default'}>
	<AlertCircle class="h-4 w-4" />

	<Alert.Title>
		<span>{title || (variant === 'destructive' || error ? 'Error' : title)}</span>
	</Alert.Title>

	<Alert.Description>
		{error ? (import.meta.env.DEV ? error.stack : error.message) : message}
	</Alert.Description>
</Alert.Root>
