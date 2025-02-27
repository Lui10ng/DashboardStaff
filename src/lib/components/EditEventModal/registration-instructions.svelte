<script lang="ts">
  import { X } from 'lucide-svelte';
  
  let selectedImage: string | null = null;
  let fileInput: HTMLInputElement;

  function handleFileUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      selectedImage = URL.createObjectURL(file);
    }
  }

  function removeImage() {
    selectedImage = null;
    if (fileInput) fileInput.value = '';
  }
</script>

<div>
  <div class="mb-6">
  <h2 class="text-xl font-semibold text-gray-900 mb-2">Registration instruction</h2>
  <p class="text-gray-500 mb-4 text-sm">
    Edit your registration instruction below. Changes update automatically on your website.
  </p>
  </div>
    <hr class="border-t border-gray-300 mb-6">

  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Left Column - Heading and Images -->
    <div class="w-full lg:w-2/5 space-y-6">
      <div>
        <h3 class="font-medium mb-1">Heading</h3>
        <input type="text" placeholder="Add heading" class="mt-1 text-sm w-full p-2 rounded-lg bg-[#F7F8FA] px-3 py-2 focus:outline-none focus:bg-[#e9ecf3] placeholder:text-gray-500" />
      </div>

      <div>
        <h3 class="font-medium mb-2">Image</h3>

        {#if selectedImage}
          <div class="relative w-full">
            <img src={selectedImage} alt="Registration instruction preview" class="w-full h-50 object-cover rounded-lg" />
            <!-- Remove Button (Placed Outside the Label) -->
            <button on:click={removeImage} class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">
              <X size={16} />
            </button>
          </div>
        {:else}
          <label class="rounded-lg p-12 text-center bg-[#F7F8FA] cursor-pointer block h-50 flex items-center justify-center hover:bg-[#e9ecf3]" for="imageUpload" >
            <p class="text-gray-500 text-sm">Select image</p>
          </label>
        {/if}

        <input bind:this={fileInput} id="imageUpload" type="file" accept="image/*" class="hidden" on:change={handleFileUpload} />
      </div>
    </div>

    <!-- Right Column - Rich Text Editor -->
    <div class="w-full lg:w-3/5 mb-4">
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
</div>
