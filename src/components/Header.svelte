<script lang="ts">
    export let showTicketCount: boolean;
    export let toggleShowTicketCount: () => void;
  </script>
  
  <header class="bg-gray-900 py-4">
    <div class="container mx-auto px-4 md:px-20 lg:px-40 flex flex-col md:flex-row justify-between items-center">
      <div class="text-white mb-4 md:mb-0 mr-4">Company Logo</div>
      <nav class="flex flex-col md:flex-row gap-4 md:gap-6">
        <a href="#" class="text-white mt-1.5">Posts</a>
        <a href="#" class="text-white mt-1.5">Contact</a>
        <button class="bg-black text-white px-4 py-2 rounded">Register now</button>
      </nav>
    </div>
  </header>