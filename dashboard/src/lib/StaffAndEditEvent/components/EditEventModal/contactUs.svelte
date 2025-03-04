<script lang="ts">
  let imagePreview: string | null = null;
  let imageFile: File | null = null;

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
</script>

<div class="mb-6">
  <h2 class="text-xl font-semibold text-gray-900 mb-2">Basic Information</h2>
  <p class="text-sm text-gray-500">
    Edit your event details below. Changes update automatically on your website.
  </p>
</div>

<hr class="border-t border-gray-300 mb-6">

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Image Upload (1st Column) -->
  <div class="flex flex-col items-center relative">
    <label class="block w-full h-40 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer relative">
      {#if imagePreview}
        <div class="relative w-full h-full">
          <img src={imagePreview} alt="Uploaded Image" class="object-cover w-full h-full rounded-lg">
          <button 
            on:click={removeImage} 
            class="absolute top-2 right-2 bg-gray-400 text-white rounded-full h-6 w-6  pb-3 shadow-sm hover:bg-gray-600"
          >
          &times;
          </button>
        </div>
      {:else}
        <span>Select image</span>
      {/if}
      <input type="file" accept="image/*" class="hidden" on:change={handleImageUpload} />
    </label>
    <p class="text-sm text-gray-400 mt-2">Image (Optional)</p>
  </div>

  <!-- Name, Email, Mobile (2nd Column) -->
  <div class="space-y-4">
    <div>
      <label class="block text-sm text-gray-600 pb-2">Name</label>
      <input type="text" placeholder="Enter name" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
    </div>

    <div>
      <label class="pb-2 block text-sm text-gray-600">Email Address</label>
      <input type="email" placeholder="Enter email" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
    </div>

    <div>
      <label class="pb-2 block text-sm text-gray-600">Mobile Number</label>
      <input type="tel" placeholder="Enter mobile number" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4">
    </div>
  </div>

  <!-- Website URL (3rd Column) -->
  <div>
    <label class="pb-2 block text-sm text-gray-600">Website URL</label>
    <input type="url" placeholder="Enter website URL" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
  </div>
</div>
