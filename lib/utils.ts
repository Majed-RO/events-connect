import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Helper function for basic string sanitization and trimming
export const sanitizeString = (value: unknown) => {
	return String(value || '').trim();
};

// Function to safely parse a JSON array string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const safeParseArrayString = (input: any) => {
	if (typeof input !== 'string' || input.trim().length === 0) {
		return [];
	}

	try {
		// 1. Attempt to parse the string into a JavaScript array
		const parsedArray = JSON.parse(input);

		// 2. Ensure the result is actually an array
		if (Array.isArray(parsedArray)) {
			// 3. Sanitize and filter the elements, just in case
			return parsedArray
				.map(sanitizeString)
				.filter(s => s.length > 0);
		}

		// If parsing succeeds but it's not an array (e.g., user sent "true")
		return [];
	} catch (e) {
		// If JSON.parse fails (e.g., user sent "invalid json"), return an empty array
		return [];
	}
};
