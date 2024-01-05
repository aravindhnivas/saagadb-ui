<script lang="ts">
	export let openModal: (line_id: string, update_type: 'PATCH' | 'DELETE', name?: string) => void;
	export let linelist: { id: string; linelist_name: string }[] = [];
</script>

<div class="overflow-x-auto">
	<table class="table border-2 border-rounded-full">
		<!-- head -->
		<thead>
			<tr>
				<th>Name</th>
				<th></th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each linelist as item}
				<tr>
					<td>{item.linelist_name}</td>
					<th>
						<button
							class="badge badge-sm badge-info gap-2"
							on:click={() => openModal(item.id, 'PATCH', item.linelist_name)}>UPDATE</button
						>
					</th>
					<th>
						<button
							class="badge badge-sm badge-error gap-2"
							on:click={() => openModal(item.id, 'DELETE')}>DELETE</button
						>
					</th>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
