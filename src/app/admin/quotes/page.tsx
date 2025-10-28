import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Quote from '@/models/Quote';
import Link from 'next/link';

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
  const quotes = quotesRaw as unknown as Array<{
    _id: unknown;
    client: { name: string; email: string; phone?: string } | null;
    products: Array<{
      product: { name: { en: string; es: string }; sku: string } | null;
      quantity: number;
      notes?: string;
    }>;
    status: string;
    message?: string;
    assignedTo?: { name: string } | null;
    createdAt: Date;
    expiresAt: Date;
  }>;

  // Filter by status
  const pendingQuotes = quotes.filter((q) => q.status === 'pending');
  const respondedQuotes = quotes.filter((q) => q.status === 'responded');
  const allQuotes = quotes;

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Quote Requests</h1>
        <p className="text-gray-400">Manage and respond to customer quote requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Pending Quotes</p>
          <p className="text-3xl font-bold text-yellow-500">{pendingQuotes.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Responded</p>
          <p className="text-3xl font-bold text-green-500">{respondedQuotes.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Total Quotes</p>
          <p className="text-3xl font-bold text-white">{allQuotes.length}</p>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-white">All Quote Requests</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm">
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden xl:table-cell">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {allQuotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No quote requests yet
                  </td>
                </tr>
              ) : (
                allQuotes.map((quote) => (
                  <tr key={String(quote._id)} className="hover:bg-zinc-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {quote.client?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-300">{quote.client?.email || 'N/A'}</div>
                      {quote.client?.phone && (
                        <div className="text-sm text-gray-400">{quote.client.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">
                        {quote.products.length} product(s)
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {quote.products
                          .slice(0, 2)
                          .map((p) => p.product?.name.en || 'Unknown')
                          .join(', ')}
                        {quote.products.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm text-gray-300">
                        {quote.assignedTo?.name || (
                          <span className="text-gray-500 italic">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden xl:table-cell">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/quotes/${String(quote._id)}`}
                        className="text-yellow-500 hover:text-yellow-400 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

