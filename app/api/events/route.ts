import { Event } from '@/database';
import dbConnect from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		await dbConnect();

		const formData = await req.formData();

		let event;

		try {
			event = Object.fromEntries(formData.entries());

		} catch (e) {
			return NextResponse.json(
				{ message: 'Invalid form data format' },
				{ status: 400 }
			);
		}

		// Validate required fields
		const requiredFields = ['title', 'description', 'date', 'location'];
		const missingFields = requiredFields.filter(field => !event[field]);
		if (missingFields.length > 0) {
			return NextResponse.json(
				{ 
					message: 'Missing required fields',
					fields: missingFields 
				},
				{ status: 400 }
			);
		}

		// Sanitize and validate data types
		const sanitizedEvent = {
			title: String(event.title).trim(),
			description: String(event.description).trim(),
			date: new Date(event.date),
			location: String(event.location).trim(),
			// Add other fields with proper type validation
		};

		// Check for valid date
		if (isNaN(sanitizedEvent.date.getTime())) {
			return NextResponse.json(
				{ message: 'Invalid date format' },
				{ status: 400 }
			);
		}

    const createdEvent  = await Event.create(sanitizedEvent);

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
