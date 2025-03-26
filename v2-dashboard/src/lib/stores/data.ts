export const navItems = [
	{
		path: '/eventId/registrants',
		label: 'registrants'
	},
	{
		path: '/eventId/posts',
		label: 'posts'
	},
	{
		path: '/eventId/form',
		label: 'form'
	},
	{
		path: '/eventId/merchant',
		label: 'merchant'
	},
	{
		path: '/eventId/emails',
		label: 'emails'
	},
	{
		path: '/eventId/staff',
		label: 'staff'
	}
];

export const guestList = [
	{
		id: '1',
		name: 'Julia Echlin',
		email: 'julia@email.com',
		registrationDate: '09 Jan 2024, 8:04 AM',
		status: 'registered',
		avatar: 'https://ui-avatars.com/api/?name=Julia+Echlin&background=ef4444&color=fff'
	},
	{
		id: '2',
		name: 'Aaron Dave Taglinao',
		email: 'aaron@email.com',
		registrationDate: '10 Jan 2024, 10:15 AM',
		status: 'registered',
		avatar: 'https://ui-avatars.com/api/?name=Aaron+Dave&background=eab308&color=fff'
	},
	{
		id: '3',
		name: 'Ericke Gallardo',
		email: 'erick@email.com',
		registrationDate: '12 Jan 2024, 11:00 PM',
		status: 'pending',
		avatar: 'https://ui-avatars.com/api/?name=Ericka+Gallardo&background=ef4444&color=fff'
	},
	{
		id: '4',
		name: 'Kenneth Sayan',
		email: 'kennethsayan@email.com',
		registrationDate: '12 Jan 2024, 11:00 PM',
		status: 'registered',
		avatar: 'https://ui-avatars.com/api/?name=Kenneth+Sayan&background=ef4444&color=fff'
	},
	{
		id: '5',
		name: 'Jie Clark Terec',
		email: 'Jieclark@email.com',
		registrationDate: '12 Jan 2024, 11:00 PM',
		status: 'registered',
		avatar: 'https://ui-avatars.com/api/?name=Kenneth+Sayan&background=ef4444&color=fff'
	}
];

export const pendingStaffMembers = [
	{ name: 'Ericke Gallardo', role: 'Scanner', email: 'ericke@veent.io', phone: '0965 879 9086' },
	{
		name: 'Aaron Dhave Tagolimot',
		role: 'Admin',
		email: 'aaron@gmail.com',
		phone: '0965 879 9086'
	}
];
export const staffMembers = [
	{
		name: 'Danielle Bradberry',
		role: 'Admin',
		email: 'danielle@veent.io',
		phone: '0965 879 9086',
		status: 'active'
	},
	{
		name: 'Bella de Leon',
		role: 'Scanner',
		email: 'bdl23@gmail.com',
		phone: '0965 879 9086',
		status: 'active'
	},
	{
		name: 'Ashby Santoso',
		role: 'Scanner',
		email: 'ashby@gmail.com',
		phone: '0965 879 9086',
		status: 'active'
	}
];

export const currentEvent = {
	id: '1',
	title: 'Tech Talks 2024',
	date: 'April 16-18, 2024',
	time: '8:00 AM - 6:00 PM',
	location: 'USTP Gymnasium, Cagayan de Oro City',
	url: 'https://techtalks2024.event.co',
	imageUrl:
		'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3'
};

export const events = [
	{
		id: '1',
		title: 'Tech Conference 2024',
		location: 'San Francisco',
		date: 'Mar 15, 2024',
		status: 'Live',
		tickets: { sold: 145, total: 200 },
		image: 'https://veent.s3.ap-southeast-1.amazonaws.com/media/arou56pj4tsdx1yilpge.jpg'
	},
	{
		id: '2',
		title: 'Music Festival',
		location: 'Los Angeles',
		date: 'Apr 20, 2024',
		status: 'Upcoming',
		tickets: { sold: 0, total: 500 },
		image: 'https://veent.s3.ap-southeast-1.amazonaws.com/media/arou56pj4tsdx1yilpge.jpg'
	},
	{
		id: '3',
		title: 'Music Festival',
		location: 'Los Angeles',
		date: 'Apr 20, 2024',
		status: 'Upcoming',
		tickets: { sold: 0, total: 500 },
		image: 'https://veent.s3.ap-southeast-1.amazonaws.com/media/arou56pj4tsdx1yilpge.jpg'
	},
	{
		id: '4',
		title: 'Music gwapo',
		location: 'Los Angeles',
		date: 'Apr 20, 2024',
		status: 'Upcoming',
		tickets: { sold: 0, total: 500 },
		image: 'https://veent.s3.ap-southeast-1.amazonaws.com/media/arou56pj4tsdx1yilpge.jpg'
	}
];

export const walletTransactions = [
	{
		id: '1',
		name: 'Julia Echlin',
		email: 'julia@email.com',
		phone: '09364358945',
		registrationDate: '09 Jan 2024, 8:04 AM',
		event: 'Soldanza',
		amount: 850,
		paymentMethod: 'Gcash',
		netIncome: 800,
		referenceNo: 'CBHDSFKGLDFGJK',
		avatar: 'https://ui-avatars.com/api/?name=Julia+Echlin&background=ef4444&color=fff'
	},
	{
		id: '2',
		name: 'Aaron Dave Taglinao',
		email: 'aaron@email.com',
		phone: '09364358945',
		registrationDate: '10 Jan 2024, 10:15 AM',
		event: 'RUN4ME 2025',
		amount: 450,
		paymentMethod: 'Gcash',
		netIncome: 400,
		referenceNo: 'JJKSFKGLDFGJK',
		avatar: 'https://ui-avatars.com/api/?name=Aaron+Dave&background=eab308&color=fff'
	},
	{
		id: '3',
		name: 'Ericke Gallardo',
		email: 'erick@email.com',
		phone: '09364358945',
		registrationDate: '12 Jan 2024, 11:00 PM',
		event: 'RUN4ME 2025',
		amount: 350,
		paymentMethod: 'Gcash',
		netIncome: 300,
		referenceNo: 'DSKJDSNGKFDGJ',
		avatar: 'https://ui-avatars.com/api/?name=Ericka+Gallardo&background=ef4444&color=fff'
	},
	{
		id: '4',
		name: 'Kenneth Sayan',
		email: 'kennethsayan@email.com',
		phone: '09364358945',
		registrationDate: '12 Jan 2024, 11:00 PM',
		event: 'Soldanza',
		amount: 650,
		paymentMethod: 'Bank of the Philippines',
		netIncome: 600,
		referenceNo: 'CBHDSFKGLDFGJK',
		avatar: 'https://ui-avatars.com/api/?name=Kenneth+Sayan&background=ef4444&color=fff'
	},
	{
		id: '5',
		name: 'Jie Clark Terec',
		email: 'Jieclark@email.com',
		phone: '09364358945',
		registrationDate: '12 Jan 2024, 11:00 PM',
		event: 'Soldanza',
		amount: 750,
		paymentMethod: 'Union Bank',
		netIncome: 700,
		referenceNo: 'CBHDSFKGLDFGJK',
		avatar: 'https://ui-avatars.com/api/?name=Kenneth+Sayan&background=ef4444&color=fff'
	}
];

export const tickets = [
	{
		id: 1,
		name: 'TJ Mondragon',
		price: 500,
		validFrom: '2023-02-10',
		validTo: '2025-02-28',
		status: 'Active',
		sold: '35/50'
	},
	{
		id: 2,
		name: 'Arthur Nery',
		price: 500,
		validFrom: '2023-03-15',
		validTo: '2025-03-28',
		status: 'Active',
		sold: '35/50'
	},
	{
		id: 3,
		name: 'Manny Pacquiao',
		price: 500,
		validFrom: '2023-03-20',
		validTo: '2025-03-28',
		status: 'Active',
		sold: '35/50'
	},
	{
		id: 4,
		name: 'Chris Briand',
		price: 500,
		validFrom: '2023-02-15',
		validTo: '2025-02-28',
		status: 'Active',
		sold: '35/50'
	}
];

export const vouchers = [
	{
		id: 'TJMON1',
		discount: '-50%',
		status: 'Expired',
		validUntil: 'Feb 9, 2023',
		validTime: '5:00 AM',
		sold: '35/50',
		progressColor: 'bg-purple-800'
	},
	{
		id: 'TJMON1',
		discount: '-25%',
		status: 'Deactivated',
		validUntil: 'Feb 8, 2023',
		validTime: '6:00 AM',
		sold: '35/50',
		progressColor: 'bg-purple-800'
	},
	{
		id: 'TJMON1',
		discount: '-20%',
		status: 'Active',
		validUntil: 'Feb 8, 2023',
		validTime: '8:00 AM',
		sold: '35/50',
		progressColor: 'bg-purple-800'
	},
	{
		id: 'TJMON1',
		discount: '-10%',
		status: 'Expired',
		validUntil: 'Feb 8, 2023',
		validTime: '6:00 AM',
		sold: '35/50',
		progressColor: 'bg-purple-800'
	}
];

export const eventList = [
	{
		id: '1',
		name: 'Tech Talks 2024',
		location: 'Los Angeles',
		status: 'Live',
		ticketSold: '145/200',
		created: '09 Jan 2024',
		image: 'https://veent.s3.ap-southeast-1.amazonaws.com/media/arou56pj4tsdx1yilpge.jpg'
	},
	{
		id: '2',
		name: 'Tech Talks 2024',
		location: 'San Francisco',
		status: 'Live',
		ticketSold: '120/200',
		created: '09 Jan 2024',
		image: 'https://veent.s3.ap-southeast-1.amazonaws.com/media/arou56pj4tsdx1yilpge.jpg'
	},
	{
		id: '3',
		name: 'Tech Talks 2024',
		location: 'Canada',
		status: 'Upcoming',
		ticketSold: '105/200',
		created: '09 Jan 2024',
		image: 'https://veent.s3.ap-southeast-1.amazonaws.com/media/arou56pj4tsdx1yilpge.jpg'
	},
	{
		id: '4',
		name: 'Tech Talks 2024',
		location: 'San Francisco',
		status: 'Upcoming',
		ticketSold: '145/200',
		created: '09 Jan 2024',
		image: 'https://veent.s3.ap-southeast-1.amazonaws.com/media/arou56pj4tsdx1yilpge.jpg'
	},
	{
		id: '5',
		name: 'Tech Talks 2024',
		location: 'Los Angeles',
		status: 'Live',
		ticketSold: '150/200',
		created: '09 Jan 2024',
		image: 'https://veent.s3.ap-southeast-1.amazonaws.com/media/arou56pj4tsdx1yilpge.jpg'
	}
];
