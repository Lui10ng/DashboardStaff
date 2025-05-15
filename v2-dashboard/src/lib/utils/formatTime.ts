export function formatTimeForPicker(dateInput: Date | string | number) {
	if (!dateInput) return '';
	const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
	return date.toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});
}

export function formatDateMMDDYYYY(dateInput: Date | string | number): string {
	if (!dateInput) return '';
	const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${month}-${day}-${year}`;
}
