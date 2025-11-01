'use server';

import { Booking } from '@/database';
import dbConnect from '../mongodb';

export const createBooking = async ({
	eventId,
	slug,
	email
}: {
	eventId: string;
	slug: string;
	email: string;
}) => {
	try {
		await dbConnect();

		const booking = await Booking.findOne({ eventId, email });
		if (booking) {
			// User has already booked
			return {
				success: false,
				message: 'You have already booked this event'
			};
		}

		await Booking.create({
			eventId,
			slug,
			email
		});

		return { success: true };
	} catch (error) {
		console.error('Error creating booking:', error);
		return { success: false };
	}
};

export const countBooking = async (eventId: string) => {
	try {
		await dbConnect();

		const count = await Booking.countDocuments({ eventId });

		return count;
	} catch (error) {
		console.error('Error counting bookings:', error);
		return 0;
	}
};

export const isUserBookedBefore = async (eventId: string, email: string) => {
	try {
		await dbConnect();

		const booking = await Booking.findOne({ eventId, email });

		return booking !== null;
	} catch (error) {
		console.error('Error checking booking:', error);
		return false;
	}
};
