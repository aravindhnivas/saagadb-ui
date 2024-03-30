<script lang="ts">
	import { AlertCircle, CheckCheck, AlertTriangle } from 'lucide-svelte/icons';
	import * as Alert from '$lib/components/ui/alert';
	import { getForm } from 'formsnap';
	import { confetti } from '@neoconfetti/svelte';
	export let showModal = true;
	const { message } = getForm();
	let modal: HTMLDialogElement;
	$: if (showModal && modal && $message && $message.text && $message.type === 'success') {
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
	<Alert.Root
		class="bg-{$message.type === 'success' ? 'green-100' : 'red'}"
		variant={$message.type === 'error' ? 'destructive' : 'default'}
	>
		{#if $message.type === 'success'}
			<CheckCheck class="h-4 w-4" />
		{:else if $message.type === 'warning'}
			<AlertTriangle class="h-4 w-4" />
		{:else if $message.type === 'error'}
			<AlertCircle class="h-4 w-4" />
		{/if}

		<Alert.Title>
			<span>{$message.type.toUpperCase()}</span>
		</Alert.Title>
		<Alert.Description class="grid gap-2 select-text">
			<span>{$message.text}</span>
			<button class="btn btn-sm w-[150px]" on:click={() => ($message = null)}>Okay</button>
		</Alert.Description>
	</Alert.Root>
{/if}
