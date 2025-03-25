<script lang="ts">
    import type { TimeBlockProps } from '$lib/types/event';
    
    export let value: number;
    export let label: string;
  </script>
  
  <div class="bg-red-600 p-3 md:p-4 rounded-lg text-center">
    <div class="text-xl md:text-2xl font-bold text-white">{value}</div>
    <div class="text-[10px] md:text-xs text-white/80 uppercase">{label}</div>
  </div>