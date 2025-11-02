import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Quote from '@/models/Quote';
import QuoteResponse from '@/models/QuoteResponse';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// DELETE - Delete quote (Admin only)
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can delete quotes
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 });
    }

    const { id } = await context.params;

    await connectDB();

    // Delete the quote
    const quote = await Quote.findByIdAndDelete(id);

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Also delete any associated quote responses
    await QuoteResponse.deleteMany({ quote: id });

    return NextResponse.json({ 
      message: 'Quote deleted successfully',
      deletedId: id 
    });
  } catch (error) {
    console.error('Quote delete error:', error);
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
}

