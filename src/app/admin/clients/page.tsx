import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Quote from '@/models/Quote';
import ClientsTable from '@/components/admin/ClientsTable';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  await getServerSession(authOptions);
  await connectDB();

  // Fetch all clients
  const clientsRaw = await User.find({ role: 'client' })
    .sort({ createdAt: -1 })
    .lean();

  // Type-safe clients
  const clients = clientsRaw as unknown as Array<{
    _id: unknown;
    name: string;
    email: string;
    phone?: string;
    createdAt: Date;
  }>;

  // Get quote counts for each client
  const clientQuoteCounts = await Promise.all(
    clients.map(async (client) => {
      const quoteCount = await Quote.countDocuments({ client: client._id });
      return {
        _id: String(client._id),
        name: client.name,
        email: client.email,
        phone: client.phone,
        createdAt: client.createdAt.toISOString(),
        quoteCount,
      };
    })
  );

  // Count suspected bots (gibberish names with no quotes)
  const suspectedBotCount = clientQuoteCounts.filter(c => {
    const name = c.name.trim();
    const consonantPattern = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/;
    const uppercasePattern = /[A-Z]{4,}/;
    const mixedCaseCount = (name.match(/[a-z][A-Z]/g) || []).length;
    const vowelCount = (name.match(/[aeiouAEIOU]/g) || []).length;
    const letterCount = (name.match(/[a-zA-Z]/g) || []).length;

    const isSuspicious =
      consonantPattern.test(name) ||
      uppercasePattern.test(name) ||
      mixedCaseCount > 3 ||
      (letterCount > 5 && vowelCount / letterCount < 0.15);

    return isSuspicious && c.quoteCount === 0;
  }).length;

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
        <p className="text-gray-400">Manage all registered clients</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Total Clients</p>
          <p className="text-3xl font-bold text-white">{clients.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Active Clients</p>
          <p className="text-3xl font-bold text-green-500">
            {clientQuoteCounts.filter((c) => c.quoteCount > 0).length}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">New This Month</p>
          <p className="text-3xl font-bold text-blue-500">
            {
              clients.filter((c) => {
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return new Date(c.createdAt) > monthAgo;
              }).length
            }
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-1">Suspected Bots</p>
          <p className="text-3xl font-bold text-red-500">{suspectedBotCount}</p>
        </div>
      </div>

      {/* Clients Table with Bot Detection */}
      <ClientsTable clients={clientQuoteCounts} />
    </div>
  );
}

