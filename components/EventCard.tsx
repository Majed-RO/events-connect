import Image from 'next/image';
import Link from 'next/link';

interface Props {
	title: string;
	image: string;
	slug: string;
	location: string;
	date: string; // YYYY-MM-DD
	time: string; // HH:MM
}

const EventCard = ({ title, image, slug, location, date, time }: Props) => {
	const href = slug ? `/events/${slug}` : '/events';

	return (
		<Link href={href} id="event-card">
			<Image
				src={image}
				alt={title}
				width={410}
				height={300}
				className="poster"
			/>

			<div className="flex flex-row gap-2">
				<Image
					src={'/icons/pin.svg'}
					width={14}
					height={14}
					alt="location"
				/>
				<p>{location}</p>
			</div>

			<p className="title">{title}</p>

			<div className="datetime">
				<div>
					<Image
						src={'/icons/calendar.svg'}
						width={14}
						height={14}
						alt="date"
					/>
					<p>{date}</p>
				</div>
				<div>
					<Image
						src={'/icons/clock.svg'}
						width={14}
						height={14}
						alt="time"
					/>
					<p>{time}</p>
				</div>
			</div>
		</Link>
	);
};

export default EventCard;
