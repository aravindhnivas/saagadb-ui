<script lang="ts">
	let active_tab = 'linelist';
</script>

<div class="tabs tabs-boxed max-w-xl">
	<a
		href="/admin/database_name/linelist"
		class="tab"
		class:tab-active={active_tab === 'linelist'}
		on:click={() => {
			active_tab = 'linelist';
		}}
	>
		linelist
	</a>
	<a
		href="/admin/database_name/add_linelist"
		class="tab"
		class:tab-active={active_tab === 'add_linelist'}
		on:click={() => {
			active_tab = 'add_linelist';
		}}
	>
		Add new linelist
	</a>
</div>

<slot />
