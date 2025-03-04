import type { PageServerLoad } from './$types';

interface Feature {
	title: string;
	description: string;
	color: string;
	image: string;
}

interface PageServerData {
	features: Feature[];
	pageTitle: string;
}

export const load: PageServerLoad = async (): Promise<PageServerData> => {
	return {
		features: [
			{
				title: 'Smart Attendee Data',
				description:
					'Collect all the information you need from registrants with customizable forms.',
				color: 'bg-[#EF626C]',
				image: '/assets/icons/smart_attendee_data.svg'
			},
			{
				title: 'Streamlined Attendance',
				description:
					'Simplify check-in with QR code scanning for quick and accurate guest verification.',
				color: 'bg-[#EF626C]',
				image: '/assets/icons/streamlined_attendance.svg'
			},
			{
				title: 'Data-Driven Decisions',
				description: 'Gain valuable insights into your event with detailed registration analytics.',
				color: 'bg-[#EF626C]',
				image: '/assets/icons/data_driven_decisions.svg'
			},
			{
				title: 'Seamless Payments',
				description:
					'Accept registrations with integrated payment processing for a smooth and secure experience (additional fees may apply).',
				color: 'bg-[#EF626C]',
				image: '/assets/icons/banks.svg'
			},
			{
				title: 'Effortless Event Pages',
				description:
					'Design beautiful and informative event landing pages in minutes, no coding required.',
				color: 'bg-[#EF626C]',
				image: '/assets/icons/effortless.svg'
			}
		],
		pageTitle: 'Our Features'
	};
};
