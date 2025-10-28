events-connect

A small Next.js app showcasing developer events and hackathons. It includes a simple `EventCard` component and a centralized `events` list in `lib/constants.ts` for demo data.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

About the data

- Event data is defined in `lib/constants.ts` as an `events` array. Each item includes `title`, `image`, `slug`, `date`, `time`, and `location`.
- Use `EventCard` from `components/EventCard.tsx` to render an event. Example:

```tsx
import events from '@/lib/constants';
import EventCard from '@/components/EventCard';

events.map(e => (
	<EventCard
		key={e.id}
		title={e.title}
		image={e.image}
		slug={e.slug}
		location={e.location}
		date={e.date}
		time={e.time}
	/>
));
```

Keeping it simple: change `lib/constants.ts` to update demo events or add new ones.

License

This repository has no license specified.
