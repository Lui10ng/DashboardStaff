<script lang="ts">
    export let label: string;
    export let value: string | null;
    export let onChange: (file: string) => void;
    export let objectFit: 'contain' | 'cover' = 'contain';
    export let height = 'h-32';
  
    function handleFileUpload(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onChange(e.target.result as string);
          }
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
  </script>
  
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <label class="border-2 border-dashed border-gray-300 rounded-lg p-4 {height} flex items-center justify-center cursor-pointer overflow-hidden">
      {#if value}
        <img src={value} alt={label} class="w-full h-full object-{objectFit}" />
      {:else}
        <span class="text-gray-500">+ Add file</span>
      {/if}
      
      <input
        type="file"
        accept="image/*"
        class="hidden"
        on:change={handleFileUpload}
      />
    </label>
  </div>