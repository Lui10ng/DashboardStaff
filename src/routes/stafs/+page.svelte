<script lang="ts">
    import { AppShell } from '@skeletonlabs/skeleton';

    let searchQuery = '';
    let staffFilter = 'All Staffs';
    let timeFilter = 'Time Registered';

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
      url: 'https://techtalks2024.veent.co',
      stats: {
        guests: 250,
        income: 32550
      }
    };

    //  Active Staff Members (Approved Staff)
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
</script>

<AppShell>
      <!-- Header -->
      <header class="bg-primary text-black p-4 shadow-md">
        <div class="container mx-auto flex flex-wrap justify-between items-center">
      
          <!-- Left Section: Logo and Navigation -->
          <div class="flex items-center space-x-6 md:space-x-12">
            <img src="/logo/Veent-red-logo.png" alt="Veent Logo" class="h-6.6 w-12">
      
            <div class="flex items-center space-x-6 md:space-x-7">
              <div class="flex items-center space-x-2">
                <img src="/icons/home-icon.png" alt="Home Icon" class="h-5 w-5">
                <a href="tech.html" class="text-sm font-bold text-red-500">Home</a>
              </div>
              <div class="flex items-center space-x-2">
                <img src="/icons/wallet-icon.png" alt="Wallet Icon" class="h-4 w-4">
                <a href="talks.html" class="text-sm font-bold text-black">Wallet</a>
              </div>
            </div>
          </div>
      
          <!-- Right Section: Search, Notifications, Profile -->
          <div class="flex items-center space-x-4 sm:space-x-6 mt-4 sm:mt-0">
            <a href="/search" aria-label="Search">
              <img src="/icons/search-icon.png" alt="Search-Icon" class="h-5 w-5 cursor-pointer">
            </a>
            <a href="/notifications" aria-label="Notifications">
              <img src="/icons/notification-icon.png" alt="Notification-Icon" class="h-5 w-5 cursor-pointer">
            </a>
            <a href="/profile" aria-label="User Profile">
              <img src="/Group 9968.png" alt="Profile-Icon" class="h-8 w-8 cursor-pointer">
            </a>
          </div>
      
        </div>
      </header>
      
  
  <main class="container mx-auto p-4">

    <!-- Events Title with Icon -->
    <div class="flex items-center space-x-2 mb-4">
        <h2 class="text-lg font-bold">Events</h2>
        <img src="/icons/Arrow-icon.png" alt="Arrow-Icon" class="h-5 w-5">
    </div>

    <!-- Staff List -->
    <div class="space-y-4">
        
<!-- Event Header -->
<div class="card p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="col-span-2 pr-12 p-4 space-y-2 bg-white rounded-lg flex items-start gap-x-6"> 

        <!-- Event Image -->
        <img src="/event-photo.png" alt="Event" class="h-40 w-40 rounded-lg object-cover">
    
        <!-- Event Details (Title, Date, Location, URL) -->
        <div class="space-y-2">
            <h2 class="text-3xl font-bold">{event.title}</h2>
            <div class="flex flex-col space-y-2">
                <span class="flex items-center space-x-2">
                    <img src="/icons/date-icon.png" alt="Calendar" class="h-6 w-6">
                    <span>{event.date}</span>
                </span>
                <span class="flex items-center space-x-2">
                    <img src="/icons/pin-icon.png" alt="Location" class="h-6 w-6">
                    <span>{event.location}</span>
                </span>
                <span class="flex items-center space-x-2">
                    <img src="/icons/Copy-icon.png" alt="Link" class="h-6 w-6">
                    <a href={event.url} class="anchor bg-gray-100">{event.url}</a>
                </span>
            </div>
        </div>
    </div>
    <div class="relative p-4 bg-white rounded-lg">
        <button class="absolute top-4 left-4 bg-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md hover:bg-red-600 transition cursor-pointer">
            <img src="/icons/add-date-icon.png" alt="AddCalendar" class="h-6 w-6">
            Add to Calendar
        </button>
    </div>
</div>

<!-- Navigation Tabs Added Below Event Section -->
<div class="card p-4 mb-8 mt-4">
    <div class="flex flex-wrap justify-center gap-4">
      <button class="w-full sm:w-auto px-10 py-2 border border-gray-300 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer" 
        on:click={() => navigateTo('')}>
        Registrants
      </button>
      <button class="w-full sm:w-auto px-10 py-2 border border-gray-300 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer" 
        on:click={() => navigateTo('')}>
        Posts
      </button>
      <button class="w-full sm:w-auto px-10 py-2 border border-gray-300 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer" 
        on:click={() => navigateTo('')}>
        Emails
      </button>
      <button class="w-full sm:w-auto px-10 py-2 border border-gray-300 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer" 
        on:click={() => window.location.href = '/Registration instruction'}>
        Form
      </button>
      <button class="w-full sm:w-auto px-10 py-2 border border-gray-300 rounded-lg bg-red-500 text-white cursor-pointer hover:bg-red-600" 
        on:click={() => window.location.href = '/stafs'}>
        Staffs
      </button>
      <button class="w-full sm:w-auto px-10 py-2 border border-gray-300 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer" 
        on:click={() => navigateTo('')}>
        Emails
      </button>
    </div>
  </div>
  

<!-- "Staff Management" Title -->
<h2 class="text-2xl font-bold mt-8">Management Staff</h2>

<!-- Search Bar & Invite Staff Button Row -->
<div class="flex justify-between items-center mt-4 p-4 bg-white rounded-lg">

    <!-- Search Bar -->
    <div class="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-1/2">
        <img src="/icons/search-icon.png" alt="Search" class="h-5 w-5 mr-2">
        <input 
            type="text" 
            placeholder="Search staff..." 
            bind:value={searchQuery} 
            class="w-full outline-none">
    </div>

    <!-- Invite Staff Button -->
    <button class="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-red-600 transition">
        <img src="/icons/invite-icon.png" alt="Invite" class="h-5 w-5">
        Invite Staff
    </button>
</div>

<!-- Dropdown Buttons Row -->
<div class="flex justify-between items-center mt-2 p-4 bg-white rounded-lg">

    <!-- "All Staffs" Dropdown -->
    <div class="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-1/3">
        <img src="/icons/filter-icon.png" alt="Staff Icon" class="h-4 w-4 mr-2">
        <select bind:value={staffFilter} class="w-full outline-none bg-transparent">
            <option>All Staffs</option>
            <option>Admins</option>
            <option>Scanners</option>
        </select>
    </div>

    <!-- "Time Registered" Dropdown -->
    <div class="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-1/3">
        <img src="/icons/sort-icon.png" alt="TimeRegistered" class="h-5 w-5 mr-2">
        <select bind:value={timeFilter} class="w-full outline-none bg-transparent">
            <option>Time Registered</option>
            <option>Newest</option>
            <option>Oldest</option>
        </select>
    </div>
</div>

        <!-- Pending Staff Approvals Table -->
        <div class="space-y-4 mt-8">
            {#each pendingStaffMembers as staff}
            <div class="p-4 border rounded-lg shadow flex justify-between items-center">

                <!-- Left Section: Name, Role, Email, Phone -->
                <div>
                    <div class="flex items-center space-x-2">
                        <h3 class="font-semibold">{staff.name}</h3>
                        <span class="px-3 py-1 rounded-lg text-sm text-white {staff.role === 'Admin' ? 'bg-yellow-500' : 'bg-blue-500'}">
                            {staff.role}
                        </span>
                    </div>
                    <div class="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{staff.email}</span>
                        <span>|</span>
                        <span>{staff.phone}</span>
                    </div>
                </div>

                <!-- Accept & Decline Buttons -->
                <div class="flex items-center space-x-4">
                    <button class="bg-white text-red-500 border border-red-500 px-4 py-2 rounded-lg shadow-md hover:bg-red-600 hover:text-white hover:border-red-600 transition cursor-pointer">
                        Decline
                    </button>                    
                    <button class="bg-red-500 text-white border border-white px-4 py-2 rounded-lg shadow-md hover:bg-white hover:text-red-500 hover:border-white transition cursor-pointer">
                        Accept
                    </button>  
                </div>
            </div>
            {/each}
        </div>
        <hr class="border-t border-gray-300 my-5">

<!-- Staff List -->
<div class="space-y-4">
    {#each staffMembers as staff}
    <div class="p-4 border rounded-lg shadow flex justify-between items-center">

        <!-- Left Section: Name, Role, Email, Phone -->
        <div>

            <!-- Name and Role in the Same Row -->
            <div class="flex items-center space-x-2">
                <h3 class="font-semibold">{staff.name}</h3>
                <span class="px-3 py-1 rounded-lg text-sm text-white {staff.role === 'Admin' ? 'bg-yellow-500' : 'bg-blue-500'}">
                    {staff.role}
                </span>
            </div>

            <!-- Email and Phone in the Same Row -->
            <div class="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span>{staff.email}</span>
                <span>|</span>
                <span>{staff.phone}</span>
            </div>
        </div>

        <!-- Status and Ellipsis -->
        <div class="flex items-center space-x-4">
            <span class="text-gray-500">{staff.status}</span>
            <button class="text-gray-500 hover:text-black">
                <i class="fas fa-ellipsis-v"></i> <!-- Ellipsis Icon -->
            </button>
        </div>
    </div>
    {/each}
</div>
</main>
</AppShell>
