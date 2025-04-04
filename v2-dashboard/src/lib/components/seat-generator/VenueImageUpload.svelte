<script lang="ts">
    import { seatGeneratorStore } from '$lib/stores/seat-generator.svelte';
    
    // State for dragging
    let isDragging = $state(false);
    let imagePreview = $state<string | null>(seatGeneratorStore.venueImage);
    
    // Effect to sync state with the store
    $effect(() => {
        imagePreview = seatGeneratorStore.venueImage;
    });
    
    // Handle file selection
    const handleFileUpload = (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            processFile(input.files[0]);
        }
    };
    
    // Handle drag events
    const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
        isDragging = true;
    };
    
    const handleDragLeave = (event: DragEvent) => {
        event.preventDefault();
        isDragging = false;
    };
    
    const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        isDragging = false;
        
        const files = event.dataTransfer?.files;
        if (files && files[0] && files[0].type.startsWith('image/')) {
            processFile(files[0]);
        }
    };
    
    // Process the file and update the store
    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            seatGeneratorStore.setVenueImage(result);
            imagePreview = result;
        };
        reader.readAsDataURL(file);
    };
    
    // Remove the image
    const removeImage = () => {
        seatGeneratorStore.setVenueImage(null);
        imagePreview = null;
    };
</script>

<div 
    class="relative  rounded-lg border-2 border-dashed border-[#B4B4B4] py-2 transition-colors {isDragging ? 'border-blue-500 bg-blue-50' : 'border-[#B4B4B4]'}"
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    role="button"
    tabindex="0"
    aria-label="Upload venue floor plan image"
>
    {#if imagePreview}
        <div class="relative ">
          <i class="fa-solid fa-image "></i>
            <button
                class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onclick={removeImage}
                onkeydown={(e) => e.key === 'Enter' && removeImage()}
                aria-label="Remove image"
                tabindex="0"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    {:else}
        <div class="flex flex-col items-center">
            <i class="fa-solid fa-image text-4xl text-gray-500"></i>
            <p class="mt-4 text-center">
                <label class="cursor-pointer text-red-600 hover:text-red-700">
                    Upload a file
                    <input type="file" class="hidden" accept="image/*" onchange={handleFileUpload} />
                </label>
                or drag and drop
            </p>
            <!-- <p class="mt-2 text-sm text-center text-gray-500">PNG, JPG, GIF up to 10MB</p> -->
            <p class="mt-2 text-center text-gray-500">Upload your venue floor plan image.</p>
        </div>
    {/if}
</div> 