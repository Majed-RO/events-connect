'use server';

import { Event } from '@/database';
import dbConnect from '../mongodb';
// import { LeanDocument } from 'mongoose';

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
