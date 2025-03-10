<script lang="ts">
    import { onMount } from 'svelte';
    import type { Guest } from '$lib/types/data/guests';
    import { guests } from '$lib/types/data/guests';
    import flatpickr from 'flatpickr';
    import 'flatpickr/dist/flatpickr.css';
    
    export let isOpen = false;
    export let closeModal: () => void;
    
    let showSchedule = false;
    let recipients = "all";
    let subject = "";
    let message = "";
    let showRecipientsList = false;
    let scheduleDate: string;
    let scheduleTime: string;
    let timezone = "GMT+08:00 Manila";
    let showGuestSearch = false;
    let guestSearchQuery = "";
    let minDate: string;
    let datePickerElement: HTMLInputElement;
    let timePickerElement: HTMLInputElement;
    
    $: filteredGuests = guests.filter(guest => 
      guest.name.toLowerCase().includes(guestSearchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(guestSearchQuery.toLowerCase())
    );
  
    onMount(() => {
      const now = new Date();
      const offset = now.getTimezoneOffset() + (8 * 60);
      const manilaDate = new Date(now.getTime() + (offset * 60 * 1000));
      
      scheduleDate = manilaDate.toISOString().split('T')[0];
      scheduleTime = manilaDate.toTimeString().slice(0, 5);
      minDate = manilaDate.toISOString().split('T')[0];
    });
    
    $: if (showSchedule && datePickerElement && timePickerElement) {
      flatpickr(datePickerElement, {
        enableTime: false,
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: (selectedDates) => {
          if (selectedDates[0]) {
            scheduleDate = selectedDates[0].toISOString().split('T')[0];
          }
        },
        static: true,
        disableMobile: true,
        position: "auto center",
        positionElement: datePickerElement,
        appendTo: document.body
      });
  
      flatpickr(timePickerElement, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
        time_24hr: false,
        minuteIncrement: 15,
        onChange: (selectedDates) => {
          if (selectedDates[0]) {
            scheduleTime = selectedDates[0].toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
          }
        },
        static: true,
        disableMobile: true,
        position: "auto center",
        positionElement: timePickerElement,
        appendTo: document.body
      });
    }
    
    const sendBlast = () => {
      console.log({
        recipients,
        subject,
        message,
        scheduleDate: showSchedule ? scheduleDate : null,
        scheduleTime: showSchedule ? scheduleTime : null
      });
      closeModal();
    };
  
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('modal-overlay')) {
        closeModal();
      }
    }
  
    function toggleSchedule() {
      showSchedule = !showSchedule;
    }
  
    function toggleGuestSearch() {
      showGuestSearch = !showGuestSearch;
      if (showGuestSearch) {
        showRecipientsList = false;
      }
    }
  
    function selectGuest(guest: Guest) {
      guestSearchQuery = guest.name;
      showGuestSearch = false;
    }
  </script>
  
  <svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
  
  </svelte:head>
  
  {#if isOpen}
    <div 
      class="fixed inset-0 bg-opacity-30 backdrop-blur-[2.8px] flex items-center justify-center p-2 sm:p-4 z-50 modal-overlay"
      on:click={handleOutsideClick}
    >
      <div class="bg-white p-4 sm:p-6 rounded-2xl w-full max-w-lg shadow-xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-start justify-between mb-4 sm:mb-6">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Send Blast</h2>
              <p class="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                Guests will receive the blast via email, SMS or in-app notification.
              </p>
            </div>
          </div>
          <button 
            class="text-gray-400 hover:text-gray-600 transition-colors -mt-1"
            on:click={closeModal}
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        <!-- Form Fields -->
        <div class="space-y-4 sm:space-y-6">
          <!-- Recipients Search -->
          <div class="space-y-1.5 sm:space-y-2">
            <label class="block text-sm font-medium text-gray-700">Recipients</label>
            <div class="relative">
              <input
                type="text"
                placeholder="Search guests..."
                bind:value={guestSearchQuery}
                on:focus={toggleGuestSearch}
                class="w-full p-2 sm:p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-9 sm:pl-10"
              />
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-2.5 sm:left-3 top-2.5 sm:top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              
              {#if showGuestSearch && guestSearchQuery.length > 0}
                <div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div class="max-h-36 sm:max-h-48 overflow-y-auto">
                    {#each filteredGuests as guest}
                      <button
                        class="w-full px-3 sm:px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2 sm:gap-3"
                        on:click={() => selectGuest(guest)}
                      >
                        <img src={guest.avatar} alt={guest.name} class="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
                        <div>
                          <div class="font-medium text-sm">{guest.name}</div>
                          <div class="text-gray-500 text-xs">{guest.email}</div>
                        </div>
                      </button>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>
  
          <!-- Message -->
          <div class="space-y-1.5 sm:space-y-2">
            <label class="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              bind:value={message}
              rows="4"
              class="w-full p-2 sm:p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your message..."
            ></textarea>
          </div>
  
          <!-- Schedule (Hidden by default) -->
          {#if showSchedule}
            <div class="space-y-1.5 sm:space-y-2">
              <label class="block text-sm font-medium text-gray-700">Schedule For</label>
              <div class="grid grid-cols-2 gap-2 sm:gap-3 relative">
                <div class="relative">
                  <input
                    type="text"
                    bind:this={datePickerElement}
                    placeholder="Select date"
                    class="w-full p-2 sm:p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    readonly
                  />
                </div>
                <div class="relative">
                  <input
                    type="text"
                    bind:this={timePickerElement}
                    placeholder="Select time"
                    class="w-full p-2 sm:p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    readonly
                  />
                </div>
              </div>
              <div class="flex items-center sm:gap-1 text-xs sm:text-sm text-gray-500">
                <svg class="w-3 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{timezone}</span>
              </div>
            </div>
          {/if}
        </div>
  
        <!-- Modal Actions -->
        <div  class="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-between gap-3">
          <button 
            class="w-full sm:w-auto px-4 py-2 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            on:click={closeModal}
          >
            Cancel
          </button>
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button 
            type="button"
              class="w-full sm:w-auto cursor-pointer px-4 sm:px-6 py-2 sm:py-2.5 bg-[#DF4D60] text-white rounded-lg hover:bg-[#eb6d80] transition-colors text-sm font-medium flex items-center justify-center gap-2"
              on:click={toggleSchedule}
  
            >
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Schedule
            </button>
            <button 
            type="button"
              class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              on:click={sendBlast}
            >
              {showSchedule ? 'Schedule Blast' : 'Send Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}