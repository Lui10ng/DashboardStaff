<script>
	import Button from '$lib/components/ui/Button.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import { pendingStaffMembers, staffMembers } from '$lib/stores/data';
</script>

<div class="rounded-lg shadow-sm">
	<div
		class="flex flex-col items-start justify-between border-b border-gray-200 p-4 md:flex-row md:items-center md:p-6"
	>
		<div class="mb-4 md:mb-0">
			<h2 class="text-xl font-bold">Staff List</h2>
			<p class="text-sm text-gray-600">Your Staff History</p>
		</div>
		<Button
			onClick={() => {}}
			label="Invite Staff"
			icon="fa-solid fa-user-plus"
			className="bg-primary px-4 py-2 text-white rounded-lg"
		/>
	</div>

	<!-- Staff Table -->
	<div class="mt-4 overflow-x-auto px-4">
		<table class="w-full min-w-[600px]">
			<thead>
				<tr class="border-b border-gray-200 text-left">
					<th class="p-4 font-medium text-gray-700">Name</th>
					<th class="p-4 font-medium text-gray-700">Role</th>
					<th class="p-4 font-medium text-gray-700"></th>
				</tr>
			</thead>
			<tbody>
				<!-- Pending Staff -->
				{#each pendingStaffMembers as staff}
					<tr class="border-b border-gray-200">
						<td class="p-4">
							<span>{staff.name}</span>
						</td>
						<td class="p-4">
							<span
								class="inline-block rounded-full px-3 py-1 text-white {staff.role === 'Admin'
									? 'bg-yellow-500'
									: 'bg-blue-500'}"
							>
								{staff.role}
							</span>
						</td>
						<td class="p-4">
							<div class="flex justify-end gap-2">
								<Button
									onClick={() => {}}
									label="Decline"
									className="text-xs md:text-sm border border-red text-primary px-3 py-1 rounded-sm"
								/>
								<Button
									onClick={() => {}}
									label="Accept"
									className="text-xs md:text-sm text-white bg-primary px-3 py-1 rounded-sm"
								/>
							</div>
						</td>
					</tr>
				{/each}

				<!-- Active Staff -->
				{#each staffMembers as staff}
					<tr class="border-b border-gray-200">
						<td class="p-4">
							<span>{staff.name}</span>
						</td>
						<td class="p-4">
							<span
								class="inline-block rounded-full px-3 py-1 text-white {staff.role === 'Admin'
									? 'bg-yellow-500'
									: 'bg-blue-500'}"
							>
								{staff.role}
							</span>
						</td>
						<td class="flex justify-end p-4">
							<Button onClick={() => {}} icon="fa-solid fa-ellipsis text-lg text-gray-500" />
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="py-5 pl-3">
			<Pagination total={30} />
		</div>
	</div>
</div>
