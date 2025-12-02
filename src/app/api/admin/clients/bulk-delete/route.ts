import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Quote from '@/models/Quote';
import QuoteResponse from '@/models/QuoteResponse';

// POST - Bulk delete clients (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can bulk delete
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 });
    }

    const { clientIds } = await request.json();

    if (!clientIds || !Array.isArray(clientIds) || clientIds.length === 0) {
      return NextResponse.json({ error: 'No client IDs provided' }, { status: 400 });
    }

    await connectDB();

    // Only delete clients (not admins or employees)
    const clientsToDelete = await User.find({
      _id: { $in: clientIds },
      role: 'client',
    });

    if (clientsToDelete.length === 0) {
      return NextResponse.json({ error: 'No valid clients found to delete' }, { status: 404 });
    }

    const idsToDelete = clientsToDelete.map(c => c._id);

    // Delete associated quotes and quote responses
    const quotesToDelete = await Quote.find({ client: { $in: idsToDelete } });
    const quoteIds = quotesToDelete.map(q => q._id);
    
    await QuoteResponse.deleteMany({ quote: { $in: quoteIds } });
    await Quote.deleteMany({ client: { $in: idsToDelete } });
    
    // Delete the clients
    const result = await User.deleteMany({
      _id: { $in: idsToDelete },
      role: 'client',
    });

    return NextResponse.json({
      message: `Successfully deleted ${result.deletedCount} client(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json({ error: 'Failed to delete clients' }, { status: 500 });
  }
}

