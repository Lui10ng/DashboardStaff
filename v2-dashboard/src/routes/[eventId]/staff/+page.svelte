<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { pendingStaffMembers, staffMembers } from '$lib/types/dataList';
	

	
	const pendingStaffStore = $state(pendingStaffMembers);
	const staffMembersStore = $state(staffMembers);

	let searchQuery = $state('');
	let staffFilter = $state('All Staffs');
	let timeFilter = $state('Time Registered');
	let isModalOpen = $state(false);
	let isInviteModalOpen = $state(false);
	let selectedImage = $state<string | null>(null);
	let fileInput: HTMLInputElement | null = null;
	let activeDropdownIndex = $state<number | null>(null);

	let newStaffName = $state('');
	let newStaffEmail = $state('');
	let newStaffPhone = $state('');
	let newStaffRole = $state('Scanner');

	function navigateTo(path: string) {
		if (path) {
			window.location.href = path;
		} else {
			console.log('No link assigned yet.');
		}
	}

	function removeImage(event: Event) {
		event.stopPropagation();
		selectedImage = null;
		if (fileInput) {
			fileInput.value = "";
		}
	}

	function handleFileUpload(event: Event) {
		const fileInput = event.target as HTMLInputElement;
		if (fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0];
			selectedImage = URL.createObjectURL(file);
		}
	}

	function acceptStaff(staffMember: typeof pendingStaffMembers[0]) {
		const updatedStaffMember = { ...staffMember, status: 'active' };
		
		
		pendingStaffStore.splice(
			pendingStaffStore.findIndex(staff => staff.name === staffMember.name),
			1
		);
		
		
		staffMembersStore.push(updatedStaffMember);
	}

	function declineStaff(staffMember: typeof pendingStaffMembers[0]) {
		
		pendingStaffStore.splice(
			pendingStaffStore.findIndex(staff => staff.name === staffMember.name),
			1
		);
	}

	function openInviteModal() {
		isInviteModalOpen = true;
	}

	function closeInviteModal() {
		isInviteModalOpen = false;
		resetInviteForm();
	}

	function resetInviteForm() {
		newStaffName = '';
		newStaffEmail = '';
		newStaffPhone = '';
		newStaffRole = 'Scanner';
	}

	function inviteStaff() {
		if (!newStaffName || !newStaffEmail || !newStaffPhone) {
			alert('Please fill in all fields');
			return;
		}

		const newStaffMember = {
			name: newStaffName,
			email: newStaffEmail,
			phone: newStaffPhone,
			role: newStaffRole
		};

		
		pendingStaffStore.push(newStaffMember);

		closeInviteModal();
	}

	function toggleDropdown(index: number) {
		activeDropdownIndex = activeDropdownIndex === index ? null : index;
	}

	function removeStaff(staffMember: typeof staffMembers[0]) {
		
		staffMembersStore.splice(
			staffMembersStore.findIndex(staff => staff.name === staffMember.name),
			1
		);
		
		activeDropdownIndex = null;
	}

	function handleClickOutside(event: MouseEvent) {
		if (activeDropdownIndex !== null) {
			activeDropdownIndex = null;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="min-h-screen bg-white">
	<main class="container mx-auto px-4 pb-6">
		<hr class="w-full border-t border-gray-200 my-6">
		
		<div class="bg-white rounded-lg shadow-sm">
			<div class="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border-b border-gray-200">
				<div class="mb-6 md:mb-0">
					<h2 class="text-xl mb-2 md:mb-0">Staff List</h2>
					<p class="text-sm">Your Staff History</p>
				</div>
				<div class="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
					<button 
						class=" md:w-auto px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer bg-[#E0E0E0] font-sans h-10 w-[175px] text-[#6C727F] hover:bg-[#B7B7B7]" 
						on:click={() => navigateTo('/eventId/edit-scanner')}
					>
						<span>Edit Scanner</span>
					</button>
					<button 
						class=" md:w-auto px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer bg-[#DF4D60] font-sans h-10 w-[150px] text-white hover:bg-[#dc3c51]"
						on:click={openInviteModal}
					>
					<i class="fa-solid fa-user h-5 w-5"></i>
						<span>Invite Staff</span>
					</button>
				</div>
			</div>

			<div class="overflow-x-auto mt-4 px-4"> 
				<table class="w-full min-w-[600px]">
					<thead>
						<tr class="text-left border-b border-gray-200">
							<th class="p-4 font-medium blacktext">Name</th>
							<th class="p-4 pl-9 font-medium blacktext">Role</th>
						</tr>
					</thead>
					<tbody>
						{#each pendingStaffStore as staff}
							<tr class="border-b border-gray-200">
								<td class="p-4">
									<span class="text-sm md:text-base">{staff.name}</span>
								</td>
								<td class="p-4">
									<span class={`inline-flex px-3 py-1 text-xs md:text-sm rounded-full justify-center items-center min-w-[80px] text-center ${
									  staff.role === 'Admin' 
									  ? 'bg-[#f5efd7] text-[#8B6914] font-medium' 
									  : 'bg-[#DEE9FC] text-[#263FA9] font-medium'
									}`}>
									  {staff.role}
									</span>
								  </td>
								<td class="p-4">
									<div class="flex justify-end gap-2">
										<button class="cursor-pointer text-xs md:text-sm px-3 py-1 border text-[#DF4D60] rounded-[10px] w-[90px] hover:text-[#DF4D60] hover:bg-[#fae3e6] hover:rounded-[10px]" on:click={() => declineStaff(staff)}>
											Decline
										</button>
										<button class="cursor-pointer text-xs md:text-sm px-3 py-1 text-white bg-[#DF4D60] font-['Popins',_sans-serif] rounded-lg w-[90px] hover:bg-[#dc3c51]" on:click={() => acceptStaff(staff)}>
											Accept
										</button>
									</div>
								</td>
							</tr>
						{/each}
						
						{#each staffMembersStore as staff, index}
							<tr class="border-b border-gray-200">
								<td class="p-4">
									<span class="text-sm md:text-base">{staff.name}</span>
								</td>
								<td class="p-4">
									<span class="inline-flex justify-center items-center min-w-[80px] text-center px-3 py-1 text-xs md:text-sm rounded-full {staff.role === 'Admin' ? 'bg-[#f5efd7] text-[#8B6914] font-medium' : 'bg-[#DEE9FC] text-[#263FA9] font-medium'}">
									  {staff.role}
									</span>
								  </td>
								<td class="p-4">
									<div class="flex justify-end relative">
										<button class="p-1 hover:bg-gray-100 rounded" on:click|stopPropagation={() => toggleDropdown(index)}>
											<i class="fa-solid fa-bars h-5 w-5"></i>
										</button>
										
										{#if activeDropdownIndex === index}
											<div class="absolute right-0 top-8 text-[#DF4D60] border border-[#DF4D60] rounded-lg w-[110px] bg-white font-['popins',_sans-serif] text-xs hover:bg-[#fae3e6] py-2 z-10 w-36">
												<button 
													class="w-full text-left px-4 py-2"
													on:click|stopPropagation={() => removeStaff(staff)}
												>
													Remove Staff
												</button>
											</div>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</main>
</div>

{#if isInviteModalOpen}
	<div class="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 ">
		<div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 border-gray-400 border-1 border-solid">
			<div class="flex justify-between items-center mb-4">
				<h3 class="text-lg font-medium">Invite Staff</h3>
				<button on:click={closeInviteModal} class="text-gray-500 hover:text-gray-700">
					<i class="fas fa-times"></i>
				</button>
			</div>
			
			<form on:submit|preventDefault={inviteStaff} class="space-y-4">
				<div>
					<label for="staffName" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
					<input 
						type="text" 
						id="staffName" 
						bind:value={newStaffName} 
						class="w-full px-3 py-2 border border-gray-400 rounded-md"
						required
					/>
				</div>
				
				<div>
					<label for="staffEmail" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
					<input 
						type="email" 
						id="staffEmail" 
						bind:value={newStaffEmail} 
						class="w-full px-3 py-2 border border-gray-400 rounded-md"
						required
					/>
				</div>
				
				<div>
					<label for="staffPhone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
					<input 
						type="tel" 
						id="staffPhone" 
						bind:value={newStaffPhone} 
						class="w-full px-3 py-2 border border-gray-400 rounded-md"
						required
					/>
				</div>
				
				<div>
					<label for="staffRole" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
					<select 
						id="staffRole" 
						bind:value={newStaffRole} 
						class="w-full px-3 py-2 border border-gray-400 rounded-md"
					>
						<option value="Scanner">Scanner</option>
						<option value="Admin">Admin</option>
					</select>
				</div>
				
				<div class="flex justify-end space-x-2 pt-4">
					<button 
						type="button" 
						on:click={closeInviteModal}
						class="px-4 py-2 border border-gray-300 rounded-md text-sm"
					>
						Cancel
					</button>
					<button 
						type="submit" 
						class="px-4 py-2 bg-red-500 text-white rounded-md text-sm"
					>
						Invite
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}