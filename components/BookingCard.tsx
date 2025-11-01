import { countBooking } from '@/lib/actions/booking-actions';
import BookEvent from './BookEvent';

const BookingCard = async ({
	eventId,
	slug
}: {
	eventId: string;
	slug: string;
}) => {
	const bookingsCount = await countBooking(eventId);

	return (
		<div className="signup-card">
			<h2 className="">Book Your Spot</h2>

			{bookingsCount > 0 ? (
				<p className="text-sm">
					Join {bookingsCount} people who have
					already booked their spot!
				</p>
			) : (
				<p className="text-sm">
					Be the first to book your spot!
				</p>
			)}
			<BookEvent eventId={eventId} slug={slug} />
		</div>
	);
};

export const BookingCardSkeleton = () => {
  return (
    <div className="signup-card p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700 animate-pulse">
      {/* 1. Header (Book Your Spot) Placeholder */}
      <div className="mb-4 h-6 w-3/5 rounded-md bg-gray-600"></div>

      {/* 2. Booking Count/Status Placeholder */}
      <div className="mb-6 h-4 w-4/5 rounded-md bg-gray-700"></div>

      {/* 3. Action Button Placeholder (BookEvent) */}
      <div className="h-12 w-full rounded-full bg-teal-600/50"></div>
    </div>
  );
};

export default BookingCard;

