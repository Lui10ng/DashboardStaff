<script lang="ts">
	import { DatePicker } from 'bits-ui'; // Use an alias
	import { createEventDispatcher } from 'svelte';
	import {
		type DateValue,
		CalendarDate,
		parseDate as internationalParseDate, // Function to parse YYYY-MM-DD string to DateValue
		getLocalTimeZone // Needed for converting DateValue to JS Date
		// today // Optionally for placeholder
	} from '@internationalized/date';

	const dispatch = createEventDispatcher();

	// Props
	let { name = '', label = '', value = '' } = $props(); // `value` is a string like "05-13-2025"

	// Function to parse your input string (e.g., "MM-DD-YYYY") into a DateValue
	function parseStringToDateValue(dateString: string): DateValue | undefined {
		if (!dateString) return undefined;
		try {
			const parts = dateString.split('-');
			// Assuming "MM-DD-YYYY" from your parent form
			if (
				parts.length === 3 &&
				parts[0].length === 2 &&
				parts[1].length === 2 &&
				parts[2].length === 4
			) {
				const month = parseInt(parts[0], 10);
				const day = parseInt(parts[1], 10);
				const year = parseInt(parts[2], 10);
				if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
					return new CalendarDate(year, month, day);
				}
			}
			// Fallback if the format might be YYYY-MM-DD or other
			return internationalParseDate(dateString); // Tries to parse YYYY-MM-DD
		} catch (e) {
			console.warn(
				`[DatePicker ${name}] Failed to parse date string "${dateString}" into DateValue:`,
				e
			);
			return undefined;
		}
	}

	let internalDateValue = $derived(parseStringToDateValue(value));

	// This function is called by bits-ui's onValueChange and receives a DateValue
	function handleBitsUIDateChange(newDateValue: DateValue | undefined) {
		let jsDateForParent: Date | null = null;
		if (newDateValue) {
			try {
				console.log('JS Date for parent:', newDateValue);
				// Convert DateValue to standard JavaScript Date for the parent
				jsDateForParent = newDateValue.toDate(getLocalTimeZone());

				console.log(`[DatePicker ${name}] Converted DateValue to JS Date:`, jsDateForParent);
				/**
				 * [DatePicker startDate] Converted DateValue to JS Date: Wed May 28 2025 00:00:00 GMT+0800 (Philippine Standard Time)
				 */
				console.log(jsDateForParent.toISOString()); // 2025-05-27T16:00:00.000Z
			} catch (error) {
				console.error(`[DatePicker ${name}] Error converting DateValue to JS Date:`, error);
			}
		}
		dispatch('dateChange', { name, date: jsDateForParent });
		// console.log(`[DatePicker ${name}] Selected DateValue:`, newDateValue, "Dispatched JS Date:", jsDateForParent);
	}
</script>

<DatePicker.Root
	weekdayFormat="short"
	fixedWeeks={true}
	onValueChange={handleBitsUIDateChange}
	value={internalDateValue}
>
	<div class="flex w-full max-w-[232px] flex-col gap-1.5">
		<DatePicker.Label class="block select-none text-sm font-medium">{label}</DatePicker.Label>
		<DatePicker.Input
			{name}
			class="h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover flex w-full max-w-[232px] select-none items-center border px-2 py-3 text-sm tracking-[0.01em]"
		>
			{#snippet children({ segments })}
				{#each segments as { part, value }}
					<div class="inline-block select-none">
						{#if part === 'literal'}
							<DatePicker.Segment {part} class="text-muted-foreground p-1">
								{value}
							</DatePicker.Segment>
						{:else}
							<DatePicker.Segment
								{part}
								class="rounded-5px hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1"
							>
								{value}
							</DatePicker.Segment>
						{/if}
					</div>
				{/each}
				<DatePicker.Trigger
					class="text-foreground/60 hover:bg-muted active:bg-dark-10 ml-auto inline-flex size-8 items-center justify-center rounded-[5px] transition-all"
				>
					<i class="fa-solid fa-calendar-days"></i>
				</DatePicker.Trigger>
			{/snippet}
		</DatePicker.Input>
		<DatePicker.Content sideOffset={6} class="z-50">
			<DatePicker.Calendar
				class="border-dark-10 bg-background-alt shadow-popover rounded-[15px] border p-[22px]"
			>
				{#snippet children({ months, weekdays })}
					<DatePicker.Header class="flex items-center justify-between">
						<DatePicker.PrevButton
							class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
						>
							<i class="fa-solid fa-chevron-left"></i>
						</DatePicker.PrevButton>
						<DatePicker.Heading class="text-[15px] font-medium" />
						<DatePicker.NextButton
							class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
						>
							<i class="fa-solid fa-chevron-right"></i>
						</DatePicker.NextButton>
					</DatePicker.Header>
					<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
						{#each months as month}
							<DatePicker.Grid class="w-full border-collapse select-none space-y-1">
								<DatePicker.GridHead>
									<DatePicker.GridRow class="mb-1 flex w-full justify-between">
										{#each weekdays as day}
											<DatePicker.HeadCell
												class="text-muted-foreground font-normal! w-10 rounded-md text-xs"
											>
												<div>{day.slice(0, 2)}</div>
											</DatePicker.HeadCell>
										{/each}
									</DatePicker.GridRow>
								</DatePicker.GridHead>
								<DatePicker.GridBody>
									{#each month.weeks as weekDates}
										<DatePicker.GridRow class="flex w-full">
											{#each weekDates as date}
												<DatePicker.Cell
													{date}
													month={month.value}
													class="p-0! relative size-10 text-center text-sm"
												>
													<DatePicker.Day
														class="rounded-9px text-foreground hover:border-foreground data-selected:bg-foreground data-disabled:text-foreground/30 data-selected:text-background data-unavailable:text-muted-foreground data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through group relative inline-flex size-10 items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal transition-all"
													>
														<div
															class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full transition-all"
														></div>
														{date.day}
													</DatePicker.Day>
												</DatePicker.Cell>
											{/each}
										</DatePicker.GridRow>
									{/each}
								</DatePicker.GridBody>
							</DatePicker.Grid>
						{/each}
					</div>
				{/snippet}
			</DatePicker.Calendar>
		</DatePicker.Content>
	</div>
</DatePicker.Root>
