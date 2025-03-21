<script lang="ts">
	import Marqueeck from '@arisbh/marqueeck';
	import { partners, type Partner } from '$lib/data/partnersData';
	import Tooltip from '$lib/utils/Tooltip.svelte';

	type MarqueeckOptions = {
		direction: 'left' | 'right';
		speed: number;
	};

	const firstHalf = partners.slice(0, Math.ceil(partners.length / 2));
	const secondHalf = partners.slice(Math.ceil(partners.length / 2));

	const leftOptions: MarqueeckOptions = {
		direction: 'left',
		speed: 15
	};

	const rightOptions: MarqueeckOptions = {
		direction: 'right',
		speed: 15
	};
</script>

<div
	class="my-8 [-webkit-mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
>
	<!-- First Marquee (Left) -->
	<div class="mb-8">
		<Marqueeck options={leftOptions}>
			<div class="flex items-center gap-12 px-4">
				{#each firstHalf as partner}
					<Tooltip content={partner.name}>
						<a
							href={partner.url}
							target="_blank"
							rel="noopener noreferrer"
							class="partner-logo flex h-20 items-center justify-center transition-transform hover:scale-110"
							aria-label={`Visit ${partner.name} website`}
							tabindex="0"
							on:click={() => {}}
							on:keydown={(e) => e.key === 'Enter' && window.open(partner.url, '_blank')}
						>
							<img
								src={partner.logo}
								alt={partner.altText}
								class="h-full max-w-40 object-contain {partner.isRounded
									? 'rounded-full'
									: ''} grayscale transition-all hover:grayscale-0"
							/>
						</a>
					</Tooltip>
				{/each}
			</div>
		</Marqueeck>
	</div>

	<!-- Second Marquee (Right) -->
	<div>
		<Marqueeck options={rightOptions}>
			<div class="flex items-center gap-12 px-4">
				{#each secondHalf as partner}
					<Tooltip content={partner.name}>
						<a
							href={partner.url}
							target="_blank"
							rel="noopener noreferrer"
							class="partner-logo flex h-20 items-center justify-center transition-transform hover:scale-110"
							aria-label={`Visit ${partner.name} website`}
							tabindex="0"
							on:click={() => {}}
							on:keydown={(e) => e.key === 'Enter' && window.open(partner.url, '_blank')}
							title={partner.name}
						>
							<img
								src={partner.logo}
								alt={partner.altText}
								class="h-full max-w-40 object-contain {partner.isRounded
									? 'rounded-full'
									: ''} grayscale transition-all hover:grayscale-0"
							/>
						</a>
					</Tooltip>
				{/each}
			</div>
		</Marqueeck>
	</div>
</div>
