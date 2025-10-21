'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { rims } from '@/lib/rimData';

export const ProductVisualizer: React.FC = () => {
  const { t } = useTranslation();
  const [selectedRim, setSelectedRim] = useState(rims[0]);

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
              <div className="relative w-full h-96 mb-6">
                <Image
                  src="/images/hero.png"
                  alt="Car with selected rim"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedRim.name}</h3>
                <p className="text-gray-400 mb-4">{selectedRim.description}</p>
                <div className="flex justify-center gap-4 text-sm">
                  <span className="text-white">
                    <strong>Size:</strong> {selectedRim.size}
                  </span>
                  <span className="text-white">
                    <strong>Color:</strong> {selectedRim.color}
                  </span>
                  <span className="text-white">
                    <strong>Price:</strong> {selectedRim.price}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rim Selection */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Available Rims</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rims.map((rim) => (
                  <button
                    key={rim.id}
                    onClick={() => setSelectedRim(rim)}
                    className={`w-full p-4 rounded-lg transition-all duration-300 text-left ${
                      selectedRim.id === rim.id
                        ? 'bg-white text-black border-2 border-white'
                        : 'bg-gray-700 text-white border-2 border-transparent hover:border-white/50'
                    }`}
                  >
                    <div className="font-semibold">{rim.name}</div>
                    <div className="text-sm opacity-75">{rim.size} • {rim.color}</div>
                    <div className="text-sm font-bold mt-1">{rim.price}</div>
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
      </div>
    </section>
  );
};

