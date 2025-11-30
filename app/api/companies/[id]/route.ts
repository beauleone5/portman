import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/companies/:id?userId=...
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const companyId = params.id;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
    }

    // Delete the follow relationship
    await prisma.userCompanyFollow.deleteMany({
      where: {
        userId,
        companyId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error deleting company follow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
