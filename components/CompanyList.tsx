'use client';

interface Company {
  id: string;
  name: string;
  ticker: string | null;
}

interface CompanyListProps {
  companies: Company[];
  onUnfollow: (id: string) => Promise<void>;
}

export default function CompanyList({ companies, onUnfollow }: CompanyListProps) {
  if (companies.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        No companies followed yet. Add one above to get started.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {companies.map((company) => (
        <div
          key={company.id}
          className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{company.name}</p>
            {company.ticker && (
              <p className="text-xs text-gray-500">{company.ticker}</p>
            )}
          </div>
          <button
            onClick={() => onUnfollow(company.id)}
            className="ml-2 text-gray-400 hover:text-red-600 focus:outline-none transition-colors"
            aria-label={`Unfollow ${company.name}`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
