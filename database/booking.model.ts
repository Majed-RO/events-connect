import { Schema, model, Document, models } from 'mongoose';
import { Event } from './event.model';

// Booking document interface
export interface IBooking extends Document {
	eventId: Schema.Types.ObjectId;
	email: string;
	createdAt: Date;
	updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
	{
		eventId: {
			type: Schema.Types.ObjectId,
			ref: 'Event',
			required: [true, 'Event ID is required'],
			index: true
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			trim: true,
			lowercase: true,
			validate: {
				validator: (email: string) => {
					return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
						email
					);
				},
				message: 'Please provide a valid email address'
			}
		}
	},
	{
		timestamps: true
	}
);

// Verify event exists before saving booking
bookingSchema.pre('save', async function (next) {
	if (this.isModified('eventId')) {
		const eventExists = await Event.exists({ _id: this.eventId });
		if (!eventExists) {
			throw new Error('Referenced event does not exist');
		}
	}
	next();
});

// Create compound index for common queries (events bookings by date)
bookingSchema.index({ eventId: 1, createdAt: -1 });

// Create index on email for user booking lookups
bookingSchema.index({ email: 1 });

// Enforce one booking per events per email
bookingSchema.index({ eventId: 1, email: 1 }, { unique: true, name: 'uniq_event_email' });

// Export Booking model (create if not exists in models registry)
export const Booking =
	models.Booking || model<IBooking>('Booking', bookingSchema);
