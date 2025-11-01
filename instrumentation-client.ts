import posthog from 'posthog-js';

const isPostHogDisabled = process.env.NEXT_PUBLIC_POSTHOG_DISABLED === 'true';

// Automatically initializes PostHog on the client for pageview tracking, session recording, and more.
if (typeof window !== 'undefined' && !isPostHogDisabled) {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
		api_host: '/ingest',
		ui_host: 'https://us.posthog.com',
		defaults: '2025-05-24',
		capture_exceptions: true, // Enable capturing exceptions using Error Tracking
		debug: process.env.NODE_ENV === 'development'
	});
}
