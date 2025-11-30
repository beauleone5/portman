import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/companies/:id?userId=...
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: params.id },
    });

    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (err) {
    console.error("Error fetching company:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
