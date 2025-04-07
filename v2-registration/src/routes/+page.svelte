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
	
	// Set an initial selected ticket
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
	
	// Helper function to get appropriate CSS class for ticket background
	function getTicketClass(ticket) {
	  const classes = {
		'vvip': 'vvip',
		'vip': 'vip',
		'patronA': 'patron-a',
		'patronB': 'patron-b',
		'lowerBox': 'lower-box',
		'upperBox': 'upper-box',
		'standingA': 'standing-a',
		'standingB': 'standing-b'
	  };
	  
	  return classes[ticket.id] || '';
	}
	
	// Watch for changes in quantity and recalculate
	$: {
	  if (selectedTicket) {
		calculateTotal();
	  }
	}
  </script>
  
  <div class="booking-container">
	<h1>Booking Details</h1>
	
	<section class="ticket-section">
	  <h2>Select Tickets</h2>
	  
	  <div class="ticket-grid">
		{#each ticketTypes as ticket, index}
		  <!-- Render different ticket layouts based on availability and status -->
		  {#if ticket.soldOut}
			<!-- Sold Out Ticket -->
			<div class="ticket {getTicketClass(ticket)} sold-out">
			  <div class="ticket-content">
				<h3>{ticket.name}</h3>
				<p class="price">₱ {ticket.price.toLocaleString()}</p>
			  </div>
			  <div class="sold-out-overlay">SOLD OUT</div>
			</div>
		  {:else if ticket.availableIn}
			<!-- Time-restricted Ticket -->
			<div class="ticket {getTicketClass(ticket)}">
			  <div class="ticket-content">
				<h3>{ticket.name}</h3>
				<p class="price">₱ {ticket.price.toLocaleString()}</p>
			  </div>
			  <div class="available-overlay">
				AVAILABLE IN<br />
				{ticket.availableIn}
			  </div>
			</div>
		  {:else}
			<!-- Available Ticket -->
			<div 
			  class="ticket {getTicketClass(ticket)}" 
			  class:selected={selectedTicket?.id === ticket.id} 
			  on:click={() => selectTicket(ticket)}
			>
			  <div class="ticket-content">
				<h3>{ticket.name}</h3>
				<p class="price">₱ {ticket.price.toLocaleString()}</p>
				{#if ticket.remainingTickets !== undefined}
				  <p class="remaining">Ticket left: {ticket.remainingTickets}/{ticket.totalTickets}</p>
				{/if}
			  </div>
			  {#if selectedTicket?.id === ticket.id}
				<div class="checkmark">✓</div>
			  {/if}
			</div>
		  {/if}
		{/each}
	  </div>
	  
	  <!-- Date restricted tickets (**unnecessary**)
	  <div class="date-restriction-grid">
		<div class="date-restriction">
		  <p>ONLY AVAILABLE BETWEEN</p>
		  <p class="dates">{restrictedDates.start} and {restrictedDates.end}</p>
		</div>
		
		<div class="date-restriction">
		  <p>ONLY AVAILABLE BETWEEN</p>
		  <p class="dates">{restrictedDates.start} and {restrictedDates.end}</p>
		</div>
	  </div>
	</section>-->
	
	<!-- Voucher Section -->
	<section class="voucher-section">
	  <h2>Voucher (Optional)</h2>
	  
	  <form id="voucherForm" method="POST" action="?/validateVoucher">
		<div class="voucher-input-group">
		  <input 
			type="text" 
			name="voucher"
			placeholder="Enter voucher code" 
			bind:value={voucherCode}
		  />
		  
		  <input type="hidden" name="ticketId" value={selectedTicket?.id || ''} />
		  
		  <button 
			type="button" 
			class="apply-voucher" 
			on:click={checkVoucher} 
			disabled={isCheckingVoucher || !voucherCode.trim() || !selectedTicket}
		  >
			{isCheckingVoucher ? 'Checking...' : 'Apply'}
		  </button>
		</div>
		
		{#if voucherMessage}
		  <div class="voucher-message" class:voucher-valid={voucherStatus} class:voucher-invalid={voucherStatus === false}>
			{voucherMessage}
		  </div>
		{/if}
	  </form>
	</section>
	
	<!-- Quantity and Total Section -->
	<section class="checkout-section">
	  <div class="quantity-control">
		<span>Quantity</span>
		<div class="quantity-buttons">
		  <button on:click={() => adjustQuantity(-1)} disabled={quantity <= 1}>−</button>
		  <span>{quantity}</span>
		  <button on:click={() => adjustQuantity(1)} disabled={selectedTicket && quantity >= selectedTicket.remainingTickets}>+</button>
		</div>
	  </div>
	  
	  <p class="registration-note">Single registration will be used</p>
	  
	  {#if discount > 0}
		<div class="pricing-breakdown">
		  <div class="pricing-row">
			<span>Subtotal:</span>
			<span>₱ {(selectedTicket?.price * quantity).toLocaleString()}</span>
		  </div>
		  <div class="pricing-row discount">
			<span>Discount:</span>
			<span>- ₱ {discount.toLocaleString()}</span>
		  </div>
		</div>
	  {/if}
	  
	  <div class="total">
		<span>Total:</span>
		<span class="total-price">₱ {total.toLocaleString()}</span>
	  </div>
	  
	  <button class="next-button" on:click={handleNext} disabled={!selectedTicket}>
		NEXT
	  </button>
	</section>
  </div>
  
  <style>
	/* Base styles */
	:global(body) {
	  margin: 0;
	  padding: 0;
	  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
	  background-color: #1e293b;
	  color: white;
	}
	
	.booking-container {
	  max-width: 800px;
	  margin: 0 auto;
	  padding: 20px;
	}
	
	h1 {
	  font-size: 1.5rem;
	  margin-bottom: 1.5rem;
	}
	
	h2 {
	  font-size: 1.25rem;
	  margin-bottom: 1rem;
	}
	
	/* Ticket grid */
	.ticket-grid {
	  display: grid;
	  grid-template-columns: 1fr 1fr;
	  gap: 15px;
	  margin-bottom: 15px;
	}
	
	.ticket {
	  position: relative;
	  border-radius: 4px;
	  overflow: hidden;
	  min-height: 100px;
	  cursor: pointer;
	  transition: transform 0.2s;
	  border-left: 4px solid;
	}
	
	.ticket:hover:not(.sold-out) {
	  transform: translateY(-2px);
	}
	
	.ticket-content {
	  padding: 15px;
	}
	
	.ticket h3 {
	  margin: 0 0 5px 0;
	}
	
	.price {
	  font-size: 1.5rem;
	  font-weight: bold;
	  margin: 0;
	}
	
	.remaining {
	  font-size: 0.8rem;
	  margin: 5px 0 0 0;
	}
	
	/* Ticket types styling */
	.vvip {
	  background-color: #8B4513;
	  border-left-color: #CD853F;
	  color: white;
	}
	
	.vip {
	  background-color: #FFD700;
	  border-left-color: #FFA500;
	  color: black;
	}
	
	.patron-a {
	  background-color: #FFD700;
	  border-left-color: #FFA500;
	  color: black;
	}
	
	.patron-b {
	  background-color: white;
	  border-left-color: #4CAF50;
	  color: black;
	}
	
	.lower-box {
	  background-color: #800080;
	  border-left-color: #9932CC;
	  color: white;
	}
	
	.upper-box {
	  background-color: #008080;
	  border-left-color: #00CED1;
	  color: white;
	}
	
	.standing-a, .standing-b {
	  background-color: white;
	  color: black;
	}
	
	.standing-a {
	  border-left-color: #FF0000;
	}
	
	.standing-b {
	  border-left-color: #FF0000;
	}
	
	/* Overlays */
	.sold-out-overlay {
	  position: absolute;
	  top: 0;
	  left: 0;
	  right: 0;
	  bottom: 0;
	  background-color: rgba(0, 0, 0, 0.7);
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  font-weight: bold;
	  font-size: 1.2rem;
	}
	
	.available-overlay {
	  position: absolute;
	  top: 0;
	  left: 0;
	  right: 0;
	  bottom: 0;
	  background-color: rgba(0, 0, 0, 0.7);
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  flex-direction: column;
	  text-align: center;
	  font-weight: bold;
	}
	
	.checkmark {
	  position: absolute;
	  top: 10px;
	  right: 10px;
	  color: green;
	  font-size: 1.5rem;
	}
	
	/* Date restriction section */
	.date-restriction-grid {
	  display: grid;
	  grid-template-columns: 1fr 1fr;
	  gap: 15px;
	  margin-bottom: 20px;
	}
	
	.date-restriction {
	  background-color: rgba(0, 0, 0, 0.7);
	  border-radius: 4px;
	  padding: 15px;
	  text-align: center;
	}
	
	.date-restriction p {
	  margin: 0;
	  font-size: 0.85rem;
	}
	
	.dates {
	  font-weight: bold;
	}
	
	/* Voucher section */
	.voucher-section {
	  margin-bottom: 20px;
	}
	
	.voucher-input-group {
	  display: flex;
	  gap: 10px;
	}
	
	input {
	  flex: 1;
	  padding: 12px;
	  border: none;
	  border-radius: 4px;
	  background-color: #D3D3D3;
	  color: #333;
	  font-size: 1rem;
	}
	
	.apply-voucher {
	  padding: 0 20px;
	  background-color: #4CAF50;
	  color: white;
	  border: none;
	  border-radius: 4px;
	  font-weight: bold;
	  cursor: pointer;
	  transition: background-color 0.2s;
	}
	
	.apply-voucher:hover:not(:disabled) {
	  background-color: #45a049;
	}
	
	.apply-voucher:disabled {
	  background-color: #cccccc;
	  cursor: not-allowed;
	  opacity: 0.7;
	}
	
	.voucher-message {
	  margin-top: 10px;
	  padding: 8px;
	  border-radius: 4px;
	  font-size: 0.9rem;
	}
	
	.voucher-valid {
	  background-color: rgba(76, 175, 80, 0.2);
	  color: #4CAF50;
	}
	
	.voucher-invalid {
	  background-color: rgba(244, 67, 54, 0.2);
	  color: #F44336;
	}
	
	/* Checkout section */
	.checkout-section {
	  background-color: black;
	  border-radius: 4px;
	  padding: 20px;
	}
	
	.quantity-control {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 15px;
	}
	
	.quantity-buttons {
	  display: flex;
	  align-items: center;
	  background-color: #424242;
	  border-radius: 20px;
	}
	
	.quantity-buttons button {
	  width: 36px;
	  height: 36px;
	  border-radius: 50%;
	  border: none;
	  background-color: transparent;
	  color: white;
	  font-size: 1.2rem;
	  cursor: pointer;
	}
	
	.quantity-buttons button:disabled {
	  opacity: 0.5;
	  cursor: not-allowed;
	}
	
	.quantity-buttons span {
	  width: 40px;
	  text-align: center;
	}
	
	.registration-note {
	  color: #888;
	  font-size: 0.8rem;
	  margin-bottom: 15px;
	}
	
	.pricing-breakdown {
	  margin-bottom: 15px;
	  border-bottom: 1px solid #333;
	  padding-bottom: 10px;
	}
	
	.pricing-row {
	  display: flex;
	  justify-content: space-between;
	  margin-bottom: 5px;
	  font-size: 0.9rem;
	  color: #aaa;
	}
	
	.discount {
	  color: #4CAF50;
	}
	
	.total {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 20px;
	}
	
	.total-price {
	  font-size: 1.5rem;
	  font-weight: bold;
	}
	
	.next-button {
	  width: 100%;
	  padding: 15px;
	  background-color: #E53935;
	  color: white;
	  border: none;
	  border-radius: 4px;
	  font-size: 1rem;
	  font-weight: bold;
	  cursor: pointer;
	  transition: background-color 0.2s;
	}
	
	.next-button:hover:not(:disabled) {
	  background-color: #D32F2F;
	}
	
	.next-button:disabled {
	  opacity: 0.7;
	  cursor: not-allowed;
	}
	
	/* Selected ticket styling */
	.selected {
	  box-shadow: 0 0 0 2px #4CAF50;
	}
  </style>