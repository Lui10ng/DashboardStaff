<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Chart, Svg, Axis, Pie, Spline, Highlight, Tooltip } from 'layerchart';
	import { scaleTime } from 'd3-scale';
	import { formatDate, PeriodType } from '@layerstack/utils';
	import { format } from 'date-fns';

	type DataPoint = { date: Date; value: number };
	type Stats = {
		value: number;
		change: string;
		label: string;
		color: string;
	};
	type MetricConfig = {
		label: string;
		icon: string;
		iconBgColor: string;
		iconColor: string;
		data: DataPoint[];
		formatValue: (value: number) => string;
		formatAxis: (value: number) => string;
		formatTooltip: (value: number) => string;
	};

	const METRIC_KEYS = {
		GROSS_SALES: 'grossSales',
		TOTAL_ORDERS: 'totalOrders',
		TOTAL_ATTENDEES: ' totalAttendees',
		TOTAL_TICKETS: 'totalTickets'
	} as const;

	type MetricKey = (typeof METRIC_KEYS)[keyof typeof METRIC_KEYS];

	const metricsData: Record<MetricKey, MetricConfig> = {
		[METRIC_KEYS.GROSS_SALES]: {
			label: 'Gross Sales',
			icon: 'fa-solid fa-chart-line',
			iconBgColor: 'bg-blue-200',
			iconColor: 'text-blue-500',
			data: [
				{ date: new Date('2025-03-24T16:00:00.000Z'), value: 15000 },
				{ date: new Date('2025-03-25T16:00:00.000Z'), value: 3200 },
				{ date: new Date('2025-03-26T16:00:00.000Z'), value: 23000 },
				{ date: new Date('2025-03-27T16:00:00.000Z'), value: 443563 },
				{ date: new Date('2025-03-28T16:00:00.000Z'), value: 9744321 },
				{ date: new Date('2025-03-29T16:00:00.000Z'), value: 75823 },
				{ date: new Date('2025-03-30T16:00:00.000Z'), value: 957812 },
				{ date: new Date('2025-03-31T16:00:00.000Z'), value: 7732832 },
				{ date: new Date('2025-04-01T16:00:00.000Z'), value: 97192 },
				{ date: new Date('2025-04-02T16:00:00.000Z'), value: 812134 },
				{ date: new Date('2025-04-03T16:00:00.000Z'), value: 23822 },
				{ date: new Date('2025-04-04T16:00:00.000Z'), value: 208671 },
				{ date: new Date('2025-04-05T16:00:00.000Z'), value: 2711 },
				{ date: new Date('2025-04-06T16:00:00.000Z'), value: 28823 },
				{ date: new Date('2025-04-07T16:00:00.000Z'), value: 77611 },
				{ date: new Date('2025-04-08T16:00:00.000Z'), value: 388982 },
				{ date: new Date('2025-04-09T16:00:00.000Z'), value: 2251 },
				{ date: new Date('2025-04-10T16:00:00.000Z'), value: 3232 }
			],
			formatValue: (value) => `₱${value.toLocaleString()}`,
			formatAxis: (value) => `₱${(value / 1000).toFixed(0)}k`,
			formatTooltip: (value) => `₱${value.toLocaleString()}`
		},
		[METRIC_KEYS.TOTAL_ORDERS]: {
			label: 'Total Orders',
			icon: 'fas fa-shopping-cart',
			iconBgColor: 'bg-purple-200',
			iconColor: 'text-purple-500',
			data: [
				// Week 1
				{ date: new Date('2025-03-24T16:00:00.000Z'), value: 2120 },
				{ date: new Date('2025-03-25T16:00:00.000Z'), value: 4135 },
				{ date: new Date('2025-03-26T16:00:00.000Z'), value: 142 },
				{ date: new Date('2025-03-27T16:00:00.000Z'), value: 2138 },
				{ date: new Date('2025-03-28T16:00:00.000Z'), value: 155 },
				{ date: new Date('2025-03-29T16:00:00.000Z'), value: 6160 },
				{ date: new Date('2025-03-30T16:00:00.000Z'), value: 2158 },
				// Week 2
				{ date: new Date('2025-03-31T16:00:00.000Z'), value: 5165 },
				{ date: new Date('2025-04-01T16:00:00.000Z'), value: 3170 },
				{ date: new Date('2025-04-02T16:00:00.000Z'), value: 163 },
				{ date: new Date('2025-04-03T16:00:00.000Z'), value: 175 },
				{ date: new Date('2025-04-04T16:00:00.000Z'), value: 1180 },
				{ date: new Date('2025-04-05T16:00:00.000Z'), value: 185 },
				{ date: new Date('2025-04-06T16:00:00.000Z'), value: 182 },
				// Week 3
				{ date: new Date('2025-04-07T16:00:00.000Z'), value: 190 },
				{ date: new Date('2025-04-08T16:00:00.000Z'), value: 42188 },
				{ date: new Date('2025-04-09T16:00:00.000Z'), value: 195 },
				{ date: new Date('2025-04-10T16:00:00.000Z'), value: 3167 },
				{ date: new Date('2025-04-11T16:00:00.000Z'), value: 200 },
				{ date: new Date('2025-04-12T16:00:00.000Z'), value: 2205 },
				{ date: new Date('2025-04-13T16:00:00.000Z'), value: 7202 }
			],
			formatValue: (value) => value.toLocaleString(),
			formatAxis: (value) => value.toLocaleString(),
			formatTooltip: (value) => value.toLocaleString()
		},
		[METRIC_KEYS.TOTAL_ATTENDEES]: {
			label: 'Total Attendees',
			icon: 'fa-solid fa-users',
			iconBgColor: 'bg-green-200',
			iconColor: 'text-green-500',
			data: [
				{ date: new Date('2025-03-24T16:00:00.000Z'), value: 180 },
				{ date: new Date('2025-03-25T16:00:00.000Z'), value: 195 },

				{ date: new Date('2025-03-26T16:00:00.000Z'), value: 210 },
				{ date: new Date('2025-03-27T16:00:00.000Z'), value: 205 },
				{ date: new Date('2025-03-28T16:00:00.000Z'), value: 220 },
				{ date: new Date('2025-03-29T16:00:00.000Z'), value: 235 },
				{ date: new Date('2025-03-30T16:00:00.000Z'), value: 240 },
				{ date: new Date('2025-03-31T16:00:00.000Z'), value: 250 },
				{ date: new Date('2025-04-01T16:00:00.000Z'), value: 260 },
				{ date: new Date('2025-04-02T16:00:00.000Z'), value: 255 },
				{ date: new Date('2025-04-03T16:00:00.000Z'), value: 270 },
				{ date: new Date('2025-04-04T16:00:00.000Z'), value: 280 },
				{ date: new Date('2025-04-05T16:00:00.000Z'), value: 275 },
				{ date: new Date('2025-04-06T16:00:00.000Z'), value: 290 },
				{ date: new Date('2025-04-07T16:00:00.000Z'), value: 300 },
				{ date: new Date('2025-04-08T16:00:00.000Z'), value: 310 },
				{ date: new Date('2025-04-09T16:00:00.000Z'), value: 305 },

				{ date: new Date('2025-04-10T16:00:00.000Z'), value: 256 },
				{ date: new Date('2025-04-11T16:00:00.000Z'), value: 265 },
				{ date: new Date('2025-04-12T16:00:00.000Z'), value: 278 },
				{ date: new Date('2025-04-13T16:00:00.000Z'), value: 295 }
			],
			formatValue: (value) => value.toLocaleString(),
			formatAxis: (value) => value.toLocaleString(),
			formatTooltip: (value) => value.toLocaleString()
		},
		[METRIC_KEYS.TOTAL_TICKETS]: {
			label: 'Total Tickets Sold',
			icon: 'fa-solid fa-ticket',
			iconBgColor: 'bg-red-200',
			iconColor: 'text-red-500',
			data: [
				{ date: new Date('2025-03-24T16:00:00.000Z'), value: 75 },
				{ date: new Date('2025-03-25T16:00:00.000Z'), value: 82 },
				{ date: new Date('2025-03-26T16:00:00.000Z'), value: 90 },
				{ date: new Date('2025-03-27T16:00:00.000Z'), value: 85 },
				{ date: new Date('2025-03-28T16:00:00.000Z'), value: 95 },
				{ date: new Date('2025-03-29T16:00:00.000Z'), value: 110 },
				{ date: new Date('2025-03-30T16:00:00.000Z'), value: 105 },
				{ date: new Date('2025-03-31T16:00:00.000Z'), value: 115 },
				{ date: new Date('2025-04-01T16:00:00.000Z'), value: 120 },
				{ date: new Date('2025-04-02T16:00:00.000Z'), value: 118 },
				{ date: new Date('2025-04-03T16:00:00.000Z'), value: 125 },
				{ date: new Date('2025-04-04T16:00:00.000Z'), value: 130 },
				{ date: new Date('2025-04-05T16:00:00.000Z'), value: 128 },
				{ date: new Date('2025-04-06T16:00:00.000Z'), value: 135 },
				{ date: new Date('2025-04-07T16:00:00.000Z'), value: 140 },
				{ date: new Date('2025-04-08T16:00:00.000Z'), value: 145 },
				{ date: new Date('2025-04-09T16:00:00.000Z'), value: 142 },
				{ date: new Date('2025-04-10T16:00:00.000Z'), value: 101 },
				{ date: new Date('2025-04-11T16:00:00.000Z'), value: 112 },
				{ date: new Date('2025-04-12T16:00:00.000Z'), value: 122 },
				{ date: new Date('2025-04-13T16:00:00.000Z'), value: 133 }
			],
			formatValue: (value) => value.toLocaleString(),
			formatAxis: (value) => value.toLocaleString(),
			formatTooltip: (value) => value.toLocaleString()
		}
	};

	let selectedCard = $state<MetricKey | ''>(METRIC_KEYS.GROSS_SALES);

	function calculateCardStats(data: DataPoint[]): Stats {
		if (data.length < 14) {
			const currentValue = data.length > 0 ? data[data.length - 1].value : 0;
			return {
				value: currentValue,
				change: 'N/A',
				label: 'vs last week',
				color: 'text-gray-500'
			};
		}

		const lastWeekData = data.slice(-7);
		const previousWeekData = data.slice(-14, -7);

		const lastWeekTotal = lastWeekData.reduce((sum, item) => sum + item.value, 0);
		const previousWeekTotal = previousWeekData.reduce((sum, item) => sum + item.value, 0);

		let percentageChange = 0;
		if (previousWeekTotal !== 0) {
			percentageChange = ((lastWeekTotal - previousWeekTotal) / previousWeekTotal) * 100;
		} else if (lastWeekTotal > 0) {
			percentageChange = Infinity;
		}

		const currentValue = data[data.length - 1].value;
		const changeColor = percentageChange >= 0 ? 'text-green-500' : 'text-red-500';
		const changePrefix = percentageChange >= 0 && isFinite(percentageChange) ? '+' : '';
		const changeSuffix = isFinite(percentageChange) ? '%' : '';
		const changeValue = isFinite(percentageChange) ? percentageChange.toFixed(1) : '∞';

		return {
			value: currentValue,
			change: `${changePrefix}${changeValue}${changeSuffix}`,
			label: 'vs last week',
			color: changeColor
		};
	}

	const statistics = $derived(
		Object.entries(metricsData).reduce(
			(account, [key, config]) => {
				account[key as MetricKey] = calculateCardStats(config.data);
				return account;
			},
			{} as Record<MetricKey, Stats>
		)
	);

	function handleCardClick(cardType: MetricKey) {
		selectedCard = selectedCard === cardType ? '' : cardType;
	}

	function closeChart() {
		selectedCard = '';
	}

	const renderContext = {
		width: typeof window !== 'undefined' ? window.innerWidth * 0.8 : 800,
		height: 400
	};

	const dateSeriesData = [
		{ date: new Date('2025-03-29T16:00:00.000Z'), value: 67 },
		{ date: new Date('2025-03-30T16:00:00.000Z'), value: 87 },
		{ date: new Date('2025-03-31T16:00:00.000Z'), value: 72 },
		{ date: new Date('2025-04-01T16:00:00.000Z'), value: 76 },
		{ date: new Date('2025-04-02T16:00:00.000Z'), value: 89 },
		{ date: new Date('2025-04-03T16:00:00.000Z'), value: 81 },
		{ date: new Date('2025-04-04T16:00:00.000Z'), value: 92 },
		{ date: new Date('2025-04-05T16:00:00.000Z'), value: 65 },
		{ date: new Date('2025-04-06T16:00:00.000Z'), value: 54 },
		{ date: new Date('2025-04-07T16:00:00.000Z'), value: 96 },
		{ date: new Date('2025-04-08T16:00:00.000Z'), value: 64 },
		{ date: new Date('2025-04-09T16:00:00.000Z'), value: 57 }
	];

	const data = [
		{ date: new Date('2025-03-28T16:00:00.000Z'), value: 56, percentage: '21.9%' },
		{ date: new Date('2025-03-29T16:00:00.000Z'), value: 100, percentage: '39.1%' },
		{ date: new Date('2025-03-30T16:00:00.000Z'), value: 100, percentage: '39.1%' }
	];

	const keyColors = ['#4F46E5', '#818CF8', '#C7D2FE'];
</script>

<div class="relative space-y-8" in:fly={{ y: -50, duration: 200 }}>
	<!-- Statistic Cards -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		{#each Object.entries(metricsData) as [key, config]}
			{@const metricKey = key as MetricKey}
			{@const stats = statistics[metricKey]}
			<div
				class="relative cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
				onclick={() => handleCardClick(metricKey)}
				role="button"
				tabindex="0"
				onkeydown={(e) => e.key === 'Enter' && handleCardClick(metricKey)}
			>
				<div
					class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full {config.iconBgColor}"
				>
					<i class="{config.icon} {config.iconColor}"></i>
				</div>
				<div class="p-4">
					<h3 class="text-start text-sm text-gray-500">{config.label}</h3>
					<p class="text-start text-2xl font-semibold">{config.formatValue(stats.value)}</p>
					<div class="flex items-center gap-1">
						<span class="text-start text-xs {stats.color}">{stats.change}</span>
						<span class="text-start text-xs text-black">{stats.label}</span>
					</div>
				</div>
			</div>
		{/each}
	</div>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2">
		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h3 class="text-black-500 text-sm">Sales Trend</h3>
			<div class="mt-4">
				<!-- Placeholder for analytics content -->

				<div class="round h-[300px] border p-6">
					<Chart
						data={dateSeriesData}
						x="date"
						xScale={scaleTime()}
						y="value"
						yDomain={[0, null]}
						yNice
						padding={{ left: 16, bottom: 24 }}
						tooltip={{ mode: 'bisect-x' }}
					>
						<Svg>
							<Axis
								placement="left"
								grid
								rule
								class="stroke-gray-400"
								format={(/** @type {number} */ d) => d.toFixed(0)}
							/>
							<Axis
								placement="bottom"
								rule
								class="text-xs text-gray-400"
								format={(/** @type {string | number | Date} */ d) =>
									formatDate(new Date(d), PeriodType.Day, { variant: 'short' })}
							/>
							<Spline class="stroke-[#4F46E5] stroke-2" fill="none" />
							<Highlight
								points={{ class: 'stroke-[#FFFFFF] stroke-2 fill-[#4F46E5] shadow-lg' }}
								lines={{ class: 'stroke-gray-400' }}
							/>
						</Svg>

						<Tooltip.Root let:data>
							<div class="rounded-md border border-gray-200 bg-white p-3 shadow-lg">
								<Tooltip.Header class="text-sm font-semibold text-gray-700">
									{format(data.date, 'eee, MMMM do')}
								</Tooltip.Header>
								<div class="flex items-center gap-1 text-sm text-gray-600">
									<span>Value:</span>
									<span class="font-semibold">{data.value}</span>
								</div>
							</div>
						</Tooltip.Root>
					</Chart>
				</div>
			</div>
		</div>
		<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
			<h3 class="text-black-500 text-sm">Ticket Distribution</h3>
			<div class="mt-1">
				<!-- Placeholder for analytics content -->

				<div class="p-15 h-[300px]">
					<Chart {data} x="value" c="date" cRange={keyColors}>
						<Svg center>
							<Pie innerRadius={41} />
						</Svg>
					</Chart>
					<div class="mt-5 flex justify-center space-x-20">
						<div class="flex flex-col items-center space-y-2">
							<span class="text-black-700 text-xs font-semibold"
								>{data[0].value} ({data[0].percentage})</span
							>
							<span class="h-3 w-3 rounded-full" style="background-color: #4F46E5;"></span>
							<span class="text-xs">VIP</span>
						</div>
						<div class="flex flex-col items-center space-y-2">
							<span class="text-black-700 text-xs font-semibold"
								>{data[1].value} ({data[1].percentage})</span
							>
							<span class="h-3 w-3 rounded-full" style="background-color: #818CF8;"></span>
							<span class="text-xs">Regular</span>
						</div>
						<div class="flex flex-col items-center space-y-2">
							<span class="text-black-700 text-xs font-semibold"
								>{data[2].value} ({data[2].percentage})</span
							>
							<span class="h-3 w-3 rounded-full" style="background-color: #C7D2FE;"></span>
							<span class="text-xs">Student</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
