<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { AlertCircle } from 'lucide-svelte';

	// export let title: string = 'Alert';
	export let variant: 'default' | 'destructive' = 'default';
	export let message: string = '';
</script>

<Alert.Root {variant}>
	<AlertCircle class="h-4 w-4" />
	<Alert.Title>{variant === 'destructive' ? 'Error' : 'Alert/Info'}</Alert.Title>
	<Alert.Description>{message}</Alert.Description>
</Alert.Root>
