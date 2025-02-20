<script lang="ts">
  let searchQuery = '';
  let staffFilter = 'All Staffs';
  let timeFilter = 'Time Registered';
  let isModalOpen = false;
  let selectedImage: string | null = null;
  let fileInput: HTMLInputElement | null = null;
  import { X } from 'lucide-svelte';

  function navigateTo(path: string) {
      if (path) {
          window.location.href = path;
      } else {
          console.log('No link assigned yet.');
      }
  }

  const event = {
      title: 'Tech Talks 2024',
      date: 'April 16-18, 2024 | 8:00 AM - 6:00 PM',
      location: 'USTP Gymnasium, Cagayan de Oro City',
      url: 'https://bolt.new/?rid=j725i7',
      stats: {
          guests: 250,
          income: 32550
      }
  };

  // Active Staff Members (Approved Staff)
  const staffMembers = [
      { name: 'Danielle Bradberry', role: 'Admin', email: 'danielle@veent.io', phone: '0965 879 9086', status: 'active' },
      { name: 'Bella de Leon', role: 'Scanner', email: 'bdl23@gmail.com', phone: '0965 879 9086', status: 'active' },
      { name: 'Ashby Santoso', role: 'Scanner', email: 'ashby@gmail.com', phone: '0965 879 9086', status: 'active' },
  ];

  // Pending Staff Members (Awaiting Approval)
  const pendingStaffMembers = [
      { name: 'Ericke Gallardo', role: 'Scanner', email: 'ericke@veent.io', phone: '0965 879 9086' },
      { name: 'Aaron Dhave Tagolimot', role: 'Admin', email: 'aaron@gmail.com', phone: '0965 879 9086' },
      { name: 'Macky Quentino', role: 'Scanner', email: 'mqent@gmail.com', phone: '0965 879 9086' },
      { name: 'Scarlet Apostol', role: 'Scanner', email: 'scarlet2@gmail.com', phone: '0965 879 9086' }
  ];

  function removeImage(event: Event) {
    event.stopPropagation(); // Prevents any unintended click events
    selectedImage = null; // Remove the selected image
    if (fileInput) {
      fileInput.value = ""; // Reset the file input field
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
  <header class="shadow-sm">
      <div class="container mx-auto px-4 py-3">
          <div class="flex justify-between items-center">
              <!-- Left Section -->
              <div class="flex items-center space-x-8">
                <img src="/logo/Veent-red-logo.png" alt="Veent Logo" class="h-6.6 w-12 cursor-pointer">
                  <nav class="hidden md:flex space-x-6">
                      <a href="#" class="flex items-center space-x-2 text-red-500">
                        <img src="/icons/home-icon.png" alt="Home Icon" class="h-5 w-5">
                          <span class="font-medium">Home</span>
                      </a>
                      <a href="#" class="flex items-center space-x-2 text-gray-600">
                        <img src="/icons/wallet-icon.png" alt="Wallet Icon" class="h-4 w-4">
                          <span class="font-medium">Wallet</span>
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
      <div class="relative rounded-lg p-6">

        <div class="flex justify-end md:justify-end absolute top-auto right-4 md:right-16 lg:right-36">
          <button 
              on:click={() => isModalOpen = true} 
              class="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity duration-200 px-4 py-2">
              
              <span class="text-red-500 font-medium text-sm md:text-base">Edit Event</span>
              <img src="/icons/edit-icon.png" alt="Edit" class="h-6 w-auto md:h-7">
              
          </button>
      </div>
      

      {#if isModalOpen}
      <div class="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 overflow-auto">
          <div class="bg-white border rounded-lg w-full max-w-4xl min-h-[50vh] max-h-[70vh] flex flex-col overflow-auto">
    
            <!-- Modal Header -->
            <div class="flex flex-wrap gap-4 p-4 mt-3 justify-start self-start w-full overflow-visible">
              
              <button class="bg-white hover:bg-red-500 hover:text-white text-black font-semibold py-2 px-4 rounded-md transition-colors sm:w-auto border border-gray-400 cursor-pointer h-10 text-xs">
                Edit Details
              </button>
              <button class="bg-white hover:bg-red-500 hover:text-white text-black font-semibold py-2 px-4 rounded-md transition-colors sm:w-auto border border-gray-400 cursor-pointer h-10 text-xs"on:click={() => window.location.href = '/visualizer'}>
                Visual
              </button>
              <button class="bg-white hover:bg-red-500 hover:text-white text-black font-semibold py-2 px-4 rounded-md transition-colors sm:w-auto border border-gray-400 cursor-pointer h-10 text-xs">
                Contacts
              </button>
              <button class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors sm:w-auto border-2 cursor-pointer h-10 text-xs">
                Registration Instructions
              </button>
            </div>
    
            <!-- Modal Content -->
            <div class="p-6 overflow-y-auto max-h-[50vh]">
              <h2 class="text-xl font-semibold mb-4">Registration instruction</h2>
              <p class="text-gray-600 mb-4">
                Edit your registration instruction below. Changes update automatically on your website.
              </p>
    
              <div class="flex gap-8">
                <!-- Left Column - Heading and Images -->
                <div class="w-1/3 space-y-6">
                  <div>
                    <h3 class="font-medium mb-2">Heading</h3>
                    <input type="text" placeholder="Add heading" class="w-full p-2 rounded-lg bg-gray-50" />
                  </div>
    
                  <div>
                    <h3 class="font-medium mb-2">Image</h3>
    
                  {#if selectedImage}
                    <div class="relative w-full">
                      <img src={selectedImage} alt="Uploaded Image" class="w-full h-auto rounded-lg" />
                      <!-- Remove Button (Placed Outside the Label) -->
                      <button on:click={removeImage} class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">
                        <X size={16} />
                      </button>
                    </div>
                  {:else}
                    <label class="rounded-lg p-8 text-center bg-gray-50 cursor-pointer block" for="imageUpload">
                      <p class="text-gray-500">Select image</p>
                    </label>
                  {/if}
    
                  <input bind:this={fileInput} id="imageUpload" type="file" accept="image/*" class="hidden" on:change={handleFileUpload} />
                </div>
              </div>
    
                <!-- Right Column - Rich Text Editor -->
                <div class="md:w-2/3 w-full">
                  <div class="border rounded-lg overflow-hidden">
                    <!-- Toolbar -->
                    <div class="flex items-center gap-2 p-2 border-b bg-gray-50">
                      <select class="border rounded px-2 py-1 text-sm">
                        <option>Normal</option>
                      </select>
                      <select class="border rounded px-2 py-1 text-sm">
                        <option>Sans Serif</option>
                      </select>
                      <div class="flex items-center gap-1 border-l pl-2">
                        <button class="p-1 hover:bg-gray-200 rounded">B</button>
                        <button class="p-1 hover:bg-gray-200 rounded">I</button>
                        <button class="p-1 hover:bg-gray-200 rounded">U</button>
                        <button class="p-1 hover:bg-gray-200 rounded">
                          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 6h16M4 12h16M4 18h16"></path>
                          </svg>
                        </button>
                        <button class="p-1 hover:bg-gray-200 rounded">
                          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4"></path>
                            <path d="M14 2h6v6"></path>
                            <path d="M20 2L10 12"></path>
                          </svg>
                        </button>
                        <button class="p-1 hover:bg-gray-200 rounded">
                          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <!-- Editor Content -->
                    <div class="p-4 min-h-[125px] bg-white">
                      <textarea class="w-full min-h-[125px] p-4 bg-white rounded-lg resize-none" placeholder="Add text here..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    
            <!-- Modal Footer -->
            <div class="flex justify-end gap-3 p-4 ">
              <button
                on:click={() => isModalOpen = false}
                class="px-4 py-2 text-gray-600 hover:text-gray-800 border-gray-200 border-1 rounded"
              >
                Cancel
              </button>
              <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Save changes
              </button>
            </div>
          </div>
        </div>
      {/if}
          <div class="flex space-x-6">
            <img src="/event-photo.png" alt="Event" class="h-40 w-40 rounded-lg object-cover">
              <div class="space-y-3">
                  <h1 class="text-2xl font-bold">{event.title}</h1>
                  <div class="space-y-2 text-gray-600">
                      <p class="flex items-center space-x-2">
                        <img src="/icons/date-icon.png" alt="Calendar" class="h-6 w-6">
                          <span>{event.date}</span>
                      </p>
                      <p class="flex items-center space-x-2">
                        <img src="/icons/pin-icon.png" alt="Location" class="h-6 w-6">
                          <span>{event.location}</span>
                      </p>
                      <p class="flex items-center space-x-2">
                          <img src="/icons/Copy-icon.png" alt="Link" class="h-6 w-6">
                          <a href={event.url} class="text-gray-400 bg-gray-200">{event.url}</a>
                      </p>
                  </div>
              </div>
          </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex space-x-4 mb-6 ml-6">
          {#each ['Registrants', 'Posts', 'Form', 'Merchant', 'Emails', 'Staff'] as tab}
              <button
                  on:click={() => navigateTo('')}
                  class="px-6 py-2 rounded-lg font-medium transition-colors {tab === 'Staff' ? 'bg-red-500 text-white' : 'border border-gray-300 text-gray-700 hover:bg-red-500 hover:text-white'}"
              >
                  {tab}
              </button>
          {/each}
          
      </div>

            <!--between staff mangement section and navigation bar-->
            <hr class="w-300 border-t border-gray-300 ml-6">

      <!-- Staff Management Section -->
      <div class=" rounded-lg p-6">
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
          <div class="border border-gray-200 rounded-lg overflow-x-auto w-full">
              <div class="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 font-medium text-poppins">
                  <div class="ml-8">Name</div>
                  <div class="ml-8">Role</div>

              </div>

              <!-- Pending Staff -->
              {#each pendingStaffMembers as staff}
                  <div class="grid grid-cols-3 gap-4 p-4  border-gray-200 ml-8 mt-4">
                      <div>{staff.name}</div>
                      <div>
                          <span class="px-3 py-1 mt-4 rounded-full text-sm text-white {staff.role === 'Admin' ? 'bg-yellow-500' : 'bg-blue-500'}">
                              {staff.role}
                          </span>
                      </div>
                      <div class="flex space-x-3 ml-40">
                          <button class="px-4 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-50">
                              Decline
                          </button>
                          <button class="px-8 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600">
                              Accept
                          </button>
                      </div>
                  </div>
              {/each}
              

              <!-- Active Staff -->
              {#each staffMembers as staff}
              <div class="grid grid-cols-3 gap-4 p-4 border-gray-200 ml-8 mt-4">
                <div>{staff.name}</div>
                <div>
                    <span class="px-3 py-1 mt-4 rounded-full text-sm text-white {staff.role === 'Admin' ? 'bg-yellow-500' : 'bg-blue-500'}">
                        {staff.role}
                    </span>
                </div>
                <div class="flex justify-end items-center pr-4"> 
                    <!-- Aligns the button to the right -->
                    <button class="p-1 hover:bg-gray-100 rounded ml-80">
                        <img src="/icons/menu-dots-icon.png" alt="More Options" class="h-5 w-5 text-gray-500">
                    </button>
                </div>
            </div>
            
              {/each}
              
          </div>
      </div>
  </main>
</div>