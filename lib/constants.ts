export interface EventItem {
	id: string;
	slug: string;
	title: string;
	date: string; // YYYY-MM-DD
	time: string; // HH:MM (local)
	location: string;
	image: string; // path under public/, e.g. /images/event1.png
}

export const events: EventItem[] = [
	{
		id: 'nextjs-conf-2026',
		slug: 'nextjs-conf-2026',
		title: 'Next.js Conf 2026',
		date: '2026-02-18',
		time: '09:00 AM',
		location: 'San Francisco, CA (and online)',
		image: '/images/event-full.png'
	},

	{
		id: 'react-summit-2026',
		slug: 'react-summit-2026',
		title: 'React Summit 2026',
		date: '2026-03-12',
		time: '10:00 AM',
		location: 'Amsterdam, Netherlands',
		image: '/images/event1.png'
	},

	{
		id: 'kubecon-2026',
		slug: 'kubecon-2026',
		title: 'KubeCon + CloudNativeCon 2026',
		date: '2026-04-21',
		time: '09:30 PM',
		location: 'Barcelona, Spain',
		image: '/images/event2.png'
	},

	{
		id: 'jsconf-eu-2026',
		slug: 'jsconf-eu-2026',
		title: 'JSConf EU 2026',
		date: '2026-05-07',
		time: '11:00 AM',
		location: 'Lisbon, Portugal',
		image: '/images/event3.png'
	},

	{
		id: 'ethglobal-hackathon-2026',
		slug: 'ethglobal-hackathon-2026',
		title: 'ETHGlobal Hackathon',
		date: '2026-06-10',
		time: '08:00 PM',
		location: 'Hybrid (Global)',
		image: '/images/event4.png'
	},

	{
		id: 'hackmit-2025',
		slug: 'hackmit-2025',
		title: 'HackMIT 2025',
		date: '2025-11-08',
		time: '09:00 AM',
		location: 'Cambridge, MA',
		image: '/images/event5.png'
	},

	{
		id: 'google-io-2026',
		slug: 'google-io-2026',
		title: 'Google I/O 2026',
		date: '2026-05-20',
		time: '10:00',
		location: 'Mountain View, CA (and online)',
		image: '/images/event6.png'
	}
];

export default events;
