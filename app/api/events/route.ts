import { Event } from '@/database';
import dbConnect from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { safeParseArrayString, sanitizeString } from '@/lib/utils';

export async function POST(req: NextRequest) {
	try {
		await dbConnect();

		const formData = await req.formData();

		let event;

		try {
			event = Object.fromEntries(formData.entries());
		} catch (e) {
			return NextResponse.json(
				{ message: 'Invalid form data format', error: e instanceof Error ? e.message : 'Unknown' },
				{ status: 400 }
			);
		}

		// --- 1. Combined Validation for Required Fields and File Check ---
		// NOTE: I'm keeping your required field logic simple for now.
		// For robust schema validation (like character limits and enums),
		// it's best to let Mongoose handle it on save, OR use a library like Zod
		// for API-side validation.

		const requiredFields = [
			'title',
			'description',
			'overview',
			'venue',
			'location',
			'date',
			'time',
			'mode',
			'audience',
			'agenda',
			'organizer',
			'tags'
		];

		const missingFields = requiredFields.filter(
			field =>
				!event[field] ||
				(typeof event[field] === 'string' &&
					event[field].trim() === '')
		);

		if (missingFields.length > 0) {
			return NextResponse.json(
				{
					message: 'Missing required fields or field values are empty.',
					fields: missingFields
				},
				{ status: 400 }
			);
		}

		// Validate image file separately
		const imageFile = formData.get('image');
		if (!imageFile || !(imageFile instanceof File)) {
			return NextResponse.json(
				{ message: 'Image file is required' },
				{ status: 400 }
			);
		}

		// NOTE: The slug field is typically generated automatically from the title,
		// so it shouldn't be a required *input* field.

		// --- 2. Data Sanitization and Transformation ---
		const sanitizedEvent = {
			// String Fields: Sanitize and trim
			title: sanitizeString(event.title),
			description: sanitizeString(event.description),
			overview: sanitizeString(event.overview),
			venue: sanitizeString(event.venue),
			location: sanitizeString(event.location),
			mode: sanitizeString(event.mode),
			audience: sanitizeString(event.audience),
			organizer: sanitizeString(event.organizer),

			// Array Fields: Ensure they are arrays of strings and not empty
			agenda: safeParseArrayString(event.agenda),
			tags: safeParseArrayString(event.tags),

			// Date/Time fields will be handled next
			date: event.date,
			time: event.time,
			image: ''
		};

		// --- 3. Combined Date and Time Validation ---

		const dateInput = sanitizeString(sanitizedEvent.date);
		const timeInput = sanitizeString(sanitizedEvent.time);

		// Combine the two strings into an ISO-like format for the Date constructor
		// We assume date is YYYY-MM-DD and time is HH:MM
		const combinedDateTimeString = `${dateInput}T${timeInput}:00`;
		const eventDateTime = new Date(combinedDateTimeString);

		// A. Check for Invalid Date
		if (isNaN(eventDateTime.getTime())) {
			return NextResponse.json(
				{
					message: 'Invalid date or time format. Expected YYYY-MM-DD and HH:MM.'
				},
				{ status: 400 }
			);
		}

		// B. Check for Future Date (Crucial Validation)
		const now = new Date();
		if (eventDateTime.getTime() <= now.getTime()) {
			return NextResponse.json(
				{
					message: 'Event must be scheduled for a future date and time.'
				},
				{ status: 400 }
			);
		}

		// C. Re-validate Array Length (based on your schema)
		if (sanitizedEvent.agenda.length === 0) {
			return NextResponse.json(
				{
					message: 'At least one agenda item is required.'
				},
				{ status: 400 }
			);
		}
		if (sanitizedEvent.tags.length === 0) {
			return NextResponse.json(
				{ message: 'At least one tag is required.' },
				{ status: 400 }
			);
		}

		// upload the image to cloudinary cloud
		// Validate file type
		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
		if (!allowedTypes.includes(imageFile.type)) {
			return NextResponse.json(
				{ message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
				{ status: 400 }
			);
		}

		// Validate file size (e.g., 5MB limit)
		const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
		if (imageFile.size > MAX_FILE_SIZE) {
			return NextResponse.json(
				{ message: 'File size exceeds 5MB limit.' },
				{ status: 400 }
			);
		}



		const arrayBuffer = await imageFile.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		type CloudinaryUploadResult = {
			secure_url: string;
			// add other properties if needed
		};

		const uploadResult = await new Promise<CloudinaryUploadResult>(
			(resolve, reject) => {
				const stream =
					cloudinary.uploader.upload_stream(
						{
							folder: 'events',
							resource_type: 'image'
						},
						(error, result) => {
							if (
								error ||
								!result ||
								typeof result.secure_url !==
									'string'
							) {
								return reject(
									error ||
										new Error(
											'No secure_url in result'
										)
								);
							}
							resolve(
								result as CloudinaryUploadResult
							);
						}
					);
				stream.end(buffer);
			}
		);

		if (!uploadResult || !uploadResult.secure_url) {
			return NextResponse.json(
				{ message: 'Image upload failed' },
				{ status: 500 }
			);
		}

		sanitizedEvent.image = uploadResult.secure_url;

		const createdEvent = await Event.create(sanitizedEvent);

		return NextResponse.json(
			{
				message: 'Event created successfully',
				event: createdEvent
			},
			{ status: 201 }
		);
	} catch (e) {
		console.error(e);
		return NextResponse.json(
			{
				message: 'Event creation failed',
				error:
					e instanceof Error
						? e.message
						: 'Unknown'
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
  try {
    await dbConnect(); 

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: 'Events fetched successfully',
        events
      },
      { status: 200 }
    );

  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: 'Failed to fetch events',
        error:
          e instanceof Error
            ? e.message
            : 'Unknown'
      },
      { status: 500 }
    );
  }
}
