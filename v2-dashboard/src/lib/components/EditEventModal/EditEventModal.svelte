<script lang="ts">
    import { writable } from 'svelte/store';
    import { X } from 'lucide-svelte';
    import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { enhance } from '$app/forms';
  
    let drawerState = $state(false);
  
    function drawerClose() {
      drawerState = false;
    }
  
    // export let isOpen = writable(false);
    let activeTab = writable('edit');
  
    // Variables for EditDetails
    let eventUrl = $state("");
    let eventName = $state("");
    let subdomain = $state("");
    let eventAddress = $state("");
    let today = $state(new Date().toISOString().split("T")[0]);
    let startDate = $state(today);
    let startTime = $state("19:30");
    let endDate = $state(today);
    let endTime = $state("19:30");
    let isRecurring = $state(false);
  
    // Variables for Contacts
    let imagePreview: string | null = $state(null);
    let imageFile: File | null = $state(null);
  
    // Variables for Registration Instructions
    let selectedImage: string | null = $state(null);
    let fileInput: string | HTMLInputElement = $state("");
  
    // Variables for Visuals
    let youtubeLink = $state("");
    let themeImgSrc: string | null = $state(null);
    let logoImgSrc: string | null = $state(null);
    let eventLogoImgSrc: string | null = $state(null);
    let posterImgSrc: string | null = $state(null);
    let backgroundImgSrc: string | null = $state(null);
  
    // Functions
    function handleImageUpload(event: Event) {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        imageFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  
    function removeImage(event: Event) {
      event.stopPropagation();
      imagePreview = null;
      imageFile = null;
    }
  
    function handleFileUpload(event: Event) {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        selectedImage = URL.createObjectURL(file);
      }
    }
  
    function removeSelectedImage() {
      selectedImage = null;
      if (fileInput) (fileInput as HTMLInputElement).value = '';
    }
  
    function uploadImage(id: string) {
      const element = document.getElementById(id) as HTMLInputElement;
      if (element) {
        element.click();
      }
    }
  
    function displayImage(event: Event, imgVar: string) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (imgVar === "themeImg") themeImgSrc = e.target?.result as string;
          if (imgVar === "logoImg") logoImgSrc = e.target?.result as string;
          if (imgVar === "eventLogoImg") eventLogoImgSrc = e.target?.result as string;
          if (imgVar === "posterImg") posterImgSrc = e.target?.result as string;
          if (imgVar === "backgroundImg") backgroundImgSrc = e.target?.result as string;
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
  
    function removeImageVar(imgVar: string) {
      if (imgVar === "themeImg") themeImgSrc = null;
      if (imgVar === "logoImg") logoImgSrc = null;
      if (imgVar === "eventLogoImg") eventLogoImgSrc = null;
      if (imgVar === "posterImg") posterImgSrc = null;
      if (imgVar === "backgroundImg") backgroundImgSrc = null;
    }
    
  </script>
  
  <Modal
    open={drawerState}
    onOpenChange={(e) => (drawerState = e.open)}
    triggerBase="btn preset-tonal"
    contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[100%] h-screen bg-white overflow-y-auto"
    positionerJustify="justify-start"
    positionerAlign=""
    positionerPadding=""
    transitionsPositionerIn={{ y: '100%', duration: 300 }}
    transitionsPositionerOut={{ y: '100%', duration: 300 }}
  >
  {#snippet trigger()}<button class="flex items-center gap-2 text-red-600 transition-colors hover:text-red-700">
    Edit Event
    <i class="fa-solid fa-pen"></i>
  </button>{/snippet}
    {#snippet content()}
    <div class="">
          <!-- Navigation -->
          <div class="w-full overflow-x-auto mt-20 ">
            <div class="flex space-x-2 py-2 pt-0 mb-4 whitespace-nowrap overflow-x-auto scrollbar-hide">
              {#each [
                { name: 'Edit Details', key: 'edit' },
                { name: 'Visual', key: 'visual' },
                { name: 'Contacts', key: 'contacts' },
                { name: 'Registration Instructions', key: 'registration' }
              ] as item}
                <button
                  class="px-4 py-2 text-sm font-medium transition rounded-md whitespace-nowrap 
                    {($activeTab === item.key) ? 'bg-red-600 text-white' : 'text-gray-900 hover:bg-gray-100 border border-gray-300'}"
                  on:click={() => activeTab.set(item.key)}
                >
                  {item.name}
                </button>
              {/each}
            </div>
          </div>
    
          <!-- Dynamic Content -->
        
          <div class="">
            {#if $activeTab === 'edit'}
            <form 
            action="?/updateEventDetails"
	          method="POST"
	          use:enhance
            >
              <div class="mb-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-2">Basic information</h2>
                <p class="text-sm text-gray-500">Edit your event details below. Changes update automatically on your website.</p>
              </div>
              <hr class="border-t border-gray-300 mb-6">
              <div class="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">
              
                <div class="max-w-xl space-y-6">
                  <div>
                    <label for="event-name" class="block text-sm font-medium">Event name</label>
                    <input
                      type="text"
                      id="event-name"
                      name="Event Name"
                      class="mt-1 block w-full rounded-md bg-[#F7F8FA] px-3 py-2 focus:outline-none border-transparent border focus:bg-[#e9ecf3] placeholder:text-[13px] placeholder:text-[#3E3E3F]"
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
            <img src="/icons/globe.png" alt="Globe Icon" class="h-4 w-4 text-gray-500" />
            
            <!-- Input Field -->
            <input
              type="text"
              id="subdomain"
              name="Subdomain"
              class="ml-2 block w-full bg-transparent focus:outline-none placeholder:text-[13px] placeholder:text-[#3E3E3F] border border-transparent focus:border-transparent"
              placeholder="Enter Subdomain"
            />
        
            <!-- Domain Extension -->
            <span class="text-[13px] text-[#3E3E3F]">
              .veent.co
            </span>
          </div>
        </div>
                  <div>
                    <label for="event-address" class="block text-sm font-medium text-gray-700">Event address</label>
                    <div class="relative mt-1">
                      <span class="absolute inset-y-0 left-3 flex items-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-9.166 8-13a8 8 0 10-16 0c0 3.834 8 13 8 13z" />
                          <circle cx="12" cy="9" r="3" stroke="currentColor" stroke-width="2" fill="none" />
                        </svg>
                      </span>
                      <input
                        Name="Event Address"
                        type="text"
                        id="event-address"
                        class="block w-full rounded-md bg-[#F7F8FA] px-3 py-2 pl-10 focus:outline-none placeholder:text-[13px] placeholder:text-[#3E3E3F] focus:bg-[#e9ecf3]"
                        placeholder="Enter Event address"
                      />
                    </div>
                  </div>
                  <div class="space-y-4">
                    <label class="text-sm font-medium text-gray-700">Event date</label>
                    <div class="mt-4">
                      <label class="inline-flex">
                        <input type="checkbox" class="rounded border-gray-300 text-blue-600" name="Is Recurring?" bind:checked={isRecurring} />
                        <span class="ml-2 text-sm text-gray-700">This is a recurring event</span>
                      </label>
                    </div>
                    <div class="flex items-center gap-4">
                      <label class="text-sm font-medium text-gray-700 w-12">Start</label>
                      <div class="flex flex-col sm:flex-row gap-2 w-full">
                        <input 
                          type="date" 
                          class="text-[14px] tracking-wider w-full rounded-md bg-[#F7F8FA] px-3 py-2 focus:outline-none focus:bg-[#e9ecf3]"
                          name="Start Date"
                          on:change={() => { if (endDate < startDate) endDate = startDate; }} 
                        />
                        <input 
                          type="time" 
                          class="w-full text-[14px] tracking-wider sm:w-32 rounded-md bg-[#F7F8FA] px-3 py-2 focus:outline-none focus:bg-[#e9ecf3]"
                          name="Start Time"
                        />
                      </div>
                    </div>
                    <div class="flex items-center gap-4">
                      <label class="text-sm font-medium text-gray-700 w-12">End</label>
                      <div class="flex flex-col sm:flex-row gap-2 w-full">
                        <input 
                          type="date" 
                          class="text-[14px] tracking-wider w-full rounded-md bg-[#F7F8FA] px-3 py-2 focus:outline-none focus:bg-[#e9ecf3]"
                          name="End Date" 
                          min={endDate}  
                        />
                        <input 
                          type="time" 
                          class="w-full text-[14px] tracking-wider sm:w-32 rounded-md bg-[#F7F8FA] px-3 py-2 focus:outline-none focus:bg-[#e9ecf3]"
                          name="End Time"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="lg:col-span-1 lg:w-full mb-4">
                  <label for="event-description" class="block text-sm font-medium text-gray-700 mb-2">Event description</label>
                  <div class="mt-1 flex space-x-2 rounded-t-md border border-b-0 border-gray-300 bg-gray-50 p-2">
                    <button class="p-1 hover:bg-gray-200 rounded">
                      <img src="/icons/b-50.png" alt="Bold Icon" class="h-4 w-4 text-gray-500" />
                    </button>
                    <button class="p-1 hover:bg-gray-200 rounded">
                      <img src="/icons/italic-24.png" alt="Italic Icon" class="h-4 w-4 text-gray-500" />
                    </button>
                    <button class="p-1 hover:bg-gray-200 rounded">
                      <img src="/icons/underline-50.png" alt="Underline Icon" class="h-4 w-4 text-gray-500" />
                    </button>
                    <button class="p-1 hover:bg-gray-200 rounded">
                      <img src="/icons/list-50.png" alt="number list Icon" class="h-4 w-4 text-gray-500" />
                    </button>
                    <button class="p-1 hover:bg-gray-200 rounded">
                      <img src="/icons/list-24.png" alt="bullet list Icon" class="h-4 w-4 text-gray-500" />
                    </button>
                    <button class="p-1 hover:bg-gray-200 rounded">
                      <img src="/icons/link-50.png" alt="Link Icon" class="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <textarea
                    id="event-description"
                    class="block w-full h-64 rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
                    rows="8"
                    name="Event Description"
                  ></textarea>
                </div> 
              </div>
              <!-- Footer (Responsive Buttons) -->
          <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button type="button"
              class="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-4 py-2 text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50"
              on:click={drawerClose}
            >
              Cancel
            </button>
            <button
              class="w-full sm:w-auto rounded-md bg-red-600 px-5 py-2 text-sm sm:text-base font-medium text-white hover:bg-red-700"
            >
              Save changes
            </button>
          </div>
            </form>
            {:else if $activeTab === 'visual'}
<form 
  action="?/updateVisuals"
  method="POST"
  use:enhance
  enctype="multipart/form-data"
>
  <div class="pb-4">
    <h2 class="text-xl font-semibold mb-2">Website Visual</h2>
    <p class="text-gray-600 mb-6 text-sm">Edit your website visual below. Changes update automatically on your website.</p>
    <hr class="border-t border-gray-300 mb-6">

    <!-- Theme Image Upload -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
  <div class="mb-4">
    <label class="block text-sm font-medium mb-2">Theme Image</label>
    <div class="h-40 w-full overflow-hidden relative bg-[#F1F2F6] rounded-lg text-center cursor-pointer min-h-[10rem] flex items-center justify-center" on:click={() => uploadImage("themeInput")}>
      {#if themeImgSrc}
        <img src={themeImgSrc} alt="Theme Image" class="h-full w-full object-cover">
        <button class="absolute top-2 right-2 bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center" on:click={() => removeImageVar("themeImg")}>
          &times;
        </button>
      {:else}
        <p class="text-gray-500 text-sm">Select Theme Image</p>
      {/if}
      <input type="file" id="themeInput" class="hidden" accept="image/*" on:change={(e) => displayImage(e, "themeImg")} />
    </div>
  </div>

    <!-- Logo Image Upload -->

    <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Logo Image</label>
        <div class="h-40 w-full overflow-hidden relative bg-[#F1F2F6] rounded-lg text-center cursor-pointer min-h-[10rem] flex items-center justify-center" on:click={() => document.getElementById('logoInput')?.click()}>
          {#if logoImgSrc}
            <img src={logoImgSrc} alt="Logo Image" class="w-full h-full object-cover">
            <button class="absolute top-2 right-2 bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center" on:click={() => removeImageVar("logoImg")}>
              &times;
            </button>
          {:else}
            <p class="text-gray-500 text-sm">Select Logo Image</p>
          {/if}
          <input type="file" id="logoInput" class="hidden" accept="image/*" on:change={(e) => displayImage(e, "logoImg")} />
        </div>
      </div>
    

    <!-- Event Logo Image Upload -->
    <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Event Logo Image</label>
        <div class="h-40 w-full overflow-hidden relative bg-[#F1F2F6] rounded-lg text-center cursor-pointer min-h-[10rem] flex items-center justify-center" on:click={() => document.getElementById('eventLogoInput')?.click()}>
          {#if eventLogoImgSrc}
            <img src={eventLogoImgSrc} alt="Event Logo Image" class="w-full h-full object-cover">
            <button class="absolute top-2 right-2 bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center" on:click={() => removeImageVar("eventLogoImg")}>
              &times;
            </button>
          {:else}
            <p class="text-gray-500 text-sm">Select Event Logo Image</p>
          {/if}
          <input type="file" id="eventLogoInput" class="hidden" accept="image/*" on:change={(e) => displayImage(e, "eventLogoImg")} />
        </div>
      </div>

    <!-- Poster Image Upload -->
    <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Poster Image</label>
        <div class="h-40 w-full overflow-hidden relative bg-[#F1F2F6] rounded-lg text-center cursor-pointer min-h-[10rem] flex items-center justify-center" on:click={() => document.getElementById('posterInput')?.click()}>
          {#if posterImgSrc}
            <img src={posterImgSrc} alt="Poster Image" class="w-full h-full object-cover">
            <button class="absolute top-2 right-2 bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center" on:click={() => removeImageVar("posterImg")}>
              &times;
            </button>
          {:else}
            <p class="text-gray-500 text-sm">Select Poster Image</p>
          {/if}
          <input type="file" id="posterInput" class="hidden" accept="image/*" on:change={(e) => displayImage(e, "posterImg")} />
        </div>
      </div>

    <!-- Background Image Upload -->
    <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Background Image</label>
        <div class="h-40 w-full overflow-hidden relative bg-[#F1F2F6] rounded-lg text-center cursor-pointer min-h-[10rem] flex items-center justify-center" on:click={() => document.getElementById('backgroundInput')?.click()}>
          {#if backgroundImgSrc}
            <img src={backgroundImgSrc} alt="Background Image" class="w-full h-full object-cover">
            <button class="absolute top-2 right-2 bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center" on:click={() => removeImageVar("backgroundImg")}>
              &times;
            </button>
          {:else}
            <p class="text-gray-500 text-sm">Select Background Image</p>
          {/if}
          <input type="file" id="backgroundInput" class="hidden" accept="image/*" on:change={(e) => displayImage(e, "backgroundImg")} />
        </div>
      </div>
    

    <!-- YouTube Link Input -->
    <div class="mb-4">
      <label class="block text-sm font-medium mb-2">Embed Link</label>
      <input type="text" name="Youtube Link" placeholder="Insert YouTube link here" class="placeholder:text-[13px] w-full p-2 bg-[#F1F2F6] rounded focus:outline-none focus:bg-[#e9ecf3]">
    </div>
  </div>
  </div>

  <!-- Footer (Responsive Buttons) -->
  <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
    <button type="button"
      class="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-4 py-2 text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50"
      on:click={drawerClose}
    >
      Cancel
    </button>
    <button
      class="w-full sm:w-auto rounded-md bg-red-600 px-5 py-2 text-sm sm:text-base font-medium text-white hover:bg-red-700"
    >
      Save changes
    </button>
  </div>
</form>
    {:else if $activeTab === 'contacts'}
            <form 
            action="?/updateContacts"
	          method="POST"
	          use:enhance
	          enctype="multipart/form-data"
            >
              <div class="mb-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-2">Basic Information</h2>
                <p class="text-sm text-gray-500">Edit your event details below. Changes update automatically on your website.</p>
              </div>
              <hr class="border-t border-gray-300 mb-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="flex flex-col relative md:col-span-1 lg:col-span-1">
                  <p class="text-black mb-2">Image (Optional)</p>
                  <label class="block w-full h-40 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer relative">
                    {#if imagePreview}
                      <div class="relative w-full h-full">
                        <img src={imagePreview} alt="Uploaded Image" class="object-cover w-full h-full rounded-lg">
                        <button 
                          on:click={removeImage} 
                          class="absolute top-2 right-2 bg-gray-400 text-white rounded-full h-6 w-6 pb-3 shadow-sm hover:bg-gray-600"
                        >
                          &times;
                        </button>
                      </div>
                    {:else}
                      <span>Select image</span>
                    {/if}
                    <input type="file" accept="image/*" class="hidden" name="Contact Image" on:change={handleImageUpload} />
                  </label>
                </div>
                <div class="space-y-4 md:col-span-1 lg:col-span-1">
                  <div>
                    <label class="block text-sm text-black pb-2 font-small">Name</label>
                    <input type="text" placeholder="Enter name" name="Name" class="w-full p-2 rounded-md bg-[#F7F8FA] focus:outline-none focus:bg-[#e9ecf3]">
                  </div>
                  <div>
                    <label class="pb-2 block text-sm text-black pb-2 font-small">Email Address</label>
                    <div class="relative">
                      <input type="email" name="Email" placeholder="Enter email" class="w-full p-2 pl-10 rounded-md bg-[#F7F8FA] focus:outline-none focus:bg-[#e9ecf3]">
                      <img src="/icons/icons8-email-50.png" alt="Email" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500">
                    </div>
                  </div>
                  <div>
                    <label class="pb-2 block text-sm text-black pb-2 font-small">Mobile Number</label>
                    <div class="relative">
                      <input name="Number" type="tel" placeholder="Enter mobile number" class="w-full p-2 pl-10 rounded-md bg-[#F7F8FA] focus:outline-none focus:bg-[#e9ecf3]">
                      <img src="/icons/icons8-phone-50.png" alt="Phone" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500">
                    </div>
                  </div>
                </div>
                <div class="mb-4 md:col-span-1 lg:col-span-1">
                  <label class="pb-2 block text-sm text-black pb-2 font-small">Website URL</label>
                  <div class="relative">
                    <input name="Website URL" type="url" placeholder="Enter website URL" class="w-full p-2 pl-10 rounded-md bg-[#F7F8FA] focus:outline-none focus:bg-[#e9ecf3]">
                    <img src="/icons/globe.png" alt="Website" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500">
                  </div>
                </div>
              </div>
              <!-- Footer (Responsive Buttons) -->
          <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button type="button"
              class="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-4 py-2 text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50"
              on:click={drawerClose}
            >
              Cancel
            </button>
            <button
              class="w-full sm:w-auto rounded-md bg-red-600 px-5 py-2 text-sm sm:text-base font-medium text-white hover:bg-red-700"
            >
              Save changes
            </button>
          </div>
            </form>
            {:else if $activeTab === 'registration'}
            <form 
            action="?/updateRegistrationInstruction"
	          method="POST"
	          use:enhance
	          enctype="multipart/form-data"
            >
              <div>
                <div class="mb-6">
                  <h2 class="text-xl font-semibold text-gray-900 mb-2">Registration instruction</h2>
                  <p class="text-gray-500 mb-4 text-sm">Edit your registration instruction below. Changes update automatically on your website.</p>
                </div>
                <hr class="border-t border-gray-300 mb-6">
                <div class="flex flex-col lg:flex-row gap-8">
                  <div class="w-full lg:w-2/5 space-y-6">
                    <div>
                      <h3 class="font-medium mb-1">Heading</h3>
                      <input name="Heading" type="text" placeholder="Add heading" class="mt-1 text-sm w-full p-2 rounded-lg bg-[#F7F8FA] px-3 py-2 focus:outline-none focus:bg-[#e9ecf3] placeholder:text-gray-500" />
                    </div>
                    <div>
                      <h3 class="font-medium mb-2">Image</h3>
                      {#if selectedImage}
                        <div class="relative w-full">
                          <img src={selectedImage} alt="Registration instruction preview" class="w-full h-50 object-cover rounded-lg" />
                          <button on:click={removeSelectedImage} class="absolute top-2 right-2 bg-gray-400 text-white rounded-full p-1 shadow-sm hover:bg-gray-600">
                            <X size={16} />
                          </button>
                        </div>
                      {:else}
                        <label class="rounded-lg p-12 text-center bg-[#F7F8FA] cursor-pointer block h-50 flex items-center justify-center hover:bg-[#e9ecf3]" for="imageUpload">
                          <p class="text-gray-500 text-sm">Select image</p>
                        </label>
                      {/if}
                      <input name="Registration Instruction IMG" id="imageUpload" type="file" accept="image/*" class="hidden" on:change={handleFileUpload} />
                    </div>
                  </div>
                  <div class="w-full lg:w-3/5 mb-4">
                    <label for="event-description" class="block text-sm font-medium text-gray-700 mb-2">Event description</label>
                    <div class="mt-1 flex space-x-2 rounded-t-md border border-b-0 border-gray-300 bg-gray-50 p-2">
                      <button class="p-1 hover:bg-gray-200 rounded">
                        <img src="/icons/b-50.png" alt="Bold Icon" class="h-4 w-4 text-gray-500" />
                      </button>
                      <button class="p-1 hover:bg-gray-200 rounded">
                        <img src="/icons/italic-24.png" alt="Italic Icon" class="h-4 w-4 text-gray-500" />
                      </button>
                      <button class="p-1 hover:bg-gray-200 rounded">
                        <img src="/icons/underline-50.png" alt="Underline Icon" class="h-4 w-4 text-gray-500" />
                      </button>
                      <button class="p-1 hover:bg-gray-200 rounded">
                        <img src="/icons/list-50.png" alt="number list Icon" class="h-4 w-4 text-gray-500" />
                      </button>
                      <button class="p-1 hover:bg-gray-200 rounded">
                        <img src="/icons/list-24.png" alt="bullet list Icon" class="h-4 w-4 text-gray-500" />
                      </button>
                      <button class="p-1 hover:bg-gray-200 rounded">
                        <img src="/icons/link-50.png" alt="Link Icon" class="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                    <textarea
                      id="registration-instruction"
                      name="Instruction"
                      class="block w-full h-64 rounded-b-md border border-gray-300 px-3 py-2 focus:outline-none"
                      rows="8"
                    ></textarea>
                  </div>
                </div>
              </div>
              <!-- Footer (Responsive Buttons) -->
          <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button type="button"
              class="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-4 py-2 text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50"
              on:click={drawerClose}
            >
              Cancel
            </button>
            <button
              class="w-full sm:w-auto rounded-md bg-red-600 px-5 py-2 text-sm sm:text-base font-medium text-white hover:bg-red-700"
            >
              Save changes
            </button>
          </div>
            </form>
            {/if}
          </div>
          </div>
          {/snippet}
    </Modal>
    
    <style>
    /* Hide scrollbar for a cleaner look */
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
  
    .slide-in {
      transform: translateY(0);
      transition: transform 0.3s ease-in-out;
    }
    
    .slide-out {
      transform: translateY(100%);
      transition: transform 0.3s ease-in-out;
    }
  
    </style>