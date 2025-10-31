import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Quote from '@/models/Quote';
import User from '@/models/User';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

// POST - Create new quote request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Must be authenticated
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    // Ensure Product model is registered
    Product;

    const data = await request.json();
    const { products, firstName, lastName, email, phone, shippingAddress, notes } = data;

    // Validate required fields
    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'At least one product is required' },
        { status: 400 }
      );
    }

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Contact information is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get user from database
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user contact info if provided
    if (firstName || lastName || phone) {
      const nameParts = user.name?.split(' ') || [];
      const updatedName = `${firstName || nameParts[0] || ''} ${lastName || nameParts[1] || ''}`.trim();
      
      await User.findByIdAndUpdate(session.user.id, {
        name: updatedName,
        phone: phone || user.phone,
      });
    }

    // Format products for Quote model
    const quoteProducts = products.map((p: { productId: string; quantity?: number; notes?: string }) => ({
      product: p.productId,
      quantity: p.quantity || 1,
      notes: p.notes || '',
    }));

    // Build message with contact details and shipping info
    let message = `Contact: ${firstName} ${lastName}\n`;
    message += `Email: ${email}\n`;
    message += `Phone: ${phone}\n`;
    
    if (shippingAddress) {
      message += `\nShipping Address: ${shippingAddress}\n`;
    }
    
    if (notes) {
      message += `\nAdditional Notes: ${notes}`;
    }

    // Create quote
    const quote = await Quote.create({
      client: session.user.id,
      products: quoteProducts,
      status: 'pending',
      message,
    });

    return NextResponse.json(
      {
        message: 'Quote request submitted successfully',
        quote: {
          id: String(quote._id),
          status: quote.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}

// GET - Get user's quotes
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Ensure Product model is registered before populate
    if (!Product) {
      throw new Error('Product model not loaded');
    }

    // Get all quotes for the user
    const quotes = await Quote.find({ client: session.user.id })
      .populate('products.product', 'name sku images')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ quotes }, { status: 200 });
  } catch (error) {
    console.error('Get quotes error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch quotes', details: errorMessage },
      { status: 500 }
    );
  }
}

