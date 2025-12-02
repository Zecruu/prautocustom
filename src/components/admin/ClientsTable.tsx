'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  quoteCount: number;
}

interface ClientsTableProps {
  clients: Client[];
}

// Check if name looks like bot-generated gibberish
function isSuspiciousName(name: string): boolean {
  const cleanName = name.trim();
  if (cleanName.length < 2) return true;
  
  // Too many consecutive consonants
  const consonantPattern = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/;
  if (consonantPattern.test(cleanName)) return true;
  
  // Too many uppercase letters in a row
  const uppercasePattern = /[A-Z]{4,}/;
  if (uppercasePattern.test(cleanName)) return true;
  
  // Mixed case gibberish
  const mixedCaseCount = (cleanName.match(/[a-z][A-Z]/g) || []).length;
  if (mixedCaseCount > 3) return true;
  
  // No vowels in long names
  const vowelCount = (cleanName.match(/[aeiouAEIOU]/g) || []).length;
  const letterCount = (cleanName.match(/[a-zA-Z]/g) || []).length;
  if (letterCount > 5 && vowelCount / letterCount < 0.15) return true;
  
  return false;
}

export default function ClientsTable({ clients }: ClientsTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyBots, setShowOnlyBots] = useState(false);

  const suspectedBots = useMemo(() => {
    return clients.filter(c => isSuspiciousName(c.name) && c.quoteCount === 0);
  }, [clients]);

  const filteredClients = useMemo(() => {
    let filtered = clients;
    
    if (showOnlyBots) {
      filtered = suspectedBots;
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [clients, suspectedBots, searchQuery, showOnlyBots]);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAllBots = () => {
    setSelectedIds(new Set(suspectedBots.map(c => c._id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} client(s)? This will also delete their quotes and cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/clients/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientIds: Array.from(selectedIds) }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        setSelectedIds(new Set());
        router.refresh();
      } else {
        alert(data.error || 'Failed to delete clients');
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('An error occurred while deleting clients');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Bot Detection Alert */}
      {suspectedBots.length > 0 && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-red-400 font-semibold">
                ⚠️ {suspectedBots.length} suspected bot account(s) detected
              </p>
              <p className="text-red-300/70 text-sm">
                Accounts with gibberish names and no quote requests
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowOnlyBots(!showOnlyBots)}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
              >
                {showOnlyBots ? 'Show All' : 'Show Bots Only'}
              </button>
              <button
                onClick={selectAllBots}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
              >
                Select All Bots
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Actions Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
          />
          {selectedIds.size > 0 && (
            <div className="flex gap-2">
              <span className="text-gray-400 py-2">{selectedIds.size} selected</span>
              <button
                onClick={clearSelection}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm"
              >
                Clear
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete Selected'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={filteredClients.length > 0 && filteredClients.every(c => selectedIds.has(c._id))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(new Set(filteredClients.map(c => c._id)));
                      } else {
                        setSelectedIds(new Set());
                      }
                    }}
                    className="rounded border-zinc-600 bg-zinc-700"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden md:table-cell">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden lg:table-cell">Quotes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase hidden xl:table-cell">Registered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No clients found
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const isSuspicious = isSuspiciousName(client.name) && client.quoteCount === 0;
                  return (
                    <tr
                      key={client._id}
                      className={`hover:bg-zinc-800/50 ${isSuspicious ? 'bg-red-500/5' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(client._id)}
                          onChange={() => toggleSelect(client._id)}
                          className="rounded border-zinc-600 bg-zinc-700"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center text-black font-bold ${isSuspicious ? 'bg-red-500' : 'bg-yellow-500'}`}>
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{client.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{client.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-300 hidden md:table-cell">{client.phone || 'N/A'}</td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        {client.quoteCount > 0 ? (
                          <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-medium">
                            {client.quoteCount}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 hidden xl:table-cell">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {isSuspicious ? (
                          <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-medium">
                            Suspected Bot
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium">
                            Verified
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

