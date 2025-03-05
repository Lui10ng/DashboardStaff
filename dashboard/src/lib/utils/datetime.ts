export const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

export function validateDateTimeRange(
	startDate: string,
	startTime: string,
	endDate: string,
	endTime: string
): boolean {
	if (!startDate || !endDate || !startTime || !endTime) {
		return true;
	}

	// Convert time strings to 24-hour format for comparison
	const convertTo24Hour = (timeStr: string) => {
		const [time, period] = timeStr.split(' ');
		const [initialHour, minutes] = time.split(':').map(Number);
		let adjustedHour = initialHour;

		if (period === 'PM' && adjustedHour !== 12) {
			adjustedHour += 12;
		}
		if (period === 'AM' && adjustedHour === 12) {
			adjustedHour = 0;
		}

		return `${adjustedHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
	};

	const start = new Date(`${startDate}T${convertTo24Hour(startTime)}`);
	const end = new Date(`${endDate}T${convertTo24Hour(endTime)}`);

	return end > start;
}

export function formatDateTimeRange(formData: {
	startDate: string;
	startTime: string;
	endDate: string;
	endTime: string;
}) {
	return {
		startDateTime: new Date(`${formData.startDate}T${formData.startTime}`),
		endDateTime: new Date(`${formData.endDate}T${formData.endTime}`),
		raw: { ...formData }
	};
}
