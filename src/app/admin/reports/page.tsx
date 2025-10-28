import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Quote from '@/models/Quote';
import User from '@/models/User';
import Product from '@/models/Product';
import QuoteResponse from '@/models/QuoteResponse';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  // Only admins can access reports
  if (!session || session.user.role !== 'admin') {
    redirect('/admin/dashboard');
  }

  await connectDB();

  // Get date ranges
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Quote Statistics
  const totalQuotes = await Quote.countDocuments();
  const pendingQuotes = await Quote.countDocuments({ status: 'pending' });
  const respondedQuotes = await Quote.countDocuments({ status: 'responded' });
  const acceptedQuotes = await Quote.countDocuments({ status: 'accepted' });
  const rejectedQuotes = await Quote.countDocuments({ status: 'rejected' });
  
  const quotesLast30Days = await Quote.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });
  
  const quotesLast7Days = await Quote.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  // Client Statistics
  const totalClients = await User.countDocuments({ role: 'client' });
  const newClientsLast30Days = await User.countDocuments({
    role: 'client',
    createdAt: { $gte: thirtyDaysAgo },
  });

  // Product Statistics
  const totalProducts = await Product.countDocuments();
  const activeProducts = await Product.countDocuments({ status: 'active' });
  const inactiveProducts = await Product.countDocuments({ status: 'inactive' });

  // Response Statistics
  const totalResponses = await QuoteResponse.countDocuments();
  const responsesLast30Days = await QuoteResponse.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // Calculate conversion rate
  const conversionRate = totalQuotes > 0 ? ((acceptedQuotes / totalQuotes) * 100).toFixed(1) : '0.0';
  const responseRate = totalQuotes > 0 ? ((respondedQuotes / totalQuotes) * 100).toFixed(1) : '0.0';

  // Get most requested products
  const mostRequestedProducts = await Quote.aggregate([
    { $unwind: '$products' },
    {
      $group: {
        _id: '$products.product',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productInfo',
      },
    },
    { $unwind: '$productInfo' },
  ]);

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
        <p className="text-gray-400">Comprehensive business insights and statistics</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Quotes</h3>
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{totalQuotes}</p>
          <p className="text-sm text-gray-400">
            <span className="text-green-500">+{quotesLast7Days}</span> this week
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Clients</h3>
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{totalClients}</p>
          <p className="text-sm text-gray-400">
            <span className="text-green-500">+{newClientsLast30Days}</span> this month
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Conversion Rate</h3>
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{conversionRate}%</p>
          <p className="text-sm text-gray-400">{acceptedQuotes} accepted quotes</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Response Rate</h3>
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{responseRate}%</p>
          <p className="text-sm text-gray-400">{respondedQuotes} responded quotes</p>
        </div>
      </div>

      {/* Quote Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Quote Status Breakdown</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Pending</span>
                <span className="text-white font-semibold">{pendingQuotes}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${totalQuotes > 0 ? (pendingQuotes / totalQuotes) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Responded</span>
                <span className="text-white font-semibold">{respondedQuotes}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${totalQuotes > 0 ? (respondedQuotes / totalQuotes) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Accepted</span>
                <span className="text-white font-semibold">{acceptedQuotes}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${totalQuotes > 0 ? (acceptedQuotes / totalQuotes) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Rejected</span>
                <span className="text-white font-semibold">{rejectedQuotes}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${totalQuotes > 0 ? (rejectedQuotes / totalQuotes) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Product Statistics</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-white">{totalProducts}</p>
              </div>
              <div className="w-16 h-16 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Active</p>
                <p className="text-xl font-bold text-green-500">{activeProducts}</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Inactive</p>
                <p className="text-xl font-bold text-gray-500">{inactiveProducts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Most Requested Products */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Most Requested Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Product</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">SKU</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Requests</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Popularity</th>
              </tr>
            </thead>
            <tbody>
              {mostRequestedProducts.length > 0 ? (
                mostRequestedProducts.map((item, index) => (
                  <tr key={index} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                    <td className="py-3 px-4 text-white">{item.productInfo.name?.en || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-400">{item.productInfo.sku}</td>
                    <td className="py-3 px-4 text-white font-semibold">{item.count}</td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{
                            width: `${
                              mostRequestedProducts.length > 0
                                ? (item.count / mostRequestedProducts[0].count) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    No product data available yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

