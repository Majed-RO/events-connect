import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Event } from '@/database/event.model';

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 * 
 * @param request - Next.js request object
 * @param params - Dynamic route parameters containing slug
 * @returns Event data or error response
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params to get the slug value
    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { 
          success: false,
          message: 'Slug parameter is required and must be a valid string' 
        },
        { status: 400 }
      );
    }

    // Validate slug format (lowercase alphanumeric with hyphens)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens' 
        },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Query event by slug
    const event = await Event.findOne({ slug }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { 
          success: false,
          message: `Event with slug "${slug}" not found` 
        },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json(
      {
        success: true,
        event
      },
      { status: 200 }
    );

  } catch (error) {
    // Log error for debugging (use proper logging service in production)
    console.error('Error fetching event by slug:', error);

    // Return generic error response
    return NextResponse.json(
      { 
        success: false,
        message: 'An unexpected error occurred while fetching the event',
        ...(process.env.NODE_ENV === 'development' && {
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      },
      { status: 500 }
    );
  }
}
