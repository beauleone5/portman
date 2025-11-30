'use client';

import NewsCard from './NewsCard';

interface NewsItem {
  id: string;
  companyName: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  description?: string;
  impactScore: number;
}

interface NewsFeedProps {
  news: NewsItem[];
  isLoading: boolean;
}

export default function NewsFeed({ news, isLoading }: NewsFeedProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-sm text-gray-600">Loading news...</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No news yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Follow some companies to see their latest news here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <NewsCard key={item.id} {...item} />
      ))}
    </div>
  );
}
