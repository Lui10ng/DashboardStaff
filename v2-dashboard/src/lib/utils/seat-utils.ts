import type { SeatConfig, SeatData, SeatStatus } from '$lib/types/seat-generator';

/**
 * Generates a row label based on the configuration
 */
export const generateRowLabel = (startChar: string, rowIndex: number): string => {
	const alphabetLength = 26;
	const startCharCode = startChar.toUpperCase().charCodeAt(0);
	const totalOffset = rowIndex;

	const cycleNumber = Math.floor(totalOffset / alphabetLength);

	const letterOffset = totalOffset % alphabetLength;
	const letterCode = ((startCharCode - 65 + letterOffset) % alphabetLength) + 65;
	const letter = String.fromCharCode(letterCode);

	return cycleNumber === 0 ? letter : `${letter}${cycleNumber}`;
};

/**
 * Generates a seat label including custom names
 */
export const generateSeatLabel = (
	seatConfig: SeatConfig,
	rowIndex: number,
	seatIndex: number,
	seatData: SeatData[][],
	customSeatNames: Record<string, string>
): string => {
	const standardLabel = generateStandardSeatLabel(seatConfig, rowIndex, seatIndex);

	if (
		seatData[rowIndex] &&
		seatData[rowIndex][seatIndex] &&
		seatData[rowIndex][seatIndex].customName
	) {
		return seatData[rowIndex][seatIndex].customName || standardLabel;
	}

	return customSeatNames[standardLabel] || standardLabel;
};

/**
 * Generates a standard seat label without custom naming
 */
export const generateStandardSeatLabel = (
	seatConfig: SeatConfig,
	rowIndex: number,
	seatIndex: number
): string => {
	const rowLabel = generateRowLabel(
		seatConfig.rowStartChar,
		seatConfig.rowOrder === 'down' ? rowIndex : seatConfig.rows - 1 - rowIndex
	);

	const seatNum =
		seatConfig.seatOrder === 'left'
			? seatConfig.seatStartNum + seatIndex
			: seatConfig.seatStartNum + (seatConfig.seatsPerRow - 1 - seatIndex);

	const formattedSeatNum = seatNum < 10 ? `0${seatNum}` : `${seatNum}`;

	return `${rowLabel}${formattedSeatNum}`;
};

/**
 * Prepare seats data for saving
 */
export const prepareSeatsData = (
	section: {
		seatConfig: SeatConfig;
		seats: SeatStatus[][];
		seatData: SeatData[][];
	},
	customSeatNames: Record<string, string>
): Record<string, { displayName: string; status: SeatStatus }> => {
	const seatsData: Record<string, { displayName: string; status: SeatStatus }> = {};

	section.seats.forEach((row, rowIndex) => {
		row.forEach((seatStatus, seatIndex) => {
			const standardLabel = generateStandardSeatLabel(section.seatConfig, rowIndex, seatIndex);

			let displayName = standardLabel;
			if (
				section.seatData[rowIndex] &&
				section.seatData[rowIndex][seatIndex] &&
				section.seatData[rowIndex][seatIndex].customName
			) {
				displayName = section.seatData[rowIndex][seatIndex].customName || standardLabel;
			} else if (customSeatNames[standardLabel]) {
				displayName = customSeatNames[standardLabel];
			}

			seatsData[standardLabel] = {
				displayName,
				status: seatStatus
			};
		});
	});

	return seatsData;
};
