import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Quote from '@/models/Quote';
import QuotesTable from '@/components/admin/QuotesTable';

export const dynamic = 'force-dynamic';

export default async function QuotesPage() {
  await getServerSession(authOptions);
  await connectDB();

  // Fetch all quotes with populated client and product data
  const quotesRaw = await Quote.find()
    .populate('client', 'name email phone')
    .populate('products.product', 'name sku')
    .populate('assignedTo', 'name')
    .sort({ createdAt: -1 })
    .lean();

  // Type-safe quotes
  const quotes = quotesRaw.map((q) => ({
    _id: String(q._id),
    client: q.client as unknown as { name: string; email: string; phone?: string } | null,
    products: q.products as unknown as Array<{
      product: { name: { en: string; es: string }; sku: string } | null;
      quantity: number;
      notes?: string;
    }>,
    status: q.status as string,
    message: q.message as string | undefined,
    shippingAddress: q.shippingAddress as { address?: string; city?: string; state?: string; zipCode?: string } | undefined,
    assignedTo: q.assignedTo as unknown as { name: string } | null | undefined,
    createdAt: q.createdAt.toISOString(),
    expiresAt: q.expiresAt?.toISOString() || '',
  }));

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Quote Requests</h1>
        <p className="text-gray-400">Manage and respond to customer quote requests</p>
      </div>

      <QuotesTable quotes={quotes} />
    </div>
  );
}

