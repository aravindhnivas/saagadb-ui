<script lang="ts">
	import { AlertCircle, CheckCheck, AlertTriangle } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { getForm } from 'formsnap';
	import { confetti } from '@neoconfetti/svelte';

	const { message } = getForm();
	let modal: HTMLDialogElement;
	$: console.log($message);
	$: if (modal && $message && $message.text && $message.type === 'success') {
		modal.showModal();
	}
</script>

<dialog bind:this={modal} class="modal">
	{#if $message && $message.text && $message.type === 'success'}
		<div use:confetti />
		<div class="modal-box">
			<h3 class="font-bold text-lg">Form submitted succesfully!!!</h3>
			<p class="py-4">{@html $message.text}</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn">Close</button>
				</form>
			</div>
		</div>
	{/if}
</dialog>

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
