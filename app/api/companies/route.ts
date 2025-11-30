import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/companies?userId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const follows = await prisma.userCompanyFollow.findMany({
      where: { userId },
      include: {
        company: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const companies = follows.map((follow) => follow.company);

    return NextResponse.json(companies);
  } catch (error) {
    console.error('[API] Error fetching companies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/companies
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, ticker } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { error: 'userId and name are required' },
        { status: 400 }
      );
    }

    // Check if user exists, if not create it
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `anonymous+${userId}@boardsignal.app`,
        },
      });
    }

    // Find or create company
    let company = await prisma.company.findFirst({
      where: {
        name: name,
        ticker: ticker || null,
      },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name,
          ticker: ticker || null,
        },
      });
    }

    // Create follow relationship (ignore if already exists)
    const existingFollow = await prisma.userCompanyFollow.findFirst({
      where: {
        userId,
        companyId: company.id,
      },
    });

    if (!existingFollow) {
      await prisma.userCompanyFollow.create({
        data: {
          userId,
          companyId: company.id,
        },
      });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('[API] Error creating company follow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
