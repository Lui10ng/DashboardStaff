<script lang="ts">
  export let className = '';
  import PostsSection from '$lib/components/layout/PostsSection.svelte';
  import ContactSection from '$lib/components/layout/ContactSection.svelte';
  import RegisterSection from '$lib/components/layout/RegisterSection.svelte';
  import { scrollTo } from '$lib/types/scroll';

  function handleLinkClick(event: MouseEvent, targetId: string) {
    event.preventDefault();
    scrollTo(targetId);
  }
</script>

<nav class={`hidden md:flex items-center space-x-8 ${className}`}>
  <a href="#posts" class="text-white hover:text-gray-300" on:click={(event) => handleLinkClick(event, 'posts')}>Posts</a>
  <a href="#contact" class="text-white hover:text-gray-300" on:click={(event) => handleLinkClick(event, 'contact')}>Contact</a>
  <a href="#register" class="text-white hover:text-gray-300 bg-red-600 px-4 py-2 rounded-md" on:click={(event) => handleLinkClick(event, 'register')}>Register</a>
</nav>

<style>     
  a {
    transition: opacity 0.3s ease-in-out;
  }
</style>
