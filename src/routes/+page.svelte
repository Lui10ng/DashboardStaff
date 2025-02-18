<script lang="ts">
    import { AppShell, TabGroup, Tab } from '@skeletonlabs/skeleton';
    //add sorting script for the pending , search staff, responsiveness (only headers)
    let tabSet = 0;

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
  
    const guests = [
      { type: 'REG', name: 'Aaron Dave Tagalimot', email: 'aaron@gmail.com', phone: '0956 879 9087', date: '10 Jan 2024, 10:05 AM' },
      { type: 'VIP', name: 'Ericke Gallardo', email: 'ericke@veent.io', phone: '0967 908 7890', date: '12 Jan 2024, 11:00 PM' },
      { type: 'REG', name: 'John Ramirez', email: 'john_ramirez@gmail.com', phone: '0965 763 2398', date: '25 Jan 2024, 8:16 PM' },
      { type: 'REG', name: 'Sierra Madrigal', email: 'sierra456@gmail.com', phone: '0969 765 4321', date: '01 Feb 2024, 5:15 AM' }
    ];
</script>

<AppShell>

  <!-- Header -->
  <header class="bg-primary text-black p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">

      <!-- Logo and Title -->
      <div class="flex items-center space-x-12">
        <img src="/logo/Veent-red-logo.png" alt="Veent Logo" class="h-6.6 w-12"> 
        <div class="flex items-center space-x-7">
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

      <!-- Icons: Search, Notifications, Profile -->
      <div class="flex items-center space-x-5">
        <a href="/search" aria-label="Search">
          <img src="/icons/search-icon.png" alt="Search Icon" class="h-5 w-5 cursor-pointer">
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

  <!-- Main Content -->
  <main class="container mx-auto p-4">
    <div class="space-y-4">
        <style>
            :root {
              --event-left-margin: -225px; 
            }
          </style>

        <!--Event Title Row-->
        <div class="flex justify-between max-w-screen-md mx-auto space-x-8">

            <!--Event Title Padding-->
            <div class="p-4 bg-white rounded-lg shadow flex items-start space-x-4 relative px-101 w-0"style="margin-left: var(--event-left-margin);">
                Event</div>
                
            <!---New Padding-->
            <div class="p-4 bg-white rounded-lg shadow flex flex-col space-y-2 relative px-37 w-1/2">Summary</div></div>

      <!-- Event Header -->
      <div class="card p-4 grid grid-cols-1 md:grid-cols-3 gap-4">

        <!-- Left Section (Title, Date, Location, URL) -->
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
                      <a href={event.url} class="anchor">{event.url}</a>
                  </span>
              </div>
          </div>
      </div>     
          
        <!-- Right Section (Guests & Income) -->
        <div class="card variant-ghost p-4 w-full md:w-auto">
          <div class="flex flex-col space-y-4">
            <div class="p-4 bg-white rounded-lg shadow flex flex-col space-y-2 relative">
                <a href="/guests" class="absolute top-2 right-2 text-black underline text-sm">See full list</a>
                <div class="flex items-center space-x-2">
                  <img src="/icons/group-icon.png" alt="Guest" class="h-8 w-8">
                  <h3 class="h3">Guests</h3>
                </div>
                <p class="text-2xl font-bold">{event.stats.guests}</p>
              </div>
              <div class="p-4 bg-white rounded-lg shadow flex flex-col space-y-2 relative">
                <a href="/guests" class="absolute top-2 right-2 text-black underline text-sm">View Breakdown</a>
                <div class="flex items-center space-x-2">
                  <img src="/icons/cash-icon.png" alt="Money" class="h-8 w-8">
                  <h3 class="h3">Income</h3>
                </div>
                <p class="text-2xl font-bold">₱{event.stats.income.toLocaleString()}</p>
              </div>         
          </div>
        </div>
      </div>
      
      <!-- Navigation Tabs -->
      <div class="card p-4 mb-8">
        <div class="flex gap-4 ">
          <button class="px-20 py-2 border border-gray-300 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer" on:click={() => navigateTo('')}>Guests</button>
          <button class="px-15 py-2 border border-gray-300 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer" on:click={() => navigateTo('')}>Registration</button>
          <button class="px-20 py-2 border border-gray-300 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer" on:click={() => window.location.href = '/Registration instruction'}>Emails</button>
          <button class="px-20 py-2 border border-gray-300 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer" on:click={() => window.location.href = '/stafs'}>Staffs</button>
          <button class="px-20 py-2 border border-gray-300 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer" on:click={() => navigateTo('')}>Website</button>
        </div>
      </div>
 
      <!-- Tab Content -->
      <div class="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">

        <!-- Left Section: Guest List Title & Description -->
        <div>
          <h3 class="text-xl font-bold">Guest List</h3>
          <p class="text-gray-600">Your Guest History</p>
        </div>
      
        <!-- Right Section: Invite Staff Button -->
        <div style="display: flex; gap: 10px;">
          <button class="bg-gray-200 text-gray px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300 cursor-pointer">
          <img src="/icons/arrow-icon (1).png" alt="FullList" class="h-5 w-5">
          See Full List
        </button>
        <button class="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 cursor-pointer">
          <img src="/icons/download-icon.png" alt="Download" class="h-5 w-5">
          Download CSV
        </button></div>
      </div>
        {#if tabSet === 0}
            <div class="card p-4">

              <!-- Table with Spaced Rows, No Borders, and Icons Before Names -->
<div class="overflow-x-auto bg-white rounded-lg shadow-md p-4">
    <table class="w-full border-collapse">

      <!-- Table Header
      <thead>
        <tr>
          <th class="px-4 py-2 text-left font-bold">Name</th>
          <th class="px-4 py-2 text-left font-bold">Email</th>
          <th class="px-4 py-2 text-left font-bold">Phone</th>
          <th class="px-4 py-2 text-left font-bold">Date</th>
        </tr>
      </thead> -->
  
      <!-- Table Body -->
      <tbody>
        {#each guests as guest}
          <tr class="hover:bg-gray-100">
            <td class="px-4 py-3 flex items-center space-x-2">
              <img src="/user-icon.png" alt="User" class="h-6 w-6">
              <span>{guest.name}</span>
            </td>
            <td class="px-4 py-3">{guest.email}</td>
            <td class="px-4 py-3">{guest.phone}</td>
            <td class="px-4 py-3">{guest.date}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
            </div>
        {:else}
            <p>Content for other tabs coming soon...</p>
        {/if}
    </div>
  </main>
</AppShell>
