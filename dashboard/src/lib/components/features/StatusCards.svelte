<script lang="ts">
    import { goto } from '$app/navigation';
    import { attendees } from '../../stores/attendees';
    
    
    
  
    function Attendee() {
        goto('/DesktopQr?view=attendees'); 
    }

  </script>
  
  <div class="grid grid-cols-1 gap-4 mt-4">
    <div class="bg-white rounded-lg  p-4 md:p-6 border border-black-900">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-black text-sm font-medium">Total Registered</h3>
          <div class="flex items-baseline mt-1">
            <span class="text-5xl md:text-5xl font-bold text-gray-800">{$attendees.length}</span>
            <span class="ml-2 text-xs md:text-sm text-gray-600">Attendees</span>
          </div>
        </div>
        <button 
            on:click={Attendee}
            class="block md:hidden text-gray-600 text-sm bg-gray-100 hover:bg-gray-200 rounded-md p-2 w-3xl"
        >
            View All Attendees
        </button>
      </div>
    </div>
  
    <div class="bg-white rounded-lg p-4 md:p-6 border border-black-900">
      <div class="flex justify-between items-center">
        <h3 class="text-gray-600 text-sm font-medium">Event Status</h3>
        <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Live</span>
      </div>
      <button 
        class="mt-3 w-full flex items-center justify-center text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md p-2"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        Manage Event
      </button>
    </div>
  </div>