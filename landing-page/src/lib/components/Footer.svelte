<script lang="ts">
	// import Cookies from "../components/ui/cookies-drawer.svelte";
	import emailjs from '@emailjs/browser';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import 'remixicon/fonts/remixicon.css';

	let email = '';
	let isSubmitting = false;
	let submitStatus = '';
	let showDrawer = false;
	const currentYear = new Date().getFullYear();
	$: shouldAddMargin = $page.url.pathname !== '/';
	const urlConfig = $page.data.urlConfig;

	async function handleSubscribe(event: Event) {
    event.preventDefault();
    isSubmitting = true;
    
    try {
      const templateParams = {
        to_email: email,
        message: 'Hi pogi',
        from_name: 'Veent Newsletter',
        reply_to: 'hello@veent.io',
        to_name: email.split('@')[0],
        email: email 
      };

      await emailjs.send(
        'service_5i9hiut', 
        'template_dzr2jko',
        templateParams,
        'F3jIEcOZHxESA2uOw'
      );
      
      submitStatus = 'Success! Check your email.';
      email = '';
    } catch (error: any) {
      console.error('Email failed to send:', error);
      submitStatus = error.text || 'Something went wrong. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }

	
	onMount(() => {
   
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          showDrawer = true;
          console.log('Drawer triggered:', { showDrawer, timestamp: new Date().toISOString() });
        } else {
          showDrawer = false;
          console.log('Drawer hidden:', { showDrawer, timestamp: new Date().toISOString() });
        }
      });
    }, 
    { 
      threshold: 0.3,
      rootMargin: '100px'
    });

   
    const footer = document.querySelector('#footer-trigger');
    
    if (footer) {
      observer.observe(footer);
      console.log('Footer observer initialized with element:', footer);
    } else {
      console.error('Footer element not found! Looking for #footer-trigger');
    }

    return () => {
      if (footer) {
        observer.unobserve(footer);
        console.log('Footer observer cleaned up');
      }
    };
  });

</script>

<section 
		id= "footer-trigger" 
		class={`bg-[linear-gradient(80deg,#AE0D09_31%,#B7100B_39%,#6B1816_80%)] text-white py-12 relative
			${shouldAddMargin ? 'mt-[100px]' : ''}`}
		>
	<div class="">																					
		<img src="/assets/icons/Mount-2.svg" alt="Veent Logo" 
		class="absolute size-[200px] mt-[-295px] left-[-2px] transform 
        -translate-y-[-90px] z-[1px] 
        md:w-90 md:h-50 md:mt-[-326px] md:ml-[-32px]
        lg:w-100 lg:h-60 lg:mt-[-355px] lg:ml-[-40px]"
  /> 	
	</div>


	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 ">

		<div class="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-8 lg:gap-8 lg:grid-cols-5">

			<div class="md:col-span-2 grid grid-cols-2 gap-4 lg:col-span-2"> 
				<div class="text-start ml-[40px] md:text-left md:ml-[-10px] lg:ml-[-10px]">
					<h3 class="font-semibold mb-4 text-xl">Navigation</h3>
					<ul class="space-y-2">
					  <li><a href="/" class="hover:underline">Home</a></li>
					  <li><a href="/features" class="hover:underline">Features</a></li>
					  <li><a href="/pricing" class="hover:underline">Pricing</a></li>
					  <li><a href="/about-us" class="hover:underline">About us</a></li>
					</ul>
				</div>

				<div class="text-start ml-[50px] md:text-left md:ml-[-20px] lg:ml-[-20px]">
					<h3 class="font-semibold mb-4 text-xl">Resources</h3>
					<ul class="space-y-2">
					  <li><a href="/help-center" class="hover:underline">Help Center</a></li>
					  <li><a href="/blog" class="hover:underline">Blog</a></li>
					</ul>
				</div>
			</div>

			<div class="md:col-span-2 grid grid-cols-2 gap-4 lg:col-span-2"> 

				<div class="text-start ml-[35px] md:text-left md:ml-[-40px] lg:ml-[-20px] xl:ml-[5px] ">
					<h3 class="font-semibold mb-4 text-xl">Social Media</h3>
					<div class="flex space-x-4 md:space-x-4 lg:space-x-6">
						<a aria-label="Facebook" href="https://www.facebook.com/veent.io/" class="hover:opacity-80">
							<i class="ri-facebook-fill text-lg md:text-lg lg:text-lg"></i>
						</a>
						<a aria-label="Instagram" href="https://www.instagram.com/veentapps/" class="hover:opacity-80">
							<i class="ri-instagram-line text-lg md:text-lg lg:text-lg"></i>
						</a>
						<a aria-label="LinkedIn" href="https://www.linkedin.com/company/veent/" class="hover:opacity-80">
							<i class="ri-linkedin-fill text-lg md:text-lg lg:text-lg"></i>
						</a>
						<a aria-label="TikTok" href="https://www.tiktok.com/@veentapps" class="hover:opacity-80">
							<i class="ri-tiktok-fill text-lg md:text-lg lg:text-lg"></i>
						</a>
					</div>
				</div>	
					<div class="text-start ml-[35px] md:text-left md:ml-[-30px] xl:ml-[40px] ">
						<h3 class="font-semibold mb-4 text-xl">Contact Us</h3>
						<p>hello@veent.io</p>
					</div>
				</div>

<!-- Newsletter to be implemented soon -->
		<div class="w-full md:ml-[-30px] md:w-[150px] lg:w-[260px] xl:ml-[20px] " >
			<!-- <h3 class="font-semibold mb-4 text-xl ">Newsletter</h3>
			<p class="mb-4 text-white ">Subscribe to get the latest updates</p>
			<form class="flex md:flex-col lg:flex-col xl:flex-col " on:submit={handleSubscribe}>
			  <input
				type="email"
				bind:value={email}
				placeholder="Enter your email"
				
				class="flex-1 px-4 py-3 bg-white/90 placeholder-gray-500
					   w-[100px] md:w-[150px] lg:w-[200px]
					   text-gray-600 md:text-sm"
				required
			  />
			  <button
				type="submit"
				class="bg-[#D12F2B] text-white font-semibold px-6 py-3 hover:bg-[#B52320]
						md:w-[150px] lg:w-[200px] xl:w-[200px]
						md:mt-3
					   "
				disabled={isSubmitting}
			  >
			  {isSubmitting ? 'Sending...' : 'Subscribe'}
			  </button>
			</form>
			{#if submitStatus}
				<p class="mt-2 text-sm {submitStatus.includes('Success') ? 'text-green-400' : 'text-red-400'}">
					{submitStatus}
				</p>
			{/if} -->
			<!-- signup button -->
			<div class="hidden md:block md:w-[150px] md:mt-3 lg:w-[200px]  ">
			  <a href={urlConfig.signupUrl} class="hover:opacity-80 transition-opacity">
				<img src="/assets/icons/ticket-2.svg" alt="ticket">
			  </a>
			</div>
			<div class="md:hidden w-full mt-5 flex justify-center">
			   <a href={urlConfig.signupUrl} 
				 class="hover:opacity-80 transition-opacity">
				<img src="/assets/icons/ticket.svg" alt="ticket">
			   </a>
			  </div>
		  </div>
	  </div>
	


	  <div class="mt-12 pt-8 border-t border-white/10">
		<div class="flex flex-col space-y-8">
		  
		  <div class="flex flex-row justify-center md:justify-end space-x-4 md:space-x-8 lg:space-x-8 md:order-2 md:mt-[-25px] lg:mt-[-25px] ">
			<a href="/terms" class="text-sm hover:underline whitespace-nowrap md:text-base">Terms & conditions</a>
			<a href="/privacy" class="text-sm hover:underline whitespace-nowrap md:text-base">Privacy policy</a>
			<a href="/cookies" class="text-sm hover:underline whitespace-nowrap md:text-base">Cookie policy</a>
		  </div>
	  
		 
		  <div class="flex flex-col items-center md:items-start space-y-4 md:order-1">
			<div class="text-center md:text-left">
			  <p class="text-white font-bold mb-2  md:ml-[20px] lg:ml-[20px]">Powered By</p>
			  <img src="/assets/icons/Veent-red-logo.svg" alt="Veent Logo" class="w-33 h-15 md:w-28 lg:w-33" />
			</div>
			<p class="text-white text-base md:text-base">&copy; {currentYear} Veent. All Rights Reserved.</p>
		  </div>
		</div>
	  </div>
	</div>
	<!-- cookie drawer to be implemented soon -->
	<!-- <Cookies {showDrawer} />	 -->
</section>



