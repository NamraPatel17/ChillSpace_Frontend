/**
 * PageLoader — Beautiful skeleton shimmer loader used across all pages.
 * Import and pass a `variant` prop to match the page layout:
 *   "dashboard"  → stat cards + recent activity rows
 *   "table"      → header + table rows
 *   "cards"      → grid of property/booking cards
 *   "profile"    → sidebar card + tab content
 *   "detail"     → hero image + detail content
 *   "earnings"   → stat cards + chart bar placeholders
 *   "calendar"   → calendar left + controls right
 *   "default"    → full-page centered spinner with pulse ring
 */

const Shimmer = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

// ── Stat card row (4 cards) ────────────────────────────────────────────────
const StatRow = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <Shimmer className="h-3 w-24 mb-3" />
        <Shimmer className="h-8 w-32 mb-2" />
        <Shimmer className="h-3 w-20" />
      </div>
    ))}
  </div>
);

// ── Table rows ─────────────────────────────────────────────────────────────
const TableRows = ({ rows = 6 }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    {/* Header */}
    <div className="flex gap-4 px-6 py-4 border-b border-gray-100">
      {[40, 80, 60, 50, 40].map((w, i) => (
        <Shimmer key={i} className={`h-3 w-${w} rounded`} style={{ width: `${w}px` }} />
      ))}
    </div>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0">
        <Shimmer className="h-9 w-9 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-3 w-40" />
          <Shimmer className="h-3 w-24" />
        </div>
        <Shimmer className="h-3 w-20 hidden sm:block" />
        <Shimmer className="h-3 w-16 hidden md:block" />
        <Shimmer className="h-6 w-20 rounded-full" />
      </div>
    ))}
  </div>
);

// ── Card grid ──────────────────────────────────────────────────────────────
const CardGrid = ({ count = 6, cols = 3 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-6`}>
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Shimmer className="h-48 w-full rounded-none" />
        <div className="p-4 space-y-3">
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-3 w-1/2" />
          <div className="flex justify-between pt-2">
            <Shimmer className="h-3 w-16" />
            <Shimmer className="h-4 w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ── Chart/bar skeleton ─────────────────────────────────────────────────────
const ChartSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
    <Shimmer className="h-4 w-40 mb-6" />
    <div className="flex items-end gap-3 h-40">
      {[60, 80, 45, 90, 70, 55, 95, 40, 75, 85, 50, 65].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <Shimmer className="w-full rounded-t-md" style={{ height: `${h}%` }} />
          <Shimmer className="h-2 w-6 rounded" />
        </div>
      ))}
    </div>
  </div>
);

// ── Profile sidebar + tabs ──────────────────────────────────────────────────
const ProfileSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col items-center gap-4">
        <Shimmer className="h-24 w-24 rounded-full" />
        <Shimmer className="h-4 w-32" />
        <Shimmer className="h-3 w-24" />
      </div>
      <div className="mt-6 space-y-3">
        {[...Array(4)].map((_, i) => <Shimmer key={i} className="h-3 w-full" />)}
      </div>
    </div>
    <div className="lg:col-span-2 space-y-4">
      <div className="flex gap-2 mb-6">
        {[...Array(4)].map((_, i) => <Shimmer key={i} className="h-9 w-28 rounded-lg" />)}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Shimmer className="h-3 w-24" />
            <Shimmer className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Property detail (hero + booking card) ──────────────────────────────────
const DetailSkeleton = () => (
  <div>
    <Shimmer className="h-4 w-16 mb-5 rounded" />
    <Shimmer className="h-8 w-96 mb-3 max-w-full" />
    <Shimmer className="h-4 w-64 mb-6" />
    <Shimmer className="h-72 md:h-96 w-full mb-8 rounded-2xl" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Shimmer className="h-5 w-40" />
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-5/6" />
            <Shimmer className="h-4 w-4/6" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit space-y-4 shadow-sm">
        <Shimmer className="h-8 w-32" />
        <Shimmer className="h-48 w-full rounded-lg" />
        <Shimmer className="h-12 w-full rounded-lg" />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-full" />
      </div>
    </div>
  </div>
);

// ── Calendar skeleton ──────────────────────────────────────────────────────
const CalendarSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-6">
    <div className="flex-[1.2] bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between mb-4">
        <Shimmer className="h-5 w-32" />
        <div className="flex gap-2">
          <Shimmer className="h-8 w-8 rounded-lg" />
          <Shimmer className="h-8 w-8 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <Shimmer key={i} className="h-9 w-full rounded-lg" />
        ))}
      </div>
    </div>
    <div className="flex-1 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-3">
          <Shimmer className="h-4 w-32" />
          <Shimmer className="h-10 w-full rounded-lg" />
          <Shimmer className="h-10 w-full rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

// ── Earnings skeleton ──────────────────────────────────────────────────────
const EarningsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row gap-3 mb-2">
      {[...Array(4)].map((_, i) => <Shimmer key={i} className="h-9 w-32 rounded-lg" />)}
    </div>
    <StatRow />
    <ChartSkeleton />
    <TableRows rows={5} />
  </div>
);

// ── Spinning ring (fallback) ───────────────────────────────────────────────
const SpinnerFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="relative h-16 w-16">
      <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
    </div>
    <p className="text-sm text-gray-400 font-medium animate-pulse">Loading...</p>
  </div>
);

// ── Main export ────────────────────────────────────────────────────────────
export default function PageLoader({ variant = "default" }) {
  const wrap = (children) => (
    <div className="animate-in fade-in duration-300 p-1">
      {children}
    </div>
  );

  switch (variant) {
    case "dashboard":
      return wrap(
        <div className="space-y-6">
          <Shimmer className="h-7 w-48 mb-1" />
          <Shimmer className="h-4 w-72 mb-2" />
          <StatRow />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton />
            <TableRows rows={4} />
          </div>
        </div>
      );
    case "table":
      return wrap(
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Shimmer className="h-7 w-48" />
              <Shimmer className="h-4 w-64" />
            </div>
            <Shimmer className="h-9 w-28 rounded-lg" />
          </div>
          <StatRow />
          <TableRows rows={7} />
        </div>
      );
    case "cards":
      return wrap(
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Shimmer className="h-7 w-48" />
            <Shimmer className="h-9 w-24 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <Shimmer className="h-3 w-20 mb-2" />
                <Shimmer className="h-7 w-16" />
              </div>
            ))}
          </div>
          <CardGrid count={6} />
        </div>
      );
    case "profile":
      return wrap(<ProfileSkeleton />);
    case "detail":
      return wrap(<DetailSkeleton />);
    case "earnings":
      return wrap(<EarningsSkeleton />);
    case "calendar":
      return wrap(
        <div className="space-y-6">
          <Shimmer className="h-7 w-48 mb-1" />
          <Shimmer className="h-4 w-64 mb-4" />
          <CalendarSkeleton />
        </div>
      );
    case "verifications":
      return wrap(
        <div className="space-y-6">
          <Shimmer className="h-7 w-64 mb-1" />
          <Shimmer className="h-4 w-80 mb-2" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <Shimmer className="h-3 w-24 mb-2" />
              <Shimmer className="h-8 w-12" />
            </div>
          </div>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col lg:grid lg:grid-cols-12">
              <div className="p-6 lg:col-span-5 space-y-4">
                <div className="flex items-center gap-3">
                  <Shimmer className="h-12 w-12 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Shimmer className="h-4 w-32" />
                    <Shimmer className="h-3 w-48" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Shimmer className="h-10 rounded-lg" />
                  <Shimmer className="h-10 rounded-lg" />
                </div>
                <div className="flex gap-2 pt-4">
                  <Shimmer className="h-10 flex-1 rounded-lg" />
                  <Shimmer className="h-10 flex-1 rounded-lg" />
                </div>
              </div>
              <Shimmer className="lg:col-span-7 h-64 lg:h-auto rounded-none" />
            </div>
          ))}
        </div>
      );
    default:
      return <SpinnerFallback />;
  }
}
