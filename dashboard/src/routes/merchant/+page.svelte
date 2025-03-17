<script lang="ts">
  import { activeRoute } from '$lib/stores/store'; // Ensure the path is correct
  import { goto } from '$app/navigation';
  import { currentEvent } from '$lib/types/data/event';
  import EditEventModal from '$lib/components/features/EditEventModal/EditEventModal.svelte';
	import { eventDetails } from '$lib/stores/store';
	import { event } from '$lib/types/data/eventData';
	import { writable } from 'svelte/store';

	const isModalOpen = writable(false);

  // Set active route when component mounts
  $activeRoute = 'merchant';

  function navigateTo(route: string) {
    activeRoute.set(route);
    goto(`/${route}`);
  }

  const tickets = [
    {
      id: 1,
      name: "TJ Mondragon",
      price: 500,
      validFrom: "2023-02-10",
      validTo: "2025-02-28",
      status: "Active",
      sold: "35/50"
    },
    {
      id: 2,
      name: "Arthur Nery",
      price: 500,
      validFrom: "2023-03-15",
      validTo: "2025-03-28",
      status: "Active",
      sold: "35/50"
    },
    {
      id: 3,
      name: "Manny Pacquiao",
      price: 500,
      validFrom: "2023-03-20",
      validTo: "2025-03-28",
      status: "Active",
      sold: "35/50"
    },
    {
      id: 4,
      name: "Chris Briand",
      price: 500,
      validFrom: "2023-02-15",
      validTo: "2025-02-28",
      status: "Active",
      sold: "35/50"
    }
  ];

  // Sample data for vouchers
  const vouchers = [
    {
      id: "TJMON1",
      discount: "-50%",
      status: "Expired",
      validUntil: "Feb 9, 2023",
      validTime: "5:00 AM",
      sold: "35/50",
      progressColor: "bg-purple-800"
    },
    {
      id: "TJMON1",
      discount: "-25%",
      status: "Deactivated",
      validUntil: "Feb 8, 2023",
      validTime: "6:00 AM",
      sold: "35/50",
      progressColor: "bg-purple-800"
    },
    {
      id: "TJMON1",
      discount: "-20%",
      status: "Active",
      validUntil: "Feb 8, 2023",
      validTime: "8:00 AM",
      sold: "35/50",
      progressColor: "bg-purple-800"
    },
    {
      id: "TJMON1",
      discount: "-10%",
      status: "Expired",
      validUntil: "Feb 8, 2023",
      validTime: "6:00 AM",
      sold: "35/50",
      progressColor: "bg-purple-800"
    }
  ];

  // Toggle for vouchers section
  let vouchersEnabled = true;

  // Function to get status badge color
  function getStatusColor(status) {
    if (status === "Active") return "bg-green-500";
    if (status === "Expired") return "bg-red-500";
    if (status === "Deactivated") return "bg-gray-500";
    return "bg-gray-400";
  }

  function getStatusTextColor(status) {
    if (status === "Active") return "text-green-500";
    if (status === "Expired") return "text-red-500";
    if (status === "Deactivated") return "text-gray-500";
    return "text-gray-400";
  }
  $eventDetails = null;
	function editThis() {
		$eventDetails = event;
		$isModalOpen = true;
	}
 
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
       <button on:click={editThis} class="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors">
         Edit Event
         <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-6 sm:h-10 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-4.036L9 12.964V15h2.036l7.732-7.732a1.5 1.5 0 00-2.036-2.036zM6 18h12" />
         </svg>
       </button>
       <EditEventModal isOpen={isModalOpen} />
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
 <!-- Tickets Section -->
 <div class="mb-8">
   <div class="flex justify-between items-center mb-4">
     <h2 class="text-xl font-semibold">Tickets</h2>
     <div class="flex gap-2">
       <button class="p-2 rounded hover:bg-gray-100">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
           <rect x="2" y="6" width="20" height="3" rx="1.5" />
           <rect x="5" y="12" width="14" height="3" rx="1.5" />
           <rect x="8" y="18" width="8" height="3" rx="1.5" />
         </svg>
       </button>
       <button class="bg-gray-200 rounded px-4 py-2 flex items-center gap-2 text-sm">
         <span>+</span>
         <span>Add Ticket</span>
       </button>
     </div>
   </div>

   <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
     {#each tickets as ticket}
       <div class="border-[#B4B4B4] border-[0.5px] rounded-lg overflow-hidden shadow-sm">
         <div class="relative border-l-10 {ticket.status === 'Active' ? 'border-green-500' : 'border-gray-300'} p-4">
           <div class="text-xs text-gray-500 mb-1">
             Valid from {ticket.validFrom} to {ticket.validTo}
           </div>
           <div class="flex justify-between items-start">
             <div class="font-medium">{ticket.name}</div>
             <div class="flex gap-1">
               <span class="inline-flex items-center px-2 py-1 rounded-full text-xs {getStatusTextColor(ticket.status)}">
                 {ticket.status}
               </span>
               <button class="text-gray-400 hover:text-gray-600">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                 </svg>
               </button>
               <button class="text-gray-400 hover:text-gray-600">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 18M6 18L6 6M18 18L18 6M6 6L18 6M9 6L9 4M15 6L15 4M10 4L14 4" />
                 </svg>
               </button>
             </div>
           </div>
           <div class="mt-2 text-lg font-bold">₱{ticket.price}</div>
           <div class="mt-4">
             <div class="flex justify-between text-xs mb-1">
               <span>Sold</span>
               <span>{ticket.sold}</span>
             </div>
             <div class="w-full bg-gray-200 rounded-full h-1.5">
               <div class={`${ticket.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'} h-1.5 rounded-full`} style="width: 70%"></div>
             </div>
           </div>
         </div>
       </div>
     {/each}
   </div>
 </div>

 <!-- Vouchers Section -->
 <div>
   <div class="flex justify-between items-center mb-4">
     <div class="flex items-center gap-2">
       <h2 class="text-xl font-semibold">Vouchers</h2>
       <label class="inline-flex items-center cursor-pointer">
         <div class="relative">
           <input type="checkbox" bind:checked={vouchersEnabled} class="sr-only peer">
           <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-400"></div>
         </div>
       </label>
     </div>
     <div class="flex gap-2">
       <button class="p-2 rounded hover:bg-gray-100">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
           <rect x="2" y="6" width="20" height="3" rx="1.5" />
           <rect x="5" y="12" width="14" height="3" rx="1.5" />
           <rect x="8" y="18" width="8" height="3" rx="1.5" />
         </svg>
       </button>
       <button class="bg-gray-200 rounded px-4 py-2 flex items-center gap-2 text-sm">
         <span>+</span>
         <span>Add Voucher</span>
       </button>
     </div>
   </div>

   {#if vouchersEnabled}
     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
       {#each vouchers as voucher}
       <div class="border-[#B4B4B4] border-[0.5px] rounded-lg overflow-hidden shadow-sm">
         <div class="p-4">
             <div class="flex justify-between items-start mb-2">
               <div class="font-medium">{voucher.id}</div>
               <div>
                 <span class="inline-flex items-center px-2 py-1 rounded-full text-xs {getStatusTextColor(voucher.status)}">
                   <span class="h-2 w-2 mr-1 rounded-full {getStatusColor(voucher.status)}"></span>
                   {voucher.status}
                 </span>
               </div>
             </div>
             <div class="text-2xl font-bold text-red-500 mb-4">{voucher.discount}</div>
             <div class="mt-4">
               <div class="flex justify-between text-xs mb-1">
                 <span class="text-gray-500">Valid until {voucher.validUntil} - {voucher.validTime}</span>
                 <span>{voucher.sold}</span>
               </div>
               <div class="w-full bg-gray-200 rounded-full h-1.5">
                 <div class={`${voucher.progressColor} h-1.5 rounded-full`} style="width: 70%"></div>
               </div>
             </div>
           </div>
         </div>
       {/each}
     </div>
   {/if}
 </div>
</div>