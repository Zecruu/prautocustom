'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Quote {
  _id: string;
  client: { name: string; email: string; phone?: string } | null;
  products: Array<{
    product: { name: { en: string; es: string }; sku: string } | null;
    quantity: number;
    notes?: string;
  }>;
  status: string;
  message?: string;
  assignedTo?: { name: string } | null;
  createdAt: string;
  expiresAt: string;
}

interface QuotesTableProps {
  quotes: Quote[];
}

export default function QuotesTable({ quotes }: QuotesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter and search quotes
  const filteredQuotes = useMemo(() => {
    let filtered = quotes;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }

    // Search by client name, email, or product
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((q) => {
        const clientName = q.client?.name?.toLowerCase() || '';
        const clientEmail = q.client?.email?.toLowerCase() || '';
        const productNames = q.products
          .map((p) => p.product?.name?.en?.toLowerCase() || '')
          .join(' ');

        return (
          clientName.includes(query) ||
          clientEmail.includes(query) ||
          productNames.includes(query)
        );
      });
    }

    return filtered;
  }, [quotes, searchQuery, statusFilter]);

  // Calculate stats
  const pendingCount = quotes.filter((q) => q.status === 'pending').length;
  const respondedCount = quotes.filter((q) => q.status === 'responded').length;

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Quotes</p>
              <p className="text-3xl font-bold text-yellow-500 mt-2">{pendingCount}</p>
            </div>
            <div className="bg-yellow-500/10 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-yellow-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Responded</p>
              <p className="text-3xl font-bold text-green-500 mt-2">{respondedCount}</p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Quotes</p>
              <p className="text-3xl font-bold text-white mt-2">{quotes.length}</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by client name, email, or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-500 absolute left-3 top-2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="responded">Responded</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-400">
          Showing {filteredQuotes.length} of {quotes.length} quotes
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800 border-b border-zinc-700">
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
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No quotes found
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr key={quote._id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{quote.client?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-400">{quote.client?.email || 'N/A'}</p>
                        {quote.client?.phone && (
                          <p className="text-sm text-gray-500">{quote.client.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-300">
                        {quote.products.slice(0, 2).map((p, idx) => (
                          <div key={idx}>
                            {p.product?.name?.en || 'Unknown'} (x{p.quantity})
                          </div>
                        ))}
                        {quote.products.length > 2 && (
                          <div className="text-gray-500">
                            +{quote.products.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          quote.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : quote.status === 'responded'
                              ? 'bg-blue-500/10 text-blue-500'
                              : quote.status === 'accepted'
                                ? 'bg-green-500/10 text-green-500'
                                : quote.status === 'rejected'
                                  ? 'bg-red-500/10 text-red-500'
                                  : 'bg-gray-500/10 text-gray-500'
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 hidden lg:table-cell">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/quotes/${quote._id}`}
                        className="text-yellow-500 hover:text-yellow-400 font-medium text-sm"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

