<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	
	export let data;
	export let form;
	
	let selectedTicket = null;
	let quantity = 5;
	let voucherCode = '';
	let total = 0;
	let discount = 0;
	let voucherMessage = '';
	let voucherStatus = null; 
	let isCheckingVoucher = false;
	
	let ticketTypes = data.ticketTypes;
	const restrictedDates = data.restrictedDates;
	
	
	let availabilityInterval;
	
	function selectTicket(ticket) {
	  if (!ticket.available || ticket.soldOut) return;

	  quantity = 1;
	  
	  selectedTicket = ticket;
	  calculateTotal();
	  
	  if (voucherCode) {
		checkVoucher();
	  }
	}
	
	function calculateTotal() {
	  if (selectedTicket) {
		const subtotal = selectedTicket.price * quantity;
		total = subtotal - discount;
	  } else {
		total = 0;
		discount = 0;
	  }
	}
	
	async function checkVoucher() {
      if (!selectedTicket || !voucherCode.trim()) {
        voucherStatus = false;
        voucherMessage = 'Please enter a voucher code and select a ticket';
        discount = 0;
        calculateTotal();
        return;
      }
      
      isCheckingVoucher = true;
    
      voucherMessage = voucherStatus ? voucherMessage : 'Checking voucher...';
      
      try {
     
        const form = document.getElementById('voucherForm');
        if (!form) {
          throw new Error('Voucher form not found');
        }
        
   
        const voucherInput = form.querySelector('input[name="voucher"]');
        const ticketInput = form.querySelector('input[name="ticketId"]');
        const quantityInput = form.querySelector('input[name="quantity"]');
        
        if (voucherInput) voucherInput.value = voucherCode;
        if (ticketInput) ticketInput.value = selectedTicket?.id || '';
        if (quantityInput) quantityInput.value = quantity.toString();
        
   
        form.requestSubmit();
        
   
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Voucher check timed out')), 5000);
        });
        
     
        await Promise.race([
          new Promise(resolve => setTimeout(resolve, 500)), 
          timeoutPromise
        ]);
        
      } catch (error) {
        console.error('Voucher check error:', error);
        voucherStatus = false;
        voucherMessage = 'Error checking voucher: ' + (error.message || 'Unknown error');
        discount = 0;
      } finally {
        isCheckingVoucher = false;
        calculateTotal();
      }
    }
	
	
	let debounceTimer;
	function debounceVoucherCheck() {
	  clearTimeout(debounceTimer);
	  debounceTimer = setTimeout(() => {
	    if (voucherCode && selectedTicket) {
	      checkVoucher();
	    }
	  }, 300); 
	}
	
	
	function adjustQuantity(amount) {
	  const newQuantity = quantity + amount;
	  if (newQuantity >= 1 && (!selectedTicket || newQuantity <= selectedTicket.remainingTickets)) {
		quantity = newQuantity;
		calculateTotal();
		
		
		if (voucherCode && selectedTicket && voucherStatus) {
		
	
		  if (voucherStatus === true) {
		 
		    const validVouchers = {
		      'DISCOUNT40': 0.4,
		      'EARLYBIRD': 0.15,
		      'VIP20': 0.2
		    };
		    const rate = validVouchers[voucherCode.toUpperCase()] || 0;
		    if (rate > 0) {
		      discount = Math.round(selectedTicket.price * quantity * rate);
		      calculateTotal();
		    }
		  }
		  debounceVoucherCheck();
		}
	  }
	}
	
	function handleNext() {
	  if (!selectedTicket) {
		alert('Please select a ticket type');
		return;
	  }
	  
	  console.log('Proceeding to next step with:', {
		ticket: selectedTicket,
		quantity: quantity,
		voucher: voucherCode,
		discount: discount,
		total: total
	  });
	}
	
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
	
	
	function updateTicketAvailability() {
	  const now = new Date();
	  
	  ticketTypes = ticketTypes.map(ticket => {
	   
	    if (!ticket.availableFrom && !ticket.availableUntil) return ticket;
	    
	    const availableFrom = ticket.availableFrom ? new Date(ticket.availableFrom) : null;
	    const availableUntil = ticket.availableUntil ? new Date(ticket.availableUntil) : null;
	    
	  
	    if (availableFrom && availableUntil) {
	      if (now >= availableFrom && now <= availableUntil) {
	       
	        return {
	          ...ticket,
	          available: true,
	          availableIn: null
	        };
	      } else if (now > availableUntil) {
	    
	        return {
	          ...ticket,
	          available: false,
	          availableIn: null,
	          soldOut: true
	        };
	      } else if (now < availableFrom) {
	     
	        const diffMs = availableFrom - now;
	        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
	        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
	        
	        let availableIn;
	        if (days > 0) {
	          availableIn = `${days}d ${hours}h ${minutes}m`;
	        } else if (hours > 0) {
	          availableIn = `${hours}h ${minutes}m ${seconds}s`;
	        } else if (minutes > 0) {
	          availableIn = `${minutes}m ${seconds}s`;
	        } else {
	          availableIn = `${seconds}s`;
	        }
	        
	        return {
	          ...ticket,
	          available: false,
	          availableIn
	        };
	      }
	    }
	    
	    return ticket;
	  });
	  
	 
	  if (selectedTicket && !ticketTypes.find(t => t.id === selectedTicket.id)?.available) {
	 
	    const updatedSelectedTicket = ticketTypes.find(t => t.id === selectedTicket.id);
	    
	    if (updatedSelectedTicket.soldOut) {
	    
	      selectedTicket = null;
	      alert(`The ${updatedSelectedTicket.name} tickets are now sold out.`);
	    } else if (!updatedSelectedTicket.available) {
	    
	      selectedTicket = null;
	      alert(`The ${updatedSelectedTicket.name} tickets are not available at this time.`);
	    }
	  }
	}
	
	onMount(() => {
	
	  updateTicketAvailability();
	  
	 
	  availabilityInterval = setInterval(() => {
	    updateTicketAvailability();
	  }, 1000);
	  
	  const defaultTicket = ticketTypes.find(t => t.id === 'vip' && t.available);
	  if (defaultTicket) {
		selectTicket(defaultTicket);
	  }

	  if (form?.voucherError) {
		voucherStatus = false;
		voucherMessage = form.voucherError;
	  }
	  
	  if (form?.voucherValid) {
		voucherStatus = true;
		voucherMessage = `Voucher applied! You saved ₱${form.discount.toLocaleString()}`;
		discount = form.discount;
		calculateTotal();
	  }
	  
	  
	  return () => {
	    if (availabilityInterval) {
	      clearInterval(availabilityInterval);
	    }
	  };
	});
	
	$: {
	  if (selectedTicket) {
		calculateTotal();
	  }
	}
</script>

<svelte:head>
  <style>
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
    
        {#if ticket.soldOut}
          <div class="relative overflow-hidden min-h-24 rounded border-l-4 {getTicketClass(ticket)}">
            <div class="p-4">
              <h3 class="m-0 mb-1">{ticket.name}</h3>
              <p class="text-2xl font-bold m-0">₱ {ticket.price.toLocaleString()}</p>
            </div>
            <div class="absolute inset-0 overlay-blur flex items-center justify-center font-bold text-lg cursor-not-allowed">
              SOLD OUT
            </div>
          </div>
        {:else if ticket.availableIn}
          <div class="relative overflow-hidden min-h-24 rounded border-l-4 {getTicketClass(ticket)}">
            <div class="p-4">
              <h3 class="m-0 mb-1">{ticket.name}</h3>
              <p class="text-2xl font-bold m-0">₱ {ticket.price.toLocaleString()}</p>
            </div>
            <div class="absolute inset-0 overlay-blur flex flex-col items-center justify-center font-bold text-center cursor-not-allowed">
              AVAILABLE IN<br />
              {ticket.availableIn}
            </div>
          </div>
        {:else}
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
  
  <section class="mb-5">
    <h2 class="text-xl mb-4">Voucher (Optional)</h2>
    
    <form 
      id="voucherForm" 
      method="POST" 
      action="?/validateVoucher"
      use:enhance={({ formData }) => {
      
        isCheckingVoucher = true;
        
        return async ({ result }) => {
         
          isCheckingVoucher = false;
          
          if (result.type === 'success') {
            if (result.data && result.data.voucherValid) {
              voucherStatus = true;
              voucherMessage = `Voucher applied! You saved ₱${result.data.discount.toLocaleString()}`;
              discount = result.data.discount;
            } else if (result.data && result.data.voucherError) {
              voucherStatus = false;
              voucherMessage = result.data.voucherError;
              discount = 0;
            } else {
              voucherStatus = false;
              voucherMessage = 'Server returned invalid response';
              discount = 0;
            }
          } else if (result.type === 'failure') {
            voucherStatus = false;
            voucherMessage = result.data?.voucherError || 'Invalid voucher code';
            discount = 0;
          } else {
            voucherStatus = false;
            voucherMessage = 'Unexpected server response';
            discount = 0;
          }
          
          calculateTotal();
        };
      }}
    >
      <div class="flex gap-2">
        <input 
          type="text" 
          name="voucher"
          placeholder="Enter voucher code" 
          bind:value={voucherCode}
          class="flex-1 p-3 border-none rounded bg-gray-300 text-gray-800 text-base"
        />
        
        <input type="hidden" name="ticketId" value={selectedTicket?.id || ''} />
        <input type="hidden" name="quantity" value={quantity} />
        
        <button 
          type="submit" 
          class="px-5 bg-green-500 text-white border-none rounded font-bold cursor-pointer transition hover:bg-green-600 disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isCheckingVoucher || !voucherCode.trim() || !selectedTicket}
        >
          {isCheckingVoucher ? 'Checking...' : 'Apply'}
        </button>
      </div>
      
      {#if voucherMessage}
        <div class="mt-2 p-2 rounded text-sm {voucherStatus ? 'bg-green-500 bg-opacity-20 text-black' : 'bg-red-500 bg-opacity-20 text-gray-900'}">
          {voucherMessage}
        </div>
      {/if}
    </form>
  </section>
  
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