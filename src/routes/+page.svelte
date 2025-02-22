<script lang="ts">
  import { X } from 'lucide-svelte';
  import { pendingStaffMembers, staffMembers } from '$lib/data/dataList';
  import EventCard from '$lib/components/EventCard.svelte';
  import NavigationTabs from '$lib/components/NavigationTabs.svelte';
  import '../styles/staffTable.css'; // Corrected import path

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

<div class="min-h-screen">
  <!-- Header -->
  <header class="header">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Left Section -->
        <div class="flex items-center space-x-8">
          <img src="/logo/Veent-red-logo.png" alt="Veent Logo" class="h-6.6 w-12 cursor-pointer">
          <nav class="nav-links">
            <a href="#" class="nav-link text-red-500">
              <img src="/icons/home-icon.png" alt="Home Icon">
              <span>Home</span>
            </a>
            <a href="#" class="nav-link text-gray-600">
              <img src="/icons/wallet-icon.png" alt="Wallet Icon">
              <span>Wallet</span>
            </a>
          </nav>
        </div>

        <!-- Right Section -->
        <div class="flex items-center space-x-4">
          <button class="p-2 hover:bg-gray-100 rounded-full">
            <img src="/icons/search-icon.png" alt="Search Icon" class="h-5 w-5 cursor-pointer">
          </button>
          <button class="p-2 hover:bg-gray-100 rounded-full">
            <img src="/icons/notification-icon.png" alt="Notification-Icon" class="h-5 w-5 cursor-pointer">
          </button>
          <img src="/Group 9968.png" alt="Profile-Icon" class="h-8 w-8 cursor-pointer">
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-6">
    <!-- Event Card -->
    <EventCard {isModalOpen} setIsModalOpen={(value) => isModalOpen = value} />

    <!-- Navigation Tabs -->
    <NavigationTabs {navigateTo} />

    <hr class="w-300 border-t border-gray-300 ml-6">

    <!-- Staff Management Section -->
    <div class="rounded-lg p-6">
      <div class="flex justify-between items-center mb-6 border p-4 border-gray-200 rounded-lg">
        <div>
          <h2 class="text-lg font-bold ml-3">Staff List</h2>
          <p class="text-gray-600 ml-3">Your Staff History</p>
        </div>
        <button class="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition-colors">
          <img src="/icons/new-invite-icon.png" alt="FullList" class="h-5 w-5">
          <span>Invite Staff</span>
        </button>
      </div>

      <!-- Staff Table -->
      <div class="border border-gray-200 rounded-lg">
        <div class="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 font-medium text-poppins">
          <div class="ml-8">Name</div>
          <div class="ml-8">Role</div>
        </div>

        <!-- Pending Staff -->
        {#each pendingStaffMembers as staff}
          <div class="staff-row">
            <div class="staff-name">{staff.name}</div>
            <div class="staff-role">
              <span class="px-3 py-1 mt-4 rounded-full text-sm text-white {staff.role === 'Admin' ? 'bg-yellow-500' : 'bg-blue-500'}">
                {staff.role}
              </span>
            </div>
            <div class="staff-actions">
              <button class="decline">
                Decline
              </button>
              <button class="accept">
                Accept
              </button>
            </div>
          </div>
        {/each}

        <!-- Active Staff -->
        {#each staffMembers as staff}
          <div class="staff-row">
            <div class="staff-name">{staff.name}</div>
            <div class="staff-role">
              <span class="px-3 py-1 mt-4 rounded-full text-sm text-white {staff.role === 'Admin' ? 'bg-yellow-500' : 'bg-blue-500'}">
                {staff.role}
              </span>
            </div>
            <div class="more-options">
              <button class="p-1 hover:bg-gray-100 rounded">
                <img src="/icons/menu-dots-icon.png" alt="More Options" class="h-5 w-5 text-gray-500">
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </main>
</div>