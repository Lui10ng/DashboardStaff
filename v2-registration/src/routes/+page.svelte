<!-- src/routes/booking/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	
	// Use data from the server (provided via +page.server.ts)
	export let data;
	export let form;
	
	// Reactive state
	let selectedTicket = null;
	let quantity = 5;
	let voucherCode = '';
	let total = 0;
	let discount = 0;
	let voucherMessage = '';
	let voucherStatus = null; // null: not tried, true: valid, false: invalid
	let isCheckingVoucher = false;
	
	// Get ticket data from server
	const ticketTypes = data.ticketTypes;
	const restrictedDates = data.restrictedDates;
	
	// Select a ticket and update the total
	function selectTicket(ticket) {
	  if (!ticket.available || ticket.soldOut) return;
	  
	  selectedTicket = ticket;
	  calculateTotal();
	  
	  // Reset voucher when ticket type changes
	  if (voucherCode) {
		checkVoucher();
	  }
	}
	
	// Calculate the total based on selected ticket, quantity, and discounts
	function calculateTotal() {
	  if (selectedTicket) {
		const subtotal = selectedTicket.price * quantity;
		total = subtotal - discount;
	  } else {
		total = 0;
		discount = 0;
	  }
	}
	
	// Check voucher validity
	async function checkVoucher() {
	  if (!selectedTicket || !voucherCode.trim()) {
		voucherStatus = false;
		voucherMessage = 'Please enter a voucher code and select a ticket';
		discount = 0;
		calculateTotal();
		return;
	  }
	  
	  isCheckingVoucher = true;
	  
	  try {
		const response = await fetch('/booking?/validateVoucher', {
		  method: 'POST',
		  body: new FormData(document.getElementById('voucherForm')),
		  headers: {
			'Accept': 'application/json'
		  }
		});
		
		const result = await response.json();
		
		if (result.voucherValid) {
		  voucherStatus = true;
		  voucherMessage = `Voucher applied! You saved ₱${result.discount.toLocaleString()}`;
		  discount = result.discount;
		} else {
		  voucherStatus = false;
		  voucherMessage = result.voucherError || 'Invalid voucher code';
		  discount = 0;
		}
	  } catch (error) {
		voucherStatus = false;
		voucherMessage = 'Error checking voucher';
		discount = 0;
	  } finally {
		isCheckingVoucher = false;
		calculateTotal();
	  }
	}
	
	// Increase or decrease quantity
	function adjustQuantity(amount) {
	  const newQuantity = quantity + amount;
	  if (newQuantity >= 1 && (!selectedTicket || newQuantity <= selectedTicket.remainingTickets)) {
		quantity = newQuantity;
		calculateTotal();
	  }
	}
	
	// Handle the next button click
	function handleNext() {
	  if (!selectedTicket) {
		alert('Please select a ticket type');
		return;
	  }
	  
	  // Proceed to next step
	  console.log('Proceeding to next step with:', {
		ticket: selectedTicket,
		quantity: quantity,
		voucher: voucherCode,
		discount: discount,
		total: total
	  });
	}
	
	// Helper function to get appropriate CSS class for ticket background
	function getTicketClass(ticket) {
	  const classes = {
		'vvip': 'bg-amber-900 border-l-amber-600 text-white',
		'vip': 'bg-yellow-400 border-l-orange-500 text-black',
		'patronA': 'bg-yellow-400 border-l-orange-500 text-black',
		'patronB': 'bg-white border-l-green-500 text-black',
		'lowerBox': 'bg-purple-900 border-l-purple-500 text-white',
		'upperBox': 'bg-teal-800 border-l-teal-400 text-white',
		'standingA': 'bg-white border-l-red-600 text-black',
		'standingB': 'bg-white border-l-red-600 text-black'
	  };
	  
	  return classes[ticket.id] || '';
	}
	
	// Set an initial selected ticket when component mounts
	onMount(() => {
	  const defaultTicket = ticketTypes.find(t => t.id === 'vip' && t.available);
	  if (defaultTicket) {
		selectTicket(defaultTicket);
	  }
	  
	  // Check for form.voucherError from server response
	  if (form?.voucherError) {
		voucherStatus = false;
		voucherMessage = form.voucherError;
	  }
	  
	  // Check for successful voucher validation from server
	  if (form?.voucherValid) {
		voucherStatus = true;
		voucherMessage = `Voucher applied! You saved ₱${form.discount.toLocaleString()}`;
		discount = form.discount;
		calculateTotal();
	  }
	});
	
	// Watch for changes in quantity and recalculate
	$: {
	  if (selectedTicket) {
		calculateTotal();
	  }
	}
</script>

<svelte:head>
  <style>
    /* Add global styles for backdrop blur */
    .overlay-blur {
      backdrop-filter: blur(3px);
      background-color: rgba(0, 0, 0, 0.4) !important;
    }
  </style>
</svelte:head>

<div class="max-w-3xl mx-auto p-5 text-white">
  <h1 class="text-2xl mb-6">Booking Details</h1>
  
  <section class="mb-5">
    <h2 class="text-xl mb-4">Select Tickets</h2>
    
    <div class="grid grid-cols-2 gap-4 mb-4">
      {#each ticketTypes as ticket, index}
        <!-- Render different ticket layouts based on availability and status -->
        {#if ticket.soldOut}
          <!-- Sold Out Ticket -->
          <div class="relative overflow-hidden min-h-24 rounded border-l-4 {getTicketClass(ticket)}">
            <div class="p-4">
              <h3 class="m-0 mb-1">{ticket.name}</h3>
              <p class="text-2xl font-bold m-0">₱ {ticket.price.toLocaleString()}</p>
            </div>
            <div class="absolute inset-0 overlay-blur flex items-center justify-center font-bold text-lg">
              SOLD OUT
            </div>
          </div>
        {:else if ticket.availableIn}
          <!-- Time-restricted Ticket -->
          <div class="relative overflow-hidden min-h-24 rounded border-l-4 {getTicketClass(ticket)}">
            <div class="p-4">
              <h3 class="m-0 mb-1">{ticket.name}</h3>
              <p class="text-2xl font-bold m-0">₱ {ticket.price.toLocaleString()}</p>
            </div>
            <div class="absolute inset-0 overlay-blur flex flex-col items-center justify-center font-bold text-center">
              AVAILABLE IN<br />
              {ticket.availableIn}
            </div>
          </div>
        {:else}
          <!-- Available Ticket -->
          <div 
            class="relative overflow-hidden min-h-24 rounded border-l-4 {getTicketClass(ticket)} cursor-pointer transition transform hover:-translate-y-0.5 {selectedTicket?.id === ticket.id ? 'ring-2 ring-green-500' : ''}"
            on:click={() => selectTicket(ticket)}
          >
            <div class="p-4">
              <h3 class="m-0 mb-1">{ticket.name}</h3>
              <p class="text-2xl font-bold m-0">₱ {ticket.price.toLocaleString()}</p>
              {#if ticket.remainingTickets !== undefined}
                <p class="text-xs mt-1 mb-0">Ticket left: {ticket.remainingTickets}/{ticket.totalTickets}</p>
              {/if}
            </div>
            {#if selectedTicket?.id === ticket.id}
              <div class="absolute top-2 right-2 text-green-500 text-2xl">✓</div>
            {/if}
          </div>
        {/if}
      {/each}
    </div>
  </section>
  
  <!-- Voucher Section -->
  <section class="mb-5">
    <h2 class="text-xl mb-4">Voucher (Optional)</h2>
    
    <form id="voucherForm" method="POST" action="?/validateVoucher">
      <div class="flex gap-2">
        <input 
          type="text" 
          name="voucher"
          placeholder="Enter voucher code" 
          bind:value={voucherCode}
          class="flex-1 p-3 border-none rounded bg-gray-300 text-gray-800 text-base"
        />
        
        <input type="hidden" name="ticketId" value={selectedTicket?.id || ''} />
        
        <button 
          type="button" 
          class="px-5 bg-green-500 text-white border-none rounded font-bold cursor-pointer transition hover:bg-green-600 disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
          on:click={checkVoucher} 
          disabled={isCheckingVoucher || !voucherCode.trim() || !selectedTicket}
        >
          {isCheckingVoucher ? 'Checking...' : 'Apply'}
        </button>
      </div>
      
      {#if voucherMessage}
        <div class="mt-2 p-2 rounded text-sm {voucherStatus ? 'bg-green-500 bg-opacity-20 text-green-500' : 'bg-red-500 bg-opacity-20 text-red-500'}">
          {voucherMessage}
        </div>
      {/if}
    </form>
  </section>
  
  <!-- Quantity and Total Section -->
  <section class="bg-black rounded p-5">
    <div class="flex justify-between items-center mb-4">
      <span>Quantity</span>
      <div class="flex items-center bg-gray-700 rounded-full">
        <button 
          class="w-9 h-9 rounded-full bg-transparent text-white text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          on:click={() => adjustQuantity(-1)} 
          disabled={quantity <= 1}
        >−</button>
        <span class="w-10 text-center">{quantity}</span>
        <button 
          class="w-9 h-9 rounded-full bg-transparent text-white text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          on:click={() => adjustQuantity(1)} 
          disabled={selectedTicket && quantity >= selectedTicket.remainingTickets}
        >+</button>
      </div>
    </div>
    
    <p class="text-gray-500 text-xs mb-4">Single registration will be used</p>
    
    {#if discount > 0}
      <div class="mb-4 border-b border-gray-700 pb-2">
        <div class="flex justify-between mb-1 text-sm text-gray-400">
          <span>Subtotal:</span>
          <span>₱ {(selectedTicket?.price * quantity).toLocaleString()}</span>
        </div>
        <div class="flex justify-between text-sm text-green-500">
          <span>Discount:</span>
          <span>- ₱ {discount.toLocaleString()}</span>
        </div>
      </div>
    {/if}
    
    <div class="flex justify-between items-center mb-5">
      <span>Total:</span>
      <span class="text-2xl font-bold">₱ {total.toLocaleString()}</span>
    </div>
    
    <button 
      class="w-full py-4 bg-red-600 text-white border-none rounded text-base font-bold cursor-pointer transition hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed"
      on:click={handleNext} 
      disabled={!selectedTicket}
    >
      NEXT
    </button>
  </section>
</div>