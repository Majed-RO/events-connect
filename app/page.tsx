import EventCard from '@/components/EventCard';
import ExploreBtn from '@/components/ExploreBtn';
import { IEvent } from '@/database';
import { cacheLife } from 'next/cache';
// import events from '@/lib/constants';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const HomePage = async () => {
	'use cache';
	cacheLife('hours');

	let events: IEvent[] = [];

	try {
		const response = await fetch(`${BASE_URL}/api/events`);

		if (!response.ok) {
			console.error(
				'Failed to fetch events:',
				response.status
			);
		} else {
			const data = await response.json();
			events = data.events || [];
		}
	} catch (error) {
		console.error('Error fetching events:', error);
	}

	return (
		<section>
			<h1 className="text-center capitalize">
				The Hub for every dev <br /> event you
				can&apos;t miss
			</h1>
			<p className="text-center mt-5 capitalize">
				Hackathons, conferences, meetups, and workshops
				all in one place.
			</p>
			<ExploreBtn />

			<div className="mt-20 space-y-7">
				<h3>Featured Events</h3>

				<ul className="events">
					{events &&
						events.length > 0 &&
						events.map((event: IEvent) => (
							<li key={event.slug}>
								<EventCard
									{...event}
								/>
							</li>
						))}
				</ul>
			</div>
		</section>
	);
};

export default HomePage;
