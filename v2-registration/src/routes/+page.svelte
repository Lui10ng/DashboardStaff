<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { ProgressRing } from '@skeletonlabs/skeleton-svelte';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	let { data } = $props();
	let currentTab = $state('tab-0');

	const { form, errors, enhance, delayed } = superForm(data.form, {
		dataType: 'json'
	});

	let dataForms = $derived(data.form);

	let tabData = $derived.by(() => {
		const formFields = Object.keys(dataForms.constraints?.tabs ?? {});
		const newTab = formFields.reduce((acc: any, field) => {
			acc[field] = '';
			return acc;
		}, {});

		return newTab;
	});

	const addFormTab = () => {
		$form.tabs = [...$form.tabs, tabData];
	};

	$form.tabs = [...$form.tabs, tabData];
</script>

<form class="mx-auto max-w-xl space-y-5 p-10" action="?/register" method="POST" use:enhance>
	<Tabs defaultValue={currentTab} value={currentTab} onValueChange={(e) => (currentTab = e.value)}>
		{#snippet list()}
			{#each $form.tabs as _, i}
				<Tabs.Control value={`tab-${i}`}>Tab {i}</Tabs.Control>
			{/each}
		{/snippet}

		{#snippet content()}
			{#each $form.tabs as _, i}
				<Tabs.Panel value={`tab-${i}`}>
					<div class="space-y-5">
						{#each data.formBuilder as field}
							<div class="flex flex-col">
								{field.label}
								<input
									class="rounded-lg border px-4 py-2 outline-none {$errors.tabs?.[i]?.[field.name]
										? 'border-primary text-red-500'
										: ''}"
									type="text"
									data-invalid={$errors.tabs?.[i]?.[field.name]}
									bind:value={$form.tabs[i][field.name]}
								/>
								{#if $errors.tabs?.[i]?.[field.name]}
									<span class="text-sm text-red-500">{$errors.tabs[i][field.name]}</span>
								{/if}
							</div>
						{/each}
					</div>
				</Tabs.Panel>
			{/each}
		{/snippet}
	</Tabs>

	<div class="mt-5 flex items-center justify-center gap-5">
		<button class="rounded-lg bg-blue-400 px-3 py-2 text-white" type="button" onclick={addFormTab}
			>Add Tab</button
		>
		<button
			type="submit"
			class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white"
			>{#if $delayed}
				<ProgressRing
					value={null}
					size="size-4"
					meterStroke="stroke-tertiary-600-400"
					trackStroke="stroke-tertiary-50-950"
				/>
			{/if}Submit</button
		>
	</div>
</form>
