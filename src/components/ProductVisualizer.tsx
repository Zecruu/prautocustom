'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { rims } from '@/lib/rimData';

export const ProductVisualizer: React.FC = () => {
  const { t } = useTranslation();
  const [selectedRim, setSelectedRim] = useState(rims[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRimChange = (rim: typeof rims[0]) => {
    setIsLoading(true);
    setSelectedRim(rim);
    // Simulate image loading delay for smooth transition
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4">
          {t('visualizer.title')}
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          {t('visualizer.selectRim')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10 h-full flex flex-col items-center justify-center min-h-96">
              <div className="relative w-full aspect-square mb-6">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  </div>
                )}
                <Image
                  src={selectedRim.image}
                  alt={selectedRim.name}
                  fill
                  className={`object-contain p-8 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                  priority
                />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedRim.name}
                </h3>
                <p className="text-gray-400 mb-4">
                  {selectedRim.description}
                </p>
                <div className="flex justify-center gap-4 text-sm flex-wrap">
                  <span className="px-4 py-2 bg-gray-700 rounded-full text-white">
                    <strong>{t('visualizer.style')}:</strong> {selectedRim.style}
                  </span>
                  <span className="px-4 py-2 bg-gray-700 rounded-full text-white">
                    <strong>{t('visualizer.color')}:</strong> {selectedRim.color}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rim Selection */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">{t('visualizer.availableRims')}</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rims.map((rim) => (
                  <button
                    key={rim.id}
                    onClick={() => handleRimChange(rim)}
                    className={`w-full p-3 rounded-lg transition-all duration-300 text-left flex items-center gap-3 ${
                      selectedRim.id === rim.id
                        ? 'bg-white text-black border-2 border-white'
                        : 'bg-gray-700 text-white border-2 border-transparent hover:border-white/50'
                    }`}
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-600">
                      <Image
                        src={rim.image}
                        alt={rim.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{rim.name}</div>
                      <div className="text-sm opacity-75">{rim.color}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Request Quote Button */}
              <Link
                href={`/quote?rim=${selectedRim.id}`}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-white to-gray-200 text-black font-bold rounded-lg hover:shadow-lg transition-all duration-300 text-center block"
              >
                {t('visualizer.requestQuote')}
              </Link>
            </div>
          </div>
        </div>

        {/* View More Products Button */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-block px-8 py-4 bg-gradient-to-r from-white to-gray-200 text-black font-bold rounded-lg hover:shadow-lg transition-all duration-300"
          >
            {t('visualizer.viewMoreProducts')}
          </Link>
        </div>
      </div>
    </section>
  );
};

