<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	export let value: string;
	export let footer = true;
	export let title: string = '';
	export let description: string = '';

	let className = '';
	export { className as class };
</script>

<Tabs.Content {value}>
	<Card.Root>
		<Card.Header>
			<Card.Title>{title}</Card.Title>
			<Card.Description>
				<slot name="description">{description}</slot>
			</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-2 {className}">
			<div class="px-2" style="max-height: calc(100vh - 20rem); overflow: auto;">
				<slot />
			</div>
		</Card.Content>

		{#if footer}
			<Card.Footer>
				<slot name="footer">
					<Button>Submit form</Button>
				</slot>
			</Card.Footer>
		{/if}
	</Card.Root>
</Tabs.Content>
