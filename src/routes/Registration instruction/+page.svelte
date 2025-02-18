<script lang="ts">
  import { X } from 'lucide-svelte';
  let isModalOpen = false;
</script>

<div class="min-h-screen bg-gray-100 flex items-center justify-center">
  <button
    on:click={() => isModalOpen = true}
    class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
  >
    Registration Instructions
  </button>

  {#if isModalOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-lg w-full max-w-4xl">
        <!-- Modal Header -->
        <div class="flex flex-wrap gap-4 p-4 mt-3 justify-start">
          <button class="bg-white hover:bg-red-500 hover:text-white text-black font-semibold py-2 px-4 rounded-md transition-colors sm:w-auto border border-gray-400 cursor-pointer h-10 text-xs">
            Edit Details
          </button>
          <button class="bg-white hover:bg-red-500 hover:text-white text-black font-semibold py-2 px-4 rounded-md transition-colors sm:w-auto border border-gray-400 cursor-pointer h-10 text-xs">
            Visual
          </button>
          <button class="bg-white hover:bg-red-500 hover:text-white text-black font-semibold py-2 px-4 rounded-md transition-colors sm:w-auto border border-gray-400 cursor-pointer h-10 text-xs">
            Contacts
          </button>
          <button class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors sm:w-auto border-2 cursor-pointer h-10 text-xs">
            Registration Instructions
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">Registration instruction</h2>
          <p class="text-gray-600 mb-4">
            Edit your registration instruction below. Changes update automatically on your website.
          </p>

          <div class="flex gap-8">
            <!-- Left Column - Heading and Images -->
            <div class="w-1/3 space-y-6">
              <div>
                <h3 class="font-medium mb-2">Heading</h3>
                <input type="text" placeholder="Add heading" class="w-full p-2 rounded-lg bg-gray-50" />
              </div>

              <div>
                <h3 class="font-medium mb-2">Images</h3>
                <div class="rounded-lg p-8 text-center bg-gray-50">
                  <p class="text-gray-500" >Select image</p>
                </div>
              </div>
            </div>

            <!-- Right Column - Rich Text Editor -->
            <div class="w-2/3">
              <div class="border rounded-lg">
                <!-- Toolbar -->
                <div class="flex items-center gap-2 p-2 border-b bg-gray-50">
                  <select class="border rounded px-2 py-1 text-sm">
                    <option>Normal</option>
                  </select>
                  <select class="border rounded px-2 py-1 text-sm">
                    <option>Sans Serif</option>
                  </select>
                  <div class="flex items-center gap-1 border-l pl-2">
                    <button class="p-1 hover:bg-gray-200 rounded">B</button>
                    <button class="p-1 hover:bg-gray-200 rounded">I</button>
                    <button class="p-1 hover:bg-gray-200 rounded">U</button>
                    <button class="p-1 hover:bg-gray-200 rounded">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 6h16M4 12h16M4 18h16"></path>
                      </svg>
                    </button>
                    <button class="p-1 hover:bg-gray-200 rounded">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4"></path>
                        <path d="M14 2h6v6"></path>
                        <path d="M20 2L10 12"></path>
                      </svg>
                    </button>
                    <button class="p-1 hover:bg-gray-200 rounded">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <!-- Editor Content -->
                <div class="p-4 min-h-[300px] bg-white">
                  <textarea class="w-full min-h-[300px] p-4 bg-white border rounded-lg resize-none" placeholder="Add text here..."></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end gap-3 p-4 border-t">
          <button
            on:click={() => isModalOpen = false}
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
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