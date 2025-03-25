<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { EventData, CountdownData } from '$lib/types/event';
	import Header from '$lib/components/layout/Header.svelte';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';
	import PostsSection from '$lib/components/layout/PostsSection.svelte';
	import RegisterSection from '$lib/components/layout/RegisterSection.svelte';
	import ContactSection from '$lib/components/layout/ContactSection.svelte';
	import { calculateCountdown } from '$lib/types/countdown';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { dummyEventData } from '$lib/types/dummy';

	let countdown: CountdownData = {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0
	};
	let isEventStarted = false;
	let isEventEnded = false;
	let countdownInterval: ReturnType<typeof setInterval>;
	let isMobileMenuOpen = false;
	const registrationData = dummyEventData;

	function updateCountdown() {
		if (registrationData?.startDate && registrationData?.startTime) {
			const now = new Date();
			const eventStart = new Date(`${registrationData.startDate}T${registrationData.startTime}`);
			const eventEnd = new Date(`${registrationData.endDate}T${registrationData.endTime}`);

			isEventStarted = now >= eventStart;
			isEventEnded = now >= eventEnd;

			countdown = calculateCountdown(
				registrationData.startDate,
				registrationData.startTime,
				registrationData.endDate,
				registrationData.endTime
			);
		}
	}

	onMount(() => {
		updateCountdown();
		countdownInterval = setInterval(updateCountdown, 1000);
	});

	onDestroy(() => {
		if (countdownInterval) clearInterval(countdownInterval);
	});
</script>

<div class="min-h-screen bg-[#1a1f2e] text-white">
	<Header companyLogo={registrationData.companyLogo} {isMobileMenuOpen} />

	<HeroSection event={registrationData} />
	<!-- <CountdownTimer {countdown} {isEventStarted} {isEventEnded} /> -->
	<PostsSection />
	<RegisterSection />
	<ContactSection />
	<Footer />
</div>
