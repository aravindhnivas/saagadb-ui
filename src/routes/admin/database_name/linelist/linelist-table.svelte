<script lang="ts">
	export let openModal: (line_id: string) => void;
	export let linelist: { id: string; linelist_name: string }[] = [];
</script>

<div class="overflow-x-auto">
	<table class="table border-2 border-rounded-full">
		<!-- head -->
		<thead>
			<tr>
				<th>Name</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each linelist as item}
				<tr>
					<td>{item.linelist_name}</td>
					<th>
						<button on:click={() => openModal(item.id)} class="btn btn-ghost btn-xs hover:bg-red"
							>DELETE</button
						>
					</th>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
