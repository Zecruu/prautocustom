import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  // Only admins can access this page
  if (!session || session.user.role !== 'admin') {
    redirect('/admin/dashboard');
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure system settings and preferences</p>
      </div>

      {/* General Settings */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Company Name</label>
            <input
              type="text"
              defaultValue="PR Auto Custom"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Company Email</label>
            <input
              type="email"
              defaultValue="info@prautocustoms.com"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Company Phone</label>
            <input
              type="tel"
              defaultValue="+1 (787) 555-0100"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Company Address</label>
            <textarea
              rows={3}
              defaultValue="Puerto Rico"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            />
          </div>
        </div>
      </div>

      {/* Quote Settings */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Quote Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Default Tax Rate (%)</label>
            <input
              type="number"
              step="0.01"
              defaultValue="8.25"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Default tax rate applied to all quote responses
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Default Quote Validity (days)
            </label>
            <input
              type="number"
              defaultValue="15"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              How long quotes remain valid before expiring
            </p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Quote Request Expiration (days)
            </label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              How long before unanswered quote requests expire
            </p>
          </div>
        </div>
      </div>

      {/* Email Notifications */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Email Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">New Quote Requests</p>
              <p className="text-sm text-gray-400">
                Notify admins when a new quote request is submitted
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Quote Responses</p>
              <p className="text-sm text-gray-400">
                Notify clients when they receive a quote response
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">New Client Registrations</p>
              <p className="text-sm text-gray-400">Notify admins when a new client signs up</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Security Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Require 2FA for Admins</p>
              <p className="text-sm text-gray-400">
                Require two-factor authentication for admin accounts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
            </label>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              defaultValue="60"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Automatically log out users after this period of inactivity
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors">
          Cancel
        </button>
        <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors">
          Save Settings
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-blue-500 mt-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          <div>
            <p className="text-blue-400 text-sm font-medium mb-1">Settings Note</p>
            <p className="text-gray-400 text-sm">
              These settings are currently for display purposes. Backend integration for saving
              settings will be implemented in the next phase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

