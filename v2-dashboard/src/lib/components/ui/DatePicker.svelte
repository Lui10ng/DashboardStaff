<script lang="ts">
	import { DatePicker } from 'bits-ui';

	let { name } = $props();

	function isDateDisabled(date: any) {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Create the date from year, month, day
		const selectedDate = new Date(date.year, date.month - 1, date.day);

		return selectedDate < today;
	}
</script>

<DatePicker.Root weekdayFormat="short" fixedWeeks={true} {isDateDisabled}>
	<div class="flex w-full flex-col gap-1.5">
		<DatePicker.Input
			{name}
			class="h-input rounded-input border-border-input bg-background focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover flex w-full select-none items-center border px-2 py-4 tracking-[0.01em]  text-gray-500"
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
					class="text-foreground/60 hover:bg-muted active:bg-dark-10  ml-auto inline-flex size-8 items-center justify-center rounded-[5px] transition-all"
				>
					<i class="fa-regular fa-calendar-minus hover:text-primary text-gray-400"></i>
				</DatePicker.Trigger>
			{/snippet}
		</DatePicker.Input>
		<DatePicker.Content sideOffset={6} class="z-50" preventScroll>
			<DatePicker.Calendar
				class="border-dark-10 bg-background-alt shadow-popover rounded-[15px] border p-[22px]"
			>
				{#snippet children({ months, weekdays })}
					<DatePicker.Header class=" flex items-center justify-between">
						<DatePicker.PrevButton
							class="rounded-9px bg-background-alt hover:bg-muted hover:text-primary inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
						>
							<i class="fa-solid fa-chevron-left"></i>
						</DatePicker.PrevButton>
						<DatePicker.Heading class="text-[15px] font-medium" />
						<DatePicker.NextButton
							class="rounded-9px bg-background-alt hover:bg-muted hover:text-primary inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
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
												class="font-normal! text-primary w-10 rounded-md text-xs"
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
														class="rounded-9px text-foreground hover:border-foreground data-selected:bg-primary data-disabled:text-foreground/30 data-selected:text-background data-unavailable:text-muted-foreground data-disabled:cursor-not-allowed data-disabled:border-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through group relative inline-flex size-10 cursor-pointer items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal transition-all"
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
