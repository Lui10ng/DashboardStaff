<script lang="ts">
	import { SignUp } from 'svelte-clerk';
</script>

<div class="prose mx-auto space-y-5">
	<SignUp
        appearance={{
            elements: {
                rootBox: 'mx-auto',
                formButtonPrimary: {
                    background: '#d12f2b !important',
                    boxShadow: 'none !important'
                },
                socialButtonsBlockButton: {
                    'padding-top': '0px',
                    'padding-bottom': '0px'
                }
            }
        }}
	/>
</div>
