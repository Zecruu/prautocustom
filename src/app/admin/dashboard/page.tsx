import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Quote from '@/models/Quote';
import Product from '@/models/Product';
import User from '@/models/User';
import QuoteResponse from '@/models/QuoteResponse';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  await connectDB();

  // Fetch dashboard statistics
  const [
    , // totalQuotes - not used yet
    pendingQuotes,
    , // totalProducts - not used yet
    activeProducts,
    totalClients,
    respondedQuotes,
  ] = await Promise.all([
    Quote.countDocuments(),
    Quote.countDocuments({ status: 'pending' }),
    Product.countDocuments(),
    Product.countDocuments({ status: 'active' }),
    User.countDocuments({ role: 'client' }),
    QuoteResponse.countDocuments(),
  ]);

  // Get recent quotes
  const recentQuotesRaw = await Quote.find()
    .populate('client', 'name email')
    .populate('products.product', 'name sku')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Type-safe quotes with populated client
  const recentQuotes = recentQuotesRaw as unknown as Array<{
    _id: unknown;
    client: { name: string; email: string } | null;
    products: Array<{ product: unknown; quantity: number }>;
    status: string;
    createdAt: Date;
  }>;

  const stats = [
    {
      name: 'Active Quote Requests',
      value: pendingQuotes,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-yellow-500',
    },
    {
      name: 'Total Products',
      value: activeProducts,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      name: 'Registered Clients',
      value: totalClients,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      name: 'Quotes Responded',
      value: respondedQuotes,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {session?.user.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">{stat.name}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Quotes */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">Recent Quote Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {recentQuotes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No quote requests yet
                  </td>
                </tr>
              ) : (
                recentQuotes.map((quote) => (
                  <tr key={String(quote._id)} className="hover:bg-zinc-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {quote.client?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-400 hidden sm:block">
                          {quote.client?.email || ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-300">
                        {quote.products?.length || 0} product(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          quote.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : quote.status === 'responded'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-gray-500/10 text-gray-500'
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden lg:table-cell">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a
                        href={`/admin/quotes/${String(quote._id)}`}
                        className="text-yellow-500 hover:text-yellow-400"
                      >
                        View
                      </a>
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

