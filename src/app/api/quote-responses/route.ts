import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import QuoteResponse from '@/models/QuoteResponse';

export const dynamic = 'force-dynamic';

// GET - Get user's quote responses
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get all quote responses for the user
    const responses = await QuoteResponse.find({ client: session.user.id })
      .populate('products.product', 'name sku')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ responses }, { status: 200 });
  } catch (error) {
    console.error('Get quote responses error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch quote responses', details: errorMessage },
      { status: 500 }
    );
  }
}

