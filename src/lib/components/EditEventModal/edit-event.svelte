<script lang="ts">
  let eventName = "";
  let eventDescription = "";
  let subdomain = "";
  let eventAddress = "";
  let today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  let startDate = today;
  let startTime = "19:30";
  let endDate = today;
  let endTime = "19:30";
  let isRecurring = false;
</script>

<!-- Content -->
 <div class="mb-6">
  <h2 class="text-xl font-semibold text-gray-900 mb-2">Basic information</h2>
      <p class="text-sm text-gray-500">
          Edit your event details below. Changes update automatically on your website.
      </p>

 </div>
 <hr class="border-t border-gray-300 mb-6">

<div class="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">
  <!-- Left Column (All input fields except Rich Text Editor) -->
  <div class="max-w-xl space-y-6">
      
      <!-- Event Name -->
      <div>
          <label for="event-name" class="block text-sm font-medium">Event name</label>
          <input
              type="text"
              id="event-name"
              class="mt-1 block w-full rounded-md bg-[#F7F8FA] px-3 py-2 focus:outline-none focus:bg-[#e9ecf3] placeholder:text-[13px] placeholder:text-[#3E3E3F]"
              placeholder="Enter Event name"
          />
      </div>

      <!-- Subdomain -->
      <div>
        <label for="subdomain" class="block text-sm font-medium text-gray-700">
          Subdomain (Subdomain.veent.co)
        </label>
        
        <!-- Wrapper that changes background on focus -->
        <div class="mt-1 flex items-center rounded-md bg-[#F7F8FA] px-3 py-2 group focus-within:bg-[#e9ecf3]">
          <img src="icons/globe.png" alt="Globe Icon" class="h-4 w-4 text-gray-500" />
          
          <!-- Input Field -->
          <input
            type="text"
            id="subdomain"
            class="ml-2 block w-full bg-transparent focus:outline-none placeholder:text-[13px] placeholder:text-[#3E3E3F]"
            placeholder="Enter Subdomain"
          />
      
          <!-- Domain Extension -->
          <span class="text-[13px] text-[#3E3E3F]">
            .veent.co
          </span>
        </div>
      </div>
      
      
      

      <!-- Event Address -->
      <div>
        <label for="event-address" class="block text-sm font-medium text-gray-700">
          Event address
        </label>
        <div class="relative mt-1">
          <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <!-- Location SVG Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-9.166 8-13a8 8 0 10-16 0c0 3.834 8 13 8 13z" />
              <circle cx="12" cy="9" r="3" stroke="currentColor" stroke-width="2" fill="none" />
            </svg>
          </span>
          <input
            type="text"
            id="event-address"
            class="block w-full rounded-md bg-[#F7F8FA] px-3 py-2 pl-10 focus:outline-none placeholder:text-[13px] placeholder:text-[#3E3E3F] focus:bg-[#e9ecf3]"
            placeholder="Enter Event address"
          />
        </div>
      </div>
      
      

      <!-- Event Date -->
      <div class="space-y-4">
        
          <label class="text-sm font-medium text-gray-700">Event date</label>
          <div class="mt-4">
              <label class="inline-flex">
                  <input type="checkbox" class="rounded border-gray-300 text-blue-600 " />
                  <span class="ml-2 text-sm text-gray-700">Recurring event</span>
              </label>
          </div>
        <!-- Start Date/Time -->
        <div class="flex items-center gap-4">
          <label class="text-sm font-medium text-gray-700 w-12">Start</label>
          <div class="flex flex-col sm:flex-row gap-2 w-full">
            <input 
                      type="date" 
                      class=" text-[14px] tracking-wider w-full rounded-md bg-[#F7F8FA] px-3 py-2   focus:outline-none focus:bg-[#e9ecf3]"
                      bind:value={startDate}
                      on:change={() => { if (endDate < startDate) endDate = startDate; }} 
                  />
                  <input 
                  type="time" 
                  class="w-full text-[14px] tracking-wider sm:w-32 rounded-md bg-[#F7F8FA] px-3 py-2  focus:outline-none focus:bg-[#e9ecf3]"
                  bind:value={startTime}
              />
          </div>
        </div>
      
        <!-- End Date/Time -->
        <div class="flex items-center gap-4">
          <label class="text-sm font-medium text-gray-700 w-12">End</label>
          <div class="flex flex-col sm:flex-row gap-2 w-full">
            <input 
                      type="date" 
                      class="text-[14px] tracking-wider w-full rounded-md  bg-[#F7F8FA] px-3 py-2   focus:outline-none focus:bg-[#e9ecf3]"
                      bind:value={endDate} 
                      min={startDate}  
                  />
                  <input 
                  type="time" 
                  class="w-full text-[14px] tracking-wider sm:w-32 rounded-md  bg-[#F7F8FA] px-3 py-2 focus:outline-none focus:bg-[#e9ecf3]"
                  bind:value={endTime}
              />
          </div>
        </div>
      </div>
      
  </div>

  <!-- Right Column (Rich Text Editor) -->
  <div class="lg:col-span-1 lg:w-full mb-4">
      <label for="event-description" class="block text-sm font-medium text-gray-700 mb-2">Event description</label>
      <div class="mt-1 flex space-x-2 rounded-t-md border border-b-0 border-gray-300 bg-gray-50 p-2">
          <button class="p-1 hover:bg-gray-200 rounded">
            <img src="icons/b-50.png" alt="Bold Icon" class="h-4 w-4 text-gray-500" />
          </button>
          <button class="p-1 hover:bg-gray-200 rounded">
            <img src="icons/italic-24.png" alt="Italic Icon" class="h-4 w-4 text-gray-500" />
          </button>
          <button class="p-1 hover:bg-gray-200 rounded">
            <img src="icons/underline-50.png" alt="Underline Icon" class="h-4 w-4 text-gray-500" />
          </button>
          <button class="p-1 hover:bg-gray-200 rounded">
            <img src="icons/list-50.png" alt="number list Icon" class="h-4 w-4 text-gray-500" />
          </button>
          <button class="p-1 hover:bg-gray-200 rounded">
            <img src="icons/list-24.png" alt="bullet list Icon" class="h-4 w-4 text-gray-500" />
          </button>
          <button class="p-1 hover:bg-gray-200 rounded">
            <img src="icons/link-50.png" alt="Link Icon" class="h-4 w-4 text-gray-500" />
          </button>
      </div>
      <textarea
          id="event-description"
          class="block w-full h-64 rounded-b-md border border-gray-300 px-3 py-2 focus:outline-none "
          rows="8"
      ></textarea>
  </div>
</div>
