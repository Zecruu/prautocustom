'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import Image from 'next/image';

interface QuoteProduct {
  product: {
    _id: string;
    name: { en: string; es: string };
    sku: string;
    images: string[];
  };
  quantity: number;
  notes?: string;
}

interface Quote {
  _id: string;
  products: QuoteProduct[];
  status: 'pending' | 'responded' | 'accepted' | 'rejected' | 'expired';
  message?: string;
  createdAt: string;
  expiresAt?: string;
}

interface QuoteResponseProduct {
  product: {
    _id: string;
    name: { en: string; es: string };
    sku: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

interface QuoteResponse {
  _id: string;
  quote: string;
  products: QuoteResponseProduct[];
  subtotal: number;
  tax?: number;
  total: number;
  message?: string;
  validUntil: string;
  status: 'sent' | 'viewed' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const currentLang = i18n.language as 'en' | 'es';

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quoteResponses, setQuoteResponses] = useState<QuoteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Profile Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  
  // Change Password Modal States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // Cancel Quote States
  const [cancellingQuoteId, setCancellingQuoteId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchQuotes();
      fetchQuoteResponses();
    }
  }, [session]);

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/quotes');
      if (response.ok) {
        const data = await response.json();
        setQuotes(data.quotes || []);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch quotes:', errorData);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuoteResponses = async () => {
    try {
      const response = await fetch('/api/quote-responses');
      if (response.ok) {
        const data = await response.json();
        setQuoteResponses(data.responses || []);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch quote responses:', errorData);
      }
    } catch (error) {
      console.error('Error fetching quote responses:', error);
    }
  };

  // Open edit modal with current data
  const openEditModal = () => {
    setEditName(user.name || '');
    setEditPhone(''); // Phone not in session, will fetch if needed
    setEditError('');
    setShowEditModal(true);
  };

  // Handle edit profile
  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    setEditLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update session
        await update({ name: editName });
        setShowEditModal(false);
        alert('Profile updated successfully!');
      } else {
        setEditError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setEditError('An error occurred while updating profile');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess('');
        }, 2000);
      } else {
        setPasswordError(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('An error occurred while changing password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle cancel quote
  const handleCancelQuote = async (quoteId: string) => {
    if (!confirm('Are you sure you want to cancel this quote request? This action cannot be undone.')) {
      return;
    }

    setCancellingQuoteId(quoteId);

    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        // Remove the cancelled quote from the list
        setQuotes(quotes.filter(q => q._id !== quoteId));
        alert('Quote cancelled successfully!');
      } else {
        alert(data.error || 'Failed to cancel quote');
      }
    } catch (error) {
      console.error('Error cancelling quote:', error);
      alert('An error occurred while cancelling the quote');
    } finally {
      setCancellingQuoteId(null);
    }
  };

  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center pt-20">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;

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
                  <p className="text-white text-lg font-mono text-sm">{user.id}</p>
                </div>
                <div>
                  <label className="text-gray-400">Role</label>
                  <p className="text-white text-lg capitalize">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Quotes Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">{t('profile.myQuotes')}</h2>

              {loading ? (
                <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                  <p className="text-gray-400">Loading quotes...</p>
                </div>
              ) : quotes.length === 0 && quoteResponses.length === 0 ? (
                <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                  <p className="text-gray-400">No quotes yet. Start customizing rims to request a quote!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Pending Quotes */}
                  {quotes.map((quote) => {
                    const response = quoteResponses.find(r => r.quote === quote._id);
                    const isExpired = quote.expiresAt && new Date(quote.expiresAt) < new Date();

                    return (
                      <div key={quote._id} className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              Quote #{quote._id.slice(-8).toUpperCase()}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              Submitted: {new Date(quote.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              isExpired ? 'bg-red-500/20 text-red-400' :
                              quote.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              quote.status === 'responded' ? 'bg-blue-500/20 text-blue-400' :
                              quote.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {isExpired ? 'Expired' : quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                            </span>
                            {quote.status === 'pending' && (
                              <button
                                onClick={() => handleCancelQuote(quote._id)}
                                disabled={cancellingQuoteId === quote._id}
                                className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Cancel quote request"
                              >
                                {cancellingQuoteId === quote._id ? (
                                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Products */}
                        <div className="space-y-2 mb-4">
                          {quote.products.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-gray-800/50 rounded p-3">
                              {item.product?.images?.[0] && (
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name[currentLang]}
                                  width={60}
                                  height={60}
                                  className="rounded object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <p className="text-white font-semibold">
                                  {item.product?.name?.[currentLang] || 'Product'}
                                </p>
                                <p className="text-gray-400 text-sm">SKU: {item.product?.sku}</p>
                              </div>
                              <p className="text-white">Qty: {item.quantity}</p>
                            </div>
                          ))}
                        </div>

                        {/* Quote Response */}
                        {response && (
                          <div className="mt-4 pt-4 border-t border-gray-600">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="text-lg font-bold text-green-400">Quote Response</h4>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                new Date(response.validUntil) < new Date() ? 'bg-red-500/20 text-red-400' :
                                'bg-green-500/20 text-green-400'
                              }`}>
                                {new Date(response.validUntil) < new Date() ? 'Expired' :
                                 `Valid until ${new Date(response.validUntil).toLocaleDateString()}`}
                              </span>
                            </div>

                            {/* Response Products with Pricing */}
                            <div className="space-y-2 mb-4">
                              {response.products.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-800/50 rounded p-3">
                                  <div>
                                    <p className="text-white font-semibold">
                                      {item.product?.name?.[currentLang] || 'Product'}
                                    </p>
                                    <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-white font-semibold">
                                      ${item.totalPrice.toFixed(2)}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                      ${item.unitPrice.toFixed(2)} each
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-2 bg-gray-800/50 rounded p-4">
                              <div className="flex justify-between text-gray-300">
                                <span>Subtotal:</span>
                                <span>${response.subtotal.toFixed(2)}</span>
                              </div>
                              {response.tax !== undefined && response.tax > 0 && (
                                <div className="flex justify-between text-gray-300">
                                  <span>Tax:</span>
                                  <span>${response.tax.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-gray-600">
                                <span>Total:</span>
                                <span>${response.total.toFixed(2)}</span>
                              </div>
                            </div>

                            {response.message && (
                              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                                <p className="text-blue-300 text-sm">{response.message}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {quote.message && (
                          <div className="mt-4 p-3 bg-gray-800/50 rounded">
                            <p className="text-gray-300 text-sm">{quote.message}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Settings Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">{t('profile.settings')}</h2>
              <div className="space-y-4">
                <button 
                  onClick={openEditModal}
                  className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300">
                  {t('profile.editProfile')}
                </button>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
            <form onSubmit={handleEditProfile} className="space-y-4">
              {editError && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                  {editError}
                </div>
              )}
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black font-bold rounded-lg transition-colors"
                >
                  {editLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {passwordError && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded">
                  {passwordSuccess}
                </div>
              )}
              <div>
                <label className="block text-gray-300 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  required
                  minLength={6}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black font-bold rounded-lg transition-colors"
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

