<script>
  import { slide } from 'svelte/transition';
  import { setCookiePreference, getCookiePreference } from '$lib/services/cookieService';
  export let showDrawer = false;

  function handleAllowCookies() {
    setCookiePreference('all');
    showDrawer = false;
    console.log('All cookies accepted');
  }

  function handleNecessaryCookies() {
    setCookiePreference('necessary');
    showDrawer = false;
    console.log('Only necessary cookies accepted');
  }

  // Check existing preferences when component mounts
  $: {
    const preference = getCookiePreference();
    if (preference) {
      showDrawer = false;
    }
  }
</script>

{#if showDrawer}
  <div
    transition:slide={{ duration: 500, axis: 'y' }}
    class="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-[45] md:h-[380px]"
  >
    <div class="p-6 max-w-7xl mx-auto ">
     
      <div class="md:hidden">
        <div class="text-start">
          <p class="text-black font-bold  ">Powered By</p>
          <img src="/assets/icons/Veent-red-logo.svg" alt="Veent Logo" class="w-20 h-20" />
        </div>
        <div class="flex flex-col space-y-4">
          <h1 class="text-black font-bold text-base ">
            This website uses Cookie
          </h1>
          <p class="text-black text-sm">
            We use cookies to personalise content and ads and to analyse our traffic. 
            Click Settings to change your cookie preferences. You consent to our cookies if you continue to use our website.
          </p>
          <button 
           
            class="flex items-start justify-start space-x-2 text-[#D12F2B] font-semibold">
            <span>Settings</span>
            <i class="ri-arrow-right-s-line text-black"></i>
          </button>
          <div class="flex flex-col space-y-3 mt-4 ">
            <button 
              on:click={handleAllowCookies}
              class="w-full bg-[#D12F2B] text-white rounded-lg py-3 font-semibold hover:bg-[#B52320] transition-colors"
            >
              Allow all Cookies
            </button>
            <button 
              on:click={handleNecessaryCookies}
              class="w-full border border-[#D12F2B] text-[#D12F2B] rounded-lg py-3 font-semibold hover:bg-gray-50 transition-colors"
            >
              Use only necessary Cookies
            </button>
            
          </div>
        </div>
      </div>

      
      <div class="hidden md:grid md:grid-cols-3 md:gap-8 md:h-full mt-[100px] ">
        
        <div class="text-start ">
          <p class="text-black font-bold mr-70 mt-13">Powered By</p>
          <img src="/assets/icons/Veent-red-logo.svg" alt="Veent Logo" class="w-20 h-20  " />
        </div>

        
        <div class="flex flex-col items-start justify-start space-y-1 ml-[-300px] md:w-[400px] md:ml-[-100px] lg:ml-[-230px] lg:w-auto xl:w-auto ">
          <h1 class="text-black font-bold text-2xl ">
            This website uses Cookie
          </h1>
          <p class="text-black text-base">
            We use cookies to personalise content and ads and to analyse our traffic. 
            Click Settings to change your cookie preferences. You consent to our cookies if you continue to use our website. 
          </p>
          <div class="flex space-x-4 mt-4"> 
            <button 
              
            class="font-bold text-[#D12F2B] rounded-lg hover:bg-gray-50 transition-colors">
              Settings
              <i class="ri-arrow-right-s-line text-black"></i>
            </button>
          </div>
        </div>

       
        <div class="text-center flex flex-col justify-end">
          <button 
          on:click={handleAllowCookies}
          class="bg-[#D12F2B] text-white rounded-lg hover:bg-[#B52320] transition-colors w-[300px] h-[65px] ml-[100px] mb-[20px] font-semibold
                      md:w-[120px]  lg:w-auto"

        >
          Allow all Cookies
        </button>
        <button 
            on:click={handleNecessaryCookies}
            class="border border-[#D12F2B] text-[#D12F2B] rounded-lg hover:bg-gray-50 transition-colors w-[300px] h-[65px] ml-[100px] font-semibold
                       md:w-[120px]  md:h-[80px]  lg:w-auto   "
          >
            Use only necessary Cookies
        </button>
        </div>
      </div>
    </div>
  </div>
{/if}