'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';

export default function Profile() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center pt-20">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10">
            <h1 className="text-4xl font-bold text-white mb-8">{t('profile.myProfile')}</h1>

            {/* User Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400">Email</label>
                  <p className="text-white text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="text-gray-400">User ID</label>
                  <p className="text-white text-lg font-mono text-sm">{user.uid}</p>
                </div>
                <div>
                  <label className="text-gray-400">Account Created</label>
                  <p className="text-white text-lg">
                    {user.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quotes Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">{t('profile.myQuotes')}</h2>
              <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                <p className="text-gray-400">No quotes yet. Start customizing rims to request a quote!</p>
              </div>
            </div>

            {/* Settings Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">{t('profile.settings')}</h2>
              <div className="space-y-4">
                <button className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300">
                  {t('profile.editProfile')}
                </button>
                <button className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

