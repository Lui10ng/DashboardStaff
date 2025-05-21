<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { pendingStaffMembers } from '$lib/types/dataList';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import { fly } from 'svelte/transition';
	import { staffDrawer } from '$lib/stores/state.svelte.ts';
	import type { PageData, Actions, PageServerLoad } from './$types';
	import type { Staff } from '$lib/types/staff';
	import { getContext } from 'svelte';
	import { PUBLIC_PAYLOAD_API_URL } from '$env/static/public';
	import { invalidate } from '$app/navigation';
	import { error, fail } from '@sveltejs/kit';
	
	let actionError: string | null = null;
	let selectedRoles = $state<string[]>(['check-in-staff']);
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
	let submitError = $state('');
	let isSubmitting = $state(false);
	const { data } = $props<{ data: PageData }>();

let scannerName = $state(
  (data && data.currentEvent && data.currentEvent.title)
    ? data.currentEvent.title
    : ''
);

if (!data) {
  console.error('No data prop found!');
} else if (!data.currentEventvent) {
  console.error('No event found in data:', data);
} else if (!data.currentEvent.title) {
  console.error('No event title found in data.currentEvent:', data.currentEvent);
}
	let qrScannerLink = $state('https://veent.co/scanner/');
	let selectedAttendanceType = $state('');
	let showOthersInput = $state(false);
	let otherAttendanceValue = $state('');
	let showCopyPopup = $state(false);
	const drawerState = $derived(staffDrawer.open);
	let staffMembersStore = $state<Staff[]>(data.staffMembers || []);
	let newStaffRole = $state('check-in-staff');


	export const load: PageServerLoad = async ({ fetch, params }) => {
    try {
        // Fetch users
        const usersResponse = await fetch(`${PUBLIC_PAYLOAD_API_URL}/api/users`, {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!usersResponse.ok) {
            throw error(usersResponse.status, 'Failed to fetch users');
        }

        const usersData = await usersResponse.json();

        // Transform users data
        const staffMembers = usersData.docs.map(user => ({
    id: user.id,
    name: user.name || 'N/A',
    email: user.email || 'N/A',
    clerkId: user.clerkId,
    clerkRoles: user.clerkRoles || [],
    userStatus: user.userStatus || 'active',
    phone: user.phone || '',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    loginAttempts: user.loginAttempts || 0
}));

        // Get event data
        const eventResponse = await fetch(`${PUBLIC_PAYLOAD_API_URL}/api/events/${params.eventId}`, {
            credentials: 'include'
        });

        if (!eventResponse.ok) {
            throw error(eventResponse.status, 'Failed to fetch event');
        }

        const eventData = await eventResponse.json();

        // Separate active and pending staff
        const activeStaff = staffMembers.filter(staff => staff.userStatus === 'active');
        const pendingStaff = staffMembers.filter(staff => staff.userStatus === 'pending');

        return {
            staffMembers: activeStaff,
            pendingStaff: pendingStaff,
            event: {
                title: eventData.title || '',
                websiteUrl: eventData.websiteUrl || ''
            }
        };

    } catch (err) {
        console.error('Load function error:', err);
        throw error(500, err instanceof Error ? err.message : 'Failed to load data');
    }
};

	function navigateTo(path: string) {
		if (path) {
			window.location.href = path;
		} else {
			console.log('No link assigned yet.');
		}
	}


	$effect(() => {
        if (data?.staffMembers) {
            staffMembersStore = data.staffMembers;
        }
        if (!scannerName && data?.event?.title) {
			scannerName = data.currentEvent.title;
		}
    });

	async function handleRemoveStaff(staff: Staff) {
        if (!confirm('Are you sure you want to remove this staff member?')) {
            return;
        }

        const form = new FormData();
        form.append('userId', String(staff.id));

        const response = await fetch(`?/removeStaff`, {
            method: 'POST',
            body: form
        });

        const result = await response.json();

        if (result.success) {
            // Remove from local state
            staffMembersStore = staffMembersStore.filter(s => s.id !== staff.id);
            activeDropdownIndex = null;
            actionError = null;
        } else {
            actionError = result.message || 'Failed to remove staff member';
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
		selectedRoles = ['check-in-staff'];
	}

	function validateEmail(email: string): boolean {
    // Simpler email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}



	function toggleDropdown(index: number) {
		activeDropdownIndex = activeDropdownIndex === index ? null : index;
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
		window.location.href = `/1/staff`;
	}

	function copyLink() {
    if (data.currentEvent?.websiteUrl) {
        navigator.clipboard
            .writeText(data.currentEvent.websiteUrl)
            .then(() => {
                showCopyPopup = true;
                setTimeout(() => {
                    showCopyPopup = false;
                }, 2000);
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    }
}

	function handleClosePopup() {
		showCopyPopup = false;
	}

	const handleOpenDrawer = () => {
		return (staffDrawer.open = true);
	};

	const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'organizer', label: 'Organizer' },
    { value: 'attendee', label: 'Attendee' },
    { value: 'check-in-staff', label: 'Check-in Staff' }
];

</script>

{#if data.debugRoles}
    <pre>{JSON.stringify(data.debugRoles, null, 2)}</pre>
{/if}
{#if data.debugUsers}
    <pre>{JSON.stringify(data.debugUsers, null, 2)}</pre>
{/if}

<div class="min-h-screen bg-white" in:fly={{ y: -50, duration: 200 }}>
	<main class="container pb-6">
		<hr class="my-6 w-full border-t border-gray-200" />
		<div class="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border-b border-gray-200">
			<div class="mb-4 md:mb-0">
				<h2 class="text-xl font-bold">Staff List</h2>
				<p class="text-gray-600 text-sm">Your Staff History</p>
			</div>
			<div class="flex flex-col gap-2 sm:flex-row sm:gap-4 w-full sm:w-auto">
				<button
					class="flex w-full sm:w-auto h-10 cursor-pointer items-center justify-center space-x-2 rounded-lg border border-[#DF4D60] px-4 py-2 font-sans text-[#DF4D60] hover:bg-[#fae3e6]"
					onclick={() => isModalOpen = true}
				>
					<i class="fa-solid fa-qrcode h-4 w-4"></i>
					<span>Edit Scanner</span>
				</button>
				<button
					class="flex w-full sm:w-auto h-10 cursor-pointer items-center justify-center space-x-2 rounded-lg bg-[#DF4D60] px-4 py-2 font-sans text-white hover:bg-[#dc3c51]"
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
						<th class="blacktext p-4 font-medium">Email</th>
						<th class="blacktext p-4 font-medium">Role</th>
						<th class="blacktext p-4 font-medium text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each staffMembersStore as staff, index}
						<tr class="border-b border-gray-200">
							<td class="p-4">
								<span class="text-sm md:text-base">{staff.name}</span>
							</td>
							<td class="p-4">
								<span class="text-sm md:text-base">{staff.email}</span>
							</td>
							<td class="p-4">
								<div class="flex flex-wrap gap-2">
									{#each staff.clerkRoles as role}
										<span class={`inline-flex min-w-[80px] items-center justify-center rounded-full px-3 py-1 text-center text-xs md:text-sm ${
											role === 'admin'
												? 'bg-[#f5efd7] font-medium text-[#8B6914]'
												: role === 'check-in-staff'
												? 'bg-[#DEE9FC] font-medium text-[#263FA9]'
												: role === 'organizer'
												? 'bg-[#E3FCE3] font-medium text-[#166534]'
												: 'bg-[#F3E8FF] font-medium text-[#6B21A8]'
										}`}>
											{role === 'admin' 
												? 'Admin' 
												: role === 'check-in-staff'
												? 'Check-in Staff'
												: role === 'organizer'
												? 'Organizer'
												: 'Attendee'}
										</span>
									{/each}
								</div>
							</td>
							<td class="p-4">
								<div class="relative flex justify-end">
									<Button
										onClick={() => toggleDropdown(index)}
										className="rounded p-1 hover:bg-gray-100"
										icon="fa-solid fa-bars h-5 w-5"
									/>
									{#if activeDropdownIndex === index}
										<div class="absolute right-0 top-8 z-10 w-36 rounded-lg border border-[#DF4D60] bg-white py-2 text-xs">
											<form
												action="?/removeStaff"
												method="POST"
												use:enhance={() => {
													return async ({ result }) => {
														if (result.type === 'success') {
															staffMembersStore = staffMembersStore.filter(s => s.id !== staff.id);
															activeDropdownIndex = null;
															await invalidate('app:staffMembers');
														} else if (result.type === 'error') {
															actionError = result.error?.message || 'Failed to remove staff member';
														}
													};
												}}
											>
												<input type="hidden" name="userId" value={staff.id} />
												<button
													type="submit"
													class="w-full px-4 py-2 text-left text-[#DF4D60] hover:bg-[#fae3e6]"
													onclick={(e) => {
														if (!confirm('Are you sure you want to remove this staff member?')) {
															e.preventDefault();
														}
													}}
												>
													Remove Staff
												</button>
											</form>
										</div>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
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

			<form 
    action="?/inviteStaff"
    method="POST"
    use:enhance={() => {
        isSubmitting = true;
        return async ({ result }) => {
            isSubmitting = false;
            
            if (result.type === 'success') {
                const newStaff = {
                    id: result.data.id,
                    name: result.data.name,
                    email: result.data.email,
                    clerkId: result.data.clerkId,
                    clerkRoles: result.data.clerkRoles,
                    userStatus: 'active',
                    phone: result.data.phone || '',
                    createdAt: result.data.createdAt,
                    updatedAt: result.data.updatedAt,
                    loginAttempts: result.data.loginAttempts || 0
                };
                staffMembersStore = [...staffMembersStore, newStaff];
                closeInviteModal();
                await invalidate('app:staffMembers');
                window.location.reload();
            } else {
                submitError = result.error?.message || 'Failed to invite staff member';
            }
        };
    }}
    class="space-y-4"
	onsubmit={(e) => {
        // Validate that at least one role is selected
        if (selectedRoles.length === 0) {
            e.preventDefault();
            submitError = 'Please select at least one role';
            return;
        }
        submitError = ''; // Clear any previous errors
    }}
>
				{#if submitError}
					<div class="rounded-md bg-red-50 p-4">
						<div class="flex">
							<div class="flex-shrink-0">
								<i class="fas fa-exclamation-circle text-red-400"></i>
							</div>
							<div class="ml-3">
								<p class="text-sm text-red-700">{submitError}</p>
							</div>
						</div>
					</div>
				{/if}
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
						placeholder="example@domain.com"
						required
					/>
				</div>

				<div>
					<label for="staffPhone" class="mb-1 block text-sm font-medium text-gray-700">Phone (Optional)</label>
					<input
						type="tel"
						id="staffPhone"
						name="phone"
						bind:value={newStaffPhone}
						class="w-full rounded-md border border-gray-400 px-3 py-2"
					/>
				</div>

				<!-- Replace the existing role select with this -->
<!-- Replace the role selection div with this updated version -->
<div>
	<label class="mb-1 block text-sm font-medium text-gray-700">Roles</label>
	<div class="space-y-2">
		{#each roleOptions as option}
			<label class="flex items-center space-x-2">
				<input
					type="checkbox"
					name="roles"
					value={option.value}
					checked={selectedRoles.includes(option.value)}
					onchange={(e) => {
						if (e.currentTarget.checked) {
							selectedRoles = [...selectedRoles, option.value];
						} else {
							selectedRoles = selectedRoles.filter(role => role !== option.value);
						}
					}}
					class="rounded border-gray-300 text-red-500 focus:ring-red-500"
				/>
				<span class="text-sm text-gray-700">{option.label}</span>
			</label>
		{/each}
	</div>
	{#if selectedRoles.length === 0}
            <p class="mt-1 text-xs text-red-500">Please select at least one role</p>
        {/if}
</div>

				<div class="flex justify-end space-x-2 pt-4">
					<button
						type="button"
						onclick={closeInviteModal}
						class="rounded-md border border-gray-300 px-4 py-2 text-sm"
						disabled={isSubmitting}
					>
						Cancel
					</button>
					<button 
						type="submit" 
						class="rounded-md bg-red-500 px-4 py-2 text-sm text-white"
						disabled={isSubmitting || selectedRoles.length === 0}
					>
						{isSubmitting ? 'Inviting...' : 'Invite'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<Drawer 
  isOpen={isModalOpen}
  positionIn="translate-x-0"
  positionOut="translate-x-full"
  contentBaseClass="fixed right-0 top-0 w-full max-w-lg bg-white shadow-xl h-full sm:rounded-l-xl sm:max-w-lg"
  justify="end"
  alignment="center"
>
    <div class="p-6">
        <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-bold">Edit Scanner</h2>
           
        </div>

		

        <div class="space-y-4">
            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Scanner Name</label>
                <input
			type="text"
			bind:value={scannerName}
			class="w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-sm"
			/>
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">QR Scanner Link</label>
                <input
                    type="text"
                    bind:value={qrScannerLink}
                    class="w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-sm"
                />
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Attendance Type</label>
                <div class="grid grid-cols-2 gap-2">
                   
                    <button
                        class={`rounded-md p-2 text-sm ${
                            selectedAttendanceType === 'In/Out'
                                ? 'bg-[#DF4D60] text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                        onclick={() => selectAttendanceType('In/Out')}
                    >
                        In/Out
                    </button>
                    <button
                        class={`rounded-md p-2 text-sm ${
                            selectedAttendanceType === 'On Duty'
                                ? 'bg-[#DF4D60] text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                        onclick={() => selectAttendanceType('On Duty')}
                    >
                        On Duty
                    </button>
					<button
                        class={`rounded-md p-2 text-sm ${
                            selectedAttendanceType === 'Training'
                                ? 'bg-[#DF4D60] text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                        onclick={() => selectAttendanceType('Training')}
                    >
                        Training
                    </button>
					<button
                        class={`rounded-md p-2 text-sm ${
                            selectedAttendanceType === 'Approved'
                                ? 'bg-[#DF4D60] text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                        onclick={() => selectAttendanceType('Approved')}
                    >
                        Approved
                    </button>
					<button
                        class={`rounded-md p-2 text-sm ${
                            selectedAttendanceType === 'Present'
                                ? 'bg-[#DF4D60] text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                        onclick={() => selectAttendanceType('Present')}
                    >
                        Present
                    </button>
					
					<button
                        class={`rounded-md p-2 text-sm ${
                            selectedAttendanceType === 'Others'
                                ? 'bg-[#DF4D60] text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                        onclick={() => selectAttendanceType('Others')}
                    >
                        Others
                    </button>
                </div>
            </div>

            {#if showOthersInput}
  <div>
    <label for="otherAttendance" class="mb-2 block text-sm font-medium text-gray-700">Others</label>
    <input
      id="otherAttendance"
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
</Drawer>