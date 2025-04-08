<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { pendingStaffMembers, staffMembers } from '$lib/types/dataList';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import { fly } from 'svelte/transition';

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

	let scannerName = $state('Sample Name');
	let qrScannerLink = $state('https://veent.co/scanner/');
	let selectedAttendanceType = $state('');
	let showOthersInput = $state(false);
	let otherAttendanceValue = $state('');
	let showCopyPopup = $state(false);

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
			fileInput.value = '';
		}
	}

	function handleFileUpload(event: Event) {
		const fileInput = event.target as HTMLInputElement;
		if (fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0];
			selectedImage = URL.createObjectURL(file);
		}
	}

	function acceptStaff(staffMember: (typeof pendingStaffMembers)[0]) {
		const updatedStaffMember = { ...staffMember, status: 'active' };

		pendingStaffStore.splice(
			pendingStaffStore.findIndex((staff) => staff.name === staffMember.name),
			1
		);

		staffMembersStore.push(updatedStaffMember);
	}

	function declineStaff(staffMember: (typeof pendingStaffMembers)[0]) {
		pendingStaffStore.splice(
			pendingStaffStore.findIndex((staff) => staff.name === staffMember.name),
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

	function removeStaff(staffMember: (typeof staffMembers)[0]) {
		staffMembersStore.splice(
			staffMembersStore.findIndex((staff) => staff.name === staffMember.name),
			1
		);

		activeDropdownIndex = null;
	}

	function selectAttendanceType(type: string) {
		selectedAttendanceType = type;
		showOthersInput = type === 'Others';
	}

	function saveScanner() {
		console.log('Scanner saved with name:', scannerName);
		console.log('QR Scanner link:', qrScannerLink);
		console.log('Attendance type:', selectedAttendanceType);

		if (showOthersInput) {
			console.log('Custom attendance value:', otherAttendanceValue);
		}

		window.history.back();
	}

	function cancelEdit() {
		console.log('Edit canceled');
		window.history.back();
	}

	function copyLink() {
		navigator.clipboard
			.writeText(qrScannerLink)
			.then(() => {
				showCopyPopup = true;
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	}

	function handleClosePopup() {
		showCopyPopup = false;
	}
</script>

<div class="min-h-screen bg-white" in:fly={{ y: -50, duration: 200 }}>
	<main class="container pb-6">
		<hr class="my-6 w-full border-t border-gray-200" />

		<div class="rounded-lg bg-white shadow-sm">
			<div
				class="flex flex-col items-start justify-between border-b border-gray-200 p-4 md:flex-row md:items-center md:p-6"
			>
				<div class="mb-6 md:mb-0">
					<h2 class="mb-2 text-xl md:mb-0">Staff List</h2>
					<p class="text-sm">Your Staff History</p>
				</div>
				<div class="flex w-full flex-col space-y-3 md:w-auto md:flex-row md:space-x-3 md:space-y-0">
					<Drawer
						contentBaseClass="bg-white p-4 space-y-4 shadow-xl w-full sm:w-[35rem] h-svh"
						buttonLabel="Edit Scanner"
						buttonIcon="fa-solid fa-pen"
						justify="justify-end"
						alignment="items-start"
						positionIn={{ x: 480, duration: 200 }}
						positionOut={{ x: 480, duration: 200 }}
					>
						<div class="mx-auto max-w-4xl px-4 md:px-8">
							<div class="py-6">
								<div class="mb-6 border-b border-gray-200 pb-3">
									<h1 class="text-xl font-medium">Edit Scanner</h1>
								</div>

								<div class="mt-8 space-y-6">
									<div>
										<label
											for="scannerName"
											class="mb-2.5 block text-sm font-medium text-gray-700 2xl:mb-0"
											>Scanner Name</label
										>
										<input
											type="text"
											id="scannerName"
											bind:value={scannerName}
											class="mb-2 w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-sm 2xl:mb-0"
										/>
									</div>

									<div>
										<label
											for="qrScannerLink"
											class="mb-2.5 block text-sm font-medium text-gray-700 2xl:mb-0"
											>QR Scanner Link</label
										>
										<div class="relative">
											<input
												type="text"
												id="qrScannerLink"
												bind:value={qrScannerLink}
												class="mb-1 w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-sm 2xl:mb-0"
											/>
											<button
												aria-label="Copy Link"
												class="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer"
												onclick={copyLink}
											>
												<i class="fa-solid fa-copy h-4 w-4" style="color: #a6aba9;"></i>
											</button>
										</div>
									</div>

									<div>
										<h1 class="mb-2.5 block text-sm font-medium text-gray-700 2xl:mb-0">
											Select Attendance Type
										</h1>
										<div class="grid grid-cols-3 gap-4">
											{#each ['In / Out', 'On Duty', 'Training', 'Approve', 'Present', 'Others'] as type}
												<button
													class={`cursor-pointer rounded-md border p-2 text-center text-sm ${
														selectedAttendanceType === type
															? 'bg-[#DF4D60] font-sans text-white hover:bg-[#dc3c51]'
															: 'border border-[#DF4D60] bg-white font-sans text-[#DF4D60] hover:bg-[#DF4D60] hover:text-white'
													}`}
													onclick={() => selectAttendanceType(type)}
												>
													{type}
												</button>
											{/each}
										</div>
									</div>

									{#if showOthersInput}
										<div>
											<h1 class="mb-2 block text-sm font-medium text-gray-700">Others</h1>
											<input
												type="text"
												placeholder="Input Attendance name"
												bind:value={otherAttendanceValue}
												class="w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-sm"
											/>
										</div>
									{/if}

									<div class="flex space-x-4 pt-4">
										<Button
											onClick={saveScanner}
											className="w-50 cursor-pointer rounded-md bg-[#DF4D60] px-4 py-2 font-sans text-white hover:bg-[#dc3c51]"
											label="Save Scanner"
										/>

										<Button
											onClick={cancelEdit}
											className="w-42 cursor-pointer rounded-md border border-[#B4B4B4] bg-white px-4 py-2 text-[#6C727F] hover:bg-[#d9d9d9]"
											label="Cancel"
										/>
									</div>
								</div>
							</div>
						</div>
					</Drawer>
					<button
						class=" flex h-10 w-full cursor-pointer items-center justify-center space-x-2 rounded-lg bg-[#DF4D60] px-4 py-2 font-sans text-white hover:bg-[#dc3c51] sm:w-[150px] md:w-auto"
						onclick={openInviteModal}
					>
						<i class="fa-solid fa-user h-5 w-5"></i>
						<span>Invite Staff</span>
					</button>
				</div>
			</div>

			<div class="mt-4 overflow-x-auto px-4">
				<table class="w-full min-w-[600px]">
					<thead>
						<tr class="border-b border-gray-200 text-left">
							<th class="blacktext p-4 font-medium">Name</th>
							<th class="blacktext p-4 pl-9 font-medium">Role</th>
						</tr>
					</thead>
					<tbody>
						{#each pendingStaffStore as staff}
							<tr class="border-b border-gray-200">
								<td class="p-4">
									<span class="text-sm md:text-base">{staff.name}</span>
								</td>
								<td class="p-4">
									<span
										class={`inline-flex min-w-[80px] items-center justify-center rounded-full px-3 py-1 text-center text-xs md:text-sm ${
											staff.role === 'Admin'
												? 'bg-[#f5efd7] font-medium text-[#8B6914]'
												: 'bg-[#DEE9FC] font-medium text-[#263FA9]'
										}`}
									>
										{staff.role}
									</span>
								</td>
								<td class="p-4">
									<div class="flex justify-end gap-2">
										<Button
											onClick={() => declineStaff(staff)}
											className="w-[90px] cursor-pointer rounded-[10px] border px-3 py-1 text-xs text-[#DF4D60] hover:rounded-[10px] hover:bg-[#fae3e6] hover:text-[#DF4D60] md:text-sm"
											label="Decline"
										/>

										<Button
											onClick={() => acceptStaff(staff)}
											className="w-[90px] cursor-pointer rounded-lg bg-[#DF4D60] px-3 py-1 font-['Popins',_sans-serif] text-xs text-white hover:bg-[#dc3c51] md:text-sm"
											label="Accept"
										/>
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
									<span
										class="inline-flex min-w-[80px] items-center justify-center rounded-full px-3 py-1 text-center text-xs md:text-sm {staff.role ===
										'Admin'
											? 'bg-[#f5efd7] font-medium text-[#8B6914]'
											: 'bg-[#DEE9FC] font-medium text-[#263FA9]'}"
									>
										{staff.role}
									</span>
								</td>
								<td class="p-4">
									<div class="relative flex justify-end">
										<Button
											onClick={() => toggleDropdown(index)}
											className="rounded p-1 hover:bg-gray-100"
											icon="fa-solid fa-bars h-5 w-5"
										/>

										{#if activeDropdownIndex === index}
											<div
												class="absolute right-0 top-8 z-10 w-36 w-[110px] rounded-lg border border-[#DF4D60] bg-white py-2 font-['popins',_sans-serif] text-xs text-[#DF4D60] hover:bg-[#fae3e6]"
											>
												<Button
													onClick={() => removeStaff(staff)}
													className="w-full px-4 py-2 text-left"
													label="Remove Staff"
												/>
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
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-md">
		<div class="border-1 mx-4 w-full max-w-md rounded-lg border-solid border-gray-400 bg-white p-6">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-medium">Invite Staff</h3>
				<button
					aria-label="Close"
					onclick={closeInviteModal}
					class="text-gray-500 hover:text-gray-700"
				>
					<i class="fas fa-times"></i>
				</button>
			</div>

			<form action="?/inviteStaff" method="POST" class="space-y-4" use:enhance>
				<div>
					<label for="staffName" class="mb-1 block text-sm font-medium text-gray-700">Name</label>
					<input
						type="text"
						id="staffName"
						name="name"
						bind:value={newStaffName}
						class="w-full rounded-md border border-gray-400 px-3 py-2"
						required
					/>
				</div>

				<div>
					<label for="staffEmail" class="mb-1 block text-sm font-medium text-gray-700">Email</label>
					<input
						type="email"
						id="staffEmail"
						name="email"
						bind:value={newStaffEmail}
						class="w-full rounded-md border border-gray-400 px-3 py-2"
						required
					/>
				</div>

				<div>
					<label for="staffPhone" class="mb-1 block text-sm font-medium text-gray-700">Phone</label>
					<input
						type="tel"
						id="staffPhone"
						name="phone"
						bind:value={newStaffPhone}
						class="w-full rounded-md border border-gray-400 px-3 py-2"
						required
					/>
				</div>

				<div>
					<label for="staffRole" class="mb-1 block text-sm font-medium text-gray-700">Role</label>
					<select
						id="staffRole"
						name="role"
						bind:value={newStaffRole}
						class="w-full rounded-md border border-gray-400 px-3 py-2"
					>
						<option value="Scanner">Scanner</option>
						<option value="Admin">Admin</option>
					</select>
				</div>

				<div class="flex justify-end space-x-2 pt-4">
					<button
						type="button"
						onclick={closeInviteModal}
						class="rounded-md border border-gray-300 px-4 py-2 text-sm"
					>
						Cancel
					</button>
					<button type="submit" class="rounded-md bg-red-500 px-4 py-2 text-sm text-white">
						Invite
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
