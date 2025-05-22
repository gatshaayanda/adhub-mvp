'use client';

export default function AdminHubLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="relative flex items-center justify-center mb-6">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
        <span className="absolute text-2xl font-bold text-blue-700 drop-shadow-sm">AH</span>
      </div>
      <span className="text-xl font-semibold text-gray-700 tracking-wide animate-pulse">
        Loading AdminHub...
      </span>
    </div>
  );
}
