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
  <!-- Image Upload (Top Left) -->
  <div class="flex flex-col relative md:col-span-1 lg:col-span-1">
    <p class=" text-black mb-2 ">Image (Optional)</p>
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
      <input type="file" accept="image/*" class="hidden" on:change={handleImageUpload} />
    </label>
  </div>

  <!-- Name, Email, Mobile (2nd Column) -->
  <div class="space-y-4 md:col-span-1 lg:col-span-1">
    <div>
      <label class="block text-sm text-black pb-2 font-small">Name</label>
      <input type="text" placeholder="Enter name" class="w-full p-2 rounded-md bg-[#F7F8FA] focus:outline-none focus:bg-[#e9ecf3]">
    </div>

    <div>
      <label class="pb-2 block text-sm text-black pb-2 font-small">Email Address</label>
      <div class="relative">
        <input type="email" placeholder="Enter email" class="w-full p-2 pl-10 rounded-md bg-[#F7F8FA] focus:outline-none focus:bg-[#e9ecf3]">
        <img src="staff/icons/icons8-email-50.png" alt="Email" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500">
      </div>
    </div>

    <div>
      <label class="pb-2 block text-sm text-black pb-2 font-small">Mobile Number</label>
      <div class="relative">
        <input type="tel" placeholder="Enter mobile number" class="w-full p-2 pl-10 rounded-md bg-[#F7F8FA] focus:outline-none focus:bg-[#e9ecf3]">
        <img src="staff/icons/icons8-phone-50.png" alt="Phone" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500">
      </div>
    </div>
  </div>  

  <!-- Website URL (3rd Column) -->
  <div class="mb-4 md:col-span-1 lg:col-span-1">
    <label class="pb-2 block text-sm text-black pb-2 font-small">Website URL</label>
    <div class="relative">
      <input type="url" placeholder="Enter website URL" class="w-full p-2 pl-10 rounded-md bg-[#F7F8FA] focus:outline-none focus:bg-[#e9ecf3]">
      <img src="staff/icons/icons8-tab-50.png" alt="Website" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500">
    </div>
  </div>
</div>