<script lang="ts">
    export let showTicketCount: boolean;
    export let toggleShowTicketCount: () => void;
  </script>
  
  <header class="bg-gray-900 py-4">
    <div class="container mx-auto px-4 md:px-20 lg:px-40 flex flex-col md:flex-row justify-between items-center">
      <img src="/logo/Veent-red-logo.png" alt="Veent Logo" class="cursor-pointer "/>
      <nav class="flex flex-col md:flex-row gap-4 md:gap-6">
        <button class="text-white mt-1.5 cursor-pointer">Posts</button>
        <button class="text-white mt-1.5 cursor-pointer">Contact</button>
        <button class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded cursor-pointer">Register now</button>
      </nav>
    </div>
  </header>