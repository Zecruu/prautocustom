'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';

interface ShowcaseImage {
  src: string;
  alt: string;
  title: string;
  description: string;
}

const showcaseImages: ShowcaseImage[] = [
  {
    src: '/images/porsche-macan-custom-wheels-pr-auto.jpg',
    alt: 'Porsche Macan with Custom Wheels in Carolina PR',
    title: 'Porsche Macan',
    description: 'Custom multi-spoke wheels with premium finish',
  },
  {
    src: '/images/porsche-boxster-custom-wheels-orange.jpg',
    alt: 'Orange Porsche Boxster Custom Wheel Installation',
    title: 'Porsche Boxster',
    description: 'High-performance rims with yellow brake calipers',
  },
  {
    src: '/images/red-mercedes-custom-wheels-carolina-pr.jpg',
    alt: 'Red Mercedes C-Class Custom Wheels Puerto Rico',
    title: 'Mercedes-Benz C-Class',
    description: 'Elegant multi-spoke design with perfect fitment',
  },
  {
    src: '/images/custom-luxury-sedan-wheels-puerto-rico.jpg',
    alt: 'Luxury Sedan Custom Wheel Installation PR',
    title: 'Luxury Sedan Build',
    description: 'Premium aftermarket wheels and suspension',
  },
  {
    src: '/images/black-sport-rims-custom-installation.jpg',
    alt: 'Black Sport Rims Custom Installation Carolina',
    title: 'Sport Package',
    description: 'Aggressive stance with black performance wheels',
  },
  {
    src: '/images/performance-wheels-custom-fitment.jpg',
    alt: 'Performance Wheels Custom Fitment Puerto Rico',
    title: 'Performance Upgrade',
    description: 'Track-ready wheels with custom offset',
  },
  {
    src: '/images/luxury-suv-aftermarket-wheels-pr.jpg',
    alt: 'Luxury SUV Aftermarket Wheels PR Auto Custom',
    title: 'Luxury SUV',
    description: 'Bold design with premium wheel finish',
  },
  {
    src: '/images/custom-sport-wheels-installation-puerto-rico.jpg',
    alt: 'Custom Sport Wheels Installation Puerto Rico',
    title: 'Sport Sedan',
    description: 'Lowered stance with custom wheel package',
  },
  {
    src: '/images/premium-car-wheels-pr-auto-custom.jpg',
    alt: 'Premium Car Wheels PR Auto Custom Carolina',
    title: 'Premium Build',
    description: 'Complete wheel and tire package installation',
  },
];

export const WorkShowcase: React.FC = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<ShowcaseImage | null>(null);

  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-500 to-white">
            {t('showcase.title', 'Our Work')}
          </h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            {t('showcase.subtitle', 'Premium custom wheel installations showcasing our expertise in fitment, style, and performance. Each build is a masterpiece.')}
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {showcaseImages.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-zinc-900 cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/20"
              onClick={() => setSelectedImage(image)}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Hover Effect - Yellow Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors duration-300">
                  {image.title}
                </h3>
                <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  {image.description}
                </p>
              </div>

              {/* Corner Accent */}
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl p-12 text-center border border-zinc-700 shadow-2xl">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('showcase.cta.title', 'Ready to Transform Your Ride?')}
          </h3>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            {t('showcase.cta.subtitle', 'Let our experts help you find the perfect wheels for your vehicle. Premium brands, expert installation, guaranteed satisfaction.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50"
            >
              {t('showcase.cta.viewProducts', 'View Products')}
            </Link>
            <Link
              href="/checkout"
              className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {t('showcase.cta.requestQuote', 'Request a Quote')}
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-500 mb-2">500+</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">{t('showcase.stats.installations', 'Installations')}</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-500 mb-2">50+</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">{t('showcase.stats.brands', 'Premium Brands')}</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-500 mb-2">10+</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">{t('showcase.stats.experience', 'Years Experience')}</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-500 mb-2">100%</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">{t('showcase.stats.satisfaction', 'Satisfaction')}</div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-yellow-500 transition-colors"
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="max-w-5xl w-full">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
              />
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-3xl font-bold text-white mb-2">{selectedImage.title}</h3>
              <p className="text-gray-400 text-lg">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

