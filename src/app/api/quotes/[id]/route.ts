import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Quote from '@/models/Quote';
import QuoteResponse from '@/models/QuoteResponse';
import Product from '@/models/Product';
import User from '@/models/User';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// DELETE - Cancel/Delete quote (Client can cancel their own pending quotes)
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    await connectDB();

    // Ensure models are registered
    Product;
    User;

    // Find the quote
    const quote = await Quote.findById(id);

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Check if user owns this quote OR is an admin
    const isOwner = String(quote.client) === session.user.id;
    const isAdmin = session.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized - You can only cancel your own quotes' }, { status: 403 });
    }

    // Clients can only cancel pending quotes
    if (!isAdmin && quote.status !== 'pending') {
      return NextResponse.json({ 
        error: 'Can only cancel pending quotes. This quote has already been responded to.' 
      }, { status: 400 });
    }

    // Delete the quote
    await Quote.findByIdAndDelete(id);

    // Also delete any associated quote responses
    await QuoteResponse.deleteMany({ quote: id });

    return NextResponse.json({ 
      message: 'Quote cancelled successfully',
      deletedId: id 
    });
  } catch (error) {
    console.error('Quote cancellation error:', error);
    return NextResponse.json({ error: 'Failed to cancel quote' }, { status: 500 });
  }
}

