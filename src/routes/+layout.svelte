<script lang="ts">
	import '../app.css';
	let { children } = $props();
  </script>
  
  <div class="dark-background">
	{@render children()}
  </div>