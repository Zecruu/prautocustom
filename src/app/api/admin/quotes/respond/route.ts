import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Quote from '@/models/Quote';
import QuoteResponse from '@/models/QuoteResponse';
import Product from '@/models/Product';
import User from '@/models/User';
import { sendQuoteResponseEmail, initEmailJS } from '@/lib/emailjs';

export const dynamic = 'force-dynamic';

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

    // Ensure Product model is registered
    Product;

    // Check if quote exists and get client ID
    const existingQuote = await Quote.findById(quote);
    if (!existingQuote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Calculate valid until date
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + (validityDays || 15));

    // Format products with totalPrice calculation
    const formattedProducts = products.map((p: { product: string; unitPrice: number; quantity: number; notes?: string }) => ({
      product: p.product,
      quantity: p.quantity,
      unitPrice: p.unitPrice,
      totalPrice: p.unitPrice * p.quantity,
      notes: p.notes || '',
    }));

    // Create quote response
    const quoteResponse = await QuoteResponse.create({
      quote,
      client: existingQuote.client, // Add client from the quote
      respondedBy,
      products: formattedProducts,
      subtotal,
      tax,
      total,
      message: notes,
      status: 'sent',
      validUntil,
    });

    // Update quote status and assign employee
    await Quote.findByIdAndUpdate(quote, {
      status: 'responded',
      assignedTo: respondedBy,
      respondedAt: new Date(),
    });

    // Send quote response email to client
    try {
      // Get client details
      const client = await User.findById(existingQuote.client).select('name email');
      
      // Get product details for email
      const populatedProducts = await Promise.all(
        formattedProducts.map(async (p: { product: string; quantity: number; unitPrice: number; totalPrice: number; notes: string }) => {
          const product = await Product.findById(p.product).select('name');
          return {
            name: product?.name?.en || 'Product',
            quantity: p.quantity,
            unitPrice: p.unitPrice,
            totalPrice: p.totalPrice,
          };
        })
      );

      // Format product details as HTML list
      const productDetails = populatedProducts.map(p => 
        `<li><strong>${p.name}</strong> (x${p.quantity}) - $${p.unitPrice.toFixed(2)} each = <strong>$${p.totalPrice.toFixed(2)}</strong></li>`
      ).join('');

      initEmailJS();
      await sendQuoteResponseEmail({
        clientEmail: client?.email || '',
        clientName: client?.name || 'Customer',
        quoteNumber: String(existingQuote._id).slice(-8).toUpperCase(),
        validUntil: validUntil.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        productDetails: `<ul style="list-style: none; padding: 0;">${productDetails}</ul>`,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        notes: notes || '',
      });
      
      console.log('Quote response email sent to:', client?.email);
    } catch (emailError) {
      console.error('Failed to send quote response email:', emailError);
      // Continue - quote response is still saved
    }

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

