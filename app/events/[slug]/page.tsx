import { Metadata } from 'next';
// import { Suspense } from 'react';
// import Link from 'next/link';

import { IEvent } from '@/database/event.model';

import { Suspense } from 'react';
import EventContent from '@/components/EventContent';
import EventSkeleton from './loading';

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
export async function getEventBySlug(slug: string): Promise<EventData | null> {
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

/**
 * Event Details Page Component
 */
export default async function EventPage({ params }: EventPageProps) {
	// 'use cache'
	// cacheLife('hours');

	// const { slug } = await params;
  /* SEE: https://nextjs.org/docs/messages/blocking-route#params-and-searchparams */
  const eventParams = params.then(p => ({ slug: p.slug  }))

	return (
		<section id="event">
			<Suspense fallback={<EventSkeleton />}>
				{/* <EventContent eventPromise={params} /> */}
				<EventContent eventPromise={eventParams} />
			</Suspense>
		</section>
	);
}
