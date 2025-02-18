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
          <div class="bg-white rounded-lg w-full max-w-4xl max-h-500">
              <!-- Modal Header -->
              <div class="flex flex-wrap gap-4 justify-center p-4 border-b mt-3">
                  <button class="bg-white hover:bg-red-500 hover:text-white text-black font-semibold py-2 px-4 rounded-md transition-colors sm:w-auto border-1  border-gray-400 cursor-pointer h-10 text-xs">
                      Edit Details
                  </button>
                  <button class="bg-white hover:bg-red-500 hover:text-white text-black font-semibold py-2 px-4 rounded-md transition-colors sm:w-auto border-1 border-gray-400 cursor-pointer h-10 text-xs">
                      Visual
                  </button>
                  <button class="bg-white hover:bg-red-500 hover:text-white text-black font-semibold py-2 px-4 rounded-md transition-colors sm:w-auto border-1 border-gray-400 cursor-pointer h-10 text-xs">
                      Contacts
                  </button>
                  <button class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors sm:w-auto border-2 cursor-pointer h-10 text-xs">
                      Registration Instructions
                  </button>
              </div>

              <!-- Modal Content -->
              <div class="p-6">
                  <!-- Tabs -->
                  <div class="flex border-b mb-4">
                      <button class="px-4 py-2 border-b-2 border-red-500 text-red-500 font-medium cursor-pointer">
                          Registration instruction
                      </button>
                      <button class="px-4 py-2 text-gray-500">
                          Visual
                      </button>
                      <button class="px-4 py-2 text-gray-500">
                          Contacts
                      </button>
                  </div>

                  <!-- Editor Section -->
                  <div class="space-y-4">
                      <p class="text-gray-600">
                          Edit your registration instruction below. Changes update automatically on your website.
                      </p>

                      <!-- Rich Text Editor Mockup -->
                      <div class="border rounded-lg">
                          <!-- Toolbar -->
                          <div class="flex items-center gap-2 p-2 border-b bg-gray-50">
                              <select class="border rounded px-2 py-1 text-sm">
                                  <option>Heading</option>
                              </select>
                              <div class="flex items-center gap-1 border-l pl-2">
                                  <button class="p-1 hover:bg-gray-200 rounded">B</button>
                                  <button class="p-1 hover:bg-gray-200 rounded">I</button>
                                  <button class="p-1 hover:bg-gray-200 rounded">U</button>
                              </div>
                          </div>
                          <!-- Editor Content -->
                          <div class="p-4 min-h-[200px]">
                              <p class="text-gray-400">Add text here...</p>
                          </div>
                      </div>

                      <!-- Image Section -->
                      <div>
                          <h3 class="font-medium mb-2">Images</h3>
                          <div class="border-2 border-dashed rounded-lg p-8 text-center">
                              <p class="text-gray-500">Drag images here or click to upload</p>
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
