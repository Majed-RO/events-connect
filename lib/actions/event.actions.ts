'use server';

import { Event, IEvent } from '@/database';
import dbConnect from '../mongodb';
// import { LeanDocument } from 'mongoose';

export async function bookEvent(email: string, eventId: string) {
	// Here you would typically handle the booking logic, e.g., save the email and eventId to your database
	console.log(
		`Booking request submitted for email: ${email} for event ID: ${eventId}`
	);
	// Simulate async operation
	return new Promise(resolve => setTimeout(resolve, 1000));
}

export async function cancelBooking(email: string, eventId: string) {
	// Here you would typically handle the cancellation logic, e.g., remove the booking from your database
	console.log(
		`Booking cancellation requested for email: ${email} for event ID: ${eventId}`
	);
	// Simulate async operation
	return new Promise(resolve => setTimeout(resolve, 1000));
}

export async function getSimilarEventsBySlug(slug: string) {
	try {
		await dbConnect();
		// get the event to find similar ones
		const event = await Event.findOne({ slug }).exec();

		if (!event) {
			return [];
		}

		const similarEvents = await Event.find({
			_id: { $ne: event._id },
			tags: { $in: event.tags } // exclude the current event
		})
			.limit(3)
			.lean()
			.exec();

		return similarEvents;
	} catch (error) {
		console.error('Error fetching similar events by slug:', error);
		return [];
	}
}
