<script lang="ts">
  import { Modal } from '@skeletonlabs/skeleton-svelte';
  import Button from '$lib/components/ui/Button.svelte';

  let {
    initialDrawerState = false,
    buttonLabel = "Add Ticket",
    buttonIcon = "fa-solid fa-plus text-sm",
    buttonClass = "bg-gray-200 px-4 py-2 rounded-md",
    title = "Event Title",
    children
  } = $props();
  
  let drawerState = $state(initialDrawerState);

  const handleOpenDrawer = () => {
    drawerState = true;
  };

  const handleCloseDrawer = () => {
    drawerState = false;
  };
</script>

<Button
  label={buttonLabel}
  icon={buttonIcon}
  className={buttonClass}
  onClick={handleOpenDrawer}
/>

<Modal
  open={drawerState}
  onOpenChange={(e) => (drawerState = e.open)}
  contentBase="bg-white p-4 space-y-4 shadow-xl w-full h-[90vh] rounded-t-xl overflow-y-auto"
  positionerJustify=""
  positionerAlign="items-end"
  positionerPadding=""
  transitionsPositionerIn={{ y: 600, duration: 200 }}
  transitionsPositionerOut={{ y: 600, duration: 200 }}
  backdropClasses="backdrop-blur-md bg-black/20"
>
  {#snippet content()}
    <header class="flex justify-between items-center px-4">
      
      <button 
        type="button" 
        class="text-gray-500 hover:text-gray-700" 
        onclick={handleCloseDrawer}
        aria-label="Close drawer"
      >
        <i class="fa-solid fa-xmark text-2xl"></i>
      </button>
    </header>
    <div class="max-w-7xl mx-auto ">
			<h1 class="text-2xl font-bold">{title}</h1>
      {@render children()}
    </div>
  {/snippet}
</Modal>