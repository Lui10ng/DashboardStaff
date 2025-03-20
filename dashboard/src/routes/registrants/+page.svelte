<script lang="ts">
	import { activeRoute } from '$lib/stores/store'; // Ensure the path is correct
	import { goto } from '$app/navigation';
	import TicketModal from '$lib/components/ui/TicketModal.svelte';
	import EmailBlastModal from '$lib/components/ui/EmailBlastModal.svelte';
	import { currentEvent } from '$lib/types/data/event';
	import { guests, type Guest } from '$lib/types/data/guests';
	import { paginate } from '$lib/types/data/pagination';
	import QrCodeModal from '$lib/components/ui/QrCodeModal.svelte'; // Import the modal component
  
	$activeRoute = 'registrants';
  
	let searchQuery = '';
	let currentPage = 1;
	let itemsPerPage = 5;
	let selectedGuest: Guest | null = null;
	let isTicketModalOpen = false;
	let isEmailBlastModalOpen = false;
	let isMobileMenuOpen = false;
	let filteredGuests: Guest[] = [];
	let paginatedData: {
	  items: Guest[];
	  currentPage: number;
	  totalPages: number;
	  pageNumbers: (number | string)[];
	  hasNextPage: boolean;
	  hasPrevPage: boolean;
	};
	let filterStatus = 'all';
	let isQrCodeModalOpen = false;
	let selectedGuestForQr: Guest | null = null;
  
	function navigateTo(route: string) {
	  activeRoute.set(route);
	  goto(`/${route}`);
	}
  
	function handleFilterStatusChange(event: Event) {
	  const select = event.target as HTMLSelectElement;
	  filterStatus = select.value;
	  currentPage = 1; // Reset to first page when filter changes
	}
  
	function downloadCSV() {
	  const headers = ['Name', 'Email', 'Status', 'Registration Date'];
	  const rows = filteredGuests.map(guest => [guest.name, guest.email, guest.status, guest.registrationDate]);
  
	  let csvContent = 'data:text/csv;charset=utf-8,';
	  csvContent += headers.join(',') + '\n';
	  rows.forEach(row => {
		csvContent += row.join(',') + '\n';
	  });
  
	  const encodedUri = encodeURI(csvContent);
	  const link = document.createElement('a');
	  link.setAttribute('href', encodedUri);
	  link.setAttribute('download', 'guest_list.csv');
	  document.body.appendChild(link);
	  link.click();
	  document.body.removeChild(link);
	}
  
	$: {
	  filteredGuests = guests.filter(guest => 
		(filterStatus === 'all' || guest.status === filterStatus) &&
		(guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		guest.email.toLowerCase().includes(searchQuery.toLowerCase()))
	  );
	  paginatedData = paginate(filteredGuests, currentPage, itemsPerPage);
	}
  
	function goToPage(page: number) {
	  if (page >= 1 && page <= paginatedData.totalPages) {
		currentPage = page;
	  }
	}
  
	function nextPage() {
	  if (paginatedData.hasNextPage) {
		goToPage(currentPage + 1);
	  }
	}
  
	function prevPage() {
	  if (paginatedData.hasPrevPage) {
		goToPage(currentPage - 1);
	  }
	}
  
	function handleItemsPerPageChange(event: Event) {
	  const select = event.target as HTMLSelectElement;
	  const newItemsPerPage = parseInt(select.value);
	  
	  // Update items per page
	  itemsPerPage = newItemsPerPage;
	  
	  // Reset to first page
	  currentPage = 1;
	  
	  // Show all items if itemsPerPage matches or exceeds filtered items
	  if (newItemsPerPage >= filteredGuests.length) {
		itemsPerPage = filteredGuests.length;
	  }
	}
  
	function openTicketModal(guest: Guest) {
	  selectedGuest = guest;
	  isTicketModalOpen = true;
	}
  
	function closeTicketModal() {
	  isTicketModalOpen = false;
	  selectedGuest = null;
	}
  
	function openEmailBlastModal() {
	  isEmailBlastModalOpen = true;
	}
  
	function closeEmailBlastModal() {
	  isEmailBlastModalOpen = false;
	}
	function navigateToMerchant() {
	  goto('/merchant');
	}
  
	function openQrCodeModal(guest: Guest) {
		selectedGuestForQr = guest;
		isQrCodeModalOpen = true;
	}

	function closeQrCodeModal() {
		isQrCodeModalOpen = false;
		selectedGuestForQr = null;
	}

	async function resendQrCode() {
		// Simulate a delay
		await new Promise(resolve => setTimeout(resolve, 2000));
	}

	// Computed value to determine if pagination should be shown
	$: showPagination = filteredGuests.length > itemsPerPage;
  </script>
	
	
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
	<!-- Event Header -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-[80px] sm:gap-6 mb-6 sm:mb-8">
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
	
	<!-- Navigation -->
	<div class="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 sm:mb-8 py-3 rounded-lg">
	  <nav class="flex space-x-4 min-w-max">
		<button 
		  class="px-4 sm:px-10 py-2 text-sm sm:text-base {$activeRoute === 'registrants' ? 'text-white bg-[#DF4D60] hover:bg-[#eb6d80]' : 'text-gray-600 border border-gray-200 hover:text-gray-900'} shadow-sm rounded-lg transition-colors"
		  on:click={() => navigateTo('registrants')}
		>
		  Registrants
		</button>
		<button 
		  class="px-4 sm:px-10 py-2 text-sm sm:text-base {$activeRoute === 'posts' ? 'text-white bg-[#DF4D60] hover:bg-[#eb6d80]' : 'text-gray-600 border border-gray-200 hover:text-gray-900'} shadow-sm rounded-lg transition-colors"
		  on:click={() => navigateTo('posts')}
		>
		  Posts
		</button>
		<button 
		  class="px-4 sm:px-10 py-2 text-sm sm:text-base {$activeRoute === 'form' ? 'text-white bg-[#DF4D60] hover:bg-[#eb6d80]' : 'text-gray-600 border border-gray-200 hover:text-gray-900'} shadow-sm rounded-lg transition-colors"
		  on:click={() => navigateTo('form')}
		>
		  Form
		</button>
		<button 
		  class="px-4 sm:px-10 py-2 text-sm sm:text-base {$activeRoute === 'merchant' ? 'text-white bg-[#DF4D60] hover:bg-[#eb6d80]' : 'text-gray-600 border border-gray-200 hover:text-gray-900'} shadow-sm rounded-lg transition-colors"
		  on:click={() => navigateTo('merchant')}
		>
		  Merchant
		</button>
		<button 
		  class="px-4 sm:px-10 py-2 text-sm sm:text-base {$activeRoute === 'emails' ? 'text-white bg-[#DF4D60] hover:bg-[#eb6d80]' : 'text-gray-600 border border-gray-200 hover:text-gray-900'} shadow-sm rounded-lg transition-colors"
		  on:click={() => navigateTo('emails')}
		>
		  Emails
		</button>
		<button 
		  class="px-4 sm:px-10 py-2 text-sm sm:text-base {$activeRoute === 'staff' ? 'text-white bg-[#DF4D60] hover:bg-[#eb6d80]' : 'text-gray-600 border border-gray-200 hover:text-gray-900'} shadow-sm rounded-lg transition-colors"
		  on:click={() => navigateTo('staff')}
		>
		  Staff
		</button>
	  </nav>
	</div>
	
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
	
	<!-- Guest List -->
	<div class="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
	  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
		<h2 class="text-xl font-semibold text-gray-900">Guest List</h2>
		<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
		  <button 
			class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base cursor-pointer"
			on:click={downloadCSV}
		  >
			Download CSV
		  </button>
		  <button class="px-4 py-2 bg-[#DF4D60] text-white rounded-lg hover:bg-[#eb6d80] transition-colors text-sm sm:text-base cursor-pointer">
			See full list
		  </button>
		</div>
	  </div>
	
	  <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
		<div class="flex-1 relative">
		  <input
			type="text"
			placeholder="Search guests..."
			bind:value={searchQuery}
			class="w-full bg-gray-50 border border-gray-200 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
		  />
		  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
		  </svg>
		</div>
		<div class="flex flex-col sm:flex-row gap-2 sm:gap-4">

		  <select 
			class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base cursor-pointer"
			on:change={handleFilterStatusChange}
		  >
			<option value="all">All Guests</option>
			<option value="registered">Registered</option>
			<option value="pending">Pending</option>
		  </select>
		  <select class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base cursor-pointer">
			<option value="name">Name, Email...</option>
			<option value="date">Registration Date</option>
			<option value="status">Status</option>
		  </select>
		</div>
	  </div>
	
	 	  <!-- Guest List Items -->
		   <div class="space-y-4">
			{#each paginatedData.items as guest (guest.id)}
			  <div 
				class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4 cursor-pointer"
				on:click={() => openTicketModal(guest)}
			  >
				<div class="flex items-center gap-4">
				  <img 
					src={guest.avatar} 
					alt={guest.name}
					class="w-10 h-10 rounded-full"
				  />
				  <div class="flex-1">
					<h3 class="font-medium text-gray-900">{guest.name}</h3>
					<p class="text-sm text-gray-500">{guest.email}</p>
				  </div>
				</div>
				<div class="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-4">
				  <span class="text-sm text-gray-500 order-1 sm:order-none">{guest.registrationDate}</span>
				  <span class={`px-3 py-1 rounded-full text-xs font-medium ${
					guest.status === 'registered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
				  } order-2 sm:order-none`}>
					{guest.status}
				  </span>
				  <button 
					class={`px-3 py-2 rounded-lg transition-colors text-xs flex items-center gap-2 order-3 sm:order-none ${
					  guest.status === 'pending' 
						? 'bg-[#E2E2E2] text-[#B7B7B7] cursor-not-allowed' 
						: 'text-red-500 hover:border-red-600 hover:bg-red-200 hover:text-red-600 border-1 cursor-pointer'
					}`}
					disabled={guest.status === 'pending'}
					on:click={(e) => { 
					  if (guest.status !== 'pending') {
						e.stopPropagation(); 
						openQrCodeModal(guest); 
					  }
					}}
				  >
					<svg 
					  xmlns="http://www.w3.org/2000/svg" 
					  width="20" 
					  height="20" 
					  viewBox="0 0 24 24" 
					  fill="currentColor" 
					  class="w-4 h-4 sm:hidden"
					>
					  <path d="M3 4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h10.5a6.5 6.5 0 0 1-.5-2.5a6.5 6.5 0 0 1 6.5-6.5a6.5 6.5 0 0 1 1.5.18V6a2 2 0 0 0-2-2zm0 2l8 5l8-5v2l-8 5l-8-5zm16 6l-2.25 2.25L19 16.5V15a2.5 2.5 0 0 1 2.5 2.5c0 .4-.09.78-.26 1.12l1.09 1.09c.42-.63.67-1.39.67-2.21c0-2.21-1.79-4-4-4zm-3.33 3.29c-.42.63-.67 1.39-.67 2.21c0 2.21 1.79 4 4 4V23l2.25-2.25L19 18.5V20a2.5 2.5 0 0 1-2.5-2.5c0-.4.09-.78.26-1.12z"/>
					</svg>
					<svg 
					  xmlns="http://www.w3.org/2000/svg" 
					  viewBox="0 0 24 24" 
					  fill="currentColor" 
					  class="hidden sm:inline w-5 h-5"
					>
					  <path d="M1.94607 9.31543C1.42353 9.14125 1.4194 8.86022 1.95682 8.68108L21.043 2.31901C21.5715 2.14285 21.8746 2.43866 21.7265 2.95694L16.2733 22.0432C16.1223 22.5716 15.8177 22.59 15.5944 22.0876L11.9999 14L17.9999 6.00005L9.99992 12L1.94607 9.31543Z"></path>
					</svg>
					<span class="hidden sm:inline">Resend QR Code</span>
					
				  </button>
				</div>
			  </div>
			{/each}
		  </div>
	  
		  <!-- Pagination Controls - Enhanced mobile layout -->
		  <div class="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-6">
			<div class="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
			  {#if showPagination}
				<div class="flex items-center gap-2">
				  <button 
					class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					on:click={prevPage}
					disabled={!paginatedData.hasPrevPage}
				  >
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					</svg>
				  </button>
				  
				  {#each paginatedData.pageNumbers as pageNum}
					{#if typeof pageNum === 'number'}
					  <button 
						class="w-8 h-8 flex items-center justify-center rounded-lg transition-colors {
						  pageNum === currentPage 
							? 'bg-[#DF4D60] text-white hover:bg-[#eb6d80]' 
							: 'bg-gray-100 text-gray-500 hover:bg-gray-200'
						}"
						on:click={() => goToPage(pageNum)}
					  >
						{pageNum}
					  </button>
					{:else}
					  <span class="text-gray-500">...</span>
					{/if}
				  {/each}
		  
				  <button 
					class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					on:click={nextPage}
					disabled={!paginatedData.hasNextPage}
				  >
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				  </button>
				</div>
			  {/if}
			  
			  <span class="text-sm text-gray-600 whitespace-nowrap">
				Showing {Math.min(itemsPerPage, filteredGuests.length)} of {filteredGuests.length} items
			  </span>
			</div>
			<div class="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
			  <span class="text-sm text-gray-600">Items per page:</span>
			  <select 
				class="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base cursor-pointer"
				on:change={handleItemsPerPageChange}
			  >
				<option value="5">5</option>
				<option value="10">10</option>
				<option value="20">20</option>
				<option value="50">50</option>
				<option value={filteredGuests.length}>All</option>
			  </select>
			</div>
		  </div>
		</div>
	  </div>
	  
	  <TicketModal 
		isOpen={isTicketModalOpen} 
		guest={selectedGuest} 
		onClose={closeTicketModal}
	  />
	  
	  <EmailBlastModal 
		isOpen={isEmailBlastModalOpen}
		closeModal={closeEmailBlastModal}
	  />
	  
	  <QrCodeModal 
		isOpen={isQrCodeModalOpen} 
		guest={selectedGuestForQr} 
		onClose={closeQrCodeModal} 
		onResend={resendQrCode}
	  />