'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <Image
        src="/images/hero.png"
        alt="PR Auto Custom Hero"
        fill
        className="object-cover absolute inset-0 -z-10"
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 -z-10" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          {t('hero.title')}
        </h1>
        <p className="text-xl sm:text-2xl text-gray-200 mb-8 drop-shadow-md">
          {t('hero.subtitle')}
        </p>

        {/* CTA Button */}
        <Link
          href="/visualizer"
          className="inline-block px-8 py-4 bg-gradient-to-r from-white to-gray-200 text-black font-bold rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          {t('hero.cta')}
        </Link>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

