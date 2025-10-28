import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import QuoteResponse from '@/models/QuoteResponse';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function InformedPage() {
  await getServerSession(authOptions);
  await connectDB();

  // Fetch all quote responses (informed clients)
  const responsesRaw = await QuoteResponse.find()
    .populate({
      path: 'quote',
      populate: {
        path: 'client',
        select: 'name email phone',
      },
    })
    .populate('respondedBy', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  // Type-safe responses
  const responses = responsesRaw as unknown as Array<{
    _id: unknown;
    quote: {
      _id: unknown;
      client: { name: string; email: string; phone?: string } | null;
    } | null;
    respondedBy: { name: string; email: string } | null;
    total: number;
    status: string;
    validUntil: Date;
    createdAt: Date;
  }>;

  // Filter by status
  const sentResponses = responses.filter((r) => r.status === 'sent');
  const viewedResponses = responses.filter((r) => r.status === 'viewed');
  const acceptedResponses = responses.filter((r) => r.status === 'accepted');

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Informed Clients</h1>
        <p className="text-gray-400">Track clients who have received quote responses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Total Informed</p>
          <p className="text-3xl font-bold text-white">{responses.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Sent</p>
          <p className="text-3xl font-bold text-blue-500">{sentResponses.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Viewed</p>
          <p className="text-3xl font-bold text-purple-500">{viewedResponses.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Accepted</p>
          <p className="text-3xl font-bold text-green-500">{acceptedResponses.length}</p>
        </div>
      </div>

      {/* Informed Clients Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-white">All Quote Responses</h2>
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
                  Responded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Quote Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden xl:table-cell">
                  Date Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden xl:table-cell">
                  Valid Until
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {responses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                    No quote responses sent yet
                  </td>
                </tr>
              ) : (
                responses.map((response) => (
                  <tr key={String(response._id)} className="hover:bg-zinc-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {response.quote?.client?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-300">
                        {response.quote?.client?.email || 'N/A'}
                      </div>
                      {response.quote?.client?.phone && (
                        <div className="text-sm text-gray-400">{response.quote.client.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {response.respondedBy?.name || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">{response.respondedBy?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="text-sm font-medium text-green-500">
                        ${response.total.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden xl:table-cell">
                      {new Date(response.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden xl:table-cell">
                      {new Date(response.validUntil).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/quotes/${String(response.quote?._id)}`}
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

