// This component should be used as the fallback, e.g., in a loading.tsx file

const EventSkeleton = () => {
  return (
    // The main container structure of your page
    <div className="animate-pulse">
      {/* 1. Title and Description Skeleton */}
      <div className="header mb-8">
        {/* Title Placeholder (Large) */}
        <div className="mb-4 h-12 w-3/4 rounded-lg bg-gray-700"></div>
        {/* Description Placeholder (Paragraphs) */}
        <div className="space-y-2">
          <div className="h-6 w-full rounded-md bg-gray-700"></div>
          <div className="h-6 w-11/12 rounded-md bg-gray-700"></div>
        </div>
      </div>

      <div className="details grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Event Info Skeleton */}
        <div className="content md:col-span-2 space-y-12">
          {/* Event Image Placeholder (Aspect Ratio) */}
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-700"></div>

          {/* Overview Section Skeleton */}
          <section>
            <div className="mb-4 h-7 w-1/4 rounded-md bg-gray-700"></div> {/* Header */}
            <div className="space-y-2">
              <div className="h-6 w-full rounded-md bg-gray-700"></div>
              <div className="h-6 w-full rounded-md bg-gray-700"></div>
              <div className="h-6 w-5/6 rounded-md bg-gray-700"></div>
            </div>
          </section>

          {/* Event Details Grid Skeleton */}
          <section>
            <div className="mb-6 h-7 w-1/4 rounded-md bg-gray-700"></div> {/* Header */}
            <div className="flex flex-col space-y-3">
              {/* EventDetailsItem Placeholder (5 items) */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-6 w-6 rounded-full bg-gray-600"></div> {/* Icon */}
                  <div className="h-5 w-1/3 rounded-md bg-gray-700"></div> {/* Data */}
                </div>
              ))}
            </div>
          </section>

          {/* Agenda Section Skeleton */}
          <section className="agenda">
            <div className="mb-6 h-7 w-1/4 rounded-md bg-gray-700"></div> {/* Header */}
            <ul className="space-y-3">
              {/* Agenda Item Placeholder (3 items) */}
              {[...Array(3)].map((_, i) => (
                <li key={i} className="flex gap-3 text-gray-300">
                  <div className="h-5 w-full rounded-md bg-gray-700"></div>
                </li>
              ))}
            </ul>
          </section>

          {/* About the Organizer & Tags Skeleton */}
          <section>
            <div className="mb-4 h-7 w-1/3 rounded-md bg-gray-700"></div> {/* Header */}
            <div className="h-6 w-3/4 rounded-md bg-gray-700"></div> {/* Description */}
            {/* Tags Placeholder */}
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="h-8 w-16 rounded-full bg-gray-700"></div>
              <div className="h-8 w-20 rounded-full bg-gray-700"></div>
              <div className="h-8 w-12 rounded-full bg-gray-700"></div>
            </div>
          </section>
        </div>

        {/* Right Column - Booking Card is handled by its own Suspense */}
        <aside className="booking md:col-span-1">
          {/* Booking Card Placeholder */}
          <div className="h-96 rounded-2xl bg-gray-700">
            <div className="p-6">
                <div className="h-8 w-2/3 rounded-md bg-gray-600 mb-4"></div>
                <div className="h-10 w-full rounded-full bg-teal-600"></div>
            </div>
          </div>
        </aside>
      </div>

      {/* Similar Events Section Placeholder */}
      <div className="mt-12">
        <div className="h-8 w-1/5 rounded-md bg-gray-700 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="h-64 rounded-xl bg-gray-700"></div>
            <div className="h-64 rounded-xl bg-gray-700"></div>
            <div className="h-64 rounded-xl bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

export default EventSkeleton;