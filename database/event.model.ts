import { Schema, model, Document, models } from 'mongoose';
import slugify from 'slugify';

// Event document interface
export interface IEvent extends Document {
	title: string;
	slug: string;
	description: string;
	overview: string;
	image: string;
	venue: string;
	location: string;
	date: string;
	time: string;
	mode: 'online' | 'offline' | 'hybrid';
	audience: string;
	agenda: string[];
	organizer: string;
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
	{
		title: {
			type: String,
			required: [true, 'Title is required'],
			trim: true,
			maxlength: [100, 'Title cannot exceed 100 characters']
		},
		slug: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true
		},
		description: {
			type: String,
			required: [true, 'Description is required'],
			trim: true,
			maxlength: [
				1000,
				'Description cannot exceed 1000 characters'
			]
		},
		overview: {
			type: String,
			required: [true, 'Overview is required'],
			trim: true,
			maxlength: [
				500,
				'Overview cannot exceed 500 characters'
			]
		},
		image: {
			type: String,
			required: [true, 'Image URL is required'],
			trim: true
		},
		venue: {
			type: String,
			required: [true, 'Venue is required'],
			trim: true
		},
		location: {
			type: String,
			required: [true, 'Location is required'],
			trim: true
		},
		date: {
			type: String,
			required: [true, 'Date is required']
		},
		time: {
			type: String,
			required: [true, 'Time is required']
		},
		mode: {
			type: String,
			required: [true, 'Mode is required'],
			enum: {
				values: ['online', 'offline', 'hybrid'],
				message: 'Mode must be either online, offline, or hybrid'
			}
		},
		audience: {
			type: String,
			required: [true, 'Audience is required'],
			trim: true
		},
		agenda: {
			type: [String],
			required: [true, 'Agenda is required'],
			validate: {
				validator: (v: string[]) => v.length > 0,
				message: 'At least one agenda item is required'
			}
		},
		organizer: {
			type: String,
			required: [true, 'Organizer is required'],
			trim: true
		},
		tags: {
			type: [String],
			required: [true, 'Tags are required'],
			validate: {
				validator: (v: string[]) => v.length > 0,
				message: 'At least one tag is required'
			}
		}
	},
	{
		timestamps: true // Auto-generate createdAt and updatedAt
	}
);

// Generate slug from title and normalize date/time formats
eventSchema.pre('save', function (next) {
	// Only update slug if title is modified
	if (this.isModified('title')) {
		this.slug = slugify(this.title, { lower: true, strict: true });
	}

	// Normalize date to ISO format
	if (this.isModified('date')) {
		const normalizedDate = new Date(this.date)
			.toISOString()
			.split('T')[0];
		this.date = normalizedDate;
	}

	// Normalize time to 24-hour format
	if (this.isModified('time')) {
		const timeDate = new Date(`1970-01-01T${this.time}`);
		this.time = timeDate.toLocaleTimeString('en-US', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	next();
});

// Create unique index on slug for better performance
eventSchema.index({ slug: 1 }, { unique: true });

// Create compound index for common queries
eventSchema.index({ date: 1, mode: 1 });

// Export Event model (create if not exists in models registry)
export const Event = models.Event || model<IEvent>('Event', eventSchema);
