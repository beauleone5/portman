import { NewsItem } from './types';

const HIGH_IMPACT_KEYWORDS = [
  'acquisition',
  'merger',
  'series a',
  'series b',
  'series c',
  'funding',
  'raises',
  'raised',
  'layoffs',
  'layoff',
  'ceo',
  'board',
  'investigation',
  'bankruptcy',
  'ipo',
  'lawsuit',
  'settled',
  'settlement',
];

const AMOUNT_PATTERNS = [
  /\$\d+\.?\d*\s*(million|billion|m|b)\b/i,
  /\d+\.?\d*\s*(million|billion)\s*dollars?/i,
];

export function scoreImpact(article: NewsItem): number {
  const text = `${article.title} ${article.description || ''}`.toLowerCase();

  // Base score
  let score = 3;

  // Check for high impact keywords (+4)
  const hasHighImpactKeyword = HIGH_IMPACT_KEYWORDS.some((keyword) =>
    text.includes(keyword)
  );
  if (hasHighImpactKeyword) {
    score += 4;
  }

  // Check for amount patterns (+2)
  const hasAmountPattern = AMOUNT_PATTERNS.some((pattern) => pattern.test(text));
  if (hasAmountPattern) {
    score += 2;
  }

  // Cap at 10, floor at 0
  return Math.max(0, Math.min(10, score));
}

export interface NewsItemWithScore extends NewsItem {
  impactScore: number;
}

export function scoreNewsItems(items: NewsItem[]): NewsItemWithScore[] {
  return items.map((item) => ({
    ...item,
    impactScore: scoreImpact(item),
  }));
}

export function sortNewsByImpact(items: NewsItemWithScore[]): NewsItemWithScore[] {
  return items.sort((a, b) => {
    // First by impact score (descending)
    if (b.impactScore !== a.impactScore) {
      return b.impactScore - a.impactScore;
    }
    // Then by published date (descending)
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}
