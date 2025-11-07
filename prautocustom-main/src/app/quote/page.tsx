'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/Navbar';
import { getRimById, rims } from '@/lib/rimData';
import { sendQuoteEmail, initEmailJS } from '@/lib/emailjs';

function QuotePageContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const rimId = searchParams.get('rim');
  const selectedRim = rimId ? getRimById(rimId) : rims[0];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rimSelection: selectedRim?.name || '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    initEmailJS();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      setLoading(true);
      await sendQuoteEmail(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        rimSelection: selectedRim?.name || '',
        message: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const error = err as Error;
      setError(error.message || t('quote.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-20 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">{t('quote.title')}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10">
                {success && (
                  <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200">
                    {t('quote.success')}
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-white mb-2">{t('quote.name')}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">{t('quote.email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">{t('quote.phone')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">{t('quote.rimSelection')}</label>
                    <select
                      name="rimSelection"
                      value={formData.rimSelection}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-white"
                      required
                    >
                      {rims.map((rim) => (
                        <option key={rim.id} value={rim.name}>
                          {rim.name} - {rim.style} ({rim.color})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white mb-2">{t('quote.message')}</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white h-32"
                      placeholder="Tell us more about your needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-white to-gray-200 text-black font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : t('quote.submit')}
                  </button>
                </form>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/10 sticky top-32">
                <h3 className="text-xl font-bold text-white mb-4">Quote Summary</h3>
                {selectedRim && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Rim Selection</p>
                      <p className="text-white font-semibold">{selectedRim.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Style</p>
                      <p className="text-white font-semibold">{selectedRim.style}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Color</p>
                      <p className="text-white font-semibold">{selectedRim.color}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-600">
                      <p className="text-gray-400 text-sm">Description</p>
                      <p className="text-white text-sm">{selectedRim.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <QuotePageContent />
    </Suspense>
  );
}

