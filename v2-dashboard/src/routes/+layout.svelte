<script lang="ts">
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { Tooltip, DropdownMenu } from 'bits-ui';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import { ClerkProvider } from 'svelte-clerk/client';
	import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';
	import { SignedIn, SignedOut, SignInButton, SignOutButton } from 'svelte-clerk';

	const { children }: { children: Snippet } = $props();

	const push = (to: string) => goto(to);
	const replace = (to: string) => goto(to, { replaceState: true });

	const home = () => {
		goto('/');
	};

	const wallet = () => {
		goto('/wallet');
	};
</script>

<ClerkProvider
	publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}
	routerPush={push}
	routerReplace={replace}
>
	<div
		class="sticky left-0 top-0 flex items-center justify-between border border-gray-200 bg-white p-6"
	>
		<div class="sm:gap-13 flex gap-5">
			<Button onClick={home}>
				<img src="/images/veent-logo.svg" alt="veent" width="64" height="50" />
			</Button>
			<div class="flex items-center gap-5 font-semibold">
				<Button
					label="Home"
					onClick={home}
					type="button"
					icon="fa-solid fa-house"
					className="flex items-center gap-2 hover:text-primary text-gray-600 font-semibold
					{!$page.url.pathname.includes('wallet') ? 'text-primary' : ''}"
				/>
				<SignedIn>
					<Button
						label="Wallet"
						onClick={wallet}
						type="button"
						icon="fa-solid fa-wallet"
						className="flex items-center gap-2 hover:text-primary text-gray-600 font-semibold 
						{$page.url.pathname.includes('wallet') ? 'text-primary' : ''}"
					/>
				</SignedIn>
			</div>
		</div>
		<header class="prose flex items-center justify-between bg-white text-sm">
			<div class="ml-auto">
				<SignedOut>
					<SignInButton>
						<button
							class="w-full rounded bg-[#d12f2b] px-4 py-2 text-left text-white transition hover:bg-red-700"
						>
							Sign in
						</button>
					</SignInButton>
				</SignedOut>
				<SignedIn>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<button class="rounded-full border px-3 py-1 transition hover:bg-gray-100">
								Account
							</button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Item>
								<SignOutButton redirectUrl="/sign-in">Sign out</SignOutButton>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</SignedIn>
			</div>
		</header>
	</div>

	<div class="bg-white">
		<div class="mx-auto max-w-7xl px-5 pb-8 pt-6">
			<Tooltip.Provider>
				{@render children()}
			</Tooltip.Provider>
		</div>
	</div>
</ClerkProvider>
