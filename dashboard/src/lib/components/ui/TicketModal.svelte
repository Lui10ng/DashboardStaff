<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import QRCode from 'qrcode';
  
    export let isOpen = false;
    export let guest: any;
    export let onClose: () => void;
  
    let qrCodeDataUrl = '';
    const ticketCode = 'ZLKU8HEFYSMWC1GLWXYN';
  
    onMount(async () => {
      qrCodeDataUrl = await QRCode.toDataURL(ticketCode, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000',
          light: '#fff'
        }
      });
    });
  
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    };
  </script>
  
  <style>
    .modal-container {
      max-height: calc(100vh - 2rem);
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #CBD5E0 transparent;
    }
  
    .modal-container::-webkit-scrollbar {
      width: 6px;
    }
  
    .modal-container::-webkit-scrollbar-track {
      background: transparent;
    }
  
    .modal-container::-webkit-scrollbar-thumb {
      background-color: #CBD5E0;
      border-radius: 3px;
    }
  
    @media (max-width: 640px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
  
  {#if isOpen}
  <div 
    class="fixed inset-0 bg-opacity-30 backdrop-blur-[1px] bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50"
    on:click={onClose} 
  >
    <div 
      class="modal-container bg-white rounded-xl shadow-2xl w-full max-w-2xl relative flex flex-col"
      on:click|stopPropagation
    >
      <!-- Close button -->
      <button
        on:click={onClose}
        class="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 p-2 z-10"
      >
        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
  
      <!-- Header -->
      <div class="p-4 sm:p-6 border-b border-gray-100">
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">Event Ticket</h1>
      </div>
  
      <!-- QR Code Section -->
      <div class="p-4 sm:p-6 flex flex-col items-center border-b border-gray-100">
        {#if qrCodeDataUrl}
          <img src={qrCodeDataUrl} alt="QR Code" class="mb-3 w-40 sm:w-48" />
        {/if}
        
        <p class="text-gray-600 font-mono text-xs sm:text-sm break-all text-center">{ticketCode}</p>
      </div>
  
      <!-- Ticket Information -->
      <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <!-- Location Info -->
        <div class="space-y-2 sm:space-y-3">
          <h2 class="text-base sm:text-lg font-medium text-gray-900">Location</h2>
          <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p class="text-xs sm:text-sm text-gray-500">Region</p>
              <p class="text-sm sm:text-base text-gray-900">Region X</p>
            </div>
            <div>
              <p class="text-xs sm:text-sm text-gray-500">City</p>
              <p class="text-sm sm:text-base text-gray-900">Cagayan de Oro City</p>
            </div>
          </div>
        </div>
  
        <!-- Personal Info -->
        <div class="space-y-2 sm:space-y-3">
          <h2 class="text-base sm:text-lg font-medium text-gray-900">Personal Information</h2>
          <div class="grid info-grid gap-3 sm:gap-4">
            <div>
              <p class="text-xs sm:text-sm text-gray-500">Name</p>
              <p class="text-sm sm:text-base text-gray-900">{guest?.name || 'N/A'}</p>
            </div>
            <div>
              <p class="text-xs sm:text-sm text-gray-500">Contact</p>
              <p class="text-sm sm:text-base text-gray-900">N/A</p>
            </div>
            <div class="col-span-2">
              <p class="text-xs sm:text-sm text-gray-500">Email</p>
              <p class="text-sm sm:text-base text-gray-900 break-words">{guest?.email || 'N/A'}</p>
            </div>
          </div>
        </div>
  
        <!-- Ticket Details -->
        <div class="space-y-2 sm:space-y-3">
          <h2 class="text-base sm:text-lg font-medium text-gray-900">Ticket Details</h2>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs sm:text-sm text-gray-500">Event</span>
              <span class="text-sm sm:text-base text-gray-900">Tj monterde</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs sm:text-sm text-gray-500">Price</span>
              <span class="text-sm sm:text-base text-gray-900">₱500</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs sm:text-sm text-gray-500">Voucher</span>
              <span class="text-sm sm:text-base text-gray-900">10PEOPLEFREEV (50% Discount)</span>
            </div>
          </div>
        </div>
  
        <!-- Payment Information -->
        <div class="space-y-2 sm:space-y-3">
          <h2 class="text-base sm:text-lg font-medium text-gray-900">Payment Information</h2>
          <div class="space-y-2">
            <div class="flex justify-between items-center flex-wrap gap-1">
              <span class="text-xs sm:text-sm text-gray-500">Reference #</span>
              <span class="text-sm sm:text-base text-gray-900 break-all">WKC28G5NRHSAUFB6UWDS - gcash</span>
            </div>
            <div class="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
              <p class="text-sm sm:text-base text-gray-900">Tj monterde - 2 2 - (₱250.00)</p>
              <p class="text-sm sm:text-base text-gray-900">Convenience Fee - 2 2 - (₱20.00)</p>
              <div class="border-t border-gray-200 mt-2 pt-2">
                <p class="text-sm sm:text-base text-gray-900">Transaction amount: ₱270</p>
                <p class="text-xs sm:text-sm text-gray-500">- ₱13.5 (Transaction Fee 5%)</p>
                <p class="text-xs sm:text-sm text-gray-500">- ₱20 (Convenience Fee)</p>
                <p class="text-sm sm:text-base font-medium text-gray-900">= ₱236.5</p>
              </div>
            </div>
            <div class="flex justify-between items-center flex-wrap gap-1">
              <span class="text-xs sm:text-sm text-gray-500">Date & Time</span>
              <span class="text-sm sm:text-base text-gray-900">{formatDate('2025-01-31T01:31:20.057Z')}</span>
            </div>
          </div>
        </div>
  
        <!-- Actions -->
        <div class="flex gap-4 pt-4">
          <button class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Resend Email
          </button>
          <button class="flex-1 px-4 py-2 text-white bg-[#DF4D60] rounded-lg hover:bg-[#eb6d80] transition-colors">
            Download Ticket
          </button>
        </div>
      </div>
    </div>
  </div>
  {/if}