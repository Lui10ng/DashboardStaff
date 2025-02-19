<script lang="ts">
  import { X } from 'lucide-svelte';
  let isModalOpen = false;
  let selectedImage: string | null = null;

  function handleFileUpload(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      selectedImage = URL.createObjectURL(file);
    }
  }
</script>

<div class="min-h-screen bg-gray-100 flex items-center justify-center">
  <button
    on:click={() => isModalOpen = true}
    class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
  >
    Registration Instructions
  </button>

  {#if isModalOpen}
    <div class="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-lg w-full max-w-4xl">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-2">Registration instruction</h2>
          <p class="text-gray-600 mb-2">
            Edit your registration instruction below. Changes update automatically on your website.
          </p>
          <hr class="border-gray-300 mb-4" />

          <div class="flex gap-8">
            <div class="w-1/3 space-y-6">
              <div>
                <h3 class="font-medium mb-2">Heading</h3>
                <input type="text" placeholder="Add heading" class="w-full p-2 rounded-lg bg-gray-50" />
              </div>
<!--
              <div>
                <h3 class="font-medium mb-2">Images</h3>
                <label class="rounded-lg p-8 text-center bg-gray-50 cursor-pointer block" for="imageUpload">
                  {#if selectedImage}
                    <img src={selectedImage} alt="Uploaded Image" class="w-full h-auto rounded-lg" />
                  {:else}
                    <p class="text-gray-500">Select image</p>
                  {/if}
                </label>
                <input id="imageUpload" type="file" accept="image/*" class="hidden" on:change={handleFileUpload} />
              </div> -->
            </div>
<!--
            <div class="w-2/3">
              <h3 class="font-medium mb-2">Instructions</h3>
              <div class="border rounded-lg p-3 bg-gray-50 min-h-[200px]">
                <p class="text-gray-500">Rich text editor goes here</p>
              </div>
            </div> -->
          </div>
        </div>

        <div class="flex justify-end gap-3 p-4 border-t">
          <button on:click={() => isModalOpen = false} class="px-4 py-2 text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Save changes
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
