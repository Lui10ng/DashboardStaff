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
    <div class="container mx-auto flex justify-between items-center">
      <!-- Logo and Title -->
      <div class="flex items-center space-x-6">
        <img src="/logo.png" alt="Tech Talks Logo" class="h-10 w-10"> 

        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <img src="/tech-icon.png" alt="Tech Icon" class="h-6 w-6">
            <a href="tech.html" class="text-2xl font-bold text-black">Tech</a>
          </div>

          <div class="flex items-center space-x-2">
            <img src="/talks-icon.png" alt="Talks Icon" class="h-6 w-6">
            <a href="talks.html" class="text-2xl font-bold text-yellow-300">Talks 2024</a>
          </div>
          <div class="flex items-center space-x-2">
            <img src="/talks-icon.png" alt="Talks Icon" class="h-6 w-6">
            <a href="talks.html" class="text-2xl font-bold text-yellow-300">Talks 2024</a>
          </div>
        </div>
      </div>

      <!-- Icons: Search, Notifications, Profile -->
      <div class="flex items-center space-x-6">
        <a href="/search" aria-label="Search">
          <img src="/search-icon.png" alt="Search" class="h-8 w-8 cursor-pointer">
        </a>
        <a href="/notifications" aria-label="Notifications">
          <img src="/bell-icon.png" alt="Notifications" class="h-8 w-8 cursor-pointer">
        </a>
        <a href="/profile" aria-label="User Profile">
          <img src="/profile-icon.png" alt="Profile" class="h-8 w-8 cursor-pointer">
        </a>
      </div>
    </div>
  </header> 
  
  <main class="container mx-auto p-4">
    <!-- Events Title with Icon -->
    <div class="flex items-center space-x-2 mb-4">
        <h2 class="text-2xl font-bold">Events</h2>
        <img src="/event-icon.png" alt="Events Icon" class="h-6 w-6">
    </div>


    <!-- Staff List -->
    <div class="space-y-4">

<!-- Event Header -->
<div class="card p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="col-span-2 pr-12 p-4 space-y-2 bg-white rounded-lg flex items-start space-x- relative border-none">
        <img src="/event-image.jpg" alt="Event Image" class="h-20 w-20 rounded-lg object-cover">
        <div class="space-y-2">
            <h2 class="h2">{event.title}</h2>
            <div class="flex flex-col space-y-2">
                <span class="flex items-center space-x-2">
                    <img src="/calendar-icon.png" alt="Calendar" class="h-6 w-6">
                    <span>{event.date}</span>
                </span>
                <span class="flex items-center space-x-2">
                    <img src="/location-icon.png" alt="Location" class="h-6 w-6">
                    <span>{event.location}</span>
                </span>
                <span class="flex items-center space-x-2">
                    <img src="/link-icon.png" alt="Link" class="h-6 w-6">
                    <a href={event.url} class="anchor">{event.url}</a>
                </span>
            </div>              
        </div>
    </div>

    <div class="relative p-4 bg-white rounded-lg">
        <button class="absolute top-4 left-4 bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-md hover:bg-blue-600 transition">
            <img src="/calendar-icon.png" alt="Calendar" class="h-6 w-6">
            Add to Calendar
        </button>
    </div>
</div>

<!-- Navigation Tabs Added Below Event Section -->
<div class="card p-4 mb-8 mt-4">
    <div class="flex gap-4">
        <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100" on:click={() => navigateTo('')}>Guests</button>
        <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100" on:click={() => navigateTo('')}>Registration</button>
        <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100" on:click={() => navigateTo('')}>Emails</button>
        <button class="px-4 py-2 border border-gray-300 rounded-lg bg-blue-500 text-white" on:click={() => window.location.href = '/stafs'}>Staffs</button>
        <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100" on:click={() => navigateTo('')}>Website</button>
    </div>
</div>

<!-- "Staff Management" Title -->
<h2 class="text-2xl font-bold mt-8">Staff Management</h2>

<!-- Search Bar & Invite Staff Button Row -->
<div class="flex justify-between items-center mt-4 p-4 bg-white rounded-lg">
    <!-- Search Bar -->
    <div class="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-1/2">
        <img src="/search-icon.png" alt="Search" class="h-5 w-5 mr-2">
        <input 
            type="text" 
            placeholder="Search staff..." 
            bind:value={searchQuery} 
            class="w-full outline-none"
        >
    </div>

    <!-- Invite Staff Button -->
    <button class="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-blue-600 transition">
        <img src="/invite-icon.png" alt="Invite" class="h-5 w-5">
        Invite Staff
    </button>
</div>

<!-- Dropdown Buttons Row -->
<div class="flex justify-between items-center mt-4 p-4 bg-white rounded-lg">
    <!-- "All Staffs" Dropdown -->
    <div class="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-1/3">
        <img src="/staff-icon.png" alt="Staff Icon" class="h-5 w-5 mr-2">
        <select bind:value={staffFilter} class="w-full outline-none bg-transparent">
            <option>All Staffs</option>
            <option>Admins</option>
            <option>Scanners</option>
        </select>
    </div>

    <!-- "Time Registered" Dropdown -->
    <div class="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-1/3">
        <img src="/time-icon.png" alt="Time Icon" class="h-5 w-5 mr-2">
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
                    <button class="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition">
                        Decline
                    </button>
                    <button class="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition">
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
