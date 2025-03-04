<script>
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import MessengerQuickChat from '$lib/components/MessengerQuickChat.svelte';

	export let data;
</script>

<Nav loginUrl={data.urlConfig.loginUrl} />
<slot />
<MessengerQuickChat fbMessengerUrl={data.urlConfig.fbMessengerUrl} />
<Footer />
