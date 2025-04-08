export const formatDateTime = (eventStartTime: string, eventEndTime: string) => {
	const start = new Date(eventStartTime);
	const end = new Date(eventEndTime);

	let formattedStartDate = '';
	let formattedEndDate = '';

	const startDate = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	const endDate = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

	if (startDate === endDate) {
		formattedStartDate = startDate + ', ' + start.getFullYear();
	} else {
		formattedStartDate = `${startDate}-${endDate}, ${start.getFullYear()}`;
	}

	const startTime = start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
	const endTime = end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

	formattedEndDate = `${startTime} - ${endTime}`;

	return { date: formattedStartDate, time: formattedEndDate };
};

export const getTimeRemaining = (e: string) => {
	const t = new Date(e).getTime(),
		n = new Date().getTime(),
		o = t - n;
	return o <= 0
		? { days: 0, hours: 0, minutes: 0, seconds: 0 }
		: {
				days: Math.floor(o / (1e3 * 60 * 60 * 24)),
				hours: Math.floor((o % (1e3 * 60 * 60 * 24)) / (1e3 * 60 * 60)),
				minutes: Math.floor((o % (1e3 * 60 * 60)) / (1e3 * 60)),
				seconds: Math.floor((o % (1e3 * 60)) / 1e3)
			};
};
