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
				{ message: 'Invalid json data format' },
				{ status: 400 }
			);
		}

    const createdEvent  = await Event.create(event);

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
