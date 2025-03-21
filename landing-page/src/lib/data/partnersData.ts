export interface Partner {
	id: string;
	name: string;
	url: string;
	logo: string;
	altText: string;
	isRounded?: boolean;
}

export const partners: Partner[] = [
	{
		id: '1',
		name: 'Limketkai Center',
		url: 'https://www.facebook.com/@LKKCenter/',
		logo: '/assets/images/ketkai-new.jpg',
		altText: 'Limketkai Center'
	},
	{
		id: '2',
		name: 'Spin City',
		url: 'https://www.facebook.com/spincitycdo',
		logo: '/assets/images/spincity.jpg',
		altText: 'Spin City'
	},
	{
		id: '3',
		name: 'EO Phils South',
		url: 'https://www.facebook.com/eophilippinessouth',
		logo: '/assets/images/eophsouth.jpg',
		altText: 'EO Phils South'
	},
	{
		id: '4',
		name: 'Ubiquity Careers Philippines',
		url: 'https://www.facebook.com/UbiquityCareersPH',
		logo: '/assets/images/ubiquity.jpg',
		altText: 'Ubiquity Careers Philippines',
		isRounded: true
	},
	{
		id: '5',
		name: 'Department of Information and Communications Technology',
		url: 'https://www.facebook.com/DICTRegion10',
		logo: '/assets/images/dict.png',
		altText: 'Department of Information and Communications Technology'
	},
	{
		id: '6',
		name: 'The Samdhana Institute',
		url: 'https://www.facebook.com/samdhana.institute',
		logo: '/assets/images/tsi.png',
		altText: 'The Samdhana Institute'
	},
	{
		id: '7',
		name: 'Feast Conference',
		url: 'https://feastconference.com/',
		logo: '/assets/images/feastcon.jpg',
		altText: 'Feast Conference',
		isRounded: true
	},
	{
		id: '8',
		name: 'Dauntless Outdoors',
		url: 'https://www.facebook.com/dauntlessoutdoorsph',
		logo: '/assets/images/dauntless.png',
		altText: 'Dauntless Outdoors'
	},
	{
		id: '9',
		name: 'SUB30 Events and Prints',
		url: 'https://www.facebook.com/sub30',
		logo: '/assets/images/sub30.png',
		altText: 'SUB30 Events and Prints'
	},
	{
		id: '10',
		name: 'Legends Events CDO',
		url: 'https://www.facebook.com/legendscdo',
		logo: '/assets/images/legends.png',
		altText: 'Legends Events CDO'
	},
	{
		id: '11',
		name: 'Events Pro Live',
		url: 'https://www.facebook.com/profile.php?id=61566745691172',
		logo: '/assets/images/eventspro.jpg',
		altText: 'Events Pro Live',
		isRounded: true
	},
	{
		id: '12',
		name: 'Cagayan de Oro Basketball Federation',
		url: 'https://www.facebook.com/cagayandeorobasketballfederation',
		logo: '/assets/images/cdobasketball.png',
		altText: 'Cagayan de Oro Basketball Federation - CDOBF',
		isRounded: true
	},
	{
		id: '13',
		name: 'Philippine Obstetrical & Gynecological Society, INC',
		url: 'https://www.figo.org/philippine-obstetrical-gynecological-society-inc',
		logo: '/assets/images/pogs.png',
		altText: 'Philippine Obstetrical & Gynecological Society, INC'
	}
];
