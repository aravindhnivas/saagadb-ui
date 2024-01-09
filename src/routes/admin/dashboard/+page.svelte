<script lang="ts">
	import { logged_in, edit_mode } from '$lib/utils/stores';
	import type { LayoutServerData } from '../../$types';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';

	let showStatusBar = true;
	let showActivityBar = false;
	let showPanel = false;

	export let data: LayoutServerData;

	const { user } = data;
	$: if (user?.name) logged_in.set(user.name);

	// let edit_mode = false;
</script>

{#if user}
	<div class="form-control items-start">
		<label class="label cursor-pointer gap-2">
			<input type="checkbox" class="toggle" bind:checked={$edit_mode} />
			<span class="label-text">Edit mode</span>
		</label>
	</div>

	<div class="flex flex-col gap-4">
		<div>
			<div class="text-lg">Hello, {user?.name}</div>
			<div>
				Email: <em class="badge badge-ghost">{user.email}</em>
			</div>
			<div>
				Organisation: <em class="badge badge-warning">{user.organization}</em>
			</div>
		</div>

		<!-- <Stats /> -->
	</div>
{:else}
	<p>Invalid user</p>
{/if}

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" builders={[builder]}>Open</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Label>Appearance</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.CheckboxItem bind:checked={showStatusBar}>Status Bar</DropdownMenu.CheckboxItem>
		<DropdownMenu.CheckboxItem bind:checked={showActivityBar} disabled>
			Activity Bar
		</DropdownMenu.CheckboxItem>
		<DropdownMenu.CheckboxItem bind:checked={showPanel}>Panel</DropdownMenu.CheckboxItem>
	</DropdownMenu.Content>
</DropdownMenu.Root>
