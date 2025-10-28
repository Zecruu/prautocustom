import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Quote from '@/models/Quote';
import QuoteResponse from '@/models/QuoteResponse';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'employee')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { quote, respondedBy, products, subtotal, tax, total, notes, validityDays } = data;

    // Validate input
    if (!quote || !respondedBy || !products || products.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Check if quote exists
    const existingQuote = await Quote.findById(quote);
    if (!existingQuote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Calculate valid until date
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + (validityDays || 15));

    // Create quote response
    const quoteResponse = await QuoteResponse.create({
      quote,
      respondedBy,
      products,
      subtotal,
      tax,
      total,
      notes,
      status: 'sent',
      validUntil,
    });

    // Update quote status and assign employee
    await Quote.findByIdAndUpdate(quote, {
      status: 'responded',
      assignedTo: respondedBy,
    });

    return NextResponse.json(
      {
        message: 'Quote response sent successfully',
        response: {
          id: String(quoteResponse._id),
          total,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Quote response error:', error);
    return NextResponse.json({ error: 'Failed to send quote response' }, { status: 500 });
  }
}

