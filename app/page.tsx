import EventCard from '@/components/EventCard';
import ExploreBtn from '@/components/ExploreBtn';
import events from '@/lib/constants';


const HomePage = () => {
	return (
		<section>
			<h1 className="text-center capitalize">
				The Hub for every dev <br /> event you can't
				miss
			</h1>
			<p className="text-center mt-5 capitalize">
				Hackathons, conferences, meetups, and workshops
				all in one place.
			</p>
			<ExploreBtn />

			<div className='mt-20 space-y-7'>
				<h3>Featured Events</h3>

				<ul className="events">
					{events.map(event => (
						<li key={event.id}>
							<EventCard {...event} />
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};

export default HomePage;
