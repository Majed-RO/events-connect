import Image from 'next/image';
import { IEvent } from '@/database/event.model';

// import { cacheLife } from 'next/cache';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/app/events/[slug]/page';
import BookingCard, { BookingCardSkeleton } from './BookingCard';
import SimilarEvents, { SimilarEventsSkeleton } from './SimilarEvents';
import { Suspense } from 'react';

// Type for plain event object (without Mongoose Document methods)
export type EventData = Pick<
	IEvent,
	| 'title'
	| 'slug'
	| 'description'
	| 'overview'
	| 'image'
	| 'venue'
	| 'location'
	| 'date'
	| 'time'
	| 'mode'
	| 'audience'
	| 'agenda'
	| 'organizer'
	| 'tags'
> & {
	// Required MongoDB fields
	_id: string;
	__v?: number; // Added optional version key

	// Use Date object types for server-side accuracy
	createdAt: Date;
	updatedAt: Date;
};

const EventDetailsItem = ({
	icon,
	alt,
	label,
	data
}: {
	icon: string;
	alt: string;
	label: string;
	data: string;
}) => {
	return (
		<div className="flex items-start gap-3">
			<Image src={icon} alt={alt} width={17} height={17} />

			<div className="capitalize text-sm text-gray-400">
				{label}:
			</div>
			<div className="text-white">{data}</div>
		</div>
	);
};

type PageParams = { slug: string };
type ParamsPromise = Promise<PageParams>;

// 1. Define the props for the child component
interface EventContentProps {
	eventPromise: ParamsPromise;
}
/**
 * Component that does the dynamic fetching and rendering.
 * Everything inside this component will stream, allowing the outer shell to render.
 */
async function EventContent({ eventPromise }: EventContentProps) {
	const { slug } = await eventPromise;

	// Validate slug format
	const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
	if (!slugRegex.test(slug)) {
		notFound();
	}

	// 1. Fetch event data (This is the blocking part you are now containing)
	const event = await getEventBySlug(slug);

	// 2. Perform the checks that rely on the data
	if (!event) {
		notFound();
	}

	// 3. Return the main event JSX content (which was previously in EventPage)
	// *This is where the existing EventPage JSX goes*
	return (
		<>
			{/* ... all your existing JSX code using 'event', 'bookingsCount', and 'similarEvents' ... */}
			{/* Title and Description */}
			<div className="header">
				<h1 className="mb-4 text-5xl font-bold leading-tight">
					{event.title}
				</h1>
				<p className="text-lg leading-relaxed">
					{event.description}
				</p>
			</div>

			<div className="details">
				{/* Left Column - Event Info */}
				<div className="content">
					{/* Event Image */}
					<div className="relative aspect-video overflow-hidden rounded-2xl">
						<Image
							src={
								event.image +
								'?w=1200&h=675'
							}
							alt={event.title}
							fill
							className="object-cover"
							priority
							unoptimized={true}
						/>
						{/* <img src={event.image} alt={event.title} /> */}
					</div>

					{/* Overview Section */}
					<section>
						<h2 className="mb-4 text-2xl font-bold text-white">
							Overview
						</h2>
						<p className="leading-relaxed text-gray-300">
							{event.overview}
						</p>
					</section>

					{/* Event Details Grid */}
					<section>
						<h2 className="mb-6 text-2xl font-bold text-white">
							Event Details
						</h2>
						<div className="flex flex-col">
							{/* Date */}
							<EventDetailsItem
								icon={
									'/icons/calendar.svg'
								}
								label="date"
								alt="calendar"
								data={
									event.date
								}
							/>

							{/* Time */}
							<EventDetailsItem
								icon={
									'/icons/clock.svg'
								}
								label="Time"
								alt="clock"
								data={
									event.time
								}
							/>

							{/* Venue */}
							<EventDetailsItem
								icon={
									'/icons/pin.svg'
								}
								label="venue"
								alt="pin"
								data={`${event.venue}, ${event.location}`}
							/>

							{/* Mode */}
							<EventDetailsItem
								icon={
									'/icons/mode.svg'
								}
								label="mode"
								alt="mode"
								data={
									event.mode
								}
							/>

							{/* Audience */}
							<EventDetailsItem
								icon={
									'/icons/audience.svg'
								}
								label="audience"
								alt="audience"
								data={
									event.audience
								}
							/>
						</div>
					</section>

					{/* Agenda Section */}
					<section className="agenda">
						<h2 className="mb-6 text-2xl font-bold text-white">
							Agenda
						</h2>
						<ul className="space-y-3">
							{event.agenda.map(
								(
									item,
									index
								) => (
									<li
										key={
											index
										}
										className="flex gap-3 text-gray-300"
									>
										<span className="text-teal-400">
											•
										</span>
										<span>
											{
												item
											}
										</span>
									</li>
								)
							)}
						</ul>
					</section>

					{/* About the Organizer */}
					<section>
						<h2 className="mb-4 text-2xl font-bold text-white">
							About the Organizer
						</h2>
						<p className="leading-relaxed text-gray-300">
							This event is organized
							by{' '}
							<span className="font-semibold text-white">
								{
									event.organizer
								}
							</span>
							.
						</p>
						{/* Tags */}
						<div className="mt-4 flex flex-wrap gap-2">
							{event.tags.map(tag => (
								<span
									key={
										tag
									}
									className="pill"
								>
									{tag}
								</span>
							))}
						</div>
					</section>
				</div>

				{/* Right Column - Booking Card */}
				<aside className="booking">
					<Suspense
						fallback={
							<BookingCardSkeleton />
						}
					>
						<BookingCard
							eventId={event._id}
							slug={slug}
						/>
					</Suspense>
				</aside>
			</div>
			<div className="flex w-full flex-col gap-4 pt-20">
				<h2>Similar Events</h2>
				<Suspense fallback={<SimilarEventsSkeleton />}>
					<SimilarEvents slug={slug} />
				</Suspense>
			</div>
		</>
	);
}

export default EventContent;
