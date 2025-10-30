'use client';
import { useState } from 'react';

const BookEvent = () => {
	const [email, setEmail] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically handle the booking logic, e.g., send the email to your server
		console.log(`Booking request submitted for email: ${email}`);
		setSubmitted(true);
	};
	return (
		<div id="book-event" className="">
			{submitted ? (
				<p className="text-sm">
					You have already booked your spot. Thank
					you for signing up!
				</p>
			) : (
				<form className="space-y-4" onSubmit={handleSubmit}>
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
              onChange={(e) => setEmail(e.target.value)}
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
