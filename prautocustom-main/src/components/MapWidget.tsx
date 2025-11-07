'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export const MapWidget: React.FC = () => {
  const address = 'carr 190 rr2 box 327 carolina pr 00986-0327, Carolina, 00983 Carolina, Puerto Rico';
  const encodedAddress = encodeURIComponent(address);
  
  // Google Maps URL with directions
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  
  // Embed URL for the map
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}&zoom=15`;

  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-b from-gray-900 to-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('map.title')}
          </h2>
          <p className="text-gray-400 text-lg">
            {t('map.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Map Embed */}
          <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          {/* Location Info */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">{t('map.addressTitle')}</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-white mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-white font-medium">{t('map.addressLine1')}</p>
                  <p className="text-gray-400">{t('map.addressLine2')}</p>
                  <p className="text-gray-400">{t('map.addressLine3')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-white mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-white font-medium">{t('map.phone')}</p>
                  <p className="text-gray-400">{t('map.phoneNote')}</p>
                </div>
              </div>
            </div>

            {/* Get Directions Button */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-white to-gray-200 text-black font-bold rounded-lg hover:shadow-lg transition-all duration-300" aria-label={t('map.openMaps')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {t('map.getDirections')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

