import { NewsItem, Company } from './types';

interface NewsAPIArticle {
  source: { name: string };
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

interface NewsAPIResponse {
  status: string;
  articles: NewsAPIArticle[];
}

const MOCK_NEWS: Record<string, NewsAPIArticle[]> = {
  default: [
    {
      source: { name: 'TechCrunch' },
      title: 'Company announces Series B funding round of $50M',
      description: 'The company has raised $50 million in Series B funding led by top tier VCs.',
      url: 'https://example.com/article-1',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      source: { name: 'Bloomberg' },
      title: 'Quarterly earnings exceed expectations',
      description: 'The company reported strong quarterly earnings, beating analyst expectations.',
      url: 'https://example.com/article-2',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      source: { name: 'Reuters' },
      title: 'New CEO appointed to board of directors',
      description: 'The company has appointed a new CEO with extensive experience in the industry.',
      url: 'https://example.com/article-3',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      source: { name: 'Wall Street Journal' },
      title: 'Strategic acquisition announced',
      description: 'The company announces acquisition of competitor in billion dollar deal.',
      url: 'https://example.com/article-4',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    },
    {
      source: { name: 'The Information' },
      title: 'Company expands to new markets',
      description: 'Expansion plans announced for European and Asian markets.',
      url: 'https://example.com/article-5',
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    },
  ],
};

async function fetchNewsFromAPI(
  companyName: string,
  ticker: string | null | undefined
): Promise<NewsAPIArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    console.log('[NewsFetcher] No NEWS_API_KEY found, using mock data');
    return MOCK_NEWS.default;
  }

  try {
    // Build query: try ticker first if available, otherwise use company name
    const query = ticker || companyName;

    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fromDate = sevenDaysAgo.toISOString().split('T')[0];

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query
    )}&from=${fromDate}&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error('[NewsFetcher] NewsAPI error:', response.status);
      return MOCK_NEWS.default;
    }

    const data: NewsAPIResponse = await response.json();

    if (data.status !== 'ok' || !data.articles) {
      console.error('[NewsFetcher] NewsAPI returned non-ok status');
      return MOCK_NEWS.default;
    }

    return data.articles.slice(0, 10);
  } catch (error) {
    console.error('[NewsFetcher] Error fetching from NewsAPI:', error);
    return MOCK_NEWS.default;
  }
}

export async function fetchNewsForCompanies(
  companies: Company[]
): Promise<NewsItem[]> {
  if (companies.length === 0) {
    return [];
  }

  const allNews: NewsItem[] = [];

  for (const company of companies) {
    const articles = await fetchNewsFromAPI(company.name, company.ticker);

    for (const article of articles) {
      allNews.push({
        id: `${company.id}-${Buffer.from(article.url).toString('base64').slice(0, 16)}`,
        companyId: company.id,
        companyName: company.name,
        title: article.title,
        source: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
        description: article.description || undefined,
      });
    }
  }

  return allNews;
}
