<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Toaster, toast } from 'svelte-sonner'

    export let attendee: {
      name: string;
      status: string;
      date: string;
      time: string;
      id: string;
    };
    
    const dispatch = createEventDispatcher();

    let buttonsDisabled = false;
  
    function close() {
      dispatch('close');
    }
  

    $: isCheckedIn = attendee.status === 'IN';
    // $: buttonText = 'Check In';
    $: buttonText = attendee.status === 'IN' ? 'Check In' : 'Undo Check Out';
    $: buttonColor = attendee.status === 'OUT' ? 'bg-red-500 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600';
    $: statusText = attendee.status === 'OUT' ? 'Checked out' : 'Checked in';
  </script>

  <Toaster richColors position="top-center"  />

  <div class="fixed inset-0 bg-black bg-opacity-50 z-40" on:click={close}></div>
  

  <div class="fixed inset-0 flex items-center justify-center z-50 px-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md" on:click|stopPropagation>
      <div class="p-6">
        <!-- Title -->
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {attendee.name}
        </h3>
  

        <div class="flex items-center gap-2 mb-4">
          <span class="text-sm text-gray-500">Ticket No.</span>
          <span class="text-sm font-medium text-green-900 bg-green-200 rounded-full px-6 ml-3">#{attendee.id}</span>
        </div>
  

        <div class="bg-gray-200 rounded-md p-3 mb-6 ">
          <div class="flex items-center gap-2 ">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="2"/>
              <path d="M12 8v4l2 2" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div class="flex flex-col"> 
                <span class="text-sm text-gray-500 ">{statusText}</span>
                <span class="text-sm text-gray-500 ">{attendee.date} - {attendee.time}</span>
            </div>
            
          </div>
        </div>
  

        <div class="flex gap-3">

          <button
          class="flex-1 px-4 py-2 text-white rounded-md transition-colors {buttonColor}"
          on:click={() => {
            console.log(attendee.status);
            dispatch('checkIn');
            if (attendee.status === 'OUT') {
              toast.warning('Undo Checked Out', {
                duration: 3000, 
                  
              });
              setTimeout(close, 1000); 
              return;

            } else { 
              toast.success('Checked In', {
                duration: 3000, 
              }); 
             
              setTimeout(close, 1000); 
              return;
              
            }
            buttonsDisabled = true;
            close(); 
          }}
          disabled={buttonsDisabled}
        >
          {buttonText}
        </button>

            <button
              class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              on:click={close}
              disabled={buttonsDisabled}
            >
              Close
            </button>
          </div>
      </div>

    </div>
  </div>