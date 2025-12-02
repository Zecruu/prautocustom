import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Quote from '@/models/Quote';
import QuoteResponse from '@/models/QuoteResponse';
import Product from '@/models/Product'; // Required for populate to work
import User from '@/models/User'; // Required for populate to work
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import QuoteResponseForm from '@/components/admin/QuoteResponseForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuoteDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  await connectDB();

  // Fetch quote with populated data
  const quoteRaw = await Quote.findById(id)
    .populate('client', 'name email phone')
    .populate('products.product', 'name sku images')
    .populate('assignedTo', 'name email')
    .lean();

  if (!quoteRaw) {
    notFound();
  }

  // Type-safe quote
  const quote = quoteRaw as unknown as {
    _id: unknown;
    client: { name: string; email: string; phone?: string } | null;
    products: Array<{
      product: {
        _id: unknown;
        name: { en: string; es: string };
        sku: string;
        images: string[];
      } | null;
      quantity: number;
      notes?: string;
    }>;
    status: string;
    message?: string;
    shippingAddress?: {
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    assignedTo?: { name: string; email: string } | null;
    createdAt: Date;
    expiresAt: Date;
  };

  // Fetch existing responses
  const responsesRaw = await QuoteResponse.find({ quote: id })
    .populate('respondedBy', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  const responses = responsesRaw as unknown as Array<{
    _id: unknown;
    respondedBy: { name: string; email: string } | null;
    products: Array<{
      product: unknown;
      unitPrice: number;
      quantity: number;
      notes?: string;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    notes?: string;
    status: string;
    validUntil: Date;
    createdAt: Date;
  }>;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/quotes"
          className="text-yellow-500 hover:text-yellow-400 text-sm mb-2 inline-block"
        >
          ← Back to Quotes
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Quote Request Details</h1>
        <p className="text-gray-400">Review and respond to quote request</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Client Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Name</p>
                <p className="text-white font-medium">{quote.client?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="text-white">{quote.client?.email || 'N/A'}</p>
              </div>
              {quote.client?.phone && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Phone</p>
                  <p className="text-white">{quote.client.phone}</p>
                </div>
              )}
            </div>
            
            {/* Shipping Address */}
            {quote.shippingAddress && (quote.shippingAddress.address || quote.shippingAddress.city || quote.shippingAddress.state || quote.shippingAddress.zipCode) && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-gray-400 text-sm mb-2">Shipping Address</p>
                <div className="text-white space-y-1">
                  {quote.shippingAddress.address && <p>{quote.shippingAddress.address}</p>}
                  {(quote.shippingAddress.city || quote.shippingAddress.state || quote.shippingAddress.zipCode) && (
                    <p>
                      {[quote.shippingAddress.city, quote.shippingAddress.state, quote.shippingAddress.zipCode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Message */}
            {quote.message && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-gray-400 text-sm mb-1">Message</p>
                <p className="text-white whitespace-pre-wrap">{quote.message}</p>
              </div>
            )}
          </div>

          {/* Requested Products */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Requested Products</h2>
            <div className="space-y-4">
              {quote.products.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
                >
                  {item.product?.images?.[0] && (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name.en}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-white font-medium">
                      {item.product?.name.en || 'Unknown Product'}
                    </h3>
                    <p className="text-gray-400 text-sm">SKU: {item.product?.sku || 'N/A'}</p>
                    <p className="text-gray-300 text-sm mt-1">Quantity: {item.quantity}</p>
                    {item.notes && (
                      <p className="text-gray-400 text-sm mt-2 italic">{item.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Form */}
          {quote.status === 'pending' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Send Quote Response</h2>
              <QuoteResponseForm
                quoteId={String(quote._id)}
                products={quote.products.map((p) => ({
                  productId: String(p.product?._id),
                  name: p.product?.name.en || 'Unknown',
                  sku: p.product?.sku || 'N/A',
                  quantity: p.quantity,
                }))}
                employeeId={session?.user?.id || ''}
                employeeName={session?.user?.name || ''}
              />
            </div>
          )}

          {/* Previous Responses */}
          {responses.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Response History</h2>
              <div className="space-y-4">
                {responses.map((response) => (
                  <div
                    key={String(response._id)}
                    className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-medium">
                          {response.respondedBy?.name || 'Unknown'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {new Date(response.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          response.status === 'sent'
                            ? 'bg-blue-500/10 text-blue-500'
                            : response.status === 'viewed'
                            ? 'bg-purple-500/10 text-purple-500'
                            : response.status === 'accepted'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {response.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-gray-400 text-xs">Subtotal</p>
                        <p className="text-white font-medium">${response.subtotal.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Tax</p>
                        <p className="text-white font-medium">${response.tax.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Total</p>
                        <p className="text-green-500 font-bold">${response.total.toFixed(2)}</p>
                      </div>
                    </div>
                    {response.notes && (
                      <p className="text-gray-300 text-sm mt-2">{response.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quote Status</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm mb-1">Current Status</p>
                <span
                  className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                    quote.status === 'pending'
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : quote.status === 'responded'
                      ? 'bg-green-500/10 text-green-500'
                      : quote.status === 'accepted'
                      ? 'bg-blue-500/10 text-blue-500'
                      : quote.status === 'rejected'
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-gray-500/10 text-gray-500'
                  }`}
                >
                  {quote.status}
                </span>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Created</p>
                <p className="text-white">{new Date(quote.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Expires</p>
                <p className="text-white">{new Date(quote.expiresAt).toLocaleDateString()}</p>
              </div>
              {quote.assignedTo && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Assigned To</p>
                  <p className="text-white">{quote.assignedTo.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

