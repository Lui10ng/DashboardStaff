<script lang="ts">
    import { tickets } from "../../lib/types/data/tickets";
    import { vouchers } from "../../lib/types/data/vouchers";
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation';
  
    let showNewTicketModal = false;
    let showNewVoucherModal = false;

    const activeTab = writable('merchant');

    function navigateTo(tab: string) {
        activeTab.set(tab);
        goto(`/${tab}`);
    }
  </script>
  
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
	<!-- Event Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
		<img 
			src={currentEvent.imageUrl} 
			alt={currentEvent.title}
			class="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg shadow-lg"
		/>
		<div class="flex-1 w-full">
			<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
				<h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{currentEvent.title}</h1>
				<button class="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors">
					Edit Event
					<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-6 sm:h-10 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-4.036L9 12.964V15h2.036l7.732-7.732a1.5 1.5 0 00-2.036-2.036zM6 18h12" />
					</svg>
				</button>
			</div>
			<div class="flex flex-col gap-2 text-gray-600">
				<div class="flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					<span>{currentEvent.date}</span>
				</div>
				<div class="flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					<span class="text-sm sm:text-base">{currentEvent.location}</span>
				</div>
			</div>
			
			<div class="mt-2 flex items-center gap-2">
				<a 
					href={currentEvent.url} 
					target="_blank" 
					rel="noopener noreferrer"
					class="text-sm sm:text-base text-indigo-600 hover:text-indigo-700 transition-colors break-all"
				>
					{currentEvent.url}
				</a>
				<div class="flex items-center gap-2 text-gray-500 text-sm">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
					</svg>
				</div>
			</div>      
		</div>
	</div>

    <div class="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 sm:mb-8 py-3 rounded-lg">
        <nav class="flex space-x-4 min-w-max">
            <button 
                class="px-4 sm:px-10 py-2 text-sm sm:text-base {$activeTab === 'registrants' ? 'text-white bg-[#DF4D60] hover:bg-[#eb6d80]' : 'text-gray-600 border border-gray-200 hover:text-gray-900'} shadow-sm rounded-lg transition-colors"
                on:click={() => navigateTo('registrants')}
            >
                Registrants
            </button>
            <button 
                class="px-4 sm:px-10 py-2 text-sm sm:text-base {$activeTab === 'posts' ? 'text-white bg-[#DF4D60] hover:bg-[#eb6d80]' : 'text-gray-600 border border-gray-200 hover:text-gray-900'} shadow-sm rounded-lg transition-colors"
                on:click={() => navigateTo('posts')}
            >
                Posts
            </button>
            <button 
                class="px-4 sm:px-10 py-2 text-sm sm:text-base {$activeTab === 'form' ? 'text-white bg-[#DF4D60] hover:bg-[#eb6d80]' : 'text-gray-600 border border-gray-200 hover:text-gray-900'} shadow-sm rounded-lg transition-colors"
                on:click={() => navigateTo('form')}
            >
                Form
            </button>
            <button 
                class="px-4 sm:px-10 py-2 text-sm sm:text-base {$activeTab === 'merchant' ? 'text-white bg-[#DF4D60] hover:bg-[#eb6d80]' : 'text-gray-600 border border-gray-200 hover:text-gray-900'} shadow-sm rounded-lg transition-colors"
                on:click={() => navigateTo('merchant')}
            >
                Merchant
            </button>
            <button 
                class="px-4 sm:px-10 py-2 text-sm sm:text-base {$activeTab === 'emails' ? 'text-white bg-[#DF4D60] hover:bg-[#eb6d80]' : 'text-gray-600 border border-gray-200 hover:text-gray-900'} shadow-sm rounded-lg transition-colors"
                on:click={() => navigateTo('emails')}
            >
                Emails
            </button>
            <button 
                class="px-4 sm:px-10 py-2 text-sm sm:text-base {$activeTab === 'staff' ? 'text-white bg-[#DF4D60] hover:bg-[#eb6d80]' : 'text-gray-600 border border-gray-200 hover:text-gray-900'} shadow-sm rounded-lg transition-colors"
                on:click={() => navigateTo('staff')}
            >
                Staff
            </button>
        </nav>
    </div>

	{#if $activeTab === 'registrants'}
		<!-- Stats -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
			<div class="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
						<span class="text-gray-900">Guests</span>
					</div>
					<!-- Button to Open Modal -->
					<button 
						class="text-[#DF4D60] hover:text-[#eb6d80]  transition-colors text-sm"
						on:click={openEmailBlastModal}
					>
						Email Blast
					</button>
				</div>
				<p class="text-3xl sm:text-4xl font-bold mt-2 text-gray-900">250</p>
			</div>
			<div class="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span class="text-gray-900">Income</span>
					</div>
					<button class="text-green-600 hover:text-green-700 transition-colors text-sm">
						View breakdown
					</button>
				</div>
				<p class="text-3xl sm:text-4xl font-bold mt-2 text-gray-900">₱32,550.00</p>
			</div>
		</div>
  <div class="space-y-8">
    <!-- Tickets Section -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Tickets</h2>
            <p class="mt-1 text-sm text-gray-500">Manage your event tickets and pricing</p>
          </div>
          <button 
            class="px-4 py-2 bg-[#DF4D60] text-white rounded-lg hover:bg-[#eb6d80] transition-colors text-sm"
            on:click={() => showNewTicketModal = true}
          >
            Add Ticket
          </button>
        </div>
      </div>
      
      <div class="divide-y divide-gray-200">
        {#each tickets as ticket}
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <h3 class="text-lg font-medium text-gray-900">{ticket.name}</h3>
                <p class="text-2xl font-bold text-gray-900">₱{ticket.price.toLocaleString()}</p>
                <div class="flex items-center gap-4 mt-2">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                    <span class="text-sm text-gray-500">{ticket.available} available</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span class="text-sm text-gray-500">{ticket.sold} sold</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-4.036L9 12.964V15h2.036l7.732-7.732a1.5 1.5 0 00-2.036-2.036z" />
                  </svg>
                </button>
                <button class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        {/each}
        
      </div>
    </div>
  
    <!-- Vouchers Section -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Vouchers</h2>
            <p class="mt-1 text-sm text-gray-500">Manage discount vouchers for your event</p>
          </div>
          <button 
            class="px-4 py-2 bg-[#DF4D60] text-white rounded-lg hover:bg-[#eb6d80] transition-colors text-sm"
            on:click={() => showNewVoucherModal = true}
          >
            Add Voucher
          </button>
        </div>
      </div>
      
      <div class="divide-y divide-gray-200">
        {#each vouchers as voucher}
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-medium text-gray-900">{voucher.code}</h3>
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {voucher.discount}% OFF
                  </span>
                </div>
                <div class="flex items-center gap-4 mt-2">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                    <span class="text-sm text-gray-500">{voucher.maxUses - voucher.used} available</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span class="text-sm text-gray-500">{voucher.used} used</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-4.036L9 12.964V15h2.036l7.732-7.732a1.5 1.5 0 00-2.036-2.036z" />
                  </svg>
                </button>
                <button class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        {/each}
        
      </div>
    </div>
  
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <span class="text-gray-900">Total Tickets Sold</span>
        </div>
        <p class="text-3xl font-bold mt-2 text-gray-900">85</p>
      </div>
  
      <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-gray-900">Total Revenue</span>
        </div>
        <p class="text-3xl font-bold mt-2 text-gray-900">₱75,000</p>
      </div>
  
      <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-gray-900">Avg. Transaction Time</span>
        </div>
        <p class="text-3xl font-bold mt-2 text-gray-900">2m 30s</p>
      </div>
    </div>
  </div>