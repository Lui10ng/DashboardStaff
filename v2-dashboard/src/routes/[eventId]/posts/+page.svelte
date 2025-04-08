<script>
	import { fly } from 'svelte/transition';
</script>

<div in:fly={{ y: -50, duration: 200 }}>Post</div>
