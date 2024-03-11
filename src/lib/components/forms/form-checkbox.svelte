<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';

	export let checked: boolean;
	export let disabled: boolean = false;
	export let name: string;
	export let label: string = 'Set status';
</script>

<div class="flex items-center gap-4">
	<Label for={name}>{label}</Label>
	<Checkbox {disabled} bind:checked />
	<span class:text-gray-400={disabled}>{checked}</span>
	<input hidden {name} value={checked} />
</div>
