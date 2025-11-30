'use client';

interface NewsCardProps {
  companyName: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  description?: string;
  impactScore: number;
}

export default function NewsCard({
  companyName,
  title,
  source,
  url,
  publishedAt,
  description,
  impactScore,
}: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getImpactColor = (score: number) => {
    if (score >= 8) return 'bg-red-100 text-red-800';
    if (score >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getImpactLabel = (score: number) => {
    if (score >= 8) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {companyName}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              {title}
            </a>
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span className="font-medium">{source}</span>
            <span>•</span>
            <span>{formatDate(publishedAt)}</span>
          </div>
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getImpactColor(impactScore)}`}>
            {getImpactLabel(impactScore)}: {impactScore}/10
          </div>
        </div>
      </div>
    </div>
  );
}
