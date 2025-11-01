'use client';
import { createBooking } from '@/lib/actions/booking-actions';
import posthog from 'posthog-js';
import { useState } from 'react';

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Email validation
		/* const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			alert('Please enter a valid email address');
			return;
		} */

		const { success, message } = await createBooking({
			eventId,
			slug,
			email
		});
		if (!success) {
			console.log('Booking creation failed');
			posthog.captureException('Booking creation failed');
			setMessage(message || 'Booking creation failed');

			return;
		} else {
			setSubmitted(true);
			posthog.capture('event_booked', {
				eventId,
				slug,
				email
			});
		}
	};
	return (
		<div id="book-event" className="">
			{submitted || message ? (
				<p className="text-sm">
					You have already booked your spot. Thank
					you for signing up!
				</p>
			) : (
				<form
					className="space-y-4"
					onSubmit={handleSubmit}
				>
					<div>
						<label
							htmlFor="email"
							className="mb-2 block text-sm text-gray-300"
						>
							Email Address
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={email}
							required
							onChange={e =>
								setEmail(
									e.target
										.value
								)
							}
							placeholder="Enter your email"
							className="w-full rounded-lg bg-slate-900/50 px-4 py-3 text-white placeholder-gray-500 outline-none ring-1 ring-slate-700 transition-all focus:ring-2 focus:ring-teal-500"
						/>
					</div>
					<button
						type="submit"
						className="button-submit"
					>
						Submit
					</button>
				</form>
			)}
		</div>
	);
};

export default BookEvent;
