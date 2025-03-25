<script lang="ts">
    export let delay = '3000ms';
    export let duration = '6000ms';
    export let offset = '5000';
  </script>
  
  <div 
    class="delay-[{delay}] duration-[{duration}] taos:translate-y-[-100%] taos:opacity-0" 
    data-taos-offset={offset}
  >
    <slot />
  </div>