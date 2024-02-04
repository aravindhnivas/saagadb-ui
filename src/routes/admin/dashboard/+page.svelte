<script lang="ts">
	import { logged_in, edit_mode } from '$lib/utils/stores';
	import type { LayoutServerData } from '../../$types';
	export let data: LayoutServerData;

	const { user } = data;
	$: if (user?.name) logged_in.set(user.name);
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
	</div>
{:else}
	<p>Invalid user</p>
{/if}
