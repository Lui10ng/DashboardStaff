<script lang="ts">
  import { X } from 'lucide-svelte';
  import { pendingStaffMembers, staffMembers } from '$lib/types/data/dataList';
  import EventCard from '$lib/components/features/EditEventModal/EventCard.svelte';
  import NavigationTabs from '$lib/components/layout/NavigationTabs.svelte';
  import '../styles/staffTable.css';

  let searchQuery = '';
  let staffFilter = 'All Staffs';
  let timeFilter = 'Time Registered';
  let isModalOpen = false;
  let selectedImage: string | null = null;
  let fileInput: HTMLInputElement | null = null;

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
</script>

<div class="min-h-screen bg-white z-0">


  <div class="container mx-auto px-4 pt-16 pb-6">
    <!-- Event Card -->
    <EventCard />

    <!-- Navigation Tabs -->
    <NavigationTabs {navigateTo} />

    <hr class="w-full border-t border-gray-200 my-6">
    
      <!--Staff Management Section-->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border-b border-gray-200">
        <div class="mb-4 md:mb-0">
          <h2 class="text-xl font-bold">Staff List</h2>
          <p class="text-gray-600 text-sm">Your Staff History</p>
        </div>
        <button class="w-full md:w-auto bg-red-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-600 transition-colors">
          <img src="/staff/icons/new-invite-icon.png" alt="FullList" class="h-5 w-5">
          <span>Invite Staff</span>
        </button>
      </div>

      <!-- Staff Table -->
      <div class="overflow-x-auto mt-4 px-4"> <!-- Added mt-4 and px-4 classes for margin-top and padding -->
        <table class="w-full min-w-[600px]">
          <thead>
            <tr class="text-left border-b border-gray-200">
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
                  <span class="text-sm md:text-base">{staff.name}</span>
                </td>
                <td class="p-4">
                  <span class="inline-block px-3 py-1 text-xs md:text-sm rounded-full text-white {staff.role === 'Admin' ? 'bg-yellow-500' : 'bg-blue-500'}">
                    {staff.role}
                  </span>
                </td>
                <td class="p-4">
                  <div class="flex justify-end gap-2">
                    <button class="text-xs md:text-sm px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50">
                      Decline
                    </button>
                    <button class="text-xs md:text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Accept
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
            
            <!-- Active Staff -->
            {#each staffMembers as staff}
              <tr class="border-b border-gray-200">
                <td class="p-4">
                  <span class="text-sm md:text-base">{staff.name}</span>
                </td>
                <td class="p-4">
                  <span class="inline-block px-3 py-1 text-xs md:text-sm rounded-full text-white {staff.role === 'Admin' ? 'bg-yellow-500' : 'bg-blue-500'}">
                    {staff.role}
                  </span>
                </td>
                <td class="p-4">
                  <div class="flex justify-end">
                    <button class="p-1 hover:bg-gray-100 rounded">
                      <img src="/staff/icons/menu-dots-icon.png" alt="More Options" class="h-5 w-5 text-gray-500">
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
            
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>