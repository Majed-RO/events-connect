import { getSimilarEventsBySlug } from '@/lib/actions/event.actions';
import EventCard from './EventCard';
import { EventData } from './EventContent';

const SimilarEvents = async ({ slug }: { slug: string }) => {
	const similarEvents: EventData[] = (await getSimilarEventsBySlug(
		slug
	)) as EventData[];
	return (
		
			<div className="events">
				{similarEvents.length === 0 ? (
					<p className="text-gray-400">
						No similar events found.
					</p>
				) : (
					similarEvents.map(
						(simEvent: EventData) => (
							<EventCard
								key={String(
									simEvent._id
								)}
								{...simEvent}
							/>
						)
					)
				)}
			</div>
	);
};

export const SimilarEventsSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-4 animate-pulse">
      

      {/* 2. Events Grid Placeholder (Mimics the layout of the EventCard list) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Event Card Placeholder (3 instances for a typical section) */}
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden rounded-xl bg-gray-800 shadow-xl"
          >
            {/* Image Placeholder (Mimics aspect-ratio of an image) */}
            <div className="aspect-video h-auto w-full bg-gray-700"></div>

            <div className="p-4">
              {/* Title Placeholder */}
              <div className="mb-2 h-5 w-4/5 rounded-md bg-gray-600"></div>
              {/* Detail Line 1 */}
              <div className="mb-1 h-4 w-3/4 rounded-md bg-gray-700"></div>
              {/* Detail Line 2 */}
              <div className="h-4 w-1/2 rounded-md bg-gray-700"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarEvents;
