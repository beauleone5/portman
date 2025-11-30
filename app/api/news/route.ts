import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchNewsForCompanies } from '@/lib/newsFetcher';
import { scoreNewsItems, sortNewsByImpact } from '@/lib/impactScoring';

// GET /api/news?userId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Get all companies followed by this user
    const follows = await prisma.userCompanyFollow.findMany({
      where: { userId },
      include: {
        company: true,
      },
    });

    if (follows.length === 0) {
      return NextResponse.json([]);
    }

    const companies = follows.map((follow) => ({
      id: follow.company.id,
      name: follow.company.name,
      ticker: follow.company.ticker,
    }));

    // Fetch news for all companies
    const newsItems = await fetchNewsForCompanies(companies);

    // Score and sort news items
    const scoredNews = scoreNewsItems(newsItems);
    const sortedNews = sortNewsByImpact(scoredNews);

    return NextResponse.json(sortedNews);
  } catch (error) {
    console.error('[API] Error fetching news:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
