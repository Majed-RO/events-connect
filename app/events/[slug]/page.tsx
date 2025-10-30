import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { IEvent } from '@/database/event.model';
import BookEvent from '@/components/BookEvent';
import { getSimilarEventsBySlug } from '@/lib/actions/event.actions';
import EventCard from '@/components/EventCard';
// import Link from 'next/link';

// Type for page props
interface EventPageProps {
	params: Promise<{
		slug: string;
	}>;
}

// Type for plain event object (without Mongoose Document methods)
type EventData = Pick<
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

/**
 * Fetch event data by slug
 */
async function getEventBySlug(slug: string): Promise<EventData | null> {
	try {
		const request = await fetch(
			`${
				process.env.NEXT_PUBLIC_BASE_URL ||
				'http://localhost:3000'
			}/api/events/${slug}`
		);

		if (!request.ok) {
			return null;
		}

		const { event } = await request.json();
		return event as EventData;
	} catch (error) {
		console.error('Error fetching event by slug:', error);
		return null;
	}
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
	params
}: EventPageProps): Promise<Metadata> {
	const { slug } = await params;
	const event = await getEventBySlug(slug);

	if (!event) {
		return {
			title: 'Event Not Found',
			description: 'The requested event could not be found.'
		};
	}

	return {
		title: `${event.title} | Events`,
		description: event.overview,
		openGraph: {
			title: event.title,
			description: event.overview,
			images: [event.image]
		}
	};
}

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

/**
 * Event Details Page Component
 */
export default async function EventPage({ params }: EventPageProps) {
	const { slug } = await params;

	// Validate slug format
	const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
	if (!slugRegex.test(slug)) {
		notFound();
	}

	// Fetch event data
	const event = await getEventBySlug(slug);

	// Show 404 if event not found
	if (!event) {
		notFound();
	}

	const bookings = 10;

	const similarEvents: EventData[] = (await getSimilarEventsBySlug(
		slug
	)) as EventData[];

	return (
		<section id="event">
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
							src={event.image}
							alt={event.title}
							fill
							className="object-cover"
							priority
						/>
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
					<div className="signup-card">
						<h2 className="">
							Book Your Spot
						</h2>

						{bookings > 0 ? (
							<p className="text-sm">
								Join {bookings}{' '}
								people who have
								already booked
								their spot!
							</p>
						) : (
							<p className="text-sm">
								Be the first to
								book your spot!
							</p>
						)}
						<BookEvent />
					</div>
				</aside>
			</div>

			<div className="flex w-full flex-col gap-4 pt-20">
				<h2>Similar Events</h2>
				<div className="events">
					{similarEvents.length === 0 ? (
						<p className="text-gray-400">
							No similar events found.
						</p>
					) : (
						similarEvents.map(
							(
								simEvent: EventData
							) => (
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
			</div>
		</section>
	);
}
