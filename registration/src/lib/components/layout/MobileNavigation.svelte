<script lang="ts">
    import PostsSection from '$lib/components/layout/PostsSection.svelte';
    import ContactSection from '$lib/components/layout/ContactSection.svelte';
    import RegisterSection from '$lib/components/layout/RegisterSection.svelte';
    import { scrollTo } from '$lib/types/scroll';
  
  export let isOpen: boolean;
  export let onClose: () => void;

  async function handleLinkClick(event: MouseEvent, targetId: string) {
    event.preventDefault();
    onClose();

    await scrollTo(targetId);
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 bg-[#1a1f2e]/95">
    <nav class="flex flex-col items-center justify-center h-full space-y-8">
      <a href="#posts" 
        class="text-white hover:text-gray-300 text-xl" on:click={(event) => handleLinkClick(event, 'posts')}>Posts</a>
      <a href="#contact" 
        class="text-white hover:text-gray-300 text-xl" on:click={(event) => handleLinkClick(event, 'contact')}>Contact</a>
      <a href="#register" 
        class="text-white hover:text-gray-300 text-xl" on:click={(event) => handleLinkClick(event, 'register')}>Register</a>
    </nav>
  </div>
{/if}

<style>
  
  div {
    transition: opacity 0.3s ease-in-out;
  }
</style>