<script lang="ts">
    import Navigation from './Navigation.svelte';
    import MobileNavigation from './MobileNavigation.svelte';
    
    export let companyLogo: string | null;
    export let isMobileMenuOpen = false;
    
    function toggleMobileMenu() {
      isMobileMenuOpen = !isMobileMenuOpen;
    }

    function closeMobileMenu() {
      isMobileMenuOpen = false;
    }
  </script>
  
  <header class="fixed top-0 left-0 right-0 z-50">
    <div class="bg-[#1a1f2e]/80 backdrop-blur-[10px]">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div>
            {#if companyLogo}
              <img src={companyLogo} alt="Company Logo" class="h-8" />
            {/if}
          </div>
  

          <Navigation />
  
         
          <button class="md:hidden text-white" on:click={toggleMobileMenu} aria-label="Toggle Mobile Menu"  >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {#if !isMobileMenuOpen}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              {:else}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              {/if}
            </svg>
          </button>
        </div>
      </div>
    </div>
  
    <MobileNavigation 
    isOpen={isMobileMenuOpen} 
    onClose={closeMobileMenu} />
  </header>