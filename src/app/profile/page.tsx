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
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentLang = i18n.language as 'en' | 'es';

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quoteResponses, setQuoteResponses] = useState<QuoteResponse[]>([]);
  const [loading, setLoading] = useState(true);

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
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            isExpired ? 'bg-red-500/20 text-red-400' :
                            quote.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            quote.status === 'responded' ? 'bg-blue-500/20 text-blue-400' :
                            quote.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {isExpired ? 'Expired' : quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                          </span>
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

