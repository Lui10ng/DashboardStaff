export interface Partner {
	id: string;
	name: string;
	logo: string;
	altText: string;
	isRounded?: boolean;
}

export const partners: Partner[] = [
	{
		id: '1',
		name: 'Limketkai Center',
		logo: '/assets/images/ketkai-new.jpg',
		altText: 'Limketkai Center'
	},
	{
		id: '2',
		name: 'Spin City',
		logo: '/assets/images/spincity.jpg',
		altText: 'Spin City'
	},
	{
		id: '3',
		name: 'EO Phils South',
		logo: '/assets/images/eophsouth.jpg',
		altText: 'EO Phils South'
	},
	{
		id: '4',
		name: 'Ubiquity Careers Philippines',
		logo: '/assets/images/ubiquity.jpg',
		altText: 'Ubiquity Careers Philippines',
		isRounded: true
	},
	{
		id: '5',
		name: 'Department of Information and Communications Technology',
		logo: '/assets/images/dict.png',
		altText: 'Department of Information and Communications Technology'
	},
	{
		id: '6',
		name: 'The Samdhana Institute',
		logo: '/assets/images/tsi.png',
		altText: 'The Samdhana Institute'
	},
	{
		id: '7',
		name: 'Feast Conference',
		logo: '/assets/images/feastcon.jpg',
		altText: 'Feast Conference',
		isRounded: true
	},
	{
		id: '8',
		name: 'Dauntless Outdoors',
		logo: '/assets/images/dauntless.png',
		altText: 'Dauntless Outdoors'
	},
	{
		id: '9',
		name: 'SUB30 Events and Prints',
		logo: '/assets/images/sub30.png',
		altText: 'SUB30 Events and Prints'
	},
	{
		id: '10',
		name: 'Legends Events CDO',
		logo: '/assets/images/legends.png',
		altText: 'Legends Events CDO'
	},
	{
		id: '11',
		name: 'Events Pro Live',
		logo: '/assets/images/eventspro.jpg',
		altText: 'Events Pro Live',
		isRounded: true
	},
	{
		id: '12',
		name: 'Cagayan de Oro Basketball Federation',
		logo: '/assets/images/cdobasketball.png',
		altText: 'Cagayan de Oro Basketball Federation - CDOBF',
		isRounded: true
	},
	{
		id: '13',
		name: 'Philippine Obstetrical & Gynecological Society, INC',
		logo: '/assets/images/pogs.png',
		altText: 'Philippine Obstetrical & Gynecological Society, INC'
	}
];
